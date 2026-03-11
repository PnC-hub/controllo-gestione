import { fetchKontabila, ENTITY_ID } from '~/server/utils/kontabila-client'

const ANNI = [2023, 2024, 2025]

interface SPRecord {
  year: number
  entityId: number
  // ATTIVO
  immobilizzazioniImmateriali?: number
  fondoAmmImmateriali?: number
  immobilizzazioniMateriali?: number
  fondoAmmMateriali?: number
  immobilizzazioniFinanziarie?: number
  attivitaCorrenti?: number
  disponibilitaLiquide?: number
  creditiCommerciali?: number
  totaleAttivo?: number
  // PASSIVO
  patrimoniNetto?: number
  capitaSociale?: number
  riservaLegale?: number
  riservaEstraordinaria?: number
  risultatoEsercizio?: number
  passivitaNonCorrenti?: number
  debitiBancariLungo?: number
  tfr?: number
  passivitaCorrenti?: number
  debitiCommerciali?: number
  debitiBancariBreve?: number
  totalePassivo?: number
  debitiTotali?: number
}

interface RenRecord {
  year?: number
  month?: number
  entitySlug?: string
  fatturato?: number
  costiTotali?: number
  saldoConto1?: number
  saldoConto2?: number
  debitiVerso?: number
}

function spVuoto(anno: number) {
  return {
    anno,
    attivo: {
      immobilizzazioniImmateriali: 0,
      fondoAmmImmateriali: 0,
      nettoImmobImmateriali: 0,
      immobilizzazioniMateriali: 0,
      fondoAmmMateriali: 0,
      nettoImmobMateriali: 0,
      immobilizzazioniFinanziarie: 0,
      attivoFissoNetto: 0,
      rimanenzeMerce: 0,
      creditiEntroEsercizio: 0,
      creditiOltreEsercizio: 0,
      totaleCrediti: 0,
      liquiditaDifferite: 0,
      liquiditaImmediate: 0,
      rateieRiscontiAttivi: 0,
      attivoCircolante: 0,
      totaleAttivita: 0,
    },
    passivo: {
      capitaleSociale: 0,
      riservaLegale: 0,
      riservaEstraordinaria: 0,
      risultatoEsercizio: 0,
      totalePatrimonioNetto: 0,
      passivitaConsolidateVarie: 0,
      mutuiEFinanziamenti: 0,
      totalePassivitaConsolidate: 0,
      banchEntro12Mesi: 0,
      passivitaCorrentiVarie: 0,
      totalePassivitaCorrenti: 0,
      totalePassivita: 0,
    },
    check: 0,
  }
}

export default defineEventHandler(async () => {
  const output = []

  for (const anno of ANNI) {
    const vuoto = spVuoto(anno)

    try {
      // Prova endpoint stato-patrimoniale
      let spData: SPRecord | null = null
      try {
        const list = await fetchKontabila<SPRecord[]>('/api/stato-patrimoniale', {
          entityId: ENTITY_ID,
          year: anno,
        })
        spData = Array.isArray(list) ? list.find(r => r.year === anno) ?? null : null
      } catch {
        // endpoint potrebbe non esistere — usa rendicontazione come proxy
      }

      if (spData) {
        const immImm = spData.immobilizzazioniImmateriali ?? 0
        const fammImm = spData.fondoAmmImmateriali ?? 0
        const immMat = spData.immobilizzazioniMateriali ?? 0
        const fammMat = spData.fondoAmmMateriali ?? 0
        const immFin = spData.immobilizzazioniFinanziarie ?? 0
        const attivoFisso = (immImm - fammImm) + (immMat - fammMat) + immFin
        const liquidita = spData.disponibilitaLiquide ?? 0
        const crediti = spData.creditiCommerciali ?? 0
        const attivoCircolante = (spData.attivitaCorrenti ?? 0)
        const totaleAttivita = spData.totaleAttivo ?? (attivoFisso + attivoCircolante)

        const pn = spData.patrimoniNetto ?? 0
        const passConsolidate = (spData.passivitaNonCorrenti ?? 0)
        const passCorrenti = (spData.passivitaCorrenti ?? 0)
        const totalePassivita = spData.totalePassivo ?? (pn + passConsolidate + passCorrenti)

        output.push({
          anno,
          attivo: {
            immobilizzazioniImmateriali: immImm,
            fondoAmmImmateriali: fammImm,
            nettoImmobImmateriali: immImm - fammImm,
            immobilizzazioniMateriali: immMat,
            fondoAmmMateriali: fammMat,
            nettoImmobMateriali: immMat - fammMat,
            immobilizzazioniFinanziarie: immFin,
            attivoFissoNetto: attivoFisso,
            rimanenzeMerce: 0,
            creditiEntroEsercizio: crediti,
            creditiOltreEsercizio: 0,
            totaleCrediti: crediti,
            liquiditaDifferite: crediti,
            liquiditaImmediate: liquidita,
            rateieRiscontiAttivi: 0,
            attivoCircolante,
            totaleAttivita,
          },
          passivo: {
            capitaleSociale: spData.capitaSociale ?? 0,
            riservaLegale: spData.riservaLegale ?? 0,
            riservaEstraordinaria: spData.riservaEstraordinaria ?? 0,
            risultatoEsercizio: spData.risultatoEsercizio ?? 0,
            totalePatrimonioNetto: pn,
            passivitaConsolidateVarie: 0,
            mutuiEFinanziamenti: spData.debitiBancariLungo ?? 0,
            totalePassivitaConsolidate: passConsolidate,
            banchEntro12Mesi: spData.debitiBancariBreve ?? 0,
            passivitaCorrentiVarie: spData.debitiCommerciali ?? 0,
            totalePassivitaCorrenti: passCorrenti,
            totalePassivita,
          },
          check: totaleAttivita - totalePassivita,
        })
      } else {
        // Prova rendicontazione come proxy parziale
        try {
          const ren = await fetchKontabila<RenRecord[]>('/api/rendicontazione/index', {
            entityId: ENTITY_ID,
          })
          const renAnno = Array.isArray(ren)
            ? ren.filter(r => r.entitySlug === 'smiledoc' || !r.entitySlug)
            : []

          if (renAnno.length) {
            const saldi = renAnno.reduce(
              (acc, r) => ({
                saldo1: acc.saldo1 + (r.saldoConto1 ?? 0),
                saldo2: acc.saldo2 + (r.saldoConto2 ?? 0),
                debiti: acc.debiti + (r.debitiVerso ?? 0),
              }),
              { saldo1: 0, saldo2: 0, debiti: 0 }
            )
            const liquidita = saldi.saldo1 + saldi.saldo2
            const row = spVuoto(anno)
            row.attivo.liquiditaImmediate = liquidita
            row.attivo.liquiditaDifferite = liquidita
            row.attivo.attivoCircolante = liquidita
            row.attivo.totaleAttivita = liquidita
            row.passivo.passivitaCorrentiVarie = saldi.debiti
            row.passivo.totalePassivitaCorrenti = saldi.debiti
            row.passivo.totalePassivita = saldi.debiti
            row.passivo.totalePatrimonioNetto = liquidita - saldi.debiti
            row.passivo.risultatoEsercizio = liquidita - saldi.debiti
            row.check = row.attivo.totaleAttivita - row.passivo.totalePassivita
            output.push(row)
          } else {
            output.push(vuoto)
          }
        } catch {
          output.push(vuoto)
        }
      }
    } catch (err) {
      console.warn(`[SP] Anno ${anno} non disponibile:`, err)
      output.push(vuoto)
    }
  }

  return { success: true, data: output }
})
