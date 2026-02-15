<template>
  <div>
    <!-- Back Button -->
    <div class="mb-6">
      <NuxtLink to="/contratti" class="text-emerald-600 hover:text-emerald-800 flex items-center gap-2">
        <i class="fas fa-arrow-left"></i>
        <span>Torna ai contratti</span>
      </NuxtLink>
    </div>

    <!-- Header -->
    <div class="mb-6">
      <h1 class="text-2xl font-bold text-slate-800">Scadenzario Contratti</h1>
      <p class="text-slate-600 mt-1">Panoramica delle scadenze contrattuali nei prossimi 12 mesi</p>
    </div>

    <!-- Critical Alerts -->
    <div v-if="alerts.length > 0" class="space-y-4 mb-6">
      <div v-for="alert in alerts" :key="alert.id" :class="getAlertClass(alert.tipo)" class="card">
        <div class="card-content">
          <div class="flex items-start gap-3">
            <i :class="alert.icon" class="text-2xl mt-1"></i>
            <div class="flex-1">
              <h3 class="font-semibold text-lg mb-1">{{ alert.titolo }}</h3>
              <p class="text-sm mb-2">{{ alert.messaggio }}</p>
              <NuxtLink :to="`/contratti/${alert.contractId}`" class="text-sm font-medium underline">
                Visualizza contratto →
              </NuxtLink>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Calendar Timeline -->
    <div class="card mb-6">
      <div class="card-header">
        <h3 class="card-title">Prossimi 12 Mesi</h3>
      </div>
      <div class="card-content">
        <div class="space-y-6">
          <div v-for="month in calendarData" :key="month.label" class="border-b border-slate-100 last:border-0 pb-6 last:pb-0">
            <h4 class="font-semibold text-slate-700 mb-3">{{ month.label }}</h4>
            <div v-if="month.contracts.length > 0" class="space-y-2">
              <div v-for="contract in month.contracts" :key="contract.id" class="flex items-center gap-3 p-3 rounded-lg hover:bg-slate-50 transition-colors">
                <div :class="getTimelineBadgeClass(contract.daysUntil)" class="w-2 h-2 rounded-full"></div>
                <div class="flex-1 min-w-0">
                  <NuxtLink :to="`/contratti/${contract.id}`" class="font-medium text-slate-800 hover:text-emerald-600">
                    {{ contract.oggetto }}
                  </NuxtLink>
                  <p class="text-sm text-slate-600">{{ contract.controparte }} • {{ contract.categoria }}</p>
                </div>
                <div class="text-right">
                  <p class="text-sm font-medium text-slate-800">{{ formatDate(contract.scadenza) }}</p>
                  <p :class="getTimelineTextClass(contract.daysUntil)" class="text-xs">
                    {{ getDaysLabel(contract.daysUntil) }}
                  </p>
                </div>
                <span :class="getCategoryBadgeClass(contract.categoria)" class="px-2 py-1 rounded text-xs font-medium whitespace-nowrap">
                  {{ contract.tipoRinnovo }}
                </span>
              </div>
            </div>
            <div v-else class="text-sm text-slate-400 italic">
              Nessuna scadenza prevista
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Summary Stats -->
    <div class="grid grid-cols-1 md:grid-cols-4 gap-6">
      <div class="card">
        <div class="card-content">
          <div class="flex items-center justify-between mb-2">
            <span class="text-sm text-slate-500">Prossimi 30 giorni</span>
            <i class="fas fa-exclamation-circle text-red-500"></i>
          </div>
          <p class="text-3xl font-bold text-red-600">{{ summary.next30 }}</p>
        </div>
      </div>

      <div class="card">
        <div class="card-content">
          <div class="flex items-center justify-between mb-2">
            <span class="text-sm text-slate-500">30-60 giorni</span>
            <i class="fas fa-exclamation-triangle text-orange-500"></i>
          </div>
          <p class="text-3xl font-bold text-orange-600">{{ summary.next60 }}</p>
        </div>
      </div>

      <div class="card">
        <div class="card-content">
          <div class="flex items-center justify-between mb-2">
            <span class="text-sm text-slate-500">60-90 giorni</span>
            <i class="fas fa-clock text-yellow-500"></i>
          </div>
          <p class="text-3xl font-bold text-yellow-600">{{ summary.next90 }}</p>
        </div>
      </div>

      <div class="card">
        <div class="card-content">
          <div class="flex items-center justify-between mb-2">
            <span class="text-sm text-slate-500">Oltre 90 giorni</span>
            <i class="fas fa-check-circle text-emerald-500"></i>
          </div>
          <p class="text-3xl font-bold text-emerald-600">{{ summary.beyond90 }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  layout: 'default',
  middleware: ['auth']
})

const { data: scadenzarioData } = await useFetch('/api/contratti/scadenzario')
const { data: alertsData } = await useFetch('/api/contratti/alerts')

const calendarData = computed(() => scadenzarioData.value?.calendar || [])
const alerts = computed(() => alertsData.value || [])
const summary = computed(() => scadenzarioData.value?.summary || {
  next30: 0,
  next60: 0,
  next90: 0,
  beyond90: 0
})

const getAlertClass = (tipo: string) => {
  const classes: Record<string, string> = {
    'critico': 'border-red-200 bg-red-50',
    'warning': 'border-orange-200 bg-orange-50',
    'info': 'border-blue-200 bg-blue-50'
  }
  return classes[tipo] || 'border-slate-200 bg-slate-50'
}

const getTimelineBadgeClass = (days: number) => {
  if (days < 15) return 'bg-red-500'
  if (days < 30) return 'bg-orange-500'
  if (days < 90) return 'bg-yellow-500'
  return 'bg-emerald-500'
}

const getTimelineTextClass = (days: number) => {
  if (days < 15) return 'text-red-600 font-semibold'
  if (days < 30) return 'text-orange-600 font-semibold'
  if (days < 90) return 'text-yellow-600'
  return 'text-emerald-600'
}

const getCategoryBadgeClass = (categoria: string) => {
  const classes: Record<string, string> = {
    'Locazione': 'bg-blue-100 text-blue-700',
    'Fornitura': 'bg-emerald-100 text-emerald-700',
    'Servizi': 'bg-purple-100 text-purple-700',
    'Consulenza': 'bg-cyan-100 text-cyan-700',
    'Assicurazione': 'bg-yellow-100 text-yellow-700',
    'Leasing': 'bg-slate-100 text-slate-700'
  }
  return classes[categoria] || 'bg-slate-100 text-slate-700'
}

const getDaysLabel = (days: number) => {
  if (days === 0) return 'Oggi'
  if (days === 1) return 'Domani'
  if (days < 0) return 'Scaduto'
  return `tra ${days} giorni`
}

const formatDate = (dateStr: string) => {
  return new Date(dateStr).toLocaleDateString('it-IT', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  })
}
</script>
