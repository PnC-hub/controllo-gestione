/**
 * GET /api/contratti/scadenzario
 * Ritorna scadenze contrattuali organizzate per mese nei prossimi 12 mesi
 */

export default defineEventHandler(() => {
  const today = new Date()
  const contracts = [
    {
      id: 3,
      oggetto: 'Manutenzione riuniti',
      controparte: 'TechDent Srl',
      categoria: 'Servizi',
      scadenza: '2026-03-31',
      tipoRinnovo: 'Tacito',
      disdettaEntro: '2026-02-28'
    },
    {
      id: 5,
      oggetto: 'Assicurazione RC',
      controparte: 'Generali Spa',
      categoria: 'Assicurazione',
      scadenza: '2026-04-15',
      tipoRinnovo: 'Annuale',
      disdettaEntro: null
    },
    {
      id: 2,
      oggetto: 'Fornitura materiali',
      controparte: 'Dental Supply Srl',
      categoria: 'Fornitura',
      scadenza: '2026-06-30',
      tipoRinnovo: 'Esplicito',
      disdettaEntro: null
    },
    {
      id: 10,
      oggetto: 'Consulenza marketing',
      controparte: 'A&P Consulting',
      categoria: 'Consulenza',
      scadenza: '2026-06-30',
      tipoRinnovo: 'Tacito',
      disdettaEntro: '2026-05-31'
    },
    {
      id: 4,
      oggetto: 'Software gestionale',
      controparte: 'Geniusmile',
      categoria: 'Servizi',
      scadenza: '2026-12-31',
      tipoRinnovo: 'Annuale',
      disdettaEntro: null
    },
    {
      id: 9,
      oggetto: 'Management fee Horus',
      controparte: 'Horus Holding Srl',
      categoria: 'Servizi',
      scadenza: '2026-12-31',
      tipoRinnovo: 'Annuale',
      disdettaEntro: null
    },
    {
      id: 11,
      oggetto: 'Pulizie',
      controparte: 'Clean Service',
      categoria: 'Servizi',
      scadenza: '2026-12-31',
      tipoRinnovo: 'Tacito',
      disdettaEntro: null
    },
    {
      id: 12,
      oggetto: 'Smaltimento rifiuti',
      controparte: 'EcoMed Srl',
      categoria: 'Servizi',
      scadenza: '2026-12-31',
      tipoRinnovo: 'Annuale',
      disdettaEntro: null
    },
    {
      id: 1,
      oggetto: 'Locazione studio',
      controparte: 'Immobiliare Roma Srl',
      categoria: 'Locazione',
      scadenza: '2027-12-31',
      tipoRinnovo: 'Tacito 6+6',
      disdettaEntro: null
    }
  ]

  // Calcola giorni fino a scadenza
  const contractsWithDays = contracts.map(c => {
    const scadenza = new Date(c.scadenza)
    const daysUntil = Math.floor((scadenza.getTime() - today.getTime()) / (1000 * 60 * 60 * 24))
    return {
      ...c,
      daysUntil
    }
  })

  // Organizza per mese
  const monthNames = [
    'Gennaio', 'Febbraio', 'Marzo', 'Aprile', 'Maggio', 'Giugno',
    'Luglio', 'Agosto', 'Settembre', 'Ottobre', 'Novembre', 'Dicembre'
  ]

  const calendar = []
  for (let i = 0; i < 12; i++) {
    const month = new Date(today.getFullYear(), today.getMonth() + i, 1)
    const monthLabel = `${monthNames[month.getMonth()]} ${month.getFullYear()}`

    const monthContracts = contractsWithDays.filter(c => {
      const scadenza = new Date(c.scadenza)
      return scadenza.getMonth() === month.getMonth() &&
             scadenza.getFullYear() === month.getFullYear()
    })

    calendar.push({
      label: monthLabel,
      contracts: monthContracts
    })
  }

  // Calcola summary
  const summary = {
    next30: contractsWithDays.filter(c => c.daysUntil <= 30).length,
    next60: contractsWithDays.filter(c => c.daysUntil > 30 && c.daysUntil <= 60).length,
    next90: contractsWithDays.filter(c => c.daysUntil > 60 && c.daysUntil <= 90).length,
    beyond90: contractsWithDays.filter(c => c.daysUntil > 90).length
  }

  return {
    calendar,
    summary
  }
})
