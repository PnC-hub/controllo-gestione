<template>
  <div>
    <!-- Header -->
    <div class="card mb-6">
      <div class="card-header flex justify-between items-center">
        <h2 class="card-title">
          <i class="fas fa-file-import mr-2 text-cyan-600"></i>
          <span>Autofatture</span>
        </h2>
        <div class="flex items-center space-x-3">
          <button @click="openNuovaAutofattura" class="btn-primary">
            <i class="fas fa-plus mr-2"></i> Nuova Autofattura
          </button>
        </div>
      </div>
    </div>

    <!-- Info Box -->
    <div class="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
      <div class="flex items-start">
        <i class="fas fa-info-circle text-blue-500 mt-1 mr-3"></i>
        <div class="text-sm text-blue-800">
          <p class="font-medium mb-1">Quando serve l'autofattura?</p>
          <ul class="list-disc ml-4 space-y-1">
            <li><strong>Reverse charge:</strong> Acquisti da fornitori UE o extra-UE (servizi, software, cloud)</li>
            <li><strong>Acquisti intracomunitari:</strong> Beni da altri paesi UE</li>
            <li><strong>Acquisti da fornitori esteri:</strong> Amazon AWS, Google, Microsoft, etc.</li>
            <li><strong>Autoconsumo:</strong> Beni prelevati per uso personale</li>
          </ul>
        </div>
      </div>
    </div>

    <!-- Statistiche -->
    <div class="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
      <div class="bg-white rounded-lg shadow p-4 text-center">
        <div class="text-2xl font-bold text-gray-800">{{ stats.totale_anno }}</div>
        <div class="text-sm text-gray-500">Autofatture {{ currentYear }}</div>
      </div>
      <div class="bg-orange-50 rounded-lg shadow p-4 text-center">
        <div class="text-2xl font-bold text-orange-600">{{ stats.da_emettere }}</div>
        <div class="text-sm text-orange-500">Da Emettere</div>
      </div>
      <div class="bg-green-50 rounded-lg shadow p-4 text-center">
        <div class="text-2xl font-bold text-green-600">{{ stats.emesse }}</div>
        <div class="text-sm text-green-500">Emesse</div>
      </div>
      <div class="bg-cyan-50 rounded-lg shadow p-4 text-center">
        <div class="text-2xl font-bold text-cyan-600">{{ formatCurrency(stats.totale_imponibile) }}</div>
        <div class="text-sm text-cyan-500">Totale Imponibile</div>
      </div>
    </div>

    <!-- Filtri -->
    <div class="card mb-6">
      <div class="card-content">
        <div class="flex flex-wrap items-center gap-4">
          <div>
            <label class="block text-xs text-gray-500 mb-1">Anno</label>
            <select v-model="filters.anno" class="input-field w-28" @change="loadData()">
              <option v-for="y in years" :key="y" :value="y">{{ y }}</option>
            </select>
          </div>
          <div>
            <label class="block text-xs text-gray-500 mb-1">Mese</label>
            <select v-model="filters.mese" class="input-field w-36" @change="loadData()">
              <option value="">Tutti</option>
              <option v-for="m in mesi" :key="m.value" :value="m.value">{{ m.label }}</option>
            </select>
          </div>
          <div>
            <label class="block text-xs text-gray-500 mb-1">Tipo</label>
            <select v-model="filters.tipo" class="input-field w-44" @change="loadData()">
              <option value="">Tutti</option>
              <option value="TD17">TD17 - Acquisto servizi UE</option>
              <option value="TD18">TD18 - Acquisto beni UE</option>
              <option value="TD19">TD19 - Acquisto beni art.17 c.2</option>
              <option value="TD20">TD20 - Autofattura</option>
              <option value="TD21">TD21 - Autofattura splafonamento</option>
            </select>
          </div>
          <div>
            <label class="block text-xs text-gray-500 mb-1">Stato</label>
            <select v-model="filters.stato" class="input-field w-36" @change="loadData()">
              <option value="">Tutti</option>
              <option value="da_emettere">Da emettere</option>
              <option value="emessa">Emessa</option>
              <option value="inviata_sdi">Inviata SDI</option>
              <option value="accettata">Accettata</option>
              <option value="scartata">Scartata</option>
            </select>
          </div>
          <div class="flex-1">
            <label class="block text-xs text-gray-500 mb-1">Cerca</label>
            <input
              type="text"
              v-model="filters.search"
              @input="debounceSearch"
              placeholder="Fornitore, numero..."
              class="input-field w-full"
            />
          </div>
        </div>
      </div>
    </div>

    <!-- Loading -->
    <div v-if="loading" class="text-center py-12">
      <i class="fas fa-spinner fa-spin text-4xl text-cyan-600"></i>
    </div>

    <!-- Lista Autofatture -->
    <div v-else class="card">
      <div class="card-content p-0">
        <div v-if="autofatture.length === 0" class="text-center py-12 text-gray-500">
          <i class="fas fa-file-invoice text-5xl mb-4 text-gray-300"></i>
          <p>Nessuna autofattura trovata</p>
          <p class="text-sm mt-2">Le autofatture appariranno qui quando necessario</p>
        </div>

        <table v-else class="w-full">
          <thead class="bg-gray-50">
            <tr>
              <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Numero</th>
              <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Data</th>
              <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Fornitore</th>
              <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Tipo</th>
              <th class="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">Imponibile</th>
              <th class="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">IVA</th>
              <th class="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase">Stato</th>
              <th class="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase">Azioni</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-200">
            <tr v-for="af in autofatture" :key="af.id" class="hover:bg-gray-50">
              <td class="px-4 py-3 text-sm font-medium">
                <span v-if="af.numero">{{ af.numero }}</span>
                <span v-else class="text-gray-400 italic">Da generare</span>
              </td>
              <td class="px-4 py-3 text-sm">{{ formatDate(af.data) }}</td>
              <td class="px-4 py-3 text-sm">
                <div class="font-medium">{{ af.fornitore_denominazione }}</div>
                <div v-if="af.fornitore_paese" class="text-xs text-gray-500">
                  <i class="fas fa-globe mr-1"></i> {{ af.fornitore_paese }}
                </div>
              </td>
              <td class="px-4 py-3 text-sm">
                <span class="px-2 py-1 rounded text-xs" :class="getTipoClass(af.tipo_documento)">
                  {{ af.tipo_documento }}
                </span>
              </td>
              <td class="px-4 py-3 text-sm text-right">{{ formatCurrency(af.imponibile) }}</td>
              <td class="px-4 py-3 text-sm text-right">{{ formatCurrency(af.iva) }}</td>
              <td class="px-4 py-3 text-sm text-center">
                <span class="px-2 py-1 rounded text-xs" :class="getStatoClass(af.stato)">
                  {{ getStatoLabel(af.stato) }}
                </span>
              </td>
              <td class="px-4 py-3 text-sm text-center">
                <div class="flex items-center justify-center space-x-2">
                  <button
                    @click="viewAutofattura(af)"
                    class="text-cyan-600 hover:text-cyan-800"
                    title="Visualizza"
                  >
                    <i class="fas fa-eye"></i>
                  </button>
                  <button
                    v-if="af.stato === 'da_emettere'"
                    @click="emettiAutofattura(af)"
                    class="text-green-600 hover:text-green-800"
                    title="Emetti"
                  >
                    <i class="fas fa-paper-plane"></i>
                  </button>
                  <button
                    v-if="af.stato === 'emessa'"
                    @click="inviaSDI(af)"
                    class="text-blue-600 hover:text-blue-800"
                    title="Invia a SDI"
                  >
                    <i class="fas fa-upload"></i>
                  </button>
                  <button
                    v-if="af.stato === 'da_emettere'"
                    @click="editAutofattura(af)"
                    class="text-gray-600 hover:text-gray-800"
                    title="Modifica"
                  >
                    <i class="fas fa-edit"></i>
                  </button>
                  <button
                    v-if="af.stato === 'da_emettere'"
                    @click="deleteAutofattura(af)"
                    class="text-red-600 hover:text-red-800"
                    title="Elimina"
                  >
                    <i class="fas fa-trash"></i>
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>

        <!-- Paginazione -->
        <div v-if="pagination.pages > 1" class="px-4 py-3 border-t flex justify-center">
          <div class="flex items-center space-x-2">
            <button @click="changePage(pagination.page - 1)" :disabled="pagination.page === 1" class="btn-page">
              <i class="fas fa-chevron-left"></i>
            </button>
            <span class="text-sm text-gray-600">
              Pagina {{ pagination.page }} di {{ pagination.pages }}
            </span>
            <button @click="changePage(pagination.page + 1)" :disabled="pagination.page === pagination.pages" class="btn-page">
              <i class="fas fa-chevron-right"></i>
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal Nuova/Edit Autofattura -->
    <div v-if="showModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div class="bg-white rounded-lg shadow-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
        <div class="px-6 py-4 border-b flex justify-between items-center sticky top-0 bg-white">
          <h3 class="text-lg font-semibold">
            <i class="fas fa-file-import text-cyan-600 mr-2"></i>
            {{ editingId ? 'Modifica Autofattura' : 'Nuova Autofattura' }}
          </h3>
          <button @click="closeModal" class="text-gray-500 hover:text-gray-700">
            <i class="fas fa-times"></i>
          </button>
        </div>

        <form @submit.prevent="saveAutofattura" class="p-6 space-y-6">
          <!-- Tipo Documento -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Tipo Documento *</label>
            <div class="grid grid-cols-2 md:grid-cols-3 gap-3">
              <label
                v-for="tipo in tipiDocumento"
                :key="tipo.code"
                class="border rounded-lg p-3 cursor-pointer transition-all"
                :class="form.tipo_documento === tipo.code ? 'border-cyan-500 bg-cyan-50' : 'hover:border-gray-400'"
              >
                <input type="radio" v-model="form.tipo_documento" :value="tipo.code" class="sr-only" />
                <div class="font-medium text-sm">{{ tipo.code }}</div>
                <div class="text-xs text-gray-500 mt-1">{{ tipo.label }}</div>
              </label>
            </div>
          </div>

          <!-- Date -->
          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Data Documento *</label>
              <input type="date" v-model="form.data" class="input-field w-full" required />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Data Fattura Fornitore</label>
              <input type="date" v-model="form.data_fattura_fornitore" class="input-field w-full" />
            </div>
          </div>

          <!-- Fornitore -->
          <fieldset class="border rounded-lg p-4">
            <legend class="text-sm font-medium text-gray-700 px-2">Fornitore Estero</legend>
            <div class="space-y-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Denominazione *</label>
                <input type="text" v-model="form.fornitore_denominazione" class="input-field w-full" required />
              </div>
              <div class="grid grid-cols-2 gap-4">
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1">Paese *</label>
                  <select v-model="form.fornitore_paese" class="input-field w-full" required>
                    <option value="">Seleziona...</option>
                    <option v-for="p in paesi" :key="p.code" :value="p.code">{{ p.name }}</option>
                  </select>
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1">Partita IVA / ID Fiscale</label>
                  <input type="text" v-model="form.fornitore_piva" class="input-field w-full" />
                </div>
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Indirizzo</label>
                <input type="text" v-model="form.fornitore_indirizzo" class="input-field w-full" />
              </div>
            </div>
          </fieldset>

          <!-- Riferimento Fattura Originale -->
          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Numero Fattura Fornitore</label>
              <input type="text" v-model="form.numero_fattura_fornitore" class="input-field w-full" placeholder="es. INV-2024-001" />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Collegato a Movimento Bancario</label>
              <input type="text" v-model="form.movimento_bancario_ref" class="input-field w-full" disabled />
            </div>
          </div>

          <!-- Importi -->
          <fieldset class="border rounded-lg p-4">
            <legend class="text-sm font-medium text-gray-700 px-2">Importi</legend>
            <div class="grid grid-cols-3 gap-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Imponibile *</label>
                <input type="number" step="0.01" v-model="form.imponibile" class="input-field w-full" required @input="calcolaIVA" />
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Aliquota IVA %</label>
                <select v-model="form.aliquota_iva" class="input-field w-full" @change="calcolaIVA">
                  <option value="22">22%</option>
                  <option value="10">10%</option>
                  <option value="4">4%</option>
                  <option value="0">Esente/N.I.</option>
                </select>
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">IVA</label>
                <input type="number" step="0.01" v-model="form.iva" class="input-field w-full bg-gray-50" readonly />
              </div>
            </div>
            <div class="mt-4 text-right">
              <span class="text-gray-600">Totale: </span>
              <span class="text-xl font-bold text-cyan-600">{{ formatCurrency(totaleAutofattura) }}</span>
            </div>
          </fieldset>

          <!-- Descrizione -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Descrizione</label>
            <textarea v-model="form.descrizione" class="input-field w-full" rows="2" placeholder="Descrizione del servizio/bene acquistato"></textarea>
          </div>

          <!-- Note -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Note interne</label>
            <textarea v-model="form.note" class="input-field w-full" rows="2"></textarea>
          </div>
        </form>

        <div class="px-6 py-4 border-t bg-gray-50 flex justify-end space-x-3 sticky bottom-0">
          <button @click="closeModal" class="btn-secondary">Annulla</button>
          <button @click="saveAutofattura" class="btn-primary">
            <i class="fas fa-save mr-2"></i> {{ editingId ? 'Aggiorna' : 'Salva' }}
          </button>
        </div>
      </div>
    </div>

    <!-- Modal Visualizza -->
    <div v-if="showViewModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div class="bg-white rounded-lg shadow-xl max-w-2xl w-full">
        <div class="px-6 py-4 border-b flex justify-between items-center">
          <h3 class="text-lg font-semibold">
            <i class="fas fa-file-invoice text-cyan-600 mr-2"></i>
            Autofattura {{ viewingAutofattura?.numero || '(Bozza)' }}
          </h3>
          <button @click="showViewModal = false" class="text-gray-500 hover:text-gray-700">
            <i class="fas fa-times"></i>
          </button>
        </div>

        <div v-if="viewingAutofattura" class="p-6 space-y-4">
          <div class="grid grid-cols-2 gap-4">
            <div>
              <div class="text-sm text-gray-500">Tipo Documento</div>
              <div class="font-medium">{{ viewingAutofattura.tipo_documento }}</div>
            </div>
            <div>
              <div class="text-sm text-gray-500">Data</div>
              <div class="font-medium">{{ formatDate(viewingAutofattura.data) }}</div>
            </div>
          </div>

          <div class="border-t pt-4">
            <div class="text-sm text-gray-500 mb-1">Fornitore</div>
            <div class="font-medium">{{ viewingAutofattura.fornitore_denominazione }}</div>
            <div class="text-sm text-gray-500">{{ viewingAutofattura.fornitore_paese }} - {{ viewingAutofattura.fornitore_piva }}</div>
          </div>

          <div class="border-t pt-4">
            <div class="text-sm text-gray-500 mb-1">Descrizione</div>
            <div>{{ viewingAutofattura.descrizione || '-' }}</div>
          </div>

          <div class="border-t pt-4 grid grid-cols-3 gap-4">
            <div>
              <div class="text-sm text-gray-500">Imponibile</div>
              <div class="font-medium">{{ formatCurrency(viewingAutofattura.imponibile) }}</div>
            </div>
            <div>
              <div class="text-sm text-gray-500">IVA ({{ viewingAutofattura.aliquota_iva }}%)</div>
              <div class="font-medium">{{ formatCurrency(viewingAutofattura.iva) }}</div>
            </div>
            <div>
              <div class="text-sm text-gray-500">Totale</div>
              <div class="font-bold text-lg text-cyan-600">{{ formatCurrency(parseFloat(viewingAutofattura.imponibile) + parseFloat(viewingAutofattura.iva)) }}</div>
            </div>
          </div>

          <div class="border-t pt-4">
            <div class="text-sm text-gray-500 mb-1">Stato</div>
            <span class="px-3 py-1 rounded" :class="getStatoClass(viewingAutofattura.stato)">
              {{ getStatoLabel(viewingAutofattura.stato) }}
            </span>
          </div>
        </div>

        <div class="px-6 py-4 border-t bg-gray-50 flex justify-end space-x-3">
          <button @click="showViewModal = false" class="btn-secondary">Chiudi</button>
          <button
            v-if="viewingAutofattura?.stato === 'emessa'"
            @click="downloadXML(viewingAutofattura)"
            class="btn-primary"
          >
            <i class="fas fa-download mr-2"></i> Scarica XML
          </button>
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
const autofatture = ref<any[]>([])
const pagination = ref({ page: 1, pages: 1, total: 0 })

const currentYear = new Date().getFullYear()
const years = Array.from({ length: 5 }, (_, i) => currentYear - i)
const mesi = [
  { value: '01', label: 'Gennaio' },
  { value: '02', label: 'Febbraio' },
  { value: '03', label: 'Marzo' },
  { value: '04', label: 'Aprile' },
  { value: '05', label: 'Maggio' },
  { value: '06', label: 'Giugno' },
  { value: '07', label: 'Luglio' },
  { value: '08', label: 'Agosto' },
  { value: '09', label: 'Settembre' },
  { value: '10', label: 'Ottobre' },
  { value: '11', label: 'Novembre' },
  { value: '12', label: 'Dicembre' }
]

const filters = reactive({
  anno: currentYear,
  mese: '',
  tipo: '',
  stato: '',
  search: ''
})

const stats = ref({
  totale_anno: 0,
  da_emettere: 0,
  emesse: 0,
  totale_imponibile: 0
})

// Modal
const showModal = ref(false)
const editingId = ref<number | null>(null)
const form = reactive({
  tipo_documento: 'TD17',
  data: new Date().toISOString().split('T')[0],
  data_fattura_fornitore: '',
  fornitore_denominazione: '',
  fornitore_paese: '',
  fornitore_piva: '',
  fornitore_indirizzo: '',
  numero_fattura_fornitore: '',
  movimento_bancario_ref: '',
  movimento_bancario_id: null as number | null,
  imponibile: 0,
  aliquota_iva: 22,
  iva: 0,
  descrizione: '',
  note: ''
})

// View Modal
const showViewModal = ref(false)
const viewingAutofattura = ref<any>(null)

// Tipi documento
const tipiDocumento = [
  { code: 'TD17', label: 'Integrazione/autofattura acquisto servizi UE' },
  { code: 'TD18', label: 'Integrazione acquisto beni intracomunitari' },
  { code: 'TD19', label: 'Integrazione/autofattura art.17 c.2' },
  { code: 'TD20', label: 'Autofattura regolarizzazione' },
  { code: 'TD21', label: 'Autofattura splafonamento' }
]

// Paesi comuni
const paesi = [
  { code: 'US', name: 'Stati Uniti' },
  { code: 'IE', name: 'Irlanda' },
  { code: 'LU', name: 'Lussemburgo' },
  { code: 'DE', name: 'Germania' },
  { code: 'FR', name: 'Francia' },
  { code: 'NL', name: 'Paesi Bassi' },
  { code: 'GB', name: 'Regno Unito' },
  { code: 'ES', name: 'Spagna' },
  { code: 'CH', name: 'Svizzera' },
  { code: 'AT', name: 'Austria' },
  { code: 'BE', name: 'Belgio' },
  { code: 'SE', name: 'Svezia' },
  { code: 'CN', name: 'Cina' },
  { code: 'JP', name: 'Giappone' },
  { code: 'IN', name: 'India' }
]

let searchTimeout: any = null

// Utils
const formatCurrency = (v: any) => new Intl.NumberFormat('it-IT', { style: 'currency', currency: 'EUR' }).format(parseFloat(v) || 0)
const formatDate = (d: string) => { if (!d) return '-'; const date = new Date(d); return `${String(date.getDate()).padStart(2, '0')}-${String(date.getMonth() + 1).padStart(2, '0')}-${date.getFullYear()}`; }

const totaleAutofattura = computed(() => parseFloat(form.imponibile as any) + parseFloat(form.iva as any))

const calcolaIVA = () => {
  const imponibile = parseFloat(form.imponibile as any) || 0
  const aliquota = parseInt(form.aliquota_iva as any) || 0
  form.iva = parseFloat((imponibile * aliquota / 100).toFixed(2))
}

const getTipoClass = (tipo: string) => {
  switch (tipo) {
    case 'TD17': return 'bg-blue-100 text-blue-700'
    case 'TD18': return 'bg-green-100 text-green-700'
    case 'TD19': return 'bg-purple-100 text-purple-700'
    case 'TD20': return 'bg-orange-100 text-orange-700'
    case 'TD21': return 'bg-red-100 text-red-700'
    default: return 'bg-gray-100 text-gray-700'
  }
}

const getStatoClass = (stato: string) => {
  switch (stato) {
    case 'da_emettere': return 'bg-orange-100 text-orange-700'
    case 'emessa': return 'bg-blue-100 text-blue-700'
    case 'inviata_sdi': return 'bg-purple-100 text-purple-700'
    case 'accettata': return 'bg-green-100 text-green-700'
    case 'scartata': return 'bg-red-100 text-red-700'
    default: return 'bg-gray-100 text-gray-700'
  }
}

const getStatoLabel = (stato: string) => {
  switch (stato) {
    case 'da_emettere': return 'Da emettere'
    case 'emessa': return 'Emessa'
    case 'inviata_sdi': return 'Inviata SDI'
    case 'accettata': return 'Accettata'
    case 'scartata': return 'Scartata'
    default: return stato
  }
}

// API
const loadStats = async () => {
  try {
    const res = await fetchApi<any>(`/autofatture/stats?anno=${filters.anno}`)
    if (res.success) {
      stats.value = res.data
    }
  } catch (e) {
    console.error('Errore caricamento stats:', e)
  }
}

const loadAutofatture = async (page = 1) => {
  loading.value = true
  try {
    const params = new URLSearchParams({
      anno: filters.anno.toString(),
      page: page.toString()
    })
    if (filters.mese) params.append('mese', filters.mese)
    if (filters.tipo) params.append('tipo_documento', filters.tipo)
    if (filters.stato) params.append('stato', filters.stato)
    if (filters.search) params.append('search', filters.search)

    const res = await fetchApi<any>(`/autofatture?${params}`)
    if (res.success) {
      autofatture.value = res.data || []
      pagination.value = res.pagination || { page: 1, pages: 1, total: 0 }
    }
  } catch (e) {
    console.error('Errore caricamento autofatture:', e)
  } finally {
    loading.value = false
  }
}

const loadData = async () => {
  await Promise.all([loadStats(), loadAutofatture()])
}

const debounceSearch = () => {
  clearTimeout(searchTimeout)
  searchTimeout = setTimeout(() => loadAutofatture(), 300)
}

const changePage = (page: number) => {
  if (page >= 1 && page <= pagination.value.pages) {
    loadAutofatture(page)
  }
}

// Modal Actions
const openNuovaAutofattura = () => {
  editingId.value = null
  Object.assign(form, {
    tipo_documento: 'TD17',
    data: new Date().toISOString().split('T')[0],
    data_fattura_fornitore: '',
    fornitore_denominazione: '',
    fornitore_paese: '',
    fornitore_piva: '',
    fornitore_indirizzo: '',
    numero_fattura_fornitore: '',
    movimento_bancario_ref: '',
    movimento_bancario_id: null,
    imponibile: 0,
    aliquota_iva: 22,
    iva: 0,
    descrizione: '',
    note: ''
  })
  showModal.value = true
}

const editAutofattura = (af: any) => {
  editingId.value = af.id
  Object.assign(form, {
    tipo_documento: af.tipo_documento,
    data: af.data,
    data_fattura_fornitore: af.data_fattura_fornitore || '',
    fornitore_denominazione: af.fornitore_denominazione,
    fornitore_paese: af.fornitore_paese,
    fornitore_piva: af.fornitore_piva || '',
    fornitore_indirizzo: af.fornitore_indirizzo || '',
    numero_fattura_fornitore: af.numero_fattura_fornitore || '',
    movimento_bancario_ref: af.movimento_bancario_id ? `#${af.movimento_bancario_id}` : '',
    movimento_bancario_id: af.movimento_bancario_id,
    imponibile: af.imponibile,
    aliquota_iva: af.aliquota_iva,
    iva: af.iva,
    descrizione: af.descrizione || '',
    note: af.note || ''
  })
  showModal.value = true
}

const closeModal = () => {
  showModal.value = false
  editingId.value = null
}

const saveAutofattura = async () => {
  if (!form.fornitore_denominazione || !form.fornitore_paese || !form.imponibile) {
    alert('Compila i campi obbligatori')
    return
  }

  try {
    const endpoint = editingId.value ? `/autofatture/${editingId.value}` : '/autofatture'
    const method = editingId.value ? 'PUT' : 'POST'

    const res = await fetchApi<any>(endpoint, {
      method,
      body: { ...form }
    })

    if (res.success) {
      closeModal()
      await loadData()
    } else {
      alert(res.message || 'Errore durante salvataggio')
    }
  } catch (e: any) {
    alert(e.message || 'Errore durante salvataggio')
  }
}

const deleteAutofattura = async (af: any) => {
  if (!confirm(`Eliminare l'autofattura per ${af.fornitore_denominazione}?`)) return

  try {
    const res = await fetchApi<any>(`/autofatture/${af.id}`, { method: 'DELETE' })
    if (res.success) {
      await loadData()
    } else {
      alert(res.message || 'Errore durante eliminazione')
    }
  } catch (e: any) {
    alert(e.message || 'Errore durante eliminazione')
  }
}

const viewAutofattura = (af: any) => {
  viewingAutofattura.value = af
  showViewModal.value = true
}

const emettiAutofattura = async (af: any) => {
  if (!confirm(`Emettere l'autofattura per ${af.fornitore_denominazione}? Verrà generato il numero progressivo.`)) return

  try {
    const res = await fetchApi<any>(`/autofatture/${af.id}/emetti`, { method: 'POST' })
    if (res.success) {
      alert(`Autofattura emessa con numero: ${res.data.numero}`)
      await loadData()
    } else {
      alert(res.message || 'Errore durante emissione')
    }
  } catch (e: any) {
    alert(e.message || 'Errore durante emissione')
  }
}

const inviaSDI = async (af: any) => {
  if (!confirm(`Inviare l'autofattura ${af.numero} al Sistema di Interscambio?`)) return

  try {
    const res = await fetchApi<any>(`/autofatture/${af.id}/invia-sdi`, { method: 'POST' })
    if (res.success) {
      alert('Autofattura inviata al SDI')
      await loadData()
    } else {
      alert(res.message || 'Errore durante invio')
    }
  } catch (e: any) {
    alert(e.message || 'Errore durante invio')
  }
}

const downloadXML = async (af: any) => {
  try {
    window.open(`/api/autofatture/${af.id}/xml`, '_blank')
  } catch (e) {
    console.error('Errore download XML:', e)
  }
}

// Init
onMounted(async () => {
  if (!centroStore.centroCorrente && centroStore.centri.length === 0) {
    await centroStore.fetchCentri()
  }
  await loadData()
})
</script>

<style scoped>
.card { @apply bg-white rounded-lg shadow; }
.card-header { @apply px-4 py-3 border-b border-gray-200; }
.card-title { @apply text-lg font-semibold text-gray-800 flex items-center; }
.card-content { @apply p-4; }
.input-field { @apply px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500; }
.btn-primary { @apply bg-cyan-600 text-white px-4 py-2 rounded-lg hover:bg-cyan-700 disabled:opacity-50 flex items-center; }
.btn-secondary { @apply bg-gray-200 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-300 flex items-center; }
.btn-page { @apply px-3 py-1 border rounded hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed; }
</style>
