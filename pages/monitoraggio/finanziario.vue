<template>
  <div>
    <!-- Header -->
    <div class="mb-6">
      <div class="flex items-center gap-3 mb-2">
        <div class="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center">
          <i class="fas fa-chart-pie text-white text-xl"></i>
        </div>
        <div class="flex-1">
          <h1 class="text-2xl font-bold text-gray-800">Monitor Finanziario</h1>
          <p class="text-gray-500">Utile bilancio, cassa e debiti</p>
        </div>
        <!-- Info Modal -->
        <AiSectionInfoModal
          title="Monitor Finanziario"
          subtitle="Financial monitoring"
          icon="fa-chart-pie"
          header-gradient="bg-gradient-to-r from-emerald-500 to-teal-600"
          description="Il Monitor Finanziario calcola utile bilancio, utile cassa e debiti rispetto agli obiettivi mensili. Gauge visivi mostrano l'avanzamento verso i target."
          :how-it-works="[
            'Seleziona anno e mese da analizzare',
            'Visualizza gauge avanzamento obiettivi',
            'Confronta risultato vs obiettivo',
            'Analizza proiezioni fine mese'
          ]"
          :advantages="[
            'Vista sintetica utili e debiti',
            'Confronto con obiettivi',
            'Proiezioni automatiche',
            'Alert su scostamenti'
          ]"
          :limitations="[
            'Obiettivi da configurare per centro',
            'Proiezioni basate su trend'
          ]"
          quick-start-intro="Per analisi finanziaria:"
          :quick-start-tips="[
            'Verifica scostamenti settimanalmente',
            'Analizza cause variazioni',
            'Aggiorna obiettivi se necessario'
          ]"
          :related-pages="[
            { label: 'Monitor Principale', route: '/monitoraggio/principale', icon: 'fa-tachometer-alt' },
            { label: 'Spese', route: '/monitoraggio/spese', icon: 'fa-wallet' }
          ]"
        />
      </div>
    </div>

    <div class="card">
      <div class="card-header">
        <h2 class="card-title">Filtri</h2>
      </div>
      <div class="card-content">
        <form class="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Anno:</label>
            <select v-model="filters.anno" class="input-field" @change="loadData()">
              <option v-for="a in anni" :key="a" :value="a">{{ a }}</option>
            </select>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Mese:</label>
            <select v-model="filters.mese" class="input-field" @change="loadData()">
              <option v-for="(m, i) in mesiNomi" :key="i" :value="i + 1">{{ m }}</option>
            </select>
          </div>
        </form>

        <div v-if="loading" class="p-12 text-center">
          <i class="fas fa-spinner fa-spin text-4xl text-cyan-600 mb-4"></i>
          <p class="text-gray-500">Caricamento dati finanziari...</p>
        </div>

        <div v-else>
          <!-- Sezione Utile Bilancio -->
          <div class="grid grid-cols-1 lg:grid-cols-6 gap-4 mb-8">
            <div class="lg:col-span-2 flex items-center justify-center">
              <div class="gauge-container">
                <div class="gauge" :style="{ '--percentage': data.utile_bilancio.totale_perc }">
                  <div class="gauge-value">{{ data.utile_bilancio.totale_perc }}%</div>
                </div>
              </div>
            </div>
            <div class="lg:col-span-4">
              <h2 class="text-xl font-bold text-cyan-600 mb-4">Utile Bilancio</h2>
              <div class="space-y-2">
                <p class="font-semibold">Obiettivo mensile {{ formatCurrency(data.utile_bilancio.obiettivo_mensile) }}</p>
                <p class="font-semibold">Obiettivo giornaliero {{ formatCurrency(data.utile_bilancio.obiettivo_giornaliero) }}</p>
                <p class="font-semibold">Obiettivo giornaliero ad oggi {{ formatCurrency(data.utile_bilancio.obiettivo_giornaliero_ad_oggi) }}</p>
                <p class="font-semibold">Risultato ad oggi {{ formatCurrency(data.utile_bilancio.totale_ad_oggi) }}</p>
                <p class="font-semibold">Risultato avanzamento giornaliero {{ formatCurrency(data.utile_bilancio.obiettivo_avanzamento_giornaliero) }}</p>
                <p class="font-semibold">Risultato presunto mancante {{ formatCurrency(data.utile_bilancio.totale_presunto_mancante) }}</p>
                <p class="font-semibold">Risultato presunto finale {{ formatCurrency(data.utile_bilancio.totale_presunto) }}</p>
                <p class="font-semibold">Presunto tot vs obiettivo giornaliero {{ formatCurrency(data.utile_bilancio.totale_presunto - data.utile_bilancio.obiettivo_giornaliero) }} ({{ formatPerc(data.utile_bilancio.totale_presunto, data.utile_bilancio.obiettivo_giornaliero) }})</p>
                <p class="font-semibold">Risultato ad oggi vs obiettivo ad oggi {{ formatCurrency(data.utile_bilancio.totale_ad_oggi - data.utile_bilancio.obiettivo_giornaliero_ad_oggi) }} ({{ formatPerc(data.utile_bilancio.totale_ad_oggi, data.utile_bilancio.obiettivo_giornaliero_ad_oggi) }})</p>
                <p class="font-semibold">Presunto tot vs obiettivo mensile {{ formatCurrency(data.utile_bilancio.totale_presunto - data.utile_bilancio.obiettivo_mensile) }} ({{ formatPerc(data.utile_bilancio.totale_presunto, data.utile_bilancio.obiettivo_mensile) }})</p>
                <p class="font-semibold">Risultato ad oggi vs obiettivo mensile {{ formatCurrency(data.utile_bilancio.totale_ad_oggi - data.utile_bilancio.obiettivo_mensile) }} ({{ formatPerc(data.utile_bilancio.totale_ad_oggi, data.utile_bilancio.obiettivo_mensile) }})</p>
              </div>
            </div>
          </div>

          <!-- Sezione Utile Cassa -->
          <div class="grid grid-cols-1 lg:grid-cols-6 gap-4 mb-8">
            <div class="lg:col-span-2 flex items-center justify-center">
              <div class="gauge-container">
                <div class="gauge" :style="{ '--percentage': data.utile_cassa.totale_perc }">
                  <div class="gauge-value">{{ data.utile_cassa.totale_perc }}%</div>
                </div>
              </div>
            </div>
            <div class="lg:col-span-4">
              <h2 class="text-xl font-bold text-cyan-600 mb-4">Utile Cassa</h2>
              <div class="space-y-2">
                <p class="font-semibold">Obiettivo mensile {{ formatCurrency(data.utile_cassa.obiettivo_mensile) }}</p>
                <p class="font-semibold">Obiettivo giornaliero {{ formatCurrency(data.utile_cassa.obiettivo_giornaliero) }}</p>
                <p class="font-semibold">Obiettivo giornaliero ad oggi {{ formatCurrency(data.utile_cassa.obiettivo_giornaliero_ad_oggi) }}</p>
                <p class="font-semibold">Risultato ad oggi {{ formatCurrency(data.utile_cassa.totale_ad_oggi) }}</p>
                <p class="font-semibold">Risultato avanzamento giornaliero {{ formatCurrency(data.utile_cassa.obiettivo_avanzamento_giornaliero) }}</p>
                <p class="font-semibold">Risultato presunto mancante {{ formatCurrency(data.utile_cassa.totale_presunto_mancante) }}</p>
                <p class="font-semibold">Risultato presunto finale {{ formatCurrency(data.utile_cassa.totale_presunto) }}</p>
                <p class="font-semibold">Presunto tot vs obiettivo giornaliero {{ formatCurrency(data.utile_cassa.totale_presunto - data.utile_cassa.obiettivo_giornaliero) }} ({{ formatPerc(data.utile_cassa.totale_presunto, data.utile_cassa.obiettivo_giornaliero) }})</p>
                <p class="font-semibold">Risultato ad oggi vs obiettivo ad oggi {{ formatCurrency(data.utile_cassa.totale_ad_oggi - data.utile_cassa.obiettivo_giornaliero_ad_oggi) }} ({{ formatPerc(data.utile_cassa.totale_ad_oggi, data.utile_cassa.obiettivo_giornaliero_ad_oggi) }})</p>
                <p class="font-semibold">Presunto tot vs obiettivo mensile {{ formatCurrency(data.utile_cassa.totale_presunto - data.utile_cassa.obiettivo_mensile) }} ({{ formatPerc(data.utile_cassa.totale_presunto, data.utile_cassa.obiettivo_mensile) }})</p>
                <p class="font-semibold">Risultato ad oggi vs obiettivo mensile {{ formatCurrency(data.utile_cassa.totale_ad_oggi - data.utile_cassa.obiettivo_mensile) }} ({{ formatPerc(data.utile_cassa.totale_ad_oggi, data.utile_cassa.obiettivo_mensile) }})</p>
              </div>
            </div>
          </div>

          <!-- Sezione Debiti -->
          <div class="grid grid-cols-1 lg:grid-cols-6 gap-4 mb-8">
            <div class="lg:col-span-2 flex items-center justify-center">
              <div class="gauge-container">
                <div class="gauge" :style="{ '--percentage': data.debiti.totale_perc }">
                  <div class="gauge-value">{{ data.debiti.totale_perc }}%</div>
                </div>
              </div>
            </div>
            <div class="lg:col-span-4">
              <h2 class="text-xl font-bold text-cyan-600 mb-4">Debiti</h2>
              <div class="space-y-2">
                <p class="font-semibold">Obiettivo mensile {{ formatCurrency(data.debiti.obiettivo_mensile) }}</p>
                <p class="font-semibold">Obiettivo giornaliero {{ formatCurrency(data.debiti.obiettivo_giornaliero) }}</p>
                <p class="font-semibold">Obiettivo giornaliero ad oggi {{ formatCurrency(data.debiti.obiettivo_giornaliero_ad_oggi) }}</p>
                <p class="font-semibold">Risultato ad oggi {{ formatCurrency(data.debiti.totale_ad_oggi) }}</p>
                <p class="font-semibold">Risultato avanzamento giornaliero {{ formatCurrency(data.debiti.obiettivo_avanzamento_giornaliero) }}</p>
                <p class="font-semibold">Risultato presunto mancante {{ formatCurrency(data.debiti.totale_presunto_mancante) }}</p>
                <p class="font-semibold">Risultato presunto finale {{ formatCurrency(data.debiti.totale_presunto) }}</p>
                <p class="font-semibold">Presunto tot vs obiettivo giornaliero {{ formatCurrency(data.debiti.totale_presunto - data.debiti.obiettivo_giornaliero) }} ({{ formatPerc(data.debiti.totale_presunto, data.debiti.obiettivo_giornaliero) }})</p>
                <p class="font-semibold">Risultato ad oggi vs obiettivo ad oggi {{ formatCurrency(data.debiti.totale_ad_oggi - data.debiti.obiettivo_giornaliero_ad_oggi) }} ({{ formatPerc(data.debiti.totale_ad_oggi, data.debiti.obiettivo_giornaliero_ad_oggi) }})</p>
                <p class="font-semibold">Presunto tot vs obiettivo mensile {{ formatCurrency(data.debiti.totale_presunto - data.debiti.obiettivo_mensile) }} ({{ formatPerc(data.debiti.totale_presunto, data.debiti.obiettivo_mensile) }})</p>
                <p class="font-semibold">Risultato ad oggi vs obiettivo mensile {{ formatCurrency(data.debiti.totale_ad_oggi - data.debiti.obiettivo_mensile) }} ({{ formatPerc(data.debiti.totale_ad_oggi, data.debiti.obiettivo_mensile) }})</p>
              </div>
            </div>
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

interface MetricaFinanziaria {
  obiettivo_mensile: number
  obiettivo_giornaliero: number
  obiettivo_giornaliero_ad_oggi: number
  totale_ad_oggi: number
  obiettivo_avanzamento_giornaliero: number
  totale_presunto_mancante: number
  totale_presunto: number
  totale_perc: number
}

const defaultMetrica = (): MetricaFinanziaria => ({
  obiettivo_mensile: 0,
  obiettivo_giornaliero: 0,
  obiettivo_giornaliero_ad_oggi: 0,
  totale_ad_oggi: 0,
  obiettivo_avanzamento_giornaliero: 0,
  totale_presunto_mancante: 0,
  totale_presunto: 0,
  totale_perc: 0
})

const data = reactive({
  utile_bilancio: defaultMetrica(),
  utile_cassa: defaultMetrica(),
  debiti: defaultMetrica()
})

const annoCorrente = new Date().getFullYear()
const meseCorrente = new Date().getMonth() + 1
const anni = Array.from({ length: annoCorrente - 2019 }, (_, i) => 2020 + i)
const mesiNomi = ['Gennaio', 'Febbraio', 'Marzo', 'Aprile', 'Maggio', 'Giugno', 'Luglio', 'Agosto', 'Settembre', 'Ottobre', 'Novembre', 'Dicembre']

const filters = reactive({
  anno: annoCorrente,
  mese: meseCorrente
})

const formatCurrency = (v: any) => new Intl.NumberFormat('it-IT', { style: 'currency', currency: 'EUR' }).format(parseFloat(v) || 0)

const formatPerc = (val: number, base: number) => {
  if (!base || base === 0) return '0,00 %'
  const perc = ((val / base) - 1) * 100
  return perc.toFixed(2).replace('.', ',') + ' %'
}

const loadData = async () => {
  loading.value = true
  try {
    const url = `/monitoraggio/finanziario?anno=${filters.anno}&mese=${filters.mese}`

    const res = await fetchApi<any>(url)
    if (res.success && res.data) {
      data.utile_bilancio = res.data.utile_bilancio || defaultMetrica()
      data.utile_cassa = res.data.utile_cassa || defaultMetrica()
      data.debiti = res.data.debiti || defaultMetrica()
    }
  } catch (e) {
    console.error('Errore caricamento dati finanziari:', e)
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

.gauge-container {
  width: 150px;
  height: 150px;
}

.gauge {
  width: 100%;
  height: 100%;
  border-radius: 50%;
  background: conic-gradient(
    #11a3ca 0deg calc(var(--percentage, 0) * 3.6deg),
    #e5e7eb calc(var(--percentage, 0) * 3.6deg) 360deg
  );
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
}

.gauge::before {
  content: '';
  position: absolute;
  width: 70%;
  height: 70%;
  background: white;
  border-radius: 50%;
}

.gauge-value {
  position: relative;
  z-index: 1;
  font-size: 1.25rem;
  font-weight: bold;
  color: #11a3ca;
}
</style>
