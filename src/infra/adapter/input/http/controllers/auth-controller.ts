import { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'

import { InvalidCredentialsError } from '@/core/application/use-cases/auth-use-case'
import { makeAuthUseCase } from '@/infra/adapter/factories/make-auth-use-case'

import { authSchema } from '../schemas/auth-schema'

export async function authenticateController(
  request: FastifyRequest<{ Body: z.infer<typeof authSchema> }>,
  reply: FastifyReply,
) {
  try {
    const { email, password } = request.body
    const authUseCase = makeAuthUseCase()

    const { user } = await authUseCase.execute({ email, password })

    // Sign token with proper payload
    const token = await reply.jwtSign(
      {
        sub: user.id,
        email: user.email,
      },
      {
        expiresIn: '7d',
      },
    )

    return reply.status(200).send({ token, user })
  } catch (error) {
    if (error instanceof InvalidCredentialsError) {
      return reply.status(401).send({ error: error.message })
    }

    console.error(error)
    return reply.status(500).send({ error: 'Internal server error' })
  }
}
