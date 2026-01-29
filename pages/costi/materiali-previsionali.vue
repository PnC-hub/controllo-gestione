<template>
  <div>
    <div class="card">
      <div class="card-header">
        <h2 class="card-title">
          <span>Costi Materiali Previsionali</span>
          <i class="fas fa-info-circle text-cyan-600 ml-2" title="Questo elenco mostra tutti i costi dei materiali per ogni prestazione"></i>
        </h2>
      </div>
      <div class="card-content">
        <!-- Loading -->
        <div v-if="loading" class="text-center py-8">
          <i class="fas fa-spinner fa-spin text-2xl text-cyan-600"></i>
          <p class="mt-2 text-gray-500">Caricamento categorie...</p>
        </div>

        <!-- Error -->
        <div v-else-if="error" class="text-center py-8 text-red-500">
          <i class="fas fa-exclamation-triangle text-2xl mb-2"></i>
          <p>{{ error }}</p>
          <button class="mt-2 text-cyan-600 underline" @click="loadCategorie">Riprova</button>
        </div>

        <!-- Accordion Categorie -->
        <div v-else class="accordion space-y-2">
          <div v-if="categorie.length === 0" class="text-center py-8 text-gray-500">
            <i class="fas fa-inbox text-4xl mb-2 text-gray-300"></i>
            <p>Nessuna categoria trovata</p>
          </div>

          <div
            v-for="cat in categorie"
            :key="cat.id"
            class="border rounded-lg overflow-hidden"
          >
            <!-- Header Categoria (clickable) -->
            <button
              class="w-full px-4 py-3 bg-gray-50 hover:bg-gray-100 flex justify-between items-center text-left"
              @click="toggleCategoria(cat.id)"
            >
              <span class="font-medium text-gray-800">{{ cat.nome.toUpperCase() }}</span>
              <i :class="openCategorie.includes(cat.id) ? 'fas fa-angle-up' : 'fas fa-angle-down'" class="text-gray-500"></i>
            </button>

            <!-- Content Categoria -->
            <div v-show="openCategorie.includes(cat.id)" class="p-4">
              <!-- Loading categoria -->
              <div v-if="loadingCategorie[cat.id]" class="text-center py-4">
                <i class="fas fa-spinner fa-spin text-cyan-600"></i>
                <span class="ml-2 text-gray-500">Caricamento prestazioni...</span>
              </div>

              <!-- Tabella prestazioni -->
              <div v-else-if="categorieData[cat.id]">
                <table class="w-full">
                  <thead class="bg-gray-100">
                    <tr>
                      <th class="px-4 py-2 text-left text-sm font-medium text-gray-600" style="width: 85%">Nome</th>
                      <th class="px-4 py-2 text-right text-sm font-medium text-gray-600" style="width: 15%">Costo</th>
                    </tr>
                  </thead>
                  <tbody>
                    <template v-for="prestazione in categorieData[cat.id].prestazioni" :key="prestazione.id">
                      <!-- Riga prestazione principale -->
                      <tr class="border-b bg-gray-50">
                        <td class="px-4 py-2 font-medium text-gray-800" colspan="2">
                          {{ prestazione.nome }}
                        </td>
                      </tr>
                      <!-- Sottoattività con costi -->
                      <template v-for="sott in prestazione.sottoattivita" :key="sott.id">
                        <tr v-if="sott.costi.length > 0" class="border-b hover:bg-gray-50">
                          <td class="px-4 py-2 pl-8">
                            <div class="text-sm text-gray-600">{{ sott.nome }}</div>
                            <ul class="ml-4 mt-1">
                              <li v-for="costo in sott.costi" :key="costo.id" class="text-xs text-gray-500 flex justify-between">
                                <span>- {{ costo.descrizione }}</span>
                                <span class="font-medium">{{ formatCurrency(costo.prezzo) }}</span>
                              </li>
                            </ul>
                          </td>
                          <td class="px-4 py-2 text-right font-medium text-cyan-600">
                            {{ formatCurrency(sott.totale_costi) }}
                          </td>
                        </tr>
                      </template>
                      <!-- Totale prestazione -->
                      <tr v-if="prestazione.totale_costi > 0" class="border-b-2 border-gray-300">
                        <td class="px-4 py-2 text-right text-sm text-gray-600">Totale {{ prestazione.nome }}:</td>
                        <td class="px-4 py-2 text-right font-bold text-cyan-700">{{ formatCurrency(prestazione.totale_costi) }}</td>
                      </tr>
                    </template>
                    <tr v-if="categorieData[cat.id].prestazioni.length === 0">
                      <td colspan="2" class="px-4 py-4 text-center text-gray-500">
                        Nessuna prestazione con costi materiali
                      </td>
                    </tr>
                  </tbody>
                  <tfoot v-if="categorieData[cat.id].totale_costi > 0" class="bg-gray-100">
                    <tr>
                      <td class="px-4 py-3 text-right font-semibold text-gray-700">TOTALE CATEGORIA:</td>
                      <td class="px-4 py-3 text-right font-bold text-lg text-cyan-600">{{ formatCurrency(categorieData[cat.id].totale_costi) }}</td>
                    </tr>
                  </tfoot>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({ layout: 'default' })

const { fetchApi } = useApi()

const loading = ref(true)
const error = ref('')
const categorie = ref<any[]>([])
const openCategorie = ref<number[]>([])
const loadingCategorie = ref<Record<number, boolean>>({})
const categorieData = ref<Record<number, any>>({})

const formatCurrency = (v: any) => new Intl.NumberFormat('it-IT', { style: 'currency', currency: 'EUR' }).format(parseFloat(v) || 0)

const loadCategorie = async () => {
  loading.value = true
  error.value = ''
  try {
    // Carica le categorie dal backend
    const res = await fetchApi<any>('/categorie-prestazioni')
    if (res.success) {
      categorie.value = res.data || []
    } else {
      error.value = res.error || 'Errore nel caricamento'
    }
  } catch (e: any) {
    error.value = e.message || 'Errore nel caricamento'
  } finally {
    loading.value = false
  }
}

const toggleCategoria = async (categoriaId: number) => {
  if (openCategorie.value.includes(categoriaId)) {
    openCategorie.value = openCategorie.value.filter(id => id !== categoriaId)
  } else {
    openCategorie.value.push(categoriaId)
    // Carica dati categoria se non già caricati
    if (!categorieData.value[categoriaId]) {
      await loadCategoriaData(categoriaId)
    }
  }
}

const loadCategoriaData = async (categoriaId: number) => {
  loadingCategorie.value[categoriaId] = true
  try {
    const res = await fetchApi<any>(`/costi/materiali-categoria/${categoriaId}`)
    if (res.success) {
      categorieData.value[categoriaId] = res.data
    }
  } catch (e) {
    console.error('Errore caricamento categoria:', e)
  } finally {
    loadingCategorie.value[categoriaId] = false
  }
}

onMounted(() => {
  loadCategorie()
})
</script>

<style scoped>
.card { @apply bg-white rounded-lg shadow; }
.card-header { @apply px-4 py-3 border-b border-gray-200; }
.card-title { @apply text-lg font-semibold text-gray-800 flex items-center; }
.card-content { @apply p-4; }
</style>
