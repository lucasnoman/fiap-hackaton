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
}
