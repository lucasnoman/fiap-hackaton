/*
  Warnings:

  - A unique constraint covering the columns `[filename]` on the table `frames` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "frames_filename_key" ON "frames"("filename");
