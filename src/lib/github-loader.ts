import { GithubRepoLoader } from "@langchain/community/document_loaders/web/github";
import { Document } from "@langchain/core/documents";
import { generateEmbedding, summariseCode } from "./gemini";
import { db } from "~/server/db";

// Batch processing configuration
const BATCH_SIZE = 5; // Process 5 files at a time
const BATCH_DELAY = 10000; // 10 seconds between batches

async function processBatch<T>(
  items: T[],
  processor: (item: T) => Promise<any>,
) {
  const results = [];
  for (let i = 0; i < items.length; i++) {
    const item = items[i];
    if (!item) continue;

    try {
      const result = await processor(item);
      results.push(result);
      // Small delay between individual items
      await new Promise((resolve) => setTimeout(resolve, 2000));
    } catch (error) {
      if (error instanceof Error) {
        console.error(`Error processing item ${i + 1}:`, error.message);
      } else {
        console.error(`Error processing item ${i + 1}:`, String(error));
      }
      results.push(null);
    }
  }
  return results.filter((result) => result !== null);
}

async function processInBatches<T>(
  items: T[],
  batchSize: number,
  processor: (item: T) => Promise<any>,
) {
  const results = [];
  for (let i = 0; i < items.length; i += batchSize) {
    const batch = items.slice(i, i + batchSize);
    console.log(
      `\nProcessing batch ${Math.floor(i / batchSize) + 1} of ${Math.ceil(items.length / batchSize)}`,
    );

    const batchResults = await processBatch(batch, processor);
    results.push(...batchResults);

    // Add delay between batches if not the last batch
    if (i + batchSize < items.length) {
      console.log(`Waiting ${BATCH_DELAY / 1000} seconds before next batch...`);
      await new Promise((resolve) => setTimeout(resolve, BATCH_DELAY));
    }
  }
  return results;
}

export const loadGithubRepo = async (
  githubUrl: string,
  githubToken?: string,
) => {
  console.log(`Loading repository: ${githubUrl}`);
  const loader = new GithubRepoLoader(githubUrl, {
    accessToken: githubToken || "",
    branch: "main",
    ignoreFiles: [
      ".gitignore",
      "README.md",
      "CONTRIBUTING.md",
      "CODE_OF_CONDUCT.md",
      "LICENSE.md",
      "PULL_REQUEST_TEMPLATE.md",
      "ISSUE_TEMPLATE.md",
      "SECURITY.md",
      "FUNDING.yml",
      "SUPPORT.md",
      "CHANGELOG.md",
      "CONTRIBUTORS.md",
      "AUTHORS.md",
      "HISTORY.md",
      "UPGRADING.md",
      "TODO.md",
      "TODO",
      "CHANGELOG",
      "UPGRADING",
      "HISTORY",
      "AUTHORS",
      "CONTRIBUTORS",
      "SECURITY",
      "SUPPORT",
      "FUNDING",
      "ISSUE_TEMPLATE",
      "PULL_REQUEST_TEMPLATE",
      "LICENSE",
      "CODE_OF_CONDUCT",
      "CONTRIBUTING",
      "README",
      "LICENSE.txt",
      // Additional files to ignore
      "package-lock.json",
      "yarn.lock",
      "pnpm-lock.yaml",
      ".DS_Store",
      "Thumbs.db",
      ".env",
      ".env.local",
      ".env.development",
      ".env.test",
      ".env.production",
    ],
    recursive: true,
    unknown: "warn",
    maxConcurrency: 5,
  });

  try {
    const docs = await loader.load();
    console.log(`Successfully loaded ${docs.length} files from repository`);
    return docs;
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    console.error("Error loading repository:", errorMessage);
    throw new Error(`Failed to load repository: ${errorMessage}`);
  }
};

export const generateEmbeddings = async (docs: Document[]) => {
  console.log("\nGenerating summaries and embeddings...");

  const processFile = async (doc: Document) => {
    try {
      console.log(`\nProcessing ${doc.metadata.source}`);

      // Try to generate summary with retries
      let summary = null;
      for (let attempt = 1; attempt <= 3; attempt++) {
        try {
          summary = await summariseCode(doc);
          if (summary) break;
        } catch (error) {
          const errorMessage =
            error instanceof Error ? error.message : String(error);
          console.error(
            `Attempt ${attempt}/3 failed for ${doc.metadata.source}:`,
            errorMessage,
          );
          if (attempt === 3) throw error;
          await new Promise((resolve) => setTimeout(resolve, attempt * 3000));
        }
      }

      if (!summary) {
        throw new Error("Failed to generate summary after all attempts");
      }

      // Generate embedding once we have a summary
      const embedding = await generateEmbedding(summary);

      console.log(`✅ Successfully processed ${doc.metadata.source}`);
      return {
        summary,
        embedding,
        sourceCode: JSON.parse(JSON.stringify(doc.pageContent)),
        fileName: doc.metadata.source,
      };
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : String(error);
      console.error(
        `❌ Failed to process ${doc.metadata.source}:`,
        errorMessage,
      );
      return null;
    }
  };

  return await processInBatches(docs, BATCH_SIZE, processFile);
};

export const indexGithubRepo = async (
  projectId: string,
  githubUrl: string,
  githubToken?: string,
) => {
  console.log(`Starting indexing for repository: ${githubUrl}`);

  try {
    // Load repository files
    const docs = await loadGithubRepo(githubUrl, githubToken);
    console.log(`\nLoaded ${docs.length} files from repository`);

    // Generate embeddings in batches
    const allEmbeddings = await generateEmbeddings(docs);
    const validEmbeddings = allEmbeddings.filter((e) => e !== null);

    console.log(`\nProcessing completed:`);
    console.log(`- Total files: ${docs.length}`);
    console.log(`- Successfully processed: ${validEmbeddings.length}`);
    console.log(`- Failed: ${docs.length - validEmbeddings.length}`);

    // Save to database in batches
    console.log("\nSaving to database...");
    let savedCount = 0;
    const SAVE_BATCH_SIZE = 10;

    for (let i = 0; i < validEmbeddings.length; i += SAVE_BATCH_SIZE) {
      const batch = validEmbeddings.slice(i, i + SAVE_BATCH_SIZE);
      console.log(
        `\nSaving batch ${Math.floor(i / SAVE_BATCH_SIZE) + 1} of ${Math.ceil(validEmbeddings.length / SAVE_BATCH_SIZE)}`,
      );

      await Promise.all(
        batch.map(async (embedding) => {
          try {
            const sourceCodeEmbedding = await db.sourceCodeEmbedding.create({
              data: {
                sourceCode: embedding.sourceCode,
                fileName: embedding.fileName,
                summary: embedding.summary,
                projectId,
              },
            });

            await db.$executeRaw`UPDATE "SourceCodeEmbedding" SET "summaryEmbedding" = ${embedding.embedding}::vector WHERE "id" = ${sourceCodeEmbedding.id}`;
            savedCount++;
            console.log(
              `✅ Saved ${embedding.fileName} (${savedCount}/${validEmbeddings.length})`,
            );
          } catch (error) {
            const errorMessage =
              error instanceof Error ? error.message : String(error);
            console.error(
              `❌ Failed to save ${embedding.fileName}:`,
              errorMessage,
            );
          }
        }),
      );

      // Add delay between save batches if not the last batch
      if (i + SAVE_BATCH_SIZE < validEmbeddings.length) {
        await new Promise((resolve) => setTimeout(resolve, 2000));
      }
    }

    console.log(`\nIndexing completed:`);
    console.log(`- Total files saved: ${savedCount}`);
    console.log(`- Failed to save: ${validEmbeddings.length - savedCount}`);
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    console.error("Error during indexing:", errorMessage);
    throw error;
  }
};

// Document {
//     pageContent: '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">\n' +
//       '  <path d="M9.99984 4.16666V15.8333M4.1665 10H15.8332" stroke="#475467" stroke-width="1.66667" stroke-linecap="round" stroke-linejoin="round"/>\n' +
//       '</svg>',
//     metadata: {
//       source: 'public/icons/plus.svg',
//       repository: 'https://github.com/mrinal-mann/TrustPay',
//       branch: 'master'
//     },
