import { Video } from '../entities/video'

export interface FrameExtractorPort {
  extractFrames(
    video: Video,
    interval: number,
    outputFolder: string,
    size: string,
  ): Promise<void>

  getVideoDuration(filePath: string): Promise<number>
}
