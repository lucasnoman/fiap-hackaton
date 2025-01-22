import path from 'node:path'

import readline from 'readline'
import { z } from 'zod'

const videoPathSchema = z
  .string()
  .min(1, 'Path cannot be empty')
  .refine((path) => path.endsWith('.mp4'), {
    message: 'Path must end with ".mp4"',
  })

const timeSchema = z.preprocess(
  (val) => parseInt(val as string, 10),
  z.number().min(0),
)

export const getVideoInput = async (): Promise<{
  videoPath: string
  startTime: number
  endTime: number | null // Null means "until the end of the video"
}> => {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  })

  const question = (query: string): Promise<string> =>
    new Promise((resolve) => rl.question(query, resolve))

  const inputPath = await question(
    'Video file path (press Enter for default): ',
  )

  // Default to a hardcoded file if the user doesn't provide a path
  const defaultPath = path.resolve(
    process.cwd(),
    'global',
    'Marvel_DOTNET_CSHARP.mp4',
  )

  const resolvedPath = inputPath
    ? path.resolve(process.cwd(), inputPath)
    : defaultPath

  const pathValidation = videoPathSchema.safeParse(resolvedPath)
  if (!pathValidation.success) {
    throw new Error(
      `Invalid video path: ${pathValidation.error.issues.map((i) => i.message).join(', ')}`,
    )
  }

  const startTimeRaw = await question(
    'Enter start time in seconds (press Enter for default = 0): ',
  )
  const startTime = startTimeRaw.trim()
    ? (timeSchema.safeParse(startTimeRaw).data ?? 0)
    : 0

  const endTimeRaw = await question(
    'Enter end time in seconds (press Enter for default = end of video): ',
  )
  const endTime = endTimeRaw.trim()
    ? (timeSchema.safeParse(endTimeRaw).data ?? 0)
    : null

  rl.close()

  return { videoPath: resolvedPath, startTime, endTime }
}
