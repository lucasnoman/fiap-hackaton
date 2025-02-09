import { FastifyReply, FastifyRequest } from 'fastify'

import { ListVideosResponseDTO } from '@/core/application/video-processing/dtos/list-videos-dto'
import { makeVideoListing } from '@/infra/adapter/factories/make-video-listing'

export async function listVideosController(
  _request: FastifyRequest,
  reply: FastifyReply,
) {
  try {
    const listVideosUseCase = await makeVideoListing()
    const videos = await listVideosUseCase.execute()

    const response: ListVideosResponseDTO = {
      videos: videos.map((video) => ({
        filename: video.info.filename,
        status: video.status,
        duration: video.info.duration,
      })),
    }

    return reply.status(200).send(response)
  } catch (error) {
    console.error('Error listing videos:', error)
    return reply.status(500).send({
      error: 'Failed to list videos',
      details:
        error instanceof Error ? error.message : 'Unknown error occurred',
    })
  }
}
