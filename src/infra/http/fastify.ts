import { fastifyCors } from '@fastify/cors'
import fastifyJwt from '@fastify/jwt'
import { fastifyMultipart } from '@fastify/multipart'
import { fastifySwagger } from '@fastify/swagger'
import fastify, { FastifyReply, FastifyRequest } from 'fastify'
import metricsPlugin from 'fastify-metrics'
import {
  jsonSchemaTransform,
  serializerCompiler,
  validatorCompiler,
  ZodTypeProvider,
} from 'fastify-type-provider-zod'
import { ZodError } from 'zod'

import { env } from '../config/env'
import { setupRoutes } from './setup-routes'

export const app = fastify().withTypeProvider<ZodTypeProvider>()

app.setValidatorCompiler(validatorCompiler)
app.setSerializerCompiler(serializerCompiler)

app.register(fastifyMultipart, { limits: { fileSize: 300 * 1024 * 1024 } })

app.register(fastifyCors, { origin: '*' })

// Register JWT plugin
app.register(fastifyJwt, {
  secret: env.JWT_SECRET,
})

app.register(fastifySwagger, {
  openapi: {
    info: {
      title: 'Typed API',
      version: '0.1.0',
    },
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
    },
    security: [{ bearerAuth: [] }],
  },
  transform: jsonSchemaTransform,
})

app.register(import('@scalar/fastify-api-reference'), {
  routePrefix: '/docs',
  configuration: { theme: 'elysiajs' },
})

app.register(metricsPlugin, { endpoint: '/metrics' })

// Add JWT authentication decorator
app.decorate(
  'authenticate',
  async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      await request.jwtVerify()
    } catch (error) {
      reply.send(error)
    }
  },
)

app.register(setupRoutes)

app.setErrorHandler((error, _request, reply) => {
  if (error instanceof ZodError) {
    return reply
      .status(400)
      .send({ message: 'Validation error', issues: error.format() })
  }

  if (env.NODE_ENV !== 'production') {
    console.error(error)
  } else {
    // TODO - here we should log to an external tool like DataDog/NewRelic/Sentry
  }

  return reply.status(500).send({ message: 'Internal server error' })
})
