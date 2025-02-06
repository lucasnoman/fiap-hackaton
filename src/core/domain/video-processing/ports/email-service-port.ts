export interface EmailServicePort {
  sendEmail(to: string, subject: string, body: string): Promise<void>
}
