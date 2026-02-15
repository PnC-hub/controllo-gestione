export default defineEventHandler(async (event) => {
  const { email, password } = await readBody(event)

  // Mock authentication - in produzione collegare a DB
  if (email && password && password.length >= 6) {
    const user = {
      id: 1,
      email,
      name: 'Marco Rossi',
      company: 'Demo Srl',
      plan: 'professional',
      created_at: '2026-01-15'
    }

    const token = 'profitera_jwt_' + Date.now()

    return {
      success: true,
      data: { user, token }
    }
  }

  throw createError({
    statusCode: 401,
    message: 'Credenziali non valide'
  })
})
