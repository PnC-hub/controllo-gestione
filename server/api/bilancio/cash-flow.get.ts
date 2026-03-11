import { fetchKontabila, ENTITY_ID } from '~/server/utils/kontabila-client'

const ANNI = [2023, 2024, 2025]
const MESI = ['GENNAIO','FEBBRAIO','MARZO','APRILE','MAGGIO','GIUGNO','LUGLIO','AGOSTO','SETTEMBRE','OTTOBRE','NOVEMBRE','DICEMBRE']

interface CERecord {
  year: number
  month: number
  totaleRicavi: number
  totaleCosti: number
  risultatoNetto: number
  ebitda: number | null
}

function cfVuotoAnno(anno: number) {
  const mesi = MESI.map((nome, i) => ({
    mese: nome,
    indice: i + 1,
    saldoBancaInizio: 0,
    // Entrate
    erogazioneFinanziamenti: 0,
    apportoSoci: 0,
    incassiClienti: 0,
    creditoImposta: 0,
    altreEntrate: 0,
    totaleEntrate: 0,
    // Uscite (in negativo)
    salariStipendi: 0,
    emolumentoAmministratore: 0,
    fornitori: 0,
    imposteTasse: 0,
    versamentoIva: 0,
    contributiDipendenti: 0,
    ritenuteProfessionisti: 0,
    canoniManutenzione: 0,
    energiaElettrica: 0,
    telefoniche: 0,
    consulenzeAmministrative: 0,
    canoniLeasing: 0,
    altreUscite: 0,
    totaleUscite: 0,
    // Saldo finale
    saldoFinale: 0,
  }))
  return { anno, mesi }
}

function distribuisciMensile(annuale: number, month: number, ricerca: 'inc' | 'usc'): number {
  // Agosto spesso ha meno attività (fattore 0.5), dicembre di più (1.2)
  const pesi = [1,1,1,1,1,1,1,0.5,1,1,1.2,1.1]
  const somma = pesi.reduce((a,b) => a+b, 0)
  return annuale * (pesi[month - 1] / somma)
}

export default defineEventHandler(async () => {
  const output = []

  for (const anno of ANNI) {
    try {
      const records = await fetchKontabila<CERecord[]>('/api/conto-economico/list', {
        entityId: ENTITY_ID,
        year: anno,
      })

      const cf = cfVuotoAnno(anno)

      if (Array.isArray(records) && records.length > 0) {
        // Costruisci mappa mese → dati
        const byMonth = new Map<number, CERecord>()
        for (const r of records) {
          byMonth.set(r.month, r)
        }

        // Ricava totali annuali come fallback per mesi mancanti
        const totaleRicaviAnnuale = records.reduce((s,r) => s + r.totaleRicavi, 0)
        const totaleCostiAnnuale = records.reduce((s,r) => s + r.totaleCosti, 0)

        let saldoPrecedente = 0

        for (const mese of cf.mesi) {
          const rec = byMonth.get(mese.indice)
          const ricavi = rec ? rec.totaleRicavi : distribuisciMensile(totaleRicaviAnnuale, mese.indice, 'inc')
          const costi = rec ? rec.totaleCosti : distribuisciMensile(totaleCostiAnnuale, mese.indice, 'usc')

          // Incassi clienti = 90% ricavi (10% rimane credito)
          mese.incassiClienti = Math.round(ricavi * 0.9)
          mese.altreEntrate = 0
          mese.totaleEntrate = mese.incassiClienti

          // Stima ripartizione costi
          const costiPersonale = Math.round(costi * 0.35)
          const costiFornitore = Math.round(costi * 0.25)
          const costiAltri = Math.round(costi * 0.15)
          const iva = Math.round(costi * 0.10)
          const contributi = Math.round(costi * 0.08)
          const canoni = Math.round(costi * 0.07)

          mese.salariStipendi = -costiPersonale
          mese.fornitori = -costiFornitore
          mese.versamentoIva = -iva
          mese.contributiDipendenti = -contributi
          mese.canoniLeasing = -canoni
          mese.altreUscite = -costiAltri
          mese.totaleUscite = -(costiPersonale + costiFornitore + iva + contributi + canoni + costiAltri)

          mese.saldoBancaInizio = saldoPrecedente
          mese.saldoFinale = saldoPrecedente + mese.totaleEntrate + mese.totaleUscite
          saldoPrecedente = mese.saldoFinale
        }
      }

      output.push(cf)
    } catch (err) {
      console.warn(`[CF] Anno ${anno} non disponibile:`, err)
      output.push(cfVuotoAnno(anno))
    }
  }

  return { success: true, data: output }
})
