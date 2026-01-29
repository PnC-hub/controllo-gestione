<template>
  <div>
    <div class="card">
      <div class="card-header flex justify-between items-center">
        <h2 class="card-title">
          <span>Regole di Categorizzazione</span>
          <i class="fas fa-info-circle text-cyan-600 ml-2" title="Le regole vengono applicate automaticamente alle nuove transazioni importate"></i>
        </h2>
        <div class="flex items-center space-x-2">
          <!-- Badge regole in attesa approvazione (solo owner/admin) -->
          <NuxtLink v-if="permissions.can_approve_rules && pendingCount > 0"
                    to="#pending"
                    @click.prevent="showPendingModal = true"
                    class="bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full text-sm hover:bg-yellow-200">
            <i class="fas fa-clock mr-1"></i> {{ pendingCount }} da approvare
          </NuxtLink>
          <button v-if="permissions.can_manage_rules" @click="openCreateModal" class="btn-primary text-sm">
            <i class="fas fa-plus mr-1"></i> Nuova Regola
          </button>
        </div>
      </div>
      <div class="card-content">
        <div v-if="loading" class="p-12 text-center">
          <i class="fas fa-spinner fa-spin text-4xl text-cyan-600 mb-4"></i>
          <p class="text-gray-500">Caricamento regole...</p>
        </div>

        <div v-else-if="rules.length === 0" class="text-center py-12 text-gray-500">
          <i class="fas fa-cogs text-4xl mb-4"></i>
          <p>Nessuna regola configurata</p>
          <p class="text-sm mt-2">Crea regole per categorizzare automaticamente le transazioni</p>
        </div>

        <div v-else class="space-y-3">
          <div v-for="rule in rules" :key="rule.id"
               class="border rounded-lg p-4 hover:border-cyan-300 transition-colors"
               :class="getRuleClasses(rule)">
            <div class="flex justify-between items-start">
              <div class="flex-1">
                <div class="flex items-center flex-wrap gap-2">
                  <h3 class="font-semibold">{{ rule.name }}</h3>
                  <!-- Status badges -->
                  <span v-if="rule.status === 'draft'" class="text-xs bg-gray-200 text-gray-600 px-2 py-0.5 rounded">Bozza</span>
                  <span v-else-if="rule.status === 'pending_approval'" class="text-xs bg-yellow-200 text-yellow-800 px-2 py-0.5 rounded">In attesa</span>
                  <span v-else-if="rule.status === 'rejected'" class="text-xs bg-red-200 text-red-800 px-2 py-0.5 rounded">Rifiutata</span>
                  <span v-if="!rule.is_active && rule.status === 'active'" class="text-xs bg-gray-200 text-gray-600 px-2 py-0.5 rounded">Disattivata</span>
                  <span v-if="rule.is_global" class="text-xs bg-purple-100 text-purple-700 px-2 py-0.5 rounded">Globale</span>
                </div>
                <div class="text-sm text-gray-600 mt-1">
                  <span class="bg-gray-100 px-2 py-0.5 rounded mr-2">{{ rule.pattern_field }}</span>
                  <span class="font-mono">{{ rule.pattern_type }}: "{{ rule.pattern }}"</span>
                </div>
                <div class="flex items-center mt-2 text-sm">
                  <span v-if="rule.category" class="flex items-center mr-4">
                    <i :class="rule.category.icon" class="fas mr-1" :style="{ color: rule.category.color }"></i>
                    {{ rule.category.name }}
                  </span>
                  <span v-if="rule.mark_as_transfer" class="text-blue-600 mr-4">
                    <i class="fas fa-exchange-alt mr-1"></i> Giroconto
                  </span>
                  <span v-if="rule.amount_type !== 'any'" class="mr-4">
                    <i :class="rule.amount_type === 'credit' ? 'fa-arrow-down text-green-600' : 'fa-arrow-up text-red-600'" class="fas mr-1"></i>
                    {{ rule.amount_type === 'credit' ? 'Solo entrate' : 'Solo uscite' }}
                  </span>
                </div>
                <div class="text-xs text-gray-400 mt-2">
                  Priorita': {{ rule.priority }} | Applicata {{ rule.times_applied }} volte
                  <span v-if="rule.creator"> | Creata da: {{ rule.creator.nome }} {{ rule.creator.cognome }}</span>
                </div>
                <!-- Motivo rifiuto -->
                <div v-if="rule.status === 'rejected' && rule.rejection_reason" class="mt-2 text-sm text-red-600 bg-red-50 p-2 rounded">
                  <i class="fas fa-exclamation-circle mr-1"></i> Motivo: {{ rule.rejection_reason }}
                </div>
              </div>
              <div class="flex items-center space-x-2">
                <button @click="testRule(rule)" class="text-blue-600 hover:text-blue-800" title="Testa regola">
                  <i class="fas fa-flask"></i>
                </button>
                <button v-if="canEditRule(rule)" @click="editRule(rule)" class="text-cyan-600 hover:text-cyan-800" title="Modifica">
                  <i class="fas fa-edit"></i>
                </button>
                <button v-if="canToggleRule(rule)" @click="toggleRule(rule)" :class="rule.is_active ? 'text-yellow-600 hover:text-yellow-800' : 'text-green-600 hover:text-green-800'" :title="rule.is_active ? 'Disattiva' : 'Attiva'">
                  <i :class="rule.is_active ? 'fa-pause' : 'fa-play'" class="fas"></i>
                </button>
                <button v-if="canDeleteRule(rule)" @click="deleteRule(rule)" class="text-red-600 hover:text-red-800" title="Elimina">
                  <i class="fas fa-trash"></i>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal Regole in Attesa di Approvazione -->
    <div v-if="showPendingModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" @click.self="showPendingModal = false">
      <div class="bg-white rounded-lg shadow-xl max-w-3xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        <div class="px-6 py-4 border-b flex justify-between items-center">
          <h3 class="text-lg font-semibold">Regole in Attesa di Approvazione</h3>
          <button @click="showPendingModal = false" class="text-gray-400 hover:text-gray-600">
            <i class="fas fa-times"></i>
          </button>
        </div>
        <div class="p-6">
          <div v-if="loadingPending" class="text-center py-8">
            <i class="fas fa-spinner fa-spin text-2xl text-cyan-600"></i>
          </div>
          <div v-else-if="pendingRules.length === 0" class="text-center py-8 text-gray-500">
            Nessuna regola in attesa
          </div>
          <div v-else class="space-y-4">
            <div v-for="rule in pendingRules" :key="rule.id" class="border rounded-lg p-4">
              <div class="flex justify-between items-start">
                <div>
                  <h4 class="font-semibold">{{ rule.name }}</h4>
                  <p class="text-sm text-gray-600 mt-1">
                    {{ rule.pattern_field }} {{ rule.pattern_type }}: "{{ rule.pattern }}"
                  </p>
                  <p class="text-xs text-gray-400 mt-1">
                    Creata da: {{ rule.creator?.nome }} {{ rule.creator?.cognome }}
                  </p>
                </div>
                <div class="flex space-x-2">
                  <button @click="approveRule(rule)" class="bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700 text-sm">
                    <i class="fas fa-check mr-1"></i> Approva
                  </button>
                  <button @click="openRejectModal(rule)" class="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700 text-sm">
                    <i class="fas fa-times mr-1"></i> Rifiuta
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal Rifiuto -->
    <div v-if="showRejectModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" @click.self="showRejectModal = false">
      <div class="bg-white rounded-lg shadow-xl max-w-md w-full mx-4">
        <div class="px-6 py-4 border-b">
          <h3 class="text-lg font-semibold">Rifiuta Regola</h3>
        </div>
        <div class="p-6">
          <p class="text-sm text-gray-600 mb-4">Inserisci il motivo del rifiuto:</p>
          <textarea v-model="rejectReason" class="input-field" rows="3" placeholder="Motivo..."></textarea>
          <div class="flex justify-end space-x-2 mt-4">
            <button @click="showRejectModal = false" class="btn-secondary">Annulla</button>
            <button @click="rejectRule" :disabled="!rejectReason.trim()" class="btn-danger">Rifiuta</button>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal Crea/Modifica -->
    <div v-if="showModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" @click.self="showModal = false">
      <div class="bg-white rounded-lg shadow-xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        <div class="px-6 py-4 border-b flex justify-between items-center">
          <h3 class="text-lg font-semibold">{{ editingRule ? 'Modifica Regola' : 'Nuova Regola' }}</h3>
          <button @click="showModal = false" class="text-gray-400 hover:text-gray-600">
            <i class="fas fa-times"></i>
          </button>
        </div>
        <div class="p-6">
          <!-- Info per operatori -->
          <div v-if="!permissions.is_owner_or_admin && !editingRule" class="bg-yellow-50 border border-yellow-200 rounded-lg p-3 mb-4 text-sm text-yellow-800">
            <i class="fas fa-info-circle mr-1"></i>
            Le nuove regole richiedono approvazione da parte di un amministratore prima di essere attivate.
          </div>

          <div class="mb-4">
            <label class="block text-sm font-medium text-gray-700 mb-1">Nome Regola *</label>
            <input type="text" v-model="form.name" class="input-field" placeholder="Es: Bonifici ENEL" />
          </div>

          <div class="grid grid-cols-2 gap-4 mb-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Campo da cercare *</label>
              <select v-model="form.pattern_field" class="input-field">
                <option value="description">Descrizione</option>
                <option value="counterparty">Controparte</option>
                <option value="reference">Riferimento</option>
                <option value="any">Tutti i campi</option>
              </select>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Tipo Match *</label>
              <select v-model="form.pattern_type" class="input-field">
                <option value="contains">Contiene</option>
                <option value="starts_with">Inizia con</option>
                <option value="ends_with">Finisce con</option>
                <option value="equals">Uguale a</option>
                <option value="regex">Regex</option>
              </select>
            </div>
          </div>

          <div class="mb-4">
            <label class="block text-sm font-medium text-gray-700 mb-1">Pattern *</label>
            <input type="text" v-model="form.pattern" class="input-field" placeholder="Es: ENEL ENERGIA" />
            <label class="flex items-center mt-2">
              <input type="checkbox" v-model="form.case_sensitive" class="mr-2" />
              <span class="text-sm text-gray-600">Case sensitive</span>
            </label>
          </div>

          <div class="grid grid-cols-3 gap-4 mb-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Tipo Importo</label>
              <select v-model="form.amount_type" class="input-field">
                <option value="any">Qualsiasi</option>
                <option value="credit">Solo Entrate</option>
                <option value="debit">Solo Uscite</option>
              </select>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Importo Min</label>
              <input type="number" v-model="form.amount_min" class="input-field" step="0.01" />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Importo Max</label>
              <input type="number" v-model="form.amount_max" class="input-field" step="0.01" />
            </div>
          </div>

          <div class="border-t pt-4 mt-4">
            <h4 class="font-medium text-gray-700 mb-3">Azioni</h4>

            <div class="mb-4">
              <label class="block text-sm font-medium text-gray-700 mb-1">Assegna Categoria</label>
              <select v-model="form.category_id" class="input-field">
                <option :value="null">-- Nessuna --</option>
                <option v-for="c in categories" :key="c.id" :value="c.id">{{ c.name }}</option>
              </select>
            </div>

            <div class="mb-4">
              <label class="flex items-center">
                <input type="checkbox" v-model="form.mark_as_transfer" class="mr-2" />
                <span class="text-sm">Marca come giroconto</span>
              </label>
            </div>

            <div class="mb-4">
              <label class="block text-sm font-medium text-gray-700 mb-1">Sovrascrivi Controparte</label>
              <input type="text" v-model="form.set_counterparty" class="input-field" placeholder="Lascia vuoto per mantenere" />
            </div>

            <div class="grid grid-cols-2 gap-4 mb-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Priorita'</label>
                <input type="number" v-model="form.priority" class="input-field w-24" />
                <p class="text-xs text-gray-500 mt-1">Regole con priorita' piu' alta vengono applicate prima</p>
              </div>
              <!-- Solo owner/admin possono creare regole globali -->
              <div v-if="permissions.is_owner_or_admin">
                <label class="block text-sm font-medium text-gray-700 mb-1">Visibilita'</label>
                <label class="flex items-center mt-2">
                  <input type="checkbox" v-model="form.is_global" class="mr-2" />
                  <span class="text-sm">Regola globale (visibile a tutti i centri)</span>
                </label>
              </div>
            </div>
          </div>

          <div class="flex justify-end space-x-2 mt-6">
            <button @click="showModal = false" class="btn-secondary">Annulla</button>
            <button @click="saveRule" :disabled="!canSave" class="btn-primary">
              {{ editingRule ? 'Salva Modifiche' : (permissions.is_owner_or_admin ? 'Crea Regola' : 'Invia per Approvazione') }}
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal Test -->
    <div v-if="showTestModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" @click.self="showTestModal = false">
      <div class="bg-white rounded-lg shadow-xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        <div class="px-6 py-4 border-b flex justify-between items-center">
          <h3 class="text-lg font-semibold">Test Regola</h3>
          <button @click="showTestModal = false" class="text-gray-400 hover:text-gray-600">
            <i class="fas fa-times"></i>
          </button>
        </div>
        <div class="p-6">
          <div v-if="testing" class="text-center py-8">
            <i class="fas fa-spinner fa-spin text-2xl text-cyan-600"></i>
          </div>
          <div v-else>
            <div class="bg-gray-50 rounded-lg p-4 mb-4">
              <p class="text-sm">
                <strong>Risultato:</strong> {{ testResult.matches }} transazioni su {{ testResult.total_tested }} corrispondono
              </p>
            </div>
            <div v-if="testResult.sample?.length" class="space-y-2">
              <p class="text-sm font-medium">Esempi di match:</p>
              <div v-for="tx in testResult.sample" :key="tx.id" class="border rounded p-2 text-sm">
                <div class="flex justify-between">
                  <span>{{ tx.date }} - {{ tx.description }}</span>
                  <span :class="tx.type === 'credit' ? 'text-green-600' : 'text-red-600'">
                    {{ formatCurrency(tx.amount) }}
                  </span>
                </div>
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
const rules = ref<any[]>([])
const categories = ref<any[]>([])
const pendingRules = ref<any[]>([])
const pendingCount = ref(0)
const loadingPending = ref(false)

const permissions = ref<any>({
  role: 'viewer',
  can_manage_rules: false,
  can_approve_rules: false,
  can_delete: false,
  is_owner_or_admin: false
})

const showModal = ref(false)
const editingRule = ref<any>(null)

const showPendingModal = ref(false)
const showRejectModal = ref(false)
const rejectingRule = ref<any>(null)
const rejectReason = ref('')

const showTestModal = ref(false)
const testing = ref(false)
const testResult = ref<any>({})

const form = reactive({
  name: '',
  pattern: '',
  pattern_field: 'description',
  pattern_type: 'contains',
  case_sensitive: false,
  amount_min: null as number | null,
  amount_max: null as number | null,
  amount_type: 'any',
  category_id: null as number | null,
  mark_as_transfer: false,
  set_counterparty: '',
  priority: 0,
  is_global: false
})

const canSave = computed(() => form.name && form.pattern)

const formatCurrency = (v: any) => new Intl.NumberFormat('it-IT', { style: 'currency', currency: 'EUR' }).format(parseFloat(v) || 0)

const getRuleClasses = (rule: any) => ({
  'opacity-50': !rule.is_active || rule.status !== 'active',
  'border-yellow-300 bg-yellow-50': rule.status === 'pending_approval',
  'border-red-300 bg-red-50': rule.status === 'rejected',
  'border-gray-300 bg-gray-50': rule.status === 'draft'
})

const canEditRule = (rule: any) => {
  if (permissions.value.is_owner_or_admin) return true
  // Operatori possono modificare solo le proprie regole non approvate
  return permissions.value.can_manage_rules && rule.status !== 'active'
}

const canToggleRule = (rule: any) => {
  // Solo regole attive possono essere toggle
  return permissions.value.is_owner_or_admin && rule.status === 'active'
}

const canDeleteRule = (rule: any) => {
  if (permissions.value.is_owner_or_admin && permissions.value.can_delete) return true
  // Operatori possono eliminare solo le proprie regole non approvate
  return permissions.value.can_manage_rules && rule.status !== 'active'
}

const loadPermissions = async () => {
  try {
    const res = await fetchApi<any>('/bank/permissions')
    if (res.success) permissions.value = res.data || {}
  } catch (e) {
    console.error('Errore caricamento permessi:', e)
  }
}

const loadRules = async () => {
  loading.value = true
  try {
    const res = await fetchApi<any>('/bank/rules')
    if (res.success) rules.value = res.data || []
  } catch (e) {
    console.error('Errore caricamento regole:', e)
  } finally {
    loading.value = false
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

const loadPendingRules = async () => {
  if (!permissions.value.can_approve_rules) return

  loadingPending.value = true
  try {
    const res = await fetchApi<any>('/bank/rules/pending')
    if (res.success) {
      pendingRules.value = res.data || []
      pendingCount.value = pendingRules.value.length
    }
  } catch (e) {
    console.error('Errore caricamento regole in attesa:', e)
  } finally {
    loadingPending.value = false
  }
}

const resetForm = () => {
  form.name = ''
  form.pattern = ''
  form.pattern_field = 'description'
  form.pattern_type = 'contains'
  form.case_sensitive = false
  form.amount_min = null
  form.amount_max = null
  form.amount_type = 'any'
  form.category_id = null
  form.mark_as_transfer = false
  form.set_counterparty = ''
  form.priority = 0
  form.is_global = false
}

const openCreateModal = () => {
  editingRule.value = null
  resetForm()
  showModal.value = true
}

const editRule = (rule: any) => {
  editingRule.value = rule
  Object.assign(form, {
    name: rule.name,
    pattern: rule.pattern,
    pattern_field: rule.pattern_field,
    pattern_type: rule.pattern_type,
    case_sensitive: rule.case_sensitive,
    amount_min: rule.amount_min,
    amount_max: rule.amount_max,
    amount_type: rule.amount_type,
    category_id: rule.category_id,
    mark_as_transfer: rule.mark_as_transfer,
    set_counterparty: rule.set_counterparty || '',
    priority: rule.priority,
    is_global: rule.is_global || false
  })
  showModal.value = true
}

const saveRule = async () => {
  try {
    const data = { ...form }
    if (!data.amount_min) data.amount_min = null
    if (!data.amount_max) data.amount_max = null
    if (!data.set_counterparty) data.set_counterparty = null

    let res: any
    if (editingRule.value) {
      res = await fetchApi(`/bank/rules/${editingRule.value.id}`, {
        method: 'PUT',
        body: JSON.stringify(data)
      })
    } else {
      res = await fetchApi('/bank/rules', {
        method: 'POST',
        body: JSON.stringify(data)
      })
    }

    if (res.success && res.message) {
      alert(res.message)
    }

    showModal.value = false
    await loadRules()
    if (permissions.value.can_approve_rules) {
      await loadPendingRules()
    }
  } catch (e) {
    console.error('Errore salvataggio regola:', e)
  }
}

const toggleRule = async (rule: any) => {
  try {
    await fetchApi(`/bank/rules/${rule.id}`, {
      method: 'PUT',
      body: JSON.stringify({ is_active: !rule.is_active })
    })
    await loadRules()
  } catch (e) {
    console.error('Errore toggle regola:', e)
  }
}

const deleteRule = async (rule: any) => {
  if (!confirm(`Eliminare la regola "${rule.name}"?`)) return

  try {
    await fetchApi(`/bank/rules/${rule.id}`, { method: 'DELETE' })
    await loadRules()
  } catch (e) {
    console.error('Errore eliminazione regola:', e)
  }
}

const approveRule = async (rule: any) => {
  try {
    const res = await fetchApi<any>(`/bank/rules/${rule.id}/approve`, { method: 'POST' })
    if (res.success) {
      alert('Regola approvata')
      await loadPendingRules()
      await loadRules()
      if (pendingRules.value.length === 0) {
        showPendingModal.value = false
      }
    }
  } catch (e) {
    console.error('Errore approvazione regola:', e)
  }
}

const openRejectModal = (rule: any) => {
  rejectingRule.value = rule
  rejectReason.value = ''
  showRejectModal.value = true
}

const rejectRule = async () => {
  if (!rejectingRule.value || !rejectReason.value.trim()) return

  try {
    const res = await fetchApi<any>(`/bank/rules/${rejectingRule.value.id}/reject`, {
      method: 'POST',
      body: JSON.stringify({ reason: rejectReason.value })
    })
    if (res.success) {
      alert('Regola rifiutata')
      showRejectModal.value = false
      await loadPendingRules()
      await loadRules()
      if (pendingRules.value.length === 0) {
        showPendingModal.value = false
      }
    }
  } catch (e) {
    console.error('Errore rifiuto regola:', e)
  }
}

const testRule = async (rule: any) => {
  showTestModal.value = true
  testing.value = true

  try {
    const res = await fetchApi<any>('/bank/rules/test', {
      method: 'POST',
      body: JSON.stringify({
        pattern: rule.pattern,
        pattern_field: rule.pattern_field,
        pattern_type: rule.pattern_type,
        case_sensitive: rule.case_sensitive,
        amount_type: rule.amount_type
      })
    })
    if (res.success) testResult.value = res.data
  } catch (e) {
    console.error('Errore test regola:', e)
  } finally {
    testing.value = false
  }
}

onMounted(async () => {
  if (!centroStore.centroCorrente && centroStore.centri.length === 0) {
    await centroStore.fetchCentri()
  }
  await loadPermissions()
  await Promise.all([loadRules(), loadCategories()])
  if (permissions.value.can_approve_rules) {
    await loadPendingRules()
  }
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
.btn-danger { @apply bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed; }
</style>
