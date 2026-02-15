export default defineEventHandler(async (event) => {
  const { email, password, name, company } = await readBody(event)

  if (!email || !password || !name || !company) {
    throw createError({
      statusCode: 400,
      message: 'Tutti i campi sono obbligatori'
    })
  }

  // Trial 14gg
  const trialEnds = new Date()
  trialEnds.setDate(trialEnds.getDate() + 14)

  const user = {
    id: Date.now(),
    email,
    name,
    company,
    plan: 'professional',
    trial_ends: trialEnds.toISOString(),
    created_at: new Date().toISOString()
  }

  const token = 'profitera_jwt_' + Date.now()

  return {
    success: true,
    data: { user, token }
  }
})
