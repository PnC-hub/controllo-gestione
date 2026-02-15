<template>
  <div>
    <div class="card mb-4">
      <div class="card-header">
        <div class="flex items-center gap-2">
          <h2 class="card-title">
            BEP - Break Even Point
          </h2>
          <PageInfoButton
            title="Break Even Point"
            description="Calcolo del punto di pareggio aziendale con analisi scenari"
            :features="[
              'Calcolo BEP automatico',
              'Grafico interattivo',
              'Analisi what-if'
            ]"
          />
        </div>
      </div>
      <div class="card-content p-4">
        <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Anno:</label>
            <select v-model="filters.anno" class="input-field" @change="loadData()">
              <option v-for="a in anni" :key="a" :value="a">{{ a }}</option>
            </select>
          </div>
          <div class="flex items-end">
            <button @click="loadData()" class="px-4 py-2 bg-cyan-600 text-white rounded hover:bg-cyan-700">
              <i class="fas fa-calculator mr-2"></i> Calcola BEP
            </button>
          </div>
        </div>
      </div>
    </div>

    <div v-if="loading" class="bg-white rounded-lg shadow p-12 text-center">
      <i class="fas fa-spinner fa-spin text-4xl text-cyan-600 mb-4"></i>
      <p class="text-gray-500">Calcolo BEP in corso...</p>
    </div>

    <div v-else>
      <!-- BEP Card -->
      <div class="bg-gradient-to-r from-cyan-500 to-cyan-600 rounded-lg shadow p-6 mb-4 text-white">
        <div class="text-center">
          <p class="text-cyan-100 text-sm uppercase">Break Even Point {{ data.anno }}</p>
          <p class="text-4xl font-bold">{{ formatCurrency(data.bep) }}</p>
          <p class="text-cyan-100 text-sm mt-2">
            Fatturato necessario per raggiungere il pareggio
          </p>
        </div>
      </div>

      <!-- Indicatori -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
        <!-- Costi Fissi -->
        <div class="bg-white rounded-lg shadow p-4">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-gray-500 text-sm">Costi Fissi</p>
              <p class="text-2xl font-bold text-gray-800">{{ formatCurrency(data.costi_fissi) }}</p>
            </div>
            <div class="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
              <i class="fas fa-building text-red-600 text-xl"></i>
            </div>
          </div>
        </div>

        <!-- Costi Variabili Indiretti -->
        <div class="bg-white rounded-lg shadow p-4">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-gray-500 text-sm">Costi Var. Indiretti</p>
              <p class="text-2xl font-bold text-gray-800">{{ formatCurrency(data.costi_variabili_indiretti) }}</p>
            </div>
            <div class="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center">
              <i class="fas fa-chart-line text-orange-600 text-xl"></i>
            </div>
          </div>
        </div>

        <!-- Costi Variabili Gestionali -->
        <div class="bg-white rounded-lg shadow p-4">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-gray-500 text-sm">Costi Var. Gestionali</p>
              <p class="text-2xl font-bold text-gray-800">{{ formatCurrency(data.costi_variabili_gestionali) }}</p>
            </div>
            <div class="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center">
              <i class="fas fa-cogs text-yellow-600 text-xl"></i>
            </div>
          </div>
        </div>

        <!-- Fatturato -->
        <div class="bg-white rounded-lg shadow p-4">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-gray-500 text-sm">Fatturato {{ data.anno }}</p>
              <p class="text-2xl font-bold text-green-600">{{ formatCurrency(data.fatturato) }}</p>
            </div>
            <div class="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
              <i class="fas fa-euro-sign text-green-600 text-xl"></i>
            </div>
          </div>
        </div>
      </div>

      <!-- Analisi -->
      <div class="bg-white rounded-lg shadow p-6">
        <h3 class="font-semibold text-gray-800 mb-4">Analisi BEP</h3>

        <div class="mb-6">
          <div class="flex justify-between text-sm mb-2">
            <span class="text-gray-600">Progresso verso il BEP</span>
            <span class="font-medium">{{ progressoBep.toFixed(1) }}%</span>
          </div>
          <div class="w-full bg-gray-200 rounded-full h-6">
            <div class="h-6 rounded-full transition-all duration-500 flex items-center justify-end pr-2"
                 :class="progressoBep >= 100 ? 'bg-green-500' : 'bg-cyan-600'"
                 :style="{ width: Math.min(progressoBep, 100) + '%' }">
              <span v-if="progressoBep > 20" class="text-white text-xs font-medium">
                {{ formatCurrency(data.fatturato) }}
              </span>
            </div>
          </div>
          <div class="flex justify-between text-xs text-gray-500 mt-1">
            <span>0</span>
            <span>BEP: {{ formatCurrency(data.bep) }}</span>
          </div>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div class="p-4 rounded-lg" :class="progressoBep >= 100 ? 'bg-green-50' : 'bg-yellow-50'">
            <div class="flex items-center">
              <i :class="progressoBep >= 100 ? 'fas fa-check-circle text-green-600' : 'fas fa-exclamation-triangle text-yellow-600'" class="text-2xl mr-3"></i>
              <div>
                <p class="font-medium" :class="progressoBep >= 100 ? 'text-green-800' : 'text-yellow-800'">
                  {{ progressoBep >= 100 ? 'BEP Raggiunto!' : 'BEP Non Raggiunto' }}
                </p>
                <p class="text-sm" :class="progressoBep >= 100 ? 'text-green-600' : 'text-yellow-600'">
                  {{ progressoBep >= 100
                    ? `Superato di ${formatCurrency(data.fatturato - data.bep)}`
                    : `Mancano ${formatCurrency(data.bep - data.fatturato)}`
                  }}
                </p>
              </div>
            </div>
          </div>

          <div class="p-4 bg-gray-50 rounded-lg">
            <p class="text-gray-600 text-sm">Costi Variabili Totali</p>
            <p class="text-2xl font-bold text-gray-800">{{ formatCurrency(data.costi_variabili_totali) }}</p>
            <p class="text-xs text-gray-500 mt-1">
              Indiretti + Gestionali
            </p>
          </div>
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

const loading = ref(true)
const data = reactive({
  costi_fissi: 0,
  costi_variabili_indiretti: 0,
  costi_variabili_gestionali: 0,
  costi_variabili_totali: 0,
  fatturato: 0,
  bep: 0,
  anno: new Date().getFullYear()
})

const annoCorrente = new Date().getFullYear()
const anni = Array.from({ length: 5 }, (_, i) => annoCorrente - i)

const filters = reactive({
  anno: annoCorrente
})

const formatCurrency = (v: any) => new Intl.NumberFormat('it-IT', { style: 'currency', currency: 'EUR' }).format(parseFloat(v) || 0)

const progressoBep = computed(() => {
  if (data.bep === 0) return 0
  return (data.fatturato / data.bep) * 100
})

const loadData = async () => {
  loading.value = true
  try {
    const res = await fetchApi<any>(`/finanziario/bep?anno=${filters.anno}`)
    if (res.success && res.data) {
      data.costi_fissi = res.data.costi_fissi || 0
      data.costi_variabili_indiretti = res.data.costi_variabili_indiretti || 0
      data.costi_variabili_gestionali = res.data.costi_variabili_gestionali || 0
      data.costi_variabili_totali = res.data.costi_variabili_totali || 0
      data.fatturato = res.data.fatturato || 0
      data.bep = res.data.bep || 0
      data.anno = res.data.anno || filters.anno
    }
  } catch (e) {
    console.error('Errore caricamento BEP:', e)
  } finally {
    loading.value = false
  }
}

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
.input-field { @apply w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500; }
</style>
