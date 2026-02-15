export default defineEventHandler(async (event) => {
  const budgets = [
    {
      id: 1,
      nome: 'Budget 2026',
      anno: 2026,
      stato: 'approvato',
      ricavi_previsti: 1200000,
      costi_previsti: 1020000,
      utile_previsto: 180000,
      created_at: '2025-11-15',
      updated_at: '2026-01-20'
    },
    {
      id: 2,
      nome: 'Budget 2025',
      anno: 2025,
      stato: 'chiuso',
      ricavi_previsti: 980000,
      costi_previsti: 850000,
      utile_previsto: 130000,
      ricavi_consuntivo: 1015000,
      costi_consuntivo: 872000,
      utile_consuntivo: 143000,
      created_at: '2024-11-10',
      updated_at: '2026-01-31'
    }
  ]

  return {
    success: true,
    data: budgets
  }
})
