import path from 'node:path'

import { beforeEach, describe, expect, it, vi } from 'vitest'

import { DirectoryService } from '@/core/application/video-processing/services/directory-service'
import { ProcessVideoUseCase } from '@/core/application/video-processing/use-cases/process-video-use-case'
import { Video } from '@/core/domain/video-processing/entities/video'
import { FrameExtractorPort } from '@/core/domain/video-processing/ports/frame-extractor-port'
import { ZipCreatorPort } from '@/core/domain/video-processing/ports/zip-creator-port'
import { VideoInMemoryRepository } from '@/infra/adapter/output/repositories/in-memory/video-in-memory-repository'
import { uniqueName } from '@/shared/utils/unique-name-creator'

describe('ProcessVideoUseCase', () => {
  let frameExtractor: FrameExtractorPort
  let zipCreator: ZipCreatorPort
  let processVideoUseCase: ProcessVideoUseCase

  const OUTPUTFOLDER = path.resolve(process.cwd(), 'output', 'Images')
  const ZIPFILEPATH = path.resolve(process.cwd(), 'output', `${uniqueName}.zip`)
  const VIDEOPATH = 'test-video.mp4'
  const INTERVALINSECONDSTOEXTRACTFRAMES = 1
  const IMAGESIZE = '1280x720'
  const SECONDSSTARTEXTRACTINGFRAMES = 0
  const SECONDSENDEXTRACTINGFRAMES = 10
  const MOCKDURATION = 60

  beforeEach(() => {
    frameExtractor = {
      extractFrames: vi.fn(),
      getVideoDuration: vi.fn(),
    }

    zipCreator = {
      createZip: vi.fn(),
    }

    const videoRepository = new VideoInMemoryRepository()

    processVideoUseCase = new ProcessVideoUseCase(
      frameExtractor,
      zipCreator,
      videoRepository,
    )
    vi.spyOn(DirectoryService, 'ensureDirectoryExists').mockImplementation(
      () => {},
    )
  })

  it('should successfully process a video and create a zip file', async () => {
    vi.mocked(frameExtractor.getVideoDuration).mockResolvedValue(MOCKDURATION)

    await processVideoUseCase.execute({
      videoPath: VIDEOPATH,
      intervalInSecondsToExtractFrames: INTERVALINSECONDSTOEXTRACTFRAMES,
      imageSize: IMAGESIZE,
      secondsStartExtractingFrames: SECONDSSTARTEXTRACTINGFRAMES,
      secondsEndExtractingFrames: SECONDSENDEXTRACTINGFRAMES,
    })

    expect(DirectoryService.ensureDirectoryExists).toHaveBeenCalledWith(
      OUTPUTFOLDER,
    )
    expect(frameExtractor.getVideoDuration).toHaveBeenCalledWith(VIDEOPATH)
    expect(frameExtractor.extractFrames).toHaveBeenCalledWith(
      expect.any(Video),
      INTERVALINSECONDSTOEXTRACTFRAMES,
      OUTPUTFOLDER,
      IMAGESIZE,
      SECONDSSTARTEXTRACTINGFRAMES,
      SECONDSENDEXTRACTINGFRAMES,
    )
    expect(zipCreator.createZip).toHaveBeenCalledWith(OUTPUTFOLDER, ZIPFILEPATH)
  })

  it('should handle video processing with null endTime', async () => {
    vi.mocked(frameExtractor.getVideoDuration).mockResolvedValue(MOCKDURATION)

    await processVideoUseCase.execute({
      videoPath: VIDEOPATH,
      intervalInSecondsToExtractFrames: INTERVALINSECONDSTOEXTRACTFRAMES,
      imageSize: IMAGESIZE,
      secondsStartExtractingFrames: SECONDSSTARTEXTRACTINGFRAMES,
      secondsEndExtractingFrames: SECONDSENDEXTRACTINGFRAMES,
    })

    expect(DirectoryService.ensureDirectoryExists).toHaveBeenCalledWith(
      OUTPUTFOLDER,
    )
    expect(frameExtractor.getVideoDuration).toHaveBeenCalledWith(VIDEOPATH)
    expect(frameExtractor.extractFrames).toHaveBeenCalledWith(
      expect.any(Video),
      INTERVALINSECONDSTOEXTRACTFRAMES,
      OUTPUTFOLDER,
      IMAGESIZE,
      SECONDSSTARTEXTRACTINGFRAMES,
      SECONDSENDEXTRACTINGFRAMES,
    )
    expect(zipCreator.createZip).toHaveBeenCalledWith(OUTPUTFOLDER, ZIPFILEPATH)
  })
})
