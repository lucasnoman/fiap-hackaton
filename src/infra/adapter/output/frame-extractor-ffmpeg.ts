import ffmpeg from 'fluent-ffmpeg'

import { Video } from '@/core/domain/video-processing/entities/video'
import { FrameExtractorPort } from '@/core/domain/video-processing/ports/frame-extractor-port'

export class FrameExtractorFfmpeg implements FrameExtractorPort {
  getVideoDuration(videoPath: string): Promise<number> {
    return new Promise((resolve, reject) => {
      ffmpeg.ffprobe(videoPath, (err, metadata) => {
        if (err) return reject(err)
        resolve(metadata.format.duration || 0)
      })
    })
  }

  async extractFrames(
    video: Video,
    interval: number,
    outputFolder: string,
    size: string,
    start: number = 0,
    end: number | null = null,
  ): Promise<void> {
    const actualEnd = end ?? video.info.duration

    for (
      let currentTime = start;
      currentTime < actualEnd;
      currentTime += interval
    ) {
      console.log(`Processando frame: ${currentTime} segundos`)

      await new Promise<void>((resolve, reject) => {
        ffmpeg(video.info.path)
          .on('end', () => resolve())
          .on('error', (err: Error) => reject(err))
          .screenshots({
            timestamps: [currentTime],
            filename: `frame_at_${currentTime}.jpg`,
            folder: outputFolder,
            size: size,
          })
      })
    }
  }
}
