/**
 * SMS utility via Brevo (brevo.com) Transactional SMS API.
 * Env vars needed:
 *   BREVO_API_KEY   — chiave API da Account > SMTP & API > API Keys
 *   BREVO_SMS_FROM  — nome mittente (max 11 caratteri alfanumerici), default "Profitera"
 */

export function maskPhone(phone: string): string {
  if (phone.length < 6) return '***'
  return phone.slice(0, 4) + '*'.repeat(phone.length - 7) + phone.slice(-3)
}

export async function sendOtpSms(phone: string, code: string): Promise<boolean> {
  const apiKey = process.env.BREVO_API_KEY
  if (!apiKey) {
    console.error('[SMS] BREVO_API_KEY non configurata')
    return false
  }

  const sender = (process.env.BREVO_SMS_FROM || 'Profitera').slice(0, 11)
  const content = `Profitera - Il tuo codice di accesso è: ${code}. Valido 10 minuti. Non condividerlo.`

  try {
    const res = await fetch('https://api.brevo.com/v3/transactionalSMS/sms', {
      method: 'POST',
      headers: {
        'accept': 'application/json',
        'content-type': 'application/json',
        'api-key': apiKey
      },
      body: JSON.stringify({ sender, recipient: phone, content })
    })

    if (!res.ok) {
      const err = await res.text()
      console.error(`[SMS] Errore Brevo ${res.status}:`, err)
      return false
    }

    console.log(`[SMS] OTP inviato a ${maskPhone(phone)}`)
    return true
  } catch (error) {
    console.error('[SMS] Errore fetch:', error)
    return false
  }
}
