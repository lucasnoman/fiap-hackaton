import { VideoProcessingEvents } from './core/domain/video-processing/value-objects/events-enum'
import { SQSAdapter } from './infra/adapter/output/sqs-adapter'
;(async () => {
  const sqsQueue = new SQSAdapter(process.env.AWS_REGION || 'us-east-1')

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
})()
