import path from 'node:path'

import { Video } from '@/core/domain/video-processing/entities/video'
import { FrameExtractorPort } from '@/core/domain/video-processing/ports/frame-extractor-port'
import { VideoRepository } from '@/core/domain/video-processing/ports/repository-port'
import { ZipCreatorPort } from '@/core/domain/video-processing/ports/zip-creator-port'
import { VideoInformation } from '@/core/domain/video-processing/value-objects/video-information'
import { VideoStatus } from '@/core/domain/video-processing/value-objects/video-status'
import { uniqueName } from '@/shared/utils/unique-name-creator'

import { DirectoryService } from '../services/directory-service'

type processVideoMethod = {
  filename: string
  intervalInSecondsToExtractFrames: number
  imageSize: string
  secondsStartExtractingFrames: number
  secondsEndExtractingFrames: number | null
}

export class ProcessVideoUseCase {
  constructor(
    private readonly frameExtractor: FrameExtractorPort,
    private readonly zipCreator: ZipCreatorPort,
    private readonly videoRepository: VideoRepository,
  ) {}

  async execute({
    filename,
    intervalInSecondsToExtractFrames,
    imageSize,
    secondsStartExtractingFrames,
    secondsEndExtractingFrames,
  }: processVideoMethod): Promise<void> {
    const videoPath = path.resolve(
      process.cwd(),
      'global',
      'uploaded-videos',
      filename,
    )
    const outputFolder = path.resolve(process.cwd(), 'output', 'frames')
    const zipFilePath = path.resolve(
      process.cwd(),
      'output',
      `${uniqueName}.zip`,
    )

    DirectoryService.ensureDirectoryExists(outputFolder)

    const videoDuration = await this.frameExtractor.getVideoDuration(videoPath)
    const videoInfo = VideoInformation.create(
      videoPath,
      filename,
      videoDuration,
    )
    const video = new Video(videoInfo, VideoStatus.PROCESSING)

    await this.videoRepository.save(video)

    await this.frameExtractor.extractFrames(
      video,
      intervalInSecondsToExtractFrames,
      outputFolder,
      imageSize,
      secondsStartExtractingFrames,
      secondsEndExtractingFrames,
    )

    await this.zipCreator.createZip(outputFolder, zipFilePath)
  }
}
