export default defineEventHandler(async (event) => {
  const auth = event.context.auth
  if (!auth?.userId) {
    throw createError({ statusCode: 401, message: 'Autenticazione richiesta' })
  }

  const id = Number(getRouterParam(event, 'id'))
  if (!id || isNaN(id)) {
    throw createError({ statusCode: 400, message: 'ID conversazione non valido' })
  }

  const prisma = usePrisma()

  const conversation = await prisma.chatConversation.findFirst({
    where: { id, userId: auth.userId },
    include: {
      messages: {
        orderBy: { createdAt: 'asc' },
        select: {
          id: true,
          role: true,
          content: true,
          createdAt: true,
        },
      },
    },
  })

  if (!conversation) {
    throw createError({ statusCode: 404, message: 'Conversazione non trovata' })
  }

  return {
    success: true,
    data: {
      id: conversation.id,
      title: conversation.title,
      centroId: conversation.centroId,
      createdAt: conversation.createdAt,
      messages: conversation.messages,
    },
  }
})
