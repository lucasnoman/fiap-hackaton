import { FastifyTypedInstances } from '@/@types/fastify-swagger'

import { extractVideoFrames } from './controllers/send-video-controller'
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
}
