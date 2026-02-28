export default defineEventHandler(async (event) => {
  const auth = event.context.auth
  if (!auth?.userId) {
    throw createError({ statusCode: 401, message: 'Autenticazione richiesta' })
  }

  const body = await readBody(event)
  const { centroId, title } = body

  if (!centroId) {
    throw createError({ statusCode: 400, message: 'Centro non selezionato' })
  }

  const prisma = usePrisma()

  const conversation = await prisma.chatConversation.create({
    data: {
      userId: auth.userId,
      centroId: Number(centroId),
      title: title || 'Nuova conversazione',
    },
  })

  return {
    success: true,
    data: {
      id: conversation.id,
      title: conversation.title,
      centroId: conversation.centroId,
      createdAt: conversation.createdAt,
    },
  }
})
