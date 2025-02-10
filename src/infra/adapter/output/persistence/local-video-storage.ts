import fs from 'node:fs'
import path from 'node:path'
import { pipeline } from 'node:stream/promises'

import { DirectoryService } from '@/core/application/video-processing/services/directory-service'
import {
  VideoMetadata,
  VideoRest,
  VideoStoragePort,
} from '@/core/domain/video-processing/ports/send-video-port'
import { uniqueName } from '@/shared/utils/unique-name-creator'

export class LocalVideoStorageAdapter implements VideoStoragePort {
  async save(video: VideoRest): Promise<VideoMetadata> {
    const fileExtension = path.extname(video.filename)
    const uniqueFilename = `${uniqueName('video')}${fileExtension}`

    const outputFolder = path.resolve(
      process.cwd(),
      'global',
      'uploaded-videos',
    )
    DirectoryService.ensureDirectoryExists(outputFolder)

    const outputPath = path.resolve(outputFolder, uniqueFilename)

    await pipeline(video.content, fs.createWriteStream(outputPath))

    return {
      filename: uniqueFilename,
      path: outputPath,
    }
  }

  async delete(video: VideoMetadata): Promise<void> {
    await fs.promises.unlink(video.path)
  }
}
