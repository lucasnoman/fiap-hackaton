import { z } from 'zod'

export const authSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
})

export const authHeaderSchema = z.object({
  authorization: z.string().describe('JWT Bearer token'),
})

export const authResponseSchema = {
  200: z.object({
    token: z.string(),
    user: z.object({
      id: z.number(),
      email: z.string().email(),
    }),
  }),
  401: z.object({
    error: z.string(),
  }),
  400: z.object({
    error: z.string(),
  }),
  500: z.object({
    error: z.string(),
  }),
}

export const signUpSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
})

export const signUpResponseSchema = {
  201: z.object({
    user: z.object({
      id: z.number(),
      email: z.string().email(),
    }),
  }),
  400: z.object({
    error: z.string(),
  }),
  409: z.object({
    error: z.string(),
  }),
  500: z.object({
    error: z.string(),
  }),
}
