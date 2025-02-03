import { ProcessVideoErrorEvent } from '@/core/domain/video-processing/events/process-video-error-event'
import { EmailServicePort } from '@/core/domain/video-processing/ports/email-service-port'

export class SendCutVideoErrorEmailHandler {
  constructor(private readonly emailService: EmailServicePort) {}

  async handle(event: ProcessVideoErrorEvent): Promise<void> {
    const subject = 'Video Processing Completed'
    const body = `The video at ${event.videoPath} was processed successfully on ${event.occurredAt.toISOString()}`
    await this.emailService.sendEmail('user@example.com', subject, body)
    console.log(`Notification email sent for video: ${event.videoPath}`)
  }
}
