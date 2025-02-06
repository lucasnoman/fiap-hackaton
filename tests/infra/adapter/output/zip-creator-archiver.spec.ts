import fs from 'node:fs'

import archiver from 'archiver'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import { ZipCreatorArchiver } from '@/infra/adapter/output/persistence/zip-creator-archiver'

vi.mock('node:fs')
vi.mock('archiver')

describe('ZipCreatorArchiver', () => {
  let zipCreator: ZipCreatorArchiver
  const mockWriteStream = {
    on: vi.fn(),
  }
  const mockArchive = {
    on: vi.fn(),
    pipe: vi.fn(),
    directory: vi.fn(),
    finalize: vi.fn(),
  }

  beforeEach(() => {
    vi.resetAllMocks()
    zipCreator = new ZipCreatorArchiver()
    vi.mocked(fs.createWriteStream).mockReturnValue(mockWriteStream as never)
    vi.mocked(archiver).mockReturnValue(mockArchive as never)
    mockArchive.on.mockReturnValue(mockArchive)
    mockArchive.pipe.mockReturnValue(mockArchive)
  })

  it('should create zip file successfully', async () => {
    mockWriteStream.on.mockImplementation((event, callback) => {
      if (event === 'close') setTimeout(callback, 0)
    })

    await zipCreator.createZip('/source', 'output.zip')

    expect(fs.createWriteStream).toHaveBeenCalledWith('output.zip')
    expect(archiver).toHaveBeenCalledWith('zip', { zlib: { level: 9 } })
    expect(mockArchive.pipe).toHaveBeenCalledWith(mockWriteStream)
    expect(mockArchive.directory).toHaveBeenCalledWith('/source', false)
    expect(mockArchive.finalize).toHaveBeenCalled()
  })

  it('should handle archiver errors', async () => {
    const error = new Error('Archive failed')
    mockArchive.on.mockImplementation((event, callback) => {
      if (event === 'error') setTimeout(() => callback(error), 0)
      return mockArchive
    })

    await expect(zipCreator.createZip('/source', 'output.zip')).rejects.toThrow(
      'Archive failed',
    )
  })
})
