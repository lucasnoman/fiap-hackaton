import { Video } from '@/core/domain/video-processing/entities/video'
import { FrameExtractorPort } from '@/core/domain/video-processing/ports/frame-extractor-port'
import { VideoRepository } from '@/core/domain/video-processing/ports/repository-port'
import { ZipCreatorPort } from '@/core/domain/video-processing/ports/zip-creator-port'

import { DirectoryService } from '../services/directory-service'

export class ProcessVideoUseCase {
  constructor(
    private readonly frameExtractor: FrameExtractorPort,
    private readonly zipCreator: ZipCreatorPort,
    private readonly videoRepository: VideoRepository,
  ) {}

  async execute(
    videoPath: string,
    outputFolder: string,
    zipFilePath: string,
    interval: number,
    imageSize: string,
    startTime: number,
    endTime: number | null,
  ): Promise<void> {
    DirectoryService.ensureDirectoryExists(outputFolder)

    const videoDuration = await this.frameExtractor.getVideoDuration(videoPath)
    const video = new Video(videoPath, videoDuration)

    await this.videoRepository.save(video)

    await this.frameExtractor.extractFrames(
      video,
      interval,
      outputFolder,
      imageSize,
      startTime,
      endTime,
    )

    await this.zipCreator.createZip(outputFolder, zipFilePath)
  }
}
