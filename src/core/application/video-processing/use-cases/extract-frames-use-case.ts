import { Video } from '@/core/domain/video-processing/entities/video'
import { FrameExtractorPort } from '@/core/domain/video-processing/ports/frame-extractor-port'

import { DirectoryService } from '../services/directory-service'

export class ExtractFramesUseCase {
  constructor(private readonly frameExtractor: FrameExtractorPort) {}

  async execute(
    videoPath: string,
    outputFolder: string,
    interval: number,
    imageSize: string,
    startTime: number,
    endTime: number | null,
  ): Promise<void> {
    DirectoryService.ensureDirectoryExists(outputFolder)

    const videoDuration = await this.frameExtractor.getVideoDuration(videoPath)

    const video = new Video(videoPath, videoDuration)

    await this.frameExtractor.extractFrames(
      video,
      interval,
      outputFolder,
      imageSize,
      startTime,
      endTime,
    )

    // await this.zipCreator.createZip(outputFolder, zipFilePath)
  }
}
