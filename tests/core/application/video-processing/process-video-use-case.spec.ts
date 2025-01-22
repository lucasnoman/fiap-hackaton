import { beforeEach, describe, expect, it, vi } from 'vitest'

import { DirectoryService } from '@/core/application/video-processing/services/directory-service'
import { ProcessVideoUseCase } from '@/core/application/video-processing/use-cases/process-video-use-case'
import { Video } from '@/core/domain/video-processing/entities/video'
import { FrameExtractorPort } from '@/core/domain/video-processing/ports/frame-extractor-port'
import { ZipCreatorPort } from '@/core/domain/video-processing/ports/zip-creator-port'

describe('ProcessVideoUseCase', () => {
  let frameExtractor: FrameExtractorPort
  let zipCreator: ZipCreatorPort
  let processVideoUseCase: ProcessVideoUseCase

  beforeEach(() => {
    frameExtractor = {
      extractFrames: vi.fn(),
      getVideoDuration: vi.fn(),
    }

    zipCreator = {
      createZip: vi.fn(),
    }

    processVideoUseCase = new ProcessVideoUseCase(frameExtractor, zipCreator)
    vi.spyOn(DirectoryService, 'ensureDirectoryExists').mockImplementation(
      () => {},
    )
  })

  it('should successfully process a video and create a zip file', async () => {
    const videoPath = 'test-video.mp4'
    const outputFolder = 'output/test'
    const zipFilePath = 'output/test.zip'
    const interval = 1
    const imageSize = '1280x720'
    const startTime = 0
    const endTime = 10
    const mockDuration = 60

    vi.mocked(frameExtractor.getVideoDuration).mockResolvedValue(mockDuration)

    await processVideoUseCase.execute(
      videoPath,
      outputFolder,
      zipFilePath,
      interval,
      imageSize,
      startTime,
      endTime,
    )

    expect(DirectoryService.ensureDirectoryExists).toHaveBeenCalledWith(
      outputFolder,
    )
    expect(frameExtractor.getVideoDuration).toHaveBeenCalledWith(videoPath)
    expect(frameExtractor.extractFrames).toHaveBeenCalledWith(
      expect.any(Video),
      interval,
      outputFolder,
      imageSize,
      startTime,
      endTime,
    )
    expect(zipCreator.createZip).toHaveBeenCalledWith(outputFolder, zipFilePath)
  })

  it('should handle video processing with null endTime', async () => {
    const videoPath = 'test-video.mp4'
    const outputFolder = 'output/test'
    const zipFilePath = 'output/test.zip'
    const interval = 1
    const imageSize = '1280x720'
    const startTime = 0
    const endTime = null
    const mockDuration = 30

    vi.mocked(frameExtractor.getVideoDuration).mockResolvedValue(mockDuration)

    await processVideoUseCase.execute(
      videoPath,
      outputFolder,
      zipFilePath,
      interval,
      imageSize,
      startTime,
      endTime,
    )

    expect(DirectoryService.ensureDirectoryExists).toHaveBeenCalledWith(
      outputFolder,
    )
    expect(frameExtractor.getVideoDuration).toHaveBeenCalledWith(videoPath)
    expect(frameExtractor.extractFrames).toHaveBeenCalledWith(
      expect.any(Video),
      interval,
      outputFolder,
      imageSize,
      startTime,
      endTime,
    )
    expect(zipCreator.createZip).toHaveBeenCalledWith(outputFolder, zipFilePath)
  })
})
