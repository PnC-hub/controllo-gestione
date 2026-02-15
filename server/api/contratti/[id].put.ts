/**
 * PUT /api/contratti/[id]
 * Aggiorna un contratto
 */

export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id')
  const body = await readBody(event)

  // Mock - in produzione aggiorna DB
  return {
    id: parseInt(id || '0'),
    ...body,
    updatedAt: new Date().toISOString()
  }
})
