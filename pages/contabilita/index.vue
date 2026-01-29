<template>
  <div>
    <!-- Header con PageHeader component -->
    <div class="mb-6">
      <div class="flex items-start">
        <PageHeader
          title="CONTABILITÀ AUTOMATICA"
          subtitle="Sistema hands-off per la gestione contabile"
          :related-pages="[
            { label: 'Bank Control', route: '/bank', icon: 'fa-university' },
            { label: 'Prima Nota', route: '/prima-nota', icon: 'fa-book' },
            { label: 'Fatture', route: '/fatture', icon: 'fa-file-invoice' }
          ]"
        />
        <PageInfoButton
          title="Dashboard Contabilita Automatica"
          description="Questa dashboard mostra lo stato dell'automazione contabile in tempo reale. Puoi monitorare quanti movimenti vengono processati automaticamente e quali richiedono il tuo intervento."
          :features="[
            'Visualizza il tasso di automazione e i movimenti processati',
            'Controlla il flusso completo: Import → Categorizzazione → Conciliazione → Prima Nota',
            'Ricevi alert intelligenti solo quando serve intervento manuale',
            'Verifica la riconciliazione dei saldi bancari vs contabili',
            'Attiva/disattiva le funzioni automatiche con un click'
          ]"
        />
      </div>
    </div>

    <!-- Stato Automazione -->
    <div class="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
      <div class="bg-gradient-to-r from-green-500 to-green-600 rounded-lg p-4 text-white">
        <div class="flex items-center justify-between">
          <div>
            <div class="text-sm opacity-90">Automazione Attiva</div>
            <div class="text-3xl font-bold mt-1">{{ stats.tasso_automazione }}%</div>
          </div>
          <i class="fas fa-robot text-4xl opacity-50"></i>
        </div>
        <div class="text-xs mt-2 opacity-75">{{ stats.movimenti_auto }} su {{ stats.movimenti_totali }} movimenti</div>
      </div>

      <div class="bg-gradient-to-r from-cyan-500 to-cyan-600 rounded-lg p-4 text-white">
        <div class="flex items-center justify-between">
          <div>
            <div class="text-sm opacity-90">Conciliati Oggi</div>
            <div class="text-3xl font-bold mt-1">{{ stats.conciliati_oggi }}</div>
          </div>
          <i class="fas fa-link text-4xl opacity-50"></i>
        </div>
        <div class="text-xs mt-2 opacity-75">{{ stats.conciliati_auto_oggi }} automatici</div>
      </div>

      <div class="bg-gradient-to-r from-amber-500 to-amber-600 rounded-lg p-4 text-white">
        <div class="flex items-center justify-between">
          <div>
            <div class="text-sm opacity-90">Richiede Attenzione</div>
            <div class="text-3xl font-bold mt-1">{{ stats.richiede_attenzione }}</div>
          </div>
          <i class="fas fa-exclamation-triangle text-4xl opacity-50"></i>
        </div>
        <div class="text-xs mt-2 opacity-75">Intervento manuale necessario</div>
      </div>

      <div class="bg-gradient-to-r from-purple-500 to-purple-600 rounded-lg p-4 text-white">
        <div class="flex items-center justify-between">
          <div>
            <div class="text-sm opacity-90">Regole Attive</div>
            <div class="text-3xl font-bold mt-1">{{ stats.regole_attive }}</div>
          </div>
          <i class="fas fa-cogs text-4xl opacity-50"></i>
        </div>
        <div class="text-xs mt-2 opacity-75">{{ stats.match_da_regole }} match questo mese</div>
      </div>
    </div>

    <!-- Alert Intelligenti -->
    <div v-if="alerts.length > 0" class="mb-6">
      <h3 class="text-lg font-semibold text-gray-800 mb-3">
        <i class="fas fa-bell mr-2 text-amber-500"></i> Alert Intelligenti
      </h3>
      <div class="space-y-2">
        <div
          v-for="alert in alerts"
          :key="alert.id"
          class="flex items-center justify-between p-4 rounded-lg border"
          :class="getAlertClass(alert.severity)"
        >
          <div class="flex items-center">
            <i :class="getAlertIcon(alert.type)" class="text-xl mr-3"></i>
            <div>
              <p class="font-medium">{{ alert.title }}</p>
              <p class="text-sm opacity-75">{{ alert.message }}</p>
            </div>
          </div>
          <div class="flex items-center space-x-2">
            <NuxtLink
              v-if="alert.action_url"
              :to="alert.action_url"
              class="px-3 py-1.5 rounded-lg text-sm font-medium transition-colors"
              :class="getAlertButtonClass(alert.severity)"
            >
              {{ alert.action_label || 'Gestisci' }}
            </NuxtLink>
            <button
              @click="dismissAlert(alert.id)"
              class="p-1.5 rounded-lg hover:bg-black hover:bg-opacity-10"
            >
              <i class="fas fa-times"></i>
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Flusso Automatico -->
    <div class="card mb-6">
      <div class="card-header">
        <h3 class="card-title">
          <i class="fas fa-stream mr-2 text-cyan-600"></i>
          Flusso Contabile Automatico
        </h3>
      </div>
      <div class="card-content">
        <div class="grid grid-cols-1 md:grid-cols-5 gap-4">
          <!-- Step 1: Import -->
          <div class="text-center p-4 bg-gray-50 rounded-lg">
            <div class="w-12 h-12 mx-auto mb-3 rounded-full flex items-center justify-center"
                 :class="automation.import_attivo ? 'bg-green-100 text-green-600' : 'bg-gray-200 text-gray-500'">
              <i class="fas fa-download text-xl"></i>
            </div>
            <h4 class="font-medium text-gray-800">1. Import</h4>
            <p class="text-xs text-gray-500 mt-1">Movimenti bancari</p>
            <div class="mt-2">
              <span class="px-2 py-0.5 rounded text-xs"
                    :class="automation.import_attivo ? 'bg-green-100 text-green-700' : 'bg-gray-200 text-gray-600'">
                {{ automation.import_attivo ? 'Automatico' : 'Manuale' }}
              </span>
            </div>
            <p class="text-xs text-gray-400 mt-2">Ultimo: {{ formatDate(automation.ultimo_import) }}</p>
          </div>

          <div class="hidden md:flex items-center justify-center">
            <i class="fas fa-arrow-right text-2xl text-gray-300"></i>
          </div>

          <!-- Step 2: Categorizzazione -->
          <div class="text-center p-4 bg-gray-50 rounded-lg">
            <div class="w-12 h-12 mx-auto mb-3 rounded-full flex items-center justify-center"
                 :class="automation.categorizzazione_attiva ? 'bg-green-100 text-green-600' : 'bg-gray-200 text-gray-500'">
              <i class="fas fa-tags text-xl"></i>
            </div>
            <h4 class="font-medium text-gray-800">2. Categorizza</h4>
            <p class="text-xs text-gray-500 mt-1">Riconoscimento automatico</p>
            <div class="mt-2">
              <span class="px-2 py-0.5 rounded text-xs"
                    :class="automation.categorizzazione_attiva ? 'bg-green-100 text-green-700' : 'bg-gray-200 text-gray-600'">
                {{ automation.categorizzazione_attiva ? 'AI Attiva' : 'Manuale' }}
              </span>
            </div>
            <p class="text-xs text-gray-400 mt-2">{{ automation.tasso_categorizzazione }}% auto</p>
          </div>

          <div class="hidden md:flex items-center justify-center">
            <i class="fas fa-arrow-right text-2xl text-gray-300"></i>
          </div>

          <!-- Step 3: Conciliazione -->
          <div class="text-center p-4 bg-gray-50 rounded-lg">
            <div class="w-12 h-12 mx-auto mb-3 rounded-full flex items-center justify-center"
                 :class="automation.conciliazione_attiva ? 'bg-green-100 text-green-600' : 'bg-gray-200 text-gray-500'">
              <i class="fas fa-link text-xl"></i>
            </div>
            <h4 class="font-medium text-gray-800">3. Concilia</h4>
            <p class="text-xs text-gray-500 mt-1">Match fatture/costi</p>
            <div class="mt-2">
              <span class="px-2 py-0.5 rounded text-xs"
                    :class="automation.conciliazione_attiva ? 'bg-green-100 text-green-700' : 'bg-gray-200 text-gray-600'">
                {{ automation.conciliazione_attiva ? 'Automatica' : 'Manuale' }}
              </span>
            </div>
            <p class="text-xs text-gray-400 mt-2">{{ automation.tasso_conciliazione }}% auto</p>
          </div>

          <div class="hidden md:flex items-center justify-center">
            <i class="fas fa-arrow-right text-2xl text-gray-300"></i>
          </div>

          <!-- Step 4: Prima Nota -->
          <div class="text-center p-4 bg-gray-50 rounded-lg">
            <div class="w-12 h-12 mx-auto mb-3 rounded-full flex items-center justify-center"
                 :class="automation.prima_nota_attiva ? 'bg-green-100 text-green-600' : 'bg-gray-200 text-gray-500'">
              <i class="fas fa-book text-xl"></i>
            </div>
            <h4 class="font-medium text-gray-800">4. Prima Nota</h4>
            <p class="text-xs text-gray-500 mt-1">Registrazione contabile</p>
            <div class="mt-2">
              <span class="px-2 py-0.5 rounded text-xs"
                    :class="automation.prima_nota_attiva ? 'bg-green-100 text-green-700' : 'bg-gray-200 text-gray-600'">
                {{ automation.prima_nota_attiva ? 'Automatica' : 'Manuale' }}
              </span>
            </div>
            <p class="text-xs text-gray-400 mt-2">{{ automation.registrazioni_auto }} oggi</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Azioni Rapide + Ultimi Movimenti -->
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
      <!-- Azioni Rapide -->
      <div class="card">
        <div class="card-header">
          <h3 class="card-title">
            <i class="fas fa-bolt mr-2 text-yellow-500"></i>
            Azioni Rapide
          </h3>
        </div>
        <div class="card-content">
          <div class="space-y-3">
            <NuxtLink to="/bank/import" class="action-btn bg-cyan-50 text-cyan-700 hover:bg-cyan-100">
              <i class="fas fa-upload mr-3"></i>
              <span>Import Movimenti</span>
              <i class="fas fa-chevron-right ml-auto text-cyan-400"></i>
            </NuxtLink>

            <button @click="runAutoConciliazione" :disabled="processing" class="action-btn bg-green-50 text-green-700 hover:bg-green-100 w-full">
              <i :class="processing ? 'fas fa-spinner fa-spin' : 'fas fa-magic'" class="mr-3"></i>
              <span>Esegui Auto-Conciliazione</span>
              <i class="fas fa-chevron-right ml-auto text-green-400"></i>
            </button>

            <button @click="runAutoRegistrazione" :disabled="processing" class="action-btn bg-purple-50 text-purple-700 hover:bg-purple-100 w-full">
              <i :class="processing ? 'fas fa-spinner fa-spin' : 'fas fa-file-signature'" class="mr-3"></i>
              <span>Registra in Prima Nota</span>
              <i class="fas fa-chevron-right ml-auto text-purple-400"></i>
            </button>

            <NuxtLink to="/contabilita/regole" class="action-btn bg-indigo-50 text-indigo-700 hover:bg-indigo-100">
              <i class="fas fa-cogs mr-3"></i>
              <span>Gestisci Regole</span>
              <i class="fas fa-chevron-right ml-auto text-indigo-400"></i>
            </NuxtLink>

            <NuxtLink to="/bank/conciliazione" class="action-btn bg-amber-50 text-amber-700 hover:bg-amber-100">
              <i class="fas fa-balance-scale mr-3"></i>
              <span>Conciliazione Manuale</span>
              <span v-if="stats.richiede_attenzione > 0" class="ml-2 px-2 py-0.5 bg-amber-200 rounded-full text-xs">
                {{ stats.richiede_attenzione }}
              </span>
              <i class="fas fa-chevron-right ml-auto text-amber-400"></i>
            </NuxtLink>
          </div>
        </div>
      </div>

      <!-- Ultimi Movimenti Auto-Processati -->
      <div class="card lg:col-span-2">
        <div class="card-header flex justify-between items-center">
          <h3 class="card-title">
            <i class="fas fa-history mr-2 text-cyan-600"></i>
            Ultimi Movimenti Processati
          </h3>
          <NuxtLink to="/bank/movimenti" class="text-sm text-cyan-600 hover:text-cyan-800">
            Vedi tutti <i class="fas fa-arrow-right ml-1"></i>
          </NuxtLink>
        </div>
        <div class="card-content">
          <div v-if="loading" class="text-center py-8">
            <i class="fas fa-spinner fa-spin text-3xl text-cyan-600"></i>
          </div>
          <div v-else-if="ultimiMovimenti.length === 0" class="text-center py-8 text-gray-500">
            <i class="fas fa-inbox text-4xl mb-2"></i>
            <p>Nessun movimento recente</p>
          </div>
          <div v-else class="space-y-3">
            <div
              v-for="mov in ultimiMovimenti"
              :key="mov.id"
              class="flex items-center justify-between p-3 rounded-lg border hover:shadow-sm transition-shadow"
              :class="mov.type === 'credit' ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'"
            >
              <div class="flex items-center">
                <div class="w-10 h-10 rounded-full flex items-center justify-center mr-3"
                     :class="mov.type === 'credit' ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'">
                  <i :class="mov.type === 'credit' ? 'fas fa-arrow-down' : 'fas fa-arrow-up'"></i>
                </div>
                <div>
                  <p class="font-medium text-gray-800 text-sm">{{ truncate(mov.description, 40) }}</p>
                  <div class="flex items-center text-xs text-gray-500 mt-0.5">
                    <span>{{ formatDate(mov.transaction_date) }}</span>
                    <span v-if="mov.auto_processed" class="ml-2 px-1.5 py-0.5 bg-green-100 text-green-700 rounded">
                      <i class="fas fa-robot mr-1"></i> Auto
                    </span>
                    <span v-if="mov.categoria" class="ml-2 px-1.5 py-0.5 bg-gray-100 text-gray-600 rounded">
                      {{ mov.categoria }}
                    </span>
                  </div>
                </div>
              </div>
              <div class="text-right">
                <p class="font-bold" :class="mov.type === 'credit' ? 'text-green-600' : 'text-red-600'">
                  {{ mov.type === 'credit' ? '+' : '-' }}{{ formatCurrency(Math.abs(mov.amount)) }}
                </p>
                <div class="flex items-center justify-end mt-1 space-x-1">
                  <span v-if="mov.conciliato" class="text-green-500" title="Conciliato">
                    <i class="fas fa-link text-xs"></i>
                  </span>
                  <span v-if="mov.registrato_prima_nota" class="text-cyan-500" title="In Prima Nota">
                    <i class="fas fa-check text-xs"></i>
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Riconciliazione Saldi -->
    <div class="card mb-6">
      <div class="card-header flex justify-between items-center">
        <h3 class="card-title">
          <i class="fas fa-balance-scale-right mr-2 text-cyan-600"></i>
          Riconciliazione Saldi
        </h3>
        <button @click="verificaSaldi" :disabled="verificandoSaldi" class="btn-secondary text-sm">
          <i :class="verificandoSaldi ? 'fas fa-spinner fa-spin' : 'fas fa-sync-alt'" class="mr-2"></i>
          Verifica Saldi
        </button>
      </div>
      <div class="card-content">
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div v-for="conto in contiRiconciliazione" :key="conto.id" class="p-4 rounded-lg border">
            <div class="flex items-center justify-between mb-3">
              <div>
                <h4 class="font-medium text-gray-800">{{ conto.name }}</h4>
                <p class="text-xs text-gray-500">{{ conto.bank_name }}</p>
              </div>
              <span
                class="px-2 py-1 rounded-full text-xs font-medium"
                :class="conto.discrepanza === 0 ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'"
              >
                {{ conto.discrepanza === 0 ? 'OK' : 'Discrepanza' }}
              </span>
            </div>
            <div class="space-y-2 text-sm">
              <div class="flex justify-between">
                <span class="text-gray-500">Saldo Banca:</span>
                <span class="font-medium">{{ formatCurrency(conto.saldo_banca) }}</span>
              </div>
              <div class="flex justify-between">
                <span class="text-gray-500">Saldo Contabile:</span>
                <span class="font-medium">{{ formatCurrency(conto.saldo_contabile) }}</span>
              </div>
              <div v-if="conto.discrepanza !== 0" class="flex justify-between pt-2 border-t">
                <span class="text-red-600 font-medium">Differenza:</span>
                <span class="font-bold text-red-600">{{ formatCurrency(conto.discrepanza) }}</span>
              </div>
            </div>
          </div>
        </div>
        <div v-if="contiRiconciliazione.length === 0" class="text-center py-8 text-gray-500">
          <i class="fas fa-university text-4xl mb-2"></i>
          <p>Clicca "Verifica Saldi" per controllare la riconciliazione</p>
        </div>
      </div>
    </div>

    <!-- Impostazioni Automazione -->
    <div class="card">
      <div class="card-header">
        <h3 class="card-title">
          <i class="fas fa-sliders-h mr-2 text-cyan-600"></i>
          Impostazioni Automazione
        </h3>
      </div>
      <div class="card-content">
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div class="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <div>
              <h4 class="font-medium text-gray-800">Auto-Categorizzazione</h4>
              <p class="text-xs text-gray-500 mt-1">Categorizza automaticamente i movimenti</p>
            </div>
            <label class="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" v-model="settings.auto_categorizzazione" @change="saveSettings" class="sr-only peer">
              <div class="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-cyan-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-cyan-600"></div>
            </label>
          </div>

          <div class="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <div>
              <h4 class="font-medium text-gray-800">Auto-Conciliazione</h4>
              <p class="text-xs text-gray-500 mt-1">Concilia automaticamente con match > 85%</p>
            </div>
            <label class="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" v-model="settings.auto_conciliazione" @change="saveSettings" class="sr-only peer">
              <div class="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-cyan-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-cyan-600"></div>
            </label>
          </div>

          <div class="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <div>
              <h4 class="font-medium text-gray-800">Auto-Registrazione</h4>
              <p class="text-xs text-gray-500 mt-1">Registra automaticamente in Prima Nota</p>
            </div>
            <label class="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" v-model="settings.auto_registrazione" @change="saveSettings" class="sr-only peer">
              <div class="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-cyan-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-cyan-600"></div>
            </label>
          </div>

          <div class="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <div>
              <h4 class="font-medium text-gray-800">Alert Anomalie</h4>
              <p class="text-xs text-gray-500 mt-1">Notifica per importi anomali</p>
            </div>
            <label class="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" v-model="settings.alert_anomalie" @change="saveSettings" class="sr-only peer">
              <div class="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-cyan-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-cyan-600"></div>
            </label>
          </div>
        </div>

        <div class="mt-6 p-4 bg-blue-50 rounded-lg">
          <div class="flex items-start">
            <i class="fas fa-info-circle text-blue-500 mt-0.5 mr-3"></i>
            <div class="text-sm text-blue-700">
              <p class="font-medium">Come funziona l'automazione?</p>
              <ul class="mt-2 space-y-1 text-blue-600">
                <li>• I movimenti vengono categorizzati usando le regole definite e il riconoscimento AI</li>
                <li>• La conciliazione automatica collega movimenti a fatture/costi con match > 85%</li>
                <li>• I movimenti conciliati vengono registrati automaticamente in Prima Nota</li>
                <li>• Gli alert ti notificano solo quando serve intervento manuale</li>
              </ul>
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

// State
const loading = ref(true)
const processing = ref(false)
const verificandoSaldi = ref(false)

const stats = ref({
  tasso_automazione: 0,
  movimenti_auto: 0,
  movimenti_totali: 0,
  conciliati_oggi: 0,
  conciliati_auto_oggi: 0,
  richiede_attenzione: 0,
  regole_attive: 0,
  match_da_regole: 0
})

const automation = ref({
  import_attivo: false,
  ultimo_import: null as string | null,
  categorizzazione_attiva: true,
  tasso_categorizzazione: 0,
  conciliazione_attiva: true,
  tasso_conciliazione: 0,
  prima_nota_attiva: true,
  registrazioni_auto: 0
})

const settings = reactive({
  auto_categorizzazione: true,
  auto_conciliazione: true,
  auto_registrazione: true,
  alert_anomalie: true
})

const alerts = ref<any[]>([])
const ultimiMovimenti = ref<any[]>([])
const contiRiconciliazione = ref<any[]>([])

// Utils
const formatCurrency = (v: any) => new Intl.NumberFormat('it-IT', { style: 'currency', currency: 'EUR' }).format(parseFloat(v) || 0)
const formatDate = (d: string | null) => {
  if (!d) return '-'
  const date = new Date(d)
  return `${String(date.getDate()).padStart(2, '0')}/${String(date.getMonth() + 1).padStart(2, '0')}/${date.getFullYear()}`
}
const truncate = (s: string, n: number) => s?.length > n ? s.substring(0, n) + '...' : s

const getAlertClass = (severity: string) => {
  switch (severity) {
    case 'high': return 'bg-red-50 border-red-200 text-red-800'
    case 'medium': return 'bg-amber-50 border-amber-200 text-amber-800'
    default: return 'bg-blue-50 border-blue-200 text-blue-800'
  }
}

const getAlertIcon = (type: string) => {
  switch (type) {
    case 'anomaly': return 'fas fa-exclamation-triangle text-amber-500'
    case 'uncategorized': return 'fas fa-question-circle text-blue-500'
    case 'discrepancy': return 'fas fa-not-equal text-red-500'
    case 'new_supplier': return 'fas fa-user-plus text-purple-500'
    default: return 'fas fa-info-circle text-gray-500'
  }
}

const getAlertButtonClass = (severity: string) => {
  switch (severity) {
    case 'high': return 'bg-red-100 text-red-700 hover:bg-red-200'
    case 'medium': return 'bg-amber-100 text-amber-700 hover:bg-amber-200'
    default: return 'bg-blue-100 text-blue-700 hover:bg-blue-200'
  }
}

// API Calls
const loadDashboard = async () => {
  loading.value = true
  try {
    // Load stats
    const statsRes = await fetchApi<any>('/contabilita/dashboard/stats')
    if (statsRes.success) {
      stats.value = statsRes.data || stats.value
    }

    // Load automation status
    const autoRes = await fetchApi<any>('/contabilita/dashboard/automation')
    if (autoRes.success) {
      automation.value = autoRes.data || automation.value
    }

    // Load alerts
    const alertsRes = await fetchApi<any>('/contabilita/alerts?limit=5')
    if (alertsRes.success) {
      alerts.value = alertsRes.data || []
    }

    // Load recent movements
    const movRes = await fetchApi<any>('/bank/transactions?limit=5&order=desc')
    if (movRes.success) {
      ultimiMovimenti.value = movRes.data || []
    }

    // Load settings
    const settingsRes = await fetchApi<any>('/contabilita/settings')
    if (settingsRes.success && settingsRes.data) {
      settings.auto_categorizzazione = settingsRes.data.auto_categorizzazione ?? true
      settings.auto_conciliazione = settingsRes.data.auto_conciliazione ?? true
      settings.auto_registrazione = settingsRes.data.auto_registrazione ?? true
      settings.alert_anomalie = settingsRes.data.alert_anomalie ?? true
    }
  } catch (e) {
    console.error('Errore caricamento dashboard:', e)
  } finally {
    loading.value = false
  }
}

const saveSettings = async () => {
  try {
    await fetchApi<any>('/contabilita/settings', {
      method: 'PUT',
      body: settings
    })
  } catch (e) {
    console.error('Errore salvataggio impostazioni:', e)
  }
}

const dismissAlert = async (alertId: number) => {
  try {
    await fetchApi<any>(`/contabilita/alerts/${alertId}/dismiss`, { method: 'POST' })
    alerts.value = alerts.value.filter(a => a.id !== alertId)
  } catch (e) {
    console.error('Errore dismiss alert:', e)
  }
}

const runAutoConciliazione = async () => {
  if (!confirm('Avviare la conciliazione automatica? I movimenti con alta corrispondenza verranno collegati.')) return

  processing.value = true
  try {
    const res = await fetchApi<any>('/bank/conciliazione/auto', {
      method: 'POST',
      body: { min_confidence: 85 }
    })

    if (res.success) {
      alert(`Conciliazione completata:\n- Entrate: ${res.data?.entrate_collegate || 0}\n- Uscite: ${res.data?.uscite_collegate || 0}`)
      await loadDashboard()
    } else {
      alert(res.message || 'Errore durante conciliazione')
    }
  } catch (e: any) {
    alert(e.message || 'Errore durante conciliazione')
  } finally {
    processing.value = false
  }
}

const runAutoRegistrazione = async () => {
  if (!confirm('Registrare automaticamente i movimenti conciliati in Prima Nota?')) return

  processing.value = true
  try {
    const res = await fetchApi<any>('/contabilita/auto-registrazione', {
      method: 'POST'
    })

    if (res.success) {
      alert(`Registrazione completata: ${res.data?.registrati || 0} movimenti`)
      await loadDashboard()
    } else {
      alert(res.message || 'Errore durante registrazione')
    }
  } catch (e: any) {
    alert(e.message || 'Errore durante registrazione')
  } finally {
    processing.value = false
  }
}

const verificaSaldi = async () => {
  verificandoSaldi.value = true
  try {
    const res = await fetchApi<any>('/contabilita/riconciliazione-saldi')
    if (res.success) {
      contiRiconciliazione.value = res.data || []
    }
  } catch (e) {
    console.error('Errore verifica saldi:', e)
  } finally {
    verificandoSaldi.value = false
  }
}

// Init
onMounted(async () => {
  if (!centroStore.centroCorrente && centroStore.centri.length === 0) {
    await centroStore.fetchCentri()
  }
  await loadDashboard()
})
</script>

<style scoped>
.card { @apply bg-white rounded-lg shadow; }
.card-header { @apply px-4 py-3 border-b border-gray-200; }
.card-title { @apply text-lg font-semibold text-gray-800 flex items-center; }
.card-content { @apply p-4; }
.btn-secondary { @apply bg-gray-200 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-300 disabled:opacity-50 flex items-center; }
.action-btn { @apply flex items-center p-3 rounded-lg font-medium transition-colors text-left; }
</style>
