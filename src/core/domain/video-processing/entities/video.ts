import { VideoInformation } from '../value-objects/video-information'
import { VideoStatus } from '../value-objects/video-status'

export class Video {
  public info: VideoInformation
  public status: VideoStatus

  //TODO: Frame entity
  //TODO: add props for frames
  constructor(
    //TODO: Add value objects for has a unique path
    info: VideoInformation,
    status: VideoStatus,
    //TODO: Add extension value object
  ) {
    if (info.duration < 0) {
      throw new Error('Invalid video duration')
    }

    this.info = info
    this.status = status
  }

  setStatus(status: VideoStatus) {
    this.status = status
  }
}
