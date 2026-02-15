/**
 * GET /api/contratti/[id]
 * Dettaglio singolo contratto
 */

export default defineEventHandler((event) => {
  const id = parseInt(getRouterParam(event, 'id') || '0')

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
      disdettaEntro: null,
      clausoleChiave: [
        'Canone mensile: €3.500 + IVA',
        'Rinnovo tacito per ulteriori 6 anni',
        'Disdetta con preavviso di 6 mesi',
        'Aggiornamento ISTAT annuale',
        'Cauzione: 3 mensilità'
      ],
      storicoRinnovi: [
        { tipo: 'Stipula iniziale', data: '2022-01-01', note: 'Contratto 6+6' }
      ]
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
      disdettaEntro: null,
      clausoleChiave: [
        'Fornitura esclusiva per categorie merceologiche definite',
        'Sconti volume su quantità superiori a €50.000/anno',
        'Pagamento 60 giorni data fattura',
        'Penale rescissione anticipata: 10% valore residuo',
        'Rinnovo esplicito alla scadenza'
      ],
      storicoRinnovi: [
        { tipo: 'Stipula iniziale', data: '2024-07-01', note: 'Contratto biennale' }
      ]
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
      disdettaEntro: '2026-02-28',
      clausoleChiave: [
        'Manutenzione ordinaria trimestrale',
        'Assistenza h24 in caso di guasto',
        'Pezzi di ricambio inclusi',
        'Rinnovo tacito annuale',
        'Disdetta con 30 giorni di preavviso'
      ],
      storicoRinnovi: [
        { tipo: 'Stipula iniziale', data: '2024-04-01', note: 'Contratto biennale con rinnovo tacito' }
      ]
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
      disdettaEntro: null,
      clausoleChiave: [
        'Licenza SaaS per 5 utenti',
        'Aggiornamenti inclusi',
        'Supporto tecnico email/telefono',
        'Backup giornaliero automatico',
        'Rinnovo annuale automatico'
      ],
      storicoRinnovi: [
        { tipo: 'Rinnovo annuale', data: '2025-01-01', note: 'Terzo rinnovo' }
      ]
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
      disdettaEntro: null,
      clausoleChiave: [
        'Servizi di direzione e coordinamento strategico',
        'Fee mensile: €5.000',
        'Rendicontazione trimestrale attività',
        'Clausola arm\'s length principle',
        'Contratto infragruppo ex Art. 2497 c.c.'
      ],
      storicoRinnovi: [
        { tipo: 'Stipula iniziale', data: '2024-01-01', note: 'Contratto infragruppo' }
      ]
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
      disdettaEntro: '2026-05-31',
      clausoleChiave: [
        'Consulenza strategica marketing digitale',
        'Fee mensile: €2.000',
        'Gestione campagne Google Ads e Meta',
        'Reportistica mensile KPI',
        'Nota: società controllata da socio al 30%'
      ],
      storicoRinnovi: [
        { tipo: 'Stipula iniziale', data: '2024-07-01', note: 'Contratto con parte correlata' }
      ]
    }
  ]

  const contract = contracts.find(c => c.id === id)

  if (!contract) {
    throw createError({
      statusCode: 404,
      statusMessage: 'Contratto non trovato'
    })
  }

  return contract
})
