import { FastifyReply, FastifyRequest } from 'fastify'

import { makeVideoPocessing } from '@/infra/adapter/factories/make-video-processing'
import { makeVideoUpload } from '@/infra/adapter/factories/make-video-upload'

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

    const videoProcessingUseCase = await makeVideoPocessing()
    await videoProcessingUseCase.execute({
      videoPath: videoMetadata.path,
      intervalInSecondsToExtractFrames: 20,
      imageSize: '1920x1080',
      secondsStartExtractingFrames: 0,
      secondsEndExtractingFrames: null,
    })

    const response: VideoUploadResponse = {
      message: 'Video processed successfully',
      filename: videoMetadata.filename,
    }

    await videoUploadingService.cleanUp(videoMetadata)

    return reply.status(201).send(response)
  } catch (error) {
    console.error('Error processing video:', error)

    const errorResponse: VideoUploadError = {
      error: 'Failed to process the video',
      details:
        error instanceof Error ? error.message : 'Unknown error occurred',
    }

    return reply.status(500).send(errorResponse)
  }
}
