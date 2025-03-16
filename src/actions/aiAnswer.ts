"use server";
import { streamText } from "ai";
import { createStreamableValue } from "ai/rsc";
import { createGoogleGenerativeAI } from "@ai-sdk/google";
import { generateEmbedding } from "~/lib/gemini";
import { db } from "~/server/db";

const google = createGoogleGenerativeAI({
  apiKey: process.env.GEMINI_API_KEY,
});

export async function askQuestion(question: string, projectId: string) {
  const stream = createStreamableValue();
  const queryVector = await generateEmbedding(question);
  const vectorQuery = `[${queryVector.join(",")}]`;

  // Get relevant files with higher similarity threshold
  const result = (await db.$queryRaw`
    SELECT "fileName", "sourceCode", "summary", 1-("summaryEmbedding" <=> ${vectorQuery}::vector) AS Similarity
    FROM "SourceCodeEmbedding"
    WHERE 1-("summaryEmbedding" <=> ${vectorQuery}::vector) > 0.3
    AND "projectId"=${projectId}
    ORDER BY Similarity DESC
    LIMIT 5
  `) as { fileName: string; sourceCode: string; summary: string }[];

  // Format context with clear sections and relevant information
  let context = "";
  if (result.length > 0) {
    context = result
      .map(
        (doc) => `
File: ${doc.fileName}
Summary: ${doc.summary}
Code:
\`\`\`
${doc.sourceCode}
\`\`\`
`,
      )
      .join("\n\n");
  }

  void (async () => {
    try {
      const { textStream } = await streamText({
        model: google("gemini-2.0-flash-thinking-exp-01-21"),
        prompt: `You are RepoFlow AI, a specialized code assistant that helps developers understand and work with their codebase. Your responses should be clear, technical, and directly related to the code context provided.

Instructions:
1. Always analyze the provided code context thoroughly before answering
2. If you find relevant information in the context, provide specific details and reference the files
3. Include code snippets when appropriate, using proper markdown formatting
4. If the context doesn't contain enough information, explain what specific information is missing
5. Focus on being helpful and practical rather than apologetic

Available Context:
${context}

Question: ${question}

Response Guidelines:
- Start with a direct answer to the question
- Reference specific files and code when relevant
- Use markdown for formatting, especially code blocks
- If you need more context, specify what additional information would help
- Provide step-by-step explanations for complex answers

Remember: If the context truly doesn't contain relevant information, explain what specific information is missing rather than just saying you don't have enough context.`,
      });

      for await (const delta of textStream) {
        stream.update(delta);
      }
      stream.done();
    } catch (error) {
      console.error("Error generating response:", error);
      stream.update(
        "I encountered an error while processing your question. Please try again or rephrase your question.",
      );
      stream.done();
    }
  })();

  return {
    output: stream.value,
    filesReferences: result,
  };
}
