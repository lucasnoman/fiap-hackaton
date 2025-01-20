import { Video } from '@/core/domain/video-processing/entities/video'
import { FrameExtractorPort } from '@/core/domain/video-processing/ports/frame-extractor-port'
import { ZipCreatorPort } from '@/core/domain/video-processing/ports/zip-creator-port'

import { DirectoryService } from '../services/directory-service'

export class ProcessVideoUseCase {
  constructor(
    private readonly frameExtractor: FrameExtractorPort,
    private readonly zipCreator: ZipCreatorPort,
  ) {}

  async execute(
    videoPath: string,
    outputFolder: string,
    zipFilePath: string,
    interval: number,
    size: string,
  ): Promise<void> {
    DirectoryService.ensureDirectoryExists(outputFolder)

    const videoDuration = await this.frameExtractor.getVideoDuration(videoPath)
    const video = new Video(videoPath, videoDuration)

    await this.frameExtractor.extractFrames(video, interval, outputFolder, size)

    await this.zipCreator.createZip(outputFolder, zipFilePath)
  }
}
