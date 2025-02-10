import { AuthUseCase } from '@/core/application/use-cases/auth-use-case'
import { FastifyJWTTokenGenerator } from '@/infra/adapters/fastify-jwt-token-generator'
import { app } from '@/infra/http/fastify'
import { PrismaUserRepository } from '@/infra/repositories/prisma-user-repository'

export function makeAuthUseCase() {
  const userRepository = new PrismaUserRepository()
  const tokenGenerator = new FastifyJWTTokenGenerator(app)
  const authUseCase = new AuthUseCase(userRepository, tokenGenerator)
  return authUseCase
}
