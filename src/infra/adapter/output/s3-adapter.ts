import {
  DeleteObjectCommand,
  GetObjectCommand,
  PutObjectCommand,
  S3Client,
} from '@aws-sdk/client-s3'

import { StoragePort } from '@/core/application/storage/ports/storage-port'

export class S3Adapter implements StoragePort {
  private readonly client: S3Client
  private readonly bucket: string

  constructor(bucket: string) {
    this.client = new S3Client({})
    this.bucket = bucket
  }

  async store(path: string, content: Buffer | string): Promise<void> {
    await this.client.send(
      new PutObjectCommand({
        Bucket: this.bucket,
        Key: path,
        Body: content,
      }),
    )
  }

  async retrieve(path: string): Promise<Buffer> {
    const response = await this.client.send(
      new GetObjectCommand({
        Bucket: this.bucket,
        Key: path,
      }),
    )
    if (!response.Body) {
      throw new Error('No body in response')
    }
    const body = await streamToBuffer(response.Body)
    return body
  }

  async delete(path: string): Promise<void> {
    await this.client.send(
      new DeleteObjectCommand({
        Bucket: this.bucket,
        Key: path,
      }),
    )
  }
}

// TODO: fix any type
// eslint-disable-next-line @typescript-eslint/no-explicit-any
async function streamToBuffer(stream: any): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    const chunks: Uint8Array[] = []
    stream.on('data', (chunk: Uint8Array) => chunks.push(chunk))
    stream.on('end', () => resolve(Buffer.concat(chunks)))
    stream.on('error', reject)
  })
}
