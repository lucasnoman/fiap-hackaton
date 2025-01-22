import { describe, expect, it } from 'vitest'

import { Video } from '@/core/domain/video-processing/entities/video'

describe('Video Entity', () => {
  it('should create a valid Video instance', () => {
    const video = new Video('/path/to/video.mp4', 120)

    expect(video.path).toBe('/path/to/video.mp4')
    expect(video.duration).toBe(120)
  })

  it('should throw an error if duration is negative', () => {
    expect(() => new Video('/path/to/video.mp4', -10)).toThrowError(
      'Invalid video duration',
    )
  })
})
