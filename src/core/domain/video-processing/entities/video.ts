export class Video {
  //TODO: Frame entity
  //TODO: add props for frames
  constructor(
    //TODO: Add value objects for has a unique path
    public readonly path: string,
    public readonly duration: number,
    //TODO: Add extension value object
  ) {
    if (duration < 0) {
      throw new Error('Invalid video duration')
    }
  }
}
