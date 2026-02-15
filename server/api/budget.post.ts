export default defineEventHandler(async (event) => {
  const body = await readBody(event)

  // Mock save budget
  console.log('Saving budget for year:', body.year)
  console.log('Budget data:', body.data)

  // Simulate database save
  return {
    success: true,
    message: 'Budget salvato con successo',
    year: body.year,
    savedAt: new Date().toISOString()
  }
})
