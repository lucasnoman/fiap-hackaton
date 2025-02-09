import 'dotenv/config'

import { z } from 'zod'

const envSchema = z.object({
  // Application
  NODE_ENV: z.enum(['dev', 'test', 'production']).default('dev'),
  PORT: z.coerce.number().min(1).max(65535).default(3333),

  // Database
  DATABASE_URL: z.string().url(),

  // Email Service
  RESEND_API_KEY: z.string().min(1),

  // AWS Configuration
  AWS_ACCESS_KEY_ID: z.string().min(16).max(128),
  AWS_SECRET_ACCESS_KEY: z.string().min(1),
  AWS_SESSION_TOKEN: z.string().min(1),
  AWS_REGION: z.string().min(1),
  S3_BUCKET_NAME: z.string().min(1).max(63),

  // AWS Services
  SQS_QUEUE_NAME: z.string().min(1),
  SQS_QUEUE_NAME_SUBSCRIPTION: z.string().min(1),
})

const _env = envSchema.safeParse(process.env)

if (!_env.success) {
  console.error('❌ Invalid environment variables', _env.error.format())

  throw new Error('Invalid environment variables')
}

export const env = _env.data
