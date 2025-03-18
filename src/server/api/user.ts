import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "./trpc";

export const userRouter = createTRPCRouter({
  getCredits: protectedProcedure.query(async ({ ctx }) => {
    if (!ctx.user?.userId) {
      throw new Error("User not authenticated");
    }

    const user = await ctx.db.user.findUnique({
      where: { id: ctx.user.userId },
      select: { credits: true },
    });

    if (!user) {
      throw new Error("User not found");
    }

    return { credits: user.credits };
  }),

  updateCredits: protectedProcedure
    .input(z.object({ credits: z.number() }))
    .mutation(async ({ ctx, input }) => {
      if (!ctx.user?.userId) {
        throw new Error("User not authenticated");
      }

      const user = await ctx.db.user.update({
        where: { id: ctx.user.userId },
        data: { credits: input.credits },
        select: { credits: true },
      });

      return { credits: user.credits };
    }),
}); 