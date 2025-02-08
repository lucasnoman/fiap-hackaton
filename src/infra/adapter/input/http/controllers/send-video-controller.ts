import { FastifyReply, FastifyRequest } from 'fastify'

import { makeVideoPocessing } from '@/infra/adapter/factories/make-video-processing'
import { makeVideoUpload } from '@/infra/adapter/factories/make-video-upload'
import { sendMail } from '@/infra/adapter/output/external-services/email'

import { VideoUploadError, VideoUploadResponse } from '../dtos/send-video-dto'

export async function extractVideoFrames(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  try {
    const data = await request.file()

    if (!data || !data.file) {
      return reply
        .status(400)
        .send({ error: 'No video file provided' } as VideoUploadError)
    }

    const videoUploadingService = await makeVideoUpload()
    const videoMetadata = await videoUploadingService.execute({
      filename: data.filename,
      mimetype: data.mimetype,
      content: data.file,
    })

    const sqsQueueName =
      process.env.SQS_QUEUE_NAME ||
      'https://sqs.us-east-1.amazonaws.com/979415506381/frame-extractor-queue'
    const videoProcessingUseCase = await makeVideoPocessing()

    await videoProcessingUseCase.execute({
      filename: videoMetadata.filename,
      queueName: sqsQueueName,
      intervalInSecondsToExtractFrames: 1,
      imageSize: '1920x1080',
      secondsStartExtractingFrames: 0,
      secondsEndExtractingFrames: null,
    })

    const response: VideoUploadResponse = {
      message: 'Video is processing, wait a moment...',
    }

    //TODO: FIX: this is generate concurrency error
    // await videoUploadingService.cleanUp(videoMetadata)

    return reply.status(201).send(response)
  } catch (error) {
    console.error('Error processing video:', error)

    const errorResponse: VideoUploadError = {
      error: 'Failed to process the video',
      details:
        error instanceof Error ? error.message : 'Unknown error occurred',
    }

    sendMail({
      from: 'onboarding@resend.dev',
      to: 'lucas.noman7@gmail.com',
      subject: 'Failed to process the video',
      html: `<h2>The video failed to be processed.</h2> <p><strong>Error</strong>: ${errorResponse.details}</p>`,
    })

    return reply.status(500).send(errorResponse)
  }
}
