<template>
  <div>
    <div class="card">
      <div class="card-header flex justify-between items-center">
        <h2 class="card-title">
          <span>Conti Bancari</span>
        </h2>
        <button @click="openCreateModal" class="btn-primary text-sm">
          <i class="fas fa-plus mr-1"></i> Nuovo Conto
        </button>
      </div>
      <div class="card-content">
        <div v-if="loading" class="p-12 text-center">
          <i class="fas fa-spinner fa-spin text-4xl text-cyan-600 mb-4"></i>
          <p class="text-gray-500">Caricamento conti...</p>
        </div>

        <div v-else-if="accounts.length === 0" class="text-center py-12 text-gray-500">
          <i class="fas fa-university text-4xl mb-4"></i>
          <p>Nessun conto bancario configurato</p>
          <p class="text-sm mt-2">Aggiungi un conto per iniziare a importare i movimenti</p>
        </div>

        <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div v-for="account in accounts" :key="account.id"
               class="border rounded-lg p-4 hover:border-cyan-300 transition-colors"
               :class="{ 'opacity-60': !account.is_active }">
            <div class="flex justify-between items-start mb-3">
              <div>
                <h3 class="font-semibold text-lg">{{ account.name }}</h3>
                <p class="text-sm text-gray-500">{{ account.bank_name }}</p>
              </div>
              <span :class="account.is_active ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'"
                    class="text-xs px-2 py-1 rounded">
                {{ account.is_active ? 'Attivo' : 'Inattivo' }}
              </span>
            </div>

            <div class="mb-3">
              <p class="text-2xl font-bold" :class="parseFloat(account.current_balance) >= 0 ? 'text-green-600' : 'text-red-600'">
                {{ formatCurrency(account.current_balance) }}
              </p>
              <p class="text-xs text-gray-400">Saldo attuale</p>
            </div>

            <div class="text-sm text-gray-600 space-y-1 mb-4">
              <p v-if="account.iban">
                <span class="text-gray-400">IBAN:</span>
                <span class="font-mono">{{ maskIban(account.iban) }}</span>
              </p>
              <p>
                <span class="text-gray-400">Formato:</span>
                <span class="capitalize">{{ account.source }}</span>
              </p>
              <p v-if="account.opening_balance_date">
                <span class="text-gray-400">Saldo iniziale:</span>
                {{ formatCurrency(account.opening_balance) }} al {{ formatDate(account.opening_balance_date) }}
              </p>
            </div>

            <div class="flex justify-end space-x-2 pt-3 border-t">
              <button @click="editAccount(account)" class="text-cyan-600 hover:text-cyan-800" title="Modifica">
                <i class="fas fa-edit"></i>
              </button>
              <button @click="toggleAccount(account)"
                      :class="account.is_active ? 'text-yellow-600 hover:text-yellow-800' : 'text-green-600 hover:text-green-800'"
                      :title="account.is_active ? 'Disattiva' : 'Attiva'">
                <i :class="account.is_active ? 'fa-pause' : 'fa-play'" class="fas"></i>
              </button>
              <button @click="deleteAccount(account)" class="text-red-600 hover:text-red-800" title="Elimina">
                <i class="fas fa-trash"></i>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal Crea/Modifica -->
    <div v-if="showModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" @click.self="showModal = false">
      <div class="bg-white rounded-lg shadow-xl max-w-lg w-full mx-4">
        <div class="px-6 py-4 border-b flex justify-between items-center">
          <h3 class="text-lg font-semibold">{{ editingAccount ? 'Modifica Conto' : 'Nuovo Conto Bancario' }}</h3>
          <button @click="showModal = false" class="text-gray-400 hover:text-gray-600">
            <i class="fas fa-times"></i>
          </button>
        </div>
        <div class="p-6">
          <div class="mb-4">
            <label class="block text-sm font-medium text-gray-700 mb-1">Nome Conto *</label>
            <input type="text" v-model="form.name" class="input-field" placeholder="Es: Conto Principale" />
          </div>

          <div class="mb-4">
            <label class="block text-sm font-medium text-gray-700 mb-1">Banca</label>
            <input type="text" v-model="form.bank_name" class="input-field" placeholder="Es: Fineco Bank" />
          </div>

          <div class="mb-4">
            <label class="block text-sm font-medium text-gray-700 mb-1">IBAN</label>
            <input type="text" v-model="form.iban" class="input-field font-mono" placeholder="IT60X0542811101000000123456" />
          </div>

          <div class="mb-4">
            <label class="block text-sm font-medium text-gray-700 mb-1">Formato CSV *</label>
            <select v-model="form.source" class="input-field">
              <option value="fineco">Fineco</option>
              <option value="unicredit">UniCredit</option>
              <option value="intesa">Intesa Sanpaolo</option>
              <option value="bnl">BNL</option>
              <option value="altro">Altro</option>
            </select>
          </div>

          <div class="grid grid-cols-2 gap-4 mb-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Saldo Iniziale</label>
              <input type="number" v-model="form.opening_balance" class="input-field" step="0.01" />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Data Saldo Iniziale</label>
              <input type="date" v-model="form.opening_balance_date" class="input-field" />
            </div>
          </div>

          <div class="mb-4">
            <label class="block text-sm font-medium text-gray-700 mb-1">Note</label>
            <textarea v-model="form.notes" class="input-field" rows="2"></textarea>
          </div>

          <div class="flex justify-end space-x-2 mt-6">
            <button @click="showModal = false" class="btn-secondary">Annulla</button>
            <button @click="saveAccount" :disabled="!canSave" class="btn-primary">
              {{ editingAccount ? 'Salva Modifiche' : 'Crea Conto' }}
            </button>
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
const accounts = ref<any[]>([])

const showModal = ref(false)
const editingAccount = ref<any>(null)

const form = reactive({
  name: '',
  bank_name: '',
  iban: '',
  source: 'fineco',
  opening_balance: 0,
  opening_balance_date: '',
  notes: ''
})

const canSave = computed(() => form.name && form.source)

const formatCurrency = (v: any) => new Intl.NumberFormat('it-IT', { style: 'currency', currency: 'EUR' }).format(parseFloat(v) || 0)
const formatDate = (d: string) => { if (!d) return '-'; const date = new Date(d); return `${String(date.getDate()).padStart(2, '0')}-${String(date.getMonth() + 1).padStart(2, '0')}-${date.getFullYear()}`; }

const maskIban = (iban: string) => {
  if (!iban || iban.length < 10) return iban
  return iban.slice(0, 4) + '****' + iban.slice(-4)
}

const loadAccounts = async () => {
  loading.value = true
  try {
    const res = await fetchApi<any>('/bank/accounts')
    if (res.success) accounts.value = res.data || []
  } catch (e) {
    console.error('Errore caricamento conti:', e)
  } finally {
    loading.value = false
  }
}

const resetForm = () => {
  form.name = ''
  form.bank_name = ''
  form.iban = ''
  form.source = 'fineco'
  form.opening_balance = 0
  form.opening_balance_date = ''
  form.notes = ''
}

const openCreateModal = () => {
  editingAccount.value = null
  resetForm()
  showModal.value = true
}

const editAccount = (account: any) => {
  editingAccount.value = account
  Object.assign(form, {
    name: account.name,
    bank_name: account.bank_name || '',
    iban: account.iban || '',
    source: account.source,
    opening_balance: account.opening_balance || 0,
    opening_balance_date: account.opening_balance_date || '',
    notes: account.notes || ''
  })
  showModal.value = true
}

const saveAccount = async () => {
  try {
    const data = { ...form }
    if (!data.opening_balance_date) data.opening_balance_date = null as any

    if (editingAccount.value) {
      await fetchApi(`/bank/accounts/${editingAccount.value.id}`, {
        method: 'PUT',
        body: JSON.stringify(data)
      })
    } else {
      await fetchApi('/bank/accounts', {
        method: 'POST',
        body: JSON.stringify(data)
      })
    }
    showModal.value = false
    await loadAccounts()
  } catch (e) {
    console.error('Errore salvataggio conto:', e)
  }
}

const toggleAccount = async (account: any) => {
  try {
    await fetchApi(`/bank/accounts/${account.id}`, {
      method: 'PUT',
      body: JSON.stringify({ is_active: !account.is_active })
    })
    await loadAccounts()
  } catch (e) {
    console.error('Errore toggle conto:', e)
  }
}

const deleteAccount = async (account: any) => {
  if (!confirm(`Eliminare il conto "${account.name}"? Questa operazione non puo' essere annullata.`)) return

  try {
    const res = await fetchApi<any>(`/bank/accounts/${account.id}`, { method: 'DELETE' })
    if (res.success) {
      await loadAccounts()
    } else {
      alert(res.message || 'Errore durante eliminazione')
    }
  } catch (e: any) {
    alert(e.message || 'Errore durante eliminazione')
  }
}

onMounted(async () => {
  if (!centroStore.centroCorrente && centroStore.centri.length === 0) {
    await centroStore.fetchCentri()
  }
  await loadAccounts()
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
