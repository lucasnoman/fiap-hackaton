import { PrismaClient } from '@prisma/client'

import { ProcessVideoOnQueueUseCase } from '@/core/application/video-processing/use-cases/process-video-on-queue-use-case'
import { ProcessVideoUseCase } from '@/core/application/video-processing/use-cases/process-video-use-case'
import { FrameExtractorFfmpeg } from '@/infra/adapter/output/external-services/frame-extractor-ffmpeg'
import { VideoPrismaRepository } from '@/infra/adapter/output/repositories/prisma/video-prisma-repository'
import { awsConfig, s3StorageConfig } from '@/infra/config/aws-services'

import { ZipCreatorArchiver } from '../output/persistence/zip-creator-archiver'
import { S3Adapter } from '../output/s3-adapter'
import { SQSAdapter } from '../output/sqs-adapter'

export async function makeVideoPocessing() {
  const prisma = new PrismaClient()

  const frameExtractor = new FrameExtractorFfmpeg()
  const videoRepository = new VideoPrismaRepository(prisma)

  const sqsQueue = new SQSAdapter(awsConfig.region)

  const s3Storage = new S3Adapter(s3StorageConfig.bucketName)

  const videoProcessingOnQueueUseCase = new ProcessVideoOnQueueUseCase(
    frameExtractor,
    sqsQueue,
    s3Storage,
    videoRepository,
  )

  return videoProcessingOnQueueUseCase
}

export async function makeVideoPocessingDev() {
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
