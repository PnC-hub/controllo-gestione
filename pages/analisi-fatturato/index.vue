<template>
  <div>
    <div class="card mb-4">
      <div class="card-header">
        <div class="flex items-center gap-2">
          <h2 class="card-title">Analisi Fatturato</h2>
          <PageInfoButton
            title="Analisi Fatturato"
            description="Analisi dettagliata del fatturato per cliente, periodo e prestazione"
            :features="[
              'Breakdown per cliente',
              'Trend mensile',
              'Marginalità per servizio'
            ]"
          />
        </div>
      </div>
      <div class="card-content p-4">
        <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Anno:</label>
            <select v-model="filters.anno" class="input-field" @change="loadData()">
              <option v-for="a in anni" :key="a" :value="a">{{ a }}</option>
            </select>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Categoria:</label>
            <select v-model="filters.categoria_id" class="input-field" @change="loadData()">
              <option value="">Tutte le categorie</option>
              <option v-for="c in categorie" :key="c.id" :value="c.id">{{ c.nome }}</option>
            </select>
          </div>
          <div class="flex items-end">
            <button @click="loadData()" class="px-4 py-2 bg-cyan-600 text-white rounded hover:bg-cyan-700">
              <i class="fas fa-search mr-2"></i> Analizza
            </button>
          </div>
        </div>
      </div>
    </div>

    <div v-if="loading" class="bg-white rounded-lg shadow p-12 text-center">
      <i class="fas fa-spinner fa-spin text-4xl text-cyan-600 mb-4"></i>
      <p class="text-gray-500">Caricamento analisi fatturato...</p>
    </div>

    <div v-else>
      <!-- Fatturato Totale -->
      <div class="bg-gradient-to-r from-cyan-500 to-cyan-600 rounded-lg shadow p-6 mb-4 text-white">
        <div class="text-center">
          <p class="text-cyan-100 text-sm uppercase">Fatturato Totale {{ filters.anno }}</p>
          <p class="text-4xl font-bold">{{ formatCurrency(data.fatturato_totale) }}</p>
        </div>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-4">
        <!-- Fatturato per Categoria -->
        <div class="bg-white rounded-lg shadow overflow-hidden">
          <div class="px-4 py-3 border-b border-gray-200">
            <h3 class="font-semibold text-gray-800">Fatturato per Categoria</h3>
          </div>
          <div class="overflow-x-auto">
            <table class="min-w-full divide-y divide-gray-200">
              <thead class="bg-gray-50">
                <tr>
                  <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Categoria</th>
                  <th class="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">Cure</th>
                  <th class="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">Fatturato</th>
                  <th class="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">%</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-gray-200">
                <tr v-if="data.fatturato_per_categoria.length === 0">
                  <td colspan="4" class="px-4 py-8 text-center text-gray-500">
                    Nessun dato disponibile
                  </td>
                </tr>
                <tr v-for="cat in data.fatturato_per_categoria" :key="cat.categoria_id" class="hover:bg-gray-50">
                  <td class="px-4 py-3 text-sm font-medium">{{ cat.categoria || 'Non categorizzato' }}</td>
                  <td class="px-4 py-3 text-sm text-right">{{ cat.numero_cure }}</td>
                  <td class="px-4 py-3 text-sm text-right font-medium">{{ formatCurrency(cat.fatturato) }}</td>
                  <td class="px-4 py-3 text-sm text-right">
                    {{ data.fatturato_totale > 0 ? ((cat.fatturato / data.fatturato_totale) * 100).toFixed(1) : 0 }}%
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <!-- Fatturato Mensile -->
        <div class="bg-white rounded-lg shadow overflow-hidden">
          <div class="px-4 py-3 border-b border-gray-200">
            <h3 class="font-semibold text-gray-800">Fatturato Mensile</h3>
          </div>
          <div class="p-4">
            <div v-for="mese in 12" :key="mese" class="mb-2">
              <div class="flex justify-between text-sm mb-1">
                <span class="text-gray-600">{{ getMeseNome(mese) }}</span>
                <span class="font-medium">{{ formatCurrency(getFatturatoMese(mese)) }}</span>
              </div>
              <div class="w-full bg-gray-200 rounded-full h-4">
                <div class="bg-cyan-600 h-4 rounded-full transition-all duration-300"
                     :style="{ width: getPercentualeMese(mese) + '%' }"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useCentroStore } from '~/stores/centro'

definePageMeta({ layout: 'default' })

const { fetchApi } = useApi()
const centroStore = useCentroStore()

const loading = ref(true)
const categorie = ref<any[]>([])
const data = reactive({
  fatturato_per_categoria: [] as any[],
  fatturato_mensile: [] as any[],
  fatturato_totale: 0
})

const annoCorrente = new Date().getFullYear()
const anni = Array.from({ length: 5 }, (_, i) => annoCorrente - i)

const filters = reactive({
  anno: annoCorrente,
  categoria_id: ''
})

const formatCurrency = (v: any) => new Intl.NumberFormat('it-IT', { style: 'currency', currency: 'EUR' }).format(parseFloat(v) || 0)

const mesiNomi = ['Gennaio', 'Febbraio', 'Marzo', 'Aprile', 'Maggio', 'Giugno', 'Luglio', 'Agosto', 'Settembre', 'Ottobre', 'Novembre', 'Dicembre']
const getMeseNome = (mese: number) => mesiNomi[mese - 1]

const getFatturatoMese = (mese: number) => {
  const m = data.fatturato_mensile.find((f: any) => f.mese === mese)
  return m ? m.fatturato : 0
}

const getPercentualeMese = (mese: number) => {
  if (data.fatturato_totale === 0) return 0
  const fatturato = getFatturatoMese(mese)
  const maxMensile = Math.max(...data.fatturato_mensile.map((f: any) => parseFloat(f.fatturato) || 0), 1)
  return (fatturato / maxMensile) * 100
}

const loadData = async () => {
  loading.value = true
  try {
    let url = `/finanziario/analisi-fatturato?anno=${filters.anno}`
    if (filters.categoria_id) {
      url += `&categoria_id=${filters.categoria_id}`
    }

    const res = await fetchApi<any>(url)
    if (res.success && res.data) {
      categorie.value = res.data.categorie || []
      data.fatturato_per_categoria = res.data.fatturato_per_categoria || []
      data.fatturato_mensile = res.data.fatturato_mensile || []
      data.fatturato_totale = res.data.fatturato_totale || 0
    }
  } catch (e) {
    console.error('Errore caricamento analisi fatturato:', e)
  } finally {
    loading.value = false
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
.card-title { @apply text-lg font-semibold text-gray-800; }
.card-content { @apply p-4; }
.input-field { @apply w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500; }
</style>
