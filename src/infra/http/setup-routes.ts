import { FastifyTypedInstances } from '@/@types/fastify-swagger'
import { videoProcessingRoutes } from '@/infra/adapter/input/http/routes'

export async function setupRoutes(app: FastifyTypedInstances) {
  await app.register(videoProcessingRoutes)
}
