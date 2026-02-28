import { chatWithGPT, CFO_SYSTEM_PROMPT, CHAT_MAX_HISTORY } from '~/server/utils/openai'
import { buildChatContext } from '~/server/utils/chatContext'

export default defineEventHandler(async (event) => {
  const auth = event.context.auth
  if (!auth?.userId) {
    throw createError({ statusCode: 401, message: 'Autenticazione richiesta' })
  }

  const body = await readBody(event)
  const { message, conversationId, centroId, currentPage, authToken } = body

  if (!message || typeof message !== 'string' || message.trim().length === 0) {
    throw createError({ statusCode: 400, message: 'Messaggio richiesto' })
  }

  if (!centroId) {
    throw createError({ statusCode: 400, message: 'Centro non selezionato' })
  }

  const prisma = usePrisma()

  try {
    // Trova o crea conversazione
    let conversation: any
    if (conversationId) {
      conversation = await prisma.chatConversation.findFirst({
        where: { id: conversationId, userId: auth.userId },
        include: { messages: { orderBy: { createdAt: 'asc' } } },
      })
      if (!conversation) {
        throw createError({ statusCode: 404, message: 'Conversazione non trovata' })
      }
    } else {
      conversation = await prisma.chatConversation.create({
        data: {
          userId: auth.userId,
          centroId: Number(centroId),
          title: message.substring(0, 80),
        },
        include: { messages: [] as any },
      })
      conversation.messages = []
    }

    // Salva messaggio utente
    await prisma.chatMessage.create({
      data: {
        conversationId: conversation.id,
        role: 'user',
        content: message.trim(),
      },
    })

    // Arricchisci contesto con dati reali Geniusmile
    const context = await buildChatContext(Number(centroId), authToken, currentPage)

    // Costruisci storico messaggi per GPT (ultimi N)
    const recentMessages = conversation.messages.slice(-CHAT_MAX_HISTORY)

    const gptMessages: Array<{ role: 'system' | 'user' | 'assistant'; content: string }> = [
      {
        role: 'system',
        content: `${CFO_SYSTEM_PROMPT}\n\n## Dati Finanziari Reali del Centro\n${context.report}`,
      },
    ]

    for (const msg of recentMessages) {
      if (msg.role === 'user' || msg.role === 'assistant') {
        gptMessages.push({ role: msg.role, content: msg.content })
      }
    }

    gptMessages.push({ role: 'user', content: message.trim() })

    // Chiama GPT-4o
    const aiResponse = await chatWithGPT(gptMessages)

    // Salva risposta AI
    const savedMessage = await prisma.chatMessage.create({
      data: {
        conversationId: conversation.id,
        role: 'assistant',
        content: aiResponse,
        contextData: context.rawData,
      },
    })

    // Aggiorna titolo se prima conversazione (auto-genera)
    if (conversation.messages.length === 0) {
      await prisma.chatConversation.update({
        where: { id: conversation.id },
        data: { title: message.substring(0, 80) },
      })
    }

    return {
      success: true,
      data: {
        conversationId: conversation.id,
        message: {
          id: savedMessage.id,
          role: 'assistant',
          content: aiResponse,
          createdAt: savedMessage.createdAt,
        },
      },
    }
  } catch (error: any) {
    console.error('[Chat AI] Errore:', error)

    if (error.statusCode) throw error

    throw createError({
      statusCode: 500,
      message: 'Errore nella generazione della risposta AI',
    })
  }
})
