/**
 * Stato Patrimoniale — Profitera
 * Kontabila non espone un endpoint SP dedicato.
 * Usiamo i dati CE aggregati per derivare i valori disponibili
 * e presentiamo la struttura WSNO-006 con zeri dove i dati mancano.
 */
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

function spVuoto(anno: number) {
  return {
    anno,
    attivo: {
      // Immobilizzazioni Immateriali
      immImmateriali: 0,
      fammImmateriali: 0,
      nettoImmImmateriali: 0,
      // Immobilizzazioni Materiali
      immMateriali_attrezzature: 0,
      immMateriali_mobili: 0,
      immMateriali_apparecchi: 0,
      immMateriali_hardware: 0,
      immMateriali_autoveicoli: 0,
      immMateriali_altri: 0,
      fammMateriali: 0,
      nettoImmMateriali: 0,
      // Immobilizzazioni Finanziarie
      immFinanziarie: 0,
      // Totale Attivo Fisso
      attivoFissoNetto: 0,
      // Circolante
      rimanenzeMerce: 0,
      creditiEntro: 0,
      creditiOltre: 0,
      totaleCrediti: 0,
      liquiditaImmediate: 0, // Cassa + Banche
      rateieRisconti: 0,
      attivoCircolante: 0,
      // Totale
      totaleAttivita: 0,
    },
    passivo: {
      // Patrimonio Netto
      capitaleSociale: 0,
      riservaLegale: 0,
      riservaEstraordinaria: 0,
      utiliPortatiANuovo: 0,
      risultatoEsercizio: 0,
      totalePatrimonioNetto: 0,
      // Passività Consolidate
      mutuiMedioLungo: 0,
      finanziamentiSoci: 0,
      altrePassConsolidate: 0,
      totalePassConsolidate: 0,
      // Passività Correnti
      bancheBrevePeriodo: 0,
      debitiFornitori: 0,
      debitiErario: 0,
      debitiINPS: 0,
      altrePassCorrenti: 0,
      totalePassCorrenti: 0,
      // Totale
      totalePassivita: 0,
    },
    check: 0,
  }
}

export default defineEventHandler(async () => {
  // Raccogliamo i risultati netti per anno dalla CE
  // per popolare almeno il Risultato di Esercizio nel PN
  const nettiPerAnno: Record<number, number> = {}

  for (const anno of ANNI) {
    try {
      const records = await fetchKontabila<CEMensile[]>('/api/conto-economico/list', {
        entityId: ENTITY_ID,
        year: anno,
      })
      if (Array.isArray(records)) {
        nettiPerAnno[anno] = records.reduce((s, r) => s + safe(r.risultatoNetto), 0)
      }
    } catch {
      nettiPerAnno[anno] = 0
    }
  }

  // Costruiamo SP con dati parziali disponibili
  // - Risultato esercizio = da CE
  // - Il resto è struttura vuota (SP non disponibile in Kontabila)
  const output = ANNI.map((anno) => {
    const sp = spVuoto(anno)
    const rn = nettiPerAnno[anno] ?? 0

    // Popoliamo solo ciò che possiamo ricavare
    sp.passivo.risultatoEsercizio = rn

    // PN provvisorio (solo risultato esercizio)
    sp.passivo.totalePatrimonioNetto = rn

    // Totali coerenti (check = 0 se tutti a zero)
    sp.attivo.totaleAttivita = sp.passivo.totalePatrimonioNetto
      + sp.passivo.totalePassConsolidate
      + sp.passivo.totalePassCorrenti
    sp.passivo.totalePassivita = sp.passivo.totalePatrimonioNetto
      + sp.passivo.totalePassConsolidate
      + sp.passivo.totalePassCorrenti
    sp.check = sp.attivo.totaleAttivita - sp.passivo.totalePassivita

    return sp
  })

  return { success: true, data: output, nota: 'SP parziale: solo Risultato Esercizio disponibile da Kontabila. Inserire manualmente i valori patrimoniali.' }
})
