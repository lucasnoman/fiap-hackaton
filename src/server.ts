import { env } from './infra/config/env'
import { app } from './infra/http/fastify'

app
  .listen({
    host: '0.0.0.0',
    port: env.PORT,
  })
  .then(() => console.log(`Server is running on http://localhost:${env.PORT}`))
