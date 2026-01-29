<template>
  <div>
    <div class="card mb-6">
      <div class="card-header flex justify-between items-center">
        <h2 class="card-title">
          <span>Costi Materiali previsionali</span>
          <i class="fas fa-info-circle text-cyan-600 ml-2 cursor-help" title="Questo elenco mostra tutti i costi dei materiali per ogni prestazione"></i>
        </h2>
        <NuxtLink to="/costi" class="text-cyan-600 hover:text-cyan-800">
          <i class="fas fa-arrow-left mr-1"></i> Riepilogo
        </NuxtLink>
      </div>
    </div>

    <!-- Loading -->
    <div v-if="loading" class="text-center py-12">
      <i class="fas fa-spinner fa-spin text-4xl text-cyan-600"></i>
      <p class="mt-4 text-gray-500">Caricamento categorie...</p>
    </div>

    <!-- Empty State -->
    <div v-else-if="categorie.length === 0" class="card">
      <div class="text-center py-12 text-gray-500">
        <i class="fas fa-inbox text-5xl mb-4 text-gray-300"></i>
        <p>Nessuna categoria di prestazioni trovata</p>
      </div>
    </div>

    <!-- Accordion Categorie -->
    <div v-else class="space-y-2" id="accordionPrestazioni">
      <div v-for="cat in categorie" :key="cat.id" class="card">
        <div class="card-header cursor-pointer" @click="toggleCategoria(cat.id)">
          <h5 class="flex items-center justify-between">
            <button class="flex items-center text-left font-medium text-gray-800 hover:text-cyan-600">
              {{ cat.nome.toUpperCase() }}
              <i class="fas fa-angle-down ml-2 transition-transform" :class="{ 'rotate-180': expandedCategorie.includes(cat.id) }"></i>
            </button>
          </h5>
        </div>

        <!-- Contenuto Accordion -->
        <div v-show="expandedCategorie.includes(cat.id)" class="border-t">
          <!-- Loading categoria -->
          <div v-if="loadingCategorie[cat.id]" class="p-4 text-center">
            <i class="fas fa-spinner fa-spin text-cyan-600"></i>
            <span class="ml-2 text-gray-500">Caricamento prestazioni...</span>
          </div>

          <!-- Tabella prestazioni -->
          <div v-else class="overflow-x-auto">
            <table class="w-full text-center">
              <thead class="bg-gray-50">
                <tr>
                  <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase" style="width: 85%">Nome</th>
                  <th class="px-4 py-3 text-xs font-medium text-gray-500 uppercase" style="width: 15%">Costo</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-gray-200">
                <template v-for="prest in categorieData[cat.id]?.prestazioni || []" :key="'p-' + prest.id">
                  <!-- Riga Prestazione (primaria) -->
                  <tr class="bg-cyan-50">
                    <td class="px-4 py-2 text-left font-semibold text-gray-800">{{ prest.nome }}</td>
                    <td class="px-4 py-2 font-semibold">{{ formatCurrency(prest.totale_costi) }}</td>
                  </tr>

                  <!-- Righe Sottoattivita (secondarie) -->
                  <template v-for="sott in prest.sottoattivita" :key="'s-' + sott.id">
                    <tr class="bg-gray-100">
                      <td class="px-4 py-2 text-left pl-8 font-medium text-gray-700">
                        {{ sott.nome }}
                        <button
                          @click="openModal('new', { id_sottoattivita: sott.id })"
                          class="ml-2 px-2 py-1 bg-cyan-600 text-white text-xs rounded hover:bg-cyan-700"
                          title="Aggiungi costo"
                        >
                          <i class="fas fa-plus"></i>
                        </button>
                      </td>
                      <td class="px-4 py-2">{{ formatCurrency(sott.totale_costi) }}</td>
                    </tr>

                    <!-- Righe Costi (dettaglio) -->
                    <tr v-for="costo in sott.costi" :key="'c-' + costo.id" class="hover:bg-gray-50">
                      <td class="px-4 py-2 text-left pl-12 text-gray-600">
                        {{ costo.descrizione }}
                        <button
                          @click="openModal('update', costo)"
                          class="ml-2 px-2 py-1 bg-cyan-600 text-white text-xs rounded hover:bg-cyan-700"
                          title="Modifica costo"
                        >
                          <i class="fas fa-pencil-alt"></i>
                        </button>
                        <button
                          @click="openModal('delete', costo)"
                          class="ml-1 px-2 py-1 bg-red-600 text-white text-xs rounded hover:bg-red-700"
                          title="Elimina costo"
                        >
                          <i class="fas fa-trash"></i>
                        </button>
                      </td>
                      <td class="px-4 py-2">{{ formatCurrency(costo.prezzo) }}</td>
                    </tr>
                  </template>
                </template>

                <!-- Empty state per categoria -->
                <tr v-if="!categorieData[cat.id]?.prestazioni?.length">
                  <td colspan="2" class="px-4 py-8 text-center text-gray-500">
                    Nessuna prestazione con sottoattivita in questa categoria
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal Costo Prestazione -->
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
                <label class="block text-sm font-medium text-gray-700 mb-1">Prezzo:</label>
                <input
                  type="number"
                  step="0.01"
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

interface Sottoattivita {
  id: number
  nome: string
  costi: Costo[]
  totale_costi: number
}

interface Prestazione {
  id: number
  nome: string
  sottoattivita: Sottoattivita[]
  totale_costi: number
}

interface CategoriaData {
  prestazioni: Prestazione[]
  totale_costi: number
}

interface Categoria {
  id: number
  nome: string
}

const loading = ref(true)
const categorie = ref<Categoria[]>([])
const expandedCategorie = ref<number[]>([])
const loadingCategorie = ref<Record<number, boolean>>({})
const categorieData = ref<Record<number, CategoriaData>>({})

// Modal state
const showModal = ref(false)
const modalAction = ref<'new' | 'update' | 'delete'>('new')
const modalData = ref({ id: 0, id_sottoattivita: 0, descrizione: '', prezzo: 0 })
const currentCategoriaId = ref<number | null>(null)
const saving = ref(false)

const formatCurrency = (v: number) => new Intl.NumberFormat('it-IT', { style: 'currency', currency: 'EUR' }).format(v || 0)

const loadCategorie = async () => {
  loading.value = true
  try {
    const res = await fetchApi<any>('/prestazioni/categorie')
    if (res.success) {
      categorie.value = res.data || []
    }
  } catch (e) {
    console.error('Errore caricamento categorie:', e)
  } finally {
    loading.value = false
  }
}

const toggleCategoria = async (catId: number) => {
  const index = expandedCategorie.value.indexOf(catId)
  if (index === -1) {
    expandedCategorie.value.push(catId)
    // Carica i dati della categoria se non gia caricati
    if (!categorieData.value[catId]) {
      await loadCategoriaData(catId)
    }
  } else {
    expandedCategorie.value.splice(index, 1)
  }
}

const loadCategoriaData = async (catId: number) => {
  loadingCategorie.value[catId] = true
  try {
    const res = await fetchApi<any>(`/costi/materiali-categoria/${catId}`)
    if (res.success) {
      categorieData.value[catId] = res.data
    }
  } catch (e) {
    console.error('Errore caricamento dati categoria:', e)
  } finally {
    loadingCategorie.value[catId] = false
  }
}

const openModal = (action: 'new' | 'update' | 'delete', data: any) => {
  modalAction.value = action
  if (action === 'new') {
    modalData.value = { id: 0, id_sottoattivita: data.id_sottoattivita, descrizione: '', prezzo: 0 }
    // Trova la categoria corrente dalla sottoattivita
    for (const catId of Object.keys(categorieData.value)) {
      const catData = categorieData.value[parseInt(catId)]
      for (const prest of catData.prestazioni) {
        for (const sott of prest.sottoattivita) {
          if (sott.id === data.id_sottoattivita) {
            currentCategoriaId.value = parseInt(catId)
            break
          }
        }
      }
    }
  } else {
    modalData.value = { ...data, id_sottoattivita: 0 }
    // Trova la categoria dal costo
    for (const catId of Object.keys(categorieData.value)) {
      const catData = categorieData.value[parseInt(catId)]
      for (const prest of catData.prestazioni) {
        for (const sott of prest.sottoattivita) {
          if (sott.costi.some(c => c.id === data.id)) {
            currentCategoriaId.value = parseInt(catId)
            break
          }
        }
      }
    }
  }
  showModal.value = true
}

const closeModal = () => {
  showModal.value = false
  modalData.value = { id: 0, id_sottoattivita: 0, descrizione: '', prezzo: 0 }
}

const submitModal = async () => {
  saving.value = true
  try {
    let res: any
    if (modalAction.value === 'new') {
      res = await fetchApi<any>('/costi/materiali-prestazioni', {
        method: 'POST',
        body: {
          id_sottoattivita: modalData.value.id_sottoattivita,
          descrizione: modalData.value.descrizione,
          prezzo: modalData.value.prezzo,
        },
      })
    } else if (modalAction.value === 'update') {
      res = await fetchApi<any>(`/costi/materiali-prestazioni/${modalData.value.id}`, {
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
      res = await fetchApi<any>(`/costi/materiali-prestazioni/${modalData.value.id}`, {
        method: 'DELETE',
      })
    }

    if (res.success) {
      // Refresh della categoria corrente
      if (currentCategoriaId.value) {
        await loadCategoriaData(currentCategoriaId.value)
      }
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
  await loadCategorie()
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
