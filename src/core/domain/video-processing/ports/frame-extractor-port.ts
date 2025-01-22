import { Video } from '../entities/video'

export interface FrameExtractorPort {
  extractFrames(
    video: Video,
    interval: number,
    outputFolder: string,
    imageSize: string,
    startTimInSeconds: number,
    endTimeInSeconds: number | null,
  ): Promise<void>

  getVideoDuration(filePath: string): Promise<number>
}
