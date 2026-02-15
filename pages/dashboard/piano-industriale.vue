<script setup lang="ts">
definePageMeta({
  middleware: 'auth'
})

const scenarios = [
  {
    name: 'Scenario Base',
    type: 'base',
    yearlyRevenue: '€ 543.360',
    ebitda: '€ 154.200',
    growth: '8%'
  },
  {
    name: 'Scenario Ottimistico',
    type: 'optimistic',
    yearlyRevenue: '€ 651.200',
    ebitda: '€ 195.400',
    growth: '20%'
  },
  {
    name: 'Scenario Pessimistico',
    type: 'pessimistic',
    yearlyRevenue: '€ 489.024',
    ebitda: '€ 122.250',
    growth: '-10%'
  }
]

const projections = [
  { month: 'Gen', base: 45000, optimistic: 54000, pessimistic: 40500 },
  { month: 'Feb', base: 46000, optimistic: 55200, pessimistic: 41400 },
  { month: 'Mar', base: 47000, optimistic: 56400, pessimistic: 42300 },
  { month: 'Apr', base: 48000, optimistic: 57600, pessimistic: 43200 },
  { month: 'Mag', base: 49000, optimistic: 58800, pessimistic: 44100 },
  { month: 'Giu', base: 50000, optimistic: 60000, pessimistic: 45000 }
]

const investments = [
  { item: 'Nuova poltrona', amount: '€ 35.000', roi: '24 mesi', status: 'planned' },
  { item: 'Scanner intraorale', amount: '€ 22.000', roi: '18 mesi', status: 'planned' },
  { item: 'Marketing digitale', amount: '€ 2.500/mese', roi: '6 mesi', status: 'active' },
  { item: 'Software gestionale', amount: '€ 450/mese', roi: 'Immediato', status: 'active' }
]

const selectedScenario = ref('base')
</script>

<template>
  <div class="space-y-8">
    <!-- Header -->
    <div class="flex items-start justify-between">
      <div>
        <h1 class="text-3xl font-bold text-gray-900 mb-2">Piano Industriale</h1>
        <p class="text-gray-600">Proiezioni finanziarie e pianificazione strategica</p>
      </div>
      <UiButton variant="primary">
        <Icon name="heroicons:arrow-down-tray" class="w-5 h-5" />
        Esporta Piano
      </UiButton>
    </div>

    <!-- Scenarios -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
      <UiCard
        v-for="scenario in scenarios"
        :key="scenario.name"
        :class="[
          'cursor-pointer transition-all',
          selectedScenario === scenario.type ? 'ring-2 ring-violet-600' : ''
        ]"
        @click="selectedScenario = scenario.type"
      >
        <div class="flex items-start justify-between mb-4">
          <div>
            <h3 class="font-semibold text-gray-900 mb-1">{{ scenario.name }}</h3>
            <UiBadge
              :variant="
                scenario.type === 'base' ? 'info' :
                scenario.type === 'optimistic' ? 'success' :
                'warning'
              "
            >
              {{ scenario.type === 'base' ? 'Realistico' :
                 scenario.type === 'optimistic' ? 'Migliore' :
                 'Peggiore' }}
            </UiBadge>
          </div>
          <div
            :class="[
              'w-10 h-10 rounded-lg flex items-center justify-center',
              scenario.type === 'base' ? 'bg-blue-100' :
              scenario.type === 'optimistic' ? 'bg-green-100' :
              'bg-yellow-100'
            ]"
          >
            <Icon
              :name="
                scenario.type === 'base' ? 'heroicons:chart-bar' :
                scenario.type === 'optimistic' ? 'heroicons:arrow-trending-up' :
                'heroicons:arrow-trending-down'
              "
              :class="[
                'w-5 h-5',
                scenario.type === 'base' ? 'text-blue-600' :
                scenario.type === 'optimistic' ? 'text-green-600' :
                'text-yellow-600'
              ]"
            />
          </div>
        </div>

        <div class="space-y-3">
          <div>
            <p class="text-sm text-gray-600 mb-1">Fatturato Annuo</p>
            <p class="text-2xl font-bold text-gray-900">{{ scenario.yearlyRevenue }}</p>
          </div>
          <div>
            <p class="text-sm text-gray-600 mb-1">EBITDA Previsto</p>
            <p class="text-xl font-semibold text-gray-900">{{ scenario.ebitda }}</p>
          </div>
          <div>
            <p class="text-sm text-gray-600 mb-1">Crescita YoY</p>
            <div class="flex items-center gap-2">
              <span
                :class="[
                  'text-lg font-semibold',
                  scenario.type === 'optimistic' ? 'text-green-600' :
                  scenario.type === 'pessimistic' ? 'text-red-600' :
                  'text-gray-900'
                ]"
              >
                {{ scenario.growth }}
              </span>
            </div>
          </div>
        </div>
      </UiCard>
    </div>

    <!-- Projections Chart -->
    <UiCard>
      <div class="flex items-center justify-between mb-6">
        <h3 class="text-lg font-semibold text-gray-900">Proiezioni Prossimi 6 Mesi</h3>
        <div class="flex gap-4 text-sm">
          <div class="flex items-center gap-2">
            <div class="w-3 h-3 bg-blue-600 rounded"></div>
            <span class="text-gray-600">Base</span>
          </div>
          <div class="flex items-center gap-2">
            <div class="w-3 h-3 bg-green-600 rounded"></div>
            <span class="text-gray-600">Ottimistico</span>
          </div>
          <div class="flex items-center gap-2">
            <div class="w-3 h-3 bg-yellow-600 rounded"></div>
            <span class="text-gray-600">Pessimistico</span>
          </div>
        </div>
      </div>

      <div class="space-y-4">
        <div v-for="projection in projections" :key="projection.month" class="space-y-2">
          <div class="flex justify-between text-sm font-medium text-gray-700">
            <span>{{ projection.month }}</span>
            <span>€ {{ projection[selectedScenario].toLocaleString() }}</span>
          </div>
          <div class="relative h-8 bg-gray-100 rounded-lg overflow-hidden">
            <div
              class="absolute inset-y-0 left-0 bg-blue-200 opacity-50"
              :style="{ width: `${(projection.base / 60000) * 100}%` }"
            />
            <div
              class="absolute inset-y-0 left-0 bg-green-200 opacity-50"
              :style="{ width: `${(projection.optimistic / 60000) * 100}%` }"
            />
            <div
              class="absolute inset-y-0 left-0 bg-yellow-200 opacity-50"
              :style="{ width: `${(projection.pessimistic / 60000) * 100}%` }"
            />
            <div
              :class="[
                'absolute inset-y-0 left-0 rounded-lg',
                selectedScenario === 'base' ? 'bg-blue-600' :
                selectedScenario === 'optimistic' ? 'bg-green-600' :
                'bg-yellow-600'
              ]"
              :style="{ width: `${(projection[selectedScenario] / 60000) * 100}%` }"
            />
          </div>
        </div>
      </div>
    </UiCard>

    <!-- Investments -->
    <UiCard>
      <div class="flex items-center justify-between mb-6">
        <h3 class="text-lg font-semibold text-gray-900">Investimenti Pianificati</h3>
        <UiButton variant="ghost" size="sm">
          <Icon name="heroicons:plus" class="w-4 h-4" />
          Aggiungi Investimento
        </UiButton>
      </div>

      <div class="overflow-x-auto">
        <table class="w-full">
          <thead>
            <tr class="border-b border-gray-200">
              <th class="text-left py-3 px-4 text-sm font-semibold text-gray-700">Investimento</th>
              <th class="text-left py-3 px-4 text-sm font-semibold text-gray-700">Importo</th>
              <th class="text-left py-3 px-4 text-sm font-semibold text-gray-700">ROI Previsto</th>
              <th class="text-left py-3 px-4 text-sm font-semibold text-gray-700">Status</th>
              <th class="text-right py-3 px-4 text-sm font-semibold text-gray-700">Azioni</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-200">
            <tr v-for="investment in investments" :key="investment.item" class="hover:bg-gray-50">
              <td class="py-4 px-4 font-medium text-gray-900">{{ investment.item }}</td>
              <td class="py-4 px-4 text-gray-600">{{ investment.amount }}</td>
              <td class="py-4 px-4 text-gray-600">{{ investment.roi }}</td>
              <td class="py-4 px-4">
                <UiBadge :variant="investment.status === 'active' ? 'success' : 'warning'">
                  {{ investment.status === 'active' ? 'Attivo' : 'Pianificato' }}
                </UiBadge>
              </td>
              <td class="py-4 px-4 text-right">
                <UiButton variant="ghost" size="sm">
                  <Icon name="heroicons:pencil" class="w-4 h-4" />
                  Modifica
                </UiButton>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </UiCard>

    <!-- Key Assumptions -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <UiCard>
        <h3 class="text-lg font-semibold text-gray-900 mb-4">Assunzioni Chiave</h3>
        <div class="space-y-3">
          <div class="flex justify-between items-start p-3 bg-gray-50 rounded-lg">
            <div>
              <p class="font-medium text-gray-900">Crescita pazienti attivi</p>
              <p class="text-sm text-gray-600">Incremento mensile medio</p>
            </div>
            <span class="text-lg font-semibold text-violet-600">+2.5%</span>
          </div>
          <div class="flex justify-between items-start p-3 bg-gray-50 rounded-lg">
            <div>
              <p class="font-medium text-gray-900">Occupazione poltrone target</p>
              <p class="text-sm text-gray-600">Utilizzo ottimale</p>
            </div>
            <span class="text-lg font-semibold text-violet-600">85%</span>
          </div>
          <div class="flex justify-between items-start p-3 bg-gray-50 rounded-lg">
            <div>
              <p class="font-medium text-gray-900">Margine EBITDA target</p>
              <p class="text-sm text-gray-600">Redditività obiettivo</p>
            </div>
            <span class="text-lg font-semibold text-violet-600">28%</span>
          </div>
        </div>
      </UiCard>

      <UiCard>
        <h3 class="text-lg font-semibold text-gray-900 mb-4">Azioni Strategiche</h3>
        <div class="space-y-3">
          <div class="flex items-start gap-3 p-3 bg-violet-50 rounded-lg">
            <Icon name="heroicons:check-circle" class="w-5 h-5 text-violet-600 flex-shrink-0 mt-0.5" />
            <div>
              <p class="font-medium text-gray-900">Ottimizzazione pricing</p>
              <p class="text-sm text-gray-600">Revisione listini per servizi premium</p>
            </div>
          </div>
          <div class="flex items-start gap-3 p-3 bg-violet-50 rounded-lg">
            <Icon name="heroicons:check-circle" class="w-5 h-5 text-violet-600 flex-shrink-0 mt-0.5" />
            <div>
              <p class="font-medium text-gray-900">Espansione orari</p>
              <p class="text-sm text-gray-600">Apertura serale 2 giorni/settimana</p>
            </div>
          </div>
          <div class="flex items-start gap-3 p-3 bg-violet-50 rounded-lg">
            <Icon name="heroicons:check-circle" class="w-5 h-5 text-violet-600 flex-shrink-0 mt-0.5" />
            <div>
              <p class="font-medium text-gray-900">Marketing mirato</p>
              <p class="text-sm text-gray-600">Focus su implantologia e ortodonzia invisibile</p>
            </div>
          </div>
        </div>
      </UiCard>
    </div>
  </div>
</template>
