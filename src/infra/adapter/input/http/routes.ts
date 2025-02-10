import { FastifyTypedInstances } from '@/@types/fastify-swagger'

import { authenticateController } from './controllers/auth-controller'
import { downloadFramesController } from './controllers/download-frames-controller'
import { listVideosController } from './controllers/list-videos-controller'
import { extractVideoFrames } from './controllers/send-video-controller'
import { signUpController } from './controllers/sign-up-controller'
import {
  authResponseSchema,
  authSchema,
  signUpResponseSchema,
  signUpSchema,
} from './schemas/auth-schema'
import {
  downloadFramesParamsSchema,
  downloadFramesResponseSchema,
} from './schemas/download-frames-schema'
import { listVideosResponseSchema } from './schemas/list-videos-schema'
import { headerSchema, responseSchema } from './schemas/send-video-schema'

export async function videoProcessingRoutes(app: FastifyTypedInstances) {
  app.post(
    '/auth',
    {
      schema: {
        tags: ['Authentication'],
        description: 'Authenticate user',
        body: authSchema,
        response: authResponseSchema,
      },
    },
    authenticateController,
  )

  app.post(
    '/sign-up',
    {
      schema: {
        tags: ['Authentication'],
        description: 'Register a new user',
        body: signUpSchema,
        response: signUpResponseSchema,
      },
    },
    signUpController,
  )

  // Protected routes
  // app.addHook('onRequest', app.authenticate)

  app.post(
    '/video-process',
    {
      onRequest: [app.authenticate],
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
      onRequest: [app.authenticate],
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
      // onRequest: [app.authenticate],0
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
