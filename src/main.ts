import path from 'node:path'

import { ProcessVideoUseCase } from './core/application/video-processing/use-cases/process-video-use-case'
import { FrameExtractorFfmpeg } from './infra/adapter/output/frame-extractor-ffmpeg'
import { ZipCreatorArchiver } from './infra/adapter/output/zip-creator-archiver'

console.log('Processo iniciado:')
;(async () => {
  const videoPath = path.resolve(
    process.cwd(),
    'global',
    'Marvel_DOTNET_CSHARP.mp4',
  )
  const outputFolder = path.resolve(process.cwd(), 'output', 'Images')
  const zipFilePath = path.resolve(process.cwd(), 'output', 'images.zip')
  const interval = 20 // in seconds
  const size = '1920x1080'

  console.log(`\nVideo localizado em: ${videoPath}`)
  console.log(`Frames serão armazenados em: ${outputFolder}`)
  console.log(`Arquivo ZIP será salvo em: ${zipFilePath}\n`)

  // Initialize dependencies
  const frameExtractor = new FrameExtractorFfmpeg()
  const zipCreator = new ZipCreatorArchiver()

  // Use case execution
  const useCase = new ProcessVideoUseCase(frameExtractor, zipCreator)

  try {
    console.log('Preparando diretórios...\n')
    await useCase.execute(videoPath, outputFolder, zipFilePath, interval, size)
    console.log('\nProcesso finalizado com sucesso.')
  } catch (error) {
    console.error('Erro durante o processamento:', error)
  }
})()
