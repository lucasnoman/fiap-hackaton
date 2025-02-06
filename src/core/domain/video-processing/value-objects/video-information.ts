export class VideoInformation {
  constructor(
    public readonly path: string,
    public readonly duration: number,
  ) {}

  static create(path: string, duration: number): VideoInformation {
    return new VideoInformation(path, duration)
  }
}
