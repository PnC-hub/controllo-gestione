import { verifyToken } from '~/server/utils/jwt'

// Route che NON richiedono autenticazione
const PUBLIC_ROUTES = [
  '/api/auth/login',
  '/api/auth/register',
  '/api/auth/verify-2fa',
  '/api/auth/resend-otp',
  '/api/auth/forgot-password',
  '/api/auth/reset-password',
  '/api/auth/logout',
  '/api/health',
  '/api/integrations/',
  '/api/v1/brain/consult',
]

export default defineEventHandler(async (event) => {
  const path = getRequestURL(event).pathname

  // Skip route non-API (pagine, asset, ecc.)
  if (!path.startsWith('/api/')) return

  // Skip route pubbliche
  if (PUBLIC_ROUTES.some(r => path.startsWith(r))) return

  // Estrai Bearer token
  const authHeader = getRequestHeader(event, 'authorization')
  if (!authHeader?.startsWith('Bearer ')) {
    throw createError({
      statusCode: 401,
      statusMessage: 'Autenticazione richiesta'
    })
  }

  const token = authHeader.slice(7)

  try {
    const payload = await verifyToken(token)
    // Attacca info utente al context per gli handler downstream
    event.context.auth = payload
  } catch {
    throw createError({
      statusCode: 401,
      statusMessage: 'Token non valido o scaduto'
    })
  }
})
