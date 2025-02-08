import { VideoProcessingEvents } from './core/domain/video-processing/value-objects/events-enum'
import { SQSAdapter } from './infra/adapter/output/sqs-adapter'
import { awsConfig, sqsSubscriptionConfig } from './infra/config/aws-services'
;(async () => {
  const sqsQueue = new SQSAdapter(awsConfig.region)

  while (true) {
    await new Promise((resolve) => setTimeout(resolve, 1000))

    await sqsQueue.subscribe(
      sqsSubscriptionConfig.queueName,
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
