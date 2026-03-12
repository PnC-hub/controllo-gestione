/**
 * Client singleton per chiamate autenticate a Kontabila API
 */

const BASE_URL = process.env.KONTABILA_BASE_URL || 'http://localhost:3025'
const EMAIL = process.env.KONTABILA_EMAIL || 'your-email@example.com'
const PASSWORD = process.env.KONTABILA_PASSWORD || 'your-password'
export const ENTITY_ID = parseInt(process.env.KONTABILA_ENTITY_ID || '1', 10)

let cachedToken: string | null = null
let tokenExpiry: number | null = null

async function authenticate(): Promise<string> {
  if (cachedToken && tokenExpiry && Date.now() < tokenExpiry) {
    return cachedToken
  }

  const res = await fetch(`${BASE_URL}/api/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: EMAIL, password: PASSWORD }),
  })

  if (!res.ok) {
    throw new Error(`[KontabilaClient] Auth fallita: ${res.status}`)
  }

  const json = await res.json()
  cachedToken = json.token as string
  // JWT Kontabila scade in 7 giorni — refresha dopo 6 giorni
  tokenExpiry = Date.now() + 6 * 24 * 60 * 60 * 1000
  return cachedToken
}

export async function fetchKontabila<T = any>(
  path: string,
  params: Record<string, string | number> = {}
): Promise<T> {
  let token: string
  try {
    token = await authenticate()
  } catch (err) {
    console.error('[KontabilaClient] Impossibile autenticarsi:', err)
    throw err
  }

  const url = new URL(`${BASE_URL}${path}`)
  for (const [k, v] of Object.entries(params)) {
    url.searchParams.set(k, String(v))
  }

  const res = await fetch(url.toString(), {
    headers: { Authorization: `Bearer ${token}` },
  })

  // Token scaduto → reinvalida e riprova una volta
  if (res.status === 401) {
    cachedToken = null
    tokenExpiry = null
    token = await authenticate()
    const retry = await fetch(url.toString(), {
      headers: { Authorization: `Bearer ${token}` },
    })
    if (!retry.ok) {
      throw new Error(`[KontabilaClient] ${path} → ${retry.status}`)
    }
    return retry.json() as Promise<T>
  }

  if (!res.ok) {
    throw new Error(`[KontabilaClient] ${path} → ${res.status}`)
  }

  return res.json() as Promise<T>
}
