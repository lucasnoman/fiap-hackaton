import fs from 'node:fs'

import archiver from 'archiver'

import { ZipCreatorPort } from '@/core/domain/video-processing/ports/zip-creator-port'

export class ZipCreatorArchiver implements ZipCreatorPort {
  createZip(sourceFolder: string, zipFilePath: string): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      const output = fs.createWriteStream(zipFilePath)
      const archive = archiver('zip', { zlib: { level: 9 } })

      output.on('close', resolve)
      archive.on('error', reject)

      archive.pipe(output)
      archive.directory(sourceFolder, false)
      archive.finalize()
    })
  }
}
