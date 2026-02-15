<template>
  <div>
    <!-- Back Button -->
    <div class="mb-4">
      <NuxtLink to="/parti-correlate" class="text-emerald-600 hover:text-emerald-700 font-medium">
        <i class="fas fa-arrow-left mr-1"></i> Torna all'anagrafica
      </NuxtLink>
    </div>

    <!-- Stats Row -->
    <div class="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
      <div class="card p-5">
        <div class="flex items-center gap-3">
          <div class="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
            <i class="fas fa-exchange-alt text-blue-600 text-lg"></i>
          </div>
          <div>
            <p class="text-2xl font-bold text-slate-800">{{ stats.totale }}</p>
            <p class="text-sm text-slate-500">Operazioni Totali</p>
          </div>
        </div>
      </div>

      <div class="card p-5">
        <div class="flex items-center gap-3">
          <div class="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
            <i class="fas fa-euro-sign text-green-600 text-lg"></i>
          </div>
          <div>
            <p class="text-2xl font-bold text-slate-800">{{ formatCurrency(stats.importoTotale) }}</p>
            <p class="text-sm text-slate-500">Importo Totale</p>
          </div>
        </div>
      </div>

      <div class="card p-5">
        <div class="flex items-center gap-3">
          <div class="w-12 h-12 bg-amber-100 rounded-xl flex items-center justify-center">
            <i class="fas fa-exclamation-triangle text-amber-600 text-lg"></i>
          </div>
          <div>
            <p class="text-2xl font-bold text-slate-800">{{ stats.senzaDoc }}</p>
            <p class="text-sm text-slate-500">Senza Documentazione</p>
          </div>
        </div>
      </div>

      <div class="card p-5">
        <div class="flex items-center gap-3">
          <div class="w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center">
            <i class="fas fa-times-circle text-red-600 text-lg"></i>
          </div>
          <div>
            <p class="text-2xl font-bold text-slate-800">{{ stats.nonArmsLength }}</p>
            <p class="text-sm text-slate-500">Non Arm's Length</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Main Card -->
    <div class="card">
      <div class="card-header flex justify-between items-center">
        <h2 class="card-title">
          <i class="fas fa-list mr-2 text-emerald-500"></i>
          Log Globale Operazioni
        </h2>
        <button @click="exportCSV" class="btn bg-emerald-600 text-white hover:bg-emerald-700">
          <i class="fas fa-file-csv mr-1"></i> Export CSV
        </button>
      </div>

      <div class="card-content">
        <!-- Filtri -->
        <div class="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
          <div>
            <label class="block text-sm font-medium text-slate-700 mb-1">Parte Correlata</label>
            <select v-model="filtri.parteId" class="form-control">
              <option value="">Tutte</option>
              <option v-for="parte in partiCorrelate" :key="parte.id" :value="parte.id">
                {{ parte.nome }}
              </option>
            </select>
          </div>

          <div>
            <label class="block text-sm font-medium text-slate-700 mb-1">Tipo Operazione</label>
            <select v-model="filtri.tipo" class="form-control">
              <option value="">Tutti</option>
              <option value="Finanziamento soci">Finanziamento soci</option>
              <option value="Servizi">Servizi</option>
              <option value="Acquisto beni">Acquisto beni</option>
              <option value="Affitto">Affitto</option>
              <option value="Consulenza">Consulenza</option>
              <option value="Dividendi">Dividendi</option>
            </select>
          </div>

          <div>
            <label class="block text-sm font-medium text-slate-700 mb-1">Periodo</label>
            <select v-model="filtri.periodo" class="form-control">
              <option value="">Tutto lo storico</option>
              <option value="2026">2026</option>
              <option value="2025">2025</option>
              <option value="2024">2024</option>
              <option value="q4-2025">Q4 2025</option>
              <option value="q3-2025">Q3 2025</option>
            </select>
          </div>

          <div>
            <label class="block text-sm font-medium text-slate-700 mb-1">Documentazione</label>
            <select v-model="filtri.documentazione" class="form-control">
              <option value="">Tutte</option>
              <option value="si">Con documentazione</option>
              <option value="no">Senza documentazione</option>
            </select>
          </div>
        </div>

        <!-- Alert Badges -->
        <div class="flex gap-2 mb-4 flex-wrap">
          <button
            v-if="stats.senzaDoc > 0"
            @click="filtri.documentazione = 'no'"
            class="px-3 py-1 bg-amber-100 text-amber-700 rounded-full text-sm hover:bg-amber-200"
          >
            <i class="fas fa-exclamation-triangle mr-1"></i>
            {{ stats.senzaDoc }} senza documentazione
          </button>
          <button
            v-if="stats.nonArmsLength > 0"
            @click="filtri.armsLength = false"
            class="px-3 py-1 bg-red-100 text-red-700 rounded-full text-sm hover:bg-red-200"
          >
            <i class="fas fa-times-circle mr-1"></i>
            {{ stats.nonArmsLength }} non Arm's Length
          </button>
          <button
            v-if="hasActiveFilters"
            @click="resetFilters"
            class="px-3 py-1 bg-slate-100 text-slate-700 rounded-full text-sm hover:bg-slate-200"
          >
            <i class="fas fa-times mr-1"></i>
            Rimuovi filtri
          </button>
        </div>

        <!-- Loading -->
        <div v-if="loading" class="text-center py-10">
          <i class="fas fa-spinner fa-spin text-4xl text-emerald-600"></i>
          <p class="text-slate-500 mt-2">Caricamento...</p>
        </div>

        <!-- Table -->
        <div v-else class="overflow-x-auto">
          <table class="w-full">
            <thead>
              <tr class="border-b border-slate-200 bg-slate-50">
                <th class="px-4 py-3 text-left text-xs font-semibold text-slate-600 uppercase cursor-pointer" @click="sortBy('data')">
                  Data
                  <i v-if="sortField === 'data'" :class="sortDir === 'asc' ? 'fas fa-sort-up' : 'fas fa-sort-down'" class="ml-1"></i>
                </th>
                <th class="px-4 py-3 text-left text-xs font-semibold text-slate-600 uppercase">Parte Correlata</th>
                <th class="px-4 py-3 text-left text-xs font-semibold text-slate-600 uppercase">Tipo</th>
                <th class="px-4 py-3 text-left text-xs font-semibold text-slate-600 uppercase">Descrizione</th>
                <th class="px-4 py-3 text-right text-xs font-semibold text-slate-600 uppercase cursor-pointer" @click="sortBy('importo')">
                  Importo
                  <i v-if="sortField === 'importo'" :class="sortDir === 'asc' ? 'fas fa-sort-up' : 'fas fa-sort-down'" class="ml-1"></i>
                </th>
                <th class="px-4 py-3 text-center text-xs font-semibold text-slate-600 uppercase">Arm's Length</th>
                <th class="px-4 py-3 text-center text-xs font-semibold text-slate-600 uppercase">Documentazione</th>
                <th class="px-4 py-3 text-center text-xs font-semibold text-slate-600 uppercase">Azioni</th>
              </tr>
            </thead>
            <tbody>
              <tr v-if="operazioniFiltered.length === 0">
                <td colspan="8" class="text-center py-8 text-slate-500">
                  Nessuna operazione trovata
                </td>
              </tr>
              <tr
                v-for="op in operazioniFiltered"
                :key="op.id"
                :class="[
                  'border-b border-slate-100 hover:bg-slate-50',
                  !op.documentato ? 'bg-amber-50' : '',
                  !op.arms_length ? 'bg-red-50' : ''
                ]"
              >
                <td class="px-4 py-3 text-sm text-slate-600">{{ formatDate(op.data) }}</td>
                <td class="px-4 py-3">
                  <div class="flex items-center gap-2">
                    <div :class="[
                      'w-6 h-6 rounded-full flex items-center justify-center text-white text-xs',
                      op.parte.tipo === 'persona' ? 'bg-blue-500' : 'bg-purple-500'
                    ]">
                      <i :class="op.parte.tipo === 'persona' ? 'fas fa-user' : 'fas fa-building'"></i>
                    </div>
                    <NuxtLink :to="`/parti-correlate/${op.parte.id}`" class="text-emerald-600 hover:text-emerald-700 font-medium">
                      {{ op.parte.nome }}
                    </NuxtLink>
                  </div>
                </td>
                <td class="px-4 py-3">
                  <span :class="['px-2 py-1 text-xs rounded-full', getTipoOperazioneClass(op.tipo)]">
                    {{ op.tipo }}
                  </span>
                </td>
                <td class="px-4 py-3 text-sm text-slate-800">{{ op.descrizione }}</td>
                <td class="px-4 py-3 text-right text-sm font-medium text-slate-800">
                  {{ formatCurrency(op.importo) }}
                </td>
                <td class="px-4 py-3 text-center">
                  <span v-if="op.arms_length" class="text-green-600" title="Condizioni di mercato rispettate">
                    <i class="fas fa-check-circle"></i>
                  </span>
                  <span v-else class="text-red-600" title="Condizioni di mercato non verificate">
                    <i class="fas fa-times-circle"></i>
                  </span>
                </td>
                <td class="px-4 py-3 text-center">
                  <span v-if="op.documentato" class="text-green-600" title="Documentato">
                    <i class="fas fa-check-circle"></i>
                  </span>
                  <span v-else class="text-amber-600" title="Manca documentazione">
                    <i class="fas fa-exclamation-triangle"></i>
                  </span>
                </td>
                <td class="px-4 py-3 text-center">
                  <NuxtLink :to="`/parti-correlate/${op.parte.id}`" class="text-blue-600 hover:text-blue-700" title="Dettagli parte correlata">
                    <i class="fas fa-eye"></i>
                  </NuxtLink>
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
definePageMeta({ layout: 'default' })

interface ParteCorrelata {
  id: number
  tipo: 'persona' | 'societa'
  nome: string
}

interface Operazione {
  id: number
  parte: ParteCorrelata
  data: string
  tipo: string
  descrizione: string
  importo: number
  arms_length: boolean
  documentato: boolean
}

// Mock parti correlate
const partiCorrelate = ref<ParteCorrelata[]>([
  { id: 1, tipo: 'persona', nome: 'Civero Piernatale' },
  { id: 2, tipo: 'persona', nome: 'Di Vozzo Annita' },
  { id: 3, tipo: 'societa', nome: 'Horus Holding Srl' },
  { id: 4, tipo: 'societa', nome: 'A&P Consulting Srl' },
  { id: 5, tipo: 'persona', nome: 'Civero Marco' },
  { id: 6, tipo: 'persona', nome: 'Cretella Raffaella' }
])

// Mock operazioni (all operations from all related parties)
const operazioni = ref<Operazione[]>([
  // Horus Holding
  { id: 1, parte: partiCorrelate.value[2], data: '2026-01-15', tipo: 'Finanziamento soci', descrizione: 'Versamento in c/capitale', importo: 50000, arms_length: true, documentato: true },
  { id: 2, parte: partiCorrelate.value[2], data: '2025-12-01', tipo: 'Servizi', descrizione: 'Management fee Q4', importo: 15000, arms_length: true, documentato: true },
  { id: 3, parte: partiCorrelate.value[2], data: '2025-09-01', tipo: 'Servizi', descrizione: 'Management fee Q3', importo: 15000, arms_length: true, documentato: true },
  { id: 4, parte: partiCorrelate.value[2], data: '2025-06-01', tipo: 'Servizi', descrizione: 'Management fee Q2', importo: 15000, arms_length: true, documentato: true },
  { id: 5, parte: partiCorrelate.value[2], data: '2025-03-15', tipo: 'Finanziamento soci', descrizione: 'Prestito infruttifero', importo: 30000, arms_length: false, documentato: false },
  { id: 6, parte: partiCorrelate.value[2], data: '2025-03-01', tipo: 'Servizi', descrizione: 'Management fee Q1', importo: 15000, arms_length: true, documentato: true },
  // Civero Piernatale
  { id: 7, parte: partiCorrelate.value[0], data: '2025-12-20', tipo: 'Dividendi', descrizione: 'Distribuzione utili 2024', importo: 45000, arms_length: true, documentato: true },
  { id: 8, parte: partiCorrelate.value[0], data: '2025-11-01', tipo: 'Affitto', descrizione: 'Locazione immobile studio', importo: 2000, arms_length: true, documentato: true },
  // Di Vozzo Annita
  { id: 9, parte: partiCorrelate.value[1], data: '2025-12-01', tipo: 'Servizi', descrizione: 'Consulenza odontoiatrica', importo: 5000, arms_length: true, documentato: true },
  { id: 10, parte: partiCorrelate.value[1], data: '2025-09-01', tipo: 'Servizi', descrizione: 'Consulenza odontoiatrica', importo: 5000, arms_length: true, documentato: true },
  // A&P Consulting
  { id: 11, parte: partiCorrelate.value[3], data: '2025-10-15', tipo: 'Consulenza', descrizione: 'Consulenza fiscale annuale', importo: 8000, arms_length: true, documentato: true },
  { id: 12, parte: partiCorrelate.value[3], data: '2025-08-01', tipo: 'Consulenza', descrizione: 'Consulenza organizzativa', importo: 6000, arms_length: false, documentato: false },
  // Civero Marco
  { id: 13, parte: partiCorrelate.value[4], data: '2025-07-01', tipo: 'Acquisto beni', descrizione: 'Acquisto computer', importo: 2000, arms_length: true, documentato: true },
  // Cretella Raffaella
  { id: 14, parte: partiCorrelate.value[5], data: '2025-12-15', tipo: 'Servizi', descrizione: 'Bonus performance', importo: 3000, arms_length: true, documentato: true }
])

const loading = ref(false)
const sortField = ref('data')
const sortDir = ref<'asc' | 'desc'>('desc')

const filtri = reactive({
  parteId: '',
  tipo: '',
  periodo: '',
  documentazione: '',
  armsLength: undefined as boolean | undefined
})

const stats = computed(() => {
  const filtered = operazioniFiltered.value
  return {
    totale: filtered.length,
    importoTotale: filtered.reduce((sum, op) => sum + op.importo, 0),
    senzaDoc: filtered.filter(op => !op.documentato).length,
    nonArmsLength: filtered.filter(op => !op.arms_length).length
  }
})

const operazioniFiltered = computed(() => {
  let result = [...operazioni.value]

  // Filtri
  if (filtri.parteId) {
    result = result.filter(op => op.parte.id === Number(filtri.parteId))
  }
  if (filtri.tipo) {
    result = result.filter(op => op.tipo === filtri.tipo)
  }
  if (filtri.documentazione === 'si') {
    result = result.filter(op => op.documentato)
  }
  if (filtri.documentazione === 'no') {
    result = result.filter(op => !op.documentato)
  }
  if (filtri.armsLength !== undefined) {
    result = result.filter(op => op.arms_length === filtri.armsLength)
  }
  if (filtri.periodo) {
    if (filtri.periodo === '2026') {
      result = result.filter(op => op.data.startsWith('2026'))
    } else if (filtri.periodo === '2025') {
      result = result.filter(op => op.data.startsWith('2025'))
    } else if (filtri.periodo === 'q4-2025') {
      result = result.filter(op => op.data >= '2025-10-01' && op.data <= '2025-12-31')
    } else if (filtri.periodo === 'q3-2025') {
      result = result.filter(op => op.data >= '2025-07-01' && op.data <= '2025-09-30')
    }
  }

  // Sorting
  result.sort((a, b) => {
    let aVal: any, bVal: any
    if (sortField.value === 'data') {
      aVal = new Date(a.data).getTime()
      bVal = new Date(b.data).getTime()
    } else if (sortField.value === 'importo') {
      aVal = a.importo
      bVal = b.importo
    } else {
      return 0
    }

    if (sortDir.value === 'asc') {
      return aVal < bVal ? -1 : aVal > bVal ? 1 : 0
    } else {
      return aVal > bVal ? -1 : aVal < bVal ? 1 : 0
    }
  })

  return result
})

const hasActiveFilters = computed(() => {
  return !!(filtri.parteId || filtri.tipo || filtri.periodo || filtri.documentazione || filtri.armsLength !== undefined)
})

const formatDate = (dateStr: string) => {
  const date = new Date(dateStr)
  return new Intl.DateTimeFormat('it-IT').format(date)
}

const formatCurrency = (value: number) => {
  return new Intl.NumberFormat('it-IT', {
    style: 'currency',
    currency: 'EUR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(value)
}

const getTipoOperazioneClass = (tipo: string) => {
  const classes: Record<string, string> = {
    'Finanziamento soci': 'bg-purple-100 text-purple-700',
    'Servizi': 'bg-blue-100 text-blue-700',
    'Acquisto beni': 'bg-green-100 text-green-700',
    'Affitto': 'bg-amber-100 text-amber-700',
    'Consulenza': 'bg-cyan-100 text-cyan-700',
    'Dividendi': 'bg-pink-100 text-pink-700'
  }
  return classes[tipo] || 'bg-slate-100 text-slate-700'
}

const sortBy = (field: string) => {
  if (sortField.value === field) {
    sortDir.value = sortDir.value === 'asc' ? 'desc' : 'asc'
  } else {
    sortField.value = field
    sortDir.value = 'desc'
  }
}

const resetFilters = () => {
  Object.assign(filtri, {
    parteId: '',
    tipo: '',
    periodo: '',
    documentazione: '',
    armsLength: undefined
  })
}

const exportCSV = () => {
  console.log('Export CSV')
  alert('Esportazione CSV in corso...')
}
</script>

<style scoped>
.form-control {
  @apply w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent;
}

.btn {
  @apply px-4 py-2 rounded-lg font-medium transition-colors;
}
</style>
