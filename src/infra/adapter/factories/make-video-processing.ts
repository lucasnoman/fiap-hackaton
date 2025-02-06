import { PrismaClient } from '@prisma/client'

import { ProcessVideoUseCase } from '@/core/application/video-processing/use-cases/process-video-use-case'
import { FrameExtractorFfmpeg } from '@/infra/adapter/output/external-services/frame-extractor-ffmpeg'
import { ZipCreatorArchiver } from '@/infra/adapter/output/persistence/zip-creator-archiver'
import { VideoPrismaRepository } from '@/infra/adapter/output/repositories/prisma/video-prisma-repository'

export async function makeVideoPocessing() {
  const prisma = new PrismaClient()

  const frameExtractor = new FrameExtractorFfmpeg()
  const zipCreator = new ZipCreatorArchiver()
  const videoRepository = new VideoPrismaRepository(prisma)

  const videoProcessingUseCase = new ProcessVideoUseCase(
    frameExtractor,
    zipCreator,
    videoRepository,
  )

  return videoProcessingUseCase
}
