export default defineEventHandler(async (event) => {
  // Mock forecast data with actuals for past months
  const forecastData = {
    ricavi: {
      prestazioni: {
        Gen: 82000, Feb: 79000, Mar: 83000, Apr: 81500, Mag: 79000, // Actuals (past)
        Giu: 80000, Lug: 80000, Ago: 80000, Set: 80000, Ott: 80000, Nov: 80000, Dic: 80000 // Forecast
      },
      ortodonzia: {
        Gen: 14500, Feb: 15200, Mar: 14800, Apr: 15100, Mag: 15500,
        Giu: 15000, Lug: 15000, Ago: 15000, Set: 15000, Ott: 15000, Nov: 15000, Dic: 15000
      },
      igiene: {
        Gen: 8100, Feb: 7900, Mar: 8200, Apr: 8000, Mag: 7800,
        Giu: 8000, Lug: 8000, Ago: 8000, Set: 8000, Ott: 8000, Nov: 8000, Dic: 8000
      }
    },
    costi: {
      personale: {
        Gen: 27800, Feb: 28200, Mar: 27900, Apr: 28100, Mag: 28000,
        Giu: 28000, Lug: 28000, Ago: 28000, Set: 28000, Ott: 28000, Nov: 28000, Dic: 28000
      },
      materiali: {
        Gen: 11500, Feb: 12300, Mar: 11800, Apr: 12100, Mag: 12200,
        Giu: 12000, Lug: 12000, Ago: 12000, Set: 12000, Ott: 12000, Nov: 12000, Dic: 12000
      },
      affitto: {
        Gen: 3500, Feb: 3500, Mar: 3500, Apr: 3500, Mag: 3500,
        Giu: 3500, Lug: 3500, Ago: 3500, Set: 3500, Ott: 3500, Nov: 3500, Dic: 3500
      },
      utenze: {
        Gen: 2100, Feb: 2200, Mar: 1900, Apr: 2000, Mag: 1800,
        Giu: 2000, Lug: 2000, Ago: 2000, Set: 2000, Ott: 2000, Nov: 2000, Dic: 2000
      },
      ammortamenti: {
        Gen: 4000, Feb: 4000, Mar: 4000, Apr: 4000, Mag: 4000,
        Giu: 4000, Lug: 4000, Ago: 4000, Set: 4000, Ott: 4000, Nov: 4000, Dic: 4000
      },
      consulenze: {
        Gen: 2400, Feb: 2600, Mar: 2500, Apr: 2450, Mag: 2550,
        Giu: 2500, Lug: 2500, Ago: 2500, Set: 2500, Ott: 2500, Nov: 2500, Dic: 2500
      },
      marketing: {
        Gen: 1600, Feb: 1400, Mar: 1550, Apr: 1500, Mag: 1450,
        Giu: 1500, Lug: 1500, Ago: 1500, Set: 1500, Ott: 1500, Nov: 1500, Dic: 1500
      },
      assicurazioni: {
        Gen: 800, Feb: 800, Mar: 800, Apr: 800, Mag: 800,
        Giu: 800, Lug: 800, Ago: 800, Set: 800, Ott: 800, Nov: 800, Dic: 800
      },
      oneri_finanziari: {
        Gen: 520, Feb: 480, Mar: 510, Apr: 500, Mag: 490,
        Giu: 500, Lug: 500, Ago: 500, Set: 500, Ott: 500, Nov: 500, Dic: 500
      },
      imposte: {
        Gen: 15200, Feb: 14800, Mar: 15100, Apr: 14900, Mag: 15000,
        Giu: 15000, Lug: 15000, Ago: 15000, Set: 15000, Ott: 15000, Nov: 15000, Dic: 15000
      }
    },
    currentMonth: 5 // May (0-indexed)
  }

  return {
    success: true,
    data: forecastData
  }
})
