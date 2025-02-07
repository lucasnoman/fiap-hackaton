export class VideoInformation {
  constructor(
    public readonly path: string,
    public readonly filename: string,
    public readonly duration: number,
  ) {}

  static create(
    path: string,
    filename: string,
    duration: number,
  ): VideoInformation {
    return new VideoInformation(path, filename, duration)
  }
}
