export default defineEventHandler(async () => {
  // JWT è stateless - il logout è gestito lato client rimuovendo il token
  return {
    success: true,
    message: 'Logout effettuato'
  }
})
