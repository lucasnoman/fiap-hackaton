import {
  VideoMetadata,
  VideoRest,
  VideoStoragePort,
} from '@/core/domain/video-processing/ports/send-video-port'

export class UploadVideoService {
  private readonly ALLOWED_MIMETYPES = [
    'video/mp4',
    'video/webm',
    'video/quicktime',
    'video/x-msvideo',
  ]

  constructor(private videoStorage: VideoStoragePort) {}

  async execute(video: VideoRest): Promise<VideoMetadata> {
    if (!this.ALLOWED_MIMETYPES.includes(video.mimetype)) {
      throw new Error(`Invalid file type: ${video.mimetype}`)
    }

    return this.videoStorage.save(video)
  }

  async cleanUp(video: VideoMetadata): Promise<void> {
    return this.videoStorage.delete(video)
  }
}
