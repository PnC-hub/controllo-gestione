import bcrypt from 'bcryptjs'
import { prisma } from '~/server/utils/prisma'
import { signToken } from '~/server/utils/jwt'

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const { email, password } = body || {}

  if (!email || !password) {
    throw createError({
      statusCode: 400,
      data: { message: 'Email e password sono obbligatori' }
    })
  }

  const user = await prisma.user.findUnique({
    where: { email: email.toLowerCase().trim() }
  })

  if (!user || !user.isActive) {
    throw createError({
      statusCode: 401,
      data: { message: 'Credenziali non valide' }
    })
  }

  const isPasswordValid = await bcrypt.compare(password, user.passwordHash)
  if (!isPasswordValid) {
    throw createError({
      statusCode: 401,
      data: { message: 'Credenziali non valide' }
    })
  }

  await prisma.user.update({
    where: { id: user.id },
    data: { lastLogin: new Date() }
  })

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
