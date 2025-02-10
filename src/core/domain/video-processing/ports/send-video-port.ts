export interface VideoRest {
  filename: string
  mimetype: string
  content: NodeJS.ReadableStream
}

export interface VideoMetadata {
  filename: string
  path: string
}

export interface VideoStoragePort {
  save(video: VideoRest): Promise<VideoMetadata>
  delete(video: VideoMetadata): Promise<void>
}
