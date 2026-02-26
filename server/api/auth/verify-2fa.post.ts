import { prisma } from '~/server/utils/prisma'
import { signToken } from '~/server/utils/jwt'
import { verifyOtp } from '~/server/utils/otp'

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const { session_token, otp } = body || {}

  if (!session_token || !otp) {
    throw createError({
      statusCode: 400,
      data: { message: 'Session token e codice OTP sono obbligatori' }
    })
  }

  // Verifica sessione temporanea
  const session = await prisma.session.findUnique({
    where: { sessionToken: session_token },
    include: { user: true }
  })

  if (!session) {
    throw createError({
      statusCode: 401,
      data: { message: 'Sessione non valida o scaduta' }
    })
  }

  if (session.expiresAt < new Date()) {
    // Pulisci sessione scaduta
    await prisma.session.delete({ where: { id: session.id } })
    throw createError({
      statusCode: 401,
      data: { message: 'Sessione scaduta. Ripeti il login.' }
    })
  }

  // Verifica OTP
  const isOtpValid = await verifyOtp(session.userId, otp, 'login_2fa')
  if (!isOtpValid) {
    throw createError({
      statusCode: 401,
      data: { message: 'Codice OTP non valido o scaduto' }
    })
  }

  // Elimina sessione temporanea (usata)
  await prisma.session.delete({ where: { id: session.id } })

  // Genera JWT
  const token = await signToken({
    userId: session.user.id,
    email: session.user.email,
    role: session.user.ruolo
  })

  return {
    success: true,
    token,
    user: {
      id: session.user.id,
      nome: session.user.nome,
      cognome: session.user.cognome,
      email: session.user.email,
      ruolo: session.user.ruolo
    }
  }
})
