import ffmpeg from 'fluent-ffmpeg'
import fs from 'node:fs'
import path from 'node:path'
import archiver from 'archiver'

console.log('Processo iniciado:')

const videoPath = path.resolve(process.cwd(), 'global', 'Marvel_DOTNET_CSHARP.mp4')
const outputFolder = path.resolve(process.cwd(), 'output', 'Images')
const zipFilePath = path.resolve(process.cwd(), 'output', 'images.zip')

// Ensure output directory exists
if (!fs.existsSync(outputFolder)) {
  fs.mkdirSync(outputFolder, { recursive: true })
}

// Get video duration
const getVideoDuration = (filePath: string): Promise<number> => {
  return new Promise((resolve, reject) => {
    ffmpeg.ffprobe(filePath, (err, metadata) => {
      if (err) return reject(err)
      resolve(metadata.format.duration || 0)
    })
  })
}

// Generate frames
const processFrames = async () => {
  try {
    const duration = await getVideoDuration(videoPath)
    const interval = 20 // in seconds
    const size = '1920x1080'

    for (let currentTime = 0; currentTime < duration; currentTime += interval) {
      console.log(`Processando frame: ${currentTime} segundos`)
      const outputPath = path.join(outputFolder, `frame_at_${currentTime}.jpg`)

      await new Promise<void>((resolve, reject) => {
        ffmpeg(videoPath)
          .on('end', () => resolve())
          .on('error', (err: Error) => reject(err))
          .screenshots({
            timestamps: [currentTime],
            filename: `frame_at_${currentTime}.jpg`,
            folder: outputFolder,
            size: size,
          })
      })
    }

    console.log('Frames processados.')
  } catch (error) {
    console.error('Erro ao processar frames:', error)
  }
}

// Create ZIP file
const createZip = () => {
  return new Promise<void>((resolve, reject) => {
    const output = fs.createWriteStream(zipFilePath)
    const archive = archiver('zip', { zlib: { level: 9 } })

    output.on('close', () => {
      console.log(`ZIP criado com sucesso: ${zipFilePath}`)
      resolve()
    })

    archive.on('error', (err) => reject(err))

    archive.pipe(output)
    archive.directory(outputFolder, false)
    archive.finalize()
  })
}

// Run the entire process
;(async () => {
  await processFrames()
  await createZip()
  console.log('Processo finalizado.')
})()
