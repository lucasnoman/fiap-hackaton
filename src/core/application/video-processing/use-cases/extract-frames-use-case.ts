import { Video } from '@/core/domain/video-processing/entities/video'
import { FrameExtractorPort } from '@/core/domain/video-processing/ports/frame-extractor-port'
import { VideoInformation } from '@/core/domain/video-processing/value-objects/video-information'

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

    const info = VideoInformation.create(videoPath, videoDuration)

    const video = new Video(info)

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
