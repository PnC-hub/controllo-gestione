<template>
  <div>
    <div class="card mb-4">
      <div class="card-header">
        <h2 class="card-title">
          <i class="fas fa-tachometer-alt mr-2 text-orange-600"></i>
          KPI Finanziari — Smiledoc 2023–2025
        </h2>
      </div>
    </div>

    <div v-if="loading.kpi" class="bg-white rounded-lg shadow p-12 text-center">
      <i class="fas fa-spinner fa-spin text-4xl text-orange-600 mb-4"></i>
      <p class="text-gray-500">Calcolo KPI...</p>
    </div>

    <div v-else-if="error.kpi" class="bg-red-50 border border-red-200 rounded-lg p-4 text-red-700">
      <i class="fas fa-exclamation-circle mr-2"></i>
      Errore: {{ error.kpi?.message || 'Kontabila non raggiungibile' }}
    </div>

    <div v-else-if="kpiData">
      <!-- CAGR banner -->
      <div v-if="cagr != null" class="mb-4 p-4 rounded-lg text-white font-semibold flex items-center gap-3"
           :class="cagr >= 0 ? 'bg-green-600' : 'bg-red-600'">
        <i class="fas fa-chart-line text-2xl"></i>
        <span>CAGR Ricavi 2023→2025: <span class="text-xl font-bold">{{ cagr }}%</span></span>
        <span class="text-sm font-normal opacity-80">Tasso di crescita annuo composto</span>
      </div>

      <!-- Anno tabs -->
      <div class="flex gap-2 mb-4">
        <button
          v-for="anno in ANNI" :key="anno"
          @click="annoSelezionato = anno"
          class="px-4 py-2 rounded-lg font-medium transition-colors"
          :class="annoSelezionato === anno ? 'bg-orange-600 text-white' : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'"
        >{{ anno }}</button>
      </div>

      <div v-if="kpiAnno">
        <!-- REDDITIVITÀ -->
        <div class="mb-4">
          <h3 class="text-sm font-bold text-gray-500 uppercase tracking-wide mb-3">Redditività</h3>
          <div class="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-3">
            <div class="kpi-card" :class="getBgClass(kpiAnno.redditività.ebitdaMargin, 10, 5)">
              <p class="kpi-label">EBITDA Margin</p>
              <p class="kpi-value">{{ fmtP(kpiAnno.redditività.ebitdaMargin) }}</p>
              <p class="kpi-sub">{{ fmtE(kpiAnno.redditività.ebitda) }}</p>
              <div class="kpi-badge" :class="getBadgeClass(kpiAnno.redditività.ebitdaMargin, 10, 5)">
                {{ getLabel(kpiAnno.redditività.ebitdaMargin, 10, 5) }}
              </div>
            </div>
            <div class="kpi-card" :class="getBgClass(kpiAnno.redditività.netMargin, 5, 0)">
              <p class="kpi-label">Net Margin</p>
              <p class="kpi-value">{{ fmtP(kpiAnno.redditività.netMargin) }}</p>
              <p class="kpi-sub">{{ fmtE(kpiAnno.redditività.risultatoNetto) }}</p>
              <div class="kpi-badge" :class="getBadgeClass(kpiAnno.redditività.netMargin, 5, 0)">
                {{ getLabel(kpiAnno.redditività.netMargin, 5, 0) }}
              </div>
            </div>
            <div class="kpi-card" :class="getBgClass(kpiAnno.redditività.roe, 15, 5)">
              <p class="kpi-label">ROE</p>
              <p class="kpi-value">{{ fmtP(kpiAnno.redditività.roe) }}</p>
              <p class="kpi-sub">Rend. Patrimonio Netto</p>
              <div class="kpi-badge" :class="getBadgeClass(kpiAnno.redditività.roe, 15, 5)">
                {{ getLabel(kpiAnno.redditività.roe, 15, 5) }}
              </div>
            </div>
            <div class="kpi-card" :class="getBgClass(kpiAnno.redditività.roi, 10, 3)">
              <p class="kpi-label">ROI</p>
              <p class="kpi-value">{{ fmtP(kpiAnno.redditività.roi) }}</p>
              <p class="kpi-sub">Rend. Totale Attivo</p>
              <div class="kpi-badge" :class="getBadgeClass(kpiAnno.redditività.roi, 10, 3)">
                {{ getLabel(kpiAnno.redditività.roi, 10, 3) }}
              </div>
            </div>
            <div class="kpi-card">
              <p class="kpi-label">Ricavi Totali</p>
              <p class="kpi-value text-gray-800">{{ fmtE(kpiAnno.redditività.ricavi) }}</p>
              <p class="kpi-sub">Fatturato anno</p>
            </div>
            <div class="kpi-card">
              <p class="kpi-label">EBITDA</p>
              <p class="kpi-value" :class="kpiAnno.redditività.ebitda >= 0 ? 'text-green-700' : 'text-red-700'">
                {{ fmtE(kpiAnno.redditività.ebitda) }}
              </p>
              <p class="kpi-sub">Margine operativo lordo</p>
            </div>
          </div>
        </div>

        <!-- STRUTTURA FINANZIARIA -->
        <div class="mb-4">
          <h3 class="text-sm font-bold text-gray-500 uppercase tracking-wide mb-3">Struttura Finanziaria</h3>
          <div class="grid grid-cols-2 md:grid-cols-4 gap-3">
            <div class="kpi-card" :class="getBgClass(kpiAnno.struttura.currentRatio, 1.5, 1)">
              <p class="kpi-label">Current Ratio</p>
              <p class="kpi-value">{{ fmtX(kpiAnno.struttura.currentRatio) }}</p>
              <p class="kpi-sub">Att. Corrente / Pass. Corrente</p>
              <div class="kpi-badge" :class="getBadgeClass(kpiAnno.struttura.currentRatio, 1.5, 1)">
                {{ getLabel(kpiAnno.struttura.currentRatio, 1.5, 1) }}
              </div>
            </div>
            <div class="kpi-card" :class="debtEquityBg(kpiAnno.struttura.debtEquity)">
              <p class="kpi-label">Debt / Equity</p>
              <p class="kpi-value">{{ fmtX(kpiAnno.struttura.debtEquity) }}</p>
              <p class="kpi-sub">Leva finanziaria</p>
              <div class="kpi-badge" :class="debtEquityBadge(kpiAnno.struttura.debtEquity)">
                {{ debtEquityLabel(kpiAnno.struttura.debtEquity) }}
              </div>
            </div>
            <div class="kpi-card">
              <p class="kpi-label">Totale Attivo</p>
              <p class="kpi-value text-gray-800">{{ fmtE(kpiAnno.struttura.totaleAttivo) }}</p>
              <p class="kpi-sub">Patrimonio aziendale</p>
            </div>
            <div class="kpi-card">
              <p class="kpi-label">Patrimonio Netto</p>
              <p class="kpi-value" :class="kpiAnno.struttura.pn >= 0 ? 'text-green-700' : 'text-red-700'">
                {{ fmtE(kpiAnno.struttura.pn) }}
              </p>
              <p class="kpi-sub">Capitale proprio</p>
            </div>
          </div>
        </div>

        <!-- CRESCITA -->
        <div class="mb-4">
          <h3 class="text-sm font-bold text-gray-500 uppercase tracking-wide mb-3">Crescita & BEP</h3>
          <div class="grid grid-cols-2 md:grid-cols-3 gap-3">
            <div class="kpi-card" :class="getBgClass(kpiAnno.crescita.deltaRicaviPerc, 5, 0)">
              <p class="kpi-label">Crescita Ricavi YoY</p>
              <p class="kpi-value">{{ fmtP(kpiAnno.crescita.deltaRicaviPerc) }}</p>
              <p class="kpi-sub">vs anno precedente</p>
              <div v-if="kpiAnno.crescita.deltaRicaviPerc != null" class="kpi-badge" :class="getBadgeClass(kpiAnno.crescita.deltaRicaviPerc, 5, 0)">
                {{ getLabel(kpiAnno.crescita.deltaRicaviPerc, 5, 0) }}
              </div>
            </div>
            <div class="kpi-card">
              <p class="kpi-label">BEP (Break Even Point)</p>
              <p class="kpi-value text-orange-700">{{ fmtE(kpiAnno.crescita.bep) }}</p>
              <p class="kpi-sub">Fatturato minimo per pareggio</p>
            </div>
            <div class="kpi-card" :class="getBgClass(cagr, 5, 0)">
              <p class="kpi-label">CAGR 2023→2025</p>
              <p class="kpi-value">{{ cagr != null ? cagr + '%' : '—' }}</p>
              <p class="kpi-sub">Crescita annua composta</p>
            </div>
          </div>
        </div>

        <!-- Confronto anni -->
        <div class="bg-white rounded-lg shadow overflow-hidden">
          <div class="px-4 py-3 border-b border-gray-200">
            <h3 class="font-semibold text-gray-700">Confronto KPI — Tutti gli Anni</h3>
          </div>
          <div class="overflow-x-auto">
            <table class="w-full text-sm">
              <thead class="bg-gray-50">
                <tr>
                  <th class="text-left px-4 py-2 text-gray-600">KPI</th>
                  <th v-for="a in ANNI" :key="a" class="text-right px-4 py-2 text-gray-600">{{ a }}</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(row, i) in kpiTableRows" :key="i" class="border-b border-gray-100 hover:bg-gray-50">
                  <td class="px-4 py-2 text-gray-700">{{ row.label }}</td>
                  <td v-for="a in ANNI" :key="a" class="px-4 py-2 text-right font-mono"
                      :class="row.colorFn ? row.colorFn(getKpiAnno(a)?.redditività[row.key] ?? getKpiAnno(a)?.struttura[row.key] ?? getKpiAnno(a)?.crescita[row.key]) : 'text-gray-700'">
                    {{ row.fmtFn(getKpiAnno(a)?.redditività[row.key] ?? getKpiAnno(a)?.struttura[row.key] ?? getKpiAnno(a)?.crescita[row.key]) }}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({ layout: 'default' })

const { kpiData, cagr, loading, error, fetchKPI } = useBilancio()

const ANNI = [2023, 2024, 2025]
const annoSelezionato = ref(2024)

const kpiAnno = computed(() => kpiData.value?.find((d: any) => d.anno === annoSelezionato.value))
const getKpiAnno = (anno: number) => kpiData.value?.find((d: any) => d.anno === anno)

const fmtP = (v: any) => v != null ? `${v}%` : '—'
const fmtX = (v: any) => v != null ? `${v}x` : '—'
const fmtE = (v: any) => {
  if (v == null) return '—'
  return new Intl.NumberFormat('it-IT', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 }).format(Number(v) || 0)
}

const getBgClass = (v: any, sogliaBuona: number, sogliaMedia: number) => {
  if (v == null) return 'border border-gray-200 bg-gray-50'
  if (v >= sogliaBuona) return 'border border-green-200 bg-green-50'
  if (v >= sogliaMedia) return 'border border-yellow-200 bg-yellow-50'
  return 'border border-red-200 bg-red-50'
}
const getBadgeClass = (v: any, sogliaBuona: number, sogliaMedia: number) => {
  if (v == null) return 'badge-gray'
  if (v >= sogliaBuona) return 'badge-green'
  if (v >= sogliaMedia) return 'badge-yellow'
  return 'badge-red'
}
const getLabel = (v: any, sogliaBuona: number, sogliaMedia: number) => {
  if (v == null) return 'N/D'
  if (v >= sogliaBuona) return 'Ottimo'
  if (v >= sogliaMedia) return 'Attenzione'
  return 'Critico'
}

const debtEquityBg = (v: any) => {
  if (v == null) return 'border border-gray-200 bg-gray-50'
  if (v <= 1) return 'border border-green-200 bg-green-50'
  if (v <= 2) return 'border border-yellow-200 bg-yellow-50'
  return 'border border-red-200 bg-red-50'
}
const debtEquityBadge = (v: any) => {
  if (v == null) return 'badge-gray'
  if (v <= 1) return 'badge-green'
  if (v <= 2) return 'badge-yellow'
  return 'badge-red'
}
const debtEquityLabel = (v: any) => {
  if (v == null) return 'N/D'
  if (v <= 1) return 'Bassa Leva'
  if (v <= 2) return 'Moderata'
  return 'Alta Leva'
}

const colorPos = (v: any) => v != null && v >= 0 ? 'text-green-600' : 'text-red-600'
const colorGrowth = (v: any) => v == null ? 'text-gray-400' : v >= 0 ? 'text-green-600' : 'text-red-600'

const kpiTableRows = [
  { label: 'EBITDA Margin %', key: 'ebitdaMargin', fmtFn: fmtP, colorFn: colorPos },
  { label: 'Net Margin %', key: 'netMargin', fmtFn: fmtP, colorFn: colorPos },
  { label: 'ROE %', key: 'roe', fmtFn: fmtP, colorFn: colorPos },
  { label: 'ROI %', key: 'roi', fmtFn: fmtP, colorFn: colorPos },
  { label: 'Current Ratio', key: 'currentRatio', fmtFn: fmtX, colorFn: null },
  { label: 'Debt / Equity', key: 'debtEquity', fmtFn: fmtX, colorFn: null },
  { label: 'Crescita Ricavi YoY %', key: 'deltaRicaviPerc', fmtFn: fmtP, colorFn: colorGrowth },
]

onMounted(() => fetchKPI())
</script>

<style scoped>
.card { @apply bg-white rounded-lg shadow; }
.card-header { @apply px-4 py-3 border-b border-gray-200; }
.card-title { @apply text-lg font-semibold text-gray-800 flex items-center; }

.kpi-card { @apply rounded-lg p-4 relative; }
.kpi-label { @apply text-xs text-gray-500 mb-1 uppercase tracking-wide; }
.kpi-value { @apply text-2xl font-bold text-gray-800; }
.kpi-sub { @apply text-xs text-gray-400 mt-1; }
.kpi-badge { @apply absolute top-3 right-3 text-xs font-semibold px-2 py-0.5 rounded-full; }

.badge-green { @apply bg-green-100 text-green-700; }
.badge-yellow { @apply bg-yellow-100 text-yellow-700; }
.badge-red { @apply bg-red-100 text-red-700; }
.badge-gray { @apply bg-gray-100 text-gray-500; }
</style>
