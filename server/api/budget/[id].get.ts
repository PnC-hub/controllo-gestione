export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id')

  // Mock budget detail
  const budget = {
    id: parseInt(id || '1'),
    nome: 'Budget 2026',
    anno: 2026,
    stato: 'approvato',
    voci: [
      { categoria: 'Ricavi', sottocategoria: 'Vendite prodotti', previsto: 800000, consuntivo: 720000 },
      { categoria: 'Ricavi', sottocategoria: 'Vendite servizi', previsto: 300000, consuntivo: 127200 },
      { categoria: 'Ricavi', sottocategoria: 'Altri ricavi', previsto: 100000, consuntivo: 0 },
      { categoria: 'Costi', sottocategoria: 'Materie prime', previsto: 400000, consuntivo: 348000 },
      { categoria: 'Costi', sottocategoria: 'Personale', previsto: 350000, consuntivo: 320000 },
      { categoria: 'Costi', sottocategoria: 'Servizi', previsto: 150000, consuntivo: 138000 },
      { categoria: 'Costi', sottocategoria: 'Ammortamenti', previsto: 80000, consuntivo: 72000 },
      { categoria: 'Costi', sottocategoria: 'Altri costi', previsto: 40000, consuntivo: 32000 }
    ],
    totali: {
      ricavi_previsti: 1200000,
      ricavi_consuntivo: 847200,
      costi_previsti: 1020000,
      costi_consuntivo: 910000,
      utile_previsto: 180000,
      utile_consuntivo: -62800
    },
    created_at: '2025-11-15',
    updated_at: '2026-01-20'
  }

  return {
    success: true,
    data: budget
  }
})
