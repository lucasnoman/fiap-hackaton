import { DownloadFramesUseCase } from '@/core/application/video-processing/use-cases/download-frames-use-case'
import { S3Adapter } from '@/infra/adapter/output/s3-adapter'
import { s3StorageConfig } from '@/infra/config/aws-services'

export async function makeFramesDownload() {
  const s3Storage = new S3Adapter(s3StorageConfig.bucketName)
  return new DownloadFramesUseCase(s3Storage)
}
