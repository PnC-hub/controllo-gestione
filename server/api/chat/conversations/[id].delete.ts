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

  // Verifica ownership
  const conversation = await prisma.chatConversation.findFirst({
    where: { id, userId: auth.userId },
  })

  if (!conversation) {
    throw createError({ statusCode: 404, message: 'Conversazione non trovata' })
  }

  // Cascade delete (messages vengono eliminati automaticamente)
  await prisma.chatConversation.delete({ where: { id } })

  return { success: true }
})
