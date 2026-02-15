/**
 * GET /api/contratti
 * Lista tutti i contratti con calcolo stato dinamico
 */

export default defineEventHandler(() => {
  const contracts = [
    {
      id: 1,
      oggetto: 'Locazione studio',
      controparte: 'Immobiliare Roma Srl',
      categoria: 'Locazione',
      valoreAnnuo: 42000,
      decorrenza: '2022-01-01',
      durata: '6+6 anni',
      scadenza: '2027-12-31',
      tipoRinnovo: 'Tacito 6+6',
      parteCorrelata: false,
      disdettaEntro: null
    },
    {
      id: 2,
      oggetto: 'Fornitura materiali',
      controparte: 'Dental Supply Srl',
      categoria: 'Fornitura',
      valoreAnnuo: 144000,
      decorrenza: '2024-07-01',
      durata: '2 anni',
      scadenza: '2026-06-30',
      tipoRinnovo: 'Esplicito',
      parteCorrelata: false,
      disdettaEntro: null
    },
    {
      id: 3,
      oggetto: 'Manutenzione riuniti',
      controparte: 'TechDent Srl',
      categoria: 'Servizi',
      valoreAnnuo: 12000,
      decorrenza: '2024-04-01',
      durata: '2 anni',
      scadenza: '2026-03-31',
      tipoRinnovo: 'Tacito',
      parteCorrelata: false,
      disdettaEntro: '2026-02-28'
    },
    {
      id: 4,
      oggetto: 'Software gestionale',
      controparte: 'Geniusmile',
      categoria: 'Servizi',
      valoreAnnuo: 6000,
      decorrenza: '2025-01-01',
      durata: '1 anno',
      scadenza: '2026-12-31',
      tipoRinnovo: 'Annuale',
      parteCorrelata: false,
      disdettaEntro: null
    },
    {
      id: 5,
      oggetto: 'Assicurazione RC',
      controparte: 'Generali Spa',
      categoria: 'Assicurazione',
      valoreAnnuo: 8500,
      decorrenza: '2025-04-15',
      durata: '1 anno',
      scadenza: '2026-04-15',
      tipoRinnovo: 'Annuale',
      parteCorrelata: false,
      disdettaEntro: null
    },
    {
      id: 6,
      oggetto: 'Consulenza fiscale',
      controparte: 'Studio Bianchi',
      categoria: 'Consulenza',
      valoreAnnuo: 18000,
      decorrenza: '2020-01-01',
      durata: 'Indeterminato',
      scadenza: null,
      tipoRinnovo: 'Annuale',
      parteCorrelata: false,
      disdettaEntro: null
    },
    {
      id: 7,
      oggetto: 'Consulenza legale',
      controparte: 'Avv. Rossi',
      categoria: 'Consulenza',
      valoreAnnuo: 6000,
      decorrenza: '2023-01-01',
      durata: 'Indeterminato',
      scadenza: null,
      tipoRinnovo: 'Annuale',
      parteCorrelata: false,
      disdettaEntro: null
    },
    {
      id: 8,
      oggetto: 'Leasing CBCT',
      controparte: 'UniCredit Leasing',
      categoria: 'Leasing',
      valoreAnnuo: 24000,
      decorrenza: '2023-10-01',
      durata: '5 anni',
      scadenza: '2028-09-30',
      tipoRinnovo: 'No',
      parteCorrelata: false,
      disdettaEntro: null
    },
    {
      id: 9,
      oggetto: 'Management fee Horus',
      controparte: 'Horus Holding Srl',
      categoria: 'Servizi',
      valoreAnnuo: 60000,
      decorrenza: '2024-01-01',
      durata: '3 anni',
      scadenza: '2026-12-31',
      tipoRinnovo: 'Annuale',
      parteCorrelata: true,
      disdettaEntro: null
    },
    {
      id: 10,
      oggetto: 'Consulenza marketing',
      controparte: 'A&P Consulting',
      categoria: 'Consulenza',
      valoreAnnuo: 24000,
      decorrenza: '2024-07-01',
      durata: '2 anni',
      scadenza: '2026-06-30',
      tipoRinnovo: 'Tacito',
      parteCorrelata: true,
      disdettaEntro: '2026-05-31'
    },
    {
      id: 11,
      oggetto: 'Pulizie',
      controparte: 'Clean Service',
      categoria: 'Servizi',
      valoreAnnuo: 9600,
      decorrenza: '2025-01-01',
      durata: '1 anno',
      scadenza: '2026-12-31',
      tipoRinnovo: 'Tacito',
      parteCorrelata: false,
      disdettaEntro: null
    },
    {
      id: 12,
      oggetto: 'Smaltimento rifiuti',
      controparte: 'EcoMed Srl',
      categoria: 'Servizi',
      valoreAnnuo: 4800,
      decorrenza: '2025-01-01',
      durata: '1 anno',
      scadenza: '2026-12-31',
      tipoRinnovo: 'Annuale',
      parteCorrelata: false,
      disdettaEntro: null
    }
  ]

  // Calcola stato dinamico per ogni contratto
  const today = new Date()
  const contractsWithStatus = contracts.map(contract => {
    let statoCalcolato: 'attivo' | 'scadenza' | 'critico' = 'attivo'
    let statoLabel = '✅ Attivo'

    if (contract.scadenza) {
      const scadenza = new Date(contract.scadenza)
      const daysUntil = Math.floor((scadenza.getTime() - today.getTime()) / (1000 * 60 * 60 * 24))

      if (daysUntil < 60) {
        statoCalcolato = 'critico'
        statoLabel = '🔴 Scade tra 2 mesi'
      } else if (daysUntil < 90) {
        statoCalcolato = 'scadenza'
        statoLabel = '⚠️ Scade tra 5 mesi'
      }

      // Check disdetta
      if (contract.disdettaEntro) {
        const disdetta = new Date(contract.disdettaEntro)
        const daysUntilDisdetta = Math.floor((disdetta.getTime() - today.getTime()) / (1000 * 60 * 60 * 24))

        if (daysUntilDisdetta < 30) {
          statoCalcolato = 'critico'
          statoLabel = '🔴 Scade tra 2 mesi'
        }
      }
    }

    return {
      ...contract,
      statoCalcolato,
      statoLabel
    }
  })

  return contractsWithStatus
})
