import { EmailServicePort } from '@/core/domain/video-processing/ports/email-service-port'

export class FakeEmailService implements EmailServicePort {
  async sendEmail(to: string, subject: string, body: string): Promise<void> {
    console.log(
      `Email sent to ${to} with subject: ${subject} and body: ${body}`,
    )
  }
}
