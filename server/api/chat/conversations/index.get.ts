export default defineEventHandler(async (event) => {
  const auth = event.context.auth
  if (!auth?.userId) {
    throw createError({ statusCode: 401, message: 'Autenticazione richiesta' })
  }

  const query = getQuery(event)
  const centroId = query.centro_id ? Number(query.centro_id) : undefined

  const prisma = usePrisma()

  const where: any = { userId: auth.userId }
  if (centroId) {
    where.centroId = centroId
  }

  const conversations = await prisma.chatConversation.findMany({
    where,
    orderBy: { updatedAt: 'desc' },
    select: {
      id: true,
      title: true,
      centroId: true,
      createdAt: true,
      updatedAt: true,
      _count: { select: { messages: true } },
    },
    take: 50,
  })

  return {
    success: true,
    data: conversations.map((c: any) => ({
      id: c.id,
      title: c.title,
      centroId: c.centroId,
      messageCount: c._count.messages,
      createdAt: c.createdAt,
      updatedAt: c.updatedAt,
    })),
  }
})
