export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const { nome, anno, ricavi_previsti, costi_previsti } = body

  if (!nome || !anno) {
    throw createError({
      statusCode: 400,
      message: 'Nome e anno sono obbligatori'
    })
  }

  const newBudget = {
    id: Date.now(),
    nome,
    anno,
    stato: 'bozza',
    ricavi_previsti: ricavi_previsti || 0,
    costi_previsti: costi_previsti || 0,
    utile_previsto: (ricavi_previsti || 0) - (costi_previsti || 0),
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  }

  return {
    success: true,
    data: newBudget
  }
})
