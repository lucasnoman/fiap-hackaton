import { VideoStatus } from '../value-objects/video-status'

export class ProcessedVideoEvent {
  constructor(
    public readonly videoPath: string,
    public readonly status: VideoStatus,
  ) {}
}
