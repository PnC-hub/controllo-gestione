export default defineEventHandler(async (event) => {
  const body = await readBody(event)

  // Mock: Save scenario
  return {
    success: true,
    message: 'Scenario salvato con successo',
    data: {
      id: Math.floor(Math.random() * 1000),
      name: body.name || `Scenario ${new Date().toLocaleDateString('it-IT')}`,
      createdAt: new Date().toISOString(),
      ...body
    }
  }
})
