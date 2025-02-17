/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/consistent-type-imports */
import { GithubRepoLoader } from "@langchain/community/document_loaders/web/github";
import { Document } from "@langchain/core/documents";
import { generateEmbedding, summariseCode } from "./gemini";
import { db } from "~/server/db";

export const loadGithubRepo = async (
  githubUrl: string,
  githubToken?: string,
) => {
  const loader = new GithubRepoLoader(githubUrl, {
    // eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing
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
    ],
    recursive: true,
    unknown: "warn",
    maxConcurrency: 5,
  });
  const docs = await loader.load();
  return docs;
};

export const indexGithubRepo = async (
  projectId: string,
  githubUrl: string,
  githubToken?: string,
) => {
  const docs = await loadGithubRepo(githubUrl, githubToken);
  const allEmbeddings = await generateEmbeddings(docs);
  await Promise.allSettled(
    allEmbeddings.map(async (embedding, index) => {
      if (!embedding) return;

      // eslint-disable-next-line @typescript-eslint/no-unsafe-call
      const sourceCodeEmbedding = await db.sourceCodeEmbedding.create({
        data: {
          sourceCode: embedding.sourceCode,
          fileName: embedding.fileName,
          summary: embedding.summary,
          projectId,
        },
      });
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      await db.$executeRaw`UPDATE "SourceCodeEmbedding" SET "summaryEmbedding" = ${embedding.embedding}::vector WHERE "id" = ${sourceCodeEmbedding.id}`;
    }),
  );
};

export const generateEmbeddings = async (docs: Document[]) => {
  return await Promise.all(
    docs.map(async (doc) => {
      const summary = await summariseCode(doc);
      const embedding = await generateEmbedding(summary);
      return {
        summary,
        embedding,
        sourceCode: JSON.parse(JSON.stringify(doc.pageContent)),
        fileName: doc.metadata.source,
      };
    }),
  );
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
