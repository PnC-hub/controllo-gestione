import { fetchKontabila, ENTITY_ID } from '~/server/utils/kontabila-client'

const ANNI = [2023, 2024, 2025]

interface CERecord {
  year: number
  month: number
  totaleRicavi: number
  totaleCosti: number
  risultatoNetto: number
  ebitda: number | null
}

interface SPRecord {
  year: number
  totaleAttivo?: number
  attivitaCorrenti?: number
  passivitaCorrenti?: number
  patrimoniNetto?: number
  debitiTotali?: number
}

function safe(v: number | null | undefined): number {
  return v ?? 0
}

function perc(v: number, base: number): number | null {
  return base !== 0 ? parseFloat(((v / base) * 100).toFixed(2)) : null
}

export default defineEventHandler(async () => {
  const ceByAnno: Record<number, { ricavi: number; costi: number; ebitda: number; netto: number }> = {}
  const spByAnno: Record<number, { totaleAttivo: number; attivoCorrente: number; passivoCorrente: number; pn: number; debitiTotali: number }> = {}

  for (const anno of ANNI) {
    try {
      const records = await fetchKontabila<CERecord[]>('/api/conto-economico/list', {
        entityId: ENTITY_ID,
        year: anno,
      })
      if (Array.isArray(records) && records.length > 0) {
        ceByAnno[anno] = {
          ricavi: records.reduce((s, r) => s + r.totaleRicavi, 0),
          costi: records.reduce((s, r) => s + r.totaleCosti, 0),
          ebitda: records.reduce((s, r) => s + safe(r.ebitda), 0),
          netto: records.reduce((s, r) => s + r.risultatoNetto, 0),
        }
      } else {
        ceByAnno[anno] = { ricavi: 0, costi: 0, ebitda: 0, netto: 0 }
      }
    } catch {
      ceByAnno[anno] = { ricavi: 0, costi: 0, ebitda: 0, netto: 0 }
    }
  }

  for (const anno of ANNI) {
    try {
      const list = await fetchKontabila<SPRecord[]>('/api/stato-patrimoniale', {
        entityId: ENTITY_ID,
        year: anno,
      })
      const spData = Array.isArray(list) ? list.find(r => r.year === anno) ?? null : null
      if (spData) {
        spByAnno[anno] = {
          totaleAttivo: safe(spData.totaleAttivo),
          attivoCorrente: safe(spData.attivitaCorrenti),
          passivoCorrente: safe(spData.passivitaCorrenti),
          pn: safe(spData.patrimoniNetto),
          debitiTotali: safe(spData.debitiTotali),
        }
      } else {
        spByAnno[anno] = { totaleAttivo: 0, attivoCorrente: 0, passivoCorrente: 0, pn: 0, debitiTotali: 0 }
      }
    } catch {
      spByAnno[anno] = { totaleAttivo: 0, attivoCorrente: 0, passivoCorrente: 0, pn: 0, debitiTotali: 0 }
    }
  }

  const kpi = ANNI.map((anno, idx) => {
    const ce = ceByAnno[anno]
    const sp = spByAnno[anno]
    const prevAnno = idx > 0 ? ANNI[idx - 1] : null
    const prevCe = prevAnno ? ceByAnno[prevAnno] : null

    const ebitdaMargin = perc(ce.ebitda, ce.ricavi)
    const netMargin = perc(ce.netto, ce.ricavi)
    const roe = perc(ce.netto, sp.pn)
    const roi = perc(ce.ebitda, sp.totaleAttivo)

    const currentRatio = sp.passivoCorrente !== 0
      ? parseFloat((sp.attivoCorrente / sp.passivoCorrente).toFixed(2))
      : null
    const debtEquity = sp.pn !== 0
      ? parseFloat((sp.debitiTotali / sp.pn).toFixed(2))
      : null

    const deltaRicavi = prevCe && prevCe.ricavi !== 0
      ? perc(ce.ricavi - prevCe.ricavi, prevCe.ricavi)
      : null

    // BEP: costi fissi ≈ 40%, costi variabili ≈ 60%
    const costiFissi = ce.costi * 0.40
    const costiVariabili = ce.costi * 0.60
    const margineContrib = ce.ricavi > 0 ? (ce.ricavi - costiVariabili) / ce.ricavi : 0
    const bep = margineContrib > 0 ? Math.round(costiFissi / margineContrib) : null

    return {
      anno,
      redditività: {
        ricavi: ce.ricavi,
        ebitda: ce.ebitda,
        ebitdaMargin,
        netMargin,
        roe,
        roi,
        risultatoNetto: ce.netto,
      },
      struttura: {
        currentRatio,
        debtEquity,
        totaleAttivo: sp.totaleAttivo,
        pn: sp.pn,
      },
      crescita: {
        deltaRicaviPerc: deltaRicavi,
        bep,
      },
    }
  })

  const r2023 = ceByAnno[2023].ricavi
  const r2025 = ceByAnno[2025].ricavi
  const cagr = r2023 > 0
    ? parseFloat((((Math.pow(r2025 / r2023, 0.5)) - 1) * 100).toFixed(2))
    : null

  return { success: true, data: kpi, cagr }
})
