import path from 'node:path'

import { PrismaClient } from '@prisma/client'

import { EventBus } from './core/application/events/event-bus'
import { SendCutVideoErrorEmailHandler } from './core/application/video-processing/event-handlers/send-cut-video-error-email-handler'
import { ProcessVideoUseCase } from './core/application/video-processing/use-cases/process-video-use-case'
import { getVideoInput } from './infra/adapter/input/video-input'
import { FakeEmailService } from './infra/adapter/output/fake-email-service'
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
    eventBus.subscribe(
      'ProcessVideoErrorEvent',
      notificationEmailHandler.handle,
    )

    const { videoPath, startTime, endTime } = await getVideoInput()

    const outputFolder = path.resolve(process.cwd(), 'output', 'Images')
    const zipFilePath = path.resolve(process.cwd(), 'output', 'images.zip')

    // const frameExtractor = new FrameExtractorFfmpeg()
    // const zipCreator = new ZipCreatorArchiver()
    const videoRepository = new VideoPrismaRepository(prisma)

    const sqsQueueName =
      process.env.SQS_QUEUE_NAME ||
      'http://sqs.us-east-1.localhost.localstack.cloud:4566/000000000000/frame-extractor-queue'
    const sqsQueue = new SQSAdapter(process.env.AWS_REGION || 'us-east-1')

    const useCase = new ProcessVideoUseCase(
      //   frameExtractor,
      //   zipCreator,
      sqsQueue,
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
  } catch (error) {
    console.error('An error occurred during the process:', error)
  }
})()
