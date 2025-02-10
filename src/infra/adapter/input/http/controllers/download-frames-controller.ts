import { FastifyReply, FastifyRequest } from 'fastify'

import { makeFramesDownload } from '@/infra/adapter/factories/make-frames-download'

interface DownloadFramesParams {
  filename: string
}

export async function downloadFramesController(
  request: FastifyRequest<{ Params: DownloadFramesParams }>,
  reply: FastifyReply,
) {
  try {
    const { filename } = request.params
    const downloadFramesUseCase = await makeFramesDownload()
    const zipBuffer = await downloadFramesUseCase.execute(filename)

    reply.header(
      'Content-Disposition',
      `attachment; filename="${filename.split('.')[0]}-frames.zip"`,
    )
    reply.type('application/zip')
    return reply.send(zipBuffer)
  } catch (error) {
    console.error('Error downloading frames:', error)
    return reply.status(500).send({
      error: 'Failed to download frames',
      details:
        error instanceof Error ? error.message : 'Unknown error occurred',
    })
  }
}
