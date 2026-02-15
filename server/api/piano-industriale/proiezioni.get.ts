export default defineEventHandler(async (event) => {
  // Mock: Get detailed projections
  return {
    success: true,
    data: {
      contoEconomico: {
        2026: {
          ricavi: 1200000,
          costiOperativi: 840000,
          ebitda: 360000,
          ebitdaMargin: 30,
          ammortamenti: 80000,
          ebit: 280000,
          oneriFinanziari: 20000,
          imposte: 62400,
          utileNetto: 197600
        },
        2027: {
          ricavi: 1500000,
          costiOperativi: 1000000,
          ebitda: 500000,
          ebitdaMargin: 33.3,
          ammortamenti: 100000,
          ebit: 400000,
          oneriFinanziari: 30000,
          imposte: 88800,
          utileNetto: 281200
        },
        2028: {
          ricavi: 1800000,
          costiOperativi: 1200000,
          ebitda: 600000,
          ebitdaMargin: 33.3,
          ammortamenti: 120000,
          ebit: 480000,
          oneriFinanziari: 35000,
          imposte: 106800,
          utileNetto: 338200
        },
        2029: {
          ricavi: 2100000,
          costiOperativi: 1350000,
          ebitda: 750000,
          ebitdaMargin: 35.7,
          ammortamenti: 140000,
          ebit: 610000,
          oneriFinanziari: 40000,
          imposte: 136800,
          utileNetto: 433200
        },
        2030: {
          ricavi: 2500000,
          costiOperativi: 1600000,
          ebitda: 900000,
          ebitdaMargin: 36,
          ammortamenti: 160000,
          ebit: 740000,
          oneriFinanziari: 45000,
          imposte: 166800,
          utileNetto: 528200
        }
      },
      statoPatrimoniale: {
        2026: {
          immobilizzazioni: 450000,
          attivoCircolante: 320000,
          totaleAttivo: 770000,
          patrimonioNetto: 400000,
          debitiFinanziari: 200000,
          debitiCorrenti: 170000,
          totalePassivo: 770000
        },
        2030: {
          immobilizzazioni: 1100000,
          attivoCircolante: 850000,
          totaleAttivo: 1950000,
          patrimonioNetto: 1150000,
          debitiFinanziari: 30000,
          debitiCorrenti: 770000,
          totalePassivo: 1950000
        }
      },
      cashFlow: {
        2026: {
          cashFlowOperativo: 250000,
          investimenti: -110000,
          cashFlowFinanziario: -20000,
          variazioneLiquidita: 120000,
          liquiditaFinale: 100000
        },
        2030: {
          cashFlowOperativo: 640000,
          investimenti: -250000,
          cashFlowFinanziario: -300000,
          variazioneLiquidita: 90000,
          liquiditaFinale: 370000
        }
      }
    }
  }
})
