import { fetchKontabila, ENTITY_ID } from '~/server/utils/kontabila-client'

const ANNI = [2023, 2024, 2025]

interface CEMensile {
  year: number
  month: number
  totaleRicavi: number
  totaleCosti: number
  risultatoNetto: number
  righe?: Array<{ contoCode?: string; importo: number; isSubtotal?: boolean }>
}

function safe(v: any): number {
  return Number(v) || 0
}

function perc(v: number, base: number): number | null {
  return base !== 0 ? parseFloat(((v / base) * 100).toFixed(1)) : null
}

function varPerc(curr: number, prev: number): number | null {
  return prev !== 0 ? parseFloat((((curr - prev) / Math.abs(prev)) * 100).toFixed(1)) : null
}

export default defineEventHandler(async () => {
  type AnnoData = {
    ricavi: number; costi: number; netto: number; ebitda: number
    personale: number; godimento8_05: number; oneriFinanz: number; materie8_01: number
  }

  const datiAnno: Record<number, AnnoData> = {}

  for (const anno of ANNI) {
    let ric = 0, cos = 0, net = 0
    const sub: Record<string, number> = {}
    try {
      const records = await fetchKontabila<CEMensile[]>('/api/conto-economico/list', { entityId: ENTITY_ID, year: anno })
      if (Array.isArray(records)) {
        for (const rec of records) {
          ric += safe(rec.totaleRicavi)
          cos += safe(rec.totaleCosti)
          net += safe(rec.risultatoNetto)
          for (const r of rec.righe ?? []) {
            if (r.isSubtotal && r.contoCode) sub[r.contoCode] = (sub[r.contoCode] ?? 0) + safe(r.importo)
          }
        }
      }
    } catch { /* usa zeri */ }

    const oneriFinanz = sub['8.43'] ?? 0
    const personale = (sub['8.10'] ?? 0) + (sub['8.11'] ?? 0) + (sub['8.12'] ?? 0) + (sub['8.14'] ?? 0)
    datiAnno[anno] = {
      ricavi: ric, costi: cos, netto: net,
      ebitda: ric - cos + oneriFinanz,
      personale, godimento8_05: sub['8.05'] ?? 0, oneriFinanz, materie8_01: sub['8.01'] ?? 0,
    }
  }

  const r2023 = datiAnno[2023].ricavi
  const r2025 = datiAnno[2025].ricavi
  const cagr = r2023 > 0 && r2025 > 0
    ? parseFloat((((Math.pow(r2025 / r2023, 1 / 2)) - 1) * 100).toFixed(1))
    : null

  const kpi = ANNI.map((anno, idx) => {
    const d = datiAnno[anno]
    const prev = idx > 0 ? datiAnno[ANNI[idx - 1]] : null
    const fissi = d.personale + d.godimento8_05
    const variabili = d.materie8_01
    const mc = d.ricavi > 0 ? (d.ricavi - variabili) / d.ricavi : 0
    return {
      anno,
      ricavi: d.ricavi, costi: d.costi, ebitda: d.ebitda, netto: d.netto,
      personale: d.personale, godimento8_05: d.godimento8_05, materie8_01: d.materie8_01, oneriFinanz: d.oneriFinanz,
      ebitdaMargin: perc(d.ebitda, d.ricavi),
      netMargin: perc(d.netto, d.ricavi),
      costiPersonalePerc: perc(d.personale, d.ricavi),
      costiStrutturaPerc: perc(d.godimento8_05, d.ricavi),
      deltaRicavi: prev ? varPerc(d.ricavi, prev.ricavi) : null,
      deltaEbitda: prev ? varPerc(d.ebitda, prev.ebitda) : null,
      deltaNetto: prev ? varPerc(d.netto, prev.netto) : null,
      bep: mc > 0 ? Math.round(fissi / mc) : null,
    }
  })

  return { success: true, data: kpi, cagr }
})
