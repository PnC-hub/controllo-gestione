export default defineEventHandler(async (event) => {
  const summary = {
    kpis: [
      { label: 'Fatturato YTD', value: '€847.200', change: '+12.4%', trend: 'up', color: 'emerald' },
      { label: 'EBITDA', value: '€127.080', change: '+8.2%', trend: 'up', color: 'emerald' },
      { label: 'Margine Operativo', value: '15%', change: '+1.2%', trend: 'up', color: 'emerald' },
      { label: 'Cash Flow', value: '€89.500', change: '-5.3%', trend: 'down', color: 'amber' },
      { label: 'DSO (Giorni Incasso)', value: '68', change: '+5', trend: 'down', color: 'red' },
      { label: 'DPO (Giorni Pagamento)', value: '45', change: '-3', trend: 'up', color: 'emerald' }
    ],
    alerts: [
      { type: 'warning', title: 'Cash Flow in tensione', message: 'Il flusso di cassa operativo è diminuito del 5.3% rispetto al mese precedente', action: 'Analizza' },
      { type: 'danger', title: 'DSO in peggioramento', message: 'I giorni medi di incasso sono aumentati a 68 giorni (+5)', action: 'Gestisci crediti' },
      { type: 'info', title: 'Budget Q1 completato', message: 'Il budget del primo trimestre è stato finalizzato', action: 'Visualizza' }
    ],
    recentActivity: [
      { date: '2 ore fa', action: 'Budget aggiornato', user: 'Marco R.', details: 'Revisione budget Q1 2026' },
      { date: '5 ore fa', action: 'Piano industriale modificato', user: 'Sara M.', details: 'Aggiornate proiezioni 2026-2028' },
      { date: '1 giorno fa', action: 'Nuovo contratto', user: 'Marco R.', details: 'Contratto fornitore ABC Srl' }
    ]
  }

  return {
    success: true,
    data: summary
  }
})
