/**
 * DELETE /api/contratti/[id]
 * Elimina un contratto
 */

export default defineEventHandler((event) => {
  const id = getRouterParam(event, 'id')

  // Mock - in produzione elimina da DB
  return {
    success: true,
    id: parseInt(id || '0'),
    deletedAt: new Date().toISOString()
  }
})
