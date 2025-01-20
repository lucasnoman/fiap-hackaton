export interface ZipCreatorPort {
  createZip(sourceFolder: string, zipFilePath: string): Promise<void>
}
