<template>
  <div class="space-y-6">
    <!-- Header -->
    <div class="flex items-center justify-between">
      <div>
        <div class="flex items-center gap-2">
          <h1 class="text-2xl font-bold text-slate-800">Rolling Forecast</h1>
          <PageInfoButton
            title="Forecast"
            description="Forecast rolling a partire dal budget consuntivo con proiezioni future"
            :features="[
              'Proiezioni basate su dati reali',
              'Trend e seasonality',
              'Scenari multipli'
            ]"
          />
        </div>
        <p class="text-sm text-slate-500 mt-1">Previsioni aggiornate con dati consuntivi</p>
      </div>
      <div class="flex items-center gap-3">
        <button @click="updateForecast" class="px-6 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors">
          <i class="fas fa-sync-alt mr-2"></i>
          Aggiorna Forecast
        </button>
      </div>
    </div>

    <!-- Info Banner -->
    <div class="bg-blue-50 border border-blue-200 rounded-lg p-4 flex items-start gap-3">
      <i class="fas fa-info-circle text-blue-600 mt-0.5"></i>
      <div>
        <p class="text-sm text-blue-800">
          <strong>Rolling Forecast:</strong> I mesi passati mostrano i dati consuntivi (grigio), i mesi futuri sono modificabili per aggiornare le previsioni.
        </p>
      </div>
    </div>

    <!-- Forecast Table -->
    <div class="card">
      <div class="overflow-x-auto">
        <div class="inline-block min-w-full align-middle">
          <table class="min-w-full forecast-table">
            <thead>
              <tr>
                <th class="sticky-col">Voce</th>
                <th v-for="month in months" :key="month.key" :class="month.isPast ? 'past-month' : 'future-month'">
                  {{ month.label }}
                  <div class="text-xs font-normal mt-1 opacity-60">{{ month.isPast ? 'Actual' : 'Forecast' }}</div>
                </th>
                <th class="total-col">Totale</th>
                <th class="variance-col">
                  Scostamento
                  <div class="text-xs font-normal mt-1 opacity-60">vs Budget</div>
                </th>
              </tr>
            </thead>
            <tbody>
              <!-- RICAVI -->
              <tr class="section-header">
                <td colspan="16" class="text-left font-bold text-emerald-700 bg-emerald-50">RICAVI</td>
              </tr>
              <tr v-for="item in ricaviItems" :key="item.key">
                <td class="sticky-col voce-name">{{ item.label }}</td>
                <td v-for="month in months" :key="month.key" :class="month.isPast ? 'past-cell' : 'forecast-cell'">
                  <input
                    v-if="!month.isPast"
                    v-model.number="forecastData.ricavi[item.key][month.key]"
                    type="number"
                    step="100"
                    class="forecast-input"
                  />
                  <span v-else class="actual-value">{{ formatCurrency(forecastData.ricavi[item.key][month.key]) }}</span>
                </td>
                <td class="total-col">{{ formatCurrency(calculateRowTotal('ricavi', item.key)) }}</td>
                <td class="variance-col" :class="getVarianceClass(calculateRowVariance('ricavi', item.key))">
                  {{ formatCurrency(calculateRowVariance('ricavi', item.key)) }}
                </td>
              </tr>
              <tr class="subtotal-row">
                <td class="sticky-col font-bold">TOTALE RICAVI</td>
                <td v-for="month in months" :key="month.key" :class="month.isPast ? 'past-cell' : 'forecast-cell'" class="font-bold">
                  {{ formatCurrency(calculateMonthTotal('ricavi', month.key)) }}
                </td>
                <td class="total-col font-bold">{{ formatCurrency(totaleRicavi) }}</td>
                <td class="variance-col font-bold" :class="getVarianceClass(totaleRicavi - budgetTotaleRicavi)">
                  {{ formatCurrency(totaleRicavi - budgetTotaleRicavi) }}
                </td>
              </tr>

              <!-- COSTI -->
              <tr class="section-header">
                <td colspan="16" class="text-left font-bold text-red-700 bg-red-50">COSTI</td>
              </tr>
              <tr v-for="item in costiItems" :key="item.key">
                <td class="sticky-col voce-name">{{ item.label }}</td>
                <td v-for="month in months" :key="month.key" :class="month.isPast ? 'past-cell' : 'forecast-cell'">
                  <input
                    v-if="!month.isPast"
                    v-model.number="forecastData.costi[item.key][month.key]"
                    type="number"
                    step="100"
                    class="forecast-input"
                  />
                  <span v-else class="actual-value">{{ formatCurrency(forecastData.costi[item.key][month.key]) }}</span>
                </td>
                <td class="total-col">{{ formatCurrency(calculateRowTotal('costi', item.key)) }}</td>
                <td class="variance-col" :class="getVarianceClass(-(calculateRowVariance('costi', item.key)))">
                  {{ formatCurrency(calculateRowVariance('costi', item.key)) }}
                </td>
              </tr>
              <tr class="subtotal-row">
                <td class="sticky-col font-bold">TOTALE COSTI</td>
                <td v-for="month in months" :key="month.key" :class="month.isPast ? 'past-cell' : 'forecast-cell'" class="font-bold">
                  {{ formatCurrency(calculateMonthTotal('costi', month.key)) }}
                </td>
                <td class="total-col font-bold">{{ formatCurrency(totaleCosti) }}</td>
                <td class="variance-col font-bold" :class="getVarianceClass(-(totaleCosti - budgetTotaleCosti))">
                  {{ formatCurrency(totaleCosti - budgetTotaleCosti) }}
                </td>
              </tr>

              <!-- RISULTATO -->
              <tr class="result-row">
                <td class="sticky-col font-bold text-lg">RISULTATO NETTO</td>
                <td v-for="month in months" :key="month.key" :class="month.isPast ? 'past-cell' : 'forecast-cell'" class="font-bold text-lg">
                  <span :class="calculateMonthResult(month.key) >= 0 ? 'text-emerald-600' : 'text-red-600'">
                    {{ formatCurrency(calculateMonthResult(month.key)) }}
                  </span>
                </td>
                <td class="total-col font-bold text-lg" :class="risultatoNetto >= 0 ? 'text-emerald-600' : 'text-red-600'">
                  {{ formatCurrency(risultatoNetto) }}
                </td>
                <td class="variance-col font-bold text-lg" :class="getVarianceClass(risultatoNetto - budgetRisultato)">
                  {{ formatCurrency(risultatoNetto - budgetRisultato) }}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  layout: 'default'
})

const currentMonth = 5 // May (0-indexed) - simulate current month

const months = [
  { key: 'Gen', label: 'Gen', isPast: true },
  { key: 'Feb', label: 'Feb', isPast: true },
  { key: 'Mar', label: 'Mar', isPast: true },
  { key: 'Apr', label: 'Apr', isPast: true },
  { key: 'Mag', label: 'Mag', isPast: true },
  { key: 'Giu', label: 'Giu', isPast: false },
  { key: 'Lug', label: 'Lug', isPast: false },
  { key: 'Ago', label: 'Ago', isPast: false },
  { key: 'Set', label: 'Set', isPast: false },
  { key: 'Ott', label: 'Ott', isPast: false },
  { key: 'Nov', label: 'Nov', isPast: false },
  { key: 'Dic', label: 'Dic', isPast: false }
]

const ricaviItems = [
  { key: 'prestazioni', label: 'Prestazioni odontoiatriche' },
  { key: 'ortodonzia', label: 'Ortodonzia' },
  { key: 'igiene', label: 'Igiene' }
]

const costiItems = [
  { key: 'personale', label: 'Personale' },
  { key: 'materiali', label: 'Materiali consumo' },
  { key: 'affitto', label: 'Affitto' },
  { key: 'utenze', label: 'Utenze' },
  { key: 'ammortamenti', label: 'Ammortamenti' },
  { key: 'consulenze', label: 'Consulenze' },
  { key: 'marketing', label: 'Marketing' },
  { key: 'assicurazioni', label: 'Assicurazioni' },
  { key: 'oneri_finanziari', label: 'Oneri finanziari' },
  { key: 'imposte', label: 'Imposte (IRES+IRAP)' }
]

const initializeForecastData = () => {
  const ricavi: any = {}
  const costi: any = {}

  const ricaviValues: Record<string, number> = {
    prestazioni: 80000,
    ortodonzia: 15000,
    igiene: 8000
  }

  const costiValues: Record<string, number> = {
    personale: 28000,
    materiali: 12000,
    affitto: 3500,
    utenze: 2000,
    ammortamenti: 4000,
    consulenze: 2500,
    marketing: 1500,
    assicurazioni: 800,
    oneri_finanziari: 500,
    imposte: 15000
  }

  // Add variance to actual months (past)
  ricaviItems.forEach(item => {
    ricavi[item.key] = {}
    months.forEach(month => {
      const baseValue = ricaviValues[item.key] || 0
      const variance = month.isPast ? Math.random() * 0.1 - 0.05 : 0 // +/- 5% for actuals
      ricavi[item.key][month.key] = Math.round(baseValue * (1 + variance))
    })
  })

  costiItems.forEach(item => {
    costi[item.key] = {}
    months.forEach(month => {
      const baseValue = costiValues[item.key] || 0
      const variance = month.isPast ? Math.random() * 0.08 - 0.04 : 0 // +/- 4% for actuals
      costi[item.key][month.key] = Math.round(baseValue * (1 + variance))
    })
  })

  return { ricavi, costi }
}

const forecastData = reactive(initializeForecastData())

// Budget reference values (from original budget)
const budgetTotaleRicavi = 1236000
const budgetTotaleCosti = 837600
const budgetRisultato = 398400

const totaleRicavi = computed(() => {
  let total = 0
  ricaviItems.forEach(item => {
    months.forEach(month => {
      total += forecastData.ricavi[item.key][month.key] || 0
    })
  })
  return total
})

const totaleCosti = computed(() => {
  let total = 0
  costiItems.forEach(item => {
    months.forEach(month => {
      total += forecastData.costi[item.key][month.key] || 0
    })
  })
  return total
})

const risultatoNetto = computed(() => totaleRicavi.value - totaleCosti.value)

const calculateRowTotal = (section: string, key: string) => {
  let total = 0
  months.forEach(month => {
    total += forecastData[section][key][month.key] || 0
  })
  return total
}

const calculateMonthTotal = (section: string, monthKey: string) => {
  let total = 0
  const items = section === 'ricavi' ? ricaviItems : costiItems
  items.forEach(item => {
    total += forecastData[section][item.key][monthKey] || 0
  })
  return total
}

const calculateMonthResult = (monthKey: string) => {
  return calculateMonthTotal('ricavi', monthKey) - calculateMonthTotal('costi', monthKey)
}

const calculateRowVariance = (section: string, key: string) => {
  const budgetMonthlyValues: Record<string, Record<string, number>> = {
    ricavi: { prestazioni: 80000, ortodonzia: 15000, igiene: 8000 },
    costi: {
      personale: 28000, materiali: 12000, affitto: 3500, utenze: 2000,
      ammortamenti: 4000, consulenze: 2500, marketing: 1500, assicurazioni: 800,
      oneri_finanziari: 500, imposte: 15000
    }
  }

  const forecastTotal = calculateRowTotal(section, key)
  const budgetTotal = (budgetMonthlyValues[section][key] || 0) * 12
  return forecastTotal - budgetTotal
}

const getVarianceClass = (variance: number) => {
  if (variance > 0) return 'text-emerald-600'
  if (variance < 0) return 'text-red-600'
  return 'text-slate-600'
}

const formatCurrency = (value: number) => {
  return new Intl.NumberFormat('it-IT', {
    style: 'currency',
    currency: 'EUR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(value)
}

const updateForecast = async () => {
  try {
    const response = await $fetch('/api/budget/forecast', {
      method: 'POST',
      body: { data: forecastData }
    })
    alert('Forecast aggiornato con successo')
  } catch (error) {
    console.error('Errore aggiornamento forecast:', error)
  }
}
</script>

<style scoped>
.forecast-table {
  border-collapse: separate;
  border-spacing: 0;
}

.forecast-table th {
  background: #f1f5f9;
  color: #475569;
  font-weight: 600;
  font-size: 13px;
  padding: 12px 8px;
  text-align: center;
  border-bottom: 2px solid #e2e8f0;
  white-space: nowrap;
}

.forecast-table th:first-child {
  text-align: left;
  padding-left: 16px;
}

.forecast-table td {
  padding: 8px;
  border-bottom: 1px solid #e2e8f0;
  text-align: center;
  font-size: 14px;
}

.past-month {
  background: #f8fafc;
  color: #64748b;
}

.future-month {
  background: #f1f5f9;
  color: #334155;
}

.past-cell {
  background: #f8fafc;
}

.forecast-cell {
  background: white;
}

.actual-value {
  color: #64748b;
  font-weight: 500;
}

.sticky-col {
  position: sticky;
  left: 0;
  background: white;
  z-index: 2;
  min-width: 250px;
  text-align: left !important;
  padding-left: 16px !important;
  font-weight: 500;
  box-shadow: 2px 0 4px rgba(0,0,0,0.05);
}

.total-col {
  background: #f8fafc;
  font-weight: 600;
  border-left: 2px solid #e2e8f0;
  min-width: 100px;
}

.variance-col {
  background: #fff7ed;
  font-weight: 600;
  border-left: 2px solid #fed7aa;
  min-width: 120px;
}

.forecast-input {
  width: 100%;
  padding: 6px 8px;
  border: 1px solid transparent;
  border-radius: 4px;
  text-align: right;
  font-family: 'Inter', sans-serif;
  transition: all 0.2s;
}

.forecast-input:hover {
  border-color: #cbd5e1;
  background: #f8fafc;
}

.forecast-input:focus {
  outline: none;
  border-color: #059669;
  background: white;
  box-shadow: 0 0 0 3px rgba(5, 150, 105, 0.1);
}

.section-header td {
  padding: 12px 16px !important;
  font-size: 14px;
}

.subtotal-row {
  background: #f8fafc;
}

.subtotal-row td {
  padding: 10px 8px !important;
  color: #1e293b;
}

.result-row {
  background: linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%);
  border-top: 2px solid #059669;
}

.result-row td {
  padding: 14px 8px !important;
}

.voce-name {
  color: #475569;
}
</style>
