import nodemailer from 'nodemailer'

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT || 587),
  secure: process.env.SMTP_SECURE === 'true',
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
})

type MailOptions = {
  to: string
  subject: string
  text?: string
  html?: string
}

const BASE_URL = process.env.NEXTAUTH_URL || 'http://localhost:3000'
const FROM_EMAIL = process.env.EMAIL_FROM || 'no-reply@soundsync.co.za'

/**
 * Base email template wrapper
 */
function emailTemplate(content: string): string {
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>SoundSync</title>
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0; background-color: #f4f4f4; }
    .container { max-width: 600px; margin: 40px auto; background: white; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 8px rgba(0,0,0,0.1); }
    .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; text-align: center; color: white; }
    .header h1 { margin: 0; font-size: 28px; }
    .content { padding: 40px 30px; }
    .button { display: inline-block; padding: 12px 30px; background: #667eea; color: white; text-decoration: none; border-radius: 6px; font-weight: 600; margin: 20px 0; }
    .button:hover { background: #5568d3; }
    .footer { background: #f8f9fa; padding: 20px; text-align: center; color: #666; font-size: 14px; }
    .footer a { color: #667eea; text-decoration: none; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>🎵 SoundSync</h1>
    </div>
    <div class="content">
      ${content}
    </div>
    <div class="footer">
      <p>© ${new Date().getFullYear()} SoundSync. All rights reserved.</p>
      <p><a href="${BASE_URL}">Visit SoundSync</a> | <a href="${BASE_URL}/support">Support</a></p>
    </div>
  </div>
</body>
</html>
  `
}

/**
 * Send verification email
 */
export async function sendVerificationEmail(email: string, token: string, name?: string) {
  const verifyUrl = `${BASE_URL}/auth/verify?token=${token}`

  const html = emailTemplate(`
    <h2>Welcome to SoundSync${name ? `, ${name}` : ''}! 🎉</h2>
    <p>Thank you for signing up. Please verify your email address to get started.</p>
    <p style="text-align: center;">
      <a href="${verifyUrl}" class="button">Verify Email Address</a>
    </p>
    <p style="color: #666; font-size: 14px;">
      If the button doesn't work, copy and paste this link into your browser:<br>
      <a href="${verifyUrl}">${verifyUrl}</a>
    </p>
    <p style="color: #666; font-size: 14px;">
      This link will expire in 24 hours. If you didn't create an account, you can safely ignore this email.
    </p>
  `)

  return sendEmail({
    to: email,
    subject: 'Verify your SoundSync account',
    html,
    text: `Welcome to SoundSync! Please verify your email by visiting: ${verifyUrl}`
  })
}

/**
 * Send password reset email
 */
export async function sendPasswordResetEmail(email: string, token: string, name?: string) {
  const resetUrl = `${BASE_URL}/auth/reset?token=${token}`

  const html = emailTemplate(`
    <h2>Password Reset Request</h2>
    <p>Hi${name ? ` ${name}` : ''},</p>
    <p>We received a request to reset your password. Click the button below to create a new password:</p>
    <p style="text-align: center;">
      <a href="${resetUrl}" class="button">Reset Password</a>
    </p>
    <p style="color: #666; font-size: 14px;">
      If the button doesn't work, copy and paste this link into your browser:<br>
      <a href="${resetUrl}">${resetUrl}</a>
    </p>
    <p style="color: #666; font-size: 14px;">
      This link will expire in 1 hour. If you didn't request a password reset, you can safely ignore this email.
    </p>
  `)

  return sendEmail({
    to: email,
    subject: 'Reset your SoundSync password',
    html,
    text: `Reset your password by visiting: ${resetUrl}`
  })
}

/**
 * Send welcome email (after verification)
 */
export async function sendWelcomeEmail(email: string, name: string, role: string) {
  const dashboardUrl = `${BASE_URL}/${role.toLowerCase()}/dashboard`

  const html = emailTemplate(`
    <h2>Welcome to SoundSync, ${name}! 🎵</h2>
    <p>Your account has been verified and you're all set to start your musical journey.</p>
    ${role === 'CREATOR' ? `
      <p><strong>As a Creator, you can:</strong></p>
      <ul>
        <li>Upload and share your music</li>
        <li>Host live streaming sessions</li>
        <li>Sell merchandise</li>
        <li>Earn from tips and sales</li>
      </ul>
    ` : role === 'MERCHANT' ? `
      <p><strong>As a Merchant, you can:</strong></p>
      <ul>
        <li>Create and sell merchandise</li>
        <li>Manage your store</li>
        <li>Track sales and earnings</li>
      </ul>
    ` : `
      <p><strong>As a Fan, you can:</strong></p>
      <ul>
        <li>Discover amazing music</li>
        <li>Support your favorite artists</li>
        <li>Join live sessions</li>
        <li>Purchase exclusive merchandise</li>
      </ul>
    `}
    <p style="text-align: center;">
      <a href="${dashboardUrl}" class="button">Go to Dashboard</a>
    </p>
  `)

  return sendEmail({
    to: email,
    subject: 'Welcome to SoundSync!',
    html,
    text: `Welcome to SoundSync, ${name}! Visit your dashboard: ${dashboardUrl}`
  })
}

/**
 * Send notification email
 */
export async function sendNotificationEmail(
  email: string,
  subject: string,
  message: string,
  actionUrl?: string,
  actionText?: string
) {
  const html = emailTemplate(`
    <h2>${subject}</h2>
    <p>${message}</p>
    ${actionUrl && actionText ? `
      <p style="text-align: center;">
        <a href="${actionUrl}" class="button">${actionText}</a>
      </p>
    ` : ''}
  `)

  return sendEmail({
    to: email,
    subject,
    html,
    text: message + (actionUrl ? `\n\n${actionUrl}` : '')
  })
}

/**
 * Base send email function
 */
export default async function sendEmail(opts: MailOptions) {
  if (!process.env.SMTP_HOST) {
    // No SMTP configured; just log
    console.log('📧 Email not sent (no SMTP configured).')
    console.log('To:', opts.to)
    console.log('Subject:', opts.subject)
    console.log('---')
    return
  }

  try {
    await transporter.sendMail({
      from: FROM_EMAIL,
      to: opts.to,
      subject: opts.subject,
      text: opts.text,
      html: opts.html,
    })
    console.log(`✅ Email sent to ${opts.to}: ${opts.subject}`)
  } catch (error) {
    console.error('❌ Email send error:', error)
    throw error
  }
}

