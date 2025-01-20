import fs from 'node:fs'

export class DirectoryService {
  /**
   * Verifies if a directory exists, and creates it if it doesn't.
   * @param dirPath - The path of the directory to check/create.
   */
  static ensureDirectoryExists(dirPath: string): void {
    if (!fs.existsSync(dirPath)) {
      fs.mkdirSync(dirPath, { recursive: true })
      console.log(`Directory created: ${dirPath}\n`)
    }
  }
}
