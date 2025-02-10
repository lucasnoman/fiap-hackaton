import { PrismaClient } from '@prisma/client'

import { ListVideosUseCase } from '@/core/application/video-processing/use-cases/list-videos-use-case'
import { VideoPrismaRepository } from '@/infra/adapter/output/repositories/prisma/video-prisma-repository'

export async function makeVideoListing() {
  const prisma = new PrismaClient()
  const videoRepository = new VideoPrismaRepository(prisma)
  return new ListVideosUseCase(videoRepository)
}
