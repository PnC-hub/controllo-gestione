<template>
  <div class="card">
    <div class="card-header flex justify-between items-center">
      <div class="flex items-center gap-3">
        <h2 class="card-title uppercase">Fatture</h2>
        <PageInfoButton
          title="Fatture"
          description="Elenco fatture emesse con filtri, totale fatturato e dettaglio per operatore"
          :features="[
            'Filtri per data e ricerca',
            'Totale fatturato del periodo',
            'Tabella sortabile con azioni'
          ]"
        />
        <NuxtLink to="/fatture/scheda-extra?nuovo=1" class="btn btn-success btn-sm uppercase">
          <i class="fa fa-plus mr-1"></i> Aggiungi
        </NuxtLink>
      </div>
    </div>

    <div class="card-content p-4">
      <!-- Filtri -->
      <form @submit.prevent="loadFatture(1)" class="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1 uppercase">Periodo dal:</label>
          <input v-model="filtri.data_dal" type="date" class="form-control">
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1 uppercase">al:</label>
          <input v-model="filtri.data_al" type="date" class="form-control">
        </div>
        <div class="flex items-end">
          <button type="submit" class="btn btn-primary">
            <i class="fa fa-search mr-1"></i> Cerca
          </button>
        </div>
      </form>

      <!-- Nota e Totale -->
      <div class="flex flex-col md:flex-row justify-between items-start md:items-center mb-4 gap-4">
        <p class="text-sm text-gray-600">
          <strong>N.B.</strong> Le fatture non ancora verificate vengono evidenziate in arancione.
        </p>
        <h5 class="text-lg font-bold whitespace-nowrap">
          Fatturato totale del periodo selezionato <span class="text-green-600">€ {{ formatNumber(totaleImporti) }}</span>
        </h5>
      </div>

      <!-- Loading -->
      <div v-if="loading" class="text-center py-10">
        <i class="fas fa-spinner fa-spin text-4xl text-cyan-600"></i>
        <p class="text-gray-500 mt-2">Caricamento...</p>
      </div>

      <!-- Tabella -->
      <div v-else class="table-responsive">
        <table class="table table-hover table-bordered">
          <thead class="table-header-legacy">
            <tr>
              <th @click="sortBy('numero')" class="sortable-header">
                Numero
                <span v-if="sortField === 'numero'" class="ml-1">
                  <i :class="sortDir === 'asc' ? 'fa fa-sort-up' : 'fa fa-sort-down'"></i>
                </span>
                <span v-else class="ml-1 text-gray-400"><i class="fa fa-sort"></i></span>
              </th>
              <th @click="sortBy('data')" class="sortable-header">
                Data
                <span v-if="sortField === 'data'" class="ml-1">
                  <i :class="sortDir === 'asc' ? 'fa fa-sort-up' : 'fa fa-sort-down'"></i>
                </span>
                <span v-else class="ml-1 text-gray-400"><i class="fa fa-sort"></i></span>
              </th>
              <th>Cliente</th>
              <th class="text-right">Valore</th>
              <th>Operatore</th>
              <th class="text-center">Azioni</th>
            </tr>
          </thead>
          <tbody>
            <tr v-if="fatture.length === 0">
              <td colspan="6" class="text-center py-8 text-gray-500">
                Nessuna fattura trovata per i criteri selezionati
              </td>
            </tr>
            <tr v-for="f in fatture" :key="f.id" :class="getRowClass(f)">
              <td class="font-medium">
                <NuxtLink :to="`/fatture/scheda/${f.id}`" class="text-cyan-600 hover:underline">
                  {{ formatNumeroFattura(f) }}
                </NuxtLink>
              </td>
              <td>{{ formatDate(f.data) }}</td>
              <td>
                <NuxtLink v-if="f.paziente_id" :to="`/pazienti/${f.paziente_id}`" class="text-cyan-600 hover:underline">
                  {{ f.cliente }}
                </NuxtLink>
                <span v-else>{{ f.cliente }}</span>
              </td>
              <td class="text-right font-medium">{{ formatCurrencyShort(f.totale) }}</td>
              <td>{{ f.operatore || '-' }}</td>
              <td class="text-center">
                <div class="flex justify-center gap-1">
                  <NuxtLink :to="`/fatture/scheda/${f.id}`" class="btn btn-info btn-xs" title="Visualizza">
                    <i class="fa fa-eye"></i>
                  </NuxtLink>
                  <button @click="printFattura(f)" class="btn btn-secondary btn-xs" title="Stampa PDF">
                    <i class="fa fa-print"></i>
                  </button>
                  <button @click="sendFattura(f)" class="btn btn-success btn-xs" title="Invia via Email">
                    <i class="fa fa-paper-plane"></i>
                  </button>
                  <button v-if="!f.verificata" @click="verificaFattura(f)" class="btn btn-warning btn-xs" title="Valida Fattura">
                    <i class="fa fa-check"></i>
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Paginazione -->
      <div v-if="pagination.total > 0" class="flex justify-between items-center mt-4">
        <p class="text-sm text-gray-600">
          Mostrando {{ ((pagination.current_page - 1) * pagination.per_page) + 1 }}-{{ Math.min(pagination.current_page * pagination.per_page, pagination.total) }} di {{ pagination.total }}
        </p>
        <div class="flex gap-1">
          <button
            @click="goToPage(pagination.current_page - 1)"
            :disabled="pagination.current_page <= 1"
            class="btn btn-sm btn-secondary"
          >
            <i class="fa fa-chevron-left"></i>
          </button>
          <template v-for="page in visiblePages" :key="page">
            <button
              v-if="page !== '...'"
              @click="goToPage(page)"
              :class="page === pagination.current_page ? 'btn-primary' : 'btn-secondary'"
              class="btn btn-sm"
            >
              {{ page }}
            </button>
            <span v-else class="px-2 py-1">...</span>
          </template>
          <button
            @click="goToPage(pagination.current_page + 1)"
            :disabled="pagination.current_page >= pagination.last_page"
            class="btn btn-sm btn-secondary"
          >
            <i class="fa fa-chevron-right"></i>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({ layout: 'default' })

const { fetchApi } = useApi()
const config = useRuntimeConfig()

const loading = ref(true)
const fatture = ref<any[]>([])
const totaleImporti = ref(0)
const sortField = ref('numero')
const sortDir = ref<'asc' | 'desc'>('desc')

const filtri = reactive({
  data_dal: new Date(new Date().getFullYear(), 0, 1).toISOString().split('T')[0],
  data_al: new Date().toISOString().split('T')[0]
})

const pagination = reactive({
  current_page: 1,
  last_page: 1,
  per_page: 25,
  total: 0
})

const visiblePages = computed(() => {
  const pages: (number | string)[] = []
  const current = pagination.current_page
  const last = pagination.last_page

  if (last <= 7) {
    for (let i = 1; i <= last; i++) pages.push(i)
  } else {
    if (current <= 3) {
      pages.push(1, 2, 3, 4, '...', last)
    } else if (current >= last - 2) {
      pages.push(1, '...', last - 3, last - 2, last - 1, last)
    } else {
      pages.push(1, '...', current - 1, current, current + 1, '...', last)
    }
  }
  return pages
})

const loadFatture = async (page = 1) => {
  loading.value = true
  try {
    const params = new URLSearchParams()
    params.append('page', page.toString())
    params.append('limit', pagination.per_page.toString())
    params.append('order', sortField.value)
    params.append('sort', sortDir.value)
    params.append('data_dal', filtri.data_dal)
    params.append('data_al', filtri.data_al)

    const res = await fetchApi<any>(`/fatture?${params.toString()}`)

    if (res.success !== false) {
      fatture.value = res.data || []
      totaleImporti.value = res.totale_importi || 0
      if (res.pagination) {
        pagination.current_page = res.pagination.current_page || res.pagination.page || 1
        pagination.last_page = res.pagination.last_page || res.pagination.pages || 1
        pagination.per_page = res.pagination.per_page || 25
        pagination.total = res.pagination.total || 0
      }
    }
  } catch (e) {
    console.error('Errore caricamento fatture:', e)
  } finally {
    loading.value = false
  }
}

const sortBy = (field: string) => {
  if (sortField.value === field) {
    sortDir.value = sortDir.value === 'asc' ? 'desc' : 'asc'
  } else {
    sortField.value = field
    sortDir.value = 'desc'
  }
  loadFatture(1)
}

const goToPage = (page: number | string) => {
  if (typeof page === 'number' && page >= 1 && page <= pagination.last_page) {
    loadFatture(page)
  }
}

const formatDate = (dateStr: string) => {
  if (!dateStr) return '-'
  try {
    const d = new Date(dateStr)
    const day = String(d.getDate()).padStart(2, '0')
    const month = String(d.getMonth() + 1).padStart(2, '0')
    const year = d.getFullYear()
    return `${day}-${month}-${year}`
  } catch {
    return dateStr
  }
}

const formatCurrency = (value: number) => {
  return new Intl.NumberFormat('it-IT', { style: 'currency', currency: 'EUR' }).format(value || 0)
}

const formatNumber = (value: number) => {
  return new Intl.NumberFormat('it-IT', { maximumFractionDigits: 0 }).format(value || 0)
}

const formatCurrencyShort = (value: number) => {
  if (!value) return '0 €'
  return Math.round(value) + ' €'
}

const formatNumeroFattura = (f: any) => {
  // Formato legacy: numero/anno (es: 92/2026)
  if (f.numero && f.data) {
    const year = new Date(f.data).getFullYear()
    return `${f.numero}/${year}`
  }
  return f.numero || '-'
}

// Riga arancio per fatture non verificate (come legacy)
const getRowClass = (f: any) => {
  if (!f.verificata) return 'bg-orange-100'
  return ''
}

const printFattura = (f: any) => {
  window.open(`${config.public.apiBase}/fatture/${f.id}/pdf`, '_blank')
}

const sendFattura = async (f: any) => {
  if (!confirm('Inviare la fattura via email al paziente?')) return
  try {
    await fetchApi(`/fatture/${f.id}/invia`, { method: 'POST' })
    alert('Fattura inviata con successo!')
  } catch (e) {
    alert('Errore nell\'invio della fattura')
  }
}

const verificaFattura = async (f: any) => {
  if (!confirm('Validare questa fattura?')) return
  try {
    await fetchApi(`/fatture/${f.id}/verifica`, { method: 'POST' })
    f.verificata = true
  } catch (e) {
    alert('Errore nella validazione della fattura')
  }
}

onMounted(() => {
  loadFatture()
})
</script>

<style scoped>
.card {
  @apply bg-white rounded-lg shadow;
}
.card-header {
  @apply px-6 py-4 border-b border-gray-200;
}
.card-title {
  @apply text-lg font-semibold text-gray-900;
}
.card-content {
  @apply p-4;
}
.form-control {
  @apply w-full px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500;
}
.btn {
  @apply inline-flex items-center px-4 py-2 rounded font-medium transition-colors;
}
.btn-sm {
  @apply px-3 py-1 text-sm;
}
.btn-xs {
  @apply px-2 py-1 text-xs;
}
.btn-primary {
  @apply bg-cyan-600 text-white hover:bg-cyan-700;
}
.btn-secondary {
  @apply bg-gray-200 text-gray-700 hover:bg-gray-300;
}
.btn-success {
  @apply bg-green-600 text-white hover:bg-green-700;
}
.btn-info {
  @apply bg-blue-500 text-white hover:bg-blue-600;
}
.btn-warning {
  @apply bg-yellow-500 text-white hover:bg-yellow-600;
}
.btn:disabled {
  @apply opacity-50 cursor-not-allowed;
}
.table-responsive {
  @apply overflow-x-auto;
}
.table {
  @apply w-full border-collapse;
}
.table th, .table td {
  @apply border border-gray-200 px-4 py-3 text-left text-sm;
}
.table th {
  @apply bg-gray-50 font-medium text-gray-700;
}
.table-hover tbody tr:hover {
  @apply bg-gray-50;
}
.sortable-header {
  @apply cursor-pointer select-none;
}
.table-header-legacy th {
  @apply bg-teal-600 text-white font-medium;
}
</style>
