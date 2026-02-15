export default defineEventHandler(async (event) => {
  const body = await readBody(event)

  // Mock: Update business plan
  return {
    success: true,
    message: 'Piano industriale aggiornato con successo',
    data: {
      ...body,
      updatedAt: new Date().toISOString()
    }
  }
})
