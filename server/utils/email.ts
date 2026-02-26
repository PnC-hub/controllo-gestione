import nodemailer from 'nodemailer'

function getTransporter() {
  return nodemailer.createTransport({
    host: process.env.SMTP_HOST || 'localhost',
    port: Number(process.env.SMTP_PORT) || 25,
    secure: false,
    tls: { rejectUnauthorized: false }
  })
}

export async function sendOtpEmail(
  to: string,
  code: string,
  type: 'login_2fa' | 'password_reset'
): Promise<boolean> {
  const subject = type === 'login_2fa'
    ? `Profitera - Codice di verifica: ${code}`
    : `Profitera - Reset password: ${code}`

  const html = buildOtpEmailHtml(code, type)

  try {
    const transporter = getTransporter()
    await transporter.sendMail({
      from: '"Profitera" <noreply@profitera.it>',
      to,
      subject,
      html
    })
    console.log(`[Email] OTP ${type} inviato a ${maskEmail(to)}`)
    return true
  } catch (error) {
    console.error('[Email] Errore invio:', error)
    return false
  }
}

export function maskEmail(email: string): string {
  const [local, domain] = email.split('@')
  if (!local || !domain) return '***'
  if (local.length <= 2) return `${local[0]}***@${domain}`
  return `${local[0]}${local[1]}${'*'.repeat(Math.min(local.length - 2, 5))}@${domain}`
}

function buildOtpEmailHtml(code: string, type: 'login_2fa' | 'password_reset'): string {
  const isLogin = type === 'login_2fa'
  const color = isLogin ? '#059669' : '#d97706'
  const bgColor = isLogin ? '#ecfdf5' : '#fffbeb'
  const title = isLogin ? 'Codice di verifica' : 'Reset password'
  const message = isLogin
    ? 'Il tuo codice di verifica per accedere a Profitera:'
    : 'Hai richiesto il reset della password. Il tuo codice:'
  const footer = isLogin
    ? 'Il codice scade tra 10 minuti. Non condividerlo con nessuno.'
    : 'Il codice scade tra 15 minuti. Se non hai richiesto il reset, ignora questa email.'

  return `
    <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; max-width: 480px; margin: 0 auto; padding: 20px;">
      <div style="text-align: center; margin-bottom: 24px;">
        <div style="width: 48px; height: 48px; background: ${color}; border-radius: 12px; display: inline-flex; align-items: center; justify-content: center;">
          <span style="color: white; font-size: 20px; font-weight: bold;">P</span>
        </div>
        <h2 style="color: ${color}; margin: 12px 0 4px;">${title}</h2>
        <p style="color: #64748b; margin: 0;">${message}</p>
      </div>
      <div style="font-size: 36px; font-weight: bold; letter-spacing: 8px; text-align: center; padding: 24px; background: ${bgColor}; border-radius: 12px; color: #1e293b;">
        ${code}
      </div>
      <p style="color: #94a3b8; font-size: 13px; text-align: center; margin-top: 20px;">
        ${footer}
      </p>
      <hr style="border: none; border-top: 1px solid #e2e8f0; margin: 24px 0;" />
      <p style="color: #cbd5e1; font-size: 11px; text-align: center;">
        Profitera &mdash; I numeri della tua azienda, sempre sotto controllo
      </p>
    </div>
  `
}
