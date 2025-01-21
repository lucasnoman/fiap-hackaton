import path from 'node:path'

import { ProcessVideoUseCase } from './core/application/video-processing/use-cases/process-video-use-case'
import { getVideoPath } from './infra/adapter/input/video-input'
import { FrameExtractorFfmpeg } from './infra/adapter/output/frame-extractor-ffmpeg'
import { ZipCreatorArchiver } from './infra/adapter/output/zip-creator-archiver'

console.log('Processo iniciado:')
;(async () => {
  const videoPath = await getVideoPath()

  const outputFolder = path.resolve(process.cwd(), 'output', 'Images')
  const zipFilePath = path.resolve(process.cwd(), 'output', 'images.zip')

  console.log(`\nVideo localizado em: ${videoPath}`)
  console.log(`Frames serão armazenados em: ${outputFolder}`)
  console.log(`Arquivo ZIP será salvo em: ${zipFilePath}\n`)

  const frameExtractor = new FrameExtractorFfmpeg()
  const zipCreator = new ZipCreatorArchiver()

  const useCase = new ProcessVideoUseCase(frameExtractor, zipCreator)

  const interval = 20 // in seconds
  const size = '1920x1080'

  try {
    console.log('Preparando diretórios...\n')
    await useCase.execute(videoPath, outputFolder, zipFilePath, interval, size)
    console.log('\nProcesso finalizado com sucesso.')
  } catch (error) {
    console.error('\nErro durante o processamento:', error)
  }
})()
