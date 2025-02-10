import { UploadVideoService } from '@/core/application/video-processing/services/upload-video-service'
import { LocalVideoStorageAdapter } from '@/infra/adapter/output/persistence/local-video-storage'

export async function makeVideoUpload() {
  const storageAdapter = new LocalVideoStorageAdapter()
  const uploadVideoService = new UploadVideoService(storageAdapter)

  return uploadVideoService
}
