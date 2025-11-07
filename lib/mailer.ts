import { env } from './env'

type MailOptions = {
  to: string
  subject: string
  text?: string
  html?: string
}

export async function sendEmail(opts: MailOptions) {
  // If SendGrid is configured, send; otherwise fall back to logging the message.
  if (process.env.SENDGRID_API_KEY) {
    try {
      const sg = await import('@sendgrid/mail')
      sg.default.setApiKey(process.env.SENDGRID_API_KEY)
      const msg = {
        to: opts.to,
        from: process.env.EMAIL_FROM || 'no-reply@example.com',
        subject: opts.subject,
        text: opts.text,
        html: opts.html,
      }
      await sg.default.send(msg)
      console.log(`Email sent to ${opts.to} subject=${opts.subject}`)
      return true
    } catch (err) {
      console.error('SendGrid send error:', err)
      // fall through to logging
    }
  }

  // Fallback: log email to server console for development
  console.log('Email (logged):', { to: opts.to, subject: opts.subject, text: opts.text })
  return false
}

export default sendEmail
