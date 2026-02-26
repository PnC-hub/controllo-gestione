import { prisma } from '~/server/utils/prisma'
import { createOtp, getLastOtpTime } from '~/server/utils/otp'
import { sendOtpEmail, maskEmail } from '~/server/utils/email'

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const { session_token } = body || {}

  if (!session_token) {
    throw createError({
      statusCode: 400,
      data: { message: 'Session token obbligatorio' }
    })
  }

  // Verifica sessione
  const session = await prisma.session.findUnique({
    where: { sessionToken: session_token },
    include: { user: true }
  })

  if (!session || session.expiresAt < new Date()) {
    throw createError({
      statusCode: 401,
      data: { message: 'Sessione non valida o scaduta' }
    })
  }

  // Rate limit: max 1 OTP ogni 60 secondi
  const lastOtpTime = await getLastOtpTime(session.userId, 'login_2fa')
  if (lastOtpTime) {
    const secondsAgo = (Date.now() - lastOtpTime.getTime()) / 1000
    if (secondsAgo < 60) {
      const waitSeconds = Math.ceil(60 - secondsAgo)
      throw createError({
        statusCode: 429,
        data: { message: `Attendi ${waitSeconds} secondi prima di richiedere un nuovo codice` }
      })
    }
  }

  // Genera nuovo OTP e invia
  const otpCode = await createOtp(session.userId, 'login_2fa')
  const emailSent = await sendOtpEmail(session.user.email, otpCode, 'login_2fa')

  if (!emailSent) {
    throw createError({
      statusCode: 500,
      data: { message: 'Impossibile inviare il codice. Riprova.' }
    })
  }

  // Estendi sessione di 5 minuti
  await prisma.session.update({
    where: { id: session.id },
    data: { expiresAt: new Date(Date.now() + 5 * 60 * 1000) }
  })

  return {
    success: true,
    message: `Codice inviato a ${maskEmail(session.user.email)}`,
    otp_sent_at: new Date().toISOString()
  }
})
