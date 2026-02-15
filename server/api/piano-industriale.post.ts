export default defineEventHandler(async (event) => {
  const body = await readBody(event)

  // Mock: Save new business plan
  return {
    success: true,
    message: 'Piano industriale salvato con successo',
    data: {
      id: Math.floor(Math.random() * 1000),
      ...body,
      createdAt: new Date().toISOString()
    }
  }
})
