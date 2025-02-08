import { promises as fs } from 'node:fs'
import path from 'node:path'

import { Video } from '@/core/domain/video-processing/entities/video'
import { FrameExtractorPort } from '@/core/domain/video-processing/ports/frame-extractor-port'
import { VideoRepository } from '@/core/domain/video-processing/ports/repository-port'
import { VideoProcessingEvents } from '@/core/domain/video-processing/value-objects/events-enum'
import { VideoInformation } from '@/core/domain/video-processing/value-objects/video-information'

import { MessageQueuePort } from '../../queue/ports/message-queue-port'
import { StoragePort } from '../../storage/ports/storage-port'

export type ExtractFramesEventPayload = {
  filename: string
  intervalInSecondsToExtractFrames: number
  imageSize: string
  secondsStartExtractingFrames: number
  secondsEndExtractingFrames: number | null
  storagePath: string
}

type ProcessVideoMethod = {
  filename: string
  intervalInSecondsToExtractFrames: number
  imageSize: string
  secondsStartExtractingFrames: number
  secondsEndExtractingFrames: number | null
  queueName: string
}

export class ProcessVideoOnQueueUseCase {
  constructor(
    private readonly frameExtractor: FrameExtractorPort,
    private readonly queue: MessageQueuePort,
    private readonly storage: StoragePort,
    private readonly videoRepository: VideoRepository,
  ) {}

  async execute({
    filename,
    intervalInSecondsToExtractFrames,
    imageSize,
    secondsStartExtractingFrames,
    secondsEndExtractingFrames,
    queueName,
  }: ProcessVideoMethod): Promise<void> {
    const videoPath = path.resolve(
      process.cwd(),
      'global',
      'uploaded-videos',
      filename,
    )

    const videoDuration = await this.frameExtractor.getVideoDuration(videoPath)
    const videoInfo = VideoInformation.create(
      videoPath,
      filename,
      videoDuration,
    )
    const video = new Video(videoInfo)

    const storageFolder = 'videos'
    const storageVideoPath = `${storageFolder}/${filename}`

    const fileContent = await fs.readFile(videoPath)

    await this.storage.store(storageVideoPath, fileContent)
    await this.videoRepository.save(video)

    await this.queue.publish<ExtractFramesEventPayload>(queueName, {
      event: VideoProcessingEvents.EXTRACT_FRAMES,
      timestamp: Date.now(),
      payload: {
        storagePath: storageVideoPath,
        filename,
        imageSize,
        intervalInSecondsToExtractFrames,
        secondsStartExtractingFrames,
        secondsEndExtractingFrames,
      },
    })
  }
}
