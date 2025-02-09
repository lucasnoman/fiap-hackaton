export interface StoragePort {
  /**
   * Stores a file at the given path with the provided content.
   * @param path The destination path for the file.
   * @param content The file content, either as a Buffer or string.
   * @returns A promise that resolves when the file is stored.
   */
  store(path: string, content: Buffer | string): Promise<void>

  /**
   * Retrieves a file from the given path.
   * @param path The path of the file to retrieve.
   * @returns A promise that resolves with the file content as a Buffer.
   */
  retrieve(path: string): Promise<Buffer>

  /**
   * Deletes a file located at the given path.
   * @param path The path of the file to delete.
   * @returns A promise that resolves when the file is deleted.
   */
  delete(path: string): Promise<void>

  /**
   * Lists files in a directory with the given prefix.
   * @param prefix The prefix to filter files.
   * @returns A promise that resolves with an array of file paths.
   */
  list(prefix: string): Promise<string[]>

  /**
   * Retrieves multiple files from the given paths.
   * @param paths The paths of the files to retrieve.
   * @returns A promise that resolves with a map of file paths to file content as Buffers.
   */
  retrieveMany(paths: string[]): Promise<Map<string, Buffer>>
}
