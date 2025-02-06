import { PrismaClient, Video as PrismaVideo } from '@prisma/client'

import { Video } from '@/core/domain/video-processing/entities/video'
import { VideoRepository } from '@/core/domain/video-processing/ports/repository-port'
import { VideoInformation } from '@/core/domain/video-processing/value-objects/video-information'

type PrismaVideoData = Omit<PrismaVideo, 'id' | 'createdAt' | 'updatedAt'>

export class VideoPrismaRepository implements VideoRepository {
  constructor(private readonly prisma: PrismaClient) {}

  mapToDomain(data: PrismaVideo): Video {
    const info = VideoInformation.create(data.filename, data.duration)

    return new Video(info)
  }

  mapToRepository(video: Video): PrismaVideoData {
    return {
      duration: video.info.duration,
      filename: video.info.path,
    }
  }

  async save(video: Video): Promise<void> {
    const data = this.mapToRepository(video)
    await this.prisma.video.create({ data })
  }

  async update(video: Video): Promise<void> {
    const data = this.mapToRepository(video)

    const videoData = await this.prisma.video.findFirst({
      where: { filename: video.info.path },
    })

    if (!videoData) throw new Error('Video not found')

    await this.prisma.video.update({
      where: { id: videoData.id },
      data,
    })
  }

  async deleteById(id: number): Promise<void> {
    await this.prisma.video.delete({ where: { id } })
  }

  async findByFilename(filename: string): Promise<Video | null> {
    const data = await this.prisma.video.findFirst({ where: { filename } })
    if (!data) return null
    return this.mapToDomain(data)
  }

  async findAll(): Promise<Video[]> {
    const data = await this.prisma.video.findMany()
    return Promise.all(data.map(this.mapToDomain))
  }
}
