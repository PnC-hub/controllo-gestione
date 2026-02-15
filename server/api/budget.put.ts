export default defineEventHandler(async (event) => {
  const body = await readBody(event)

  // Mock update budget
  console.log('Updating budget for year:', body.year)
  console.log('Updated data:', body.data)

  // Simulate database update
  return {
    success: true,
    message: 'Budget aggiornato con successo',
    year: body.year,
    updatedAt: new Date().toISOString()
  }
})
