-- CreateTable
CREATE TABLE "videos" (
    "id" SERIAL NOT NULL,
    "filename" TEXT NOT NULL,
    "duration" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "videos_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "frames" (
    "id" SERIAL NOT NULL,
    "videoId" INTEGER NOT NULL,
    "timestamp" TEXT NOT NULL,
    "filename" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "frames_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "frames" ADD CONSTRAINT "frames_videoId_fkey" FOREIGN KEY ("videoId") REFERENCES "videos"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
