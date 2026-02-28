/**
 * Arricchisce il contesto AI con dati reali da Geniusmile API.
 * Chiama 8 endpoint in parallelo e formatta i risultati come report testuale.
 */

const API_BASE = process.env.NUXT_PUBLIC_API_BASE || 'https://api.geniusmile.com/api/v1'
const API_KEY = process.env.NUXT_PUBLIC_API_KEY || 'sk_smiledoc_2025_xK9mP3nQ7rT2wY5v'

async function fetchGeniusmile(endpoint: string, centroId: number, authToken?: string): Promise<any> {
  const separator = endpoint.includes('?') ? '&' : '?'
  const url = `${API_BASE}${endpoint}${separator}centro_id=${centroId}`

  const headers: Record<string, string> = {
    'X-API-Key': API_KEY,
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  }
  if (authToken) {
    headers['Authorization'] = `Bearer ${authToken}`
  }

  const response = await fetch(url, { headers })
  if (!response.ok) return null
  return response.json()
}

function extractResult<T>(result: PromiseSettledResult<T>): T | null {
  return result.status === 'fulfilled' ? result.value : null
}

function formatCurrency(v: number): string {
  return new Intl.NumberFormat('it-IT', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 }).format(v)
}

export interface ChatContext {
  report: string
  rawData: Record<string, any>
}

export async function buildChatContext(centroId: number, authToken?: string, currentPage?: string): Promise<ChatContext> {
  const rawData: Record<string, any> = {}

  // 8 chiamate API in parallelo
  const [
    biStatsRes,
    leadsRes,
    preventiviRes,
    noShowRes,
    recallRes,
    kpiRes,
    dashboardRes,
    bottlenecksRes,
  ] = await Promise.allSettled([
    fetchGeniusmile('/bi/stats?periodo=mese', centroId, authToken),
    fetchGeniusmile('/revenue/leads', centroId, authToken),
    fetchGeniusmile('/revenue/preventivi/stats', centroId, authToken),
    fetchGeniusmile('/revenue/noshow/stats', centroId, authToken),
    fetchGeniusmile('/revenue/recall/stats', centroId, authToken),
    fetchGeniusmile(`/growth-mgmt/kpi?anno=${new Date().getFullYear()}&mese=${new Date().getMonth() + 1}`, centroId, authToken),
    fetchGeniusmile('/revenue/dashboard', centroId, authToken),
    fetchGeniusmile('/growth-mgmt/bottlenecks', centroId, authToken),
  ])

  const biStats = extractResult(biStatsRes)
  const leads = extractResult(leadsRes)
  const preventivi = extractResult(preventiviRes)
  const noShow = extractResult(noShowRes)
  const recall = extractResult(recallRes)
  const kpi = extractResult(kpiRes)
  const dashboard = extractResult(dashboardRes)
  const bottlenecks = extractResult(bottlenecksRes)

  rawData.biStats = biStats?.data ?? null
  rawData.leads = leads?.data ?? null
  rawData.preventivi = preventivi?.data ?? null
  rawData.noShow = noShow?.data ?? null
  rawData.recall = recall?.data ?? null
  rawData.kpi = kpi?.data ?? null
  rawData.dashboard = dashboard?.data ?? null
  rawData.bottlenecks = bottlenecks?.data ?? null

  // Costruisci report testuale
  const sections: string[] = []

  sections.push(`📅 Report aggiornato: ${new Date().toLocaleDateString('it-IT', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}`)

  if (currentPage) {
    sections.push(`📍 L'utente sta guardando la pagina: ${currentPage}`)
  }

  // BI Stats
  if (rawData.biStats) {
    const s = rawData.biStats
    sections.push(`\n## Dati Finanziari Mese Corrente`)
    if (s.fatturato !== undefined) sections.push(`- Fatturato: ${formatCurrency(s.fatturato)}`)
    if (s.produzione !== undefined) sections.push(`- Produzione: ${formatCurrency(s.produzione)}`)
    if (s.kpi?.fatturato !== undefined) sections.push(`- Fatturato (KPI): ${formatCurrency(s.kpi.fatturato)}`)
    if (s.top_prestazioni) sections.push(`- Top prestazioni: ${JSON.stringify(s.top_prestazioni)}`)
  }

  // Dashboard executive
  if (rawData.dashboard) {
    const d = rawData.dashboard
    sections.push(`\n## Dashboard Executive`)
    sections.push(`${JSON.stringify(d, null, 0)}`)
  }

  // Lead
  if (rawData.leads) {
    const l = rawData.leads
    if (Array.isArray(l)) {
      const totale = l.length
      const nuovi = l.filter((x: any) => x.stato === 'nuovo').length
      const contattati = l.filter((x: any) => x.stato === 'contattato').length
      const convertiti = l.filter((x: any) => x.stato === 'convertito').length
      const persi = l.filter((x: any) => x.stato === 'perso').length
      sections.push(`\n## Lead`)
      sections.push(`- Totale: ${totale}`)
      sections.push(`- Nuovi: ${nuovi}, Contattati: ${contattati}, Convertiti: ${convertiti}, Persi: ${persi}`)
    } else {
      sections.push(`\n## Lead: ${JSON.stringify(l, null, 0)}`)
    }
  }

  // Preventivi
  if (rawData.preventivi) {
    const p = rawData.preventivi
    sections.push(`\n## Preventivi`)
    if (p.emessi !== undefined) sections.push(`- Emessi: ${p.emessi}`)
    if (p.accettati !== undefined) sections.push(`- Accettati: ${p.accettati}`)
    if (p.valore_totale !== undefined) sections.push(`- Valore totale: ${formatCurrency(p.valore_totale)}`)
    if (p.conversion_rate !== undefined) sections.push(`- Tasso conversione: ${p.conversion_rate}%`)
  }

  // No-show
  if (rawData.noShow) {
    const n = rawData.noShow
    sections.push(`\n## No-Show`)
    if (n.tasso_noshow !== undefined) sections.push(`- Tasso no-show: ${n.tasso_noshow}%`)
    if (n.rate !== undefined) sections.push(`- Rate: ${n.rate}%`)
    if (n.totale_noshow !== undefined) sections.push(`- Totale no-show: ${n.totale_noshow}`)
  }

  // Recall
  if (rawData.recall) {
    const r = rawData.recall
    sections.push(`\n## Recall`)
    if (r.tasso_risposta !== undefined) sections.push(`- Tasso risposta: ${r.tasso_risposta}%`)
    if (r.pazienti_eleggibili !== undefined) sections.push(`- Pazienti eleggibili: ${r.pazienti_eleggibili}`)
  }

  // KPI Obiettivi
  if (rawData.kpi) {
    const k = rawData.kpi
    sections.push(`\n## Obiettivi vs Risultati`)
    sections.push(`${JSON.stringify(k, null, 0)}`)
  }

  // Bottleneck
  if (rawData.bottlenecks && Array.isArray(rawData.bottlenecks)) {
    sections.push(`\n## Colli di Bottiglia Identificati`)
    for (const b of rawData.bottlenecks) {
      sections.push(`- ${b.titolo ?? b.title}: ${b.descrizione ?? b.description ?? ''}`)
    }
  }

  const report = sections.join('\n')

  return { report, rawData }
}
