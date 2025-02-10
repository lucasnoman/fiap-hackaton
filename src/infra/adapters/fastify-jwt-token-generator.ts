import { FastifyInstance } from 'fastify'

import {
  TokenGenerator,
  TokenPayload,
} from '@/core/application/ports/token-generator'

export class FastifyJWTTokenGenerator implements TokenGenerator {
  constructor(private app: FastifyInstance) {}

  async generate(payload: TokenPayload): Promise<string> {
    return this.app.jwt.sign(payload, {
      expiresIn: '7d',
    })
  }
}
