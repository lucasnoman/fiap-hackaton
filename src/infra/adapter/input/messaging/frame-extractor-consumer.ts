import { MessageQueuePort } from '@/core/application/queue/ports/message-queue-port'
import { ProcessedVideoEventHandler } from '@/core/application/video-processing/event-handlers/processed-video-handler'
import { ProcessedVideoEvent } from '@/core/domain/video-processing/events/processed-video-event'
import { VideoProcessingEvents } from '@/core/domain/video-processing/value-objects/events-enum'

import { VideoPrismaRepository } from '../../output/repositories/prisma/video-prisma-repository'

export async function frameExtractorConsumer(
  queue: MessageQueuePort,
  queueName: string,
  videoRepository: VideoPrismaRepository,
) {
  await queue.subscribe(queueName, async (message) => {
    const processedVideoEventHandler = new ProcessedVideoEventHandler(
      videoRepository,
    )

    switch (message.event) {
      case VideoProcessingEvents.PROCESSED_VIDEO:
        await processedVideoEventHandler.handle(
          message.payload as ProcessedVideoEvent,
        )
        break
      default:
        console.error('Unknown event:', message.event)
        break
    }
  })
}
