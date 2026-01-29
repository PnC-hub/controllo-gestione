<template>
  <div>
    <div class="card mb-6">
      <div class="card-header flex justify-between items-center">
        <h2 class="card-title">
          <span>Costi Totali Previsionali</span>
          <i class="fas fa-info-circle text-cyan-600 ml-2 cursor-help" title="Questo elenco mostra tutti i costi totali per ogni prestazione e sottoattività. I calcoli vengono generati automaticamente."></i>
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

    <!-- Accordion -->
    <div v-else class="space-y-2">
      <div v-if="categorie.length === 0" class="card">
        <div class="px-4 py-8 text-center text-gray-500">
          Nessuna categoria presente
        </div>
      </div>
      <div v-for="cat in categorie" :key="cat.id" class="card">
        <div
          class="px-4 py-3 cursor-pointer flex justify-between items-center hover:bg-gray-50"
          @click="toggleCategoria(cat.id)"
        >
          <h5 class="font-semibold text-gray-800 uppercase">{{ cat.nome }}</h5>
          <i class="fas" :class="openCategorie.includes(cat.id) ? 'fa-angle-up' : 'fa-angle-down'"></i>
        </div>
        <div v-if="openCategorie.includes(cat.id)" class="border-t">
          <!-- Loading categoria -->
          <div v-if="loadingCategoria === cat.id" class="text-center py-8">
            <i class="fas fa-spinner fa-spin text-2xl text-cyan-600"></i>
            <p class="mt-2 text-gray-500 text-sm">Caricamento prestazioni...</p>
          </div>
          <!-- Tabella prestazioni -->
          <div v-else class="overflow-x-auto">
            <table class="w-full text-sm">
              <thead class="bg-gray-50">
                <tr>
                  <th class="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase" style="width: 30%">Nome</th>
                  <th class="px-3 py-2 text-center text-xs font-medium text-gray-500 uppercase">Costi materiali</th>
                  <th class="px-3 py-2 text-center text-xs font-medium text-gray-500 uppercase">Costi indiretti</th>
                  <th class="px-3 py-2 text-center text-xs font-medium text-gray-500 uppercase">Costi odontotecnico</th>
                  <th class="px-3 py-2 text-center text-xs font-medium text-gray-500 uppercase">Costi clinico</th>
                  <th class="px-3 py-2 text-center text-xs font-medium text-gray-500 uppercase">Costi gestionali</th>
                  <th class="px-3 py-2 text-center text-xs font-medium text-gray-500 uppercase">Costi variabili</th>
                  <th class="px-3 py-2 text-center text-xs font-medium text-gray-500 uppercase">Costi fissi</th>
                  <th class="px-3 py-2 text-center text-xs font-medium text-gray-500 uppercase">Costi totali</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-gray-200">
                <template v-if="categoriaData[cat.id] && categoriaData[cat.id].length > 0">
                  <template v-for="prestazione in categoriaData[cat.id]" :key="prestazione.id">
                    <!-- Riga prestazione (totali) -->
                    <tr class="bg-cyan-50 font-semibold" :class="{ 'opacity-50': prestazione.eliminato }">
                      <td class="px-3 py-2 text-left">
                        {{ prestazione.nome }}
                        <span v-if="prestazione.eliminato" class="text-red-500 text-xs ml-1">(eliminato)</span>
                      </td>
                      <td class="px-3 py-2 text-center">{{ formatCurrency(prestazione.totali.materiali) }}</td>
                      <td class="px-3 py-2 text-center">{{ formatCurrency(prestazione.totali.indiretti) }}</td>
                      <td class="px-3 py-2 text-center">{{ formatCurrency(prestazione.totali.odontotecnico) }}</td>
                      <td class="px-3 py-2 text-center">{{ formatCurrency(prestazione.totali.clinico) }}</td>
                      <td class="px-3 py-2 text-center">{{ formatCurrency(prestazione.totali.gestionali) }}</td>
                      <td class="px-3 py-2 text-center">{{ formatCurrency(prestazione.totali.variabili) }}</td>
                      <td class="px-3 py-2 text-center">{{ formatCurrency(prestazione.totali.fissi) }}</td>
                      <td class="px-3 py-2 text-center font-bold">{{ formatCurrency(prestazione.totali.totale) }}</td>
                    </tr>
                    <!-- Righe sottoattività -->
                    <tr v-for="sott in prestazione.sottoattivita" :key="sott.id" class="hover:bg-gray-50">
                      <td class="px-3 py-2 text-left pl-8 text-gray-600">
                        <i class="fas fa-angle-right mr-1 text-gray-400"></i>
                        {{ sott.nome }}
                        <span class="text-xs text-gray-400 ml-1">({{ sott.durata }} min)</span>
                      </td>
                      <td class="px-3 py-2 text-center text-gray-600">{{ formatCurrency(sott.costi.materiali) }}</td>
                      <td class="px-3 py-2 text-center text-gray-600">{{ formatCurrency(sott.costi.indiretti) }}</td>
                      <td class="px-3 py-2 text-center text-gray-600">{{ formatCurrency(sott.costi.odontotecnico) }}</td>
                      <td class="px-3 py-2 text-center text-gray-600">{{ formatCurrency(sott.costi.clinico) }}</td>
                      <td class="px-3 py-2 text-center text-gray-600">{{ formatCurrency(sott.costi.gestionali) }}</td>
                      <td class="px-3 py-2 text-center text-gray-600">{{ formatCurrency(sott.costi.variabili) }}</td>
                      <td class="px-3 py-2 text-center text-gray-600">{{ formatCurrency(sott.costi.fissi) }}</td>
                      <td class="px-3 py-2 text-center text-gray-600">{{ formatCurrency(sott.costi.totale) }}</td>
                    </tr>
                  </template>
                </template>
                <tr v-else>
                  <td colspan="9" class="px-3 py-8 text-center text-gray-500">
                    Nessuna prestazione in questa categoria
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({ layout: 'default' })

const { fetchApi } = useApi()

interface SottoattivitaCosti {
  materiali: number
  indiretti: number
  odontotecnico: number
  clinico: number
  gestionali: number
  variabili: number
  fissi: number
  totale: number
}

interface Sottoattivita {
  id: number
  nome: string
  durata: number
  costi: SottoattivitaCosti
}

interface Prestazione {
  id: number
  nome: string
  eliminato: boolean
  sottoattivita: Sottoattivita[]
  totali: SottoattivitaCosti
}

interface Categoria {
  id: number
  nome: string
}

const loading = ref(true)
const categorie = ref<Categoria[]>([])
const openCategorie = ref<number[]>([])
const loadingCategoria = ref<number | null>(null)
const categoriaData = ref<Record<number, Prestazione[]>>({})

const formatCurrency = (v: number) => {
  if (v === null || v === undefined) return '€ 0,00'
  return '€ ' + v.toLocaleString('it-IT', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
}

const loadCategorie = async () => {
  loading.value = true
  try {
    const res = await fetchApi<any>('/costi/totali-previsionali')
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
  const idx = openCategorie.value.indexOf(catId)
  if (idx >= 0) {
    openCategorie.value.splice(idx, 1)
  } else {
    openCategorie.value.push(catId)
    // Carica dati se non già caricati
    if (!categoriaData.value[catId]) {
      await loadCategoriaData(catId)
    }
  }
}

const loadCategoriaData = async (catId: number) => {
  loadingCategoria.value = catId
  try {
    const res = await fetchApi<any>(`/costi/totali-previsionali/${catId}`)
    if (res.success) {
      categoriaData.value[catId] = res.data || []
    }
  } catch (e) {
    console.error('Errore caricamento categoria:', e)
    categoriaData.value[catId] = []
  } finally {
    loadingCategoria.value = null
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
