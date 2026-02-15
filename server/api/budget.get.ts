export default defineEventHandler(async (event) => {
  const query = getQuery(event)
  const year = query.year || 2026

  // Mock budget data
  const budgetData = {
    year,
    ricavi: {
      prestazioni: {
        Gen: 80000, Feb: 80000, Mar: 80000, Apr: 80000, Mag: 80000, Giu: 80000,
        Lug: 80000, Ago: 80000, Set: 80000, Ott: 80000, Nov: 80000, Dic: 80000
      },
      ortodonzia: {
        Gen: 15000, Feb: 15000, Mar: 15000, Apr: 15000, Mag: 15000, Giu: 15000,
        Lug: 15000, Ago: 15000, Set: 15000, Ott: 15000, Nov: 15000, Dic: 15000
      },
      igiene: {
        Gen: 8000, Feb: 8000, Mar: 8000, Apr: 8000, Mag: 8000, Giu: 8000,
        Lug: 8000, Ago: 8000, Set: 8000, Ott: 8000, Nov: 8000, Dic: 8000
      }
    },
    costi: {
      personale: {
        Gen: 28000, Feb: 28000, Mar: 28000, Apr: 28000, Mag: 28000, Giu: 28000,
        Lug: 28000, Ago: 28000, Set: 28000, Ott: 28000, Nov: 28000, Dic: 28000
      },
      materiali: {
        Gen: 12000, Feb: 12000, Mar: 12000, Apr: 12000, Mag: 12000, Giu: 12000,
        Lug: 12000, Ago: 12000, Set: 12000, Ott: 12000, Nov: 12000, Dic: 12000
      },
      affitto: {
        Gen: 3500, Feb: 3500, Mar: 3500, Apr: 3500, Mag: 3500, Giu: 3500,
        Lug: 3500, Ago: 3500, Set: 3500, Ott: 3500, Nov: 3500, Dic: 3500
      },
      utenze: {
        Gen: 2000, Feb: 2000, Mar: 2000, Apr: 2000, Mag: 2000, Giu: 2000,
        Lug: 2000, Ago: 2000, Set: 2000, Ott: 2000, Nov: 2000, Dic: 2000
      },
      ammortamenti: {
        Gen: 4000, Feb: 4000, Mar: 4000, Apr: 4000, Mag: 4000, Giu: 4000,
        Lug: 4000, Ago: 4000, Set: 4000, Ott: 4000, Nov: 4000, Dic: 4000
      },
      consulenze: {
        Gen: 2500, Feb: 2500, Mar: 2500, Apr: 2500, Mag: 2500, Giu: 2500,
        Lug: 2500, Ago: 2500, Set: 2500, Ott: 2500, Nov: 2500, Dic: 2500
      },
      marketing: {
        Gen: 1500, Feb: 1500, Mar: 1500, Apr: 1500, Mag: 1500, Giu: 1500,
        Lug: 1500, Ago: 1500, Set: 1500, Ott: 1500, Nov: 1500, Dic: 1500
      },
      assicurazioni: {
        Gen: 800, Feb: 800, Mar: 800, Apr: 800, Mag: 800, Giu: 800,
        Lug: 800, Ago: 800, Set: 800, Ott: 800, Nov: 800, Dic: 800
      },
      oneri_finanziari: {
        Gen: 500, Feb: 500, Mar: 500, Apr: 500, Mag: 500, Giu: 500,
        Lug: 500, Ago: 500, Set: 500, Ott: 500, Nov: 500, Dic: 500
      },
      imposte: {
        Gen: 15000, Feb: 15000, Mar: 15000, Apr: 15000, Mag: 15000, Giu: 15000,
        Lug: 15000, Ago: 15000, Set: 15000, Ott: 15000, Nov: 15000, Dic: 15000
      }
    }
  }

  return {
    success: true,
    data: budgetData
  }
})
