<script setup lang="ts">
definePageMeta({
  middleware: 'auth'
})

const dscrValue = 1.32
const dscrStatus = dscrValue >= 1.5 ? 'safe' : dscrValue >= 1.2 ? 'warning' : 'danger'

const alerts = [
  {
    id: 1,
    type: 'danger',
    title: 'DSCR sotto soglia ottimale',
    description: 'Il Debt Service Coverage Ratio è a 1.32, sotto il target di 1.5. Verificare possibilità di riduzione debito.',
    date: '2026-01-30',
    actions: ['Analizza cash flow', 'Revisiona rate finanziamenti']
  },
  {
    id: 2,
    type: 'warning',
    title: 'Liquidità in calo',
    description: 'La liquidità disponibile è diminuita del 15% nell\'ultimo trimestre.',
    date: '2026-01-28',
    actions: ['Verifica incassi', 'Ottimizza dilazioni di pagamento']
  },
  {
    id: 3,
    type: 'info',
    title: 'Scadenza pagamento IVA',
    description: 'Promemoria: versamento IVA trimestrale entro il 16/02/2026',
    date: '2026-01-25',
    actions: ['Prepara fondi', 'Verifica F24']
  }
]

const cashFlowData = [
  { month: 'Ago', inflows: 48000, outflows: 32000, net: 16000 },
  { month: 'Set', inflows: 52000, outflows: 35000, net: 17000 },
  { month: 'Ott', inflows: 51000, outflows: 36000, net: 15000 },
  { month: 'Nov', inflows: 49000, outflows: 34000, net: 15000 },
  { month: 'Dic', inflows: 53000, outflows: 38000, net: 15000 },
  { month: 'Gen', inflows: 45000, outflows: 33000, net: 12000 }
]

const debtMetrics = [
  { label: 'Debito Totale', value: '€ 185.000', change: '-3.2%', trend: 'down' },
  { label: 'Rata Mensile', value: '€ 3.850', change: '0%', trend: 'stable' },
  { label: 'Scadenza Media', value: '4.2 anni', change: '-0.3 anni', trend: 'down' },
  { label: 'Tasso Medio', value: '3.8%', change: '+0.1%', trend: 'up' }
]

const recommendations = [
  {
    priority: 'high',
    title: 'Aumentare il DSCR a 1.5+',
    actions: [
      'Incrementare fatturato del 10% con focus su servizi ad alto margine',
      'Ridurre rate finanziamenti attraverso rinegoziazione',
      'Estinguere anticipatamente il debito più costoso (tasso 5.2%)'
    ]
  },
  {
    priority: 'medium',
    title: 'Ottimizzare il cash flow',
    actions: [
      'Ridurre dilazioni di pagamento da 60 a 45 giorni',
      'Implementare acconti del 30% per trattamenti >€1000',
      'Attivare reminder automatici pagamenti scaduti'
    ]
  },
  {
    priority: 'low',
    title: 'Pianificazione fiscale',
    actions: [
      'Creare riserva per IVA trimestrale',
      'Valutare deducibilità investimenti pianificati',
      'Consultare commercialista per ottimizzazione tributaria'
    ]
  }
]
</script>

<template>
  <div class="space-y-8">
    <!-- Header -->
    <div>
      <h1 class="text-3xl font-bold text-gray-900 mb-2">Allerta Crisi</h1>
      <p class="text-gray-600">Monitoraggio DSCR e indicatori di stress finanziario</p>
    </div>

    <!-- DSCR Indicator -->
    <UiCard>
      <div class="text-center">
        <div class="inline-flex items-center gap-2 mb-4">
          <Icon name="heroicons:shield-check" class="w-6 h-6 text-gray-600" />
          <h3 class="text-lg font-semibold text-gray-900">Debt Service Coverage Ratio (DSCR)</h3>
        </div>

        <div class="relative inline-flex items-center justify-center w-48 h-48 mb-6">
          <svg class="w-full h-full transform -rotate-90">
            <circle
              cx="96"
              cy="96"
              r="88"
              stroke="#e5e7eb"
              stroke-width="12"
              fill="none"
            />
            <circle
              cx="96"
              cy="96"
              r="88"
              :stroke="dscrStatus === 'safe' ? '#10b981' : dscrStatus === 'warning' ? '#f59e0b' : '#ef4444'"
              stroke-width="12"
              fill="none"
              :stroke-dasharray="`${(dscrValue / 2) * 553} 553`"
              stroke-linecap="round"
            />
          </svg>
          <div class="absolute inset-0 flex flex-col items-center justify-center">
            <span class="text-5xl font-bold text-gray-900">{{ dscrValue }}</span>
            <span class="text-sm text-gray-500 mt-1">Ratio attuale</span>
          </div>
        </div>

        <div class="flex justify-center gap-6 mb-6">
          <div class="text-center">
            <div class="flex items-center gap-2 justify-center mb-1">
              <div class="w-3 h-3 bg-green-500 rounded-full"></div>
              <span class="text-sm font-medium text-gray-600">Sicuro</span>
            </div>
            <span class="text-lg font-semibold text-gray-900">> 1.5</span>
          </div>
          <div class="text-center">
            <div class="flex items-center gap-2 justify-center mb-1">
              <div class="w-3 h-3 bg-yellow-500 rounded-full"></div>
              <span class="text-sm font-medium text-gray-600">Attenzione</span>
            </div>
            <span class="text-lg font-semibold text-gray-900">1.2 - 1.5</span>
          </div>
          <div class="text-center">
            <div class="flex items-center gap-2 justify-center mb-1">
              <div class="w-3 h-3 bg-red-500 rounded-full"></div>
              <span class="text-sm font-medium text-gray-600">Critico</span>
            </div>
            <span class="text-lg font-semibold text-gray-900">< 1.2</span>
          </div>
        </div>

        <div
          :class="[
            'inline-flex items-center gap-2 px-4 py-2 rounded-lg',
            dscrStatus === 'safe' ? 'bg-green-100 text-green-800' :
            dscrStatus === 'warning' ? 'bg-yellow-100 text-yellow-800' :
            'bg-red-100 text-red-800'
          ]"
        >
          <Icon
            :name="dscrStatus === 'safe' ? 'heroicons:check-circle' : 'heroicons:exclamation-triangle'"
            class="w-5 h-5"
          />
          <span class="font-semibold">
            {{ dscrStatus === 'safe' ? 'Situazione sotto controllo' :
               dscrStatus === 'warning' ? 'Attenzione richiesta' :
               'Intervento urgente necessario' }}
          </span>
        </div>
      </div>
    </UiCard>

    <!-- Active Alerts -->
    <UiCard>
      <div class="flex items-center justify-between mb-6">
        <h3 class="text-lg font-semibold text-gray-900">Alert Attivi</h3>
        <UiBadge variant="danger">{{ alerts.length }} alert</UiBadge>
      </div>

      <div class="space-y-4">
        <div
          v-for="alert in alerts"
          :key="alert.id"
          :class="[
            'p-4 rounded-lg border-l-4',
            alert.type === 'danger' ? 'bg-red-50 border-red-500' :
            alert.type === 'warning' ? 'bg-yellow-50 border-yellow-500' :
            'bg-blue-50 border-blue-500'
          ]"
        >
          <div class="flex items-start gap-3">
            <Icon
              :name="
                alert.type === 'danger' ? 'heroicons:exclamation-circle' :
                alert.type === 'warning' ? 'heroicons:exclamation-triangle' :
                'heroicons:information-circle'
              "
              :class="[
                'w-5 h-5 flex-shrink-0 mt-0.5',
                alert.type === 'danger' ? 'text-red-600' :
                alert.type === 'warning' ? 'text-yellow-600' :
                'text-blue-600'
              ]"
            />
            <div class="flex-1">
              <div class="flex items-start justify-between mb-2">
                <h4
                  :class="[
                    'font-semibold',
                    alert.type === 'danger' ? 'text-red-900' :
                    alert.type === 'warning' ? 'text-yellow-900' :
                    'text-blue-900'
                  ]"
                >
                  {{ alert.title }}
                </h4>
                <span class="text-xs text-gray-500">{{ alert.date }}</span>
              </div>
              <p
                :class="[
                  'text-sm mb-3',
                  alert.type === 'danger' ? 'text-red-700' :
                  alert.type === 'warning' ? 'text-yellow-700' :
                  'text-blue-700'
                ]"
              >
                {{ alert.description }}
              </p>
              <div class="flex flex-wrap gap-2">
                <UiButton
                  v-for="action in alert.actions"
                  :key="action"
                  variant="ghost"
                  size="sm"
                  :class="
                    alert.type === 'danger' ? 'text-red-700 hover:bg-red-100' :
                    alert.type === 'warning' ? 'text-yellow-700 hover:bg-yellow-100' :
                    'text-blue-700 hover:bg-blue-100'
                  "
                >
                  {{ action }}
                </UiButton>
              </div>
            </div>
          </div>
        </div>
      </div>
    </UiCard>

    <!-- Cash Flow Analysis -->
    <UiCard>
      <div class="flex items-center justify-between mb-6">
        <h3 class="text-lg font-semibold text-gray-900">Andamento Cash Flow (6 mesi)</h3>
        <div class="flex gap-3 text-sm">
          <div class="flex items-center gap-2">
            <div class="w-3 h-3 bg-green-600 rounded"></div>
            <span class="text-gray-600">Entrate</span>
          </div>
          <div class="flex items-center gap-2">
            <div class="w-3 h-3 bg-red-600 rounded"></div>
            <span class="text-gray-600">Uscite</span>
          </div>
          <div class="flex items-center gap-2">
            <div class="w-3 h-3 bg-violet-600 rounded"></div>
            <span class="text-gray-600">Netto</span>
          </div>
        </div>
      </div>

      <div class="space-y-4">
        <div v-for="item in cashFlowData" :key="item.month" class="space-y-2">
          <div class="flex justify-between text-sm font-medium text-gray-700">
            <span>{{ item.month }}</span>
            <span :class="item.net > 0 ? 'text-green-600' : 'text-red-600'">
              € {{ item.net.toLocaleString() }}
            </span>
          </div>
          <div class="flex gap-2 h-8">
            <div
              class="bg-green-600 rounded-lg flex items-center justify-end px-2 text-white text-xs"
              :style="{ width: `${(item.inflows / 60000) * 100}%` }"
            >
              € {{ (item.inflows / 1000).toFixed(0) }}k
            </div>
            <div
              class="bg-red-600 rounded-lg flex items-center justify-end px-2 text-white text-xs"
              :style="{ width: `${(item.outflows / 60000) * 100}%` }"
            >
              € {{ (item.outflows / 1000).toFixed(0) }}k
            </div>
          </div>
        </div>
      </div>
    </UiCard>

    <!-- Debt Metrics -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <UiCard v-for="metric in debtMetrics" :key="metric.label">
        <p class="text-sm text-gray-600 mb-1">{{ metric.label }}</p>
        <p class="text-2xl font-bold text-gray-900 mb-2">{{ metric.value }}</p>
        <div class="flex items-center gap-1">
          <Icon
            :name="
              metric.trend === 'down' ? 'heroicons:arrow-trending-down' :
              metric.trend === 'up' ? 'heroicons:arrow-trending-up' :
              'heroicons:minus'
            "
            :class="[
              'w-4 h-4',
              metric.trend === 'down' && metric.label !== 'Debito Totale' ? 'text-red-600' :
              metric.trend === 'up' && metric.label === 'Debito Totale' ? 'text-red-600' :
              metric.trend === 'down' ? 'text-green-600' :
              'text-gray-600'
            ]"
          />
          <span class="text-sm text-gray-600">{{ metric.change }}</span>
        </div>
      </UiCard>
    </div>

    <!-- Recommendations -->
    <UiCard>
      <h3 class="text-lg font-semibold text-gray-900 mb-6">Raccomandazioni</h3>
      <div class="space-y-6">
        <div
          v-for="rec in recommendations"
          :key="rec.title"
        >
          <div class="flex items-start gap-3 mb-3">
            <UiBadge
              :variant="
                rec.priority === 'high' ? 'danger' :
                rec.priority === 'medium' ? 'warning' :
                'info'
              "
            >
              {{ rec.priority === 'high' ? 'Priorità Alta' :
                 rec.priority === 'medium' ? 'Priorità Media' :
                 'Priorità Bassa' }}
            </UiBadge>
            <h4 class="font-semibold text-gray-900">{{ rec.title }}</h4>
          </div>
          <ul class="space-y-2 ml-6">
            <li
              v-for="action in rec.actions"
              :key="action"
              class="flex items-start gap-2 text-sm text-gray-700"
            >
              <Icon name="heroicons:arrow-right" class="w-4 h-4 text-violet-600 flex-shrink-0 mt-0.5" />
              {{ action }}
            </li>
          </ul>
        </div>
      </div>
    </UiCard>
  </div>
</template>
