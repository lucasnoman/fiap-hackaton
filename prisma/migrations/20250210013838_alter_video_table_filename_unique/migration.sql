/*
  Warnings:

  - A unique constraint covering the columns `[filename]` on the table `videos` will be added. If there are existing duplicate values, this will fail.
  - We remove all duplicates before applying the unique constraint. If you have a large table, this can take a long time and block the table.
*/
-- RemoveDuplicates
DELETE FROM "videos" a USING "videos" b WHERE a."id" < b."id" AND a."filename" = b."filename";

-- CreateIndex
CREATE UNIQUE INDEX "videos_filename_key" ON "videos"("filename");
