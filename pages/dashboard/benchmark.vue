<script setup lang="ts">
definePageMeta({
  middleware: 'auth'
})

const yourStudio = {
  fatturato: 543360,
  pazienti: 342,
  poltrone: 4,
  occupazione: 78,
  ebitda: 28,
  costoPoltrona: 8420,
  fatturatoPerPaziente: 132
}

const benchmarks = {
  settore: {
    fatturato: 485000,
    pazienti: 310,
    occupazione: 72,
    ebitda: 25,
    costoPoltrona: 9200,
    fatturatoPerPaziente: 125
  },
  topPerformer: {
    fatturato: 680000,
    pazienti: 420,
    occupazione: 88,
    ebitda: 35,
    costoPoltrona: 7800,
    fatturatoPerPaziente: 145
  }
}

const comparisons = [
  {
    metric: 'Fatturato Annuo',
    your: '€ 543.360',
    sector: '€ 485.000',
    top: '€ 680.000',
    yourRank: 68,
    icon: 'heroicons:currency-euro'
  },
  {
    metric: 'Pazienti Attivi',
    your: '342',
    sector: '310',
    top: '420',
    yourRank: 72,
    icon: 'heroicons:users'
  },
  {
    metric: 'Occupazione Poltrone',
    your: '78%',
    sector: '72%',
    top: '88%',
    yourRank: 65,
    icon: 'heroicons:chart-bar'
  },
  {
    metric: 'Margine EBITDA',
    your: '28%',
    sector: '25%',
    top: '35%',
    yourRank: 70,
    icon: 'heroicons:trending-up'
  },
  {
    metric: 'Costo per Poltrona',
    your: '€ 8.420',
    sector: '€ 9.200',
    top: '€ 7.800',
    yourRank: 55,
    icon: 'heroicons:banknotes'
  },
  {
    metric: 'Fatturato/Paziente',
    your: '€ 132',
    sector: '€ 125',
    top: '€ 145',
    yourRank: 60,
    icon: 'heroicons:user-circle'
  }
]

const regionalData = [
  { region: 'Lazio', fatturato: 512000, studi: 847, rank: 3 },
  { region: 'Lombardia', fatturato: 578000, studi: 1243, rank: 1 },
  { region: 'Campania', fatturato: 423000, studi: 652, rank: 5 },
  { region: 'Veneto', fatturato: 534000, studi: 891, rank: 2 },
  { region: 'Emilia-Romagna', fatturato: 498000, studi: 723, rank: 4 }
]

const bestPractices = [
  {
    title: 'Ottimizzazione orari',
    description: 'I top performer hanno orari estesi con aperture serali 2-3 volte a settimana',
    impact: '+15% occupazione',
    difficulty: 'Media'
  },
  {
    title: 'Protocolli implantologia',
    description: 'Implementazione protocolli standardizzati per ridurre tempi e costi',
    impact: '+8% margine',
    difficulty: 'Alta'
  },
  {
    title: 'Marketing digitale',
    description: 'Budget marketing 3-5% del fatturato con focus su Google e Instagram',
    impact: '+12% nuovi pazienti',
    difficulty: 'Bassa'
  },
  {
    title: 'Software gestionale integrato',
    description: 'CRM + fatturazione + magazzino in un\'unica piattaforma',
    impact: '-20% tempo amministrativo',
    difficulty: 'Media'
  }
]

const overallScore = 67
</script>

<template>
  <div class="space-y-8">
    <!-- Header -->
    <div>
      <h1 class="text-3xl font-bold text-gray-900 mb-2">Benchmark Settore</h1>
      <p class="text-gray-600">Confronta le tue performance con altri studi dentistici in Italia</p>
    </div>

    <!-- Overall Score -->
    <UiCard>
      <div class="text-center">
        <div class="inline-flex items-center gap-2 mb-4">
          <Icon name="heroicons:trophy" class="w-6 h-6 text-violet-600" />
          <h3 class="text-lg font-semibold text-gray-900">Performance Score Complessivo</h3>
        </div>

        <div class="relative inline-flex items-center justify-center w-56 h-56 mb-6">
          <svg class="w-full h-full transform -rotate-90">
            <circle
              cx="112"
              cy="112"
              r="100"
              stroke="#e5e7eb"
              stroke-width="16"
              fill="none"
            />
            <circle
              cx="112"
              cy="112"
              r="100"
              :stroke="overallScore >= 80 ? '#10b981' : overallScore >= 60 ? '#8b5cf6' : '#f59e0b'"
              stroke-width="16"
              fill="none"
              :stroke-dasharray="`${(overallScore / 100) * 628} 628`"
              stroke-linecap="round"
            />
          </svg>
          <div class="absolute inset-0 flex flex-col items-center justify-center">
            <span class="text-6xl font-bold text-gray-900">{{ overallScore }}</span>
            <span class="text-sm text-gray-500 mt-1">su 100</span>
          </div>
        </div>

        <p class="text-lg text-gray-700 mb-2">
          <span class="font-semibold">Buone performance!</span>
        </p>
        <p class="text-gray-600 max-w-2xl mx-auto">
          Il tuo studio si posiziona nel <strong class="text-violet-600">top 33%</strong> degli studi dentistici italiani.
          Ci sono ancora margini di miglioramento per raggiungere l'eccellenza.
        </p>
      </div>
    </UiCard>

    <!-- Metrics Comparison -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <UiCard v-for="comp in comparisons" :key="comp.metric">
        <div class="flex items-start justify-between mb-4">
          <div>
            <p class="text-sm text-gray-600 mb-1">{{ comp.metric }}</p>
            <p class="text-2xl font-bold text-gray-900">{{ comp.your }}</p>
          </div>
          <div class="w-10 h-10 bg-violet-100 rounded-lg flex items-center justify-center">
            <Icon :name="comp.icon" class="w-5 h-5 text-violet-600" />
          </div>
        </div>

        <div class="space-y-3">
          <div>
            <div class="flex justify-between text-xs text-gray-600 mb-1">
              <span>Il tuo studio</span>
              <span class="font-semibold text-violet-600">{{ comp.yourRank }}%</span>
            </div>
            <div class="h-2 bg-gray-200 rounded-full overflow-hidden">
              <div
                class="h-full bg-violet-600 rounded-full"
                :style="{ width: `${comp.yourRank}%` }"
              />
            </div>
          </div>

          <div class="pt-3 border-t border-gray-200 space-y-2 text-sm">
            <div class="flex justify-between">
              <span class="text-gray-600">Media Settore</span>
              <span class="font-medium text-gray-900">{{ comp.sector }}</span>
            </div>
            <div class="flex justify-between">
              <span class="text-gray-600">Top Performer</span>
              <span class="font-medium text-gray-900">{{ comp.top }}</span>
            </div>
          </div>
        </div>
      </UiCard>
    </div>

    <!-- Regional Comparison -->
    <UiCard>
      <div class="flex items-center justify-between mb-6">
        <h3 class="text-lg font-semibold text-gray-900">Benchmark Regionale</h3>
        <UiBadge variant="info">Italia</UiBadge>
      </div>

      <div class="overflow-x-auto">
        <table class="w-full">
          <thead>
            <tr class="border-b border-gray-200">
              <th class="text-left py-3 px-4 text-sm font-semibold text-gray-700">Posizione</th>
              <th class="text-left py-3 px-4 text-sm font-semibold text-gray-700">Regione</th>
              <th class="text-left py-3 px-4 text-sm font-semibold text-gray-700">Fatturato Medio</th>
              <th class="text-left py-3 px-4 text-sm font-semibold text-gray-700">Studi Censiti</th>
              <th class="text-right py-3 px-4 text-sm font-semibold text-gray-700">Trend</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-200">
            <tr
              v-for="(region, index) in regionalData"
              :key="region.region"
              :class="region.region === 'Lazio' ? 'bg-violet-50' : 'hover:bg-gray-50'"
            >
              <td class="py-4 px-4">
                <div class="flex items-center gap-2">
                  <span
                    :class="[
                      'flex items-center justify-center w-6 h-6 rounded-full text-xs font-bold',
                      region.rank === 1 ? 'bg-yellow-400 text-yellow-900' :
                      region.rank === 2 ? 'bg-gray-300 text-gray-700' :
                      region.rank === 3 ? 'bg-orange-400 text-orange-900' :
                      'bg-gray-200 text-gray-600'
                    ]"
                  >
                    {{ region.rank }}
                  </span>
                </div>
              </td>
              <td class="py-4 px-4">
                <div class="flex items-center gap-2">
                  <span class="font-medium text-gray-900">{{ region.region }}</span>
                  <UiBadge v-if="region.region === 'Lazio'" variant="info">La tua regione</UiBadge>
                </div>
              </td>
              <td class="py-4 px-4 font-semibold text-gray-900">
                € {{ region.fatturato.toLocaleString() }}
              </td>
              <td class="py-4 px-4 text-gray-600">
                {{ region.studi.toLocaleString() }} studi
              </td>
              <td class="py-4 px-4 text-right">
                <div class="flex items-center justify-end gap-1">
                  <Icon name="heroicons:arrow-trending-up" class="w-4 h-4 text-green-600" />
                  <span class="text-sm font-medium text-green-600">+5.2%</span>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </UiCard>

    <!-- Best Practices -->
    <UiCard>
      <div class="flex items-center gap-2 mb-6">
        <Icon name="heroicons:light-bulb" class="w-6 h-6 text-violet-600" />
        <h3 class="text-lg font-semibold text-gray-900">Best Practice dai Top Performer</h3>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div
          v-for="practice in bestPractices"
          :key="practice.title"
          class="p-4 border border-gray-200 rounded-lg hover:border-violet-300 transition-colors"
        >
          <div class="flex items-start justify-between mb-3">
            <h4 class="font-semibold text-gray-900">{{ practice.title }}</h4>
            <UiBadge
              :variant="
                practice.difficulty === 'Bassa' ? 'success' :
                practice.difficulty === 'Media' ? 'warning' :
                'danger'
              "
            >
              {{ practice.difficulty }}
            </UiBadge>
          </div>
          <p class="text-sm text-gray-600 mb-3">{{ practice.description }}</p>
          <div class="flex items-center gap-2 text-sm">
            <Icon name="heroicons:arrow-trending-up" class="w-4 h-4 text-green-600" />
            <span class="font-medium text-green-600">{{ practice.impact }}</span>
          </div>
        </div>
      </div>
    </UiCard>

    <!-- Action Plan -->
    <UiCard>
      <div class="flex items-center justify-between mb-6">
        <h3 class="text-lg font-semibold text-gray-900">Piano d'Azione Consigliato</h3>
        <UiButton variant="primary" size="sm">
          <Icon name="heroicons:arrow-down-tray" class="w-4 h-4" />
          Esporta Piano
        </UiButton>
      </div>

      <div class="space-y-4">
        <div class="flex items-start gap-3 p-4 bg-violet-50 rounded-lg">
          <div class="w-8 h-8 bg-violet-600 text-white rounded-full flex items-center justify-center font-bold text-sm flex-shrink-0">
            1
          </div>
          <div class="flex-1">
            <h4 class="font-semibold text-gray-900 mb-1">Focus su occupazione poltrone</h4>
            <p class="text-sm text-gray-600 mb-2">
              Ottimizza gli orari di apertura e riduci i buchi in agenda. Target: passare da 78% a 85%
            </p>
            <div class="flex gap-2">
              <UiBadge variant="info">+€42.000/anno previsti</UiBadge>
              <UiBadge variant="success">ROI 6 mesi</UiBadge>
            </div>
          </div>
        </div>

        <div class="flex items-start gap-3 p-4 bg-violet-50 rounded-lg">
          <div class="w-8 h-8 bg-violet-600 text-white rounded-full flex items-center justify-center font-bold text-sm flex-shrink-0">
            2
          </div>
          <div class="flex-1">
            <h4 class="font-semibold text-gray-900 mb-1">Implementa marketing digitale strutturato</h4>
            <p class="text-sm text-gray-600 mb-2">
              Budget 3% del fatturato (€1.350/mese) su Google Ads e Social Media
            </p>
            <div class="flex gap-2">
              <UiBadge variant="info">+40 nuovi pazienti/anno</UiBadge>
              <UiBadge variant="success">ROI 4 mesi</UiBadge>
            </div>
          </div>
        </div>

        <div class="flex items-start gap-3 p-4 bg-violet-50 rounded-lg">
          <div class="w-8 h-8 bg-violet-600 text-white rounded-full flex items-center justify-center font-bold text-sm flex-shrink-0">
            3
          </div>
          <div class="flex-1">
            <h4 class="font-semibold text-gray-900 mb-1">Riduci costi per poltrona</h4>
            <p class="text-sm text-gray-600 mb-2">
              Rinegozia contratti fornitori e ottimizza scorte di magazzino
            </p>
            <div class="flex gap-2">
              <UiBadge variant="info">-€3.120/anno risparmiati</UiBadge>
              <UiBadge variant="success">ROI Immediato</UiBadge>
            </div>
          </div>
        </div>
      </div>
    </UiCard>
  </div>
</template>
