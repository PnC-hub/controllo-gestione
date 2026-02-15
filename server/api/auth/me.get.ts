export default defineEventHandler(async (event) => {
  // Mock user - in produzione verificare token JWT
  const user = {
    id: 1,
    email: 'demo@profitera.it',
    name: 'Marco Rossi',
    company: 'Demo Srl',
    plan: 'professional',
    created_at: '2026-01-15'
  }

  return {
    success: true,
    data: user
  }
})
