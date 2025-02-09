import { FastifyTypedInstances } from '@/@types/fastify-swagger'

import { downloadFramesController } from './controllers/download-frames-controller'
import { listVideosController } from './controllers/list-videos-controller'
import { extractVideoFrames } from './controllers/send-video-controller'
import {
  downloadFramesParamsSchema,
  downloadFramesResponseSchema,
} from './schemas/download-frames-schema'
import { listVideosResponseSchema } from './schemas/list-videos-schema'
import { headerSchema, responseSchema } from './schemas/send-video-schema'

export async function videoProcessingRoutes(app: FastifyTypedInstances) {
  app.post(
    '/video-process',
    {
      schema: {
        tags: ['Video Process'],
        description: 'Process a new video',
        consumes: ['multipart/form-data'],
        headers: headerSchema,
        response: responseSchema,
      },
    },
    extractVideoFrames,
  )

  app.get(
    '/videos',
    {
      schema: {
        tags: ['Video Process'],
        description: 'List all processed videos',
        response: listVideosResponseSchema,
      },
    },
    listVideosController,
  )

  app.get(
    '/videos/:filename/frames',
    {
      schema: {
        tags: ['Video Process'],
        description: 'Download frames from a processed video',
        params: downloadFramesParamsSchema,
        response: downloadFramesResponseSchema,
      },
    },
    downloadFramesController,
  )
}
