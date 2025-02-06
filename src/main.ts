import path from 'node:path'

import { PrismaClient } from '@prisma/client'

import { ProcessVideoUseCase } from './core/application/video-processing/use-cases/process-video-use-case'
import { getVideoInput } from './infra/adapter/input/cli/video-input'
import { FrameExtractorFfmpeg } from './infra/adapter/output/external-services/frame-extractor-ffmpeg'
import { VideoPrismaRepository } from './infra/adapter/output/persistence/video-prisma-repository'
import { ZipCreatorArchiver } from './infra/adapter/output/persistence/zip-creator-archiver'
;(async () => {
  console.log('Process started...')

  try {
    const prisma = new PrismaClient()

    const { videoPath, startTime, endTime } = await getVideoInput()

    const outputFolder = path.resolve(process.cwd(), 'output', 'Images')
    const zipFilePath = path.resolve(process.cwd(), 'output', 'images.zip')

    const frameExtractor = new FrameExtractorFfmpeg()
    const zipCreator = new ZipCreatorArchiver()
    const videoRepository = new VideoPrismaRepository(prisma)

    const useCase = new ProcessVideoUseCase(
      frameExtractor,
      zipCreator,
      videoRepository,
    )
    await useCase.execute(
      videoPath,
      outputFolder,
      zipFilePath,
      20,
      '1920x1080',
      startTime,
      endTime,
    )

    console.log('Process completed successfully.')
  } catch (error) {
    console.error('An error occurred during the process:', error)
  }
})()
