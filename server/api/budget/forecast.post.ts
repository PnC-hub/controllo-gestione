export default defineEventHandler(async (event) => {
  const body = await readBody(event)

  // Mock update forecast
  console.log('Updating forecast data:', body.data)

  // Simulate database update
  return {
    success: true,
    message: 'Forecast aggiornato con successo',
    updatedAt: new Date().toISOString()
  }
})
