<template>
  <div>
    <!-- Header -->
    <div class="mb-6">
      <div class="flex items-center gap-2">
        <h1 class="text-2xl font-bold text-slate-800">Contratti</h1>
        <PageInfoButton
          title="Contratti"
          description="Gestione contratti con alert scadenze e rinnovi taciti"
          :features="[
            'Stats: attivi, in scadenza, rinnovo tacito',
            'Filtri per tipo e stato',
            'Alert parti correlate'
          ]"
        />
      </div>
    </div>

    <!-- Stats Cards -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
      <div class="card">
        <div class="card-content">
          <div class="flex items-center justify-between mb-2">
            <span class="text-sm text-slate-500">Contratti Attivi</span>
            <i class="fas fa-check-circle text-emerald-500"></i>
          </div>
          <p class="text-3xl font-bold text-slate-800">{{ stats.attivi }}</p>
        </div>
      </div>

      <div class="card">
        <div class="card-content">
          <div class="flex items-center justify-between mb-2">
            <span class="text-sm text-slate-500">In Scadenza (90gg)</span>
            <i class="fas fa-exclamation-triangle text-orange-500"></i>
          </div>
          <p class="text-3xl font-bold text-orange-600">{{ stats.inScadenza }}</p>
        </div>
      </div>

      <div class="card">
        <div class="card-content">
          <div class="flex items-center justify-between mb-2">
            <span class="text-sm text-slate-500">Rinnovo Tacito Imminente</span>
            <i class="fas fa-bell text-red-500"></i>
          </div>
          <p class="text-3xl font-bold text-red-600">{{ stats.rinnovoTacito }}</p>
        </div>
      </div>

      <div class="card">
        <div class="card-content">
          <div class="flex items-center justify-between mb-2">
            <span class="text-sm text-slate-500">Con Parti Correlate</span>
            <i class="fas fa-users text-blue-500"></i>
          </div>
          <p class="text-3xl font-bold text-blue-600">{{ stats.partiCorrelate }}</p>
        </div>
      </div>
    </div>

    <!-- Filters & Actions -->
    <div class="card mb-6">
      <div class="card-content">
        <div class="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
          <div class="flex flex-wrap gap-3 flex-1">
            <input
              v-model="searchQuery"
              type="text"
              placeholder="Cerca per controparte o oggetto..."
              class="px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:border-emerald-500 flex-1 min-w-[250px]"
            />

            <select v-model="filterCategoria" class="px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:border-emerald-500">
              <option value="">Tutte le categorie</option>
              <option value="Locazione">Locazione</option>
              <option value="Fornitura">Fornitura</option>
              <option value="Servizi">Servizi</option>
              <option value="Consulenza">Consulenza</option>
              <option value="Assicurazione">Assicurazione</option>
              <option value="Leasing">Leasing</option>
            </select>

            <select v-model="filterStato" class="px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:border-emerald-500">
              <option value="">Tutti gli stati</option>
              <option value="attivo">Attivo</option>
              <option value="scadenza">In scadenza</option>
              <option value="critico">Critico</option>
            </select>

            <select v-model="filterPartiCorrelate" class="px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:border-emerald-500">
              <option value="">Parti correlate</option>
              <option value="si">Sì</option>
              <option value="no">No</option>
            </select>
          </div>

          <div class="flex gap-2">
            <NuxtLink to="/contratti/scadenzario" class="px-4 py-2 bg-slate-100 text-slate-700 rounded-lg hover:bg-slate-200 transition-colors flex items-center gap-2">
              <i class="fas fa-calendar-alt"></i>
              <span>Scadenzario</span>
            </NuxtLink>
            <button @click="showCreateModal = true" class="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors flex items-center gap-2">
              <i class="fas fa-plus"></i>
              <span>Nuovo Contratto</span>
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Contracts Table -->
    <div class="card">
      <div class="card-header">
        <h3 class="card-title">Contratti ({{ filteredContracts.length }})</h3>
      </div>
      <div class="overflow-x-auto">
        <table class="w-full">
          <thead class="bg-slate-50 border-b border-slate-200">
            <tr>
              <th class="px-6 py-3 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">Contratto</th>
              <th class="px-6 py-3 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">Controparte</th>
              <th class="px-6 py-3 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">Categoria</th>
              <th class="px-6 py-3 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">Valore Annuo</th>
              <th class="px-6 py-3 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">Scadenza</th>
              <th class="px-6 py-3 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">Rinnovo</th>
              <th class="px-6 py-3 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">Stato</th>
              <th class="px-6 py-3 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">Azioni</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-slate-200">
            <tr v-for="contract in filteredContracts" :key="contract.id" class="hover:bg-slate-50 transition-colors">
              <td class="px-6 py-4">
                <div class="flex flex-col">
                  <NuxtLink :to="`/contratti/${contract.id}`" class="font-medium text-slate-800 hover:text-emerald-600">
                    {{ contract.oggetto }}
                  </NuxtLink>
                  <span v-if="contract.parteCorrelata" class="inline-flex items-center gap-1 mt-1 text-xs bg-orange-100 text-orange-700 px-2 py-0.5 rounded w-fit">
                    <i class="fas fa-exclamation-triangle"></i>
                    Parte Correlata
                  </span>
                </div>
              </td>
              <td class="px-6 py-4 text-sm text-slate-600">{{ contract.controparte }}</td>
              <td class="px-6 py-4">
                <span :class="getCategoryBadgeClass(contract.categoria)" class="px-2.5 py-1 rounded-full text-xs font-medium">
                  {{ contract.categoria }}
                </span>
              </td>
              <td class="px-6 py-4 text-sm font-semibold text-slate-800">{{ formatCurrency(contract.valoreAnnuo) }}</td>
              <td class="px-6 py-4 text-sm text-slate-600">
                <span v-if="contract.scadenza">{{ formatDate(contract.scadenza) }}</span>
                <span v-else class="text-slate-400">Indeterminato</span>
              </td>
              <td class="px-6 py-4 text-sm text-slate-600">{{ contract.tipoRinnovo }}</td>
              <td class="px-6 py-4">
                <span :class="getStatusBadgeClass(contract.statoCalcolato)" class="px-2.5 py-1 rounded-full text-xs font-medium flex items-center gap-1 w-fit">
                  <i :class="getStatusIcon(contract.statoCalcolato)"></i>
                  {{ contract.statoLabel }}
                </span>
              </td>
              <td class="px-6 py-4">
                <NuxtLink :to="`/contratti/${contract.id}`" class="text-emerald-600 hover:text-emerald-800">
                  <i class="fas fa-eye"></i>
                </NuxtLink>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Create Modal (placeholder) -->
    <div v-if="showCreateModal" class="fixed inset-0 bg-black/50 flex items-center justify-center z-50" @click.self="showCreateModal = false">
      <div class="bg-white rounded-xl p-6 max-w-2xl w-full mx-4">
        <h3 class="text-xl font-bold text-slate-800 mb-4">Nuovo Contratto</h3>
        <p class="text-slate-600 mb-4">Funzionalità in sviluppo</p>
        <button @click="showCreateModal = false" class="px-4 py-2 bg-slate-200 text-slate-700 rounded-lg hover:bg-slate-300">
          Chiudi
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  layout: 'default',
  middleware: ['auth']
})

interface Contract {
  id: number
  oggetto: string
  controparte: string
  categoria: string
  valoreAnnuo: number
  scadenza: string | null
  tipoRinnovo: string
  parteCorrelata: boolean
  statoCalcolato: 'attivo' | 'scadenza' | 'critico'
  statoLabel: string
}

const searchQuery = ref('')
const filterCategoria = ref('')
const filterStato = ref('')
const filterPartiCorrelate = ref('')
const showCreateModal = ref(false)

const { data: contracts } = await useFetch<Contract[]>('/api/contratti')

const stats = computed(() => {
  const list = contracts.value || []
  return {
    attivi: list.filter(c => c.statoCalcolato === 'attivo').length,
    inScadenza: list.filter(c => c.statoCalcolato === 'scadenza').length,
    rinnovoTacito: list.filter(c => c.statoCalcolato === 'critico').length,
    partiCorrelate: list.filter(c => c.parteCorrelata).length
  }
})

const filteredContracts = computed(() => {
  let list = contracts.value || []

  if (searchQuery.value) {
    const q = searchQuery.value.toLowerCase()
    list = list.filter(c =>
      c.controparte.toLowerCase().includes(q) ||
      c.oggetto.toLowerCase().includes(q)
    )
  }

  if (filterCategoria.value) {
    list = list.filter(c => c.categoria === filterCategoria.value)
  }

  if (filterStato.value) {
    list = list.filter(c => c.statoCalcolato === filterStato.value)
  }

  if (filterPartiCorrelate.value) {
    const si = filterPartiCorrelate.value === 'si'
    list = list.filter(c => c.parteCorrelata === si)
  }

  return list
})

const getCategoryBadgeClass = (categoria: string) => {
  const classes: Record<string, string> = {
    'Locazione': 'bg-blue-100 text-blue-700',
    'Fornitura': 'bg-emerald-100 text-emerald-700',
    'Servizi': 'bg-purple-100 text-purple-700',
    'Consulenza': 'bg-cyan-100 text-cyan-700',
    'Assicurazione': 'bg-yellow-100 text-yellow-700',
    'Leasing': 'bg-slate-100 text-slate-700'
  }
  return classes[categoria] || 'bg-slate-100 text-slate-700'
}

const getStatusBadgeClass = (stato: string) => {
  const classes: Record<string, string> = {
    'attivo': 'bg-emerald-100 text-emerald-700',
    'scadenza': 'bg-orange-100 text-orange-700',
    'critico': 'bg-red-100 text-red-700'
  }
  return classes[stato] || 'bg-slate-100 text-slate-700'
}

const getStatusIcon = (stato: string) => {
  const icons: Record<string, string> = {
    'attivo': 'fas fa-check-circle',
    'scadenza': 'fas fa-exclamation-triangle',
    'critico': 'fas fa-exclamation-circle'
  }
  return icons[stato] || 'fas fa-circle'
}

const formatCurrency = (value: number) => {
  return new Intl.NumberFormat('it-IT', {
    style: 'currency',
    currency: 'EUR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(value)
}

const formatDate = (dateStr: string) => {
  return new Date(dateStr).toLocaleDateString('it-IT', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  })
}
</script>
