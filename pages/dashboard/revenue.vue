<template>
  <div>
    <!-- Header -->
    <div class="mb-6">
      <div class="flex items-center gap-2">
        <h1 class="text-2xl font-bold text-slate-800">Dashboard Revenue</h1>
        <PageInfoButton
          title="Dashboard Revenue"
          description="Metriche orientate al revenue: potenziale da recuperare, opportunità nascoste, azioni concrete per aumentare il fatturato"
          :features="[
            'Potenziale da recuperare (preventivi in attesa)',
            'Clienti da richiamare per nuove vendite',
            'Fatture scadute da sollecitare',
            'Trend mensile ricavi e conversioni',
            'Quick actions per incrementare revenue'
          ]"
        />
      </div>
      <p class="text-slate-500">Le metriche che generano guadagno - {{ oggi }}</p>
    </div>

    <!-- Alert Revenue Potenziale -->
    <div v-if="!loading && data" class="mb-6">
      <div class="bg-gradient-to-r from-emerald-500 to-green-600 rounded-xl p-6 text-white shadow-lg">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-emerald-100 text-sm font-medium">POTENZIALE DA RECUPERARE</p>
            <p class="text-4xl font-bold mt-1">{{ formatCurrency(data.potenziale_totale) }}</p>
            <p class="text-emerald-100 mt-2">
              {{ data.preventivi_pendenti }} preventivi in attesa +
              {{ data.fatture_scadute }} fatture scadute da sollecitare
            </p>
          </div>
          <div class="text-right">
            <div class="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center">
              <i class="fas fa-coins text-4xl"></i>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Cards Principali Revenue -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      <!-- Preventivi Pendenti -->
      <div class="bg-white rounded-xl shadow-sm p-6 border-l-4 border-orange-500">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm text-slate-500">Preventivi da Convertire</p>
            <p class="text-3xl font-bold text-orange-600">{{ loading ? '-' : data?.preventivi_pendenti || 0 }}</p>
            <p class="text-xs text-slate-400 mt-1">{{ formatCurrency(data?.preventivi_valore || 0) }}</p>
          </div>
          <div class="w-14 h-14 bg-gradient-to-br from-orange-400 to-orange-600 rounded-xl flex items-center justify-center">
            <i class="fas fa-file-invoice text-white text-2xl"></i>
          </div>
        </div>
        <NuxtLink to="/budget?stato=preventivo" class="mt-4 flex items-center text-sm text-orange-600 hover:text-orange-700">
          <span>Rivedi e converti</span>
          <i class="fas fa-arrow-right ml-2"></i>
        </NuxtLink>
      </div>

      <!-- Clienti Inattivi -->
      <div class="bg-white rounded-xl shadow-sm p-6 border-l-4 border-red-500">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm text-slate-500">Clienti Inattivi</p>
            <p class="text-3xl font-bold text-red-600">{{ loading ? '-' : data?.clienti_inattivi || 0 }}</p>
            <p class="text-xs text-slate-400 mt-1">Nessun ordine da +6 mesi</p>
          </div>
          <div class="w-14 h-14 bg-gradient-to-br from-red-400 to-red-600 rounded-xl flex items-center justify-center">
            <i class="fas fa-user-clock text-white text-2xl"></i>
          </div>
        </div>
        <NuxtLink to="/contratti?stato=inattivo" class="mt-4 flex items-center text-sm text-red-600 hover:text-red-700">
          <span>Riattiva relazioni</span>
          <i class="fas fa-phone ml-2"></i>
        </NuxtLink>
      </div>

      <!-- Fatture Scadute -->
      <div class="bg-white rounded-xl shadow-sm p-6 border-l-4 border-yellow-500">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm text-slate-500">Fatture Scadute</p>
            <p class="text-3xl font-bold text-yellow-600">{{ loading ? '-' : data?.fatture_scadute || 0 }}</p>
            <p class="text-xs text-slate-400 mt-1">{{ formatCurrency(data?.fatture_scadute_valore || 0) }} da incassare</p>
          </div>
          <div class="w-14 h-14 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-xl flex items-center justify-center">
            <i class="fas fa-exclamation-circle text-white text-2xl"></i>
          </div>
        </div>
        <NuxtLink to="/fatture?scadute=true" class="mt-4 flex items-center text-sm text-yellow-600 hover:text-yellow-700">
          <span>Sollecita pagamenti</span>
          <i class="fas fa-bell ml-2"></i>
        </NuxtLink>
      </div>

      <!-- Opportunità Upsell -->
      <div class="bg-white rounded-xl shadow-sm p-6 border-l-4 border-blue-500">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm text-slate-500">Opportunità Upsell</p>
            <p class="text-3xl font-bold text-blue-600">{{ loading ? '-' : data?.opportunita_upsell || 0 }}</p>
            <p class="text-xs text-slate-400 mt-1">Clienti attivi con margine</p>
          </div>
          <div class="w-14 h-14 bg-gradient-to-br from-blue-400 to-blue-600 rounded-xl flex items-center justify-center">
            <i class="fas fa-chart-line text-white text-2xl"></i>
          </div>
        </div>
        <NuxtLink to="/contratti?tipo=upsell" class="mt-4 flex items-center text-sm text-blue-600 hover:text-blue-700">
          <span>Proponi upgrade</span>
          <i class="fas fa-rocket ml-2"></i>
        </NuxtLink>
      </div>
    </div>

    <!-- Revenue Metrics -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
      <!-- Trend Mensile Ricavi -->
      <div class="card">
        <div class="card-header">
          <h3 class="card-title">
            <i class="fas fa-chart-area text-emerald-600 mr-2"></i>
            Trend Ricavi Ultimi 6 Mesi
          </h3>
        </div>
        <div class="card-content">
          <div class="space-y-3">
            <div v-for="month in trendRicavi" :key="month.mese" class="flex items-center justify-between">
              <div class="text-sm text-slate-600 w-24">{{ month.mese }}</div>
              <div class="flex-1 mx-4">
                <div class="h-3 bg-slate-200 rounded-full overflow-hidden">
                  <div
                    class="h-full rounded-full transition-all duration-500"
                    :class="month.variazione >= 0 ? 'bg-emerald-500' : 'bg-red-500'"
                    :style="{ width: (month.valore / maxRicavo * 100) + '%' }"
                  ></div>
                </div>
              </div>
              <div class="flex items-center gap-2">
                <div class="text-sm font-medium w-28 text-right">{{ formatCurrency(month.valore) }}</div>
                <div
                  class="text-xs px-2 py-1 rounded"
                  :class="month.variazione >= 0 ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'"
                >
                  {{ month.variazione > 0 ? '+' : '' }}{{ month.variazione }}%
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Conversion Rate -->
      <div class="card">
        <div class="card-header">
          <h3 class="card-title">
            <i class="fas fa-percentage text-blue-600 mr-2"></i>
            Tasso di Conversione
          </h3>
        </div>
        <div class="card-content">
          <div class="text-center mb-6">
            <div class="text-5xl font-bold text-blue-600">{{ data?.conversion_rate || 0 }}%</div>
            <p class="text-slate-500 text-sm mt-2">Preventivi → Ordini</p>
          </div>
          <div class="grid grid-cols-2 gap-4">
            <div class="text-center p-4 bg-blue-50 rounded-lg">
              <div class="text-2xl font-bold text-blue-700">{{ data?.preventivi_emessi || 0 }}</div>
              <div class="text-xs text-slate-600 mt-1">Preventivi Emessi</div>
            </div>
            <div class="text-center p-4 bg-emerald-50 rounded-lg">
              <div class="text-2xl font-bold text-emerald-700">{{ data?.preventivi_convertiti || 0 }}</div>
              <div class="text-xs text-slate-600 mt-1">Convertiti</div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Quick Actions -->
    <div class="card">
      <div class="card-header">
        <h3 class="card-title">
          <i class="fas fa-bolt text-amber-600 mr-2"></i>
          Azioni Rapide per Aumentare Revenue
        </h3>
      </div>
      <div class="card-content">
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button
            @click="$router.push('/budget?stato=preventivo')"
            class="p-4 bg-gradient-to-br from-orange-50 to-orange-100 hover:from-orange-100 hover:to-orange-200 rounded-xl transition text-left"
          >
            <i class="fas fa-phone-volume text-orange-600 text-2xl mb-2"></i>
            <div class="font-semibold text-slate-800">Chiama Preventivi Pendenti</div>
            <div class="text-sm text-slate-600 mt-1">{{ data?.preventivi_pendenti || 0 }} da convertire</div>
          </button>

          <button
            @click="$router.push('/fatture?scadute=true')"
            class="p-4 bg-gradient-to-br from-yellow-50 to-yellow-100 hover:from-yellow-100 hover:to-yellow-200 rounded-xl transition text-left"
          >
            <i class="fas fa-bell text-yellow-600 text-2xl mb-2"></i>
            <div class="font-semibold text-slate-800">Sollecita Scaduti</div>
            <div class="text-sm text-slate-600 mt-1">{{ formatCurrency(data?.fatture_scadute_valore || 0) }} bloccati</div>
          </button>

          <button
            @click="$router.push('/contratti?tipo=upsell')"
            class="p-4 bg-gradient-to-br from-blue-50 to-blue-100 hover:from-blue-100 hover:to-blue-200 rounded-xl transition text-left"
          >
            <i class="fas fa-rocket text-blue-600 text-2xl mb-2"></i>
            <div class="font-semibold text-slate-800">Proponi Upsell</div>
            <div class="text-sm text-slate-600 mt-1">{{ data?.opportunita_upsell || 0 }} clienti pronti</div>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({ layout: 'default' })

const loading = ref(false)

const oggi = new Date().toLocaleDateString('it-IT', {
  weekday: 'long',
  year: 'numeric',
  month: 'long',
  day: 'numeric'
})

const data = ref<any>({
  potenziale_totale: 0,
  preventivi_pendenti: 0,
  preventivi_valore: 0,
  clienti_inattivi: 0,
  fatture_scadute: 0,
  fatture_scadute_valore: 0,
  opportunita_upsell: 0,
  conversion_rate: 0,
  preventivi_emessi: 0,
  preventivi_convertiti: 0
})

const trendRicavi = ref([
  { mese: 'Gen', valore: 45000, variazione: 5 },
  { mese: 'Feb', valore: 52000, variazione: 15 },
  { mese: 'Mar', valore: 48000, variazione: -8 },
  { mese: 'Apr', valore: 61000, variazione: 27 },
  { mese: 'Mag', valore: 58000, variazione: -5 },
  { mese: 'Giu', valore: 67000, variazione: 16 }
])

const maxRicavo = computed(() => Math.max(...trendRicavi.value.map(m => m.valore), 1))

const formatCurrency = (v: any) =>
  new Intl.NumberFormat('it-IT', { style: 'currency', currency: 'EUR' }).format(parseFloat(v) || 0)

const loadData = async () => {
  loading.value = true
  try {
    // Chiamata API interna Nuxt (non API esterna)
    const res = await $fetch<any>('/api/dashboard/revenue')
    if (res.success && res.data) {
      data.value = res.data
      if (res.data.trend_ricavi) {
        trendRicavi.value = res.data.trend_ricavi
      }
    }
  } catch (e) {
    console.error('Errore caricamento dashboard revenue:', e)
    // Mock data per demo
    data.value = {
      potenziale_totale: 145000,
      preventivi_pendenti: 12,
      preventivi_valore: 85000,
      clienti_inattivi: 23,
      fatture_scadute: 8,
      fatture_scadute_valore: 60000,
      opportunita_upsell: 15,
      conversion_rate: 42,
      preventivi_emessi: 28,
      preventivi_convertiti: 12
    }
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  loadData()
})
</script>

<style scoped>
.card { @apply bg-white rounded-lg shadow; }
.card-header { @apply px-6 py-4 border-b border-slate-200; }
.card-title { @apply text-lg font-semibold text-slate-800 flex items-center; }
.card-content { @apply p-6; }
</style>
