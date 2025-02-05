import path from 'node:path'

import { PrismaClient } from '@prisma/client'

import { EventBus } from './core/application/events/event-bus'
import { ProcessedVideoEventHandler } from './core/application/video-processing/event-handlers/processed-video-handler'
import { SendCutVideoErrorEmailHandler } from './core/application/video-processing/event-handlers/send-cut-video-error-email-handler'
import { ProcessVideoUseCase } from './core/application/video-processing/use-cases/process-video-use-case'
import { VideoProcessingEvents } from './core/domain/video-processing/value-objects/events-enum'
import { getVideoInput } from './infra/adapter/input/video-input'
import { FakeEmailService } from './infra/adapter/output/fake-email-service'
import { S3Adapter } from './infra/adapter/output/s3-adapter'
import { SQSAdapter } from './infra/adapter/output/sqs-adapter'
import { VideoPrismaRepository } from './infra/adapter/output/video-prisma-repository'
;(async () => {
  console.log('Process started...')

  try {
    const eventBus = new EventBus()
    const prisma = new PrismaClient()

    const notificationEmailHandler = new SendCutVideoErrorEmailHandler(
      new FakeEmailService(),
    )
    const processedVideoEvent = new ProcessedVideoEventHandler(
      new VideoPrismaRepository(prisma),
    )

    eventBus.subscribe(
      'ProcessVideoErrorEvent',
      notificationEmailHandler.handle,
    )

    eventBus.subscribe('ProcessedVideoEvent', processedVideoEvent.handle)

    const { videoPath, startTime, endTime } = await getVideoInput()

    const outputFolder = path.resolve(process.cwd(), 'output', 'Images')
    const zipFilePath = path.resolve(process.cwd(), 'output', 'images.zip')

    // const frameExtractor = new FrameExtractorFfmpeg()
    // const zipCreator = new ZipCreatorArchiver()
    const videoRepository = new VideoPrismaRepository(prisma)

    const sqsQueueName =
      process.env.SQS_QUEUE_NAME ||
      'https://sqs.us-east-1.amazonaws.com/979415506381/frame-extractor-queue'
    const sqsQueue = new SQSAdapter(process.env.AWS_REGION || 'us-east-1')

    const s3Storage = new S3Adapter('frame-extractor-bucket-210932-nmvzbm91')

    const useCase = new ProcessVideoUseCase(
      //   frameExtractor,
      //   zipCreator,
      sqsQueue,
      s3Storage,
      videoRepository,
    )
    await useCase.execute(
      videoPath,
      outputFolder,
      zipFilePath,
      20,
      '1920x1080',
      startTime,
      endTime,
      sqsQueueName,
    )

    console.log('Process completed successfully.')

    while (true) {
      await new Promise((resolve) => setTimeout(resolve, 1000))

      await sqsQueue.subscribe(
        'https://sqs.us-east-1.amazonaws.com/979415506381/frame-extractor-queue-completion',
        async (message) => {
          switch (message.event) {
            case VideoProcessingEvents.PROCESSED_VIDEO:
              console.log('Frame extraction completed')
              break
            default:
              console.error('Unknown event:', message.event)
              break
          }
        },
      )
    }
  } catch (error) {
    console.error('An error occurred during the process:', error)
  }
})()
