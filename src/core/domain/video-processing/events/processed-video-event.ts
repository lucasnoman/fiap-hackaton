import { VideoStatus } from '../value-objects/video-status'

export class ProcessedVideoEvent {
  constructor(
    public readonly filename: string,
    public readonly status: VideoStatus,
  ) {}
}
