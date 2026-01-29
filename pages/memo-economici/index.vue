<template>
  <div>
    <div class="card mb-4">
      <div class="card-header">
        <h2 class="card-title">Memo Economici</h2>
      </div>
      <div class="card-content p-4">
        <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Periodo dal:</label>
            <input type="date" v-model="filters.data_dal" class="input-field" @change="loadData(1)" />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">al:</label>
            <input type="date" v-model="filters.data_al" class="input-field" @change="loadData(1)" />
          </div>
          <div class="flex items-end">
            <button @click="loadData(1)" class="px-4 py-2 bg-cyan-600 text-white rounded hover:bg-cyan-700">
              <i class="fas fa-search mr-2"></i> Cerca
            </button>
          </div>
        </div>
      </div>
    </div>

    <div v-if="loading" class="bg-white rounded-lg shadow p-12 text-center">
      <i class="fas fa-spinner fa-spin text-4xl text-cyan-600 mb-4"></i>
      <p class="text-gray-500">Caricamento memo economici...</p>
    </div>

    <div v-else class="bg-white rounded-lg shadow overflow-hidden">
      <div class="overflow-x-auto">
        <table class="min-w-full divide-y divide-gray-200">
          <thead class="bg-gray-50">
            <tr>
              <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Data</th>
              <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Titolo</th>
              <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Descrizione</th>
              <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Tipologia</th>
              <th class="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">Importo</th>
              <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Operatore</th>
              <th class="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase">Stato</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-200">
            <tr v-if="memo.length === 0">
              <td colspan="7" class="px-4 py-8 text-center text-gray-500">
                Nessun memo economico presente
              </td>
            </tr>
            <tr v-for="m in memo" :key="m.id" class="hover:bg-gray-50">
              <td class="px-4 py-3 text-sm">{{ formatDate(m.data) }}</td>
              <td class="px-4 py-3 text-sm font-medium">{{ m.titolo }}</td>
              <td class="px-4 py-3 text-sm">{{ m.descrizione || '-' }}</td>
              <td class="px-4 py-3 text-sm">
                <span :class="getTipologiaClass(m.tipologia)" class="px-2 py-1 rounded text-xs">
                  {{ m.tipologia || '-' }}
                </span>
              </td>
              <td class="px-4 py-3 text-sm text-right font-medium">{{ formatCurrency(m.importo) }}</td>
              <td class="px-4 py-3 text-sm">{{ m.operatore || '-' }}</td>
              <td class="px-4 py-3 text-center">
                <span :class="getStatoClass(m.stato)" class="px-2 py-1 rounded-full text-xs font-medium">
                  {{ m.stato || 'N/A' }}
                </span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <div v-if="pagination.total > 0" class="px-4 py-3 border-t border-gray-200 flex items-center justify-between">
        <p class="text-sm text-gray-500">
          Pagina {{ pagination.page }} di {{ pagination.pages }} ({{ pagination.total }} memo)
        </p>
        <div v-if="pagination.pages > 1" class="flex space-x-2">
          <button @click="loadData(pagination.page - 1)" :disabled="pagination.page <= 1"
                  class="px-3 py-1 border rounded hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed">
            <i class="fas fa-chevron-left"></i>
          </button>
          <button @click="loadData(pagination.page + 1)" :disabled="pagination.page >= pagination.pages"
                  class="px-3 py-1 border rounded hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed">
            <i class="fas fa-chevron-right"></i>
          </button>
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
const memo = ref<any[]>([])

const pagination = reactive({
  page: 1,
  pages: 1,
  limit: 25,
  total: 0
})

const oggi = new Date()
const inizioAnno = new Date(oggi.getFullYear(), 0, 1)

const filters = reactive({
  data_dal: inizioAnno.toISOString().split('T')[0],
  data_al: oggi.toISOString().split('T')[0]
})

const formatDate = (d: string) => { if (!d) return '-'; const date = new Date(d); return `${String(date.getDate()).padStart(2, '0')}-${String(date.getMonth() + 1).padStart(2, '0')}-${date.getFullYear()}`; }
const formatCurrency = (v: any) => new Intl.NumberFormat('it-IT', { style: 'currency', currency: 'EUR' }).format(parseFloat(v) || 0)

const getTipologiaClass = (tipologia: string) => {
  if (!tipologia) return 'bg-gray-100 text-gray-800'
  const t = tipologia.toLowerCase()
  if (t === 'entrata') return 'bg-green-100 text-green-800'
  if (t === 'uscita') return 'bg-red-100 text-red-800'
  return 'bg-blue-100 text-blue-800'
}

const getStatoClass = (stato: string) => {
  if (!stato) return 'bg-gray-100 text-gray-800'
  const s = stato.toLowerCase()
  if (s === 'completato' || s === 'pagato') return 'bg-green-100 text-green-800'
  if (s === 'annullato') return 'bg-red-100 text-red-800'
  return 'bg-yellow-100 text-yellow-800'
}

const loadData = async (page = 1) => {
  loading.value = true
  try {
    let url = `/amministratore/memo-economici?page=${page}&limit=${pagination.limit}`
    url += `&data_dal=${filters.data_dal}&data_al=${filters.data_al}`

    const res = await fetchApi<any>(url)
    if (res.success) {
      memo.value = res.data || []
      if (res.pagination) {
        pagination.page = res.pagination.page
        pagination.pages = res.pagination.pages
        pagination.total = res.pagination.total
      }
    }
  } catch (e) {
    console.error('Errore caricamento memo economici:', e)
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
