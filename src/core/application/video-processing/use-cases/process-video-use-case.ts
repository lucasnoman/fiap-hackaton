import path from 'node:path'

import { Video } from '@/core/domain/video-processing/entities/video'
import { FrameExtractorPort } from '@/core/domain/video-processing/ports/frame-extractor-port'
import { VideoRepository } from '@/core/domain/video-processing/ports/repository-port'
import { ZipCreatorPort } from '@/core/domain/video-processing/ports/zip-creator-port'
import { VideoInformation } from '@/core/domain/video-processing/value-objects/video-information'
import { uniqueName } from '@/shared/utils/unique-name-creator'

import { DirectoryService } from '../services/directory-service'

type processVideoMethod = {
  videoPath: string
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
    videoPath,
    intervalInSecondsToExtractFrames,
    imageSize,
    secondsStartExtractingFrames,
    secondsEndExtractingFrames,
  }: processVideoMethod): Promise<void> {
    const outputFolder = path.resolve(process.cwd(), 'output', 'Images')
    const zipFilePath = path.resolve(
      process.cwd(),
      'output',
      `${uniqueName}.zip`,
    )

    DirectoryService.ensureDirectoryExists(outputFolder)

    const videoDuration = await this.frameExtractor.getVideoDuration(videoPath)
    const videoInfo = new VideoInformation(videoPath, videoDuration)
    const video = new Video(videoInfo)

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
