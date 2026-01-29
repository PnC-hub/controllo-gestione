<template>
  <div>
    <div class="flex justify-between items-center mb-6">
      <h1 class="text-2xl font-bold text-gray-900 uppercase">
        Prima Nota
        <i class="fa fa-info-circle text-primary text-base ml-2" data-toggle="tooltip" title="Questo elenco mostra tutti i movimenti della prima nota che sono stati generati"></i>
        <button @click="showModal = true; modalMode = 'new'" class="btn-success ml-3 uppercase">
          <i class="fa fa-plus mr-1"></i> Aggiungi
        </button>
      </h1>
    </div>

    <!-- Filtri (parity Zend) -->
    <div class="bg-white rounded-lg shadow p-4 mb-6">
      <div class="grid grid-cols-1 md:grid-cols-12 gap-4 items-end">
        <div class="md:col-span-2">
          <label class="block text-sm font-medium text-gray-700 mb-1 uppercase">Periodo dal:</label>
          <input type="date" v-model="filters.data_dal" @change="loadMovimenti" class="input-field" />
        </div>
        <div class="md:col-span-2">
          <label class="block text-sm font-medium text-gray-700 mb-1 uppercase">al:</label>
          <input type="date" v-model="filters.data_al" @change="loadMovimenti" class="input-field" />
        </div>
        <div class="md:col-span-3">
          <label class="block text-sm font-medium text-gray-700 mb-1 uppercase">Pagamento:</label>
          <select v-model="filters.id_metodo_pagamento" @change="loadMovimenti" class="input-field">
            <option value="">Tutti</option>
            <option v-for="m in metodiPagamento" :key="m.id" :value="m.id">{{ m.descrizione }}</option>
          </select>
        </div>
        <div class="md:col-span-3 flex space-x-2">
          <button @click="exportCsv" class="btn-primary btn-sm">
            <i class="fa fa-file-excel mr-1"></i> Export CSV
          </button>
          <button @click="exportPdf" class="btn-primary btn-sm">
            <i class="fa fa-file-pdf mr-1"></i> Export PDF
          </button>
        </div>
      </div>
    </div>

    <!-- Tabella Totali per Cassa (parity Zend) -->
    <div v-if="totaliCasse.length > 0" class="bg-white rounded-lg shadow p-4 mb-4">
      <table class="min-w-full text-sm">
        <thead class="bg-teal-600 text-white">
          <tr>
            <th class="text-left py-2 px-3 font-medium">Collocazione Incasso</th>
            <th class="text-right py-2 px-3 font-medium">Entrate</th>
            <th class="text-right py-2 px-3 font-medium">Uscite</th>
            <th class="text-right py-2 px-3 font-medium">Trasferimenti</th>
            <th class="text-right py-2 px-3 font-medium">Totale</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="t in totaliCasse" :key="t.cassa_id" class="border-b border-gray-200">
            <td class="py-2 px-3">{{ t.cassa }}</td>
            <td class="text-right py-2 px-3 text-green-600">{{ formatNumber(t.entrate) }}</td>
            <td class="text-right py-2 px-3 text-red-600">{{ formatNumber(t.uscite) }}</td>
            <td class="text-right py-2 px-3">{{ formatNumber(t.trasferimenti) }}</td>
            <td class="text-right py-2 px-3 font-medium">{{ formatNumber(t.totale) }}</td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Tabella Totali per Tipologia (parity Zend) -->
    <div v-if="totaliTipologia.length > 0" class="bg-white rounded-lg shadow p-4 mb-6">
      <table class="min-w-full text-sm">
        <thead class="bg-teal-600 text-white">
          <tr>
            <th class="text-left py-2 px-3 font-medium">Tipologia Incasso</th>
            <th class="text-right py-2 px-3 font-medium">Entrate</th>
            <th class="text-right py-2 px-3 font-medium">Uscite</th>
            <th class="text-right py-2 px-3 font-medium">Trasferimenti</th>
            <th class="text-right py-2 px-3 font-medium">Totale</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="t in totaliTipologia" :key="t.tipologia_id" class="border-b border-gray-200">
            <td class="py-2 px-3">{{ t.tipologia }}</td>
            <td class="text-right py-2 px-3 text-green-600">{{ formatNumber(t.entrate) }}</td>
            <td class="text-right py-2 px-3 text-red-600">{{ formatNumber(t.uscite) }}</td>
            <td class="text-right py-2 px-3">{{ formatNumber(t.trasferimenti) }}</td>
            <td class="text-right py-2 px-3 font-medium">{{ formatNumber(t.totale) }}</td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Loading -->
    <div v-if="loading" class="bg-white rounded-lg shadow p-12 text-center">
      <i class="fas fa-spinner fa-spin text-4xl text-cyan-600 mb-4"></i>
      <p class="text-gray-500">Caricamento movimenti...</p>
    </div>

    <!-- Tabella Movimenti -->
    <div v-else class="bg-white rounded-lg shadow overflow-x-auto">
      <table class="min-w-full divide-y divide-gray-200">
        <thead class="bg-gray-50">
          <tr>
            <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase"></th>
            <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Data</th>
            <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Tipologia</th>
            <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Paziente</th>
            <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Descrizione</th>
            <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Operatore</th>
            <th v-for="c in casse" :key="c.id" class="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">{{ c.nome }}</th>
            <th class="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase">Azioni</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-gray-200">
          <tr v-if="movimenti.length === 0">
            <td :colspan="7 + casse.length" class="px-6 py-12 text-center text-gray-500">
              <i class="fas fa-exchange-alt text-4xl mb-2"></i>
              <p>Nessun movimento trovato</p>
            </td>
          </tr>
          <tr v-for="m in movimenti" :key="m.id" :class="getRowClass(m)">
            <td class="px-4 py-3">
              <i v-if="m.verso === 'ENTRATA'" class="glyphicon glyphicon-log-in" data-toggle="tooltip" title="Entrata" style="font-size:large; color:green;"></i>
              <i v-else class="glyphicon glyphicon-log-out" data-toggle="tooltip" title="Uscita" style="font-size:large; color:#ef3c3c;"></i>
            </td>
            <td class="px-4 py-3 text-sm">{{ formatDate(m.data) }}</td>
            <td class="px-4 py-3 text-sm">{{ m.metodo_pagamento || m.tipologia || '-' }}</td>
            <td class="px-4 py-3 text-sm">
              <NuxtLink v-if="m.paziente_id" :to="`/pazienti/${m.paziente_id}`" class="text-cyan-600 hover:underline">
                {{ m.paziente }}
              </NuxtLink>
              <span v-else>-</span>
            </td>
            <td class="px-4 py-3 text-sm">{{ m.descrizione }}</td>
            <td class="px-4 py-3 text-sm">{{ m.operatore || '-' }}</td>
            <td v-for="c in casse" :key="c.id" class="px-4 py-3 text-sm text-right">
              <span v-if="m.cassa_id === c.id || m.id_collocazione === c.id">
                {{ getImportoFormattato(m) }} &euro;
              </span>
            </td>
            <td class="px-4 py-3 text-center">
              <button @click="editMovimento(m)" class="btn btn-primary btn-sm mr-1" title="Modifica">
                <i class="fa fa-pencil-alt"></i>
              </button>
              <button @click="deleteMovimento(m)" class="btn btn-danger btn-sm" title="Elimina">
                <i class="fa fa-times"></i>
              </button>
            </td>
          </tr>
        </tbody>
      </table>

      <!-- Paginazione -->
      <div v-if="pagination.total > 0" class="px-6 py-4 border-t border-gray-200 flex items-center justify-between">
        <p class="text-sm text-gray-500">
          Mostrando {{ ((pagination.page - 1) * pagination.per_page) + 1 }}-{{ Math.min(pagination.page * pagination.per_page, pagination.total) }} di {{ pagination.total }} movimenti
        </p>
        <div class="flex space-x-2">
          <button @click="goToPage(pagination.page - 1)" :disabled="pagination.page <= 1" class="px-3 py-1 border rounded hover:bg-gray-50 disabled:opacity-50">
            Precedente
          </button>
          <button @click="goToPage(pagination.page + 1)" :disabled="pagination.page >= pagination.pages" class="px-3 py-1 border rounded hover:bg-gray-50 disabled:opacity-50">
            Successivo
          </button>
        </div>
      </div>
    </div>

    <!-- Modal Nuovo/Modifica Movimento -->
    <div v-if="showModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div class="bg-white rounded-lg shadow-xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
        <div class="p-6 border-b flex justify-between items-center">
          <h2 class="text-xl font-semibold">{{ modalMode === 'new' ? 'Nuovo' : 'Modifica' }} Movimento</h2>
          <button @click="closeModal" class="text-gray-400 hover:text-gray-600">
            <i class="fas fa-times text-xl"></i>
          </button>
        </div>
        <form @submit.prevent="saveMovimento" class="p-6">
          <div class="space-y-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Data *</label>
              <input type="date" v-model="form.data" required class="input-field" />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Tipologia operazione *</label>
              <select v-model="form.verso" required class="input-field" :disabled="modalMode === 'update' && form.autogen">
                <option value="">Seleziona...</option>
                <option value="ENTRATA">ENTRATA</option>
                <option value="USCITA">USCITA</option>
                <option value="TRASFERIMENTO">TRASFERIMENTO</option>
              </select>
              <small class="text-gray-500">Utilizzare "Trasferimento" per versamenti di assegni/contanti dalla cassa alla banca.</small>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Collocazione di partenza *</label>
              <select v-model="form.id_collocazione" required class="input-field">
                <option v-for="c in casse" :key="c.id" :value="c.id">{{ c.nome }}</option>
              </select>
            </div>
            <div v-if="form.verso === 'TRASFERIMENTO'">
              <label class="block text-sm font-medium text-gray-700 mb-1">Collocazione di destinazione *</label>
              <select v-model="form.id_collocazione_destinazione" :required="form.verso === 'TRASFERIMENTO'" class="input-field">
                <option v-for="c in casse" :key="c.id" :value="c.id">{{ c.nome }}</option>
              </select>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Tipologia pagamento *</label>
              <select v-model="form.id_metodo_pagamento" required class="input-field">
                <option v-for="m in metodiPagamento" :key="m.id" :value="m.id">{{ m.descrizione }}</option>
              </select>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Descrizione</label>
              <textarea v-model="form.descrizione" class="input-field" rows="2" :disabled="modalMode === 'update' && form.autogen"></textarea>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Importo *</label>
              <input type="number" v-model="form.prezzo" required step="0.01" min="0" class="input-field" :disabled="modalMode === 'update' && form.autogen" />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Note</label>
              <textarea v-model="form.note" class="input-field" rows="2"></textarea>
            </div>
          </div>
          <div class="flex justify-end space-x-2 mt-6">
            <button type="button" @click="closeModal" class="btn-secondary">Chiudi</button>
            <button type="submit" :disabled="saving" class="btn-primary">
              <i v-if="saving" class="fas fa-spinner fa-spin mr-2"></i>
              {{ saving ? 'Salvataggio...' : 'Salva' }}
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({ layout: 'default' })

const { fetchApi } = useApi()

const loading = ref(true)
const saving = ref(false)
const showModal = ref(false)
const modalMode = ref<'new' | 'update'>('new')
const editingId = ref<number | null>(null)

const movimenti = ref<any[]>([])
const casse = ref<any[]>([])
const metodiPagamento = ref<any[]>([])
const totaliCasse = ref<any[]>([])
const totaliTipologia = ref<any[]>([])

const pagination = reactive({
  page: 1,
  pages: 1,
  per_page: 25,
  total: 0
})

const filters = reactive({
  data_dal: new Date(new Date().getFullYear(), 0, 1).toISOString().split('T')[0],
  data_al: new Date().toISOString().split('T')[0],
  id_metodo_pagamento: ''
})

const form = reactive({
  data: new Date().toISOString().split('T')[0],
  verso: '',
  id_collocazione: null as number | null,
  id_collocazione_destinazione: null as number | null,
  id_metodo_pagamento: null as number | null,
  descrizione: '',
  prezzo: 0,
  note: '',
  autogen: false
})

const formatCurrency = (value: number) => {
  return new Intl.NumberFormat('it-IT', { style: 'currency', currency: 'EUR' }).format(value || 0)
}

// Formato numero senza simbolo € (come legacy)
const formatNumber = (value: number) => {
  if (!value && value !== 0) return '0,00'
  return new Intl.NumberFormat('it-IT', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(value)
}

const formatDate = (dateStr: string) => {
  if (!dateStr) return '-'
  const date = new Date(dateStr)
  const day = String(date.getDate()).padStart(2, '0')
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const year = date.getFullYear()
  return `${day}-${month}-${year}`
}

// Parity Zend: classi riga basate su verso e metodo pagamento
const getRowClass = (m: any) => {
  if (m.verso?.toUpperCase() === 'USCITA') {
    return 'row-danger'
  }
  if (m.verso?.toUpperCase() === 'ENTRATA') {
    // POS (2), Bonifico (4), Finanziamento (5) = verde chiaro
    if (m.id_metodo_pagamento === 2 || m.id_metodo_pagamento === 4 || m.id_metodo_pagamento === 5) {
      return 'row-green'
    }
    return 'row-success'
  }
  return ''
}

// Parity Zend: formato importo con segno
const getImportoFormattato = (m: any) => {
  const prezzo = parseFloat(m.prezzo) || 0
  if (m.verso?.toUpperCase() === 'USCITA') {
    return '-' + prezzo.toFixed(2).replace('.', ',')
  }
  return prezzo.toFixed(2).replace('.', ',')
}

const loadCasse = async () => {
  try {
    const res = await fetchApi<any>('/finance/casse')
    if (res.success) casse.value = res.data || []
  } catch (e) {
    console.error('Errore caricamento casse:', e)
  }
}

const loadMetodiPagamento = async () => {
  try {
    const res = await fetchApi<any>('/metodi-pagamento')
    if (res.success) metodiPagamento.value = res.data || []
  } catch (e) {
    console.error('Errore caricamento metodi pagamento:', e)
  }
}

const loadTotaliTipologia = async () => {
  try {
    const params = new URLSearchParams()
    params.append('data_dal', filters.data_dal)
    params.append('data_al', filters.data_al)
    const res = await fetchApi<any>(`/prima-nota/totali-tipologia?${params.toString()}`)
    if (res.success) totaliTipologia.value = res.data || []
  } catch (e) {
    console.error('Errore caricamento totali tipologia:', e)
  }
}

const loadMovimenti = async (page = 1) => {
  loading.value = true
  try {
    const params = new URLSearchParams()
    params.append('page', page.toString())
    params.append('limit', pagination.per_page.toString())
    params.append('data_dal', filters.data_dal)
    params.append('data_al', filters.data_al)
    if (filters.id_metodo_pagamento) params.append('id_metodo_pagamento', filters.id_metodo_pagamento.toString())

    const res = await fetchApi<any>(`/prima-nota?${params.toString()}`)
    if (res.success) {
      movimenti.value = res.data || []
      totaliCasse.value = res.totali || []
      if (res.pagination) {
        pagination.page = res.pagination.page
        pagination.pages = res.pagination.pages
        pagination.per_page = res.pagination.per_page
        pagination.total = res.pagination.total
      }
    }

    // Carica anche totali per tipologia
    await loadTotaliTipologia()
  } catch (e) {
    console.error('Errore caricamento movimenti:', e)
  } finally {
    loading.value = false
  }
}

const resetFilters = () => {
  filters.data_dal = new Date(new Date().getFullYear(), 0, 1).toISOString().split('T')[0]
  filters.data_al = new Date().toISOString().split('T')[0]
  filters.id_metodo_pagamento = ''
  loadMovimenti(1)
}

const goToPage = (page: number) => {
  if (page >= 1 && page <= pagination.pages) {
    loadMovimenti(page)
  }
}

const editMovimento = async (m: any) => {
  editingId.value = m.id
  modalMode.value = 'update'

  // Carica dettaglio movimento
  try {
    const res = await fetchApi<any>(`/prima-nota/${m.id}`)
    if (res.success && res.data) {
      const mov = res.data
      form.data = mov.data?.split('T')[0] || mov.data?.split(' ')[0] || ''
      form.verso = mov.verso
      form.id_collocazione = mov.id_collocazione
      form.id_metodo_pagamento = mov.id_metodo_pagamento
      form.descrizione = mov.descrizione || ''
      form.prezzo = parseFloat(mov.prezzo) || 0
      form.note = mov.note || ''
      form.autogen = mov.autogen === 1 || mov.autogen === true
    }
  } catch (e) {
    console.error('Errore caricamento movimento:', e)
  }

  showModal.value = true
}

const deleteMovimento = async (m: any) => {
  if (!confirm('Sei sicuro di voler eliminare questo movimento?')) return
  try {
    const res = await fetchApi<any>(`/prima-nota/${m.id}`, { method: 'DELETE' })
    if (res.success) {
      loadMovimenti(pagination.page)
    }
  } catch (e) {
    console.error('Errore eliminazione movimento:', e)
  }
}

const closeModal = () => {
  showModal.value = false
  editingId.value = null
  modalMode.value = 'new'
  form.data = new Date().toISOString().split('T')[0]
  form.verso = ''
  form.id_collocazione = casse.value[0]?.id || null
  form.id_collocazione_destinazione = null
  form.id_metodo_pagamento = metodiPagamento.value[0]?.id || null
  form.descrizione = ''
  form.prezzo = 0
  form.note = ''
  form.autogen = false
}

const saveMovimento = async () => {
  saving.value = true
  try {
    if (form.verso === 'TRASFERIMENTO' && modalMode.value === 'new') {
      // Usa endpoint trasferimento
      const res = await fetchApi<any>('/prima-nota/trasferimento', {
        method: 'POST',
        body: {
          id_collocazione_partenza: form.id_collocazione,
          id_collocazione_destinazione: form.id_collocazione_destinazione,
          prezzo: form.prezzo,
          data: form.data,
          id_metodo_pagamento: form.id_metodo_pagamento,
          descrizione: form.descrizione || 'Trasferimento tra casse',
          note: form.note
        }
      })
      if (res.success) {
        closeModal()
        loadMovimenti(pagination.page)
      }
    } else if (modalMode.value === 'update') {
      // Modifica movimento esistente
      const res = await fetchApi<any>(`/prima-nota/${editingId.value}`, {
        method: 'PUT',
        body: {
          verso: form.verso,
          prezzo: form.prezzo,
          data: form.data,
          descrizione: form.descrizione,
          id_collocazione: form.id_collocazione,
          id_metodo_pagamento: form.id_metodo_pagamento,
          note: form.note
        }
      })
      if (res.success) {
        closeModal()
        loadMovimenti(pagination.page)
      }
    } else {
      // Nuovo movimento
      const res = await fetchApi<any>('/prima-nota', {
        method: 'POST',
        body: {
          tipo: form.verso,
          importo: form.prezzo,
          data: form.data,
          descrizione: form.descrizione,
          id_cassa: form.id_collocazione,
          id_metodo_pagamento: form.id_metodo_pagamento,
          note: form.note
        }
      })
      if (res.success) {
        closeModal()
        loadMovimenti(pagination.page)
      }
    }
  } catch (e: any) {
    alert(e.data?.error || e.data?.message || 'Errore durante il salvataggio')
  } finally {
    saving.value = false
  }
}

const exportCsv = () => {
  const config = useRuntimeConfig()
  const url = `${config.public.apiBase}/prima-nota/export-csv?data_dal=${filters.data_dal}&data_al=${filters.data_al}&tipo_pagamento=${filters.id_metodo_pagamento || ''}`
  window.open(url, '_blank')
}

const exportPdf = () => {
  const config = useRuntimeConfig()
  const url = `${config.public.apiBase}/prima-nota/export-pdf?data_dal=${filters.data_dal}&data_al=${filters.data_al}&tipo_pagamento=${filters.id_metodo_pagamento || ''}`
  window.open(url, '_blank')
}

onMounted(async () => {
  await Promise.all([loadCasse(), loadMetodiPagamento()])
  form.id_collocazione = casse.value[0]?.id || null
  form.id_metodo_pagamento = metodiPagamento.value[0]?.id || null
  await loadMovimenti()
})
</script>

<style scoped>
.input-field { @apply w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500; }
.btn-primary { @apply px-4 py-2 bg-cyan-600 text-white rounded-lg hover:bg-cyan-700 transition-colors disabled:opacity-50; }
.btn-secondary { @apply px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors; }
.btn-success { @apply px-3 py-1.5 bg-green-600 text-white rounded hover:bg-green-700 transition-colors text-sm; }
.btn-danger { @apply px-2 py-1 bg-red-600 text-white rounded hover:bg-red-700 transition-colors text-sm; }
.btn-sm { @apply px-3 py-1.5 text-sm; }
.btn.btn-primary.btn-sm { @apply px-2 py-1 bg-cyan-600 text-white rounded hover:bg-cyan-700 text-sm; }
.btn.btn-danger.btn-sm { @apply px-2 py-1 bg-red-600 text-white rounded hover:bg-red-700 text-sm; }

/* Parity Zend: colori righe tabella */
.row-danger { background-color: #f8d7da !important; }
.row-success { background-color: #d4edda !important; }
.row-green { background-color: #c3e6cb !important; }

/* Parity Zend: glyphicon icons */
.glyphicon { font-family: 'Glyphicons Halflings', FontAwesome; display: inline-block; }
.glyphicon-log-in::before { content: "\f090"; font-family: FontAwesome; }
.glyphicon-log-out::before { content: "\f08b"; font-family: FontAwesome; }

/* Parity Zend: text-primary */
.text-primary { color: #11A3CA; }
</style>
