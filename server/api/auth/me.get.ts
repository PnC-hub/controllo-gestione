import { prisma } from '~/server/utils/prisma'

export default defineEventHandler(async (event) => {
  const auth = event.context.auth
  if (!auth) {
    throw createError({
      statusCode: 401,
      data: { message: 'Non autenticato' }
    })
  }

  const user = await prisma.user.findUnique({
    where: { id: auth.userId }
  })

  if (!user || !user.isActive) {
    throw createError({
      statusCode: 401,
      data: { message: 'Utente non trovato o disattivato' }
    })
  }

  return {
    success: true,
    user: {
      id: user.id,
      nome: user.nome,
      cognome: user.cognome,
      email: user.email,
      ruolo: user.ruolo
    }
  }
})
