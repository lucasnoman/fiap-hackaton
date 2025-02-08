import { ProcessedVideoEvent } from '@/core/domain/video-processing/events/processed-video-event'
import { VideoRepository } from '@/core/domain/video-processing/ports/repository-port'

export class ProcessedVideoEventHandler {
  constructor(private readonly videoRepository: VideoRepository) {}

  async handle(event: ProcessedVideoEvent) {
    const video = await this.videoRepository.findByFilename(event.videoPath)
    if (!video) {
      throw new Error('Video not found')
    }

    // TODO: update video status add column on migrations
    // video.status = event.status
    await this.videoRepository.save(video)
  }
}
