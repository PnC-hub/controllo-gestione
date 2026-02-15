<script setup lang="ts">
definePageMeta({
  middleware: 'auth'
})

const exportFormats = [
  {
    format: 'PDF',
    icon: 'heroicons:document-text',
    description: 'Report professionale pronto per presentazioni e stampa',
    color: 'red'
  },
  {
    format: 'Excel',
    icon: 'heroicons:table-cells',
    description: 'Dati completi in formato Excel per analisi approfondite',
    color: 'green'
  },
  {
    format: 'CSV',
    icon: 'heroicons:document',
    description: 'Export dati grezzi compatibile con qualsiasi software',
    color: 'blue'
  }
]

const exportTypes = [
  { id: 'dashboard', label: 'Dashboard KPI', available: true },
  { id: 'report', label: 'Report AI Mensile', available: true },
  { id: 'piano', label: 'Piano Industriale', available: true },
  { id: 'crisi', label: 'Analisi DSCR', available: true },
  { id: 'benchmark', label: 'Benchmark Settore', available: true },
  { id: 'cashflow', label: 'Cash Flow Dettagliato', available: true },
  { id: 'pazienti', label: 'Database Pazienti', available: false },
  { id: 'fatturato', label: 'Dettaglio Fatturato', available: true }
]

const recentExports = [
  {
    id: 1,
    name: 'Report Gennaio 2026',
    type: 'PDF',
    date: '2026-01-30',
    size: '2.4 MB',
    downloads: 3
  },
  {
    id: 2,
    name: 'Dashboard KPI Q4 2025',
    type: 'Excel',
    date: '2026-01-28',
    size: '1.8 MB',
    downloads: 1
  },
  {
    id: 3,
    name: 'Piano Industriale 2026',
    type: 'PDF',
    date: '2026-01-25',
    size: '3.1 MB',
    downloads: 5
  },
  {
    id: 4,
    name: 'Analisi DSCR',
    type: 'Excel',
    date: '2026-01-20',
    size: '892 KB',
    downloads: 2
  }
]

const selectedFormat = ref('PDF')
const selectedTypes = ref(['dashboard'])
const dateRange = ref('current-month')
const exporting = ref(false)

const handleExport = () => {
  exporting.value = true
  setTimeout(() => {
    exporting.value = false
    alert(`Export completato! Download in corso...`)
  }, 2000)
}
</script>

<template>
  <div class="space-y-8">
    <!-- Header -->
    <div>
      <h1 class="text-3xl font-bold text-gray-900 mb-2">Export Centro</h1>
      <p class="text-gray-600">Esporta report e dati in formato PDF, Excel o CSV</p>
    </div>

    <!-- Export Configuration -->
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <!-- Format Selection -->
      <UiCard>
        <h3 class="text-lg font-semibold text-gray-900 mb-4">Formato Export</h3>
        <div class="space-y-3">
          <label
            v-for="format in exportFormats"
            :key="format.format"
            class="flex items-start gap-3 p-3 border-2 rounded-lg cursor-pointer transition-all"
            :class="selectedFormat === format.format ? 'border-violet-600 bg-violet-50' : 'border-gray-200 hover:border-gray-300'"
          >
            <input
              type="radio"
              name="format"
              :value="format.format"
              v-model="selectedFormat"
              class="mt-1"
            />
            <div class="flex-1">
              <div class="flex items-center gap-2 mb-1">
                <Icon :name="format.icon" class="w-5 h-5 text-gray-600" />
                <span class="font-semibold text-gray-900">{{ format.format }}</span>
              </div>
              <p class="text-sm text-gray-600">{{ format.description }}</p>
            </div>
          </label>
        </div>
      </UiCard>

      <!-- Type Selection -->
      <UiCard class="lg:col-span-2">
        <h3 class="text-lg font-semibold text-gray-900 mb-4">Contenuto da Esportare</h3>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
          <label
            v-for="type in exportTypes"
            :key="type.id"
            :class="[
              'flex items-center gap-3 p-3 border rounded-lg cursor-pointer transition-all',
              !type.available ? 'opacity-50 cursor-not-allowed' : '',
              selectedTypes.includes(type.id) ? 'border-violet-600 bg-violet-50' : 'border-gray-200 hover:border-gray-300'
            ]"
          >
            <input
              type="checkbox"
              :value="type.id"
              v-model="selectedTypes"
              :disabled="!type.available"
              class="rounded border-gray-300 text-violet-600 focus:ring-violet-500"
            />
            <span class="font-medium text-gray-900">{{ type.label }}</span>
            <UiBadge v-if="!type.available" variant="warning" class="ml-auto">Pro</UiBadge>
          </label>
        </div>
      </UiCard>
    </div>

    <!-- Options -->
    <UiCard>
      <h3 class="text-lg font-semibold text-gray-900 mb-4">Opzioni Export</h3>
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">
            Periodo
          </label>
          <select
            v-model="dateRange"
            class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-violet-500 focus:border-violet-500"
          >
            <option value="current-month">Mese Corrente</option>
            <option value="last-month">Mese Scorso</option>
            <option value="last-3-months">Ultimi 3 Mesi</option>
            <option value="last-6-months">Ultimi 6 Mesi</option>
            <option value="current-year">Anno Corrente</option>
            <option value="last-year">Anno Scorso</option>
            <option value="custom">Personalizzato</option>
          </select>
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">
            Lingua
          </label>
          <select class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-violet-500 focus:border-violet-500">
            <option value="it">Italiano</option>
            <option value="en">English</option>
          </select>
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">
            Layout
          </label>
          <select class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-violet-500 focus:border-violet-500">
            <option value="standard">Standard</option>
            <option value="detailed">Dettagliato</option>
            <option value="summary">Sommario</option>
          </select>
        </div>
      </div>

      <div class="mt-6 flex items-start gap-3">
        <input type="checkbox" id="logo" class="mt-1 rounded border-gray-300 text-violet-600 focus:ring-violet-500" />
        <label for="logo" class="text-sm text-gray-700">
          Includi logo e intestazione studio nel PDF
        </label>
      </div>

      <div class="mt-3 flex items-start gap-3">
        <input type="checkbox" id="watermark" class="mt-1 rounded border-gray-300 text-violet-600 focus:ring-violet-500" />
        <label for="watermark" class="text-sm text-gray-700">
          Aggiungi watermark "Geniusmile BI"
        </label>
      </div>
    </UiCard>

    <!-- Export Button -->
    <div class="flex justify-between items-center">
      <div class="text-sm text-gray-600">
        <Icon name="heroicons:information-circle" class="w-5 h-5 inline mr-1" />
        Selezionati <strong>{{ selectedTypes.length }}</strong> elementi in formato <strong>{{ selectedFormat }}</strong>
      </div>
      <UiButton variant="primary" size="lg" @click="handleExport" :loading="exporting">
        <Icon name="heroicons:arrow-down-tray" class="w-5 h-5" />
        Esporta {{ selectedFormat }}
      </UiButton>
    </div>

    <!-- Recent Exports -->
    <UiCard>
      <div class="flex items-center justify-between mb-6">
        <h3 class="text-lg font-semibold text-gray-900">Export Recenti</h3>
        <UiButton variant="ghost" size="sm">
          <Icon name="heroicons:trash" class="w-4 h-4" />
          Elimina Tutti
        </UiButton>
      </div>

      <div class="overflow-x-auto">
        <table class="w-full">
          <thead>
            <tr class="border-b border-gray-200">
              <th class="text-left py-3 px-4 text-sm font-semibold text-gray-700">File</th>
              <th class="text-left py-3 px-4 text-sm font-semibold text-gray-700">Tipo</th>
              <th class="text-left py-3 px-4 text-sm font-semibold text-gray-700">Data</th>
              <th class="text-left py-3 px-4 text-sm font-semibold text-gray-700">Dimensione</th>
              <th class="text-left py-3 px-4 text-sm font-semibold text-gray-700">Download</th>
              <th class="text-right py-3 px-4 text-sm font-semibold text-gray-700">Azioni</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-200">
            <tr v-for="exp in recentExports" :key="exp.id" class="hover:bg-gray-50">
              <td class="py-4 px-4">
                <div class="flex items-center gap-3">
                  <div
                    :class="[
                      'w-10 h-10 rounded-lg flex items-center justify-center',
                      exp.type === 'PDF' ? 'bg-red-100' :
                      exp.type === 'Excel' ? 'bg-green-100' :
                      'bg-blue-100'
                    ]"
                  >
                    <Icon
                      :name="exp.type === 'PDF' ? 'heroicons:document-text' : 'heroicons:table-cells'"
                      :class="[
                        'w-5 h-5',
                        exp.type === 'PDF' ? 'text-red-600' :
                        exp.type === 'Excel' ? 'text-green-600' :
                        'text-blue-600'
                      ]"
                    />
                  </div>
                  <div>
                    <p class="font-medium text-gray-900">{{ exp.name }}</p>
                    <p class="text-xs text-gray-500">{{ exp.type }} export</p>
                  </div>
                </div>
              </td>
              <td class="py-4 px-4">
                <UiBadge
                  :variant="
                    exp.type === 'PDF' ? 'danger' :
                    exp.type === 'Excel' ? 'success' :
                    'info'
                  "
                >
                  {{ exp.type }}
                </UiBadge>
              </td>
              <td class="py-4 px-4 text-sm text-gray-600">
                {{ new Date(exp.date).toLocaleDateString('it-IT') }}
              </td>
              <td class="py-4 px-4 text-sm text-gray-600">
                {{ exp.size }}
              </td>
              <td class="py-4 px-4 text-sm text-gray-600">
                {{ exp.downloads }} volte
              </td>
              <td class="py-4 px-4 text-right">
                <div class="flex items-center justify-end gap-2">
                  <UiButton variant="ghost" size="sm">
                    <Icon name="heroicons:arrow-down-tray" class="w-4 h-4" />
                    Scarica
                  </UiButton>
                  <UiButton variant="ghost" size="sm">
                    <Icon name="heroicons:trash" class="w-4 h-4" />
                  </UiButton>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </UiCard>

    <!-- Info -->
    <UiCard>
      <div class="flex items-start gap-4">
        <div class="w-12 h-12 bg-violet-100 rounded-lg flex items-center justify-center flex-shrink-0">
          <Icon name="heroicons:information-circle" class="w-6 h-6 text-violet-600" />
        </div>
        <div>
          <h4 class="font-semibold text-gray-900 mb-2">Suggerimenti per Export Professionali</h4>
          <ul class="space-y-2 text-sm text-gray-600">
            <li class="flex items-start gap-2">
              <Icon name="heroicons:check" class="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" />
              <span>Usa il formato <strong>PDF</strong> per presentazioni a banche e investitori</span>
            </li>
            <li class="flex items-start gap-2">
              <Icon name="heroicons:check" class="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" />
              <span>Usa il formato <strong>Excel</strong> per analisi approfondite e pivot tables</span>
            </li>
            <li class="flex items-start gap-2">
              <Icon name="heroicons:check" class="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" />
              <span>Usa il formato <strong>CSV</strong> per importare i dati in altri software</span>
            </li>
            <li class="flex items-start gap-2">
              <Icon name="heroicons:check" class="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" />
              <span>Gli export rimangono disponibili per 30 giorni prima di essere automaticamente eliminati</span>
            </li>
          </ul>
        </div>
      </div>
    </UiCard>
  </div>
</template>
