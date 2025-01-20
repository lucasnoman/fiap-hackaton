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

  extractFrames(
    video: Video,
    interval: number,
    outputFolder: string,
    size: string,
  ): Promise<void> {
    return new Promise((resolve, reject) => {
      try {
        for (
          let currentTime = 0;
          currentTime < video.duration;
          currentTime += interval
        ) {
          console.log(`Processando frame: ${currentTime} segundos`)

          new Promise<void>((frameResolve, frameReject) => {
            ffmpeg(video.path)
              .on('end', () => frameResolve())
              .on('error', (err: Error) => frameReject(err))
              .screenshots({
                timestamps: [currentTime],
                filename: `frame_at_${currentTime}.jpg`,
                folder: outputFolder,
                size: size,
              })
          })
        }
        resolve()
      } catch (error) {
        reject(error)
      }
    })
  }
}
