import { hash } from 'bcryptjs'
import { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'

import { User } from '@/domain/entities/user'
import { PrismaUserRepository } from '@/infra/repositories/prisma-user-repository'

import { signUpSchema } from '../schemas/auth-schema'

export async function signUpController(
  request: FastifyRequest<{ Body: z.infer<typeof signUpSchema> }>,
  reply: FastifyReply,
) {
  try {
    const { email, password } = request.body

    const userRepository = new PrismaUserRepository()

    const userExists = await userRepository.findByEmail(email)

    if (userExists) {
      return reply.status(409).send({ error: 'User already exists' })
    }

    const hashedPassword = await hash(password, 8)

    const user = new User({
      email,
      password: hashedPassword,
    })

    const createdUser = await userRepository.create(user)

    return reply.status(201).send({
      user: {
        id: createdUser.id,
        email: createdUser.email,
      },
    })
  } catch (error) {
    console.error(error)
    return reply.status(500).send({ error: 'Internal server error' })
  }
}
