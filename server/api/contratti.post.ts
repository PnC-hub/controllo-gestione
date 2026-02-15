/**
 * POST /api/contratti
 * Crea un nuovo contratto
 */

export default defineEventHandler(async (event) => {
  const body = await readBody(event)

  // Mock - in produzione salva su DB
  return {
    id: Math.floor(Math.random() * 10000),
    ...body,
    createdAt: new Date().toISOString()
  }
})
