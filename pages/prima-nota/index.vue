<template>
  <div>
    <!-- Header Card con Filtri -->
    <div class="card mb-4">
      <div class="card-header flex justify-between items-center">
        <div class="flex items-center gap-3">
          <h2 class="card-title">Prima Nota</h2>
          <i class="fa fa-info-circle text-cyan-600" title="Questo elenco mostra tutti i movimenti della prima nota"></i>
          <button @click="openAddModal" class="btn btn-success btn-sm">
            <i class="fa fa-plus mr-1"></i> Aggiungi
          </button>
        </div>
      </div>
      <div class="card-content p-4">
        <form @submit.prevent="loadData(1)" class="grid grid-cols-1 md:grid-cols-5 gap-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Periodo dal:</label>
            <input type="date" v-model="filters.data_dal" class="form-control">
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">al:</label>
            <input type="date" v-model="filters.data_al" class="form-control">
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Metodo pagamento:</label>
            <select v-model="filters.id_metodo_pagamento" class="form-control">
              <option value="">Tutti</option>
              <option v-for="m in metodiPagamento" :key="m.id" :value="m.id">{{ m.descrizione }}</option>
            </select>
          </div>
          <div class="flex items-end gap-2">
            <button type="submit" class="btn btn-primary">
              <i class="fa fa-search mr-1"></i> Cerca
            </button>
            <button type="button" @click="exportCsv" class="btn btn-primary btn-sm" title="Esporta CSV">
              <i class="fa fa-file-excel mr-1"></i> CSV
            </button>
            <button type="button" @click="exportPdf" class="btn btn-primary btn-sm" title="Esporta PDF">
              <i class="fa fa-file-pdf mr-1"></i> PDF
            </button>
          </div>
        </form>
      </div>
    </div>

    <!-- Tabella Totali per Cassa -->
    <div v-if="totali.length > 0" class="card mb-4">
      <div class="card-content p-0">
        <table class="table table-bordered">
          <thead>
            <tr>
              <th>Collocazione / Tipologia Incasso</th>
              <th class="text-right">Entrate</th>
              <th class="text-right">Uscite</th>
              <th class="text-right">Trasferimenti</th>
              <th class="text-right">Totale</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="t in totali" :key="t.cassa">
              <td class="font-medium">{{ t.cassa }}</td>
              <td class="text-right text-green-600">{{ formatCurrency(t.entrate) }}</td>
              <td class="text-right text-red-600">{{ formatCurrency(t.uscite) }}</td>
              <td class="text-right text-blue-600">{{ formatCurrency(t.trasferimenti) }}</td>
              <td class="text-right font-bold">{{ formatCurrency(t.totale) }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Loading -->
    <div v-if="loading" class="card p-12 text-center">
      <i class="fas fa-spinner fa-spin text-4xl text-cyan-600 mb-4"></i>
      <p class="text-gray-500">Caricamento prima nota...</p>
    </div>

    <!-- Tabella Movimenti -->
    <div v-else class="card">
      <div class="card-content p-0">
        <div class="table-responsive">
          <table class="table table-hover table-bordered">
            <thead>
              <tr>
                <th style="width: 40px"></th>
                <th @click="sortBy('data')" class="sortable-header">
                  Data
                  <span v-if="sortField === 'data'" class="ml-1">
                    <i :class="sortDir === 'asc' ? 'fa fa-sort-up' : 'fa fa-sort-down'"></i>
                  </span>
                </th>
                <th>Tipologia</th>
                <th>Paziente</th>
                <th>Descrizione</th>
                <th>Operatore</th>
                <th>Cassa</th>
                <th class="text-right">Importo</th>
                <th class="text-center">Azioni</th>
              </tr>
            </thead>
            <tbody>
              <tr v-if="movimenti.length === 0">
                <td colspan="9" class="text-center py-8 text-gray-500">
                  Nessun movimento presente per i criteri selezionati
                </td>
              </tr>
              <tr v-for="m in movimenti" :key="m.id" :class="getRowClass(m)">
                <td class="text-center">
                  <i v-if="m.verso === 'ENTRATA'" class="fa fa-sign-in-alt" style="font-size:large; color:green;" title="Entrata"></i>
                  <i v-else-if="m.verso === 'USCITA'" class="fa fa-sign-out-alt" style="font-size:large; color:#ef3c3c;" title="Uscita"></i>
                  <i v-else class="fa fa-exchange-alt text-blue-600" title="Trasferimento"></i>
                </td>
                <td>{{ formatDate(m.data) }}</td>
                <td>{{ m.metodo_pagamento || m.tipologia || '-' }}</td>
                <td>
                  <NuxtLink v-if="m.paziente_id" :to="`/pazienti/${m.paziente_id}`" class="text-cyan-600 hover:underline">
                    {{ m.paziente }}
                  </NuxtLink>
                  <span v-else>{{ m.paziente || '-' }}</span>
                </td>
                <td>{{ m.descrizione }}</td>
                <td>{{ m.operatore || '-' }}</td>
                <td>{{ m.cassa }}</td>
                <td class="text-right font-medium">
                  {{ getImportoFormattato(m) }} &euro;
                </td>
                <td class="text-center">
                  <div class="flex justify-center gap-1">
                    <button @click="editMovimento(m)" class="btn btn-primary btn-xs" title="Modifica">
                      <i class="fa fa-pencil-alt"></i>
                    </button>
                    <button @click="deleteMovimento(m)" class="btn btn-danger btn-xs" title="Elimina">
                      <i class="fa fa-times"></i>
                    </button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- Paginazione -->
      <div v-if="pagination.total > 0" class="card-content border-t flex justify-between items-center">
        <p class="text-sm text-gray-600">
          Mostrando {{ ((pagination.page - 1) * pagination.per_page) + 1 }}-{{ Math.min(pagination.page * pagination.per_page, pagination.total) }} di {{ pagination.total }} movimenti
        </p>
        <div v-if="pagination.pages > 1" class="flex gap-1">
          <button @click="loadData(pagination.page - 1)" :disabled="pagination.page <= 1" class="btn btn-sm btn-secondary">
            <i class="fa fa-chevron-left"></i>
          </button>
          <button @click="loadData(pagination.page + 1)" :disabled="pagination.page >= pagination.pages" class="btn btn-sm btn-secondary">
            <i class="fa fa-chevron-right"></i>
          </button>
        </div>
      </div>
    </div>

    <!-- Modal Movimento -->
    <div v-if="showModal" class="modal-overlay" @click.self="showModal = false">
      <div class="modal-content">
        <div class="modal-header">
          <h3 class="text-lg font-semibold">{{ modalTitle }}</h3>
          <button @click="showModal = false" class="text-gray-500 hover:text-gray-700">
            <i class="fa fa-times"></i>
          </button>
        </div>
        <form @submit.prevent="salvaMovimento" class="modal-body">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Data *</label>
              <input type="date" v-model="formData.data" required class="form-control" :disabled="formData.autogen">
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Tipologia *</label>
              <select v-model="formData.verso" required class="form-control" :disabled="formData.autogen || formData.id">
                <option value="ENTRATA">Entrata</option>
                <option value="USCITA">Uscita</option>
                <option value="TRASFERIMENTO">Trasferimento</option>
              </select>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Collocazione *</label>
              <select v-model="formData.id_collocazione" required class="form-control">
                <option value="">Seleziona cassa</option>
                <option v-for="c in casse" :key="c.id" :value="c.id">{{ c.nome }}</option>
              </select>
            </div>
            <div v-if="formData.verso === 'TRASFERIMENTO'">
              <label class="block text-sm font-medium text-gray-700 mb-1">Destinazione *</label>
              <select v-model="formData.id_collocazione_destinazione" :required="formData.verso === 'TRASFERIMENTO'" class="form-control">
                <option value="">Seleziona destinazione</option>
                <option v-for="c in casse" :key="c.id" :value="c.id">{{ c.nome }}</option>
              </select>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Metodo pagamento</label>
              <select v-model="formData.id_metodo_pagamento" class="form-control">
                <option value="">Nessuno</option>
                <option v-for="m in metodiPagamento" :key="m.id" :value="m.id">{{ m.descrizione }}</option>
              </select>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Importo *</label>
              <input type="number" step="0.01" min="0.01" v-model="formData.prezzo" required class="form-control" :disabled="formData.autogen">
            </div>
            <div class="md:col-span-2">
              <label class="block text-sm font-medium text-gray-700 mb-1">Descrizione *</label>
              <textarea v-model="formData.descrizione" required rows="2" class="form-control" :disabled="formData.autogen"></textarea>
            </div>
            <div class="md:col-span-2">
              <label class="block text-sm font-medium text-gray-700 mb-1">Note</label>
              <textarea v-model="formData.note" rows="2" class="form-control"></textarea>
            </div>
          </div>
        </form>
        <div class="modal-footer">
          <button type="button" @click="showModal = false" class="btn btn-secondary">Annulla</button>
          <button type="submit" @click="salvaMovimento" class="btn btn-success">
            <i class="fa fa-save mr-1"></i> Salva
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({ layout: 'default' })

const { fetchApi } = useApi()

const loading = ref(true)
const movimenti = ref<any[]>([])
const metodiPagamento = ref<any[]>([])
const casse = ref<any[]>([])
const totali = ref<any[]>([])
const showModal = ref(false)
const sortField = ref('data')
const sortDir = ref<'asc' | 'desc'>('desc')

const pagination = reactive({
  page: 1,
  pages: 1,
  per_page: 25,
  total: 0
})

const oggi = new Date()
const inizioAnno = new Date(oggi.getFullYear(), 0, 1)

const filters = reactive({
  data_dal: inizioAnno.toISOString().split('T')[0],
  data_al: oggi.toISOString().split('T')[0],
  id_metodo_pagamento: ''
})

const formData = reactive({
  id: null as number | null,
  data: oggi.toISOString().split('T')[0],
  verso: 'ENTRATA',
  prezzo: 0,
  descrizione: '',
  id_collocazione: '',
  id_collocazione_destinazione: '',
  id_metodo_pagamento: '',
  note: '',
  autogen: false
})

const modalTitle = computed(() => formData.id ? 'Modifica Movimento' : 'Nuovo Movimento')

const formatDate = (d: string) => {
  if (!d) return '-'
  const date = new Date(d)
  const day = String(date.getDate()).padStart(2, '0')
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const year = date.getFullYear()
  return `${day}-${month}-${year}`
}
const formatCurrency = (v: any) => new Intl.NumberFormat('it-IT', { style: 'currency', currency: 'EUR' }).format(parseFloat(v) || 0)

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

const sortBy = (field: string) => {
  if (sortField.value === field) {
    sortDir.value = sortDir.value === 'asc' ? 'desc' : 'asc'
  } else {
    sortField.value = field
    sortDir.value = 'desc'
  }
  loadData(1)
}

const loadMetodiPagamento = async () => {
  try {
    const res = await fetchApi<any>('/metodi-pagamento')
    if (res.success) {
      metodiPagamento.value = res.data || []
    }
  } catch (e) {
    console.error('Errore caricamento metodi pagamento:', e)
  }
}

const loadCasse = async () => {
  try {
    const res = await fetchApi<any>('/finance/casse')
    if (res.success) {
      casse.value = res.data || []
    }
  } catch (e) {
    console.error('Errore caricamento casse:', e)
  }
}

const loadData = async (page = 1) => {
  loading.value = true
  try {
    const params = new URLSearchParams()
    params.append('page', page.toString())
    params.append('limit', pagination.per_page.toString())
    params.append('data_dal', filters.data_dal)
    params.append('data_al', filters.data_al)
    if (filters.id_metodo_pagamento) {
      params.append('id_metodo_pagamento', filters.id_metodo_pagamento)
    }

    const res = await fetchApi<any>(`/prima-nota?${params.toString()}`)
    if (res.success) {
      movimenti.value = res.data || []
      totali.value = res.totali || []
      if (res.pagination) {
        pagination.page = res.pagination.page
        pagination.pages = res.pagination.pages
        pagination.total = res.pagination.total
      }
    }
  } catch (e) {
    console.error('Errore caricamento prima nota:', e)
  } finally {
    loading.value = false
  }
}

const openAddModal = () => {
  Object.assign(formData, {
    id: null,
    data: oggi.toISOString().split('T')[0],
    verso: 'ENTRATA',
    prezzo: 0,
    descrizione: '',
    id_collocazione: '',
    id_collocazione_destinazione: '',
    id_metodo_pagamento: '',
    note: '',
    autogen: false
  })
  showModal.value = true
}

const editMovimento = (m: any) => {
  Object.assign(formData, {
    id: m.id,
    data: m.data?.split('T')[0] || m.data,
    verso: m.verso,
    prezzo: m.prezzo,
    descrizione: m.descrizione,
    id_collocazione: m.cassa_id,
    id_collocazione_destinazione: '',
    id_metodo_pagamento: '',
    note: m.note || '',
    autogen: m.autogen
  })
  showModal.value = true
}

const salvaMovimento = async () => {
  try {
    const body = {
      data: formData.data,
      verso: formData.verso,
      prezzo: formData.prezzo,
      descrizione: formData.descrizione,
      id_collocazione: formData.id_collocazione,
      id_collocazione_destinazione: formData.verso === 'TRASFERIMENTO' ? formData.id_collocazione_destinazione : null,
      id_metodo_pagamento: formData.id_metodo_pagamento || null,
      note: formData.note
    }

    if (formData.id) {
      await fetchApi(`/prima-nota/${formData.id}`, { method: 'PUT', body })
    } else {
      await fetchApi('/prima-nota', { method: 'POST', body })
    }

    showModal.value = false
    await loadData(pagination.page)
  } catch (e) {
    console.error('Errore salvataggio movimento:', e)
    alert('Errore durante il salvataggio')
  }
}

const deleteMovimento = async (m: any) => {
  if (!confirm('Eliminare questo movimento?')) return
  try {
    await fetchApi(`/prima-nota/${m.id}`, { method: 'DELETE' })
    await loadData(pagination.page)
  } catch (e) {
    console.error('Errore eliminazione movimento:', e)
    alert('Errore durante l\'eliminazione')
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
  await Promise.all([
    loadMetodiPagamento(),
    loadCasse()
  ])
  await loadData()
})
</script>

<style scoped>
.card {
  @apply bg-white rounded-lg shadow;
}
.card-header {
  @apply px-4 py-3 border-b border-gray-200;
}
.card-title {
  @apply text-lg font-semibold text-gray-800;
}
.card-content {
  @apply p-4;
}
.form-control {
  @apply w-full px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500;
}
.btn {
  @apply inline-flex items-center px-4 py-2 rounded font-medium transition-colors;
}
.btn-sm {
  @apply px-3 py-1 text-sm;
}
.btn-xs {
  @apply px-2 py-1 text-xs;
}
.btn-primary {
  @apply bg-cyan-600 text-white hover:bg-cyan-700;
}
.btn-secondary {
  @apply bg-gray-200 text-gray-700 hover:bg-gray-300;
}
.btn-success {
  @apply bg-green-600 text-white hover:bg-green-700;
}
.btn-info {
  @apply bg-blue-500 text-white hover:bg-blue-600;
}
.btn-danger {
  @apply bg-red-600 text-white hover:bg-red-700;
}
.btn:disabled {
  @apply opacity-50 cursor-not-allowed;
}
.table-responsive {
  @apply overflow-x-auto;
}
.table {
  @apply w-full border-collapse;
}
.table th, .table td {
  @apply border border-gray-200 px-4 py-3 text-left text-sm;
}
.table th {
  @apply bg-gray-50 font-medium text-gray-700;
}
.table-hover tbody tr:hover {
  @apply bg-gray-100;
}

/* Parity Zend: colori righe tabella */
.row-danger { background-color: #f8d7da !important; }
.row-success { background-color: #d4edda !important; }
.row-green { background-color: #c3e6cb !important; }
.sortable-header {
  @apply cursor-pointer select-none;
}

/* Modal styles */
.modal-overlay {
  @apply fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50;
}
.modal-content {
  @apply bg-white rounded-lg shadow-xl w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto;
}
.modal-header {
  @apply flex justify-between items-center px-6 py-4 border-b border-gray-200;
}
.modal-body {
  @apply px-6 py-4;
}
.modal-footer {
  @apply flex justify-end gap-2 px-6 py-4 border-t border-gray-200;
}
</style>
