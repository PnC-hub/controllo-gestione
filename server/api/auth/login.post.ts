import bcrypt from 'bcryptjs'
import crypto from 'crypto'
import { prisma } from '~/server/utils/prisma'
import { signToken } from '~/server/utils/jwt'
import { createOtp } from '~/server/utils/otp'
import { sendOtpEmail, maskEmail } from '~/server/utils/email'

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const { email, password } = body || {}

  if (!email || !password) {
    throw createError({
      statusCode: 400,
      data: { message: 'Email e password sono obbligatori' }
    })
  }

  // Cerca utente nel database
  const user = await prisma.user.findUnique({
    where: { email: email.toLowerCase().trim() }
  })

  if (!user || !user.isActive) {
    throw createError({
      statusCode: 401,
      data: { message: 'Credenziali non valide' }
    })
  }

  // Verifica password
  const isPasswordValid = await bcrypt.compare(password, user.passwordHash)
  if (!isPasswordValid) {
    throw createError({
      statusCode: 401,
      data: { message: 'Credenziali non valide' }
    })
  }

  // Aggiorna ultimo accesso
  await prisma.user.update({
    where: { id: user.id },
    data: { lastLogin: new Date() }
  })

  // Se 2FA attivo, crea sessione temporanea + invia OTP via email
  if (user.twoFactorEnabled) {
    const sessionToken = crypto.randomBytes(32).toString('hex')
    const expiresAt = new Date(Date.now() + 5 * 60 * 1000)

    await prisma.session.create({
      data: { userId: user.id, sessionToken, expiresAt }
    })

    const otpCode = await createOtp(user.id, 'login_2fa')
    const emailSent = await sendOtpEmail(user.email, otpCode, 'login_2fa')

    if (!emailSent) {
      console.error(`[Login] Impossibile inviare OTP a ${maskEmail(user.email)}`)
    }

    return {
      success: true,
      requires_2fa: true,
      message: 'Inserisci il codice di verifica inviato via email',
      session_token: sessionToken,
      email_masked: maskEmail(user.email),
      expires_in_seconds: 300
    }
  }

  // Login diretto (2FA disattivato)
  const token = await signToken({
    userId: user.id,
    email: user.email,
    role: user.ruolo
  })

  return {
    success: true,
    token,
    user: {
      id: user.id,
      nome: user.nome,
      cognome: user.cognome,
      email: user.email,
      ruolo: user.ruolo
    }
  }
})
