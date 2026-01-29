<template>
  <div>
    <!-- Header -->
    <div class="flex justify-between items-center mb-6">
      <div>
        <h1 class="text-2xl font-bold text-gray-900">Fatture Passive</h1>
        <p class="text-gray-500 text-sm mt-1">Gestione fatture fornitori e spese</p>
      </div>
      <button class="btn-primary" @click="openCreateModal">
        <i class="fas fa-plus mr-2"></i>Nuova Fattura
      </button>
    </div>

    <!-- Filtri -->
    <div class="bg-white rounded-lg shadow p-4 mb-4">
      <div class="flex flex-wrap items-center gap-4">
        <!-- Anno -->
        <div>
          <label class="block text-xs text-gray-500 mb-1">Anno</label>
          <select v-model="filters.anno" class="input-field w-28" @change="loadData">
            <option v-for="y in years" :key="y" :value="y">{{ y }}</option>
          </select>
        </div>
        <!-- Mese -->
        <div>
          <label class="block text-xs text-gray-500 mb-1">Mese</label>
          <select v-model="filters.mese" class="input-field w-36" @change="loadData">
            <option value="">Tutti</option>
            <option v-for="(m, i) in mesi" :key="i" :value="i + 1">{{ m }}</option>
          </select>
        </div>
        <!-- Tipo Pagamento -->
        <div>
          <label class="block text-xs text-gray-500 mb-1">Tipo Pagamento</label>
          <select v-model="filters.tipo_pagamento" class="input-field w-36" @change="loadData">
            <option value="">Tutti</option>
            <option v-for="t in tipiPagamento" :key="t" :value="t">{{ t }}</option>
          </select>
        </div>
        <!-- Ricerca -->
        <div class="flex-1 min-w-[200px]">
          <label class="block text-xs text-gray-500 mb-1">Cerca</label>
          <input
            v-model="filters.q"
            type="text"
            placeholder="Intestatario, riferimento, note..."
            class="input-field w-full"
            @input="debouncedSearch"
          >
        </div>
      </div>
    </div>

    <!-- Stats -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
      <div class="bg-white rounded-lg shadow p-4">
        <div class="text-sm text-gray-500">Totale Fatture</div>
        <div class="text-2xl font-bold text-gray-900">{{ meta.total }}</div>
      </div>
      <div class="bg-white rounded-lg shadow p-4">
        <div class="text-sm text-gray-500">Totale Pagina</div>
        <div class="text-2xl font-bold text-cyan-600">{{ formatCurrency(meta.totale_importi_pagina) }}</div>
      </div>
      <div class="bg-white rounded-lg shadow p-4">
        <div class="text-sm text-gray-500">Totale Periodo</div>
        <div class="text-2xl font-bold text-green-600">{{ formatCurrency(meta.totale_generale) }}</div>
      </div>
    </div>

    <!-- Loading -->
    <div v-if="loading" class="bg-white rounded-lg shadow p-8 text-center">
      <i class="fas fa-spinner fa-spin text-2xl text-cyan-600"></i>
      <p class="mt-2 text-gray-500">Caricamento...</p>
    </div>

    <!-- Error -->
    <div v-else-if="error" class="bg-red-50 border border-red-200 rounded-lg p-4">
      <div class="text-red-600"><i class="fas fa-exclamation-triangle mr-2"></i>{{ error }}</div>
      <button class="mt-2 text-sm text-red-600 underline" @click="loadData">Riprova</button>
    </div>

    <!-- Tabella -->
    <div v-else class="bg-white rounded-lg shadow overflow-hidden">
      <table v-if="items.length > 0" class="min-w-full divide-y divide-gray-200">
        <thead class="bg-gray-50">
          <tr>
            <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Data Pag.</th>
            <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Intestatario</th>
            <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Tipo Pag.</th>
            <th class="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">Importo</th>
            <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Rif. Fattura</th>
            <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Data Fattura</th>
            <th class="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase">Amm.</th>
            <th class="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">Azioni</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-gray-200">
          <tr v-for="item in items" :key="item.id" class="hover:bg-gray-50">
            <td class="px-4 py-3 text-sm">{{ formatDate(item.data) }}</td>
            <td class="px-4 py-3">
              <div class="text-sm font-medium text-gray-900">{{ item.intestatario }}</div>
              <div v-if="item.note" class="text-xs text-gray-500 truncate max-w-[200px]" :title="item.note">{{ item.note }}</div>
            </td>
            <td class="px-4 py-3">
              <span class="px-2 py-1 text-xs rounded-full" :class="getTipoPagamentoBadge(item.tipo_pagamento)">
                {{ item.tipo_pagamento || '-' }}
              </span>
            </td>
            <td class="px-4 py-3 text-sm text-right font-medium text-gray-900">{{ formatCurrency(item.valore) }}</td>
            <td class="px-4 py-3 text-sm text-gray-600">{{ item.riferimento || '-' }}</td>
            <td class="px-4 py-3 text-sm text-gray-600">{{ item.data_fattura ? formatDate(item.data_fattura) : '-' }}</td>
            <td class="px-4 py-3 text-center">
              <i v-if="item.ammortamento" class="fas fa-check text-green-500"></i>
              <i v-else class="fas fa-minus text-gray-300"></i>
            </td>
            <td class="px-4 py-3 text-right">
              <button class="text-cyan-600 hover:text-cyan-800 mr-2" title="Modifica" @click="editItem(item)">
                <i class="fas fa-edit"></i>
              </button>
              <button class="text-red-500 hover:text-red-700" title="Elimina" @click="confirmDelete(item)">
                <i class="fas fa-trash"></i>
              </button>
            </td>
          </tr>
        </tbody>
      </table>

      <!-- Empty state -->
      <div v-else class="text-center py-12 text-gray-400">
        <i class="fas fa-file-invoice text-4xl mb-3"></i>
        <p class="text-lg">Nessuna fattura passiva trovata</p>
        <p class="text-sm mt-1">Clicca su "Nuova Fattura" per aggiungerne una</p>
      </div>

      <!-- Pagination -->
      <div v-if="meta.last_page > 1" class="px-4 py-3 border-t bg-gray-50 flex items-center justify-between">
        <div class="text-sm text-gray-500">
          Pagina {{ meta.current_page }} di {{ meta.last_page }} ({{ meta.total }} risultati)
        </div>
        <div class="flex gap-2">
          <button
            class="px-3 py-1 text-sm rounded border"
            :class="meta.current_page <= 1 ? 'bg-gray-100 text-gray-400' : 'bg-white text-gray-700 hover:bg-gray-50'"
            :disabled="meta.current_page <= 1"
            @click="changePage(meta.current_page - 1)"
          >
            <i class="fas fa-chevron-left"></i>
          </button>
          <button
            class="px-3 py-1 text-sm rounded border"
            :class="meta.current_page >= meta.last_page ? 'bg-gray-100 text-gray-400' : 'bg-white text-gray-700 hover:bg-gray-50'"
            :disabled="meta.current_page >= meta.last_page"
            @click="changePage(meta.current_page + 1)"
          >
            <i class="fas fa-chevron-right"></i>
          </button>
        </div>
      </div>
    </div>

    <!-- Modal Create/Edit -->
    <div v-if="showModal" class="fixed inset-0 z-50 overflow-y-auto">
      <div class="flex items-center justify-center min-h-screen px-4">
        <div class="fixed inset-0 bg-black bg-opacity-50" @click="closeModal"></div>
        <div class="relative bg-white rounded-lg shadow-xl max-w-lg w-full p-6">
          <div class="flex items-center justify-between mb-4">
            <h3 class="text-lg font-semibold text-gray-800">
              {{ editingItem ? 'Modifica Fattura Passiva' : 'Nuova Fattura Passiva' }}
            </h3>
            <button class="text-gray-400 hover:text-gray-600" @click="closeModal">
              <i class="fas fa-times"></i>
            </button>
          </div>

          <form @submit.prevent="saveItem">
            <div class="grid grid-cols-2 gap-4">
              <!-- Data pagamento -->
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Data Pagamento *</label>
                <input v-model="form.data" type="date" class="input-field w-full" required>
              </div>
              <!-- Importo -->
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Importo *</label>
                <input v-model.number="form.valore" type="number" step="0.01" min="0" class="input-field w-full" required>
              </div>
            </div>

            <!-- Intestatario -->
            <div class="mt-4">
              <label class="block text-sm font-medium text-gray-700 mb-1">Intestatario *</label>
              <input v-model="form.intestatario" type="text" class="input-field w-full" placeholder="Nome fornitore" required>
            </div>

            <div class="grid grid-cols-2 gap-4 mt-4">
              <!-- Tipo pagamento -->
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Tipo Pagamento</label>
                <select v-model="form.tipo_pagamento" class="input-field w-full">
                  <option value="">Seleziona...</option>
                  <option value="Bonifico">Bonifico</option>
                  <option value="Contanti">Contanti</option>
                  <option value="Carta">Carta</option>
                  <option value="PayPal">PayPal</option>
                  <option value="Assegno">Assegno</option>
                  <option value="RID">RID</option>
                </select>
              </div>
              <!-- Data fattura -->
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Data Fattura</label>
                <input v-model="form.data_fattura" type="date" class="input-field w-full">
              </div>
            </div>

            <!-- Riferimento -->
            <div class="mt-4">
              <label class="block text-sm font-medium text-gray-700 mb-1">Riferimento Fattura</label>
              <input v-model="form.riferimento" type="text" class="input-field w-full" placeholder="Es. FA-2026/001">
            </div>

            <!-- Note -->
            <div class="mt-4">
              <label class="block text-sm font-medium text-gray-700 mb-1">Note</label>
              <textarea v-model="form.note" rows="2" class="input-field w-full" placeholder="Note aggiuntive..."></textarea>
            </div>

            <!-- Ammortamento -->
            <div class="mt-4">
              <label class="flex items-center">
                <input v-model="form.ammortamento" type="checkbox" class="rounded border-gray-300 text-cyan-600 focus:ring-cyan-500">
                <span class="ml-2 text-sm text-gray-700">Ammortamento</span>
              </label>
            </div>

            <!-- Actions -->
            <div class="flex justify-end gap-3 mt-6">
              <button type="button" class="btn-secondary" @click="closeModal">Annulla</button>
              <button type="submit" class="btn-primary" :disabled="saving">
                <i v-if="saving" class="fas fa-spinner fa-spin mr-2"></i>
                {{ editingItem ? 'Salva Modifiche' : 'Crea Fattura' }}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>

    <!-- Modal Conferma Eliminazione -->
    <div v-if="showDeleteModal" class="fixed inset-0 z-50 overflow-y-auto">
      <div class="flex items-center justify-center min-h-screen px-4">
        <div class="fixed inset-0 bg-black bg-opacity-50" @click="showDeleteModal = false"></div>
        <div class="relative bg-white rounded-lg shadow-xl max-w-md w-full p-6">
          <div class="text-center">
            <i class="fas fa-exclamation-triangle text-4xl text-yellow-500 mb-4"></i>
            <h3 class="text-lg font-semibold text-gray-800 mb-2">Conferma Eliminazione</h3>
            <p class="text-gray-600 mb-6">
              Sei sicuro di voler eliminare la fattura di<br>
              <strong class="text-gray-800">{{ deletingItem?.intestatario }}</strong><br>
              del <strong>{{ formatDate(deletingItem?.data) }}</strong> - {{ formatCurrency(deletingItem?.valore) }}?
            </p>
            <div class="flex justify-center gap-3">
              <button class="btn-secondary" @click="showDeleteModal = false">Annulla</button>
              <button class="btn-danger" :disabled="deleting" @click="deleteItem">
                <i v-if="deleting" class="fas fa-spinner fa-spin mr-2"></i>
                Elimina
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, computed } from 'vue'

definePageMeta({ layout: 'default' })

interface MemoEconomico {
  id: number
  data: string
  intestatario: string
  tipo_pagamento: string | null
  valore: number
  riferimento: string | null
  data_fattura: string | null
  ammortamento: boolean
  note: string | null
}

interface Meta {
  total: number
  per_page: number
  current_page: number
  last_page: number
  totale_importi_pagina: number
  totale_generale: number
}

const { fetchApi } = useApi()

// State
const items = ref<MemoEconomico[]>([])
const loading = ref(true)
const error = ref<string | null>(null)
const tipiPagamento = ref<string[]>([])

const meta = ref<Meta>({
  total: 0,
  per_page: 50,
  current_page: 1,
  last_page: 1,
  totale_importi_pagina: 0,
  totale_generale: 0,
})

const mesi = ['Gennaio', 'Febbraio', 'Marzo', 'Aprile', 'Maggio', 'Giugno', 'Luglio', 'Agosto', 'Settembre', 'Ottobre', 'Novembre', 'Dicembre']
const currentYear = new Date().getFullYear()
const years = computed(() => {
  const arr = []
  for (let y = currentYear; y >= 2018; y--) arr.push(y)
  return arr
})

// Filters
const filters = reactive({
  anno: currentYear,
  mese: '',
  tipo_pagamento: '',
  q: '',
})

// Modal state
const showModal = ref(false)
const editingItem = ref<MemoEconomico | null>(null)
const saving = ref(false)

// Delete state
const showDeleteModal = ref(false)
const deletingItem = ref<MemoEconomico | null>(null)
const deleting = ref(false)

// Form
const form = reactive({
  data: '',
  intestatario: '',
  tipo_pagamento: '',
  valore: 0,
  riferimento: '',
  data_fattura: '',
  ammortamento: false,
  note: '',
})

// Load data
async function loadData(page = 1) {
  loading.value = true
  error.value = null
  try {
    const params = new URLSearchParams()
    params.append('page', String(page))
    params.append('per_page', '50')
    if (filters.anno) params.append('anno', String(filters.anno))
    if (filters.mese) params.append('mese', String(filters.mese))
    if (filters.tipo_pagamento) params.append('tipo_pagamento', filters.tipo_pagamento)
    if (filters.q) params.append('q', filters.q)

    const response = await fetchApi<any>(`/memo-economici?${params.toString()}`)
    if (response.success) {
      items.value = response.data || []
      meta.value = response.meta
    } else {
      error.value = response.error || 'Errore nel caricamento'
    }
  } catch (e: any) {
    error.value = e.message || 'Errore di connessione'
  } finally {
    loading.value = false
  }
}

// Load tipi pagamento
async function loadTipiPagamento() {
  try {
    const response = await fetchApi<any>('/memo-economici/tipi-pagamento')
    if (response.success) {
      tipiPagamento.value = response.data || []
    }
  } catch (e) {
    console.error('Errore caricamento tipi pagamento:', e)
  }
}

// Debounced search
let searchTimeout: NodeJS.Timeout
function debouncedSearch() {
  clearTimeout(searchTimeout)
  searchTimeout = setTimeout(() => {
    loadData()
  }, 300)
}

// Change page
function changePage(page: number) {
  loadData(page)
}

// Open create modal
function openCreateModal() {
  editingItem.value = null
  form.data = new Date().toISOString().split('T')[0]
  form.intestatario = ''
  form.tipo_pagamento = ''
  form.valore = 0
  form.riferimento = ''
  form.data_fattura = ''
  form.ammortamento = false
  form.note = ''
  showModal.value = true
}

// Edit item
function editItem(item: MemoEconomico) {
  editingItem.value = item
  form.data = item.data
  form.intestatario = item.intestatario
  form.tipo_pagamento = item.tipo_pagamento || ''
  form.valore = item.valore
  form.riferimento = item.riferimento || ''
  form.data_fattura = item.data_fattura || ''
  form.ammortamento = item.ammortamento
  form.note = item.note || ''
  showModal.value = true
}

// Close modal
function closeModal() {
  showModal.value = false
  editingItem.value = null
}

// Save item
async function saveItem() {
  saving.value = true
  try {
    const payload = {
      data: form.data,
      intestatario: form.intestatario,
      tipo_pagamento: form.tipo_pagamento || null,
      valore: form.valore,
      riferimento: form.riferimento || null,
      data_fattura: form.data_fattura || null,
      ammortamento: form.ammortamento,
      note: form.note || null,
    }

    let response
    if (editingItem.value) {
      response = await fetchApi<any>(`/memo-economici/${editingItem.value.id}`, {
        method: 'PUT',
        body: payload,
      })
    } else {
      response = await fetchApi<any>('/memo-economici', {
        method: 'POST',
        body: payload,
      })
    }

    if (response.success) {
      closeModal()
      await loadData(meta.value.current_page)
      await loadTipiPagamento()
    } else {
      alert(response.error || 'Errore nel salvataggio')
    }
  } catch (e: any) {
    alert(e.message || 'Errore di connessione')
  } finally {
    saving.value = false
  }
}

// Confirm delete
function confirmDelete(item: MemoEconomico) {
  deletingItem.value = item
  showDeleteModal.value = true
}

// Delete item
async function deleteItem() {
  if (!deletingItem.value) return
  deleting.value = true
  try {
    const response = await fetchApi<any>(`/memo-economici/${deletingItem.value.id}`, {
      method: 'DELETE',
    })
    if (response.success) {
      showDeleteModal.value = false
      deletingItem.value = null
      await loadData(meta.value.current_page)
    } else {
      alert(response.error || 'Errore nell\'eliminazione')
    }
  } catch (e: any) {
    alert(e.message || 'Errore di connessione')
  } finally {
    deleting.value = false
  }
}

// Formatters
function formatDate(date: string | null | undefined): string {
  if (!date) return '-'
  const d = new Date(date)
  const day = String(d.getDate()).padStart(2, '0')
  const month = String(d.getMonth() + 1).padStart(2, '0')
  const year = d.getFullYear()
  return `${day}-${month}-${year}`
}

function formatCurrency(value: number | null | undefined): string {
  if (value == null) return '-'
  return new Intl.NumberFormat('it-IT', { style: 'currency', currency: 'EUR' }).format(value)
}

function getTipoPagamentoBadge(tipo: string | null): string {
  if (!tipo) return 'bg-gray-100 text-gray-600'
  const badges: Record<string, string> = {
    'Bonifico': 'bg-blue-100 text-blue-800',
    'Contanti': 'bg-green-100 text-green-800',
    'Carta': 'bg-purple-100 text-purple-800',
    'PayPal': 'bg-indigo-100 text-indigo-800',
    'Assegno': 'bg-yellow-100 text-yellow-800',
    'RID': 'bg-orange-100 text-orange-800',
  }
  return badges[tipo] || 'bg-gray-100 text-gray-600'
}

onMounted(() => {
  loadData()
  loadTipiPagamento()
})
</script>

<style scoped>
.btn-primary {
  @apply px-4 py-2 bg-cyan-600 text-white rounded-lg hover:bg-cyan-700 disabled:opacity-50 disabled:cursor-not-allowed;
}
.btn-secondary {
  @apply px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200;
}
.btn-danger {
  @apply px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed;
}
.input-field {
  @apply px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500;
}
</style>
