import { fetchKontabila, ENTITY_ID } from '~/server/utils/kontabila-client'

const ANNI = [2023, 2024, 2025]
const MESI = [
  'GENNAIO', 'FEBBRAIO', 'MARZO', 'APRILE', 'MAGGIO', 'GIUGNO',
  'LUGLIO', 'AGOSTO', 'SETTEMBRE', 'OTTOBRE', 'NOVEMBRE', 'DICEMBRE',
]

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

function getSubtotal(righe: any[], code: string): number {
  const r = righe.find((x: any) => x.isSubtotal && x.contoCode === code)
  return r ? safe(r.importo) : 0
}

function cfMeseVuoto(mese: string, indice: number) {
  return {
    mese,
    indice,
    // DEPOSITI BANCARI
    saldoBancaInizio: 0,
    // ENTRATE
    erogazioneFinanziamenti: 0,    // Erogazione Mutui/Finanziamenti
    apportoSoci: 0,                 // Apporto / Finanziamento Soci
    incassiClienti: 0,              // Incassi da Clienti (prestazioni)
    creditoImposta: 0,              // Credito d'Imposta / contributi
    pianiRientro: 0,                // Piani di Rientro / rate incassate
    liquidazioniInteressi: 0,       // Liquidazioni interessi attivi
    caparre: 0,                     // Clienti c/Caparre
    rimborsiAssicurativi: 0,        // Rimborsi Assicurativi / convenzioni
    altreEntrate: 0,                // Altre Entrate
    totaleEntrate: 0,
    // USCITE
    salariStipendi: 0,              // Salari e Stipendi (8.10)
    emolumentoAmministratore: 0,    // Emolumento Amministratori
    fornitori: 0,                   // Pagamenti Fornitori (materie prime + lav. lab)
    f24Iva: 0,                      // F24 - IVA
    f24Imposte: 0,                  // F24 - Imposte Dirette (IRPEF/IRES)
    f24INPS: 0,                     // F24 - Contributi INPS (8.11)
    f24Ritenute: 0,                 // F24 - Ritenute d'Acconto Professionisti
    affittiCanoni: 0,               // Affitti e Canoni (8.05)
    energiaElettrica: 0,            // Energia Elettrica
    utenzeTelefono: 0,              // Utenze Telefoniche
    consulenzeAmministrative: 0,    // Consulenze Amministrative/Commercialista
    canoniLeasing: 0,               // Canoni Leasing Attrezzature
    speseBancarie: 0,               // Spese Bancarie e Oneri Finanziari (8.43)
    manutenzioni: 0,                // Manutenzioni e Riparazioni
    materialeConsumo: 0,            // Acquisto Materiale di Consumo (8.01)
    laboratorio: 0,                 // Lavorazioni Laboratorio Esterno
    formazione: 0,                  // Corsi di Formazione
    assicurazioni: 0,               // Assicurazioni
    smaltimentoRifiuti: 0,          // Smaltimento Rifiuti Speciali
    altreSpese: 0,                  // Altre Spese
    rateMutui: 0,                   // Rate Mutui Capitale
    totaleUscite: 0,
    // SALDO
    saldoFinale: 0,
  }
}

export default defineEventHandler(async () => {
  const output = []

  for (const anno of ANNI) {
    const mesiCF = MESI.map((nome, i) => cfMeseVuoto(nome, i + 1))

    try {
      const records = await fetchKontabila<CEMensile[]>('/api/conto-economico/list', {
        entityId: ENTITY_ID,
        year: anno,
      })

      if (Array.isArray(records) && records.length > 0) {
        const byMonth = new Map<number, CEMensile>()
        for (const r of records) byMonth.set(r.month, r)

        // Calcolo pesi mensili (agosto = 0.6x, luglio = 0.9x, dicembre = 1.2x)
        const pesi = [1.0, 1.0, 1.1, 1.0, 1.0, 1.0, 0.9, 0.6, 1.0, 1.0, 1.2, 1.1]
        const totPesi = pesi.reduce((a, b) => a + b, 0)

        const totRicaviAnno = records.reduce((s, r) => s + safe(r.totaleRicavi), 0)
        const totCostiAnno = records.reduce((s, r) => s + safe(r.totaleCosti), 0)

        // Subtotali annuali dai righe
        const subAnno: Record<string, number> = {}
        for (const rec of records) {
          for (const r of rec.righe ?? []) {
            if (r.isSubtotal && r.contoCode) {
              subAnno[r.contoCode] = (subAnno[r.contoCode] ?? 0) + safe(r.importo)
            }
          }
        }

        let saldoPrecedente = 0

        for (const mese of mesiCF) {
          const rec = byMonth.get(mese.indice)
          const peso = pesi[mese.indice - 1] / totPesi

          const ricaviMese = rec ? safe(rec.totaleRicavi) : totRicaviAnno * peso
          const costiMese = rec ? safe(rec.totaleCosti) : totCostiAnno * peso

          // Subtotali mensili
          const righe = rec?.righe ?? []
          const mat8_01 = getSubtotal(righe, '8.01') || (subAnno['8.01'] ?? 0) * peso
          const godimento8_05 = getSubtotal(righe, '8.05') || (subAnno['8.05'] ?? 0) * peso
          const salari8_10 = getSubtotal(righe, '8.10') || (subAnno['8.10'] ?? 0) * peso
          const inps8_11 = getSubtotal(righe, '8.11') || (subAnno['8.11'] ?? 0) * peso
          const finanz8_43 = getSubtotal(righe, '8.43') || (subAnno['8.43'] ?? 0) * peso
          const oneriDiv8_35 = getSubtotal(righe, '8.35') || (subAnno['8.35'] ?? 0) * peso

          // ENTRATE
          mese.incassiClienti = Math.round(ricaviMese * 0.92)       // 92% riscosso nel mese
          mese.altreEntrate = Math.round(ricaviMese * 0.08)          // 8% rate/ritardi
          mese.totaleEntrate = mese.incassiClienti + mese.altreEntrate

          // USCITE
          mese.salariStipendi = Math.round(salari8_10)
          mese.f24INPS = Math.round(inps8_11)
          mese.affittiCanoni = Math.round(godimento8_05)
          mese.materialeConsumo = Math.round(mat8_01)
          mese.speseBancarie = Math.round(finanz8_43)

          // Stima laboratorio (30% di 8.04 netto stimato)
          const costiRestanti = costiMese - salari8_10 - inps8_11 - godimento8_05 - mat8_01 - finanz8_43
          mese.laboratorio = Math.round(Math.max(costiRestanti * 0.25, 0))
          mese.consulenzeAmministrative = Math.round(Math.max(costiRestanti * 0.15, 0))
          mese.energiaElettrica = Math.round(Math.max(costiRestanti * 0.08, 0))
          mese.utenzeTelefono = Math.round(Math.max(costiRestanti * 0.03, 0))
          mese.formazione = Math.round(Math.max(costiRestanti * 0.05, 0))
          mese.altreSpese = Math.round(Math.max(costiRestanti * 0.10, 0))
          mese.f24Iva = Math.round(ricaviMese * 0.05)   // Stima IVA

          mese.totaleUscite = mese.salariStipendi + mese.f24INPS + mese.affittiCanoni
            + mese.materialeConsumo + mese.speseBancarie + mese.laboratorio
            + mese.consulenzeAmministrative + mese.energiaElettrica + mese.utenzeTelefono
            + mese.formazione + mese.altreSpese + mese.f24Iva

          mese.saldoBancaInizio = Math.round(saldoPrecedente)
          mese.saldoFinale = Math.round(saldoPrecedente + mese.totaleEntrate - mese.totaleUscite)
          saldoPrecedente = mese.saldoFinale
        }
      }
    } catch (err) {
      console.warn(`[CF] Anno ${anno}:`, err)
    }

    output.push({ anno, mesi: mesiCF })
  }

  return { success: true, data: output }
})
