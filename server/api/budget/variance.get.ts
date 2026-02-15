export default defineEventHandler(async (event) => {
  // Mock variance data
  const varianceData = {
    summary: {
      ricavi: {
        budget: 618000,
        actual: 620000,
        variance: 2000,
        variancePercent: 0.32
      },
      costi: {
        budget: 418800,
        actual: 412000,
        variance: -6800,
        variancePercent: -1.62
      },
      risultato: {
        budget: 199200,
        actual: 208000,
        variance: 8800,
        variancePercent: 4.42
      }
    },
    ricavi: [
      {
        voce: 'Prestazioni odontoiatriche',
        budget: 400000,
        actual: 405000,
        variance: 5000,
        variancePercent: 1.25
      },
      {
        voce: 'Ortodonzia',
        budget: 75000,
        actual: 72000,
        variance: -3000,
        variancePercent: -4.0
      },
      {
        voce: 'Igiene',
        budget: 40000,
        actual: 40000,
        variance: 0,
        variancePercent: 0
      },
      {
        voce: 'Implantologia',
        budget: 103000,
        actual: 103000,
        variance: 0,
        variancePercent: 0
      }
    ],
    costi: [
      {
        voce: 'Personale',
        budget: 140000,
        actual: 138500,
        variance: -1500,
        variancePercent: -1.07
      },
      {
        voce: 'Materiali consumo',
        budget: 60000,
        actual: 57800,
        variance: -2200,
        variancePercent: -3.67
      },
      {
        voce: 'Affitto',
        budget: 17500,
        actual: 17500,
        variance: 0,
        variancePercent: 0
      },
      {
        voce: 'Utenze',
        budget: 10000,
        actual: 11200,
        variance: 1200,
        variancePercent: 12.0
      },
      {
        voce: 'Ammortamenti',
        budget: 20000,
        actual: 20000,
        variance: 0,
        variancePercent: 0
      },
      {
        voce: 'Consulenze',
        budget: 12500,
        actual: 13000,
        variance: 500,
        variancePercent: 4.0
      },
      {
        voce: 'Marketing',
        budget: 7500,
        actual: 8500,
        variance: 1000,
        variancePercent: 13.33
      },
      {
        voce: 'Assicurazioni',
        budget: 4000,
        actual: 3800,
        variance: -200,
        variancePercent: -5.0
      },
      {
        voce: 'Oneri finanziari',
        budget: 2500,
        actual: 2400,
        variance: -100,
        variancePercent: -4.0
      },
      {
        voce: 'Imposte (IRES+IRAP)',
        budget: 75000,
        actual: 72300,
        variance: -2700,
        variancePercent: -3.6
      }
    ]
  }

  return {
    success: true,
    data: varianceData
  }
})
