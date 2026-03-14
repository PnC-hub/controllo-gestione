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

interface CEMensile {
  year: number
  month: number
  totaleRicavi: number
  totaleCosti: number
  ebitda: number | null
  risultatoNetto: number
  righe?: CERiga[]
}

type SubMap = Record<string, number>

function safe(v: any): number {
  return Number(v) || 0
}

function perc(v: number, base: number): number | null {
  return base !== 0 ? parseFloat(((v / base) * 100).toFixed(1)) : null
}

export default defineEventHandler(async () => {
  const output: Record<number, any> = {}

  for (const anno of ANNI) {
    let totaleRicavi = 0
    let totaleCosti = 0
    let risultatoNetto = 0
    const sub: SubMap = {}

    try {
      const records = await fetchKontabila<CEMensile[]>('/api/conto-economico/list', {
        entityId: ENTITY_ID,
        year: anno,
      })

      if (Array.isArray(records)) {
        for (const rec of records) {
          totaleRicavi += safe(rec.totaleRicavi)
          totaleCosti += safe(rec.totaleCosti)
          risultatoNetto += safe(rec.risultatoNetto)

          for (const r of rec.righe ?? []) {
            if (r.isSubtotal && r.contoCode) {
              sub[r.contoCode] = (sub[r.contoCode] ?? 0) + safe(r.importo)
            }
          }
        }
      }
    } catch (err) {
      console.warn(`[CE] Anno ${anno}:`, err)
    }

    const p = (v: number) => perc(v, totaleRicavi)

    // Ricavi da CE
    const ricaviVendite = sub['9.01'] ?? 0
    const altriRicavi = sub['9.05'] ?? 0
    const proventiStraord = sub['9.70'] ?? 0

    // Costi per sezione
    const materierime = sub['8.01'] ?? 0
    const godimentoBeni = sub['8.05'] ?? 0
    const personSalari = sub['8.10'] ?? 0
    const personOneriSoc = sub['8.11'] ?? 0
    const personTfr = sub['8.12'] ?? 0
    const personAltri = sub['8.14'] ?? 0
    const totalePersonale = personSalari + personOneriSoc + personTfr + personAltri
    const oneriDiversi = sub['8.35'] ?? 0
    const oneriFinanziari = sub['8.43'] ?? 0
    const oneri8_60 = sub['8.60'] ?? 0

    // EBITDA derivato dai totali certificati (affidabile)
    const ebitda = totaleRicavi - totaleCosti + oneriFinanziari
    // Risultato Netto (certificato)
    const rn = risultatoNetto

    // Servizi netti (bilanciamento contabile — può essere negativo se ci sono storni in 8.04)
    const costiIdentificati = materierime + godimentoBeni + totalePersonale + oneriDiversi + oneriFinanziari + oneri8_60
    const serviziNetti = totaleCosti - costiIdentificati

    output[anno] = {
      anno,
      // Ricavi
      ricaviVendite: { importo: ricaviVendite, perc: p(ricaviVendite) },
      altriRicavi: { importo: altriRicavi, perc: p(altriRicavi) },
      proventiStraord: { importo: proventiStraord, perc: p(proventiStraord) },
      totaleRicavi: { importo: totaleRicavi, perc: p(totaleRicavi) },

      // PIL = Totale Ricavi (studio dentale: no produzione)
      pil: { importo: totaleRicavi, perc: 100 },

      // Rimanenze = 0 (studio dentale)
      rimanenzeIniziali: 0,
      rimanenzeFinalI: 0,

      // Acquisti / Materie Prime
      materierime: { importo: materierime, perc: p(materierime) },

      // Servizi ed altre voci 8.04 (contiene storni contabili → può essere negativo)
      serviziNetti: { importo: serviziNetti, perc: p(serviziNetti) },

      // Godimento Beni di Terzi (affitti, leasing, ecc.)
      godimentoBeni: { importo: godimentoBeni, perc: p(godimentoBeni) },

      // Personale
      personale: {
        salari: { importo: personSalari, perc: p(personSalari) },
        oneriSociali: { importo: personOneriSoc, perc: p(personOneriSoc) },
        tfr: { importo: personTfr, perc: p(personTfr) },
        altriCosti: { importo: personAltri, perc: p(personAltri) },
        totale: { importo: totalePersonale, perc: p(totalePersonale) },
      },

      // Oneri Diversi di Gestione
      oneriDiversi: { importo: oneriDiversi, perc: p(oneriDiversi) },

      // Totale Costi Operativi (ex finanziari)
      totaleCostiOperativi: {
        importo: totaleCosti - oneriFinanziari,
        perc: p(totaleCosti - oneriFinanziari),
      },

      // EBITDA (certificato dai totali API)
      ebitda: { importo: ebitda, perc: p(ebitda) },

      // EBIT = EBITDA (nessun ammortamento separato nel sistema)
      ebit: { importo: ebitda, perc: p(ebitda) },

      // Oneri Finanziari
      oneriFinanziari: { importo: oneriFinanziari, perc: p(oneriFinanziari) },

      // Risultato Netto (certificato)
      risultatoNetto: { importo: rn, perc: p(rn) },

      // BEP — costi fissi / (1 - costi variabili/ricavi)
      bep: (() => {
        // Fissi: personale + godimento beni + oneri diversi
        const fissi = totalePersonale + godimentoBeni + oneriDiversi
        // Variabili: materie prime + servizi netti (positivi)
        const variabili = materierime + Math.max(serviziNetti, 0)
        const mc = totaleRicavi > 0 ? (totaleRicavi - variabili) / totaleRicavi : 0
        return mc > 0 ? Math.round(fissi / mc) : null
      })(),
    }
  }

  return { success: true, data: output }
})
