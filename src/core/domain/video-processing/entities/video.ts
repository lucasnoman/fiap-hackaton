import { VideoInformation } from '../value-objects/video-information'
import { VideoStatus } from '../value-objects/video-status'

export class Video {
  //TODO: Frame entity
  //TODO: add props for frames
  constructor(
    //TODO: Add value objects for has a unique path
    public readonly info: VideoInformation,
    public readonly status: VideoStatus,
    //TODO: Add extension value object
  ) {
    if (info.duration < 0) {
      throw new Error('Invalid video duration')
    }
  }
}
