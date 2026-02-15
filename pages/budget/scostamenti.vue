<template>
  <div class="space-y-6">
    <!-- Header -->
    <div>
      <div class="flex items-center gap-2">
        <h1 class="text-2xl font-bold text-slate-800">Analisi Scostamenti</h1>
        <PageInfoButton
          title="Scostamenti"
          description="Analisi scostamenti budget vs consuntivo con varianze e trend"
          :features="[
            'Varianze assolute e percentuali',
            'Trend mensile scostamenti',
            'Alert su scostamenti significativi'
          ]"
        />
      </div>
      <p class="text-sm text-slate-500 mt-1">Confronto Budget vs Actual con analisi delle varianze</p>
    </div>

    <!-- KPI Cards -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
      <!-- Ricavi -->
      <div class="card">
        <div class="p-6">
          <div class="flex items-center justify-between mb-4">
            <div class="w-12 h-12 bg-emerald-100 rounded-lg flex items-center justify-center">
              <i class="fas fa-arrow-trend-up text-emerald-600 text-xl"></i>
            </div>
            <span class="text-xs font-semibold text-emerald-600 bg-emerald-50 px-2 py-1 rounded">+0.3%</span>
          </div>
          <h3 class="text-sm font-medium text-slate-500 mb-1">Ricavi Actual</h3>
          <p class="text-2xl font-bold text-slate-800 mb-2">€ 620.000</p>
          <div class="flex items-center gap-2 text-sm">
            <span class="text-slate-500">Budget:</span>
            <span class="font-medium text-slate-700">€ 618.000</span>
            <span class="text-emerald-600 font-semibold">+€ 2.000</span>
          </div>
        </div>
      </div>

      <!-- Costi -->
      <div class="card">
        <div class="p-6">
          <div class="flex items-center justify-between mb-4">
            <div class="w-12 h-12 bg-emerald-100 rounded-lg flex items-center justify-center">
              <i class="fas fa-arrow-trend-down text-emerald-600 text-xl"></i>
            </div>
            <span class="text-xs font-semibold text-emerald-600 bg-emerald-50 px-2 py-1 rounded">-1.6%</span>
          </div>
          <h3 class="text-sm font-medium text-slate-500 mb-1">Costi Actual</h3>
          <p class="text-2xl font-bold text-slate-800 mb-2">€ 412.000</p>
          <div class="flex items-center gap-2 text-sm">
            <span class="text-slate-500">Budget:</span>
            <span class="font-medium text-slate-700">€ 418.800</span>
            <span class="text-emerald-600 font-semibold">-€ 6.800</span>
          </div>
        </div>
      </div>

      <!-- Risultato -->
      <div class="card">
        <div class="p-6">
          <div class="flex items-center justify-between mb-4">
            <div class="w-12 h-12 bg-emerald-100 rounded-lg flex items-center justify-center">
              <i class="fas fa-chart-line text-emerald-600 text-xl"></i>
            </div>
            <span class="text-xs font-semibold text-emerald-600 bg-emerald-50 px-2 py-1 rounded">+4.4%</span>
          </div>
          <h3 class="text-sm font-medium text-slate-500 mb-1">Risultato Actual</h3>
          <p class="text-2xl font-bold text-emerald-600 mb-2">€ 208.000</p>
          <div class="flex items-center gap-2 text-sm">
            <span class="text-slate-500">Budget:</span>
            <span class="font-medium text-slate-700">€ 199.200</span>
            <span class="text-emerald-600 font-semibold">+€ 8.800</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Variance Table -->
    <div class="card">
      <div class="card-header">
        <h2 class="card-title">Dettaglio Scostamenti per Voce</h2>
      </div>
      <div class="overflow-x-auto">
        <table class="min-w-full variance-table">
          <thead>
            <tr>
              <th class="text-left">Voce</th>
              <th class="text-right">Budget</th>
              <th class="text-right">Actual</th>
              <th class="text-right">Scostamento</th>
              <th class="text-center">%</th>
              <th class="text-center">Semaforo</th>
            </tr>
          </thead>
          <tbody>
            <!-- RICAVI -->
            <tr class="section-header">
              <td colspan="6" class="text-left font-bold text-emerald-700 bg-emerald-50">RICAVI</td>
            </tr>
            <tr v-for="item in ricaviVariance" :key="item.voce">
              <td class="voce-name">{{ item.voce }}</td>
              <td class="text-right">{{ formatCurrency(item.budget) }}</td>
              <td class="text-right font-medium">{{ formatCurrency(item.actual) }}</td>
              <td class="text-right font-semibold" :class="item.variance >= 0 ? 'text-emerald-600' : 'text-red-600'">
                {{ formatCurrency(item.variance) }}
              </td>
              <td class="text-center font-medium" :class="item.variancePercent >= 0 ? 'text-emerald-600' : 'text-red-600'">
                {{ item.variancePercent >= 0 ? '+' : '' }}{{ item.variancePercent.toFixed(1) }}%
              </td>
              <td class="text-center">
                <div class="flex justify-center">
                  <div :class="getSemaforoClass(Math.abs(item.variancePercent))" class="w-3 h-3 rounded-full"></div>
                </div>
              </td>
            </tr>

            <!-- COSTI -->
            <tr class="section-header">
              <td colspan="6" class="text-left font-bold text-red-700 bg-red-50">COSTI</td>
            </tr>
            <tr v-for="item in costiVariance" :key="item.voce">
              <td class="voce-name">{{ item.voce }}</td>
              <td class="text-right">{{ formatCurrency(item.budget) }}</td>
              <td class="text-right font-medium">{{ formatCurrency(item.actual) }}</td>
              <td class="text-right font-semibold" :class="item.variance <= 0 ? 'text-emerald-600' : 'text-red-600'">
                {{ formatCurrency(item.variance) }}
              </td>
              <td class="text-center font-medium" :class="item.variancePercent <= 0 ? 'text-emerald-600' : 'text-red-600'">
                {{ item.variancePercent >= 0 ? '+' : '' }}{{ item.variancePercent.toFixed(1) }}%
              </td>
              <td class="text-center">
                <div class="flex justify-center">
                  <div :class="getSemaforoClass(Math.abs(item.variancePercent))" class="w-3 h-3 rounded-full"></div>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Variance Chart -->
    <div class="card">
      <div class="card-header">
        <h2 class="card-title">Grafico Scostamenti</h2>
      </div>
      <div class="card-content">
        <div class="space-y-4">
          <div v-for="item in allVariances" :key="item.voce">
            <div class="flex items-center justify-between mb-1">
              <span class="text-sm font-medium text-slate-700">{{ item.voce }}</span>
              <span class="text-sm font-semibold" :class="getVarianceTextClass(item.variancePercent)">
                {{ item.variancePercent >= 0 ? '+' : '' }}{{ item.variancePercent.toFixed(1) }}%
              </span>
            </div>
            <div class="relative h-8 bg-slate-100 rounded overflow-hidden">
              <div class="absolute inset-y-0 left-1/2 w-0.5 bg-slate-300 z-10"></div>
              <div
                v-if="item.variancePercent > 0"
                class="absolute top-0 bottom-0 bg-emerald-500"
                :style="{
                  left: '50%',
                  width: Math.min(Math.abs(item.variancePercent) * 2, 50) + '%'
                }"
              ></div>
              <div
                v-else
                class="absolute top-0 bottom-0 bg-red-500"
                :style="{
                  right: '50%',
                  width: Math.min(Math.abs(item.variancePercent) * 2, 50) + '%'
                }"
              ></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  layout: 'default'
})

interface VarianceItem {
  voce: string
  budget: number
  actual: number
  variance: number
  variancePercent: number
}

const ricaviVariance: VarianceItem[] = [
  { voce: 'Prestazioni odontoiatriche', budget: 400000, actual: 405000, variance: 5000, variancePercent: 1.25 },
  { voce: 'Ortodonzia', budget: 75000, actual: 72000, variance: -3000, variancePercent: -4.0 },
  { voce: 'Igiene', budget: 40000, actual: 40000, variance: 0, variancePercent: 0 },
  { voce: 'Implantologia', budget: 103000, actual: 103000, variance: 0, variancePercent: 0 }
]

const costiVariance: VarianceItem[] = [
  { voce: 'Personale', budget: 140000, actual: 138500, variance: -1500, variancePercent: -1.07 },
  { voce: 'Materiali consumo', budget: 60000, actual: 57800, variance: -2200, variancePercent: -3.67 },
  { voce: 'Affitto', budget: 17500, actual: 17500, variance: 0, variancePercent: 0 },
  { voce: 'Utenze', budget: 10000, actual: 11200, variance: 1200, variancePercent: 12.0 },
  { voce: 'Ammortamenti', budget: 20000, actual: 20000, variance: 0, variancePercent: 0 },
  { voce: 'Consulenze', budget: 12500, actual: 13000, variance: 500, variancePercent: 4.0 },
  { voce: 'Marketing', budget: 7500, actual: 8500, variance: 1000, variancePercent: 13.33 },
  { voce: 'Assicurazioni', budget: 4000, actual: 3800, variance: -200, variancePercent: -5.0 },
  { voce: 'Oneri finanziari', budget: 2500, actual: 2400, variance: -100, variancePercent: -4.0 },
  { voce: 'Imposte (IRES+IRAP)', budget: 75000, actual: 72300, variance: -2700, variancePercent: -3.6 }
]

const allVariances = computed(() => {
  return [...ricaviVariance, ...costiVariance].sort((a, b) => Math.abs(b.variancePercent) - Math.abs(a.variancePercent))
})

const getSemaforoClass = (percentAbs: number) => {
  if (percentAbs < 10) return 'bg-emerald-500'
  if (percentAbs < 20) return 'bg-yellow-500'
  return 'bg-red-500'
}

const getVarianceTextClass = (variance: number) => {
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
</script>

<style scoped>
.variance-table {
  width: 100%;
}

.variance-table th {
  background: #f8fafc;
  color: #64748b;
  font-weight: 600;
  font-size: 13px;
  padding: 12px 16px;
  border-bottom: 2px solid #e2e8f0;
  white-space: nowrap;
}

.variance-table td {
  padding: 12px 16px;
  border-bottom: 1px solid #e2e8f0;
  font-size: 14px;
}

.section-header td {
  padding: 10px 16px !important;
  font-size: 14px;
}

.voce-name {
  color: #475569;
  font-weight: 500;
}
</style>
