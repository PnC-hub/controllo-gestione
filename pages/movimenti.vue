<template>
  <div>
    <div class="card">
      <div class="card-header flex justify-between items-center">
        <h2 class="card-title">
          <span>Movimenti Bancari</span>
        </h2>
        <div class="flex space-x-2">
          <button v-if="permissions.can_categorize" @click="applyRules" :disabled="applyingRules" class="btn-secondary text-sm">
            <i v-if="applyingRules" class="fas fa-spinner fa-spin mr-1"></i>
            <i v-else class="fas fa-magic mr-1"></i>
            Applica Regole
          </button>
          <NuxtLink v-if="permissions.can_import" to="/bank/import" class="btn-primary text-sm">
            <i class="fas fa-upload mr-1"></i> Import
          </NuxtLink>
        </div>
      </div>
      <div class="card-content">
        <!-- Filtri -->
        <div class="grid grid-cols-2 md:grid-cols-6 gap-4 mb-6">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Conto:</label>
            <select v-model="filters.bank_account_id" class="input-field" @change="loadTransactions()">
              <option value="">Tutti</option>
              <option v-for="a in accounts" :key="a.id" :value="a.id">{{ a.name }}</option>
            </select>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Tipo:</label>
            <select v-model="filters.type" class="input-field" @change="loadTransactions()">
              <option value="">Tutti</option>
              <option value="credit">Entrate</option>
              <option value="debit">Uscite</option>
            </select>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Categoria:</label>
            <select v-model="filters.category_id" class="input-field" @change="loadTransactions()">
              <option value="">Tutte</option>
              <option value="uncategorized">Non categorizzate</option>
              <option v-for="c in categories" :key="c.id" :value="c.id">{{ c.name }}</option>
            </select>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Da:</label>
            <input type="date" v-model="filters.date_from" class="input-field" @change="loadTransactions()" />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">A:</label>
            <input type="date" v-model="filters.date_to" class="input-field" @change="loadTransactions()" />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Cerca:</label>
            <input type="text" v-model="filters.search" class="input-field" placeholder="Descrizione..." @keyup.enter="loadTransactions()" />
          </div>
        </div>

        <!-- Azioni bulk -->
        <div v-if="permissions.can_categorize && selectedIds.length > 0" class="bg-cyan-50 border border-cyan-200 rounded-lg p-3 mb-4 flex items-center justify-between">
          <span class="text-cyan-700">{{ selectedIds.length }} transazioni selezionate</span>
          <div class="flex items-center space-x-2">
            <select v-model="bulkCategoryId" class="input-field py-1 w-48">
              <option value="">-- Assegna categoria --</option>
              <option v-for="c in categories" :key="c.id" :value="c.id">{{ c.name }}</option>
            </select>
            <button @click="bulkUpdateCategory" :disabled="!bulkCategoryId" class="btn-primary text-sm py-1">
              Applica
            </button>
            <button @click="selectedIds = []" class="text-gray-500 hover:text-gray-700">
              <i class="fas fa-times"></i>
            </button>
          </div>
        </div>

        <div v-if="loading" class="p-12 text-center">
          <i class="fas fa-spinner fa-spin text-4xl text-cyan-600 mb-4"></i>
          <p class="text-gray-500">Caricamento movimenti...</p>
        </div>

        <div v-else class="overflow-x-auto">
          <table class="min-w-full divide-y divide-gray-200">
            <thead class="bg-gray-50">
              <tr>
                <th class="px-2 py-3 text-center w-10">
                  <input type="checkbox" @change="toggleSelectAll" :checked="allSelected" />
                </th>
                <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Data</th>
                <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Conto</th>
                <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Descrizione</th>
                <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Controparte</th>
                <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Categoria</th>
                <th class="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">Importo</th>
                <th class="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase">Azioni</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-200">
              <tr v-if="transactions.length === 0">
                <td colspan="8" class="px-4 py-8 text-center text-gray-500">
                  Nessun movimento trovato
                </td>
              </tr>
              <tr v-for="tx in transactions" :key="tx.id" class="hover:bg-gray-50" :class="{ 'bg-yellow-50': tx.is_transfer }">
                <td class="px-2 py-3 text-center">
                  <input type="checkbox" :value="tx.id" v-model="selectedIds" />
                </td>
                <td class="px-4 py-3 text-sm whitespace-nowrap">{{ formatDate(tx.transaction_date) }}</td>
                <td class="px-4 py-3 text-sm">{{ tx.bank_account?.name }}</td>
                <td class="px-4 py-3 text-sm max-w-xs truncate" :title="tx.original_description">
                  {{ tx.description || tx.original_description }}
                  <span v-if="tx.is_transfer" class="ml-1 text-xs bg-blue-100 text-blue-700 px-1 rounded">Giroconto</span>
                </td>
                <td class="px-4 py-3 text-sm">{{ tx.counterparty || '-' }}</td>
                <td class="px-4 py-3 text-sm">
                  <select v-if="permissions.can_categorize" v-model="tx.category_id" @change="updateCategory(tx)" class="text-sm border-0 bg-transparent p-0 focus:ring-0">
                    <option :value="null">-- Nessuna --</option>
                    <option v-for="c in categories" :key="c.id" :value="c.id">{{ c.name }}</option>
                  </select>
                  <span v-else class="text-sm">{{ tx.category?.name || '-' }}</span>
                </td>
                <td class="px-4 py-3 text-sm text-right font-medium" :class="tx.type === 'credit' ? 'text-green-600' : 'text-red-600'">
                  {{ tx.type === 'credit' ? '+' : '-' }}{{ formatCurrency(tx.amount) }}
                </td>
                <td class="px-4 py-3 text-sm text-center">
                  <button @click="openDetail(tx)" class="text-cyan-600 hover:text-cyan-800 mr-2" title="Dettaglio">
                    <i class="fas fa-eye"></i>
                  </button>
                  <button v-if="permissions.can_reconcile && tx.type === 'credit' && !tx.is_transfer" @click="findMatches(tx)" class="text-blue-600 hover:text-blue-800" title="Riconcilia">
                    <i class="fas fa-link"></i>
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- Pagination -->
        <div v-if="pagination.total > 0" class="px-4 py-3 border-t border-gray-200 flex items-center justify-between">
          <p class="text-sm text-gray-500">
            Pagina {{ pagination.page }} di {{ pagination.pages }} ({{ pagination.total }} movimenti)
          </p>
          <div v-if="pagination.pages > 1" class="flex space-x-2">
            <button @click="loadTransactions(pagination.page - 1)" :disabled="pagination.page <= 1"
                    class="px-3 py-1 border rounded hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed">
              <i class="fas fa-chevron-left"></i>
            </button>
            <button @click="loadTransactions(pagination.page + 1)" :disabled="pagination.page >= pagination.pages"
                    class="px-3 py-1 border rounded hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed">
              <i class="fas fa-chevron-right"></i>
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal Dettaglio -->
    <div v-if="showDetailModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" @click.self="showDetailModal = false">
      <div class="bg-white rounded-lg shadow-xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        <div class="px-6 py-4 border-b flex justify-between items-center">
          <h3 class="text-lg font-semibold">Dettaglio Transazione</h3>
          <button @click="showDetailModal = false" class="text-gray-400 hover:text-gray-600">
            <i class="fas fa-times"></i>
          </button>
        </div>
        <div class="p-6" v-if="selectedTx">
          <div class="grid grid-cols-2 gap-4 mb-4">
            <div>
              <label class="text-sm text-gray-500">Data</label>
              <p class="font-medium">{{ formatDate(selectedTx.transaction_date) }}</p>
            </div>
            <div>
              <label class="text-sm text-gray-500">Importo</label>
              <p class="font-medium" :class="selectedTx.type === 'credit' ? 'text-green-600' : 'text-red-600'">
                {{ selectedTx.type === 'credit' ? '+' : '-' }}{{ formatCurrency(selectedTx.amount) }}
              </p>
            </div>
          </div>
          <div class="mb-4">
            <label class="text-sm text-gray-500">Descrizione Originale</label>
            <p class="font-medium text-sm bg-gray-50 p-2 rounded">{{ selectedTx.original_description }}</p>
          </div>
          <div class="grid grid-cols-2 gap-4 mb-4">
            <div>
              <label class="text-sm text-gray-500">Controparte</label>
              <input type="text" v-model="selectedTx.counterparty" class="input-field" />
            </div>
            <div>
              <label class="text-sm text-gray-500">Categoria</label>
              <select v-model="selectedTx.category_id" class="input-field">
                <option :value="null">-- Nessuna --</option>
                <option v-for="c in categories" :key="c.id" :value="c.id">{{ c.name }}</option>
              </select>
            </div>
          </div>
          <div class="mb-4">
            <label class="flex items-center">
              <input type="checkbox" v-model="selectedTx.is_transfer" class="mr-2" />
              <span class="text-sm">Questo e' un giroconto</span>
            </label>
          </div>
          <div class="mb-4">
            <label class="text-sm text-gray-500">Note</label>
            <textarea v-model="selectedTx.notes" class="input-field" rows="2"></textarea>
          </div>
          <div class="flex justify-end space-x-2">
            <button @click="showDetailModal = false" class="btn-secondary">Annulla</button>
            <button @click="saveTransaction" class="btn-primary">Salva</button>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal Match -->
    <div v-if="showMatchModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" @click.self="showMatchModal = false">
      <div class="bg-white rounded-lg shadow-xl max-w-3xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        <div class="px-6 py-4 border-b flex justify-between items-center">
          <h3 class="text-lg font-semibold">Riconcilia Pagamento</h3>
          <button @click="showMatchModal = false" class="text-gray-400 hover:text-gray-600">
            <i class="fas fa-times"></i>
          </button>
        </div>
        <div class="p-6">
          <div v-if="loadingMatches" class="text-center py-8">
            <i class="fas fa-spinner fa-spin text-2xl text-cyan-600"></i>
          </div>
          <div v-else-if="matches.length === 0" class="text-center py-8 text-gray-500">
            Nessun pagamento corrispondente trovato
          </div>
          <div v-else>
            <p class="text-sm text-gray-600 mb-4">Seleziona il pagamento da associare:</p>
            <div class="space-y-2">
              <div v-for="m in matches" :key="m.pagamento_id"
                   class="border rounded-lg p-3 cursor-pointer hover:border-cyan-500 transition-colors"
                   :class="{ 'border-cyan-500 bg-cyan-50': selectedMatchId === m.pagamento_id }"
                   @click="selectedMatchId = m.pagamento_id">
                <div class="flex justify-between items-start">
                  <div>
                    <p class="font-medium">{{ m.paziente_cognome }} {{ m.paziente_nome }}</p>
                    <p class="text-sm text-gray-500">{{ formatCurrency(m.importo) }} - {{ m.modalita }}</p>
                  </div>
                  <div class="text-right">
                    <span class="text-sm" :class="m.confidence >= 80 ? 'text-green-600' : m.confidence >= 50 ? 'text-yellow-600' : 'text-gray-500'">
                      {{ m.confidence }}% match
                    </span>
                    <p class="text-xs text-gray-400">{{ formatDate(m.data_incasso) }}</p>
                  </div>
                </div>
              </div>
            </div>
            <div class="mt-6 flex justify-end space-x-2">
              <button @click="showMatchModal = false" class="btn-secondary">Annulla</button>
              <button @click="confirmMatch" :disabled="!selectedMatchId" class="btn-primary">
                Conferma Match
              </button>
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
const applyingRules = ref(false)
const transactions = ref<any[]>([])
const accounts = ref<any[]>([])
const categories = ref<any[]>([])
const selectedIds = ref<number[]>([])
const bulkCategoryId = ref('')

const permissions = ref<any>({
  role: 'viewer',
  can_import: false,
  can_categorize: false,
  can_reconcile: false,
  can_delete: false,
  can_manage_accounts: false,
  can_manage_rules: false,
  is_owner_or_admin: false
})

const showDetailModal = ref(false)
const selectedTx = ref<any>(null)

const showMatchModal = ref(false)
const loadingMatches = ref(false)
const matches = ref<any[]>([])
const matchingTxId = ref<number | null>(null)
const selectedMatchId = ref<number | null>(null)

const pagination = reactive({
  page: 1,
  pages: 1,
  total: 0
})

const filters = reactive({
  bank_account_id: '',
  type: '',
  category_id: '',
  date_from: new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString().split('T')[0],
  date_to: new Date().toISOString().split('T')[0],
  search: ''
})

const allSelected = computed(() =>
  transactions.value.length > 0 &&
  transactions.value.every(tx => selectedIds.value.includes(tx.id))
)

const formatCurrency = (v: any) => new Intl.NumberFormat('it-IT', { style: 'currency', currency: 'EUR' }).format(parseFloat(v) || 0)
const formatDate = (d: string) => { if (!d) return '-'; const date = new Date(d); return `${String(date.getDate()).padStart(2, '0')}-${String(date.getMonth() + 1).padStart(2, '0')}-${date.getFullYear()}`; }

const toggleSelectAll = () => {
  if (allSelected.value) {
    selectedIds.value = []
  } else {
    selectedIds.value = transactions.value.map(tx => tx.id)
  }
}

const loadAccounts = async () => {
  try {
    const res = await fetchApi<any>('/bank/accounts')
    if (res.success) accounts.value = res.data || []
  } catch (e) {
    console.error('Errore caricamento conti:', e)
  }
}

const loadCategories = async () => {
  try {
    const res = await fetchApi<any>('/bank/categories')
    if (res.success) categories.value = res.data || []
  } catch (e) {
    console.error('Errore caricamento categorie:', e)
  }
}

const loadPermissions = async () => {
  try {
    const res = await fetchApi<any>('/bank/permissions')
    if (res.success) permissions.value = res.data || {}
  } catch (e) {
    console.error('Errore caricamento permessi:', e)
  }
}

const loadTransactions = async (page = 1) => {
  loading.value = true
  selectedIds.value = []
  try {
    let url = `/bank/transactions?page=${page}&limit=50`
    if (filters.bank_account_id) url += `&bank_account_id=${filters.bank_account_id}`
    if (filters.type) url += `&type=${filters.type}`
    if (filters.category_id === 'uncategorized') {
      url += `&uncategorized=1`
    } else if (filters.category_id) {
      url += `&category_id=${filters.category_id}`
    }
    if (filters.date_from) url += `&date_from=${filters.date_from}`
    if (filters.date_to) url += `&date_to=${filters.date_to}`
    if (filters.search) url += `&search=${encodeURIComponent(filters.search)}`

    const res = await fetchApi<any>(url)
    if (res.success) {
      transactions.value = res.data || []
      if (res.pagination) {
        pagination.page = res.pagination.page
        pagination.pages = res.pagination.pages
        pagination.total = res.pagination.total
      }
    }
  } catch (e) {
    console.error('Errore caricamento transazioni:', e)
  } finally {
    loading.value = false
  }
}

const updateCategory = async (tx: any) => {
  try {
    await fetchApi(`/bank/transactions/${tx.id}`, {
      method: 'PUT',
      body: JSON.stringify({ category_id: tx.category_id })
    })
  } catch (e) {
    console.error('Errore aggiornamento categoria:', e)
  }
}

const bulkUpdateCategory = async () => {
  if (!bulkCategoryId.value || selectedIds.value.length === 0) return

  try {
    await fetchApi('/bank/transactions/bulk-category', {
      method: 'POST',
      body: JSON.stringify({
        transaction_ids: selectedIds.value,
        category_id: parseInt(bulkCategoryId.value)
      })
    })
    await loadTransactions(pagination.page)
    selectedIds.value = []
    bulkCategoryId.value = ''
  } catch (e) {
    console.error('Errore aggiornamento bulk:', e)
  }
}

const applyRules = async () => {
  applyingRules.value = true
  try {
    const res = await fetchApi<any>('/bank/rules/apply', { method: 'POST' })
    if (res.success) {
      alert(`Regole applicate: ${res.data.applied} transazioni categorizzate`)
      await loadTransactions(pagination.page)
    }
  } catch (e) {
    console.error('Errore applicazione regole:', e)
  } finally {
    applyingRules.value = false
  }
}

const openDetail = (tx: any) => {
  selectedTx.value = { ...tx }
  showDetailModal.value = true
}

const saveTransaction = async () => {
  if (!selectedTx.value) return

  try {
    await fetchApi(`/bank/transactions/${selectedTx.value.id}`, {
      method: 'PUT',
      body: JSON.stringify({
        category_id: selectedTx.value.category_id,
        counterparty: selectedTx.value.counterparty,
        is_transfer: selectedTx.value.is_transfer,
        notes: selectedTx.value.notes
      })
    })
    showDetailModal.value = false
    await loadTransactions(pagination.page)
  } catch (e) {
    console.error('Errore salvataggio:', e)
  }
}

const findMatches = async (tx: any) => {
  matchingTxId.value = tx.id
  selectedMatchId.value = null
  showMatchModal.value = true
  loadingMatches.value = true

  try {
    const res = await fetchApi<any>(`/bank/transactions/${tx.id}/matches`)
    if (res.success) {
      matches.value = res.data || []
    }
  } catch (e) {
    console.error('Errore ricerca match:', e)
  } finally {
    loadingMatches.value = false
  }
}

const confirmMatch = async () => {
  if (!matchingTxId.value || !selectedMatchId.value) return

  try {
    await fetchApi(`/bank/transactions/${matchingTxId.value}/match`, {
      method: 'POST',
      body: JSON.stringify({ pagamento_id: selectedMatchId.value })
    })
    showMatchModal.value = false
    await loadTransactions(pagination.page)
  } catch (e) {
    console.error('Errore conferma match:', e)
  }
}

onMounted(async () => {
  if (!centroStore.centroCorrente && centroStore.centri.length === 0) {
    await centroStore.fetchCentri()
  }
  await Promise.all([loadAccounts(), loadCategories(), loadPermissions()])
  await loadTransactions()
})
</script>

<style scoped>
.card { @apply bg-white rounded-lg shadow; }
.card-header { @apply px-4 py-3 border-b border-gray-200; }
.card-title { @apply text-lg font-semibold text-gray-800 flex items-center; }
.card-content { @apply p-4; }
.input-field { @apply w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500; }
.btn-primary { @apply bg-cyan-600 text-white px-4 py-2 rounded-lg hover:bg-cyan-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center; }
.btn-secondary { @apply bg-gray-200 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-300 flex items-center; }
</style>
