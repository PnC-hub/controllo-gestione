export default defineEventHandler(async (event) => {
  // In produzione: invalidare JWT token
  return {
    success: true,
    message: 'Logout effettuato'
  }
})
