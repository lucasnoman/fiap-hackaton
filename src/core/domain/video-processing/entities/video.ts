export class Video {
  constructor(
    public readonly path: string,
    public readonly duration: number,
  ) {
    if (duration < 0) {
      throw new Error('Invalid video duration')
    }
  }
}
