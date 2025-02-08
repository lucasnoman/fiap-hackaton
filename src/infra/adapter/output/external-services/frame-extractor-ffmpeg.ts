import ffmpegPath from 'ffmpeg-static'
import ffprobe from 'ffprobe-static'
import ffmpeg from 'fluent-ffmpeg'

import { Video } from '@/core/domain/video-processing/entities/video'
import { FrameExtractorPort } from '@/core/domain/video-processing/ports/frame-extractor-port'
import { uniqueName } from '@/shared/utils/unique-name-creator'

export class FrameExtractorFfmpeg implements FrameExtractorPort {
  constructor() {
    if (ffmpegPath) ffmpeg.setFfmpegPath(ffmpegPath)
    else throw new Error('FFmpeg not found')

    if (ffprobe.path) ffmpeg.setFfprobePath(ffprobe.path)
    else throw new Error('FFprobe not found')
  }

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

    const duration = actualEnd - start
    await new Promise<void>((resolve, reject) => {
      ffmpeg(video.info.path)
        .setStartTime(start)
        .setDuration(duration)
        .outputOptions(`-vf fps=1/${interval},scale=${size}`)
        .outputOptions('-qscale:v 2')
        .output(`${outputFolder}/${uniqueName}__frame_at_%04d.jpg`)
        .on('end', () => resolve())
        .on('error', reject)
        .run()
    })
  }
}
