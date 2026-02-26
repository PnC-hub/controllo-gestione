import bcrypt from 'bcryptjs'
import { prisma } from '~/server/utils/prisma'
import { verifyOtp } from '~/server/utils/otp'

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const { email, otp, newPassword } = body || {}

  if (!email || !otp || !newPassword) {
    throw createError({
      statusCode: 400,
      data: { message: 'Email, codice OTP e nuova password sono obbligatori' }
    })
  }

  if (newPassword.length < 8) {
    throw createError({
      statusCode: 400,
      data: { message: 'La nuova password deve avere almeno 8 caratteri' }
    })
  }

  // Trova utente
  const user = await prisma.user.findUnique({
    where: { email: email.toLowerCase().trim() }
  })

  if (!user || !user.isActive) {
    throw createError({
      statusCode: 400,
      data: { message: 'Codice OTP non valido o scaduto' }
    })
  }

  // Verifica OTP
  const isValid = await verifyOtp(user.id, otp, 'password_reset')
  if (!isValid) {
    throw createError({
      statusCode: 401,
      data: { message: 'Codice OTP non valido o scaduto' }
    })
  }

  // Aggiorna password
  const passwordHash = await bcrypt.hash(newPassword, 12)
  await prisma.user.update({
    where: { id: user.id },
    data: { passwordHash }
  })

  return {
    success: true,
    message: 'Password aggiornata con successo. Puoi effettuare il login.'
  }
})
