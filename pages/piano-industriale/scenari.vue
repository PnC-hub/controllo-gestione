<template>
  <div class="space-y-6">
    <!-- Header -->
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-3xl font-bold text-slate-800">Analisi Scenari</h1>
        <p class="text-slate-600 mt-1">Simulazione What-If e analisi di sensibilità</p>
      </div>
      <div class="flex items-center gap-3">
        <button @click="resetSimulation" class="px-4 py-2 bg-slate-600 text-white rounded-lg hover:bg-slate-700 transition flex items-center gap-2">
          <i class="fas fa-undo"></i>
          <span>Reset</span>
        </button>
        <button @click="saveScenario" class="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition flex items-center gap-2">
          <i class="fas fa-save"></i>
          <span>Salva Scenario</span>
        </button>
      </div>
    </div>

    <!-- Variabili Controllo -->
    <div class="bg-white rounded-xl border border-slate-200 p-6">
      <h2 class="text-lg font-semibold text-slate-800 mb-6">Variabili di Simulazione</h2>
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <!-- Crescita Ricavi -->
        <div>
          <div class="flex items-center justify-between mb-3">
            <label class="text-sm font-medium text-slate-700">
              <i class="fas fa-chart-line text-emerald-600 mr-2"></i>
              Crescita Ricavi Annua
            </label>
            <span class="text-lg font-bold text-emerald-600">{{ variables.revenueGrowth }}%</span>
          </div>
          <input
            v-model.number="variables.revenueGrowth"
            type="range"
            min="0"
            max="40"
            step="1"
            class="w-full h-3 bg-slate-200 rounded-lg appearance-none cursor-pointer slider-emerald"
          >
          <div class="flex justify-between text-xs text-slate-500 mt-1">
            <span>0%</span>
            <span>20%</span>
            <span>40%</span>
          </div>
        </div>

        <!-- Margine EBITDA -->
        <div>
          <div class="flex items-center justify-between mb-3">
            <label class="text-sm font-medium text-slate-700">
              <i class="fas fa-percentage text-blue-600 mr-2"></i>
              Margine EBITDA Target
            </label>
            <span class="text-lg font-bold text-blue-600">{{ variables.ebitdaMargin }}%</span>
          </div>
          <input
            v-model.number="variables.ebitdaMargin"
            type="range"
            min="15"
            max="45"
            step="1"
            class="w-full h-3 bg-slate-200 rounded-lg appearance-none cursor-pointer slider-blue"
          >
          <div class="flex justify-between text-xs text-slate-500 mt-1">
            <span>15%</span>
            <span>30%</span>
            <span>45%</span>
          </div>
        </div>

        <!-- Investimenti -->
        <div>
          <div class="flex items-center justify-between mb-3">
            <label class="text-sm font-medium text-slate-700">
              <i class="fas fa-coins text-purple-600 mr-2"></i>
              Investimenti Totali
            </label>
            <span class="text-lg font-bold text-purple-600">€{{ variables.investments }}K</span>
          </div>
          <input
            v-model.number="variables.investments"
            type="range"
            min="100"
            max="600"
            step="10"
            class="w-full h-3 bg-slate-200 rounded-lg appearance-none cursor-pointer slider-purple"
          >
          <div class="flex justify-between text-xs text-slate-500 mt-1">
            <span>€100K</span>
            <span>€350K</span>
            <span>€600K</span>
          </div>
        </div>

        <!-- Costo Personale -->
        <div>
          <div class="flex items-center justify-between mb-3">
            <label class="text-sm font-medium text-slate-700">
              <i class="fas fa-users text-amber-600 mr-2"></i>
              Incremento Costo Personale
            </label>
            <span class="text-lg font-bold text-amber-600">{{ variables.staffCostIncrease }}%</span>
          </div>
          <input
            v-model.number="variables.staffCostIncrease"
            type="range"
            min="0"
            max="30"
            step="1"
            class="w-full h-3 bg-slate-200 rounded-lg appearance-none cursor-pointer slider-amber"
          >
          <div class="flex justify-between text-xs text-slate-500 mt-1">
            <span>0%</span>
            <span>15%</span>
            <span>30%</span>
          </div>
        </div>

        <!-- Tasso Interesse -->
        <div>
          <div class="flex items-center justify-between mb-3">
            <label class="text-sm font-medium text-slate-700">
              <i class="fas fa-hand-holding-usd text-red-600 mr-2"></i>
              Tasso Interesse Medio
            </label>
            <span class="text-lg font-bold text-red-600">{{ variables.interestRate }}%</span>
          </div>
          <input
            v-model.number="variables.interestRate"
            type="range"
            min="1"
            max="10"
            step="0.5"
            class="w-full h-3 bg-slate-200 rounded-lg appearance-none cursor-pointer slider-red"
          >
          <div class="flex justify-between text-xs text-slate-500 mt-1">
            <span>1%</span>
            <span>5%</span>
            <span>10%</span>
          </div>
        </div>

        <!-- Aliquota Fiscale -->
        <div>
          <div class="flex items-center justify-between mb-3">
            <label class="text-sm font-medium text-slate-700">
              <i class="fas fa-landmark text-indigo-600 mr-2"></i>
              Aliquota Fiscale
            </label>
            <span class="text-lg font-bold text-indigo-600">{{ variables.taxRate }}%</span>
          </div>
          <input
            v-model.number="variables.taxRate"
            type="range"
            min="20"
            max="35"
            step="1"
            class="w-full h-3 bg-slate-200 rounded-lg appearance-none cursor-pointer slider-indigo"
          >
          <div class="flex justify-between text-xs text-slate-500 mt-1">
            <span>20%</span>
            <span>24%</span>
            <span>35%</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Risultati Simulazione -->
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <!-- Scenario Pessimistico -->
      <div class="bg-white rounded-xl border-2 border-red-200 overflow-hidden">
        <div class="bg-gradient-to-r from-red-500 to-red-600 px-6 py-4">
          <h3 class="text-lg font-bold text-white flex items-center gap-2">
            <i class="fas fa-arrow-down"></i>
            Pessimistico
          </h3>
          <div class="text-xs text-red-100 mt-1">-20% vs parametri attuali</div>
        </div>
        <div class="p-6 space-y-4">
          <div class="bg-red-50 rounded-lg p-4 border border-red-100">
            <div class="text-xs text-slate-500 uppercase tracking-wide mb-1">Ricavi 2030</div>
            <div class="text-2xl font-bold text-red-600">€{{ formatCurrency(pessimisticResults.revenue) }}</div>
            <div class="text-xs text-red-600 mt-1">{{ pessimisticResults.revenueGrowth }}% crescita</div>
          </div>
          <div>
            <div class="text-xs text-slate-500 uppercase tracking-wide mb-1">EBITDA</div>
            <div class="text-xl font-bold text-slate-700">€{{ formatCurrency(pessimisticResults.ebitda) }}</div>
            <div class="text-xs text-slate-500">{{ pessimisticResults.ebitdaMargin }}% margine</div>
          </div>
          <div>
            <div class="text-xs text-slate-500 uppercase tracking-wide mb-1">Utile Netto</div>
            <div class="text-xl font-bold text-slate-700">€{{ formatCurrency(pessimisticResults.netProfit) }}</div>
          </div>
          <div>
            <div class="text-xs text-slate-500 uppercase tracking-wide mb-1">Cash Flow</div>
            <div class="text-xl font-bold text-slate-700">€{{ formatCurrency(pessimisticResults.cashFlow) }}</div>
          </div>
          <div>
            <div class="text-xs text-slate-500 uppercase tracking-wide mb-1">ROI Investimenti</div>
            <div class="text-xl font-bold text-red-600">{{ pessimisticResults.roi }}%</div>
          </div>
        </div>
      </div>

      <!-- Scenario Base -->
      <div class="bg-white rounded-xl border-2 border-blue-300 overflow-hidden shadow-lg">
        <div class="bg-gradient-to-r from-blue-500 to-blue-600 px-6 py-4">
          <h3 class="text-lg font-bold text-white flex items-center gap-2">
            <i class="fas fa-chart-line"></i>
            Base (Attuale)
          </h3>
          <div class="text-xs text-blue-100 mt-1">Parametri simulazione corrente</div>
        </div>
        <div class="p-6 space-y-4">
          <div class="bg-blue-50 rounded-lg p-4 border border-blue-200">
            <div class="text-xs text-slate-500 uppercase tracking-wide mb-1">Ricavi 2030</div>
            <div class="text-2xl font-bold text-blue-600">€{{ formatCurrency(baseResults.revenue) }}</div>
            <div class="text-xs text-blue-600 mt-1">{{ baseResults.revenueGrowth }}% crescita</div>
          </div>
          <div>
            <div class="text-xs text-slate-500 uppercase tracking-wide mb-1">EBITDA</div>
            <div class="text-xl font-bold text-slate-700">€{{ formatCurrency(baseResults.ebitda) }}</div>
            <div class="text-xs text-slate-500">{{ baseResults.ebitdaMargin }}% margine</div>
          </div>
          <div>
            <div class="text-xs text-slate-500 uppercase tracking-wide mb-1">Utile Netto</div>
            <div class="text-xl font-bold text-slate-700">€{{ formatCurrency(baseResults.netProfit) }}</div>
          </div>
          <div>
            <div class="text-xs text-slate-500 uppercase tracking-wide mb-1">Cash Flow</div>
            <div class="text-xl font-bold text-slate-700">€{{ formatCurrency(baseResults.cashFlow) }}</div>
          </div>
          <div>
            <div class="text-xs text-slate-500 uppercase tracking-wide mb-1">ROI Investimenti</div>
            <div class="text-xl font-bold text-blue-600">{{ baseResults.roi }}%</div>
          </div>
        </div>
      </div>

      <!-- Scenario Ottimistico -->
      <div class="bg-white rounded-xl border-2 border-emerald-200 overflow-hidden">
        <div class="bg-gradient-to-r from-emerald-500 to-emerald-600 px-6 py-4">
          <h3 class="text-lg font-bold text-white flex items-center gap-2">
            <i class="fas fa-arrow-up"></i>
            Ottimistico
          </h3>
          <div class="text-xs text-emerald-100 mt-1">+20% vs parametri attuali</div>
        </div>
        <div class="p-6 space-y-4">
          <div class="bg-emerald-50 rounded-lg p-4 border border-emerald-200">
            <div class="text-xs text-slate-500 uppercase tracking-wide mb-1">Ricavi 2030</div>
            <div class="text-2xl font-bold text-emerald-600">€{{ formatCurrency(optimisticResults.revenue) }}</div>
            <div class="text-xs text-emerald-600 mt-1">{{ optimisticResults.revenueGrowth }}% crescita</div>
          </div>
          <div>
            <div class="text-xs text-slate-500 uppercase tracking-wide mb-1">EBITDA</div>
            <div class="text-xl font-bold text-slate-700">€{{ formatCurrency(optimisticResults.ebitda) }}</div>
            <div class="text-xs text-slate-500">{{ optimisticResults.ebitdaMargin }}% margine</div>
          </div>
          <div>
            <div class="text-xs text-slate-500 uppercase tracking-wide mb-1">Utile Netto</div>
            <div class="text-xl font-bold text-slate-700">€{{ formatCurrency(optimisticResults.netProfit) }}</div>
          </div>
          <div>
            <div class="text-xs text-slate-500 uppercase tracking-wide mb-1">Cash Flow</div>
            <div class="text-xl font-bold text-slate-700">€{{ formatCurrency(optimisticResults.cashFlow) }}</div>
          </div>
          <div>
            <div class="text-xs text-slate-500 uppercase tracking-wide mb-1">ROI Investimenti</div>
            <div class="text-xl font-bold text-emerald-600">{{ optimisticResults.roi }}%</div>
          </div>
        </div>
      </div>
    </div>

    <!-- Grafici Sensibilità -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <!-- Sensibilità Ricavi vs EBITDA -->
      <div class="bg-white rounded-xl border border-slate-200 p-6">
        <h3 class="text-lg font-semibold text-slate-800 mb-4">
          <i class="fas fa-chart-area text-emerald-600 mr-2"></i>
          Sensibilità Crescita Ricavi
        </h3>
        <div class="space-y-3">
          <div v-for="point in sensitivityRevenue" :key="point.growth" class="flex items-center gap-4">
            <div class="w-20 text-sm font-medium text-slate-700">{{ point.growth }}%</div>
            <div class="flex-1">
              <div class="w-full bg-slate-100 rounded-full h-6 relative overflow-hidden">
                <div
                  class="h-6 rounded-full flex items-center justify-end px-3 transition-all"
                  :class="point.growth < 15 ? 'bg-red-500' : point.growth < 25 ? 'bg-blue-500' : 'bg-emerald-500'"
                  :style="{ width: point.width + '%' }"
                >
                  <span class="text-white text-xs font-semibold">€{{ point.revenue }}M</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Sensibilità Investimenti vs ROI -->
      <div class="bg-white rounded-xl border border-slate-200 p-6">
        <h3 class="text-lg font-semibold text-slate-800 mb-4">
          <i class="fas fa-coins text-purple-600 mr-2"></i>
          Sensibilità Investimenti
        </h3>
        <div class="space-y-3">
          <div v-for="point in sensitivityInvestments" :key="point.amount" class="flex items-center gap-4">
            <div class="w-24 text-sm font-medium text-slate-700">€{{ point.amount }}K</div>
            <div class="flex-1">
              <div class="w-full bg-slate-100 rounded-full h-6 relative overflow-hidden">
                <div
                  class="h-6 rounded-full flex items-center justify-end px-3 transition-all"
                  :class="point.roi > 25 ? 'bg-emerald-500' : point.roi > 18 ? 'bg-blue-500' : 'bg-amber-500'"
                  :style="{ width: Math.min(point.roi * 2, 100) + '%' }"
                >
                  <span class="text-white text-xs font-semibold">{{ point.roi }}% ROI</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Tabella Confronto Scenari -->
    <div class="bg-white rounded-xl border border-slate-200 overflow-hidden">
      <div class="px-6 py-4 bg-slate-50 border-b border-slate-200">
        <h3 class="text-lg font-semibold text-slate-800">
          <i class="fas fa-table text-slate-600 mr-2"></i>
          Confronto Scenari - Metriche Chiave 2030
        </h3>
      </div>
      <div class="overflow-x-auto">
        <table class="w-full">
          <thead>
            <tr class="bg-slate-50 border-b border-slate-200">
              <th class="px-6 py-3 text-left text-sm font-semibold text-slate-700">Metrica</th>
              <th class="px-6 py-3 text-right text-sm font-semibold text-red-600">Pessimistico</th>
              <th class="px-6 py-3 text-right text-sm font-semibold text-blue-600">Base</th>
              <th class="px-6 py-3 text-right text-sm font-semibold text-emerald-600">Ottimistico</th>
              <th class="px-6 py-3 text-center text-sm font-semibold text-slate-700">Delta %</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-slate-100">
            <tr class="hover:bg-slate-50">
              <td class="px-6 py-3 text-sm font-medium text-slate-800">Ricavi</td>
              <td class="px-6 py-3 text-sm text-right text-red-600">€{{ formatCurrency(pessimisticResults.revenue) }}</td>
              <td class="px-6 py-3 text-sm text-right text-blue-600 font-semibold">€{{ formatCurrency(baseResults.revenue) }}</td>
              <td class="px-6 py-3 text-sm text-right text-emerald-600">€{{ formatCurrency(optimisticResults.revenue) }}</td>
              <td class="px-6 py-3 text-center text-sm font-semibold text-slate-700">
                {{ Math.round(((optimisticResults.revenue - pessimisticResults.revenue) / pessimisticResults.revenue) * 100) }}%
              </td>
            </tr>
            <tr class="hover:bg-slate-50">
              <td class="px-6 py-3 text-sm font-medium text-slate-800">EBITDA</td>
              <td class="px-6 py-3 text-sm text-right text-red-600">€{{ formatCurrency(pessimisticResults.ebitda) }}</td>
              <td class="px-6 py-3 text-sm text-right text-blue-600 font-semibold">€{{ formatCurrency(baseResults.ebitda) }}</td>
              <td class="px-6 py-3 text-sm text-right text-emerald-600">€{{ formatCurrency(optimisticResults.ebitda) }}</td>
              <td class="px-6 py-3 text-center text-sm font-semibold text-slate-700">
                {{ Math.round(((optimisticResults.ebitda - pessimisticResults.ebitda) / pessimisticResults.ebitda) * 100) }}%
              </td>
            </tr>
            <tr class="hover:bg-slate-50">
              <td class="px-6 py-3 text-sm font-medium text-slate-800">Margine EBITDA %</td>
              <td class="px-6 py-3 text-sm text-right text-red-600">{{ pessimisticResults.ebitdaMargin }}%</td>
              <td class="px-6 py-3 text-sm text-right text-blue-600 font-semibold">{{ baseResults.ebitdaMargin }}%</td>
              <td class="px-6 py-3 text-sm text-right text-emerald-600">{{ optimisticResults.ebitdaMargin }}%</td>
              <td class="px-6 py-3 text-center text-sm font-semibold text-slate-700">
                +{{ optimisticResults.ebitdaMargin - pessimisticResults.ebitdaMargin }}pp
              </td>
            </tr>
            <tr class="hover:bg-slate-50">
              <td class="px-6 py-3 text-sm font-medium text-slate-800">Utile Netto</td>
              <td class="px-6 py-3 text-sm text-right text-red-600">€{{ formatCurrency(pessimisticResults.netProfit) }}</td>
              <td class="px-6 py-3 text-sm text-right text-blue-600 font-semibold">€{{ formatCurrency(baseResults.netProfit) }}</td>
              <td class="px-6 py-3 text-sm text-right text-emerald-600">€{{ formatCurrency(optimisticResults.netProfit) }}</td>
              <td class="px-6 py-3 text-center text-sm font-semibold text-slate-700">
                {{ Math.round(((optimisticResults.netProfit - pessimisticResults.netProfit) / pessimisticResults.netProfit) * 100) }}%
              </td>
            </tr>
            <tr class="hover:bg-slate-50">
              <td class="px-6 py-3 text-sm font-medium text-slate-800">Cash Flow</td>
              <td class="px-6 py-3 text-sm text-right text-red-600">€{{ formatCurrency(pessimisticResults.cashFlow) }}</td>
              <td class="px-6 py-3 text-sm text-right text-blue-600 font-semibold">€{{ formatCurrency(baseResults.cashFlow) }}</td>
              <td class="px-6 py-3 text-sm text-right text-emerald-600">€{{ formatCurrency(optimisticResults.cashFlow) }}</td>
              <td class="px-6 py-3 text-center text-sm font-semibold text-slate-700">
                {{ Math.round(((optimisticResults.cashFlow - pessimisticResults.cashFlow) / pessimisticResults.cashFlow) * 100) }}%
              </td>
            </tr>
            <tr class="hover:bg-slate-50 bg-emerald-50">
              <td class="px-6 py-3 text-sm font-medium text-slate-800">ROI Investimenti</td>
              <td class="px-6 py-3 text-sm text-right text-red-600">{{ pessimisticResults.roi }}%</td>
              <td class="px-6 py-3 text-sm text-right text-blue-600 font-semibold">{{ baseResults.roi }}%</td>
              <td class="px-6 py-3 text-sm text-right text-emerald-600">{{ optimisticResults.roi }}%</td>
              <td class="px-6 py-3 text-center text-sm font-semibold text-slate-700">
                +{{ optimisticResults.roi - pessimisticResults.roi }}pp
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  middleware: 'auth'
})

const variables = reactive({
  revenueGrowth: 20,
  ebitdaMargin: 36,
  investments: 350,
  staffCostIncrease: 15,
  interestRate: 3.5,
  taxRate: 24
})

const baseRevenue2030 = 2500000

const calculateResults = (modifier: number) => {
  const revenue = baseRevenue2030 * (1 + (variables.revenueGrowth / 100) * modifier)
  const ebitda = revenue * ((variables.ebitdaMargin / 100) * (1 + 0.1 * modifier))
  const ebitdaMargin = Math.round((ebitda / revenue) * 100)
  const netProfit = ebitda * (1 - variables.taxRate / 100) * 0.7
  const cashFlow = netProfit + (revenue * 0.05)
  const roi = Math.round((ebitda / (variables.investments * 1000)) * 100 * (1 + 0.2 * modifier))

  return {
    revenue: Math.round(revenue),
    ebitda: Math.round(ebitda),
    ebitdaMargin,
    netProfit: Math.round(netProfit),
    cashFlow: Math.round(cashFlow),
    roi,
    revenueGrowth: Math.round(variables.revenueGrowth * (1 + 0.2 * modifier))
  }
}

const baseResults = computed(() => calculateResults(0))
const pessimisticResults = computed(() => calculateResults(-0.3))
const optimisticResults = computed(() => calculateResults(0.3))

const sensitivityRevenue = computed(() => [
  { growth: 10, revenue: '1.8', width: 40 },
  { growth: 15, revenue: '2.1', width: 55 },
  { growth: 20, revenue: '2.5', width: 70 },
  { growth: 25, revenue: '2.9', width: 85 },
  { growth: 30, revenue: '3.3', width: 100 }
])

const sensitivityInvestments = computed(() => [
  { amount: 200, roi: 35 },
  { amount: 300, roi: 28 },
  { amount: 350, roi: 24 },
  { amount: 450, roi: 20 },
  { amount: 550, roi: 16 }
])

const formatCurrency = (value: number) => {
  return (value / 1000).toLocaleString('it-IT', { maximumFractionDigits: 0 })
}

const resetSimulation = () => {
  variables.revenueGrowth = 20
  variables.ebitdaMargin = 36
  variables.investments = 350
  variables.staffCostIncrease = 15
  variables.interestRate = 3.5
  variables.taxRate = 24
}

const saveScenario = async () => {
  try {
    const { data } = await useFetch('/api/piano-industriale/scenari', {
      method: 'POST',
      body: { variables, results: baseResults.value }
    })
    if (data.value) {
      alert('Scenario salvato con successo!')
    }
  } catch (error) {
    console.error('Save failed:', error)
  }
}
</script>

<style scoped>
.slider-emerald::-webkit-slider-thumb {
  appearance: none;
  width: 22px;
  height: 22px;
  border-radius: 50%;
  background: #059669;
  cursor: pointer;
  box-shadow: 0 2px 4px rgba(0,0,0,0.2);
}

.slider-blue::-webkit-slider-thumb {
  appearance: none;
  width: 22px;
  height: 22px;
  border-radius: 50%;
  background: #3b82f6;
  cursor: pointer;
  box-shadow: 0 2px 4px rgba(0,0,0,0.2);
}

.slider-purple::-webkit-slider-thumb {
  appearance: none;
  width: 22px;
  height: 22px;
  border-radius: 50%;
  background: #a855f7;
  cursor: pointer;
  box-shadow: 0 2px 4px rgba(0,0,0,0.2);
}

.slider-amber::-webkit-slider-thumb {
  appearance: none;
  width: 22px;
  height: 22px;
  border-radius: 50%;
  background: #f59e0b;
  cursor: pointer;
  box-shadow: 0 2px 4px rgba(0,0,0,0.2);
}

.slider-red::-webkit-slider-thumb {
  appearance: none;
  width: 22px;
  height: 22px;
  border-radius: 50%;
  background: #ef4444;
  cursor: pointer;
  box-shadow: 0 2px 4px rgba(0,0,0,0.2);
}

.slider-indigo::-webkit-slider-thumb {
  appearance: none;
  width: 22px;
  height: 22px;
  border-radius: 50%;
  background: #6366f1;
  cursor: pointer;
  box-shadow: 0 2px 4px rgba(0,0,0,0.2);
}
</style>
