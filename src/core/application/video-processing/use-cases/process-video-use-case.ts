import { Video } from '@/core/domain/video-processing/entities/video'
import { VideoRepository } from '@/core/domain/video-processing/ports/repository-port'
import { VideoProcessingEvents } from '@/core/domain/video-processing/value-objects/events-enum'
import { VideoInformation } from '@/core/domain/video-processing/value-objects/video-information'

import { MessageQueuePort } from '../../queue/ports/message-queue-port'
import { DirectoryService } from '../services/directory-service'

export class ProcessVideoUseCase {
  constructor(
    // private readonly frameExtractor: FrameExtractorPort,
    // private readonly zipCreator: ZipCreatorPort,
    private readonly queue: MessageQueuePort,
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
    DirectoryService.ensureDirectoryExists(outputFolder)

    // const videoDuration = await this.frameExtractor.getVideoDuration(videoPath)
    const videoDuration = 0
    const info = new VideoInformation(videoPath, videoDuration)
    const video = new Video(info)

    await this.videoRepository.save(video)

    //TODO: refactor to use event bus
    await this.queue.publish(queueName, {
      event: VideoProcessingEvents.EXTRACT_FRAMES,
      timestamp: Date.now(),
      payload: {
        videoPath,
        outputFolder,
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
