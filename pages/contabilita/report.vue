<template>
  <div>
    <!-- Header -->
    <div class="mb-6">
      <div class="flex items-start">
        <PageHeader
          title="REPORT CONTABILE"
          subtitle="Analisi e statistiche della contabilità automatizzata"
          :related-pages="[
            { label: 'Contabilità', route: '/contabilita', icon: 'fa-calculator' },
            { label: 'Prima Nota', route: '/prima-nota', icon: 'fa-book' }
          ]"
        />
        <PageInfoButton
          title="Report Contabile"
          description="Questa pagina fornisce una vista completa delle performance contabili con analisi dettagliate. Puoi monitorare entrate, uscite, saldi e l'efficacia dell'automazione."
          :features="[
            'KPI finanziari: entrate, uscite, saldo periodo e tasso automazione',
            'Andamento mensile: grafico trend entrate/uscite nel tempo',
            'Distribuzione per categoria: visualizza dove vanno i tuoi soldi',
            'Performance automazione: monitora quanti movimenti vengono gestiti automaticamente',
            'Esporta i dati in vari formati per il commercialista'
          ]"
        />
      </div>
    </div>

    <!-- Filtri Periodo -->
    <div class="card mb-6">
      <div class="card-content">
        <div class="flex flex-wrap items-center gap-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Periodo</label>
            <select v-model="periodo" class="input-field" @change="loadReport">
              <option value="mese">Mese Corrente</option>
              <option value="trimestre">Trimestre</option>
              <option value="anno">Anno Corrente</option>
              <option value="custom">Personalizzato</option>
            </select>
          </div>
          <div v-if="periodo === 'custom'">
            <label class="block text-sm font-medium text-gray-700 mb-1">Da</label>
            <input type="date" v-model="dataInizio" class="input-field" @change="loadReport" />
          </div>
          <div v-if="periodo === 'custom'">
            <label class="block text-sm font-medium text-gray-700 mb-1">A</label>
            <input type="date" v-model="dataFine" class="input-field" @change="loadReport" />
          </div>
          <div class="flex items-end">
            <button @click="exportReport" class="btn-secondary">
              <i class="fas fa-download mr-2"></i> Esporta
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Loading -->
    <div v-if="loading" class="text-center py-12">
      <i class="fas fa-spinner fa-spin text-4xl text-cyan-600"></i>
      <p class="text-gray-500 mt-4">Generazione report in corso...</p>
    </div>

    <template v-else>
      <!-- KPI Principali -->
      <div class="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div class="bg-green-50 rounded-lg p-4">
          <div class="flex items-center justify-between">
            <div>
              <div class="text-sm text-green-600">Totale Entrate</div>
              <div class="text-2xl font-bold text-green-700">{{ formatCurrency(report.totale_entrate) }}</div>
            </div>
            <i class="fas fa-arrow-down text-3xl text-green-300"></i>
          </div>
          <div class="text-xs text-green-600 mt-2">
            {{ report.num_entrate }} movimenti
          </div>
        </div>

        <div class="bg-red-50 rounded-lg p-4">
          <div class="flex items-center justify-between">
            <div>
              <div class="text-sm text-red-600">Totale Uscite</div>
              <div class="text-2xl font-bold text-red-700">{{ formatCurrency(report.totale_uscite) }}</div>
            </div>
            <i class="fas fa-arrow-up text-3xl text-red-300"></i>
          </div>
          <div class="text-xs text-red-600 mt-2">
            {{ report.num_uscite }} movimenti
          </div>
        </div>

        <div class="rounded-lg p-4" :class="report.saldo_periodo >= 0 ? 'bg-cyan-50' : 'bg-amber-50'">
          <div class="flex items-center justify-between">
            <div>
              <div class="text-sm" :class="report.saldo_periodo >= 0 ? 'text-cyan-600' : 'text-amber-600'">Saldo Periodo</div>
              <div class="text-2xl font-bold" :class="report.saldo_periodo >= 0 ? 'text-cyan-700' : 'text-amber-700'">
                {{ formatCurrency(report.saldo_periodo) }}
              </div>
            </div>
            <i :class="report.saldo_periodo >= 0 ? 'fas fa-chart-line text-cyan-300' : 'fas fa-chart-line text-amber-300'" class="text-3xl"></i>
          </div>
          <div class="text-xs mt-2" :class="report.saldo_periodo >= 0 ? 'text-cyan-600' : 'text-amber-600'">
            {{ report.saldo_periodo >= 0 ? 'Positivo' : 'Negativo' }}
          </div>
        </div>

        <div class="bg-purple-50 rounded-lg p-4">
          <div class="flex items-center justify-between">
            <div>
              <div class="text-sm text-purple-600">Tasso Automazione</div>
              <div class="text-2xl font-bold text-purple-700">{{ report.tasso_automazione }}%</div>
            </div>
            <i class="fas fa-robot text-3xl text-purple-300"></i>
          </div>
          <div class="text-xs text-purple-600 mt-2">
            {{ report.movimenti_auto }} su {{ report.movimenti_totali }}
          </div>
        </div>
      </div>

      <!-- Grafici e Analisi -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <!-- Andamento Mensile -->
        <div class="card">
          <div class="card-header">
            <h3 class="card-title">
              <i class="fas fa-chart-area mr-2 text-cyan-600"></i>
              Andamento Mensile
            </h3>
          </div>
          <div class="card-content">
            <div class="space-y-4">
              <div v-for="mese in report.andamento_mensile" :key="mese.mese" class="p-3 bg-gray-50 rounded-lg">
                <div class="flex items-center justify-between mb-2">
                  <span class="font-medium text-gray-800">{{ mese.mese_nome }}</span>
                  <span class="font-bold" :class="mese.saldo >= 0 ? 'text-green-600' : 'text-red-600'">
                    {{ formatCurrency(mese.saldo) }}
                  </span>
                </div>
                <div class="flex items-center space-x-4 text-sm">
                  <span class="text-green-600">
                    <i class="fas fa-arrow-down mr-1"></i> {{ formatCurrency(mese.entrate) }}
                  </span>
                  <span class="text-red-600">
                    <i class="fas fa-arrow-up mr-1"></i> {{ formatCurrency(mese.uscite) }}
                  </span>
                </div>
                <!-- Progress bar -->
                <div class="mt-2 h-2 bg-gray-200 rounded-full overflow-hidden flex">
                  <div
                    class="bg-green-500 h-full"
                    :style="{ width: getPercentage(mese.entrate, mese.entrate + Math.abs(mese.uscite)) + '%' }"
                  ></div>
                  <div
                    class="bg-red-500 h-full"
                    :style="{ width: getPercentage(Math.abs(mese.uscite), mese.entrate + Math.abs(mese.uscite)) + '%' }"
                  ></div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Distribuzione per Categoria -->
        <div class="card">
          <div class="card-header">
            <h3 class="card-title">
              <i class="fas fa-chart-pie mr-2 text-cyan-600"></i>
              Distribuzione Uscite per Categoria
            </h3>
          </div>
          <div class="card-content">
            <div v-if="report.uscite_per_categoria?.length" class="space-y-3">
              <div
                v-for="cat in report.uscite_per_categoria"
                :key="cat.categoria_id"
                class="flex items-center justify-between p-2 hover:bg-gray-50 rounded"
              >
                <div class="flex items-center">
                  <div
                    class="w-4 h-4 rounded mr-3"
                    :style="{ backgroundColor: cat.colore || '#6B7280' }"
                  ></div>
                  <div>
                    <span class="font-medium text-gray-800">{{ cat.categoria_nome }}</span>
                    <span class="text-xs text-gray-500 ml-2">({{ cat.count }})</span>
                  </div>
                </div>
                <div class="text-right">
                  <span class="font-semibold text-red-600">{{ formatCurrency(cat.totale) }}</span>
                  <span class="text-xs text-gray-500 ml-2">{{ cat.percentuale }}%</span>
                </div>
              </div>
            </div>
            <div v-else class="text-center py-8 text-gray-500">
              <i class="fas fa-chart-pie text-4xl mb-2"></i>
              <p>Nessun dato disponibile</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Performance Automazione -->
      <div class="card mb-6">
        <div class="card-header">
          <h3 class="card-title">
            <i class="fas fa-tachometer-alt mr-2 text-cyan-600"></i>
            Performance Automazione
          </h3>
        </div>
        <div class="card-content">
          <div class="grid grid-cols-2 md:grid-cols-5 gap-4">
            <div class="text-center p-4 bg-gray-50 rounded-lg">
              <div class="text-3xl font-bold text-green-600">{{ report.performance?.auto_categorizzati || 0 }}</div>
              <div class="text-sm text-gray-600 mt-1">Auto-Categorizzati</div>
              <div class="text-xs text-gray-400">{{ report.performance?.perc_categorizzati || 0 }}%</div>
            </div>

            <div class="text-center p-4 bg-gray-50 rounded-lg">
              <div class="text-3xl font-bold text-cyan-600">{{ report.performance?.auto_conciliati || 0 }}</div>
              <div class="text-sm text-gray-600 mt-1">Auto-Conciliati</div>
              <div class="text-xs text-gray-400">{{ report.performance?.perc_conciliati || 0 }}%</div>
            </div>

            <div class="text-center p-4 bg-gray-50 rounded-lg">
              <div class="text-3xl font-bold text-purple-600">{{ report.performance?.auto_registrati || 0 }}</div>
              <div class="text-sm text-gray-600 mt-1">Auto-Registrati</div>
              <div class="text-xs text-gray-400">{{ report.performance?.perc_registrati || 0 }}%</div>
            </div>

            <div class="text-center p-4 bg-gray-50 rounded-lg">
              <div class="text-3xl font-bold text-amber-600">{{ report.performance?.manuali || 0 }}</div>
              <div class="text-sm text-gray-600 mt-1">Interventi Manuali</div>
              <div class="text-xs text-gray-400">{{ report.performance?.perc_manuali || 0 }}%</div>
            </div>

            <div class="text-center p-4 bg-gray-50 rounded-lg">
              <div class="text-3xl font-bold text-blue-600">{{ report.performance?.regole_applicate || 0 }}</div>
              <div class="text-sm text-gray-600 mt-1">Regole Applicate</div>
              <div class="text-xs text-gray-400">{{ report.performance?.regole_attive || 0 }} attive</div>
            </div>
          </div>
        </div>
      </div>

      <!-- Top Fornitori e Clienti -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <!-- Top Fornitori (Uscite) -->
        <div class="card">
          <div class="card-header">
            <h3 class="card-title">
              <i class="fas fa-building mr-2 text-red-500"></i>
              Top 10 Fornitori (Uscite)
            </h3>
          </div>
          <div class="card-content">
            <div v-if="report.top_fornitori?.length" class="space-y-2">
              <div
                v-for="(fornitore, idx) in report.top_fornitori"
                :key="fornitore.nome"
                class="flex items-center justify-between p-2 border-b border-gray-100 last:border-0"
              >
                <div class="flex items-center">
                  <span class="w-6 h-6 rounded-full bg-red-100 text-red-600 flex items-center justify-center text-xs font-bold mr-3">
                    {{ idx + 1 }}
                  </span>
                  <div>
                    <span class="font-medium text-gray-800">{{ fornitore.nome }}</span>
                    <span class="text-xs text-gray-500 ml-2">({{ fornitore.count }} pagamenti)</span>
                  </div>
                </div>
                <span class="font-semibold text-red-600">{{ formatCurrency(fornitore.totale) }}</span>
              </div>
            </div>
            <div v-else class="text-center py-8 text-gray-500">
              <p>Nessun fornitore nel periodo</p>
            </div>
          </div>
        </div>

        <!-- Top Clienti (Entrate) -->
        <div class="card">
          <div class="card-header">
            <h3 class="card-title">
              <i class="fas fa-users mr-2 text-green-500"></i>
              Top 10 Clienti (Entrate)
            </h3>
          </div>
          <div class="card-content">
            <div v-if="report.top_clienti?.length" class="space-y-2">
              <div
                v-for="(cliente, idx) in report.top_clienti"
                :key="cliente.nome"
                class="flex items-center justify-between p-2 border-b border-gray-100 last:border-0"
              >
                <div class="flex items-center">
                  <span class="w-6 h-6 rounded-full bg-green-100 text-green-600 flex items-center justify-center text-xs font-bold mr-3">
                    {{ idx + 1 }}
                  </span>
                  <div>
                    <span class="font-medium text-gray-800">{{ cliente.nome }}</span>
                    <span class="text-xs text-gray-500 ml-2">({{ cliente.count }} incassi)</span>
                  </div>
                </div>
                <span class="font-semibold text-green-600">{{ formatCurrency(cliente.totale) }}</span>
              </div>
            </div>
            <div v-else class="text-center py-8 text-gray-500">
              <p>Nessun cliente nel periodo</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Riconciliazione Saldi -->
      <div class="card">
        <div class="card-header">
          <h3 class="card-title">
            <i class="fas fa-balance-scale-right mr-2 text-cyan-600"></i>
            Stato Riconciliazione per Conto
          </h3>
        </div>
        <div class="card-content">
          <div v-if="report.conti?.length" class="overflow-x-auto">
            <table class="w-full">
              <thead class="bg-gray-50">
                <tr>
                  <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Conto</th>
                  <th class="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">Saldo Iniziale</th>
                  <th class="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">Entrate</th>
                  <th class="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">Uscite</th>
                  <th class="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">Saldo Finale</th>
                  <th class="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase">Conciliati</th>
                  <th class="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase">Stato</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-gray-200">
                <tr v-for="conto in report.conti" :key="conto.id" class="hover:bg-gray-50">
                  <td class="px-4 py-3">
                    <div class="font-medium text-gray-800">{{ conto.nome }}</div>
                    <div class="text-xs text-gray-500">{{ conto.banca }}</div>
                  </td>
                  <td class="px-4 py-3 text-right">{{ formatCurrency(conto.saldo_iniziale) }}</td>
                  <td class="px-4 py-3 text-right text-green-600">+{{ formatCurrency(conto.entrate) }}</td>
                  <td class="px-4 py-3 text-right text-red-600">-{{ formatCurrency(conto.uscite) }}</td>
                  <td class="px-4 py-3 text-right font-bold" :class="conto.saldo_finale >= 0 ? 'text-green-600' : 'text-red-600'">
                    {{ formatCurrency(conto.saldo_finale) }}
                  </td>
                  <td class="px-4 py-3 text-center">
                    <span class="text-sm">{{ conto.conciliati }}/{{ conto.totale_movimenti }}</span>
                    <span class="text-xs text-gray-500 ml-1">({{ conto.perc_conciliati }}%)</span>
                  </td>
                  <td class="px-4 py-3 text-center">
                    <span
                      class="px-2 py-1 rounded-full text-xs font-medium"
                      :class="conto.riconciliato ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'"
                    >
                      {{ conto.riconciliato ? 'OK' : 'Da verificare' }}
                    </span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          <div v-else class="text-center py-8 text-gray-500">
            <i class="fas fa-university text-4xl mb-2"></i>
            <p>Nessun conto bancario configurato</p>
          </div>
        </div>
      </div>
    </template>
  </div>
</template>

<script setup lang="ts">
import { useCentroStore } from '~/stores/centro'

definePageMeta({ layout: 'default' })

const { fetchApi } = useApi()
const centroStore = useCentroStore()

// State
const loading = ref(true)
const periodo = ref('mese')
const dataInizio = ref(new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString().split('T')[0])
const dataFine = ref(new Date().toISOString().split('T')[0])

const report = ref<any>({
  totale_entrate: 0,
  totale_uscite: 0,
  saldo_periodo: 0,
  num_entrate: 0,
  num_uscite: 0,
  tasso_automazione: 0,
  movimenti_auto: 0,
  movimenti_totali: 0,
  andamento_mensile: [],
  uscite_per_categoria: [],
  performance: {},
  top_fornitori: [],
  top_clienti: [],
  conti: []
})

// Utils
const formatCurrency = (v: any) => new Intl.NumberFormat('it-IT', { style: 'currency', currency: 'EUR' }).format(parseFloat(v) || 0)

const getPercentage = (value: number, total: number) => {
  if (!total) return 0
  return Math.round((value / total) * 100)
}

// Watch periodo changes
watch(periodo, (newVal) => {
  const today = new Date()
  switch (newVal) {
    case 'mese':
      dataInizio.value = new Date(today.getFullYear(), today.getMonth(), 1).toISOString().split('T')[0]
      dataFine.value = today.toISOString().split('T')[0]
      break
    case 'trimestre':
      const quarterStart = new Date(today.getFullYear(), Math.floor(today.getMonth() / 3) * 3, 1)
      dataInizio.value = quarterStart.toISOString().split('T')[0]
      dataFine.value = today.toISOString().split('T')[0]
      break
    case 'anno':
      dataInizio.value = new Date(today.getFullYear(), 0, 1).toISOString().split('T')[0]
      dataFine.value = today.toISOString().split('T')[0]
      break
  }
  if (newVal !== 'custom') {
    loadReport()
  }
})

// API Calls
const loadReport = async () => {
  loading.value = true
  try {
    const res = await fetchApi<any>(`/contabilita/report?data_inizio=${dataInizio.value}&data_fine=${dataFine.value}`)
    if (res.success) {
      report.value = res.data || report.value
    }
  } catch (e) {
    console.error('Errore caricamento report:', e)
  } finally {
    loading.value = false
  }
}

const exportReport = async () => {
  try {
    // Fetch export as blob
    const response = await fetch(`/api/contabilita/report/export?data_inizio=${dataInizio.value}&data_fine=${dataFine.value}&format=xlsx`, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('auth_token')}`
      }
    })

    if (response.ok) {
      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `report-contabile-${dataInizio.value}-${dataFine.value}.xlsx`
      document.body.appendChild(a)
      a.click()
      window.URL.revokeObjectURL(url)
      document.body.removeChild(a)
    } else {
      alert('Errore durante esportazione')
    }
  } catch (e) {
    console.error('Errore export:', e)
    alert('Errore durante esportazione')
  }
}

// Init
onMounted(async () => {
  if (!centroStore.centroCorrente && centroStore.centri.length === 0) {
    await centroStore.fetchCentri()
  }
  await loadReport()
})
</script>

<style scoped>
.card { @apply bg-white rounded-lg shadow; }
.card-header { @apply px-4 py-3 border-b border-gray-200; }
.card-title { @apply text-lg font-semibold text-gray-800 flex items-center; }
.card-content { @apply p-4; }
.input-field { @apply px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500; }
.btn-secondary { @apply bg-gray-200 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-300 flex items-center; }
</style>
