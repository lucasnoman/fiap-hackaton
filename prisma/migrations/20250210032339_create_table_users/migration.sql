/*
  Warnings:

  - You are about to drop the column `filename` on the `frames` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "frames_filename_key";

-- AlterTable
ALTER TABLE "frames" DROP COLUMN "filename";

-- CreateTable
CREATE TABLE "users" (
    "id" SERIAL NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");
