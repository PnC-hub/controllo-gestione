// server/api/v1/brain/consult.post.ts
// Inter-agent consultation endpoint — allows Imperum to consult Profitera's CFO AI
import { chatWithGPT, CFO_SYSTEM_PROMPT } from '~/server/utils/openai'

export default defineEventHandler(async (event) => {
  const secret = getHeader(event, 'x-inter-agent-secret')
  if (!secret || secret !== process.env.INTER_AGENT_SECRET) {
    throw createError({ statusCode: 401, statusMessage: 'Inter-agent secret non valido' })
  }

  const { question, caller, context, depth } = await readBody(event)
  if (!question?.trim()) {
    throw createError({ statusCode: 400, statusMessage: 'Question richiesta' })
  }

  const userContent = context
    ? `Contesto fornito da ${caller || 'sistema'}:\n${context}\n\nDomanda: ${question}`
    : question

  try {
    const answer = await chatWithGPT([
      { role: 'system', content: CFO_SYSTEM_PROMPT },
      { role: 'user', content: userContent },
    ])
    return {
      answer,
      confidence: 0.85,
      caveats: [],
      domain: 'finance',
    }
  } catch (err: any) {
    return {
      answer: `Dati CFO non disponibili: ${err.message}`,
      confidence: 0,
      caveats: ['Errore Profitera'],
      domain: 'finance',
    }
  }
})
