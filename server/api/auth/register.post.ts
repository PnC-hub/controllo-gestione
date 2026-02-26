import bcrypt from 'bcryptjs'
import { prisma } from '~/server/utils/prisma'

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const { email, password, nome, cognome } = body || {}

  // Validazione input
  if (!email || !password || !nome || !cognome) {
    throw createError({
      statusCode: 400,
      data: { message: 'Tutti i campi sono obbligatori: nome, cognome, email, password' }
    })
  }

  // Validazione email
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!emailRegex.test(email)) {
    throw createError({
      statusCode: 400,
      data: { message: 'Formato email non valido' }
    })
  }

  // Validazione password (min 8 caratteri)
  if (password.length < 8) {
    throw createError({
      statusCode: 400,
      data: { message: 'La password deve avere almeno 8 caratteri' }
    })
  }

  // Controlla se email già in uso
  const existingUser = await prisma.user.findUnique({
    where: { email: email.toLowerCase().trim() }
  })

  if (existingUser) {
    throw createError({
      statusCode: 409,
      data: { message: 'Email già registrata' }
    })
  }

  // Hash password
  const passwordHash = await bcrypt.hash(password, 12)

  // Crea utente
  const user = await prisma.user.create({
    data: {
      email: email.toLowerCase().trim(),
      passwordHash,
      nome: nome.trim(),
      cognome: cognome.trim(),
      ruolo: 'user',
      isActive: true,
      twoFactorEnabled: true
    }
  })

  return {
    success: true,
    message: 'Registrazione completata. Puoi effettuare il login.',
    user: {
      id: user.id,
      nome: user.nome,
      cognome: user.cognome,
      email: user.email
    }
  }
})
