let cachedToken: string | null = null
let tokenExpiry: number = 0

export async function getKontabilaToken(): Promise<string> {
  const now = Date.now()
  if (cachedToken && now < tokenExpiry) {
    return cachedToken
  }

  const url = process.env.KONTABILA_URL
  const email = process.env.KONTABILA_EMAIL
  const password = process.env.KONTABILA_PASSWORD

  if (!url || !email || !password) {
    throw new Error('Kontabila env vars missing: KONTABILA_URL, KONTABILA_EMAIL, KONTABILA_PASSWORD')
  }

  const res = await fetch(`${url}/api/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  })

  if (!res.ok) {
    throw new Error(`Kontabila auth failed: ${res.status}`)
  }

  const data = await res.json() as { token: string }
  cachedToken = data.token
  tokenExpiry = now + 50 * 60 * 1000 // cache 50 minuti
  return cachedToken
}

export function kontabilaFetch(path: string, token: string) {
  const url = process.env.KONTABILA_URL
  return fetch(`${url}${path}`, {
    headers: { Authorization: `Bearer ${token}` },
  })
}
