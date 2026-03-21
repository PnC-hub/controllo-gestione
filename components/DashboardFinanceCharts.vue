<template>
  <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
    <!-- P&L -->
    <div class="card">
      <div class="card-header flex justify-between items-center">
        <h2 class="card-title">
          <i class="fas fa-chart-bar mr-2 text-blue-600"></i>
          Profit & Loss
        </h2>
        <span class="text-xs text-slate-400">{{ entityStore.selectedEntityName }}</span>
      </div>
      <div class="card-content">
        <div v-if="loading" class="flex justify-center items-center h-48">
          <i class="fas fa-spinner fa-spin text-2xl text-blue-400"></i>
        </div>
        <div v-else-if="error" class="flex justify-center items-center h-48 text-slate-400 text-sm">
          <i class="fas fa-exclamation-triangle mr-2"></i>Dati non disponibili
        </div>
        <client-only v-else>
          <apexchart type="bar" height="220" :options="pnlOptions" :series="pnlSeries" />
        </client-only>
      </div>
    </div>

    <!-- Saldo Bancario -->
    <div class="card">
      <div class="card-header flex justify-between items-center">
        <h2 class="card-title">
          <i class="fas fa-university mr-2 text-cyan-600"></i>
          Saldo Bancario
        </h2>
        <span class="text-xs text-slate-400">Ultimi 24 mesi</span>
      </div>
      <div class="card-content">
        <div v-if="loading" class="flex justify-center items-center h-48">
          <i class="fas fa-spinner fa-spin text-2xl text-cyan-400"></i>
        </div>
        <div v-else-if="error" class="flex justify-center items-center h-48 text-slate-400 text-sm">
          <i class="fas fa-exclamation-triangle mr-2"></i>Dati non disponibili
        </div>
        <client-only v-else>
          <apexchart type="area" height="220" :options="bankOptions" :series="bankSeries" />
        </client-only>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted } from 'vue'
import { useEntityStore } from '~/stores/entity'

const entityStore = useEntityStore()
const loading = ref(false)
const error = ref(false)

interface ChartsData {
  months: string[]
  pnl: { current: number[]; prev: number[] }
  bankTrend24m: { labels: string[]; values: number[] }
  currentYear: number
  prevYear: number
}

const data = ref<ChartsData | null>(null)

function getAuthHeaders(): Record<string, string> {
  const token = import.meta.client ? localStorage.getItem('auth_token') : null
  return token ? { Authorization: `Bearer ${token}` } : {}
}

async function fetchCharts() {
  loading.value = true
  error.value = false
  try {
    const params = entityStore.selectedEntityId ? { entityId: entityStore.selectedEntityId } : {}
    data.value = await $fetch<ChartsData>('/api/kontabila/charts', { query: params, headers: getAuthHeaders() })
  } catch {
    error.value = true
  } finally {
    loading.value = false
  }
}

// P&L chart config
const pnlSeries = computed(() => {
  if (!data.value) return []
  return [
    { name: String(data.value.currentYear), data: data.value.pnl.current },
    { name: String(data.value.prevYear), data: data.value.pnl.prev },
  ]
})

const pnlOptions = computed(() => ({
  chart: { type: 'bar', toolbar: { show: false }, fontFamily: 'inherit' },
  colors: ['#3b82f6', '#94a3b8'],
  plotOptions: {
    bar: {
      columnWidth: '55%',
      colors: {
        ranges: [{ from: -Infinity, to: 0, color: '#ef4444' }],
      },
    },
  },
  dataLabels: { enabled: false },
  xaxis: { categories: data.value?.months ?? [], labels: { style: { fontSize: '11px' } } },
  yaxis: {
    labels: {
      formatter: (v: number) => {
        if (Math.abs(v) >= 1000) return `€${(v / 1000).toFixed(0)}k`
        return `€${v.toFixed(0)}`
      },
    },
  },
  tooltip: {
    y: { formatter: (v: number) => `€${v.toLocaleString('it-IT', { minimumFractionDigits: 0 })}` },
  },
  legend: { position: 'top', fontSize: '12px' },
  grid: { borderColor: '#f1f5f9' },
}))

// Bank chart config
const bankSeries = computed(() => {
  if (!data.value) return []
  return [{ name: 'Saldo', data: data.value.bankTrend24m.values }]
})

const bankOptions = computed(() => ({
  chart: { type: 'area', toolbar: { show: false }, fontFamily: 'inherit' },
  colors: ['#0ea5e9'],
  fill: {
    type: 'gradient',
    gradient: { shadeIntensity: 1, opacityFrom: 0.4, opacityTo: 0.05, stops: [0, 90, 100] },
  },
  stroke: { curve: 'smooth', width: 2 },
  dataLabels: { enabled: false },
  xaxis: {
    categories: data.value?.bankTrend24m.labels ?? [],
    labels: { style: { fontSize: '10px' }, rotate: -30 },
    tickAmount: 6,
  },
  yaxis: {
    labels: {
      formatter: (v: number) => {
        if (Math.abs(v) >= 1000) return `€${(v / 1000).toFixed(0)}k`
        return `€${v.toFixed(0)}`
      },
    },
  },
  tooltip: {
    y: { formatter: (v: number) => `€${v.toLocaleString('it-IT', { minimumFractionDigits: 0 })}` },
  },
  grid: { borderColor: '#f1f5f9' },
}))

watch(() => entityStore.selectedEntityId, fetchCharts)
onMounted(fetchCharts)
</script>
