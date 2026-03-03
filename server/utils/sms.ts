/**
 * SMS utility via GatewayAPI (gatewayapi.com).
 * Stessa infrastruttura usata da Geniusmile legacy.
 * Env vars:
 *   GATEWAYAPI_TOKEN   — token come username in HTTP Basic Auth
 *   GATEWAYAPI_SENDER  — nome mittente alfanumerico (es. "Profitera"), default "Profitera"
 */

export function maskPhone(phone: string): string {
  const clean = phone.replace(/\D/g, '')
  if (clean.length < 6) return '***'
  return clean.slice(0, 4) + '*'.repeat(clean.length - 7) + clean.slice(-3)
}

/** Normalizza numero in formato GatewayAPI: 393XXXXXXXXX (senza + o spazi) */
function normalizePhone(phone: string): string {
  return phone.replace(/\D/g, '')
}

export async function sendOtpSms(phone: string, code: string): Promise<boolean> {
  const token = process.env.GATEWAYAPI_TOKEN
  if (!token) {
    console.error('[SMS] GATEWAYAPI_TOKEN non configurato')
    return false
  }

  const sender = process.env.GATEWAYAPI_SENDER || 'Profitera'
  const msisdn = normalizePhone(phone)
  const message = `Profitera - Codice di accesso: ${code}. Valido 10 minuti. Non condividerlo.`

  try {
    const credentials = Buffer.from(`${token}:`).toString('base64')
    const res = await fetch('https://gatewayapi.com/rest/mtsms', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Basic ${credentials}`
      },
      body: JSON.stringify({
        sender,
        message,
        recipients: [{ msisdn }]
      })
    })

    if (!res.ok) {
      const err = await res.text()
      console.error(`[SMS] Errore GatewayAPI ${res.status}:`, err)
      return false
    }

    console.log(`[SMS] OTP inviato a ${maskPhone(phone)} via GatewayAPI`)
    return true
  } catch (error) {
    console.error('[SMS] Errore fetch GatewayAPI:', error)
    return false
  }
}
