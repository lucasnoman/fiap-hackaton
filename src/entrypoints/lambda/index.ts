import { SQSHandler } from 'aws-lambda'
import ffmpegPath from 'ffmpeg-static'
import ffmpeg from 'fluent-ffmpeg'

type MessageBody = {
  videoPath: string
  outputFolder: string
  interval: number
  imageSize: string
  startTime: number
  endTime: number | null
}

// const pipeline = promisify(stream.pipeline)

// const s3Client = new S3Client({})
// const sqsClient = new SQSClient({})

if (ffmpegPath) {
  ffmpeg.setFfmpegPath(ffmpegPath)
}

export const handler: SQSHandler = async (event) => {
  for (const record of event.Records) {
    try {
      const messageBody = JSON.parse(record.body) as MessageBody

      const videoPath = messageBody.videoPath
      const outputFolder = messageBody.outputFolder
      const startTime = messageBody.startTime
      const endTime = messageBody.endTime

      console.log(`Processing video: ${videoPath}`)
      console.log(`Output folder: ${outputFolder}`)
      console.log(`Start time: ${startTime}`)
      console.log(`End time: ${endTime}`)

      // const inputBucket = messageBody.bucket
      // const inputKey = messageBody.key
      // const outputBucket = messageBody.outputBucket
      // const outputPrefix = messageBody.outputPrefix || 'frames'

      // const frameExtractor = new FrameExtractorFfmpeg()
      // const useCase = new ExtractFramesUseCase(frameExtractor)
      // await useCase.execute(
      //   videoPath,
      //   outputFolder,
      //   20,
      //   '1920x1080',
      //   startTime,
      //   endTime,
      // )

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

      // // 4) (Optional) Send an SQS message indicating completion
      // const outputQueueUrl = process.env.OUTPUT_QUEUE_URL
      // if (outputQueueUrl) {
      //   await sqsClient.send(
      //     new SendMessageCommand({
      //       QueueUrl: outputQueueUrl,
      //       MessageBody: JSON.stringify({
      //         status: 'COMPLETED',
      //         framesCount: frameFiles.length,
      //         inputVideo: `s3://${inputBucket}/${inputKey}`,
      //         outputFramesPrefix: `s3://${outputBucket}/${outputPrefix}/`,
      //       }),
      //     }),
      //   )

      //   console.log(`Completion message sent to: ${outputQueueUrl}`)
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
