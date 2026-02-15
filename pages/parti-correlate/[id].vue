<template>
  <div>
    <!-- Back Button -->
    <div class="mb-4">
      <NuxtLink to="/parti-correlate" class="text-emerald-600 hover:text-emerald-700 font-medium">
        <i class="fas fa-arrow-left mr-1"></i> Torna all'elenco
      </NuxtLink>
    </div>

    <!-- Loading -->
    <div v-if="loading" class="text-center py-10">
      <i class="fas fa-spinner fa-spin text-4xl text-emerald-600"></i>
      <p class="text-slate-500 mt-2">Caricamento...</p>
    </div>

    <div v-else>
      <!-- Info Card -->
      <div class="card mb-6">
        <div class="card-header flex justify-between items-center">
          <h2 class="card-title">
            <i :class="parte.tipo === 'persona' ? 'fas fa-user' : 'fas fa-building'" class="mr-2 text-emerald-500"></i>
            {{ parte.nome }}
          </h2>
          <div class="flex gap-2">
            <button @click="generateReport" class="btn bg-slate-600 text-white hover:bg-slate-700">
              <i class="fas fa-file-pdf mr-1"></i> Genera Report
            </button>
            <button @click="editParte" class="btn bg-blue-600 text-white hover:bg-blue-700">
              <i class="fas fa-edit mr-1"></i> Modifica
            </button>
          </div>
        </div>
        <div class="card-content">
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div>
              <label class="text-sm font-semibold text-slate-600 uppercase">Tipo</label>
              <p class="text-slate-800 font-medium mt-1">
                <span :class="[
                  'px-2 py-1 text-sm rounded-full',
                  parte.tipo === 'persona' ? 'bg-blue-100 text-blue-700' : 'bg-purple-100 text-purple-700'
                ]">
                  {{ parte.tipo === 'persona' ? 'Persona Fisica' : 'Società' }}
                </span>
              </p>
            </div>

            <div v-if="parte.codice_fiscale">
              <label class="text-sm font-semibold text-slate-600 uppercase">Codice Fiscale</label>
              <p class="text-slate-800 font-medium mt-1">{{ parte.codice_fiscale }}</p>
            </div>

            <div v-if="parte.partita_iva">
              <label class="text-sm font-semibold text-slate-600 uppercase">Partita IVA</label>
              <p class="text-slate-800 font-medium mt-1">{{ parte.partita_iva }}</p>
            </div>

            <div>
              <label class="text-sm font-semibold text-slate-600 uppercase">Relazione</label>
              <p class="text-slate-800 font-medium mt-1">{{ parte.relazione }}</p>
              <p v-if="parte.dettaglio_relazione" class="text-slate-500 text-sm">{{ parte.dettaglio_relazione }}</p>
            </div>

            <div>
              <label class="text-sm font-semibold text-slate-600 uppercase">% Partecipazione</label>
              <p class="text-slate-800 font-medium mt-1">
                {{ parte.percentuale_partecipazione ? parte.percentuale_partecipazione + '%' : 'Nessuna' }}
              </p>
            </div>

            <div>
              <label class="text-sm font-semibold text-slate-600 uppercase">Ruoli</label>
              <p class="text-slate-800 font-medium mt-1">{{ parte.ruoli || 'Nessuno' }}</p>
            </div>

            <div>
              <label class="text-sm font-semibold text-slate-600 uppercase">Data Registrazione</label>
              <p class="text-slate-800 font-medium mt-1">{{ formatDate(parte.data_registrazione) }}</p>
            </div>

            <div>
              <label class="text-sm font-semibold text-slate-600 uppercase">N° Operazioni</label>
              <p class="text-slate-800 font-medium mt-1">{{ parte.num_operazioni }}</p>
            </div>

            <div>
              <label class="text-sm font-semibold text-slate-600 uppercase">Stato Compliance</label>
              <p class="mt-1">
                <span v-if="parte.operazioni_senza_doc === 0" class="text-green-600 font-medium">
                  <i class="fas fa-check-circle mr-1"></i> Completo
                </span>
                <span v-else class="text-amber-600 font-medium">
                  <i class="fas fa-exclamation-triangle mr-1"></i> {{ parte.operazioni_senza_doc }} senza documentazione
                </span>
              </p>
            </div>
          </div>
        </div>
      </div>

      <!-- Tabs -->
      <div class="card">
        <div class="border-b border-slate-200">
          <div class="flex gap-4 px-6">
            <button
              @click="activeTab = 'operazioni'"
              :class="[
                'py-3 px-4 font-medium border-b-2 transition-colors',
                activeTab === 'operazioni'
                  ? 'border-emerald-500 text-emerald-600'
                  : 'border-transparent text-slate-600 hover:text-slate-800'
              ]"
            >
              <i class="fas fa-exchange-alt mr-2"></i>
              Operazioni ({{ operazioni.length }})
            </button>
            <button
              @click="activeTab = 'documenti'"
              :class="[
                'py-3 px-4 font-medium border-b-2 transition-colors',
                activeTab === 'documenti'
                  ? 'border-emerald-500 text-emerald-600'
                  : 'border-transparent text-slate-600 hover:text-slate-800'
              ]"
            >
              <i class="fas fa-file-alt mr-2"></i>
              Documenti ({{ documenti.length }})
            </button>
          </div>
        </div>

        <!-- Operazioni Tab -->
        <div v-if="activeTab === 'operazioni'" class="card-content">
          <div class="flex justify-between items-center mb-4">
            <h3 class="text-lg font-semibold text-slate-800">
              Elenco Operazioni
            </h3>
            <button @click="showNewOperazione = true" class="btn bg-emerald-600 text-white hover:bg-emerald-700">
              <i class="fas fa-plus mr-1"></i> Nuova Operazione
            </button>
          </div>

          <div class="overflow-x-auto">
            <table class="w-full">
              <thead>
                <tr class="border-b border-slate-200 bg-slate-50">
                  <th class="px-4 py-3 text-left text-xs font-semibold text-slate-600 uppercase">Data</th>
                  <th class="px-4 py-3 text-left text-xs font-semibold text-slate-600 uppercase">Tipo</th>
                  <th class="px-4 py-3 text-left text-xs font-semibold text-slate-600 uppercase">Descrizione</th>
                  <th class="px-4 py-3 text-right text-xs font-semibold text-slate-600 uppercase">Importo</th>
                  <th class="px-4 py-3 text-center text-xs font-semibold text-slate-600 uppercase">Arm's Length</th>
                  <th class="px-4 py-3 text-center text-xs font-semibold text-slate-600 uppercase">Documentazione</th>
                </tr>
              </thead>
              <tbody>
                <tr v-if="operazioni.length === 0">
                  <td colspan="6" class="text-center py-8 text-slate-500">
                    Nessuna operazione registrata
                  </td>
                </tr>
                <tr v-for="op in operazioni" :key="op.id" class="border-b border-slate-100 hover:bg-slate-50">
                  <td class="px-4 py-3 text-sm text-slate-600">{{ formatDate(op.data) }}</td>
                  <td class="px-4 py-3">
                    <span :class="[
                      'px-2 py-1 text-xs rounded-full',
                      getTipoOperazioneClass(op.tipo)
                    ]">
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
                    <span v-else class="text-red-600" title="Manca documentazione">
                      <i class="fas fa-exclamation-triangle"></i> Mancante
                    </span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <!-- Documenti Tab -->
        <div v-if="activeTab === 'documenti'" class="card-content">
          <div class="flex justify-between items-center mb-4">
            <h3 class="text-lg font-semibold text-slate-800">
              Documenti Giustificativi
            </h3>
            <button @click="uploadDocumento" class="btn bg-emerald-600 text-white hover:bg-emerald-700">
              <i class="fas fa-upload mr-1"></i> Carica Documento
            </button>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div v-if="documenti.length === 0" class="col-span-full text-center py-8 text-slate-500">
              Nessun documento caricato
            </div>
            <div v-for="doc in documenti" :key="doc.id" class="border border-slate-200 rounded-lg p-4 hover:border-emerald-300 transition-colors">
              <div class="flex items-start gap-3">
                <div class="w-10 h-10 bg-emerald-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <i class="fas fa-file-pdf text-emerald-600"></i>
                </div>
                <div class="flex-1 min-w-0">
                  <h4 class="text-sm font-medium text-slate-800 truncate">{{ doc.nome }}</h4>
                  <p class="text-xs text-slate-500">{{ doc.tipo }}</p>
                  <p class="text-xs text-slate-400 mt-1">{{ formatDate(doc.data_upload) }}</p>
                  <div class="flex gap-2 mt-2">
                    <button @click="viewDocumento(doc)" class="text-xs text-blue-600 hover:text-blue-700">
                      <i class="fas fa-eye mr-1"></i> Visualizza
                    </button>
                    <button @click="deleteDocumento(doc)" class="text-xs text-red-600 hover:text-red-700">
                      <i class="fas fa-trash mr-1"></i> Elimina
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- New Operazione Modal -->
    <div v-if="showNewOperazione" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div class="bg-white rounded-lg shadow-xl max-w-2xl w-full mx-4">
        <div class="p-6 border-b border-slate-200">
          <h3 class="text-xl font-bold text-slate-800">Nuova Operazione</h3>
        </div>
        <div class="p-6 space-y-4">
          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium text-slate-700 mb-1">Data *</label>
              <input v-model="operazioneForm.data" type="date" class="form-control" required>
            </div>
            <div>
              <label class="block text-sm font-medium text-slate-700 mb-1">Tipo *</label>
              <select v-model="operazioneForm.tipo" class="form-control" required>
                <option value="Finanziamento soci">Finanziamento soci</option>
                <option value="Servizi">Servizi</option>
                <option value="Acquisto beni">Acquisto beni</option>
                <option value="Affitto">Affitto</option>
                <option value="Consulenza">Consulenza</option>
                <option value="Dividendi">Dividendi</option>
              </select>
            </div>
          </div>

          <div>
            <label class="block text-sm font-medium text-slate-700 mb-1">Descrizione *</label>
            <input v-model="operazioneForm.descrizione" type="text" class="form-control" required>
          </div>

          <div>
            <label class="block text-sm font-medium text-slate-700 mb-1">Importo (€) *</label>
            <input v-model.number="operazioneForm.importo" type="number" step="0.01" class="form-control" required>
          </div>

          <div class="flex items-center gap-4">
            <label class="flex items-center gap-2">
              <input v-model="operazioneForm.arms_length" type="checkbox" class="rounded border-slate-300 text-emerald-600">
              <span class="text-sm text-slate-700">Condizioni Arm's Length verificate</span>
            </label>

            <label class="flex items-center gap-2">
              <input v-model="operazioneForm.documentato" type="checkbox" class="rounded border-slate-300 text-emerald-600">
              <span class="text-sm text-slate-700">Documentazione presente</span>
            </label>
          </div>
        </div>
        <div class="p-6 border-t border-slate-200 flex justify-end gap-2">
          <button @click="showNewOperazione = false" class="btn bg-slate-500 text-white hover:bg-slate-600">
            Annulla
          </button>
          <button @click="saveOperazione" class="btn bg-emerald-600 text-white hover:bg-emerald-700">
            <i class="fas fa-save mr-1"></i> Salva
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({ layout: 'default' })

const route = useRoute()
const parteId = Number(route.params.id)

interface Operazione {
  id: number
  data: string
  tipo: string
  descrizione: string
  importo: number
  arms_length: boolean
  documentato: boolean
}

interface Documento {
  id: number
  nome: string
  tipo: string
  data_upload: string
}

// Mock data Horus Holding
const parte = ref({
  id: 3,
  tipo: 'societa' as 'persona' | 'societa',
  nome: 'Horus Holding Srl',
  partita_iva: '15128261003',
  relazione: 'Controllante',
  dettaglio_relazione: '100% Smiledoc',
  percentuale_partecipazione: 100,
  ruoli: 'Holding',
  data_registrazione: '2020-01-15',
  num_operazioni: 6,
  operazioni_senza_doc: 1
})

const operazioni = ref<Operazione[]>([
  {
    id: 1,
    data: '2026-01-15',
    tipo: 'Finanziamento soci',
    descrizione: 'Versamento in c/capitale',
    importo: 50000,
    arms_length: true,
    documentato: true
  },
  {
    id: 2,
    data: '2025-12-01',
    tipo: 'Servizi',
    descrizione: 'Management fee Q4',
    importo: 15000,
    arms_length: true,
    documentato: true
  },
  {
    id: 3,
    data: '2025-09-01',
    tipo: 'Servizi',
    descrizione: 'Management fee Q3',
    importo: 15000,
    arms_length: true,
    documentato: true
  },
  {
    id: 4,
    data: '2025-06-01',
    tipo: 'Servizi',
    descrizione: 'Management fee Q2',
    importo: 15000,
    arms_length: true,
    documentato: true
  },
  {
    id: 5,
    data: '2025-03-15',
    tipo: 'Finanziamento',
    descrizione: 'Prestito infruttifero',
    importo: 30000,
    arms_length: false,
    documentato: false
  },
  {
    id: 6,
    data: '2025-03-01',
    tipo: 'Servizi',
    descrizione: 'Management fee Q1',
    importo: 15000,
    arms_length: true,
    documentato: true
  }
])

const documenti = ref<Documento[]>([
  {
    id: 1,
    nome: 'Contratto Management Fee 2025.pdf',
    tipo: 'Contratto',
    data_upload: '2025-01-10'
  },
  {
    id: 2,
    nome: 'Delibera Versamento Capitale 2026.pdf',
    tipo: 'Delibera',
    data_upload: '2026-01-10'
  }
])

const loading = ref(false)
const activeTab = ref('operazioni')
const showNewOperazione = ref(false)

const operazioneForm = reactive({
  data: '',
  tipo: 'Servizi',
  descrizione: '',
  importo: 0,
  arms_length: true,
  documentato: true
})

const formatDate = (dateStr: string) => {
  const date = new Date(dateStr)
  return new Intl.DateTimeFormat('it-IT').format(date)
}

const formatCurrency = (value: number) => {
  return new Intl.NumberFormat('it-IT', {
    style: 'currency',
    currency: 'EUR',
    minimumFractionDigits: 2
  }).format(value)
}

const getTipoOperazioneClass = (tipo: string) => {
  const classes: Record<string, string> = {
    'Finanziamento soci': 'bg-purple-100 text-purple-700',
    'Servizi': 'bg-blue-100 text-blue-700',
    'Acquisto beni': 'bg-green-100 text-green-700',
    'Affitto': 'bg-amber-100 text-amber-700',
    'Consulenza': 'bg-cyan-100 text-cyan-700',
    'Dividendi': 'bg-pink-100 text-pink-700',
    'Finanziamento': 'bg-red-100 text-red-700'
  }
  return classes[tipo] || 'bg-slate-100 text-slate-700'
}

const editParte = () => {
  console.log('Edit parte')
}

const generateReport = () => {
  console.log('Generate report')
  alert('Generazione report in corso...')
}

const saveOperazione = () => {
  console.log('Save operazione:', operazioneForm)
  showNewOperazione.value = false
}

const uploadDocumento = () => {
  console.log('Upload documento')
}

const viewDocumento = (doc: Documento) => {
  console.log('View documento:', doc)
}

const deleteDocumento = (doc: Documento) => {
  if (confirm(`Eliminare il documento "${doc.nome}"?`)) {
    console.log('Delete documento:', doc)
  }
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
