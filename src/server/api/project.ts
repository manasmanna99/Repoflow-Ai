import { z } from "zod";
import { createTRPCRouter, protectedProcedure, publicProcedure } from "./trpc";
import { poolCommits } from "~/lib/github";
import { loadGithubRepo, generateEmbeddings } from "~/lib/github-loader";

export const projectRouter = createTRPCRouter({
  createProject: protectedProcedure
    .input(
      z.object({
        name: z.string(),
        githubUrl: z.string(),
        githubToken: z.string().optional(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      // Create project with initial indexing status
      const project = await ctx.db.project.create({
        data: {
          githubUrl: input.githubUrl,
          name: input.name,
          status: "indexing" as const,
          userToProjects: {
            create: {
              userId: ctx.user.userId!,
            },
          },
        },
      });

      // Start indexing in the background
      void (async () => {
        try {
          // Load repository files
          const docs = await loadGithubRepo(input.githubUrl, input.githubToken);

          // Generate embeddings in smaller chunks
          const allEmbeddings = await generateEmbeddings(docs);
          const validEmbeddings = allEmbeddings.filter((e) => e !== null);

          // Save to database in smaller chunks
          const SAVE_BATCH_SIZE = 3;
          for (let i = 0; i < validEmbeddings.length; i += SAVE_BATCH_SIZE) {
            const batch = validEmbeddings.slice(i, i + SAVE_BATCH_SIZE);

            await Promise.all(
              batch.map(async (embedding) => {
                try {
                  const sourceCodeEmbedding =
                    await ctx.db.sourceCodeEmbedding.create({
                      data: {
                        sourceCode: embedding.sourceCode,
                        fileName: embedding.fileName,
                        summary: embedding.summary,
                        projectId: project.id,
                      },
                    });

                  await ctx.db
                    .$executeRaw`UPDATE "SourceCodeEmbedding" SET "summaryEmbedding" = ${embedding.embedding}::vector WHERE "id" = ${sourceCodeEmbedding.id}`;
                } catch (error) {
                  console.error(`Error saving ${embedding.fileName}:`, error);
                }
              }),
            );

            // Small delay between chunks to prevent rate limiting
            await new Promise((resolve) => setTimeout(resolve, 1000));
          }

          // Update project status to completed
          await ctx.db.project.update({
            where: { id: project.id },
            data: { status: "completed" as const },
          });

          // Start commit pooling
          await poolCommits(project.id);
        } catch (error) {
          console.error("Indexing failed:", error);
          await ctx.db.project.update({
            where: { id: project.id },
            data: { status: "failed" },
          });
        }
      })();

      return project;
    }),
  getProjects: protectedProcedure.query(async ({ ctx }) => {
    const projects = await ctx.db.project.findMany({
      where: {
        userToProjects: { some: { userId: ctx.user.userId! } },
        deletedAt: null,
      },
    });
    return projects;
  }),
  getCommits: protectedProcedure
    .input(
      z.object({
        projectId: z.string(),
      }),
    )
    .query(async ({ ctx, input }) => {
      try {
        // Start fetching new commits in the background
        void poolCommits(input.projectId).catch((error) => {
          console.error("Error pooling commits:", error);
        });

        // Return existing commits immediately
        return await ctx.db.commit.findMany({
          where: { projectId: input.projectId },
          orderBy: {
            commitDate: "desc",
          },
        });
      } catch (error) {
        console.error("Error fetching commits:", error);
        throw new Error("Failed to fetch commits");
      }
    }),
  saveAnswer: protectedProcedure
    .input(
      z.object({
        projectId: z.string(),
        question: z.string(),
        answer: z.string(),
        filesReferences: z.any(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      return await ctx.db.question.create({
        data: {
          projectId: input.projectId,
          question: input.question,
          answer: input.answer,
          filesReferences: input.filesReferences,
          userId: ctx.user.userId!,
        },
      });
    }),
  getQuestions: protectedProcedure
    .input(z.object({ projectId: z.string() }))
    .query(async ({ ctx, input }) => {
      return await ctx.db.question.findMany({
        where: { projectId: input.projectId },
        include: {
          user: true,
        },
        orderBy: {
          createdAt: "desc",
        },
      });
    }),
  archiveProject: protectedProcedure
    .input(z.object({ projectId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      return await ctx.db.project.update({
        where: { id: input.projectId },
        data: {
          deletedAt: new Date(),
        },
      });
    }),
  getArchivedProjects: protectedProcedure.query(async ({ ctx }) => {
    return await ctx.db.project.findMany({
      where: {
        userToProjects: { some: { userId: ctx.user.userId! } },
        deletedAt: { not: null },
      },
      orderBy: {
        deletedAt: "desc",
      },
    });
  }),
  restoreProject: protectedProcedure
    .input(z.object({ projectId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      return await ctx.db.project.update({
        where: { id: input.projectId },
        data: {
          deletedAt: null,
        },
      });
    }),
  deleteProject: protectedProcedure
    .input(z.object({ projectId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      // First check if the user has access to this project
      const userProject = await ctx.db.userToProject.findFirst({
        where: {
          projectId: input.projectId,
          userId: ctx.user.userId!,
        },
      });

      if (!userProject) {
        throw new Error("You don't have access to this project");
      }

      // Then delete the project
      return await ctx.db.project.delete({
        where: { id: input.projectId },
      });
    }),
});
