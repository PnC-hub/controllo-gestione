<template>
  <div>
    <div class="card mb-6">
      <div class="card-header flex justify-between items-center">
        <h2 class="card-title">
          <i class="fas fa-university mr-2 text-cyan-600"></i>
          <span>Bank Control - Dashboard</span>
        </h2>
        <div class="flex items-center space-x-2 text-sm">
          <span class="text-gray-500">Ruolo:</span>
          <span class="font-semibold capitalize px-2 py-1 rounded" :class="getRoleBadgeClass()">
            {{ permissions.role?.replace('_', ' ') }}
          </span>
        </div>
      </div>
      <div class="card-content">
        <!-- Filtri -->
        <div class="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Conto:</label>
            <select v-model="filters.bank_account_id" class="input-field" @change="loadDashboard()">
              <option value="">Tutti i conti</option>
              <option v-for="a in accounts" :key="a.id" :value="a.id">{{ a.name }}</option>
            </select>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Da:</label>
            <input type="date" v-model="filters.date_from" class="input-field" @change="loadDashboard()" />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">A:</label>
            <input type="date" v-model="filters.date_to" class="input-field" @change="loadDashboard()" />
          </div>
          <div class="flex items-end">
            <button @click="loadDashboard()" class="btn-primary w-full">
              <i class="fas fa-sync-alt mr-2"></i> Aggiorna
            </button>
          </div>
        </div>

        <div v-if="loading" class="p-12 text-center">
          <i class="fas fa-spinner fa-spin text-4xl text-cyan-600 mb-4"></i>
          <p class="text-gray-500">Caricamento dashboard...</p>
        </div>

        <div v-else>
          <!-- ALERTS (se presenti) -->
          <div v-if="dashboard.alerts?.length" class="mb-6">
            <div class="flex flex-wrap gap-3">
              <NuxtLink
                v-for="alert in dashboard.alerts"
                :key="alert.type"
                :to="alert.action_url"
                class="flex items-center px-4 py-2 rounded-lg text-sm font-medium transition-all hover:scale-105"
                :class="getAlertClass(alert.severity)"
              >
                <i :class="getAlertIcon(alert.type)" class="mr-2"></i>
                {{ alert.message }}
              </NuxtLink>
            </div>
          </div>

          <!-- LIQUIDITA' - Saldo Consolidato + Per Conto -->
          <div class="mb-6">
            <h3 class="text-lg font-semibold text-gray-800 mb-3">
              <i class="fas fa-wallet mr-2 text-cyan-600"></i> Liquidità
            </h3>
            <div class="grid grid-cols-1 md:grid-cols-5 gap-4">
              <!-- Consolidato -->
              <div class="bg-gradient-to-r from-cyan-500 to-cyan-600 rounded-lg p-4 text-white md:col-span-1">
                <div class="text-sm opacity-90">Saldo Consolidato</div>
                <div class="text-3xl font-bold mt-1">
                  {{ formatCurrency(dashboard.liquidity?.consolidated || 0) }}
                </div>
                <div class="text-xs opacity-75 mt-1">{{ dashboard.liquidity?.accounts?.length || 0 }} conti attivi</div>
              </div>
              <!-- Conti individuali -->
              <div class="md:col-span-4 grid grid-cols-2 md:grid-cols-4 gap-3">
                <div
                  v-for="account in dashboard.liquidity?.accounts"
                  :key="account.id"
                  class="bg-gray-50 rounded-lg p-3 border border-gray-200 hover:shadow-md transition-shadow"
                >
                  <div class="text-xs text-gray-500 truncate">{{ account.name }}</div>
                  <div class="text-xl font-bold mt-1" :class="account.balance >= 0 ? 'text-green-600' : 'text-red-600'">
                    {{ formatCurrency(account.balance) }}
                  </div>
                  <div class="text-xs text-gray-400">{{ account.bank_name }}</div>
                  <div v-if="account.iban" class="text-xs text-gray-300 mt-1 font-mono">{{ account.iban }}</div>
                </div>
              </div>
            </div>
          </div>

          <!-- CASHFLOW - 4 Mesi -->
          <div class="mb-6">
            <h3 class="text-lg font-semibold text-gray-800 mb-3">
              <i class="fas fa-chart-line mr-2 text-cyan-600"></i> Cashflow Mensile
            </h3>
            <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div
                v-for="(month, idx) in dashboard.cashflow"
                :key="month.month"
                class="bg-white rounded-lg border p-4"
                :class="idx === 0 ? 'ring-2 ring-cyan-500' : ''"
              >
                <div class="text-sm font-medium text-gray-700 mb-3 flex items-center justify-between">
                  <span>{{ month.month_name }}</span>
                  <span v-if="idx === 0" class="text-xs bg-cyan-100 text-cyan-700 px-2 py-0.5 rounded">Corrente</span>
                </div>
                <div class="space-y-2">
                  <div class="flex justify-between items-center">
                    <span class="text-xs text-gray-500"><i class="fas fa-arrow-down text-green-500 mr-1"></i> Entrate</span>
                    <span class="font-semibold text-green-600">{{ formatCurrency(month.credits) }}</span>
                  </div>
                  <div class="flex justify-between items-center">
                    <span class="text-xs text-gray-500"><i class="fas fa-arrow-up text-red-500 mr-1"></i> Uscite</span>
                    <span class="font-semibold text-red-600">{{ formatCurrency(month.debits) }}</span>
                  </div>
                  <div class="border-t pt-2 flex justify-between items-center">
                    <span class="text-xs font-medium text-gray-600">Saldo</span>
                    <span class="font-bold text-lg" :class="month.net >= 0 ? 'text-green-700' : 'text-red-700'">
                      {{ formatCurrency(month.net) }}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- QUICK STATS -->
          <div class="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <div class="bg-green-50 rounded-lg p-4 border-l-4 border-green-500">
              <div class="text-sm text-green-600">Entrate (mese)</div>
              <div class="text-2xl font-bold text-green-700">{{ formatCurrency(dashboard.quick_stats?.current_month?.credits || 0) }}</div>
            </div>
            <div class="bg-red-50 rounded-lg p-4 border-l-4 border-red-500">
              <div class="text-sm text-red-600">Uscite (mese)</div>
              <div class="text-2xl font-bold text-red-700">{{ formatCurrency(dashboard.quick_stats?.current_month?.debits || 0) }}</div>
            </div>
            <div class="bg-blue-50 rounded-lg p-4 border-l-4 border-blue-500">
              <div class="text-sm text-blue-600">Transazioni (mese)</div>
              <div class="text-2xl font-bold text-blue-700">{{ dashboard.quick_stats?.current_month?.transactions_count || 0 }}</div>
            </div>
            <div class="bg-purple-50 rounded-lg p-4 border-l-4 border-purple-500">
              <div class="text-sm text-purple-600">Totale Transazioni</div>
              <div class="text-2xl font-bold text-purple-700">{{ dashboard.quick_stats?.totals?.total_transactions || 0 }}</div>
            </div>
          </div>

          <!-- TOP SPESE E CONTROPARTI -->
          <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
            <!-- Top Spese per Categoria -->
            <div class="bg-white rounded-lg border p-4">
              <h3 class="text-lg font-semibold text-gray-800 mb-4">
                <i class="fas fa-chart-pie mr-2 text-red-500"></i> Top 10 Spese per Categoria
              </h3>
              <div v-if="dashboard.top_expenses_by_category?.length" class="space-y-3">
                <div
                  v-for="(cat, idx) in dashboard.top_expenses_by_category"
                  :key="cat.category_id || idx"
                  class="flex items-center justify-between py-2 border-b border-gray-100 last:border-0"
                >
                  <div class="flex items-center">
                    <div class="w-6 h-6 rounded-full flex items-center justify-center text-white text-xs mr-3"
                         :style="{ backgroundColor: cat.category_color || '#6B7280' }">
                      {{ idx + 1 }}
                    </div>
                    <div>
                      <div class="font-medium text-gray-800">{{ cat.category_name }}</div>
                      <div class="text-xs text-gray-500">{{ cat.count }} transazioni</div>
                    </div>
                  </div>
                  <span class="font-semibold text-red-600">{{ formatCurrency(cat.total) }}</span>
                </div>
              </div>
              <div v-else class="text-gray-500 text-center py-8">
                <i class="fas fa-inbox text-4xl mb-2"></i>
                <p>Nessuna spesa nel periodo</p>
              </div>
            </div>

            <!-- Top Controparti -->
            <div class="bg-white rounded-lg border p-4">
              <h3 class="text-lg font-semibold text-gray-800 mb-4">
                <i class="fas fa-users mr-2 text-orange-500"></i> Top 10 Controparti (Uscite)
              </h3>
              <div v-if="dashboard.top_counterparties?.length" class="space-y-3">
                <div
                  v-for="(cp, idx) in dashboard.top_counterparties"
                  :key="cp.counterparty"
                  class="flex items-center justify-between py-2 border-b border-gray-100 last:border-0"
                >
                  <div class="flex items-center">
                    <div class="w-6 h-6 rounded-full bg-orange-100 flex items-center justify-center text-orange-600 text-xs font-bold mr-3">
                      {{ idx + 1 }}
                    </div>
                    <div>
                      <div class="font-medium text-gray-800 truncate max-w-xs">{{ cp.counterparty }}</div>
                      <div class="text-xs text-gray-500">{{ cp.count }} pagamenti</div>
                    </div>
                  </div>
                  <span class="font-semibold text-red-600">{{ formatCurrency(cp.total) }}</span>
                </div>
              </div>
              <div v-else class="text-gray-500 text-center py-8">
                <i class="fas fa-user-slash text-4xl mb-2"></i>
                <p>Nessuna controparte trovata</p>
              </div>
            </div>
          </div>

          <!-- AZIONI RAPIDE -->
          <div class="bg-white rounded-lg border p-4">
            <h3 class="text-lg font-semibold text-gray-800 mb-4">
              <i class="fas fa-bolt mr-2 text-yellow-500"></i> Azioni Rapide
            </h3>
            <div class="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
              <NuxtLink v-if="permissions.can_import" to="/bank/import" class="btn-action bg-cyan-50 text-cyan-700 hover:bg-cyan-100">
                <i class="fas fa-upload text-xl mb-2"></i>
                <span>Import CSV/XLSX</span>
              </NuxtLink>
              <NuxtLink to="/bank/movimenti" class="btn-action bg-blue-50 text-blue-700 hover:bg-blue-100">
                <i class="fas fa-list text-xl mb-2"></i>
                <span>Movimenti</span>
              </NuxtLink>
              <NuxtLink v-if="permissions.can_manage_rules" to="/bank/regole" class="btn-action bg-purple-50 text-purple-700 hover:bg-purple-100">
                <i class="fas fa-cogs text-xl mb-2"></i>
                <span>Regole</span>
              </NuxtLink>
              <NuxtLink v-if="permissions.can_manage_accounts" to="/bank/conti" class="btn-action bg-green-50 text-green-700 hover:bg-green-100">
                <i class="fas fa-university text-xl mb-2"></i>
                <span>Conti</span>
              </NuxtLink>
              <NuxtLink to="/bank/categorie" class="btn-action bg-indigo-50 text-indigo-700 hover:bg-indigo-100">
                <i class="fas fa-tags text-xl mb-2"></i>
                <span>Categorie</span>
              </NuxtLink>
              <NuxtLink v-if="permissions.can_reconcile" to="/bank/riconciliazione" class="btn-action bg-teal-50 text-teal-700 hover:bg-teal-100">
                <i class="fas fa-check-double text-xl mb-2"></i>
                <span>Riconciliazione</span>
              </NuxtLink>
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
const accounts = ref<any[]>([])
const dashboard = ref<any>({})
const permissions = ref<any>({
  role: 'viewer',
  can_import: false,
  can_categorize: false,
  can_reconcile: false,
  can_delete: false,
  can_manage_accounts: false,
  can_manage_rules: false,
  can_approve_rules: false,
  can_set_opening_balance: false,
  is_owner_or_admin: false
})

const filters = reactive({
  bank_account_id: '',
  date_from: new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString().split('T')[0],
  date_to: new Date().toISOString().split('T')[0]
})

const formatCurrency = (v: any) => new Intl.NumberFormat('it-IT', { style: 'currency', currency: 'EUR' }).format(parseFloat(v) || 0)

const getRoleBadgeClass = () => {
  switch (permissions.value.role) {
    case 'owner':
      return 'bg-red-100 text-red-700'
    case 'admin':
      return 'bg-orange-100 text-orange-700'
    case 'finance_operator':
      return 'bg-blue-100 text-blue-700'
    default:
      return 'bg-gray-100 text-gray-700'
  }
}

const getAlertClass = (severity: string) => {
  switch (severity) {
    case 'high':
      return 'bg-red-100 text-red-700 border border-red-200'
    case 'medium':
      return 'bg-yellow-100 text-yellow-700 border border-yellow-200'
    default:
      return 'bg-blue-100 text-blue-700 border border-blue-200'
  }
}

const getAlertIcon = (type: string) => {
  switch (type) {
    case 'uncategorized':
      return 'fas fa-question-circle'
    case 'duplicates':
      return 'fas fa-clone'
    case 'transfers':
      return 'fas fa-exchange-alt'
    case 'unmatched':
      return 'fas fa-unlink'
    case 'anomaly':
      return 'fas fa-exclamation-triangle'
    default:
      return 'fas fa-info-circle'
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

const loadDashboard = async () => {
  loading.value = true
  try {
    let url = `/bank/dashboard?date_from=${filters.date_from}&date_to=${filters.date_to}`
    if (filters.bank_account_id) {
      url += `&bank_account_id=${filters.bank_account_id}`
    }

    const res = await fetchApi<any>(url)
    if (res.success) {
      dashboard.value = res.data || {}
      if (res.data?.permissions) {
        permissions.value = res.data.permissions
      }
    }
  } catch (e) {
    console.error('Errore caricamento dashboard:', e)
  } finally {
    loading.value = false
  }
}

onMounted(async () => {
  if (!centroStore.centroCorrente && centroStore.centri.length === 0) {
    await centroStore.fetchCentri()
  }
  await loadAccounts()
  await loadDashboard()
})
</script>

<style scoped>
.card { @apply bg-white rounded-lg shadow; }
.card-header { @apply px-4 py-3 border-b border-gray-200; }
.card-title { @apply text-lg font-semibold text-gray-800 flex items-center; }
.card-content { @apply p-4; }
.input-field { @apply w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500; }
.btn-primary { @apply px-4 py-2 bg-cyan-600 text-white rounded-lg hover:bg-cyan-700 transition-colors flex items-center justify-center; }
.btn-action { @apply flex flex-col items-center justify-center p-4 rounded-lg font-medium transition-colors text-center; }
</style>
