import { PrismaClient } from '@prisma/client'

import { ProcessedVideoEventHandler } from '@/core/application/video-processing/event-handlers/processed-video-handler'

import { VideoPrismaRepository } from '../output/repositories/prisma/video-prisma-repository'

export async function makeVideoProcessedHandler() {
  const prisma = new PrismaClient()
  const videoRepository = new VideoPrismaRepository(prisma)
  const processedVideoEventHandler = new ProcessedVideoEventHandler(
    videoRepository,
  )
  return processedVideoEventHandler
}
