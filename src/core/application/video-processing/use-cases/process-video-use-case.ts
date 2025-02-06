import { promises as fs } from 'node:fs'

import { Video } from '@/core/domain/video-processing/entities/video'
import { VideoRepository } from '@/core/domain/video-processing/ports/repository-port'
import { VideoProcessingEvents } from '@/core/domain/video-processing/value-objects/events-enum'
import { VideoInformation } from '@/core/domain/video-processing/value-objects/video-information'

import { MessageQueuePort } from '../../queue/ports/message-queue-port'
import { StoragePort } from '../../storage/ports/storage-port'

export class ProcessVideoUseCase {
  constructor(
    // private readonly frameExtractor: FrameExtractorPort,
    // private readonly zipCreator: ZipCreatorPort,
    private readonly queue: MessageQueuePort,
    private readonly storage: StoragePort,
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
    queueName: string,
  ): Promise<void> {
    const filename = `${Date.now()}-${Math.random().toString(36).substring(2, 15)}.${videoPath
      .split('.')
      .pop()}`

    // const videoDuration = await this.frameExtractor.getVideoDuration(videoPath)
    const videoDuration = 0
    const info = new VideoInformation(filename, videoDuration)
    const video = new Video(info)

    const fileContent = await fs.readFile(videoPath)

    const storagePath = `videos/${filename}`

    await this.storage.store(storagePath, fileContent)

    await this.videoRepository.save(video)

    const outputFolderPath = `/tmp/frames/${filename.split('.')[0]}`

    //TODO: refactor to use event bus
    await this.queue.publish(queueName, {
      event: VideoProcessingEvents.EXTRACT_FRAMES,
      timestamp: Date.now(),
      payload: {
        videoPath: storagePath,
        outputFolder: outputFolderPath,
        zipFilePath,
        interval,
        imageSize,
        startTime,
        endTime,
      },
    })

    // await this.frameExtractor.extractFrames(
    //   video,
    //   interval,
    //   outputFolder,
    //   imageSize,
    //   startTime,
    //   endTime,
    // )

    // await this.zipCreator.createZip(outputFolder, zipFilePath)
  }
}
