<template>
  <div>
    <div class="card mb-6">
      <div class="card-header flex justify-between items-center">
        <h2 class="card-title">
          <span>Costi Variabili Indiretti Previsionali</span>
          <i class="fas fa-info-circle text-cyan-600 ml-2 cursor-help" title="Questo elenco mostra tutti i costi variabili indiretti dello studio. Sono i costi come l'acqua, l'elettricita, cancelleria che proporzionalmente crescono con l'aumentare dell'attivita clinica. Calcolare il costo al minuto per ogni voce."></i>
        </h2>
        <div class="flex items-center gap-2">
          <button @click="openModal('new')" class="px-3 py-2 bg-green-600 text-white rounded hover:bg-green-700">
            <i class="fas fa-plus"></i>
          </button>
          <NuxtLink to="/costi" class="text-cyan-600 hover:text-cyan-800">
            <i class="fas fa-arrow-left mr-1"></i> Riepilogo
          </NuxtLink>
        </div>
      </div>
    </div>

    <!-- Totale -->
    <div class="card mb-6">
      <div class="bg-green-100 px-4 py-3">
        <span class="text-green-800">COSTI VARIABILI INDIRETTI MINUTO POLTRONA:</span>
        <br>
        <span class="font-bold text-green-900 text-lg">{{ formatNumber(stats.totale) }}</span>
      </div>
    </div>

    <!-- Loading -->
    <div v-if="loading" class="text-center py-12">
      <i class="fas fa-spinner fa-spin text-4xl text-cyan-600"></i>
      <p class="mt-4 text-gray-500">Caricamento costi...</p>
    </div>

    <!-- Tabella -->
    <div v-else class="card">
      <div class="overflow-x-auto">
        <table class="w-full">
          <thead class="bg-gray-50">
            <tr>
              <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Id</th>
              <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Descrizione</th>
              <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Costo Poltrona Minuto</th>
              <th class="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase" style="width: 10%">Azioni</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-200">
            <tr v-if="costi.length === 0">
              <td colspan="4" class="px-4 py-8 text-center text-gray-500">
                Nessun risultato presente
              </td>
            </tr>
            <tr v-for="costo in costi" :key="costo.id" class="hover:bg-gray-50">
              <td class="px-4 py-3 text-sm">{{ costo.id }}</td>
              <td class="px-4 py-3 text-sm">{{ costo.descrizione }}</td>
              <td class="px-4 py-3 text-sm">{{ formatNumber(costo.prezzo) }}</td>
              <td class="px-4 py-3 text-center">
                <button @click="openModal('update', costo)" class="px-2 py-1 bg-cyan-600 text-white text-xs rounded hover:bg-cyan-700 mr-1" title="Modifica">
                  <i class="fas fa-pencil-alt"></i>
                </button>
                <button @click="openModal('delete', costo)" class="px-2 py-1 bg-red-600 text-white text-xs rounded hover:bg-red-700" title="Elimina">
                  <i class="fas fa-times"></i>
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Modal -->
    <div v-if="showModal" class="fixed inset-0 z-50 overflow-y-auto">
      <div class="flex min-h-screen items-center justify-center p-4">
        <div class="fixed inset-0 bg-black bg-opacity-50" @click="closeModal"></div>
        <div class="relative bg-white rounded-lg shadow-xl w-full max-w-md">
          <form @submit.prevent="submitModal">
            <div class="px-6 py-4 border-b">
              <h5 class="text-lg font-semibold">
                {{ modalAction === 'new' ? 'Nuovo Costo' : modalAction === 'update' ? 'Modifica Costo' : 'Elimina Costo' }}
              </h5>
              <button type="button" class="absolute top-4 right-4 text-gray-400 hover:text-gray-600" @click="closeModal">
                <i class="fas fa-times"></i>
              </button>
            </div>
            <div class="p-6 space-y-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Descrizione:</label>
                <input
                  type="text"
                  v-model="modalData.descrizione"
                  class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500"
                  :readonly="modalAction === 'delete'"
                  required
                />
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Prezzo (costo al minuto):</label>
                <input
                  type="number"
                  step="0.0001"
                  min="0"
                  v-model="modalData.prezzo"
                  class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500"
                  :readonly="modalAction === 'delete'"
                  required
                />
              </div>
            </div>
            <div class="px-6 py-4 border-t bg-gray-50 flex justify-end space-x-3">
              <button type="button" class="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300" @click="closeModal">
                Chiudi
              </button>
              <button
                type="submit"
                class="px-4 py-2 rounded-lg text-white"
                :class="modalAction === 'delete' ? 'bg-red-600 hover:bg-red-700' : 'bg-green-600 hover:bg-green-700'"
                :disabled="saving"
              >
                <i v-if="saving" class="fas fa-spinner fa-spin mr-2"></i>
                {{ modalAction === 'delete' ? 'Elimina' : 'Salva' }}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({ layout: 'default' })

const { fetchApi } = useApi()

interface Costo {
  id: number
  descrizione: string
  prezzo: number
}

const loading = ref(true)
const costi = ref<Costo[]>([])
const stats = ref({ totale: 0 })

const showModal = ref(false)
const modalAction = ref<'new' | 'update' | 'delete'>('new')
const modalData = ref({ id: 0, descrizione: '', prezzo: 0 })
const saving = ref(false)

const formatNumber = (v: number) => {
  if (v === null || v === undefined) return '0'
  return v.toLocaleString('it-IT', { minimumFractionDigits: 4, maximumFractionDigits: 4 })
}

const loadData = async () => {
  loading.value = true
  try {
    const res = await fetchApi<any>('/costi/previsionali/variabili_indiretti')
    if (res.success) {
      costi.value = res.data || []
      stats.value = res.stats || { totale: 0 }
    }
  } catch (e) {
    console.error('Errore caricamento costi:', e)
  } finally {
    loading.value = false
  }
}

const openModal = (action: 'new' | 'update' | 'delete', data?: Costo) => {
  modalAction.value = action
  if (action === 'new') {
    modalData.value = { id: 0, descrizione: '', prezzo: 0 }
  } else if (data) {
    modalData.value = { ...data }
  }
  showModal.value = true
}

const closeModal = () => {
  showModal.value = false
  modalData.value = { id: 0, descrizione: '', prezzo: 0 }
}

const submitModal = async () => {
  saving.value = true
  try {
    let res: any
    if (modalAction.value === 'new') {
      res = await fetchApi<any>('/costi/previsionali/variabili_indiretti', {
        method: 'POST',
        body: {
          descrizione: modalData.value.descrizione,
          prezzo: modalData.value.prezzo,
        },
      })
    } else if (modalAction.value === 'update') {
      res = await fetchApi<any>(`/costi/previsionali/variabili_indiretti/${modalData.value.id}`, {
        method: 'PUT',
        body: {
          descrizione: modalData.value.descrizione,
          prezzo: modalData.value.prezzo,
        },
      })
    } else {
      if (!confirm('Attenzione, sei sicuro di voler eliminare questo costo?')) {
        saving.value = false
        return
      }
      res = await fetchApi<any>(`/costi/previsionali/${modalData.value.id}`, {
        method: 'DELETE',
      })
    }

    if (res.success) {
      await loadData()
      closeModal()
    } else {
      alert(res.error || 'Errore durante il salvataggio')
    }
  } catch (e) {
    console.error('Errore:', e)
    alert('Errore di comunicazione con il Server!')
  } finally {
    saving.value = false
  }
}

onMounted(async () => {
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
  @apply text-lg font-semibold text-gray-800 flex items-center;
}
</style>
