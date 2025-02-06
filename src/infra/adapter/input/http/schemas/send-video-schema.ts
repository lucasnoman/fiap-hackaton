import { z } from 'zod'

export const headerSchema = z
  .object({
    'content-type': z
      .string()
      .includes('multipart/form-data')
      .describe('Must be multipart/form-data'),
  })
  .passthrough()

export const responseSchema = {
  201: z.object({
    message: z.string().default('Video processed successfully'),
    filename: z.string(),
  }),
  400: z.object({
    error: z.string().default('No video file provided'),
  }),
  500: z.object({
    error: z.string().default('Failed to process the video'),
    details: z.string().default('Unknown error occurred'),
  }),
}
