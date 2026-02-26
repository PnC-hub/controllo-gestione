import { prisma } from '~/server/utils/prisma'
import { createOtp } from '~/server/utils/otp'
import { sendOtpEmail } from '~/server/utils/email'

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const { email } = body || {}

  if (!email) {
    throw createError({
      statusCode: 400,
      data: { message: 'Email obbligatoria' }
    })
  }

  // Risposta sempre positiva per prevenire enumerazione utenti
  const successResponse = {
    success: true,
    message: 'Se l\'email è registrata, riceverai un codice per il reset della password.'
  }

  const user = await prisma.user.findUnique({
    where: { email: email.toLowerCase().trim() }
  })

  if (!user || !user.isActive) {
    // Non rivelare se l'utente esiste
    return successResponse
  }

  // Genera OTP password reset
  const otpCode = await createOtp(user.id, 'password_reset')
  await sendOtpEmail(user.email, otpCode, 'password_reset')

  return successResponse
})
