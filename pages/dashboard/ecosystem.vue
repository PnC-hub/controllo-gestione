<template>
  <div>
    <!-- Header -->
    <div class="mb-6">
      <div class="flex items-center gap-2">
        <h1 class="text-2xl font-bold text-slate-800">Dashboard Ecosistema GeniusWorld</h1>
        <PageInfoButton
          title="Ecosistema Integrato"
          description="Panoramica unificata di tutti i sistemi: Profitera (controllo gestione), Kontabila (contabilità automatica), Imperium (strategia e patrimonio)"
          :features="[
            'Status real-time da tutti i sistemi',
            'KPI finanziari e strategici unificati',
            'Health check integrato',
            'Quick actions cross-sistema'
          ]"
        />
      </div>
      <p class="text-slate-500">Tutti i tuoi sistemi in un'unica vista</p>
    </div>

    <!-- System Status Cards -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
      <!-- Profitera -->
      <div class="card">
        <div class="card-header bg-emerald-50">
          <div class="flex items-center justify-between">
            <div class="flex items-center gap-3">
              <div class="w-12 h-12 bg-emerald-500 rounded-xl flex items-center justify-center">
                <i class="fas fa-chart-pie text-white text-xl"></i>
              </div>
              <div>
                <h3 class="font-bold text-slate-800">Profitera</h3>
                <p class="text-xs text-slate-500">Controllo di Gestione</p>
              </div>
            </div>
            <div :class="[
              'w-3 h-3 rounded-full',
              systems.profitera.online ? 'bg-green-500' : 'bg-red-500'
            ]"></div>
          </div>
        </div>
        <div class="card-content">
          <div class="space-y-3">
            <div class="flex justify-between">
              <span class="text-sm text-slate-600">Aziende gestite</span>
              <span class="font-semibold">{{ systems.profitera.aziende }}</span>
            </div>
            <div class="flex justify-between">
              <span class="text-sm text-slate-600">Movimenti mese</span>
              <span class="font-semibold">{{ systems.profitera.movimenti }}</span>
            </div>
            <div class="flex justify-between">
              <span class="text-sm text-slate-600">Conciliazione</span>
              <span class="font-semibold text-green-600">{{ systems.profitera.conciliazione }}%</span>
            </div>
          </div>
          <NuxtLink to="/dashboard" class="mt-4 block text-center py-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 rounded-lg transition text-sm font-medium">
            Apri Dashboard →
          </NuxtLink>
        </div>
      </div>

      <!-- Kontabila -->
      <div class="card">
        <div class="card-header bg-blue-50">
          <div class="flex items-center justify-between">
            <div class="flex items-center gap-3">
              <div class="w-12 h-12 bg-blue-500 rounded-xl flex items-center justify-center">
                <i class="fas fa-robot text-white text-xl"></i>
              </div>
              <div>
                <h3 class="font-bold text-slate-800">Kontabila</h3>
                <p class="text-xs text-slate-500">Contabilità Automatica</p>
              </div>
            </div>
            <div :class="[
              'w-3 h-3 rounded-full',
              systems.kontabila.online ? 'bg-green-500' : 'bg-red-500'
            ]"></div>
          </div>
        </div>
        <div class="card-content">
          <div class="space-y-3">
            <div class="flex justify-between">
              <span class="text-sm text-slate-600">Fatture emesse</span>
              <span class="font-semibold">{{ systems.kontabila.fatture }}</span>
            </div>
            <div class="flex justify-between">
              <span class="text-sm text-slate-600">Autofatture</span>
              <span class="font-semibold">{{ systems.kontabila.autofatture }}</span>
            </div>
            <div class="flex justify-between">
              <span class="text-sm text-slate-600">Sync automatiche</span>
              <span class="font-semibold text-blue-600">{{ systems.kontabila.sync_ok }}</span>
            </div>
          </div>
          <a href="http://localhost:3001" target="_blank" class="mt-4 block text-center py-2 bg-blue-50 hover:bg-blue-100 text-blue-700 rounded-lg transition text-sm font-medium">
            Apri Kontabila →
          </a>
        </div>
      </div>

      <!-- Imperium -->
      <div class="card">
        <div class="card-header bg-amber-50">
          <div class="flex items-center justify-between">
            <div class="flex items-center gap-3">
              <div class="w-12 h-12 bg-amber-500 rounded-xl flex items-center justify-center">
                <i class="fas fa-shield-alt text-white text-xl"></i>
              </div>
              <div>
                <h3 class="font-bold text-slate-800">Imperium</h3>
                <p class="text-xs text-slate-500">Decision Engine</p>
              </div>
            </div>
            <div :class="[
              'w-3 h-3 rounded-full',
              systems.imperium.online ? 'bg-green-500' : 'bg-red-500'
            ]"></div>
          </div>
        </div>
        <div class="card-content">
          <div class="space-y-3">
            <div class="flex justify-between">
              <span class="text-sm text-slate-600">Patrimonio totale</span>
              <span class="font-semibold">{{ formatCurrency(systems.imperium.patrimonio) }}</span>
            </div>
            <div class="flex justify-between">
              <span class="text-sm text-slate-600">Health Score</span>
              <span class="font-semibold text-amber-600">{{ systems.imperium.health_score }}%</span>
            </div>
            <div class="flex justify-between">
              <span class="text-sm text-slate-600">Status</span>
              <span :class="[
                'font-semibold',
                systems.imperium.status === 'aggressive' ? 'text-green-600' :
                systems.imperium.status === 'stable' ? 'text-amber-600' : 'text-red-600'
              ]">{{ systems.imperium.status_label }}</span>
            </div>
          </div>
          <a href="http://localhost:3000" target="_blank" class="mt-4 block text-center py-2 bg-amber-50 hover:bg-amber-100 text-amber-700 rounded-lg transition text-sm font-medium">
            Apri Imperium →
          </a>
        </div>
      </div>
    </div>

    <!-- Unified KPIs -->
    <div class="card mb-8">
      <div class="card-header">
        <h2 class="card-title">
          <i class="fas fa-chart-line text-emerald-600 mr-2"></i>
          KPI Finanziari Unificati
        </h2>
      </div>
      <div class="card-content">
        <div class="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div class="text-center p-4 bg-gradient-to-br from-emerald-50 to-green-50 rounded-xl">
            <div class="text-3xl font-bold text-emerald-700">{{ formatCurrency(kpi.fatturato_totale) }}</div>
            <div class="text-sm text-slate-600 mt-1">Fatturato Totale</div>
            <div class="text-xs text-emerald-600 mt-1">
              <i class="fas fa-arrow-up"></i> +{{ kpi.fatturato_var }}% vs mese scorso
            </div>
          </div>

          <div class="text-center p-4 bg-gradient-to-br from-blue-50 to-cyan-50 rounded-xl">
            <div class="text-3xl font-bold text-blue-700">{{ formatCurrency(kpi.liquidita) }}</div>
            <div class="text-sm text-slate-600 mt-1">Liquidità Disponibile</div>
            <div class="text-xs text-blue-600 mt-1">Da Kontabila + Imperium</div>
          </div>

          <div class="text-center p-4 bg-gradient-to-br from-amber-50 to-orange-50 rounded-xl">
            <div class="text-3xl font-bold text-amber-700">{{ kpi.margine_percentuale }}%</div>
            <div class="text-sm text-slate-600 mt-1">Margine Operativo</div>
            <div class="text-xs text-amber-600 mt-1">EBITDA consolidato</div>
          </div>

          <div class="text-center p-4 bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl">
            <div class="text-3xl font-bold text-purple-700">{{ kpi.roi }}%</div>
            <div class="text-sm text-slate-600 mt-1">ROI Medio</div>
            <div class="text-xs text-purple-600 mt-1">Da investimenti Imperium</div>
          </div>
        </div>
      </div>
    </div>

    <!-- Integration Status -->
    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div class="card">
        <div class="card-header">
          <h3 class="card-title">
            <i class="fas fa-sync text-blue-600 mr-2"></i>
            Status Sincronizzazione
          </h3>
        </div>
        <div class="card-content">
          <div class="space-y-3">
            <div class="flex items-center justify-between p-3 bg-green-50 rounded-lg">
              <div class="flex items-center gap-3">
                <i class="fas fa-check-circle text-green-600"></i>
                <div>
                  <div class="font-medium text-sm">Kontabila → Profitera</div>
                  <div class="text-xs text-slate-500">Ultima sync: {{ sync.kontabila.last_sync }}</div>
                </div>
              </div>
              <span class="text-xs bg-green-100 text-green-700 px-2 py-1 rounded">Attiva</span>
            </div>

            <div class="flex items-center justify-between p-3 bg-green-50 rounded-lg">
              <div class="flex items-center gap-3">
                <i class="fas fa-check-circle text-green-600"></i>
                <div>
                  <div class="font-medium text-sm">Imperium → Profitera</div>
                  <div class="text-xs text-slate-500">Ultima sync: {{ sync.imperium.last_sync }}</div>
                </div>
              </div>
              <span class="text-xs bg-green-100 text-green-700 px-2 py-1 rounded">Attiva</span>
            </div>

            <div class="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
              <div class="flex items-center gap-3">
                <i class="fas fa-exchange-alt text-blue-600"></i>
                <div>
                  <div class="font-medium text-sm">Sync Bidirezionale</div>
                  <div class="text-xs text-slate-500">Budget e previsioni</div>
                </div>
              </div>
              <span class="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded">Configurata</span>
            </div>
          </div>
        </div>
      </div>

      <div class="card">
        <div class="card-header">
          <h3 class="card-title">
            <i class="fas fa-bolt text-amber-600 mr-2"></i>
            Azioni Cross-Sistema
          </h3>
        </div>
        <div class="card-content">
          <div class="space-y-2">
            <button class="w-full p-3 bg-gradient-to-r from-emerald-50 to-green-50 hover:from-emerald-100 hover:to-green-100 rounded-lg transition text-left">
              <div class="font-medium text-sm text-slate-800">Sincronizza Budget Imperium → Profitera</div>
              <div class="text-xs text-slate-500 mt-1">Aggiorna previsioni finanziarie da piano strategico</div>
            </button>

            <button class="w-full p-3 bg-gradient-to-r from-blue-50 to-cyan-50 hover:from-blue-100 hover:to-cyan-100 rounded-lg transition text-left">
              <div class="font-medium text-sm text-slate-800">Export Costi Profitera → Imperium</div>
              <div class="text-xs text-slate-500 mt-1">Aggiorna dashboard patrimonio con ultimi costi</div>
            </button>

            <button class="w-full p-3 bg-gradient-to-r from-amber-50 to-orange-50 hover:from-amber-100 hover:to-orange-100 rounded-lg transition text-left">
              <div class="font-medium text-sm text-slate-800">Genera Report Consolidato</div>
              <div class="text-xs text-slate-500 mt-1">PDF con dati da tutti i sistemi</div>
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({ layout: 'default' })

const systems = ref({
  profitera: {
    online: true,
    aziende: 5,
    movimenti: 324,
    conciliazione: 87
  },
  kontabila: {
    online: true,
    fatture: 45,
    autofatture: 12,
    sync_ok: 156
  },
  imperium: {
    online: true,
    patrimonio: 1250000,
    health_score: 78,
    status: 'stable',
    status_label: 'Stabile'
  }
})

const kpi = ref({
  fatturato_totale: 245000,
  fatturato_var: 12,
  liquidita: 145000,
  margine_percentuale: 32,
  roi: 18
})

const sync = ref({
  kontabila: {
    last_sync: '2 minuti fa',
    status: 'ok'
  },
  imperium: {
    last_sync: '5 minuti fa',
    status: 'ok'
  }
})

const formatCurrency = (v: any) =>
  new Intl.NumberFormat('it-IT', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 }).format(parseFloat(v) || 0)

// Polling per aggiornamenti real-time
const fetchStatus = async () => {
  try {
    const res = await $fetch<any>('/api/integrations/status')
    if (res.success) {
      systems.value = res.systems
      kpi.value = res.kpi
      sync.value = res.sync
    }
  } catch (error) {
    console.error('[Ecosystem] Errore fetch status:', error)
  }
}

let pollingInterval: NodeJS.Timeout | null = null

onMounted(async () => {
  // Caricamento iniziale
  await fetchStatus()

  // Polling ogni 30 secondi
  pollingInterval = setInterval(fetchStatus, 30000)
})

onUnmounted(() => {
  // Cleanup: ferma polling quando component viene smontato
  if (pollingInterval) {
    clearInterval(pollingInterval)
  }
})
</script>

<style scoped>
.card { @apply bg-white rounded-lg shadow; }
.card-header { @apply px-6 py-4 border-b border-slate-200; }
.card-title { @apply text-lg font-semibold text-slate-800 flex items-center; }
.card-content { @apply p-6; }
</style>
