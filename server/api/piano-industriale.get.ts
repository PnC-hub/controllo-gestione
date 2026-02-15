export default defineEventHandler(async (event) => {
  // Mock: Get business plan data
  return {
    success: true,
    data: {
      id: 1,
      version: 'v1',
      title: 'Piano Industriale 2026-2030',
      lastUpdated: '2026-01-31',
      summary: {
        targetRevenue2030: 2500000,
        ebitdaTarget: 36,
        totalInvestments: 350000,
        newChairs: 3,
        newEmployees: 5
      },
      years: [2026, 2027, 2028, 2029, 2030],
      projections: {
        revenue: [1200000, 1500000, 1800000, 2100000, 2500000],
        costs: [840000, 1000000, 1200000, 1350000, 1600000],
        ebitda: [360000, 500000, 600000, 750000, 900000],
        ebitdaMargin: [30, 33.3, 33.3, 35.7, 36],
        netProfit: [200000, 280000, 340000, 430000, 520000],
        cashFlow: [250000, 350000, 420000, 530000, 640000],
        pfn: [-100000, -50000, 50000, 200000, 400000]
      }
    }
  }
})
