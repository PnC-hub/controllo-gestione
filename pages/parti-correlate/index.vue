<template>
  <div>
    <!-- Header -->
    <div class="mb-6">
      <div class="flex items-center gap-2">
        <h1 class="text-2xl font-bold text-slate-800">Parti Correlate</h1>
        <PageInfoButton
          title="Parti Correlate"
          description="Registry parti correlate con dettagli rapporti societari e operazioni"
          :features="[
            'Anagrafica completa parti correlate',
            'Rapporti societari e relazioni',
            'Link a operazioni infragruppo'
          ]"
        />
      </div>
    </div>

    <!-- Top Stats -->
    <div class="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
      <div class="card p-5">
        <div class="flex items-center gap-3">
          <div class="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center">
            <i class="fas fa-users text-emerald-600 text-lg"></i>
          </div>
          <div>
            <p class="text-2xl font-bold text-slate-800">{{ stats.totaleParti }}</p>
            <p class="text-sm text-slate-500">Parti Correlate Registrate</p>
          </div>
        </div>
      </div>

      <div class="card p-5">
        <div class="flex items-center gap-3">
          <div class="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
            <i class="fas fa-file-invoice text-blue-600 text-lg"></i>
          </div>
          <div>
            <p class="text-2xl font-bold text-slate-800">{{ stats.operazioniAnno }}</p>
            <p class="text-sm text-slate-500">Operazioni nell'Anno</p>
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
            <p class="text-sm text-slate-500">Importo Totale Operazioni</p>
          </div>
        </div>
      </div>

      <div class="card p-5">
        <div class="flex items-center gap-3">
          <div class="w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center">
            <i class="fas fa-exclamation-triangle text-red-600 text-lg"></i>
          </div>
          <div>
            <p class="text-2xl font-bold text-slate-800">{{ stats.senzaDocumentazione }}</p>
            <p class="text-sm text-slate-500">Operazioni Senza Documentazione</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Main Card -->
    <div class="card">
      <div class="card-header flex justify-between items-center">
        <h2 class="card-title">
          <i class="fas fa-handshake mr-2 text-emerald-500"></i>
          Anagrafica Parti Correlate
        </h2>
        <div class="flex items-center gap-2">
          <button @click="exportNotaIntegrativa" class="btn btn-sm bg-slate-600 text-white hover:bg-slate-700">
            <i class="fas fa-file-export mr-1"></i> Esporta per Nota Integrativa
          </button>
          <button @click="showNewModal = true" class="btn btn-sm bg-emerald-600 text-white hover:bg-emerald-700">
            <i class="fas fa-plus mr-1"></i> Nuova Parte Correlata
          </button>
        </div>
      </div>

      <div class="card-content">
        <!-- Filtri -->
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          <div>
            <label class="block text-sm font-medium text-slate-700 mb-1">Tipo</label>
            <select v-model="filtri.tipo" class="form-control">
              <option value="">Tutti</option>
              <option value="persona">Persona Fisica</option>
              <option value="societa">Società</option>
            </select>
          </div>
          <div>
            <label class="block text-sm font-medium text-slate-700 mb-1">Relazione</label>
            <select v-model="filtri.relazione" class="form-control">
              <option value="">Tutte</option>
              <option value="socio">Socio/Amministratore</option>
              <option value="familiare">Familiare</option>
              <option value="controllante">Controllante</option>
              <option value="collegata">Collegata</option>
              <option value="dipendente">Dipendente Chiave</option>
            </select>
          </div>
          <div>
            <label class="block text-sm font-medium text-slate-700 mb-1">Ricerca</label>
            <input v-model="filtri.search" type="text" placeholder="Nome..." class="form-control">
          </div>
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
                <th class="px-4 py-3 text-left text-xs font-semibold text-slate-600 uppercase">Nome</th>
                <th class="px-4 py-3 text-left text-xs font-semibold text-slate-600 uppercase">Tipo</th>
                <th class="px-4 py-3 text-left text-xs font-semibold text-slate-600 uppercase">Relazione</th>
                <th class="px-4 py-3 text-left text-xs font-semibold text-slate-600 uppercase">% Partecipazione</th>
                <th class="px-4 py-3 text-left text-xs font-semibold text-slate-600 uppercase">Ruoli</th>
                <th class="px-4 py-3 text-center text-xs font-semibold text-slate-600 uppercase">N° Operazioni</th>
                <th class="px-4 py-3 text-center text-xs font-semibold text-slate-600 uppercase">Stato</th>
                <th class="px-4 py-3 text-center text-xs font-semibold text-slate-600 uppercase">Azioni</th>
              </tr>
            </thead>
            <tbody>
              <tr v-if="partiFilteredList.length === 0">
                <td colspan="8" class="text-center py-8 text-slate-500">
                  Nessuna parte correlata trovata
                </td>
              </tr>
              <tr v-for="parte in partiFilteredList" :key="parte.id" class="border-b border-slate-100 hover:bg-slate-50">
                <td class="px-4 py-3">
                  <div class="flex items-center gap-2">
                    <div :class="[
                      'w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-semibold',
                      parte.tipo === 'persona' ? 'bg-blue-500' : 'bg-purple-500'
                    ]">
                      <i :class="parte.tipo === 'persona' ? 'fas fa-user' : 'fas fa-building'"></i>
                    </div>
                    <div>
                      <NuxtLink :to="`/parti-correlate/${parte.id}`" class="font-medium text-slate-800 hover:text-emerald-600">
                        {{ parte.nome }}
                      </NuxtLink>
                      <div class="text-xs text-slate-500">{{ parte.codice_fiscale || parte.partita_iva }}</div>
                    </div>
                  </div>
                </td>
                <td class="px-4 py-3">
                  <span :class="[
                    'px-2 py-1 text-xs rounded-full',
                    parte.tipo === 'persona' ? 'bg-blue-100 text-blue-700' : 'bg-purple-100 text-purple-700'
                  ]">
                    {{ parte.tipo === 'persona' ? 'Persona fisica' : 'Società' }}
                  </span>
                </td>
                <td class="px-4 py-3 text-sm text-slate-600">{{ parte.relazione }}</td>
                <td class="px-4 py-3 text-sm font-medium text-slate-800">
                  {{ parte.percentuale_partecipazione ? parte.percentuale_partecipazione + '%' : '-' }}
                </td>
                <td class="px-4 py-3 text-sm text-slate-600">{{ parte.ruoli || '-' }}</td>
                <td class="px-4 py-3 text-center">
                  <span class="px-2 py-1 bg-slate-100 text-slate-700 text-xs rounded-full font-medium">
                    {{ parte.num_operazioni }}
                  </span>
                </td>
                <td class="px-4 py-3 text-center">
                  <span v-if="parte.operazioni_senza_doc === 0" class="text-green-600" title="Completo">
                    <i class="fas fa-check-circle"></i> Completo
                  </span>
                  <span v-else class="text-amber-600" title="Operazioni senza documentazione">
                    <i class="fas fa-exclamation-triangle"></i> {{ parte.operazioni_senza_doc }} senza doc
                  </span>
                </td>
                <td class="px-4 py-3 text-center">
                  <NuxtLink :to="`/parti-correlate/${parte.id}`" class="text-emerald-600 hover:text-emerald-700 mr-2" title="Dettagli">
                    <i class="fas fa-eye"></i>
                  </NuxtLink>
                  <button @click="editParte(parte)" class="text-blue-600 hover:text-blue-700" title="Modifica">
                    <i class="fas fa-edit"></i>
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <!-- New/Edit Modal -->
    <div v-if="showNewModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div class="bg-white rounded-lg shadow-xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        <div class="p-6 border-b border-slate-200">
          <h3 class="text-xl font-bold text-slate-800">
            {{ editingParte ? 'Modifica Parte Correlata' : 'Nuova Parte Correlata' }}
          </h3>
        </div>
        <div class="p-6 space-y-4">
          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium text-slate-700 mb-1">Tipo *</label>
              <select v-model="form.tipo" class="form-control" required>
                <option value="persona">Persona Fisica</option>
                <option value="societa">Società</option>
              </select>
            </div>
            <div>
              <label class="block text-sm font-medium text-slate-700 mb-1">Nome *</label>
              <input v-model="form.nome" type="text" class="form-control" required>
            </div>
          </div>

          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium text-slate-700 mb-1">
                {{ form.tipo === 'persona' ? 'Codice Fiscale' : 'Partita IVA' }}
              </label>
              <input v-model="form.codice_fiscale" type="text" class="form-control">
            </div>
            <div>
              <label class="block text-sm font-medium text-slate-700 mb-1">Relazione *</label>
              <select v-model="form.relazione" class="form-control" required>
                <option value="socio">Socio/Amministratore</option>
                <option value="familiare">Familiare</option>
                <option value="controllante">Controllante</option>
                <option value="collegata">Collegata</option>
                <option value="dipendente">Dipendente Chiave</option>
              </select>
            </div>
          </div>

          <div>
            <label class="block text-sm font-medium text-slate-700 mb-1">Dettaglio Relazione</label>
            <input v-model="form.dettaglio_relazione" type="text" placeholder="es. coniuge, figlio, amministratore unico..." class="form-control">
          </div>

          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium text-slate-700 mb-1">% Partecipazione</label>
              <input v-model.number="form.percentuale_partecipazione" type="number" min="0" max="100" step="0.01" class="form-control">
            </div>
            <div>
              <label class="block text-sm font-medium text-slate-700 mb-1">Ruoli</label>
              <input v-model="form.ruoli" type="text" placeholder="es. Direttore Sanitario, Consulente..." class="form-control">
            </div>
          </div>
        </div>
        <div class="p-6 border-t border-slate-200 flex justify-end gap-2">
          <button @click="closeModal" class="btn bg-slate-500 text-white hover:bg-slate-600">
            Annulla
          </button>
          <button @click="saveParte" class="btn bg-emerald-600 text-white hover:bg-emerald-700">
            <i class="fas fa-save mr-1"></i> Salva
          </button>
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
  codice_fiscale?: string
  partita_iva?: string
  relazione: string
  dettaglio_relazione?: string
  percentuale_partecipazione?: number
  ruoli?: string
  num_operazioni: number
  operazioni_senza_doc: number
}

// Mock data
const partiCorrelate = ref<ParteCorrelata[]>([
  {
    id: 1,
    tipo: 'persona',
    nome: 'Civero Piernatale',
    codice_fiscale: 'CVRPRN80A01H501Z',
    relazione: 'Socio/Amministratore',
    dettaglio_relazione: 'Socio di maggioranza',
    percentuale_partecipazione: 90,
    ruoli: 'Direttore Sanitario, Amministratore Unico',
    num_operazioni: 8,
    operazioni_senza_doc: 0
  },
  {
    id: 2,
    tipo: 'persona',
    nome: 'Di Vozzo Annita',
    codice_fiscale: 'DVZNNT85B41H501Z',
    relazione: 'Familiare',
    dettaglio_relazione: 'Coniuge',
    percentuale_partecipazione: 0,
    ruoli: 'Odontoiatra collaboratore',
    num_operazioni: 4,
    operazioni_senza_doc: 0
  },
  {
    id: 3,
    tipo: 'societa',
    nome: 'Horus Holding Srl',
    partita_iva: '15128261003',
    relazione: 'Controllante',
    dettaglio_relazione: '100% Smiledoc',
    percentuale_partecipazione: 100,
    ruoli: 'Holding',
    num_operazioni: 6,
    operazioni_senza_doc: 1
  },
  {
    id: 4,
    tipo: 'societa',
    nome: 'A&P Consulting Srl',
    partita_iva: '12345678901',
    relazione: 'Collegata',
    dettaglio_relazione: 'Stesso amministratore',
    percentuale_partecipazione: 0,
    ruoli: 'Consulenza',
    num_operazioni: 3,
    operazioni_senza_doc: 1
  },
  {
    id: 5,
    tipo: 'persona',
    nome: 'Civero Marco',
    codice_fiscale: 'CVRMRC05A01H501Z',
    relazione: 'Familiare',
    dettaglio_relazione: 'Figlio',
    percentuale_partecipazione: 0,
    ruoli: '',
    num_operazioni: 2,
    operazioni_senza_doc: 0
  },
  {
    id: 6,
    tipo: 'persona',
    nome: 'Cretella Raffaella',
    codice_fiscale: 'CRTRFL75D41H501Z',
    relazione: 'Dipendente Chiave',
    dettaglio_relazione: 'Responsabile Amministrativa',
    percentuale_partecipazione: 0,
    ruoli: 'Resp. Amministrativa',
    num_operazioni: 1,
    operazioni_senza_doc: 0
  }
])

const stats = computed(() => ({
  totaleParti: partiCorrelate.value.length,
  operazioniAnno: partiCorrelate.value.reduce((sum, p) => sum + p.num_operazioni, 0),
  importoTotale: 185000,
  senzaDocumentazione: partiCorrelate.value.reduce((sum, p) => sum + p.operazioni_senza_doc, 0)
}))

const loading = ref(false)
const showNewModal = ref(false)
const editingParte = ref<ParteCorrelata | null>(null)

const filtri = reactive({
  tipo: '',
  relazione: '',
  search: ''
})

const form = reactive({
  tipo: 'persona' as 'persona' | 'societa',
  nome: '',
  codice_fiscale: '',
  relazione: '',
  dettaglio_relazione: '',
  percentuale_partecipazione: 0,
  ruoli: ''
})

const partiFilteredList = computed(() => {
  return partiCorrelate.value.filter(p => {
    if (filtri.tipo && p.tipo !== filtri.tipo) return false
    if (filtri.relazione && p.relazione !== filtri.relazione) return false
    if (filtri.search && !p.nome.toLowerCase().includes(filtri.search.toLowerCase())) return false
    return true
  })
})

const formatCurrency = (value: number) => {
  return new Intl.NumberFormat('it-IT', {
    style: 'currency',
    currency: 'EUR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(value)
}

const editParte = (parte: ParteCorrelata) => {
  editingParte.value = parte
  form.tipo = parte.tipo
  form.nome = parte.nome
  form.codice_fiscale = parte.codice_fiscale || parte.partita_iva || ''
  form.relazione = parte.relazione
  form.dettaglio_relazione = parte.dettaglio_relazione || ''
  form.percentuale_partecipazione = parte.percentuale_partecipazione || 0
  form.ruoli = parte.ruoli || ''
  showNewModal.value = true
}

const saveParte = () => {
  console.log('Saving parte correlata:', form)
  closeModal()
}

const closeModal = () => {
  showNewModal.value = false
  editingParte.value = null
  Object.assign(form, {
    tipo: 'persona',
    nome: '',
    codice_fiscale: '',
    relazione: '',
    dettaglio_relazione: '',
    percentuale_partecipazione: 0,
    ruoli: ''
  })
}

const exportNotaIntegrativa = () => {
  console.log('Export per nota integrativa')
  alert('Esportazione report per nota integrativa in corso...')
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
