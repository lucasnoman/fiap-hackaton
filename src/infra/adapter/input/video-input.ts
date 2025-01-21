import path from 'node:path'

import readline from 'readline'
import { z } from 'zod'

const videoPathSchema = z
  .string()
  .min(1, 'Path cannot be empty')
  .refine((path) => path.endsWith('.mp4'), {
    message: 'Path must end with ".mp4"',
  })

export const getVideoPath = async (): Promise<string> => {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  })

  const question = (query: string): Promise<string> =>
    new Promise((resolve) => rl.question(query, resolve))

  console.log('Please provide the video file path:')
  const inputPath = await question(
    'Video file path (press Enter for default): ',
  )

  rl.close()

  // Default to a hardcoded file if the user doesn't provide a path
  const defaultPath = path.resolve(
    process.cwd(),
    'global',
    'Marvel_DOTNET_CSHARP.mp4',
  )

  const resolvedPath = inputPath
    ? path.resolve(process.cwd(), inputPath)
    : defaultPath

  const validation = videoPathSchema.safeParse(resolvedPath)

  if (!validation.success) {
    throw new Error(
      `Invalid video path: ${validation.error.issues.map((i) => i.message).join(', ')}`,
    )
  }

  console.log(`Using video path: ${resolvedPath}`)
  return resolvedPath
}
