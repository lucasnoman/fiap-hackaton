import { VideoInformation } from '../value-objects/video-information'

export class Video {
  //TODO: Frame entity
  //TODO: add props for frames
  constructor(
    //TODO: Add value objects for has a unique path
    public readonly info: VideoInformation,
    //TODO: Add extension value object
  ) {
    if (info.duration < 0) {
      throw new Error('Invalid video duration')
    }
  }
}
