import { env } from './env'

export const awsConfig = {
  region: env.AWS_REGION,
}

export const s3StorageConfig = {
  bucketName: env.S3_BUCKET_NAME,
}

export const sqsSubscriptionConfig = {
  queueName: env.SQS_QUEUE_NAME_SUBSCRIPTION,
}

export const sqsVideoExtractionConfig = {
  queueName: env.SQS_QUEUE_NAME,
}
