import { PrismaClient } from '@prisma/client'

import { frameExtractorConsumer } from './infra/adapter/input/messaging/frame-extractor-consumer'
import { VideoPrismaRepository } from './infra/adapter/output/repositories/prisma/video-prisma-repository'
import { SQSAdapter } from './infra/adapter/output/sqs-adapter'
import { awsConfig, sqsSubscriptionConfig } from './infra/config/aws-services'
;(async () => {
  const sqsQueue = new SQSAdapter(awsConfig.region)
  const prisma = new PrismaClient()
  const videoRepository = new VideoPrismaRepository(prisma)

  while (true) {
    await new Promise((resolve) => setTimeout(resolve, 1000))

    await frameExtractorConsumer(
      sqsQueue,
      sqsSubscriptionConfig.queueName,
      videoRepository,
    )
  }
})()
