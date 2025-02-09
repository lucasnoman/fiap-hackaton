import JSZip from 'jszip'

import { StoragePort } from '../../storage/ports/storage-port'

export class DownloadFramesUseCase {
  constructor(private readonly storage: StoragePort) {}

  async execute(videoFilename: string): Promise<Buffer> {
    const framesPrefix = `frames/${videoFilename.split('.')[0]}/`
    const framePaths = await this.storage.list(framesPrefix)

    if (framePaths.length === 0) {
      throw new Error('No frames found for this video')
    }

    const frames = await this.storage.retrieveMany(framePaths)
    const zip = new JSZip()

    for (const [path, buffer] of frames) {
      const filename = path.split('/').pop()!
      zip.file(filename, buffer)
    }

    return await zip.generateAsync({ type: 'nodebuffer' })
  }
}
