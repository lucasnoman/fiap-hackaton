import { Video } from '@/core/domain/video-processing/entities/video'
import { VideoRepository } from '@/core/domain/video-processing/ports/repository-port'

export class ListVideosUseCase {
  constructor(private readonly videoRepository: VideoRepository) {}

  async execute(): Promise<Video[]> {
    return await this.videoRepository.findAll()
  }
}
