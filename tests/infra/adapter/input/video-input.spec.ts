import path from 'node:path'
import readline from 'node:readline'

import { beforeEach, describe, expect, it, vi } from 'vitest'

import { getVideoInput } from '@/infra/adapter/input/cli/video-input'

vi.mock('readline')
vi.mock('node:path')

describe('getVideoInput', () => {
  const mockQuestion = vi.fn()

  beforeEach(() => {
    vi.mocked(readline.createInterface).mockReturnValue({
      question: mockQuestion,
      close: vi.fn(),
    } as never)

    vi.mocked(path.resolve).mockImplementation((...args) => args.join('/'))

    vi.spyOn(process, 'cwd').mockReturnValue('/test')
  })

  it('should use default values when pressing enter', async () => {
    mockQuestion
      .mockImplementationOnce((_, cb) => cb(''))
      .mockImplementationOnce((_, cb) => cb(''))
      .mockImplementationOnce((_, cb) => cb(''))

    const result = await getVideoInput()

    expect(result).toEqual({
      videoPath: '/test/global/Marvel_DOTNET_CSHARP.mp4',
      startTime: 0,
      endTime: null,
    })
  })

  it('should accept custom values', async () => {
    mockQuestion
      .mockImplementationOnce((_, cb) => cb('custom.mp4'))
      .mockImplementationOnce((_, cb) => cb('10'))
      .mockImplementationOnce((_, cb) => cb('20'))

    const result = await getVideoInput()

    expect(result).toEqual({
      videoPath: '/test/custom.mp4',
      startTime: 10,
      endTime: 20,
    })
  })

  it('should throw error for invalid video path', async () => {
    mockQuestion.mockImplementationOnce((_, cb) => cb('invalid.txt'))

    await expect(getVideoInput()).rejects.toThrow('Path must end with ".mp4"')
  })

  it('should handle invalid time inputs', async () => {
    mockQuestion
      .mockImplementationOnce((_, cb) => cb('video.mp4'))
      .mockImplementationOnce((_, cb) => cb('invalid'))
      .mockImplementationOnce((_, cb) => cb('invalid'))

    const result = await getVideoInput()

    expect(result).toEqual({
      videoPath: '/test/video.mp4',
      startTime: 0,
      endTime: 0,
    })
  })

  it('should handle negative time inputs', async () => {
    mockQuestion
      .mockImplementationOnce((_, cb) => cb('video.mp4'))
      .mockImplementationOnce((_, cb) => cb('-5'))
      .mockImplementationOnce((_, cb) => cb('-10'))

    const result = await getVideoInput()

    expect(result).toEqual({
      videoPath: '/test/video.mp4',
      startTime: 0,
      endTime: 0,
    })
  })
})
