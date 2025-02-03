export class ProcessVideoErrorEvent {
  constructor(
    public readonly videoPath: string,
    public readonly errorMessage: string,
    public readonly occurredAt: Date,
  ) {}
}
