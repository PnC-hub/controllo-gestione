<template>
  <div>
    <!-- Header -->
    <div class="mb-6">
      <div class="flex items-center justify-between flex-wrap gap-4">
        <div class="flex items-center gap-2">
          <h1 class="text-2xl font-bold text-slate-800">Analisi Flusso Pazienti</h1>
          <PageInfoButton
            title="Analisi Flusso Pazienti"
            description="Visualizzazione completa del percorso paziente: dalla lead generation alla produzione, con analisi dei punti deboli e raccomandazioni di miglioramento"
            :features="[
              'Funnel a 7 stadi con tassi di conversione',
              'Identificazione automatica bottleneck',
              'Raccomandazioni prioritizzate per crescita',
              'Trend e variazioni periodo su periodo',
              'KPI globali: lead, conversione, fatturato'
            ]"
          />
        </div>
        <!-- Selettore Periodo -->
        <div class="flex items-center gap-2 bg-white rounded-lg shadow-sm p-1">
          <button
            v-for="p in periodi"
            :key="p.value"
            @click="setPeriodo(p.value)"
            class="px-4 py-2 text-sm rounded-md transition-all"
            :class="periodo === p.value
              ? 'bg-purple-600 text-white shadow-sm'
              : 'text-slate-600 hover:bg-slate-100'"
          >
            {{ p.label }}
          </button>
        </div>
      </div>
      <p class="text-slate-500 mt-1">Percorso paziente Smiledoc - {{ oggi }}</p>
    </div>

    <!-- Error Banner -->
    <div v-if="error" class="mb-4 bg-amber-50 border border-amber-200 rounded-lg p-4 flex items-center gap-3">
      <i class="fas fa-exclamation-triangle text-amber-500"></i>
      <p class="text-sm text-amber-700">{{ error }}</p>
    </div>

    <!-- KPI Banner -->
    <div class="mb-6">
      <div class="bg-gradient-to-r from-purple-600 to-indigo-600 rounded-xl p-6 text-white shadow-lg">
        <div class="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div>
            <p class="text-purple-200 text-xs font-medium uppercase">Lead Totali</p>
            <p class="text-3xl font-bold mt-1">{{ loading ? '-' : data.kpis.totalLeads.toLocaleString('it-IT') }}</p>
          </div>
          <div>
            <p class="text-purple-200 text-xs font-medium uppercase">Conversione Globale</p>
            <p class="text-3xl font-bold mt-1">{{ loading ? '-' : data.kpis.conversioneGlobale + '%' }}</p>
            <p class="text-purple-200 text-xs mt-1">Lead → Produzione</p>
          </div>
          <div>
            <p class="text-purple-200 text-xs font-medium uppercase">Fatturato Periodo</p>
            <p class="text-3xl font-bold mt-1">{{ loading ? '-' : formatCurrency(data.kpis.fatturatoMese) }}</p>
          </div>
          <div>
            <p class="text-purple-200 text-xs font-medium uppercase">No-Show Rate</p>
            <p class="text-3xl font-bold mt-1" :class="data.kpis.noShowRate > 15 ? 'text-red-300' : ''">
              {{ loading ? '-' : data.kpis.noShowRate + '%' }}
            </p>
            <p class="text-purple-200 text-xs mt-1">Target: &lt;10%</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Main Content: Funnel + Bottleneck -->
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
      <!-- Funnel Verticale (2/3) -->
      <div class="lg:col-span-2">
        <div class="bg-white rounded-xl shadow-sm p-6">
          <h3 class="text-lg font-semibold text-slate-800 flex items-center mb-6">
            <i class="fas fa-filter text-purple-600 mr-2"></i>
            Funnel Paziente
          </h3>

          <!-- Loading skeleton -->
          <div v-if="loading" class="space-y-4">
            <div v-for="i in 7" :key="i" class="animate-pulse">
              <div class="h-24 bg-slate-200 rounded-xl"></div>
              <div v-if="i < 7" class="flex justify-center py-2">
                <div class="w-8 h-8 bg-slate-200 rounded-full"></div>
              </div>
            </div>
          </div>

          <!-- Funnel reale -->
          <div v-else class="space-y-0">
            <template v-for="(stage, idx) in data.stages" :key="stage.id">
              <FunnelStage
                :label="stage.label"
                :icon="stage.icon"
                :color="stage.color"
                :count="stage.count"
                :value="stage.value"
                :conversion-rate="stage.conversionRate"
                :trend="stage.trend"
                :details="stage.details"
              />
              <FunnelArrow
                v-if="idx < data.stages.length - 1"
                :percentage="data.arrows[idx]?.percentage ?? 0"
                :label="data.arrows[idx]?.label ?? ''"
              />
            </template>
          </div>
        </div>
      </div>

      <!-- Bottleneck Sidebar (1/3) -->
      <div class="space-y-6">
        <!-- Punti Deboli -->
        <div class="bg-white rounded-xl shadow-sm p-6">
          <h3 class="text-lg font-semibold text-slate-800 flex items-center mb-4">
            <i class="fas fa-exclamation-triangle text-red-500 mr-2"></i>
            Punti Deboli
          </h3>
          <div v-if="loading" class="space-y-3">
            <div v-for="i in 3" :key="i" class="animate-pulse h-28 bg-slate-200 rounded-xl"></div>
          </div>
          <div v-else class="space-y-3">
            <FunnelBottleneckCard
              v-for="b in data.bottlenecks"
              :key="b.id"
              :title="b.title"
              :description="b.description"
              :severity="b.severity"
              :metric="b.metric"
              :action="b.action"
              @action="navigateAction(b.actionRoute)"
            />
          </div>
        </div>

        <!-- Raccomandazioni -->
        <div class="bg-white rounded-xl shadow-sm p-6">
          <h3 class="text-lg font-semibold text-slate-800 flex items-center mb-4">
            <i class="fas fa-lightbulb text-amber-500 mr-2"></i>
            Raccomandazioni
          </h3>
          <div v-if="loading" class="space-y-3">
            <div v-for="i in 3" :key="i" class="animate-pulse h-20 bg-slate-200 rounded-xl"></div>
          </div>
          <div v-else class="space-y-3">
            <div v-for="rec in data.recommendations" :key="rec.id"
              class="p-4 rounded-xl border transition-all hover:shadow-sm"
              :class="priorityBorderClass(rec.priority)">
              <div class="flex items-start gap-3">
                <div class="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
                  :class="priorityIconBgClass(rec.priority)">
                  <i :class="'fas fa-' + rec.icon" class="text-white text-xs"></i>
                </div>
                <div>
                  <div class="flex items-center gap-2">
                    <h4 class="font-semibold text-slate-800 text-sm">{{ rec.title }}</h4>
                    <span class="text-[10px] px-1.5 py-0.5 rounded-full font-bold uppercase"
                      :class="priorityBadgeClass(rec.priority)">
                      {{ rec.priority }}
                    </span>
                  </div>
                  <p class="text-xs text-slate-500 mt-1">{{ rec.description }}</p>
                  <p class="text-xs font-medium mt-2" :class="priorityTextClass(rec.priority)">
                    <i class="fas fa-chart-line mr-1"></i>{{ rec.expectedImpact }}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useFunnelAnalysis } from '~/composables/useFunnelAnalysis'

definePageMeta({ layout: 'default' })

const router = useRouter()

const periodi = [
  { value: 'mese' as const, label: 'Mese' },
  { value: 'trimestre' as const, label: 'Trimestre' },
  { value: 'anno' as const, label: 'Anno' },
]

const oggi = new Date().toLocaleDateString('it-IT', {
  weekday: 'long',
  year: 'numeric',
  month: 'long',
  day: 'numeric',
})

const { loading, error, data, periodo, loadData, setPeriodo, formatCurrency } = useFunnelAnalysis()

const navigateAction = (route?: string) => {
  if (route) {
    router.push(route)
  }
}

// Priority styling helpers
const priorityBorderClass = (p: string) => ({
  'border-red-200 bg-red-50/30': p === 'alta',
  'border-yellow-200 bg-yellow-50/30': p === 'media',
  'border-blue-200 bg-blue-50/30': p === 'bassa',
})

const priorityIconBgClass = (p: string) => ({
  'bg-red-500': p === 'alta',
  'bg-yellow-500': p === 'media',
  'bg-blue-500': p === 'bassa',
})

const priorityBadgeClass = (p: string) => ({
  'bg-red-100 text-red-700': p === 'alta',
  'bg-yellow-100 text-yellow-700': p === 'media',
  'bg-blue-100 text-blue-700': p === 'bassa',
})

const priorityTextClass = (p: string) => ({
  'text-red-600': p === 'alta',
  'text-yellow-600': p === 'media',
  'text-blue-600': p === 'bassa',
})

onMounted(() => {
  loadData()
})
</script>
