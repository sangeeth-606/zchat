/*
  Warnings:

  - Made the column `userId` on table `messages` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
UPDATE "messages" SET "userId" = 'anonymous' WHERE "userId" IS NULL;

ALTER TABLE "messages" ALTER COLUMN "userId" SET NOT NULL,
ALTER COLUMN "userId" SET DEFAULT 'anonymous';
