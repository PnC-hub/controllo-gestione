<template>
  <div>
    <div class="card mb-4">
      <div class="card-header">
        <h2 class="card-title">Registro Economico</h2>
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
      <p class="text-gray-500">Caricamento registro economico...</p>
    </div>

    <div v-else class="bg-white rounded-lg shadow overflow-hidden">
      <div class="overflow-x-auto">
        <table class="min-w-full divide-y divide-gray-200">
          <thead class="bg-gray-50">
            <tr>
              <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">ID</th>
              <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Data</th>
              <th class="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">Costi Fissi</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-200">
            <tr v-if="registri.length === 0">
              <td colspan="3" class="px-4 py-8 text-center text-gray-500">
                Nessun registro economico presente
              </td>
            </tr>
            <tr v-for="r in registri" :key="r.id" class="hover:bg-gray-50">
              <td class="px-4 py-3 text-sm">{{ r.id }}</td>
              <td class="px-4 py-3 text-sm">{{ formatDate(r.data) }}</td>
              <td class="px-4 py-3 text-sm text-right font-medium">{{ formatCurrency(r.costi_fissi) }}</td>
            </tr>
          </tbody>
        </table>
      </div>
      <div v-if="pagination.total > 0" class="px-4 py-3 border-t border-gray-200 flex items-center justify-between">
        <p class="text-sm text-gray-500">
          Pagina {{ pagination.page }} di {{ pagination.pages }} ({{ pagination.total }} registri)
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
const registri = ref<any[]>([])

const pagination = reactive({
  page: 1,
  pages: 1,
  limit: 50,
  total: 0
})

const oggi = new Date()
const inizioMese = new Date(oggi.getFullYear(), oggi.getMonth(), 1)

const filters = reactive({
  data_dal: inizioMese.toISOString().split('T')[0],
  data_al: oggi.toISOString().split('T')[0]
})

const formatDate = (d: string) => { if (!d) return '-'; const date = new Date(d); return `${String(date.getDate()).padStart(2, '0')}-${String(date.getMonth() + 1).padStart(2, '0')}-${date.getFullYear()}`; }
const formatCurrency = (v: any) => new Intl.NumberFormat('it-IT', { style: 'currency', currency: 'EUR' }).format(parseFloat(v) || 0)

const loadData = async (page = 1) => {
  loading.value = true
  try {
    let url = `/finanziario/registro-economico?page=${page}&limit=${pagination.limit}`
    url += `&data_dal=${filters.data_dal}&data_al=${filters.data_al}`

    const res = await fetchApi<any>(url)
    if (res.success) {
      registri.value = res.data || []
      if (res.pagination) {
        pagination.page = res.pagination.page
        pagination.pages = res.pagination.pages
        pagination.total = res.pagination.total
      }
    }
  } catch (e) {
    console.error('Errore caricamento registro economico:', e)
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
