import { fetchKontabila, ENTITY_ID } from '~/server/utils/kontabila-client'

const ANNI = [2023, 2024, 2025]

interface CERiga {
  n: number
  tipo: string
  contoCode?: string
  descrizione: string
  importo: number
  isSubtotal?: boolean
}

interface CEAnno {
  year: number
  month: number
  totaleRicavi: number
  totaleCosti: number
  ebitda: number | null
  risultatoNetto: number
  righe: CERiga[]
}

function buildSezioneVuota(descrizione: string, anno: number): CERiga[] {
  return [{ n: 0, tipo: 'voce', descrizione, importo: 0, isSubtotal: false }]
}

function aggregaAnno(records: CEAnno[]): {
  totaleRicavi: number
  totaleCosti: number
  ebitda: number
  risultatoNetto: number
  righeAggregate: CERiga[]
} {
  if (!records.length) {
    return { totaleRicavi: 0, totaleCosti: 0, ebitda: 0, risultatoNetto: 0, righeAggregate: [] }
  }

  const righeMap = new Map<string, { importo: number; riga: CERiga }>()

  for (const rec of records) {
    const righe: CERiga[] = Array.isArray(rec.righe) ? rec.righe : []
    for (const r of righe) {
      const key = r.contoCode || r.descrizione
      const existing = righeMap.get(key)
      if (existing) {
        existing.importo += r.importo
      } else {
        righeMap.set(key, { importo: r.importo, riga: { ...r } })
      }
    }
  }

  const righeAggregate = Array.from(righeMap.values()).map(v => ({
    ...v.riga,
    importo: v.importo,
  }))

  const totaleRicavi = records.reduce((s, r) => s + (r.totaleRicavi || 0), 0)
  const totaleCosti = records.reduce((s, r) => s + (r.totaleCosti || 0), 0)
  const ebitda = records.reduce((s, r) => s + (r.ebitda || 0), 0)
  const risultatoNetto = records.reduce((s, r) => s + (r.risultatoNetto || 0), 0)

  return { totaleRicavi, totaleCosti, ebitda, risultatoNetto, righeAggregate }
}

export default defineEventHandler(async () => {
  const risultati: Record<number, ReturnType<typeof aggregaAnno>> = {}

  for (const anno of ANNI) {
    try {
      const data = await fetchKontabila<CEAnno[]>('/api/conto-economico/list', {
        entityId: ENTITY_ID,
        year: anno,
      })
      risultati[anno] = aggregaAnno(Array.isArray(data) ? data : [])
    } catch (err) {
      console.warn(`[CE] Anno ${anno} non disponibile:`, err)
      risultati[anno] = { totaleRicavi: 0, totaleCosti: 0, ebitda: 0, risultatoNetto: 0, righeAggregate: [] }
    }
  }

  // Struttura CE riclassificato fedele al template WSNO-006
  const output = ANNI.map(anno => {
    const d = risultati[anno]
    const ricavi = d.totaleRicavi
    const perc = (v: number) => (ricavi !== 0 ? parseFloat(((v / ricavi) * 100).toFixed(2)) : null)

    // Raggruppa righe per tipo
    const righeRicavi = d.righeAggregate.filter(r => r.tipo === 'ricavo' || r.tipo === 'IP')
    const righeAcquisti = d.righeAggregate.filter(r => r.tipo === 'acquisto' || r.tipo === 'costo')
    const righeRimanenze = d.righeAggregate.filter(r => r.tipo === 'rimanenza' || r.tipo === 'O')

    return {
      anno,
      ricavi: {
        voci: righeRicavi.map(r => ({ cod: r.contoCode || '', desc: r.descrizione, importo: r.importo, perc: perc(r.importo) })),
        totale: ricavi,
        totalePerc: perc(ricavi),
      },
      prodottoInterneLordo: {
        importo: ricavi,
        perc: perc(ricavi),
      },
      rimanenzeIniziali: {
        voci: righeRimanenze.filter(r => r.n % 2 === 0).map(r => ({ cod: r.contoCode || '', desc: r.descrizione, importo: r.importo, perc: perc(r.importo) })),
        totale: 0,
      },
      acquisti: {
        voci: righeAcquisti.map(r => ({ cod: r.contoCode || '', desc: r.descrizione, importo: r.importo, perc: perc(r.importo) })),
        totale: d.totaleCosti,
        totalePerc: perc(d.totaleCosti),
      },
      rimanenzeFinalI: {
        voci: righeRimanenze.filter(r => r.n % 2 !== 0).map(r => ({ cod: r.contoCode || '', desc: r.descrizione, importo: r.importo, perc: perc(r.importo) })),
        totale: 0,
      },
      ebitda: { importo: d.ebitda, perc: perc(d.ebitda) },
      risultatoNetto: { importo: d.risultatoNetto, perc: perc(d.risultatoNetto) },
    }
  })

  return { success: true, data: output }
})
