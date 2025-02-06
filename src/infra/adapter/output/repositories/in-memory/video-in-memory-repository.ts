import { Video } from '@/core/domain/video-processing/entities/video'
import { VideoRepository } from '@/core/domain/video-processing/ports/repository-port'

type InMemoryVideo = {
  id: number
  filename: string
  duration: number
}

export class VideoInMemoryRepository implements VideoRepository {
  private videos: InMemoryVideo[] = []
  private currentId = 1

  mapToDomain(data: InMemoryVideo): Video {
    return new Video(data.filename, data.duration)
  }

  mapToRepository(video: Video): InMemoryVideo {
    return {
      id: this.currentId,
      filename: video.path,
      duration: video.duration,
    }
  }

  async save(video: Video): Promise<void> {
    this.videos.push({
      id: this.currentId++,
      filename: video.path,
      duration: video.duration,
    })
  }

  async update(video: Video): Promise<void> {
    const index = this.videos.findIndex((v) => v.filename === video.path)

    if (index === -1) throw new Error('Video not found')

    this.videos[index] = {
      ...this.videos[index],
      filename: video.path,
      duration: video.duration,
    }
  }

  async deleteById(id: number): Promise<void> {
    const index = this.videos.findIndex((v) => v.id === id)
    if (index !== -1) {
      this.videos.splice(index, 1)
    }
  }

  async findByFilename(filename: string): Promise<Video | null> {
    const video = this.videos.find((v) => v.filename === filename)
    if (!video) return null
    return this.mapToDomain(video)
  }

  async findAll(): Promise<Video[]> {
    return this.videos.map((video) => this.mapToDomain(video))
  }
}
