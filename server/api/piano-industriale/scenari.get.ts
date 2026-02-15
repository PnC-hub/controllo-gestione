export default defineEventHandler(async (event) => {
  // Mock: Get saved scenarios
  return {
    success: true,
    data: [
      {
        id: 1,
        name: 'Scenario Base 2026',
        createdAt: '2026-01-15',
        variables: {
          revenueGrowth: 20,
          ebitdaMargin: 36,
          investments: 350,
          staffCostIncrease: 15,
          interestRate: 3.5,
          taxRate: 24
        },
        results: {
          revenue2030: 2500000,
          ebitda2030: 900000,
          netProfit2030: 520000,
          roi: 24
        }
      },
      {
        id: 2,
        name: 'Scenario Conservativo',
        createdAt: '2026-01-20',
        variables: {
          revenueGrowth: 12,
          ebitdaMargin: 28,
          investments: 250,
          staffCostIncrease: 10,
          interestRate: 4,
          taxRate: 24
        },
        results: {
          revenue2030: 1900000,
          ebitda2030: 532000,
          netProfit2030: 300000,
          roi: 21
        }
      }
    ]
  }
})
