/*
  Warnings:

  - Added the required column `commitAuthorAvatar` to the `Commit` table without a default value. This is not possible if the table is not empty.
  - Added the required column `commitAuthorName` to the `Commit` table without a default value. This is not possible if the table is not empty.
  - Added the required column `commitDate` to the `Commit` table without a default value. This is not possible if the table is not empty.
  - Added the required column `commitHash` to the `Commit` table without a default value. This is not possible if the table is not empty.
  - Added the required column `commitMessage` to the `Commit` table without a default value. This is not possible if the table is not empty.
  - Added the required column `summary` to the `Commit` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "ProjectStatus" AS ENUM ('pending', 'indexing', 'completed', 'failed');

-- AlterTable
ALTER TABLE "Commit" ADD COLUMN     "commitAuthorAvatar" TEXT NOT NULL,
ADD COLUMN     "commitAuthorName" TEXT NOT NULL,
ADD COLUMN     "commitDate" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "commitHash" TEXT NOT NULL,
ADD COLUMN     "commitMessage" TEXT NOT NULL,
ADD COLUMN     "summary" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Project" ADD COLUMN     "status" "ProjectStatus" NOT NULL DEFAULT 'pending';

-- AlterTable
ALTER TABLE "User" ALTER COLUMN "credits" SET DEFAULT 50;

-- CreateTable
CREATE TABLE "Question" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "question" TEXT NOT NULL,
    "answer" TEXT NOT NULL,
    "filesReferences" JSONB,
    "projectId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,

    CONSTRAINT "Question_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Question" ADD CONSTRAINT "Question_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Question" ADD CONSTRAINT "Question_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
