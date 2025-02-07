import { resend } from '@/infra/config/resend'

type SendMailParams = {
  from: string
  to: string
  subject: string
  html: string
}

export function sendMail({ from, to, subject, html }: SendMailParams) {
  resend.emails.send({
    from,
    to,
    subject,
    html,
  })
}
