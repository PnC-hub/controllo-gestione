<template>
  <div>
    <div class="card mb-6">
      <div class="card-header">
        <h2 class="card-title">
          <i class="fas fa-chart-pie mr-2 text-cyan-600"></i>
          Riepilogo Costi
        </h2>
      </div>
    </div>

    <!-- Navigazione rapida -->
    <div class="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
      <NuxtLink to="/costi/variabili-indiretti" class="cost-card bg-blue-50 hover:bg-blue-100">
        <i class="fas fa-percentage text-blue-600 text-2xl mb-2"></i>
        <div class="text-lg font-bold text-blue-700">{{ formatCurrency(totals.variabili_indiretti) }}</div>
        <div class="text-sm text-blue-600">Variabili Indiretti</div>
      </NuxtLink>

      <NuxtLink to="/costi/variabili-gestionali" class="cost-card bg-purple-50 hover:bg-purple-100">
        <i class="fas fa-cogs text-purple-600 text-2xl mb-2"></i>
        <div class="text-lg font-bold text-purple-700">{{ formatCurrency(totals.variabili_gestionali) }}</div>
        <div class="text-sm text-purple-600">Variabili Gestionali</div>
      </NuxtLink>

      <NuxtLink to="/costi/materiali" class="cost-card bg-orange-50 hover:bg-orange-100">
        <i class="fas fa-boxes text-orange-600 text-2xl mb-2"></i>
        <div class="text-lg font-bold text-orange-700">{{ formatCurrency(totals.materiali) }}</div>
        <div class="text-sm text-orange-600">Materiali</div>
      </NuxtLink>

      <NuxtLink to="/costi/fissi" class="cost-card bg-red-50 hover:bg-red-100">
        <i class="fas fa-building text-red-600 text-2xl mb-2"></i>
        <div class="text-lg font-bold text-red-700">{{ formatCurrency(totals.fissi) }}</div>
        <div class="text-sm text-red-600">Fissi</div>
      </NuxtLink>

      <NuxtLink to="/costi/totali" class="cost-card bg-gray-100 hover:bg-gray-200">
        <i class="fas fa-calculator text-gray-700 text-2xl mb-2"></i>
        <div class="text-lg font-bold text-gray-800">{{ formatCurrency(totals.totale) }}</div>
        <div class="text-sm text-gray-600">Totale Costi</div>
      </NuxtLink>
    </div>

    <!-- Grafico ripartizione -->
    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div class="card">
        <div class="card-header">
          <h3 class="font-semibold">Ripartizione per Categoria</h3>
        </div>
        <div class="card-content">
          <div class="space-y-4">
            <div v-for="cat in categories" :key="cat.name" class="flex items-center">
              <div class="w-32 text-sm text-gray-600">{{ cat.name }}</div>
              <div class="flex-1 mx-4">
                <div class="h-4 bg-gray-200 rounded-full overflow-hidden">
                  <div
                    class="h-full rounded-full transition-all duration-500"
                    :style="{ width: cat.percentage + '%', backgroundColor: cat.color }"
                  ></div>
                </div>
              </div>
              <div class="w-24 text-right text-sm font-medium">{{ cat.percentage }}%</div>
            </div>
          </div>
        </div>
      </div>

      <div class="card">
        <div class="card-header">
          <h3 class="font-semibold">Trend Mensile</h3>
        </div>
        <div class="card-content">
          <div class="space-y-3">
            <div v-for="month in trend" :key="month.mese" class="flex items-center justify-between">
              <div class="text-sm text-gray-600">{{ month.mese }}</div>
              <div class="flex items-center">
                <div class="w-32 h-2 bg-gray-200 rounded-full overflow-hidden mr-3">
                  <div
                    class="h-full bg-cyan-500 rounded-full"
                    :style="{ width: (month.totale / maxTrend * 100) + '%' }"
                  ></div>
                </div>
                <div class="text-sm font-medium w-24 text-right">{{ formatCurrency(month.totale) }}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Link a tutti i costi -->
    <div class="mt-6 text-center">
      <NuxtLink to="/memo-economici" class="text-cyan-600 hover:underline">
        <i class="fas fa-list mr-2"></i> Visualizza tutti i costi dettagliati
      </NuxtLink>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useCentroStore } from '~/stores/centro'

definePageMeta({ layout: 'default' })

const { fetchApi } = useApi()
const centroStore = useCentroStore()

const totals = ref({
  variabili_indiretti: 0,
  variabili_gestionali: 0,
  materiali: 0,
  fissi: 0,
  totale: 0
})

const categories = ref<{ name: string; percentage: number; color: string }[]>([])
const trend = ref<{ mese: string; totale: number }[]>([])
const maxTrend = computed(() => Math.max(...trend.value.map(t => t.totale), 1))

const formatCurrency = (v: any) => new Intl.NumberFormat('it-IT', { style: 'currency', currency: 'EUR' }).format(parseFloat(v) || 0)

const loadData = async () => {
  try {
    const res = await fetchApi<any>('/costi/riepilogo')
    if (res.success) {
      totals.value = res.data.totals || totals.value
      categories.value = res.data.categories || []
      trend.value = res.data.trend || []
    }
  } catch (e) {
    // Fallback con dati mock se API non esiste ancora
    totals.value = {
      variabili_indiretti: 0,
      variabili_gestionali: 0,
      materiali: 0,
      fissi: 0,
      totale: 0
    }
    categories.value = [
      { name: 'Var. Indiretti', percentage: 25, color: '#3B82F6' },
      { name: 'Var. Gestionali', percentage: 20, color: '#8B5CF6' },
      { name: 'Materiali', percentage: 30, color: '#F97316' },
      { name: 'Fissi', percentage: 25, color: '#EF4444' }
    ]
  }
}

onMounted(async () => {
  if (!centroStore.centroCorrente && centroStore.centri.length === 0) {
    await centroStore.fetchCentri()
  }
  await loadData()
})
</script>

<style scoped>
.card { @apply bg-white rounded-lg shadow; }
.card-header { @apply px-4 py-3 border-b border-gray-200; }
.card-title { @apply text-lg font-semibold text-gray-800 flex items-center; }
.card-content { @apply p-4; }

.cost-card {
  @apply rounded-lg p-4 text-center transition-all cursor-pointer;
  @apply flex flex-col items-center justify-center;
}
</style>
