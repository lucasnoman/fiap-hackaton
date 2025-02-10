import '@fastify/jwt'

declare module '@fastify/jwt' {
  interface FastifyJWT {
    payload: {
      sub: number
      email: string
      iat?: number
      exp?: number
    }
  }
}
