import path from 'node:path'

import { SendMessageCommand, SQSClient } from '@aws-sdk/client-sqs'
import { SQSHandler } from 'aws-lambda'
import ffmpegPath from 'ffmpeg-static'
import ffmpeg from 'fluent-ffmpeg'

import { Message } from '@/core/application/queue/value-objects/message-value-object'
import { ExtractFramesUseCase } from '@/core/application/video-processing/use-cases/extract-frames-use-case'
import { ExtractFramesEventPayload } from '@/core/application/video-processing/use-cases/process-video-on-queue-use-case'
import { ProcessedVideoEvent } from '@/core/domain/video-processing/events/processed-video-event'
import { VideoProcessingEvents } from '@/core/domain/video-processing/value-objects/events-enum'
import { VideoStatus } from '@/core/domain/video-processing/value-objects/video-status'
import { FrameExtractorFfmpeg } from '@/infra/adapter/output/external-services/frame-extractor-ffmpeg'
import { S3Adapter } from '@/infra/adapter/output/s3-adapter'

// const pipeline = promisify(stream.pipeline)

// const s3Client = new S3Client({})
const sqsClient = new SQSClient({})

if (ffmpegPath) {
  ffmpeg.setFfmpegPath(ffmpegPath)
}

export const handler: SQSHandler = async (event) => {
  for (const record of event.Records) {
    try {
      const messageBody = JSON.parse(
        record.body,
      ) as Message<ExtractFramesEventPayload>

      const { payload } = messageBody

      const startTime = payload.secondsStartExtractingFrames
      const endTime = payload.secondsEndExtractingFrames
      const intervalTime = payload.intervalInSecondsToExtractFrames
      const imageSize = payload.imageSize
      const videoPath = payload.storagePath
      const outputFolder = path.resolve(
        '/tmp',
        'output',
        'frames',
        payload.filename.split('.')[0],
      )

      console.log(`Processing video: ${videoPath}`)
      console.log(`Output folder: ${outputFolder}`)
      console.log(`Start time: ${startTime}`)
      console.log(`End time: ${endTime}`)

      // const inputBucket = messageBody.bucket
      // const inputKey = messageBody.key
      // const outputBucket = messageBody.outputBucket
      // const outputPrefix = messageBody.outputPrefix || 'frames'

      const frameExtractor = new FrameExtractorFfmpeg()
      // TODO: Use from config s3ConfigStorage but we need configure envs to this lambda function
      const s3Storage = new S3Adapter('frame-extractor-bucket-210932-nmvzbm91')
      const useCase = new ExtractFramesUseCase(frameExtractor, s3Storage)
      await useCase.execute(
        videoPath,
        outputFolder,
        intervalTime,
        imageSize,
        startTime,
        endTime,
      )

      const payloadResponse: ProcessedVideoEvent = {
        filename: payload.filename,
        status: VideoStatus.PROCESSED,
      }

      // console.log(`Processing video s3://${inputBucket}/${inputKey}`)

      // // 1) Download video from S3 to /tmp
      // const videoFilePath = path.join('/tmp', 'input-video.mp4')
      // await downloadFromS3(inputBucket, inputKey, videoFilePath)

      // // 2) Extract frames using ffmpeg -> store them in /tmp
      // //    for example: frames-001.png, frames-002.png, ...
      // const framePattern = '/tmp/frame-%03d.png'
      // await extractFrames(videoFilePath, framePattern)

      // // 3) (Optional) Upload frames back to S3
      // const frameFiles = fs
      //   .readdirSync('/tmp')
      //   .filter((f) => f.startsWith('frame-'))
      // console.log(`Extracted ${frameFiles.length} frames.`)

      // for (const frame of frameFiles) {
      //   const framePath = path.join('/tmp', frame)
      //   const frameData = fs.readFileSync(framePath)

      //   const s3Key = `${outputPrefix}/${frame}`
      //   await s3Client.send(
      //     new PutObjectCommand({
      //       Bucket: outputBucket,
      //       Key: s3Key,
      //       Body: frameData,
      //       ContentType: 'image/png',
      //     }),
      //   )

      //   console.log(`Uploaded frame: s3://${outputBucket}/${s3Key}`)
      // }

      // 4) (Optional) Send an SQS message indicating completion
      // const outputQueueUrl = process.env.OUTPUT_QUEUE_URL
      const outputQueueUrl =
        'https://sqs.us-east-1.amazonaws.com/979415506381/frame-extractor-queue-completion'
      // if (outputQueueUrl) {
      await sqsClient.send(
        new SendMessageCommand({
          QueueUrl: outputQueueUrl,
          MessageBody: JSON.stringify({
            event: VideoProcessingEvents.PROCESSED_VIDEO,
            timestamp: Date.now(),
            payload: payloadResponse,
          } as Message),
        }),
      )

      console.log(`Completion message sent to: ${outputQueueUrl}`)
      // }

      console.log('Frame extraction and uploads completed.')
    } catch (error) {
      console.error('Error processing record:', error)
      // (Optional) Send to DLQ or handle the error
    }
  }
}

// Download an object from S3 to a local file in /tmp
// async function downloadFromS3(
//   bucket: string,
//   key: string,
//   destPath: string,
// ): Promise<void> {
//   const getObjCommand = new GetObjectCommand({ Bucket: bucket, Key: key })
//   const response = await s3Client.send(getObjCommand)

//   if (!response.Body) {
//     throw new Error('S3 object response body is undefined.')
//   }

//   const readStream = response.Body as stream.Readable
//   const writeStream = fs.createWriteStream(destPath)

//   await pipeline(readStream, writeStream)
// }

// // Run ffmpeg to extract frames
// async function extractFrames(
//   inputPath: string,
//   outputPattern: string,
// ): Promise<void> {
//   return new Promise((resolve, reject) => {
//     ffmpeg(inputPath)
//       .on('end', () => {
//         console.log('Frame extraction finished.')
//         resolve()
//       })
//       .on('error', (err) => {
//         console.error('Failed to extract frames:', err)
//         reject(err)
//       })
//       .outputOptions(['-vsync 0', '-qscale:v 2'])
//       .output(outputPattern)
//       .run()
//   })
// }
