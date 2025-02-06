export interface VideoUploadError {
  error: string
  details?: string
}

export interface VideoUploadResponse {
  message: string
  filename?: string
  path?: string
}
