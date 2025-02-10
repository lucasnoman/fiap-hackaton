import { z } from 'zod'

export const videoSchema = z.object({
  filename: z.string(),
  status: z.string(),
  duration: z.number(),
})

export const listVideosResponseSchema = {
  200: z.object({
    videos: z.array(videoSchema),
  }),
  500: z.object({
    error: z.string(),
    details: z.string(),
  }),
}
