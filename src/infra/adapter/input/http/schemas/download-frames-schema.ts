import { z } from 'zod'

export const downloadFramesParamsSchema = z.object({
  filename: z.string(),
})

export const downloadFramesResponseSchema = {
  200: z.any().describe('ZIP file containing video frames'),
  500: z.object({
    error: z.string(),
    details: z.string(),
  }),
}
