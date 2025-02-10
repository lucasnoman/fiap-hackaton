import ffmpeg from 'fluent-ffmpeg'
import { describe, expect, it, vi } from 'vitest'

import { Video } from '@/core/domain/video-processing/entities/video'
import { VideoStatus } from '@/core/domain/video-processing/value-objects/video-status'
import { FrameExtractorFfmpeg } from '@/infra/adapter/output/external-services/frame-extractor-ffmpeg'

vi.mock('fluent-ffmpeg')

describe('FrameExtractorFfmpeg', () => {
  const frameExtractor = new FrameExtractorFfmpeg()

  describe('getVideoDuration', () => {
    it('should return the video duration', async () => {
      const videoPath = 'test.mp4'
      const duration = 120
      ffmpeg.ffprobe = vi.fn((path, callback) => {
        callback(null, { format: { duration } })
      })

      const result = await frameExtractor.getVideoDuration(videoPath)
      expect(result).toBe(duration)
    })

    it('should reject if ffprobe fails', async () => {
      const videoPath = 'test.mp4'
      const error = new Error('ffprobe error')
      ffmpeg.ffprobe = vi.fn((path, callback) => {
        callback(error, null)
      })

      await expect(frameExtractor.getVideoDuration(videoPath)).rejects.toThrow(
        error,
      )
    })
  })

  describe('extractFrames', () => {
    it('should handle errors during frame extraction', async () => {
      const video = new Video(
        {
          path: 'test.mp4',
          filename: 'test.mp4',
          duration: 120,
        },
        VideoStatus.PROCESSING,
      )

      const error = new Error('ffmpeg error')
      const mockFfmpeg = {
        setStartTime: vi.fn().mockReturnThis(),
        setDuration: vi.fn().mockReturnThis(),
        outputOptions: vi.fn().mockReturnThis(),
        output: vi.fn().mockReturnThis(),
        on: vi.fn((event, callback) => {
          if (event === 'error') callback(error)
          return mockFfmpeg
        }),
        run: vi.fn(),
      }

      // eslint-disable-next-line @typescript-eslint/no-unsafe-function-type
      const ffmpegMock = ffmpeg as unknown as { mockReturnValue: Function }
      ffmpegMock.mockReturnValue(mockFfmpeg)

      await expect(
        frameExtractor.extractFrames(video, 10, 'output', '320x240', 0, 30),
      ).rejects.toThrow('ffmpeg error')
    })
  })
})
