<template>
  <div>
    <div class="card">
      <div class="card-header flex justify-between items-center">
        <h2 class="card-title">
          <span>Import Movimenti Bancari</span>
        </h2>
        <NuxtLink to="/bank" class="text-cyan-600 hover:text-cyan-800">
          <i class="fas fa-arrow-left mr-1"></i> Torna alla Dashboard
        </NuxtLink>
      </div>
      <div class="card-content">
        <!-- Step 1: Selezione conto e file -->
        <div v-if="step === 1" class="max-w-2xl mx-auto">
          <div class="mb-6">
            <label class="block text-sm font-medium text-gray-700 mb-2">Seleziona Conto Bancario *</label>
            <select v-model="form.bank_account_id" class="input-field">
              <option value="">-- Seleziona conto --</option>
              <option v-for="a in accounts" :key="a.id" :value="a.id">{{ a.name }} ({{ a.bank_name }})</option>
            </select>
          </div>

          <div class="mb-6">
            <label class="block text-sm font-medium text-gray-700 mb-2">File CSV o XLSX *</label>
            <div class="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-cyan-500 transition-colors">
              <input type="file" ref="fileInput" accept=".csv,.txt,.xlsx,.xlsm" @change="handleFileSelect" class="hidden" />
              <div v-if="!form.file" @click="$refs.fileInput.click()" class="cursor-pointer">
                <i class="fas fa-cloud-upload-alt text-4xl text-gray-400 mb-2"></i>
                <p class="text-gray-600">Clicca per selezionare un file CSV o XLSX</p>
                <p class="text-sm text-gray-400 mt-1">Formati supportati: CSV (Fineco, UniCredit), Excel XLSX</p>
              </div>
              <div v-else class="flex items-center justify-center">
                <i :class="getFileIcon(form.file.name)" class="text-2xl text-green-600 mr-2"></i>
                <span class="font-medium">{{ form.file.name }}</span>
                <button @click="form.file = null" class="ml-4 text-red-500 hover:text-red-700">
                  <i class="fas fa-times"></i>
                </button>
              </div>
            </div>
          </div>

          <div class="mb-6">
            <label class="block text-sm font-medium text-gray-700 mb-2">Formato (opzionale)</label>
            <select v-model="form.source" class="input-field">
              <option value="">Auto-detect</option>
              <option value="fineco">Fineco</option>
              <option value="unicredit">UniCredit</option>
            </select>
            <p class="text-sm text-gray-500 mt-1">Lascia vuoto per rilevamento automatico</p>
          </div>

          <div class="flex justify-end">
            <button @click="previewImport" :disabled="!canPreview || previewing" class="btn-primary">
              <i v-if="previewing" class="fas fa-spinner fa-spin mr-2"></i>
              <i v-else class="fas fa-search mr-2"></i>
              Anteprima Import
            </button>
          </div>
        </div>

        <!-- Step 2: Anteprima -->
        <div v-if="step === 2">
          <div class="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
            <h3 class="font-semibold text-blue-800 mb-2">Riepilogo Import</h3>
            <div class="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
              <div>
                <span class="text-gray-600">Formato rilevato:</span>
                <span class="font-medium ml-1 capitalize">{{ preview.source_detected }}</span>
                <span v-if="preview.original_format === 'xlsx'" class="ml-1 text-xs bg-green-100 text-green-700 px-1 rounded">XLSX</span>
              </div>
              <div>
                <span class="text-gray-600">Totale righe:</span>
                <span class="font-medium ml-1">{{ preview.total_rows }}</span>
              </div>
              <div>
                <span class="text-gray-600">Nuove transazioni:</span>
                <span class="font-medium ml-1 text-green-600">{{ preview.new_transactions }}</span>
              </div>
              <div>
                <span class="text-gray-600">Duplicati:</span>
                <span class="font-medium ml-1 text-yellow-600">{{ preview.duplicates }}</span>
              </div>
            </div>
            <div class="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm mt-3">
              <div>
                <span class="text-gray-600">Entrate:</span>
                <span class="font-medium ml-1 text-green-600">{{ formatCurrency(preview.total_credits) }}</span>
              </div>
              <div>
                <span class="text-gray-600">Uscite:</span>
                <span class="font-medium ml-1 text-red-600">{{ formatCurrency(preview.total_debits) }}</span>
              </div>
              <div>
                <span class="text-gray-600">Periodo:</span>
                <span class="font-medium ml-1">{{ formatDate(preview.date_range?.min) }} - {{ formatDate(preview.date_range?.max) }}</span>
              </div>
            </div>
          </div>

          <!-- Anteprima transazioni -->
          <div v-if="preview.sample?.length" class="mb-6">
            <h4 class="font-medium text-gray-700 mb-2">Anteprima transazioni (prime 5)</h4>
            <div class="overflow-x-auto">
              <table class="min-w-full divide-y divide-gray-200">
                <thead class="bg-gray-50">
                  <tr>
                    <th class="px-4 py-2 text-left text-xs font-medium text-gray-500">Data</th>
                    <th class="px-4 py-2 text-left text-xs font-medium text-gray-500">Descrizione</th>
                    <th class="px-4 py-2 text-left text-xs font-medium text-gray-500">Controparte</th>
                    <th class="px-4 py-2 text-right text-xs font-medium text-gray-500">Importo</th>
                  </tr>
                </thead>
                <tbody class="divide-y divide-gray-200">
                  <tr v-for="(tx, i) in preview.sample" :key="i">
                    <td class="px-4 py-2 text-sm">{{ formatDate(tx.transaction_date) }}</td>
                    <td class="px-4 py-2 text-sm">{{ tx.description }}</td>
                    <td class="px-4 py-2 text-sm">{{ tx.counterparty || '-' }}</td>
                    <td class="px-4 py-2 text-sm text-right" :class="tx.type === 'credit' ? 'text-green-600' : 'text-red-600'">
                      {{ tx.type === 'credit' ? '+' : '-' }}{{ formatCurrency(tx.amount) }}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <div class="flex justify-between">
            <button @click="step = 1" class="btn-secondary">
              <i class="fas fa-arrow-left mr-2"></i> Indietro
            </button>
            <button @click="executeImport" :disabled="importing || preview.new_transactions === 0" class="btn-primary">
              <i v-if="importing" class="fas fa-spinner fa-spin mr-2"></i>
              <i v-else class="fas fa-check mr-2"></i>
              Conferma Import ({{ preview.new_transactions }} transazioni)
            </button>
          </div>
        </div>

        <!-- Step 3: Risultato -->
        <div v-if="step === 3" class="max-w-2xl mx-auto">
          <!-- Success / Partial Success -->
          <div v-if="result.success" :class="result.status === 'partial_success' ? 'bg-yellow-50 border-yellow-200' : 'bg-green-50 border-green-200'" class="border rounded-lg p-6 mb-6">
            <div class="text-center mb-4">
              <i :class="result.status === 'partial_success' ? 'fas fa-exclamation-triangle text-yellow-600' : 'fas fa-check-circle text-green-600'" class="text-5xl mb-4"></i>
              <h3 class="text-xl font-semibold" :class="result.status === 'partial_success' ? 'text-yellow-800' : 'text-green-800'">
                {{ result.status === 'partial_success' ? 'Import Parziale' : 'Import Completato!' }}
              </h3>
            </div>

            <!-- Summary Grid -->
            <div class="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
              <div class="bg-white rounded-lg p-3 text-center shadow-sm">
                <div class="text-2xl font-bold text-gray-800">{{ result.total_rows || 0 }}</div>
                <div class="text-xs text-gray-500">Righe Totali</div>
              </div>
              <div class="bg-white rounded-lg p-3 text-center shadow-sm">
                <div class="text-2xl font-bold text-green-600">{{ result.imported || 0 }}</div>
                <div class="text-xs text-gray-500">Importate</div>
              </div>
              <div class="bg-white rounded-lg p-3 text-center shadow-sm">
                <div class="text-2xl font-bold text-yellow-600">{{ result.duplicates || 0 }}</div>
                <div class="text-xs text-gray-500">Duplicati</div>
              </div>
              <div class="bg-white rounded-lg p-3 text-center shadow-sm">
                <div class="text-2xl font-bold text-red-600">{{ result.failed || 0 }}</div>
                <div class="text-xs text-gray-500">Falliti</div>
              </div>
            </div>

            <!-- File type badge -->
            <div class="text-center mt-4">
              <span class="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">
                Formato: {{ result.source_detected?.toUpperCase() }} ({{ result.file_type?.toUpperCase() || 'CSV' }})
              </span>
            </div>
          </div>

          <!-- Error -->
          <div v-else class="bg-red-50 border border-red-200 rounded-lg p-8 text-center">
            <i class="fas fa-times-circle text-5xl text-red-600 mb-4"></i>
            <h3 class="text-xl font-semibold text-red-800 mb-2">Errore Import</h3>
            <p class="text-gray-600">{{ result.message }}</p>
          </div>

          <!-- Errors list if any -->
          <div v-if="result.errors?.length > 0" class="bg-red-50 border border-red-200 rounded-lg p-4 mt-4">
            <h4 class="font-semibold text-red-800 mb-2">
              <i class="fas fa-exclamation-circle mr-2"></i>
              Errori ({{ result.errors.length }})
            </h4>
            <div class="max-h-40 overflow-y-auto text-sm">
              <div v-for="(err, idx) in result.errors.slice(0, 10)" :key="idx" class="py-1 border-b border-red-100 last:border-0">
                <span v-if="err.row" class="text-red-600 font-mono">Riga {{ err.row }}:</span>
                <span class="text-gray-700 ml-1">{{ err.error }}</span>
              </div>
              <div v-if="result.errors.length > 10" class="text-gray-500 pt-2">
                ... e altri {{ result.errors.length - 10 }} errori
              </div>
            </div>
          </div>

          <div class="mt-6 flex justify-center space-x-4">
            <button @click="resetForm" class="btn-secondary">
              <i class="fas fa-redo mr-2"></i> Nuovo Import
            </button>
            <NuxtLink to="/bank/movimenti" class="btn-primary">
              <i class="fas fa-list mr-2"></i> Vai ai Movimenti
            </NuxtLink>
          </div>
        </div>
      </div>
    </div>

    <!-- Storico Import -->
    <div class="card mt-6">
      <div class="card-header">
        <h2 class="card-title">Storico Import</h2>
      </div>
      <div class="card-content">
        <div v-if="loadingImports" class="text-center py-4">
          <i class="fas fa-spinner fa-spin text-cyan-600"></i>
        </div>
        <div v-else-if="imports.length === 0" class="text-center py-4 text-gray-500">
          Nessun import effettuato
        </div>
        <div v-else class="overflow-x-auto">
          <table class="min-w-full divide-y divide-gray-200">
            <thead class="bg-gray-50">
              <tr>
                <th class="px-4 py-2 text-left text-xs font-medium text-gray-500">Data</th>
                <th class="px-4 py-2 text-left text-xs font-medium text-gray-500">File</th>
                <th class="px-4 py-2 text-left text-xs font-medium text-gray-500">Conto</th>
                <th class="px-4 py-2 text-left text-xs font-medium text-gray-500">Formato</th>
                <th class="px-4 py-2 text-center text-xs font-medium text-gray-500">Importate</th>
                <th class="px-4 py-2 text-center text-xs font-medium text-gray-500">Duplicati</th>
                <th class="px-4 py-2 text-center text-xs font-medium text-gray-500">Stato</th>
                <th class="px-4 py-2 text-center text-xs font-medium text-gray-500">Azioni</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-200">
              <tr v-for="imp in imports" :key="imp.id">
                <td class="px-4 py-2 text-sm">{{ formatDateTime(imp.created_at) }}</td>
                <td class="px-4 py-2 text-sm">
                  <div class="flex items-center">
                    <i :class="getFileIcon(imp.filename)" class="mr-2 text-gray-400"></i>
                    {{ imp.filename }}
                  </div>
                </td>
                <td class="px-4 py-2 text-sm">{{ imp.bank_account?.name }}</td>
                <td class="px-4 py-2 text-sm">
                  <span class="capitalize">{{ imp.source }}</span>
                  <span v-if="imp.file_type" class="ml-1 text-xs text-gray-400">({{ imp.file_type?.toUpperCase() }})</span>
                </td>
                <td class="px-4 py-2 text-sm text-center">
                  {{ imp.imported_rows }}
                  <span v-if="imp.failed_rows > 0" class="text-red-500 text-xs ml-1">({{ imp.failed_rows }} err)</span>
                </td>
                <td class="px-4 py-2 text-sm text-center">{{ imp.duplicate_rows }}</td>
                <td class="px-4 py-2 text-sm text-center">
                  <span :class="statusClass(imp.status)" class="px-2 py-1 rounded text-xs">{{ formatStatus(imp.status) }}</span>
                </td>
                <td class="px-4 py-2 text-sm text-center">
                  <button v-if="imp.status === 'completed' || imp.status === 'partial_success'" @click="rollbackImport(imp.id)" class="text-red-600 hover:text-red-800" title="Annulla import">
                    <i class="fas fa-undo"></i>
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
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

const step = ref(1)
const accounts = ref<any[]>([])
const imports = ref<any[]>([])
const loadingImports = ref(false)
const previewing = ref(false)
const importing = ref(false)
const preview = ref<any>({})
const result = ref<any>({})

const form = reactive({
  bank_account_id: '',
  file: null as File | null,
  source: ''
})

const canPreview = computed(() => form.bank_account_id && form.file)

const formatCurrency = (v: any) => new Intl.NumberFormat('it-IT', { style: 'currency', currency: 'EUR' }).format(parseFloat(v) || 0)
const formatDate = (d: string) => { if (!d) return '-'; const date = new Date(d); return `${String(date.getDate()).padStart(2, '0')}-${String(date.getMonth() + 1).padStart(2, '0')}-${date.getFullYear()}`; }
const formatDateTime = (d: string) => {
  if (!d) return '-'
  const date = new Date(d)
  const day = String(date.getDate()).padStart(2, '0')
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const year = date.getFullYear()
  const hours = String(date.getHours()).padStart(2, '0')
  const minutes = String(date.getMinutes()).padStart(2, '0')
  return `${day}-${month}-${year} ${hours}:${minutes}`
}

const statusClass = (status: string) => {
  switch (status) {
    case 'completed': return 'bg-green-100 text-green-800'
    case 'partial_success': return 'bg-yellow-100 text-yellow-800'
    case 'failed': return 'bg-red-100 text-red-800'
    case 'processing': return 'bg-blue-100 text-blue-800'
    default: return 'bg-gray-100 text-gray-800'
  }
}

const formatStatus = (status: string) => {
  switch (status) {
    case 'completed': return 'Completato'
    case 'partial_success': return 'Parziale'
    case 'failed': return 'Fallito'
    case 'processing': return 'In corso'
    default: return status
  }
}

const getFileIcon = (filename: string) => {
  const ext = filename.split('.').pop()?.toLowerCase()
  if (ext === 'xlsx' || ext === 'xlsm') {
    return 'fas fa-file-excel'
  }
  return 'fas fa-file-csv'
}

const handleFileSelect = (e: Event) => {
  const target = e.target as HTMLInputElement
  if (target.files?.length) {
    form.file = target.files[0]
  }
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

const loadImports = async () => {
  loadingImports.value = true
  try {
    const res = await fetchApi<any>('/bank/imports?limit=20')
    if (res.success) {
      imports.value = res.data || []
    }
  } catch (e) {
    console.error('Errore caricamento import:', e)
  } finally {
    loadingImports.value = false
  }
}

const previewImport = async () => {
  if (!form.file) return

  previewing.value = true
  try {
    const formData = new FormData()
    formData.append('bank_account_id', form.bank_account_id)
    formData.append('file', form.file)
    if (form.source) formData.append('source', form.source)

    const res = await fetchApi<any>('/bank/import/preview', {
      method: 'POST',
      body: formData
    })

    if (res.success) {
      preview.value = res.data
      step.value = 2
    } else {
      alert(res.message || 'Errore durante anteprima')
    }
  } catch (e: any) {
    console.error('Errore anteprima:', e)
    alert(e.message || 'Errore durante anteprima')
  } finally {
    previewing.value = false
  }
}

const executeImport = async () => {
  if (!form.file) return

  importing.value = true
  try {
    const formData = new FormData()
    formData.append('bank_account_id', form.bank_account_id)
    formData.append('file', form.file)
    if (form.source) formData.append('source', form.source)

    const res = await fetchApi<any>('/bank/import', {
      method: 'POST',
      body: formData
    })

    result.value = res.success ? { success: true, ...res.data } : { success: false, message: res.message }
    step.value = 3
    await loadImports()
  } catch (e: any) {
    console.error('Errore import:', e)
    result.value = { success: false, message: e.message || 'Errore durante import' }
    step.value = 3
  } finally {
    importing.value = false
  }
}

const rollbackImport = async (importId: number) => {
  if (!confirm('Sei sicuro di voler annullare questo import? Tutte le transazioni importate verranno eliminate.')) return

  try {
    const res = await fetchApi<any>(`/bank/imports/${importId}`, { method: 'DELETE' })
    if (res.success) {
      await loadImports()
    } else {
      alert(res.message || 'Errore durante annullamento')
    }
  } catch (e: any) {
    alert(e.message || 'Errore durante annullamento')
  }
}

const resetForm = () => {
  form.bank_account_id = ''
  form.file = null
  form.source = ''
  preview.value = {}
  result.value = {}
  step.value = 1
}

onMounted(async () => {
  if (!centroStore.centroCorrente && centroStore.centri.length === 0) {
    await centroStore.fetchCentri()
  }
  await Promise.all([loadAccounts(), loadImports()])
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
