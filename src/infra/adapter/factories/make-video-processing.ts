import { PrismaClient } from '@prisma/client'

import { ProcessVideoOnQueueUseCase } from '@/core/application/video-processing/use-cases/process-video-on-queue-use-case'
import { FrameExtractorFfmpeg } from '@/infra/adapter/output/external-services/frame-extractor-ffmpeg'
import { VideoPrismaRepository } from '@/infra/adapter/output/repositories/prisma/video-prisma-repository'

import { S3Adapter } from '../output/s3-adapter'
import { SQSAdapter } from '../output/sqs-adapter'

export async function makeVideoPocessing() {
  const prisma = new PrismaClient()

  const frameExtractor = new FrameExtractorFfmpeg()
  // const zipCreator = new ZipCreatorArchiver()
  const videoRepository = new VideoPrismaRepository(prisma)

  // const videoProcessingUseCase = new ProcessVideoUseCase(
  //   frameExtractor,
  //   zipCreator,
  //   videoRepository,
  // )

  // return videoProcessingUseCase

  const sqsQueue = new SQSAdapter(process.env.AWS_REGION || 'us-east-1')

  const s3Storage = new S3Adapter('frame-extractor-bucket-210932-nmvzbm91')

  const videoProcessingOnQueueUseCase = new ProcessVideoOnQueueUseCase(
    frameExtractor,
    sqsQueue,
    s3Storage,
    videoRepository,
  )

  return videoProcessingOnQueueUseCase
}
