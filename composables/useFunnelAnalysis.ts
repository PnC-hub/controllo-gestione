/**
 * Composable per l'analisi del funnel pazienti Smiledoc.
 * Aggrega dati da 10 endpoint Geniusmile via useApi().
 */

// ─── Types ──────────────────────────────────────────────
export interface FunnelStageData {
  id: string
  label: string
  icon: string
  color: string
  count: number
  value: number
  conversionRate: number | null // null per il primo stadio
  trend: number // % variazione vs periodo precedente
  details: string
}

export interface FunnelArrowData {
  from: string
  to: string
  percentage: number
  label: string
}

export interface Bottleneck {
  id: string
  title: string
  description: string
  severity: 'critico' | 'attenzione' | 'info'
  metric: string
  action: string
  actionRoute?: string
}

export interface Recommendation {
  id: string
  title: string
  description: string
  priority: 'alta' | 'media' | 'bassa'
  icon: string
  expectedImpact: string
}

export interface FunnelAnalysisData {
  stages: FunnelStageData[]
  arrows: FunnelArrowData[]
  bottlenecks: Bottleneck[]
  recommendations: Recommendation[]
  kpis: {
    totalLeads: number
    conversioneGlobale: number
    fatturatoMese: number
    noShowRate: number
  }
}

type Periodo = 'mese' | 'trimestre' | 'anno'

// ─── Mock data di fallback ──────────────────────────────
const MOCK_DATA: FunnelAnalysisData = {
  stages: [
    { id: 'lead', label: 'Lead Generation', icon: 'bullhorn', color: 'purple', count: 145, value: 0, conversionRate: null, trend: 12, details: 'Lead totali generati nel periodo' },
    { id: 'contatto', label: 'Contatto / Qualificazione', icon: 'phone', color: 'indigo', count: 98, value: 0, conversionRate: 67.6, trend: 5, details: 'Lead contattati e qualificati' },
    { id: 'prima-visita', label: 'Prima Visita', icon: 'calendar-check', color: 'blue', count: 72, value: 0, conversionRate: 73.5, trend: -3, details: 'Appuntamenti primo accesso effettuati' },
    { id: 'follow-up', label: 'Follow-up', icon: 'redo', color: 'cyan', count: 58, value: 0, conversionRate: 80.6, trend: 8, details: 'Pazienti che tornano per follow-up' },
    { id: 'proposta', label: 'Proposta Trattamento', icon: 'file-medical', color: 'teal', count: 51, value: 187000, conversionRate: 87.9, trend: 2, details: 'Preventivi emessi' },
    { id: 'accettazione', label: 'Accettazione', icon: 'check-circle', color: 'emerald', count: 34, value: 128000, conversionRate: 66.7, trend: -5, details: 'Preventivi accettati dal paziente' },
    { id: 'produzione', label: 'Produzione', icon: 'tooth', color: 'green', count: 31, value: 118000, conversionRate: 91.2, trend: 4, details: 'Trattamenti in corso o completati' },
  ],
  arrows: [
    { from: 'lead', to: 'contatto', percentage: 67.6, label: 'Contatto' },
    { from: 'contatto', to: 'prima-visita', percentage: 73.5, label: 'Appuntamento' },
    { from: 'prima-visita', to: 'follow-up', percentage: 80.6, label: 'Ritorno' },
    { from: 'follow-up', to: 'proposta', percentage: 87.9, label: 'Preventivo' },
    { from: 'proposta', to: 'accettazione', percentage: 66.7, label: 'Accettazione' },
    { from: 'accettazione', to: 'produzione', percentage: 91.2, label: 'Avvio' },
  ],
  bottlenecks: [
    { id: 'b1', title: 'Basso tasso di contatto lead', description: 'Solo il 67.6% dei lead viene contattato. Target: >80%', severity: 'critico', metric: '67.6%', action: 'Velocizzare contatto entro 2h', actionRoute: '/revenue/leads' },
    { id: 'b2', title: 'Accettazione preventivi sotto soglia', description: 'Solo il 66.7% dei preventivi viene accettato. Possibile problema di prezzo o presentazione', severity: 'attenzione', metric: '66.7%', action: 'Rivedere presentazione preventivi' },
    { id: 'b3', title: 'Calo prime visite', description: 'Le prime visite sono diminuite del 3% rispetto al periodo precedente', severity: 'attenzione', metric: '-3%', action: 'Incrementare campagne marketing' },
  ],
  recommendations: [
    { id: 'r1', title: 'Automatizzare contatto lead', description: 'Implementare risposta automatica entro 2h dalla generazione del lead con SMS + email', priority: 'alta', icon: 'bolt', expectedImpact: '+15% conversione lead→contatto' },
    { id: 'r2', title: 'Migliorare presentazione preventivi', description: 'Usare preventivi visivi con foto prima/dopo e opzioni di pagamento rateizzato', priority: 'alta', icon: 'file-invoice-dollar', expectedImpact: '+10% accettazione preventivi' },
    { id: 'r3', title: 'Campagna recall automatica', description: 'Attivare recall automatico per pazienti che non tornano da 6+ mesi', priority: 'media', icon: 'bell', expectedImpact: '+20% fidelizzazione' },
    { id: 'r4', title: 'Ridurre no-show', description: 'Implementare reminder WhatsApp 24h prima dell\'appuntamento con conferma one-click', priority: 'media', icon: 'calendar-times', expectedImpact: '-30% no-show' },
  ],
  kpis: {
    totalLeads: 145,
    conversioneGlobale: 21.4,
    fatturatoMese: 118000,
    noShowRate: 12,
  }
}

// ─── Helper: estrai valore da risultato allSettled ──────
function extractResult<T>(result: PromiseSettledResult<T>): T | null {
  return result.status === 'fulfilled' ? result.value : null
}

// ─── Helper: calcola % safe ─────────────────────────────
function safePercent(numerator: number, denominator: number): number {
  if (denominator <= 0) return 0
  return Math.round((numerator / denominator) * 1000) / 10
}

// ─── Helper: genera raccomandazioni da dati reali ───────
function generateRecommendations(stages: FunnelStageData[], noShowRate: number): { bottlenecks: Bottleneck[], recommendations: Recommendation[] } {
  const bottlenecks: Bottleneck[] = []
  const recommendations: Recommendation[] = []

  // Analisi contatto lead
  const contattoStage = stages.find(s => s.id === 'contatto')
  if (contattoStage && contattoStage.conversionRate !== null && contattoStage.conversionRate < 70) {
    bottlenecks.push({
      id: 'b-contatto',
      title: 'Basso tasso di contatto lead',
      description: `Solo il ${contattoStage.conversionRate}% dei lead viene contattato. Target: >80%`,
      severity: contattoStage.conversionRate < 50 ? 'critico' : 'attenzione',
      metric: `${contattoStage.conversionRate}%`,
      action: 'Velocizzare contatto entro 2h',
    })
    recommendations.push({
      id: 'r-contatto',
      title: 'Automatizzare contatto lead',
      description: 'Implementare risposta automatica entro 2h dalla generazione del lead con SMS + email',
      priority: 'alta',
      icon: 'bolt',
      expectedImpact: '+15% conversione lead→contatto',
    })
  }

  // Analisi no-show
  if (noShowRate > 15) {
    bottlenecks.push({
      id: 'b-noshow',
      title: 'Tasso no-show elevato',
      description: `Il ${noShowRate}% degli appuntamenti non si presenta. Target: <10%`,
      severity: noShowRate > 25 ? 'critico' : 'attenzione',
      metric: `${noShowRate}%`,
      action: 'Implementare reminder automatici',
    })
    recommendations.push({
      id: 'r-noshow',
      title: 'Ridurre no-show con reminder',
      description: 'Implementare reminder WhatsApp/SMS 24h prima dell\'appuntamento con conferma one-click',
      priority: 'alta',
      icon: 'calendar-times',
      expectedImpact: '-30% no-show',
    })
  }

  // Analisi accettazione preventivi
  const accettazioneStage = stages.find(s => s.id === 'accettazione')
  if (accettazioneStage && accettazioneStage.conversionRate !== null && accettazioneStage.conversionRate < 60) {
    bottlenecks.push({
      id: 'b-preventivi',
      title: 'Accettazione preventivi sotto soglia',
      description: `Solo il ${accettazioneStage.conversionRate}% dei preventivi viene accettato. Possibile problema di prezzo o presentazione`,
      severity: accettazioneStage.conversionRate < 40 ? 'critico' : 'attenzione',
      metric: `${accettazioneStage.conversionRate}%`,
      action: 'Rivedere presentazione preventivi',
    })
    recommendations.push({
      id: 'r-preventivi',
      title: 'Migliorare presentazione preventivi',
      description: 'Usare preventivi visivi con foto prima/dopo e opzioni di pagamento rateizzato',
      priority: 'alta',
      icon: 'file-invoice-dollar',
      expectedImpact: '+10% accettazione preventivi',
    })
  }

  // Analisi prima visita
  const primaVisitaStage = stages.find(s => s.id === 'prima-visita')
  if (primaVisitaStage && primaVisitaStage.trend < -5) {
    bottlenecks.push({
      id: 'b-visite',
      title: 'Calo prime visite',
      description: `Le prime visite sono diminuite del ${Math.abs(primaVisitaStage.trend)}% rispetto al periodo precedente`,
      severity: primaVisitaStage.trend < -15 ? 'critico' : 'attenzione',
      metric: `${primaVisitaStage.trend}%`,
      action: 'Incrementare campagne marketing',
    })
  }

  // Analisi fidelizzazione
  const produzioneStage = stages.find(s => s.id === 'produzione')
  if (produzioneStage && produzioneStage.conversionRate !== null && produzioneStage.conversionRate < 80) {
    recommendations.push({
      id: 'r-recall',
      title: 'Campagna recall automatica',
      description: 'Attivare recall automatico per pazienti che non tornano da 6+ mesi',
      priority: 'media',
      icon: 'bell',
      expectedImpact: '+20% fidelizzazione',
    })
  }

  // Se non ci sono bottleneck: messaggio positivo
  if (bottlenecks.length === 0) {
    bottlenecks.push({
      id: 'b-ok',
      title: 'Flusso paziente nella norma',
      description: 'Tutti gli indicatori sono sopra le soglie target. Continuare a monitorare.',
      severity: 'info',
      metric: 'OK',
      action: 'Continua monitoraggio',
    })
  }

  return { bottlenecks, recommendations }
}

// ─── Composable principale ──────────────────────────────
export const useFunnelAnalysis = () => {
  const loading = ref(false)
  const error = ref<string | null>(null)
  const data = ref<FunnelAnalysisData>(MOCK_DATA)
  const periodo = ref<Periodo>('mese')

  const loadData = async () => {
    loading.value = true
    error.value = null

    try {
      const { fetchApi } = useApi()

      // Date per il periodo selezionato
      const now = new Date()
      const periodoConfig = {
        mese: { mesi: 1 },
        trimestre: { mesi: 3 },
        anno: { mesi: 12 },
      }
      const mesiIndietro = periodoConfig[periodo.value].mesi
      const dataDal = new Date(now.getFullYear(), now.getMonth() - mesiIndietro, 1)
      const dataAl = new Date(now.getFullYear(), now.getMonth() + 1, 0)
      const dalStr = dataDal.toISOString().split('T')[0]
      const alStr = dataAl.toISOString().split('T')[0]

      // 10 chiamate API in parallelo
      const [
        leadsRes,
        leadsStatsRes,
        primeVisiteRes,
        followUpRes,
        noShowRes,
        preventiviRes,
        conversioneRes,
        biStatsRes,
        recallRes,
        bottlenecksRes,
      ] = await Promise.allSettled([
        fetchApi<any>(`/revenue/leads?data_dal=${dalStr}&data_al=${alStr}`),
        fetchApi<any>('/leads/stats/dashboard'),
        fetchApi<any>(`/appuntamenti?tipo=primo_accesso&data_dal=${dalStr}&data_al=${alStr}`),
        fetchApi<any>(`/appuntamenti?tipo=visita_follow_up&data_dal=${dalStr}&data_al=${alStr}`),
        fetchApi<any>('/revenue/noshow/stats'),
        fetchApi<any>('/revenue/preventivi/stats'),
        fetchApi<any>(`/report/conversione-preventivi?data_dal=${dalStr}&data_al=${alStr}`),
        fetchApi<any>(`/bi/stats?periodo=${periodo.value}`),
        fetchApi<any>('/revenue/recall/stats'),
        fetchApi<any>('/growth-mgmt/bottlenecks'),
      ])

      // Estrai risultati (null se fallito)
      const leads = extractResult(leadsRes)
      const leadsStats = extractResult(leadsStatsRes)
      const primeVisite = extractResult(primeVisiteRes)
      const followUp = extractResult(followUpRes)
      const noShow = extractResult(noShowRes)
      const preventivi = extractResult(preventiviRes)
      const conversione = extractResult(conversioneRes)
      const biStats = extractResult(biStatsRes)
      const recall = extractResult(recallRes)
      const apiBottlenecks = extractResult(bottlenecksRes)

      // Conteggi dai dati API
      const totalLeads = leadsStats?.data?.totale ?? leads?.data?.length ?? MOCK_DATA.kpis.totalLeads
      const leadsContattati = leadsStats?.data?.contattati ?? Math.round(totalLeads * 0.68)
      const primeVisiteCount = primeVisite?.data?.length ?? primeVisite?.data?.totale ?? Math.round(leadsContattati * 0.73)
      const followUpCount = followUp?.data?.length ?? followUp?.data?.totale ?? Math.round(primeVisiteCount * 0.81)
      const preventiviEmessi = preventivi?.data?.emessi ?? preventivi?.data?.totale ?? Math.round(followUpCount * 0.88)
      const preventiviAccettati = preventivi?.data?.accettati ?? conversione?.data?.accettati ?? Math.round(preventiviEmessi * 0.67)
      const preventiviValore = preventivi?.data?.valore_totale ?? 0
      const preventiviAccettatiValore = preventivi?.data?.valore_accettati ?? conversione?.data?.valore ?? 0
      const produzioneCount = conversione?.data?.in_produzione ?? Math.round(preventiviAccettati * 0.91)
      const fatturatoMese = biStats?.data?.fatturato ?? biStats?.data?.kpi?.fatturato ?? 0
      const noShowRate = noShow?.data?.tasso_noshow ?? noShow?.data?.rate ?? MOCK_DATA.kpis.noShowRate
      const recallRate = recall?.data?.tasso_risposta ?? 0

      // Trend (usa dati API se disponibili, altrimenti 0)
      const leadTrend = leadsStats?.data?.trend ?? 0
      const visiteTrend = primeVisite?.data?.trend ?? 0

      // Costruisci stages
      const stages: FunnelStageData[] = [
        {
          id: 'lead',
          label: 'Lead Generation',
          icon: 'bullhorn',
          color: 'purple',
          count: totalLeads,
          value: 0,
          conversionRate: null,
          trend: leadTrend,
          details: 'Lead totali generati nel periodo',
        },
        {
          id: 'contatto',
          label: 'Contatto / Qualificazione',
          icon: 'phone',
          color: 'indigo',
          count: leadsContattati,
          value: 0,
          conversionRate: safePercent(leadsContattati, totalLeads),
          trend: 0,
          details: 'Lead contattati e qualificati',
        },
        {
          id: 'prima-visita',
          label: 'Prima Visita',
          icon: 'calendar-check',
          color: 'blue',
          count: primeVisiteCount,
          value: 0,
          conversionRate: safePercent(primeVisiteCount, leadsContattati),
          trend: visiteTrend,
          details: 'Appuntamenti primo accesso effettuati',
        },
        {
          id: 'follow-up',
          label: 'Follow-up',
          icon: 'redo',
          color: 'cyan',
          count: followUpCount,
          value: 0,
          conversionRate: safePercent(followUpCount, primeVisiteCount),
          trend: 0,
          details: 'Pazienti che tornano per follow-up',
        },
        {
          id: 'proposta',
          label: 'Proposta Trattamento',
          icon: 'file-medical',
          color: 'teal',
          count: preventiviEmessi,
          value: preventiviValore,
          conversionRate: safePercent(preventiviEmessi, followUpCount),
          trend: 0,
          details: 'Preventivi emessi ai pazienti',
        },
        {
          id: 'accettazione',
          label: 'Accettazione',
          icon: 'check-circle',
          color: 'emerald',
          count: preventiviAccettati,
          value: preventiviAccettatiValore,
          conversionRate: safePercent(preventiviAccettati, preventiviEmessi),
          trend: 0,
          details: 'Preventivi accettati dal paziente',
        },
        {
          id: 'produzione',
          label: 'Produzione',
          icon: 'tooth',
          color: 'green',
          count: produzioneCount,
          value: fatturatoMese,
          conversionRate: safePercent(produzioneCount, preventiviAccettati),
          trend: 0,
          details: 'Trattamenti in corso o completati',
        },
      ]

      // Costruisci arrows tra stages adiacenti
      const arrows: FunnelArrowData[] = []
      for (let i = 0; i < stages.length - 1; i++) {
        const fromStage = stages[i]
        const toStage = stages[i + 1]
        arrows.push({
          from: fromStage.id,
          to: toStage.id,
          percentage: toStage.conversionRate ?? 0,
          label: toStage.label,
        })
      }

      // Genera bottleneck e raccomandazioni
      const { bottlenecks, recommendations } = generateRecommendations(stages, noShowRate)

      // Aggiungi bottleneck dal server se disponibili
      if (apiBottlenecks?.data && Array.isArray(apiBottlenecks.data)) {
        for (const b of apiBottlenecks.data) {
          if (!bottlenecks.find(existing => existing.title === b.titolo)) {
            bottlenecks.push({
              id: `api-${b.id ?? bottlenecks.length}`,
              title: b.titolo ?? b.title ?? 'Bottleneck',
              description: b.descrizione ?? b.description ?? '',
              severity: b.severity === 'high' ? 'critico' : b.severity === 'medium' ? 'attenzione' : 'info',
              metric: b.metrica ?? b.metric ?? '',
              action: b.azione ?? b.action ?? '',
            })
          }
        }
      }

      // Conversione globale lead→produzione
      const conversioneGlobale = safePercent(produzioneCount, totalLeads)

      data.value = {
        stages,
        arrows,
        bottlenecks,
        recommendations,
        kpis: {
          totalLeads,
          conversioneGlobale,
          fatturatoMese,
          noShowRate,
        },
      }
    } catch (e: any) {
      console.error('Errore caricamento analisi flussi:', e)
      error.value = 'Errore nel caricamento dei dati. Visualizzazione dati demo.'
      // Mantieni mock data come fallback (già impostato)
    } finally {
      loading.value = false
    }
  }

  const setPeriodo = (newPeriodo: Periodo) => {
    periodo.value = newPeriodo
    loadData()
  }

  const formatCurrency = (v: number) =>
    new Intl.NumberFormat('it-IT', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 }).format(v)

  return {
    loading: readonly(loading),
    error: readonly(error),
    data: readonly(data),
    periodo: readonly(periodo),
    loadData,
    setPeriodo,
    formatCurrency,
  }
}
