import path from 'node:path'

import { ProcessVideoUseCase } from './core/application/video-processing/use-cases/process-video-use-case'
import { getVideoInput } from './infra/adapter/input/video-input'
import { FrameExtractorFfmpeg } from './infra/adapter/output/frame-extractor-ffmpeg'
import { ZipCreatorArchiver } from './infra/adapter/output/zip-creator-archiver'

import { AuthUseCase  } from './core/application/authentication/use-cases/auth-use-case'

;(async () => {
  console.log('Process started...')

  try {

    const authUseCase = new AuthUseCase()
    const username = 'exampleUser';
    const password = 'examplePassword';
    const token = await authUseCase.authenticateUser(username, password)
    console.log('Autenticação bem-sucedida. Token: ', token);



    const { videoPath, startTime, endTime } = await getVideoInput()

    const outputFolder = path.resolve(process.cwd(), 'output', 'Images')
    const zipFilePath = path.resolve(process.cwd(), 'output', 'images.zip')

    const frameExtractor = new FrameExtractorFfmpeg()
    const zipCreator = new ZipCreatorArchiver()

    const useCase = new ProcessVideoUseCase(frameExtractor, zipCreator)
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
