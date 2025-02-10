import { ProcessedVideoEvent } from '@/core/domain/video-processing/events/processed-video-event'
import { VideoRepository } from '@/core/domain/video-processing/ports/repository-port'

export class ProcessedVideoEventHandler {
  constructor(private readonly videoRepository: VideoRepository) {}

  async handle(event: ProcessedVideoEvent) {
    const video = await this.videoRepository.findByFilename(event.filename)
    if (!video) {
      throw new Error('Video not found')
    }

    video.setStatus(event.status)
    await this.videoRepository.update(video)
    console.log(`Video ${event.filename} processed with status ${event.status}`)
  }
}
