import { Video } from '../entities/video'

export interface VideoRepository {
  mapToDomain(data: unknown): Video

  mapToRepository(video: Video): unknown

  save(video: Video): Promise<void>

  update(video: Video): Promise<void>

  deleteById(id: number): Promise<void>

  findByFilename(filename: string): Promise<Video | null>

  findAll(): Promise<Video[]>
}
