/**
 * GET /api/contratti/alerts
 * Ritorna alert critici per contratti (usato anche da Imperium)
 */

export default defineEventHandler(() => {
  const alerts = [
    {
      id: 1,
      tipo: 'critico',
      contractId: 3,
      icon: 'fas fa-exclamation-circle text-red-600',
      titolo: 'Scadenza disdetta imminente',
      messaggio: 'Il contratto "Manutenzione riuniti" con TechDent Srl ha disdetta entro il 28/02/2026 (tra 28 giorni). Se non disdetto, rinnovo tacito automatico.'
    },
    {
      id: 2,
      tipo: 'warning',
      contractId: 10,
      icon: 'fas fa-exclamation-triangle text-orange-600',
      titolo: 'Rinnovo tacito con parte correlata',
      messaggio: 'Il contratto "Consulenza marketing" con A&P Consulting (parte correlata) ha rinnovo tacito. Scadenza disdetta: 31/05/2026. Verificare necessità di rinnovo e conformità procedure.'
    }
  ]

  return alerts
})
