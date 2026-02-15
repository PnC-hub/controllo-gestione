<script setup lang="ts">
definePageMeta({
  middleware: 'auth'
})

const reports = [
  {
    id: 1,
    title: 'Report Febbraio 2026',
    date: '2026-02-28',
    status: 'completed',
    insights: 12,
    download: true
  },
  {
    id: 2,
    title: 'Report Gennaio 2026',
    date: '2026-01-31',
    status: 'completed',
    insights: 15,
    download: true
  },
  {
    id: 3,
    title: 'Report Dicembre 2025',
    date: '2025-12-31',
    status: 'completed',
    insights: 10,
    download: true
  }
]

const generating = ref(false)

const generateReport = () => {
  generating.value = true
  setTimeout(() => {
    generating.value = false
    alert('Report generato con successo!')
  }, 3000)
}

const latestInsights = [
  {
    type: 'success',
    title: 'Fatturato in crescita',
    description: 'Il fatturato è aumentato del 12.5% rispetto al mese precedente, trainato principalmente da implantologia (+18%) e ortodonzia (+10%).'
  },
  {
    type: 'warning',
    title: 'Occupazione poltrone ottimizzabile',
    description: 'L\'occupazione poltrone è al 78%, con margine di miglioramento nelle fasce orarie 14-16.'
  },
  {
    type: 'info',
    title: 'LTV paziente in aumento',
    description: 'Il Lifetime Value medio del paziente è salito a € 2.450, con un incremento del 6.4% grazie a maggiore retention.'
  },
  {
    type: 'danger',
    title: 'Attenzione ai costi variabili',
    description: 'I costi variabili sono aumentati del 4.2% nell\'ultimo mese. Consigliata revisione fornitori materiali.'
  }
]
</script>

<template>
  <div class="space-y-8">
    <!-- Header -->
    <div class="flex items-start justify-between">
      <div>
        <h1 class="text-3xl font-bold text-gray-900 mb-2">Report AI</h1>
        <p class="text-gray-600">Report mensili automatici con analisi intelligenti e suggerimenti</p>
      </div>
      <UiButton variant="primary" @click="generateReport" :loading="generating">
        <Icon name="heroicons:sparkles" class="w-5 h-5" />
        Genera Nuovo Report
      </UiButton>
    </div>

    <!-- Latest Insights -->
    <UiCard>
      <div class="flex items-center gap-2 mb-6">
        <Icon name="heroicons:light-bulb" class="w-6 h-6 text-violet-600" />
        <h3 class="text-lg font-semibold text-gray-900">Insights Ultimo Report</h3>
        <UiBadge variant="info">AI-Generated</UiBadge>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div
          v-for="insight in latestInsights"
          :key="insight.title"
          :class="[
            'p-4 rounded-lg border-l-4',
            insight.type === 'success' ? 'bg-green-50 border-green-500' :
            insight.type === 'warning' ? 'bg-yellow-50 border-yellow-500' :
            insight.type === 'danger' ? 'bg-red-50 border-red-500' :
            'bg-blue-50 border-blue-500'
          ]"
        >
          <div class="flex items-start gap-3">
            <Icon
              :name="
                insight.type === 'success' ? 'heroicons:check-circle' :
                insight.type === 'warning' ? 'heroicons:exclamation-circle' :
                insight.type === 'danger' ? 'heroicons:x-circle' :
                'heroicons:information-circle'
              "
              :class="[
                'w-5 h-5 flex-shrink-0 mt-0.5',
                insight.type === 'success' ? 'text-green-600' :
                insight.type === 'warning' ? 'text-yellow-600' :
                insight.type === 'danger' ? 'text-red-600' :
                'text-blue-600'
              ]"
            />
            <div>
              <h4
                :class="[
                  'font-semibold text-sm mb-1',
                  insight.type === 'success' ? 'text-green-900' :
                  insight.type === 'warning' ? 'text-yellow-900' :
                  insight.type === 'danger' ? 'text-red-900' :
                  'text-blue-900'
                ]"
              >
                {{ insight.title }}
              </h4>
              <p
                :class="[
                  'text-sm',
                  insight.type === 'success' ? 'text-green-700' :
                  insight.type === 'warning' ? 'text-yellow-700' :
                  insight.type === 'danger' ? 'text-red-700' :
                  'text-blue-700'
                ]"
              >
                {{ insight.description }}
              </p>
            </div>
          </div>
        </div>
      </div>
    </UiCard>

    <!-- Reports Table -->
    <UiCard>
      <div class="flex items-center justify-between mb-6">
        <h3 class="text-lg font-semibold text-gray-900">Storico Report</h3>
        <div class="flex gap-2">
          <UiButton variant="ghost" size="sm">
            <Icon name="heroicons:funnel" class="w-4 h-4" />
            Filtra
          </UiButton>
          <UiButton variant="ghost" size="sm">
            <Icon name="heroicons:magnifying-glass" class="w-4 h-4" />
            Cerca
          </UiButton>
        </div>
      </div>

      <div class="overflow-x-auto">
        <table class="w-full">
          <thead>
            <tr class="border-b border-gray-200">
              <th class="text-left py-3 px-4 text-sm font-semibold text-gray-700">Report</th>
              <th class="text-left py-3 px-4 text-sm font-semibold text-gray-700">Data</th>
              <th class="text-left py-3 px-4 text-sm font-semibold text-gray-700">Status</th>
              <th class="text-left py-3 px-4 text-sm font-semibold text-gray-700">Insights</th>
              <th class="text-right py-3 px-4 text-sm font-semibold text-gray-700">Azioni</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-200">
            <tr v-for="report in reports" :key="report.id" class="hover:bg-gray-50 transition-colors">
              <td class="py-4 px-4">
                <div class="flex items-center gap-3">
                  <div class="w-10 h-10 bg-violet-100 rounded-lg flex items-center justify-center">
                    <Icon name="heroicons:document-text" class="w-5 h-5 text-violet-600" />
                  </div>
                  <div>
                    <p class="font-medium text-gray-900">{{ report.title }}</p>
                    <p class="text-sm text-gray-500">Report mensile automatico</p>
                  </div>
                </div>
              </td>
              <td class="py-4 px-4 text-sm text-gray-600">
                {{ new Date(report.date).toLocaleDateString('it-IT', {
                  day: '2-digit',
                  month: 'long',
                  year: 'numeric'
                }) }}
              </td>
              <td class="py-4 px-4">
                <UiBadge variant="success">
                  <Icon name="heroicons:check-circle" class="w-3 h-3" />
                  Completato
                </UiBadge>
              </td>
              <td class="py-4 px-4">
                <div class="flex items-center gap-2">
                  <Icon name="heroicons:light-bulb" class="w-4 h-4 text-violet-600" />
                  <span class="text-sm font-medium text-gray-900">{{ report.insights }} insights</span>
                </div>
              </td>
              <td class="py-4 px-4 text-right">
                <div class="flex items-center justify-end gap-2">
                  <UiButton variant="ghost" size="sm">
                    <Icon name="heroicons:eye" class="w-4 h-4" />
                    Visualizza
                  </UiButton>
                  <UiButton variant="ghost" size="sm">
                    <Icon name="heroicons:arrow-down-tray" class="w-4 h-4" />
                    Download
                  </UiButton>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </UiCard>

    <!-- Info Box -->
    <UiCard>
      <div class="flex items-start gap-4">
        <div class="w-12 h-12 bg-violet-100 rounded-lg flex items-center justify-center flex-shrink-0">
          <Icon name="heroicons:information-circle" class="w-6 h-6 text-violet-600" />
        </div>
        <div>
          <h4 class="font-semibold text-gray-900 mb-2">Come funziona?</h4>
          <p class="text-sm text-gray-600 mb-3">
            I Report AI vengono generati automaticamente ogni mese analizzando tutti i dati del tuo studio.
            L'intelligenza artificiale identifica pattern, trend e anomalie, fornendo insights azionabili
            per migliorare le performance.
          </p>
          <ul class="space-y-2 text-sm text-gray-600">
            <li class="flex items-center gap-2">
              <Icon name="heroicons:check" class="w-4 h-4 text-green-600" />
              Analisi automatica di fatturato, costi e KPI
            </li>
            <li class="flex items-center gap-2">
              <Icon name="heroicons:check" class="w-4 h-4 text-green-600" />
              Identificazione di opportunità e criticità
            </li>
            <li class="flex items-center gap-2">
              <Icon name="heroicons:check" class="w-4 h-4 text-green-600" />
              Suggerimenti personalizzati per il tuo studio
            </li>
            <li class="flex items-center gap-2">
              <Icon name="heroicons:check" class="w-4 h-4 text-green-600" />
              Export in PDF per presentazioni e riunioni
            </li>
          </ul>
        </div>
      </div>
    </UiCard>
  </div>
</template>
