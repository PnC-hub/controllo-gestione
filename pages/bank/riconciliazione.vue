<template>
  <div>
    <div class="card mb-6">
      <div class="card-header flex justify-between items-center">
        <h2 class="card-title">
          <i class="fas fa-check-double mr-2 text-cyan-600"></i>
          <span>Riconciliazione Bancaria</span>
        </h2>
        <div class="flex items-center space-x-4">
          <NuxtLink to="/bank" class="text-cyan-600 hover:text-cyan-800">
            <i class="fas fa-arrow-left mr-1"></i> Dashboard
          </NuxtLink>
        </div>
      </div>
      <div class="card-content">
        <!-- Statistiche -->
        <div class="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
          <div class="bg-blue-50 rounded-lg p-4 text-center">
            <div class="text-2xl font-bold text-blue-700">{{ stats.total_credits }}</div>
            <div class="text-sm text-blue-600">Entrate Totali</div>
          </div>
          <div class="bg-green-50 rounded-lg p-4 text-center">
            <div class="text-2xl font-bold text-green-700">{{ stats.matched }}</div>
            <div class="text-sm text-green-600">Riconciliate</div>
          </div>
          <div class="bg-yellow-50 rounded-lg p-4 text-center">
            <div class="text-2xl font-bold text-yellow-700">{{ stats.unmatched }}</div>
            <div class="text-sm text-yellow-600">Da Riconciliare</div>
          </div>
          <div class="bg-purple-50 rounded-lg p-4 text-center">
            <div class="text-2xl font-bold text-purple-700">{{ stats.auto_matched }}</div>
            <div class="text-sm text-purple-600">Auto Match</div>
          </div>
          <div class="bg-cyan-50 rounded-lg p-4 text-center">
            <div class="text-2xl font-bold text-cyan-700">{{ stats.match_rate }}%</div>
            <div class="text-sm text-cyan-600">Tasso Match</div>
          </div>
        </div>

        <!-- Filtri e Azioni -->
        <div class="flex flex-wrap items-center justify-between gap-4 mb-6">
          <div class="flex items-center space-x-4">
            <select v-model="filters.bank_account_id" class="input-field w-48" @change="loadData()">
              <option value="">Tutti i conti</option>
              <option v-for="a in accounts" :key="a.id" :value="a.id">{{ a.name }}</option>
            </select>
            <select v-model="filters.status" class="input-field w-40" @change="loadTransactions()">
              <option value="unmatched">Da riconciliare</option>
              <option value="all">Tutte</option>
              <option value="auto_matched">Auto match</option>
              <option value="manual_matched">Match manuali</option>
            </select>
          </div>
          <div class="flex items-center space-x-3">
            <button @click="runAutoReconcile" :disabled="autoReconciling" class="btn-secondary">
              <i :class="autoReconciling ? 'fas fa-spinner fa-spin' : 'fas fa-magic'" class="mr-2"></i>
              Riconciliazione Auto
            </button>
          </div>
        </div>

        <!-- Lista Transazioni da Riconciliare -->
        <div v-if="loading" class="text-center py-8">
          <i class="fas fa-spinner fa-spin text-4xl text-cyan-600"></i>
        </div>

        <div v-else-if="transactions.length === 0" class="text-center py-12 text-gray-500">
          <i class="fas fa-check-circle text-5xl mb-4 text-green-400"></i>
          <p>Nessuna transazione da riconciliare</p>
        </div>

        <div v-else class="space-y-4">
          <div
            v-for="tx in transactions"
            :key="tx.id"
            class="border rounded-lg p-4 hover:shadow-md transition-shadow"
            :class="tx.match_status !== 'unmatched' ? 'bg-green-50 border-green-200' : 'bg-white'"
          >
            <div class="flex items-start justify-between">
              <div class="flex-1">
                <div class="flex items-center space-x-3 mb-2">
                  <span class="text-sm text-gray-500">{{ formatDate(tx.transaction_date) }}</span>
                  <span class="text-lg font-bold text-green-600">+{{ formatCurrency(tx.amount) }}</span>
                  <span v-if="tx.match_status !== 'unmatched'" class="px-2 py-0.5 rounded text-xs" :class="getStatusClass(tx.match_status)">
                    {{ getStatusLabel(tx.match_status) }}
                  </span>
                </div>
                <p class="text-gray-800 font-medium">{{ tx.description || tx.original_description }}</p>
                <p v-if="tx.counterparty" class="text-sm text-gray-500 mt-1">
                  <i class="fas fa-user mr-1"></i> {{ tx.counterparty }}
                </p>
              </div>
              <div class="flex items-center space-x-2">
                <button
                  v-if="tx.match_status === 'unmatched'"
                  @click="openMatchModal(tx)"
                  class="btn-primary-sm"
                >
                  <i class="fas fa-link mr-1"></i> Collega
                </button>
                <button
                  v-else
                  @click="removeMatch(tx)"
                  class="btn-danger-sm"
                  title="Rimuovi collegamento"
                >
                  <i class="fas fa-unlink"></i>
                </button>
              </div>
            </div>

            <!-- Info match se presente -->
            <div v-if="tx.matched_pagamento_id" class="mt-3 pt-3 border-t border-green-200">
              <div class="flex items-center text-sm text-green-700">
                <i class="fas fa-check-circle mr-2"></i>
                <span>Collegato a pagamento #{{ tx.matched_pagamento_id }}</span>
                <span v-if="tx.match_confidence" class="ml-2 text-xs bg-green-100 px-2 py-0.5 rounded">
                  {{ tx.match_confidence }}% confidenza
                </span>
              </div>
            </div>
          </div>
        </div>

        <!-- Paginazione -->
        <div v-if="pagination.pages > 1" class="flex justify-center mt-6">
          <div class="flex items-center space-x-2">
            <button @click="changePage(pagination.page - 1)" :disabled="pagination.page === 1" class="btn-page">
              <i class="fas fa-chevron-left"></i>
            </button>
            <span class="text-sm text-gray-600">
              Pagina {{ pagination.page }} di {{ pagination.pages }}
            </span>
            <button @click="changePage(pagination.page + 1)" :disabled="pagination.page === pagination.pages" class="btn-page">
              <i class="fas fa-chevron-right"></i>
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal Ricerca Match -->
    <div v-if="showMatchModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div class="bg-white rounded-lg shadow-xl max-w-3xl w-full max-h-[80vh] overflow-hidden">
        <div class="px-6 py-4 border-b flex justify-between items-center">
          <h3 class="text-lg font-semibold">
            <i class="fas fa-search mr-2 text-cyan-600"></i>
            Trova Pagamento Corrispondente
          </h3>
          <button @click="closeMatchModal" class="text-gray-500 hover:text-gray-700">
            <i class="fas fa-times"></i>
          </button>
        </div>

        <div class="p-6">
          <!-- Info transazione -->
          <div class="bg-blue-50 rounded-lg p-4 mb-6">
            <div class="text-sm text-gray-600 mb-1">Transazione da collegare:</div>
            <div class="flex items-center justify-between">
              <div>
                <span class="font-bold text-green-600 text-xl">+{{ formatCurrency(selectedTransaction?.amount) }}</span>
                <span class="text-gray-500 ml-3">{{ formatDate(selectedTransaction?.transaction_date) }}</span>
              </div>
            </div>
            <p class="text-sm text-gray-700 mt-2">{{ selectedTransaction?.description }}</p>
          </div>

          <!-- Loading matches -->
          <div v-if="loadingMatches" class="text-center py-8">
            <i class="fas fa-spinner fa-spin text-2xl text-cyan-600"></i>
            <p class="text-gray-500 mt-2">Cercando pagamenti corrispondenti...</p>
          </div>

          <!-- Lista match -->
          <div v-else-if="possibleMatches.length > 0" class="space-y-3 max-h-80 overflow-y-auto">
            <div
              v-for="match in possibleMatches"
              :key="match.pagamento_id"
              class="border rounded-lg p-4 hover:border-cyan-500 cursor-pointer transition-all"
              :class="match.confidence >= 80 ? 'border-green-300 bg-green-50' : ''"
              @click="confirmMatchSelection(match)"
            >
              <div class="flex items-center justify-between">
                <div>
                  <div class="flex items-center space-x-3">
                    <span class="font-bold">{{ match.paziente_cognome }} {{ match.paziente_nome }}</span>
                    <span class="text-green-600 font-semibold">{{ formatCurrency(match.importo) }}</span>
                  </div>
                  <div class="text-sm text-gray-500 mt-1">
                    <span v-if="match.data_incasso">Incasso: {{ formatDate(match.data_incasso) }}</span>
                    <span v-if="match.modalita" class="ml-3 capitalize">{{ match.modalita }}</span>
                  </div>
                </div>
                <div class="text-right">
                  <div class="text-lg font-bold" :class="getConfidenceColor(match.confidence)">
                    {{ match.confidence }}%
                  </div>
                  <div class="text-xs text-gray-500">confidenza</div>
                </div>
              </div>
            </div>
          </div>

          <div v-else class="text-center py-8 text-gray-500">
            <i class="fas fa-search text-4xl mb-2"></i>
            <p>Nessun pagamento corrispondente trovato</p>
            <p class="text-sm">Prova a verificare manualmente nella sezione Pagamenti</p>
          </div>
        </div>

        <div class="px-6 py-4 border-t bg-gray-50 flex justify-end">
          <button @click="closeMatchModal" class="btn-secondary">
            Annulla
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
const autoReconciling = ref(false)
const loadingMatches = ref(false)

const accounts = ref<any[]>([])
const transactions = ref<any[]>([])
const stats = ref({
  total_credits: 0,
  matched: 0,
  unmatched: 0,
  auto_matched: 0,
  manual_matched: 0,
  match_rate: 0
})
const pagination = ref({ page: 1, pages: 1, total: 0 })

const filters = reactive({
  bank_account_id: '',
  status: 'unmatched'
})

// Modal
const showMatchModal = ref(false)
const selectedTransaction = ref<any>(null)
const possibleMatches = ref<any[]>([])

const formatCurrency = (v: any) => new Intl.NumberFormat('it-IT', { style: 'currency', currency: 'EUR' }).format(parseFloat(v) || 0)
const formatDate = (d: string) => { if (!d) return '-'; const date = new Date(d); return `${String(date.getDate()).padStart(2, '0')}-${String(date.getMonth() + 1).padStart(2, '0')}-${date.getFullYear()}`; }

const getStatusClass = (status: string) => {
  switch (status) {
    case 'auto_matched': return 'bg-purple-100 text-purple-700'
    case 'manual_matched': return 'bg-blue-100 text-blue-700'
    case 'confirmed': return 'bg-green-100 text-green-700'
    default: return 'bg-gray-100 text-gray-700'
  }
}

const getStatusLabel = (status: string) => {
  switch (status) {
    case 'auto_matched': return 'Auto'
    case 'manual_matched': return 'Manuale'
    case 'confirmed': return 'Confermato'
    default: return status
  }
}

const getConfidenceColor = (confidence: number) => {
  if (confidence >= 80) return 'text-green-600'
  if (confidence >= 60) return 'text-yellow-600'
  return 'text-red-600'
}

const loadAccounts = async () => {
  try {
    const res = await fetchApi<any>('/bank/accounts')
    if (res.success) {
      accounts.value = res.data || []
    }
  } catch (e) {
    console.error('Errore caricamento conti:', e)
  }
}

const loadStats = async () => {
  try {
    let url = '/bank/reconcile/stats'
    if (filters.bank_account_id) {
      url += `?bank_account_id=${filters.bank_account_id}`
    }
    const res = await fetchApi<any>(url)
    if (res.success) {
      stats.value = res.data
    }
  } catch (e) {
    console.error('Errore caricamento statistiche:', e)
  }
}

const loadTransactions = async (page = 1) => {
  loading.value = true
  try {
    let url = `/bank/transactions?type=credit&is_transfer=0&page=${page}&limit=20`
    if (filters.bank_account_id) {
      url += `&bank_account_id=${filters.bank_account_id}`
    }
    if (filters.status !== 'all') {
      url += `&match_status=${filters.status}`
    }

    const res = await fetchApi<any>(url)
    if (res.success) {
      transactions.value = res.data || []
      pagination.value = res.pagination || { page: 1, pages: 1, total: 0 }
    }
  } catch (e) {
    console.error('Errore caricamento transazioni:', e)
  } finally {
    loading.value = false
  }
}

const loadData = async () => {
  await Promise.all([loadStats(), loadTransactions()])
}

const changePage = (page: number) => {
  if (page >= 1 && page <= pagination.value.pages) {
    loadTransactions(page)
  }
}

const runAutoReconcile = async () => {
  if (!confirm('Avviare la riconciliazione automatica? Le transazioni con alta confidenza verranno collegate automaticamente.')) return

  autoReconciling.value = true
  try {
    const res = await fetchApi<any>('/bank/reconcile/auto', {
      method: 'POST',
      body: JSON.stringify({
        bank_account_id: filters.bank_account_id || null,
        min_confidence: 80
      })
    })

    if (res.success) {
      alert(`Riconciliazione completata: ${res.data.matched} transazioni collegate`)
      await loadData()
    } else {
      alert(res.message || 'Errore durante riconciliazione')
    }
  } catch (e: any) {
    alert(e.message || 'Errore durante riconciliazione')
  } finally {
    autoReconciling.value = false
  }
}

const openMatchModal = async (tx: any) => {
  selectedTransaction.value = tx
  showMatchModal.value = true
  loadingMatches.value = true
  possibleMatches.value = []

  try {
    const res = await fetchApi<any>(`/bank/transactions/${tx.id}/matches`)
    if (res.success) {
      possibleMatches.value = res.data || []
    }
  } catch (e) {
    console.error('Errore ricerca match:', e)
  } finally {
    loadingMatches.value = false
  }
}

const closeMatchModal = () => {
  showMatchModal.value = false
  selectedTransaction.value = null
  possibleMatches.value = []
}

const confirmMatchSelection = async (match: any) => {
  if (!selectedTransaction.value) return

  try {
    const res = await fetchApi<any>(`/bank/transactions/${selectedTransaction.value.id}/match`, {
      method: 'POST',
      body: JSON.stringify({ pagamento_id: match.pagamento_id })
    })

    if (res.success) {
      closeMatchModal()
      await loadData()
    } else {
      alert(res.message || 'Errore durante collegamento')
    }
  } catch (e: any) {
    alert(e.message || 'Errore durante collegamento')
  }
}

const removeMatch = async (tx: any) => {
  if (!confirm('Rimuovere il collegamento con questo pagamento?')) return

  try {
    const res = await fetchApi<any>(`/bank/transactions/${tx.id}/match`, {
      method: 'DELETE'
    })

    if (res.success) {
      await loadData()
    } else {
      alert(res.message || 'Errore durante rimozione')
    }
  } catch (e: any) {
    alert(e.message || 'Errore durante rimozione')
  }
}

onMounted(async () => {
  if (!centroStore.centroCorrente && centroStore.centri.length === 0) {
    await centroStore.fetchCentri()
  }
  await loadAccounts()
  await loadData()
})
</script>

<style scoped>
.card { @apply bg-white rounded-lg shadow; }
.card-header { @apply px-4 py-3 border-b border-gray-200; }
.card-title { @apply text-lg font-semibold text-gray-800 flex items-center; }
.card-content { @apply p-4; }
.input-field { @apply px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500; }
.btn-primary { @apply bg-cyan-600 text-white px-4 py-2 rounded-lg hover:bg-cyan-700 flex items-center; }
.btn-primary-sm { @apply bg-cyan-600 text-white px-3 py-1.5 rounded-lg hover:bg-cyan-700 text-sm flex items-center; }
.btn-secondary { @apply bg-gray-200 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-300 flex items-center; }
.btn-danger-sm { @apply bg-red-100 text-red-600 px-3 py-1.5 rounded-lg hover:bg-red-200 text-sm; }
.btn-page { @apply px-3 py-1 border rounded hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed; }
</style>
