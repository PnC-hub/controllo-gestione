<template>
  <div v-if="contract">
    <!-- Back Button -->
    <div class="mb-6">
      <NuxtLink to="/contratti" class="text-emerald-600 hover:text-emerald-800 flex items-center gap-2">
        <i class="fas fa-arrow-left"></i>
        <span>Torna ai contratti</span>
      </NuxtLink>
    </div>

    <!-- Header -->
    <div class="card mb-6">
      <div class="card-content">
        <div class="flex items-start justify-between">
          <div class="flex-1">
            <div class="flex items-center gap-3 mb-2">
              <h1 class="text-2xl font-bold text-slate-800">{{ contract.oggetto }}</h1>
              <span :class="getCategoryBadgeClass(contract.categoria)" class="px-3 py-1 rounded-full text-sm font-medium">
                {{ contract.categoria }}
              </span>
            </div>
            <p class="text-lg text-slate-600">{{ contract.controparte }}</p>
          </div>
          <div class="flex gap-2">
            <button class="px-4 py-2 bg-slate-100 text-slate-700 rounded-lg hover:bg-slate-200 transition-colors">
              <i class="fas fa-edit mr-2"></i>Modifica
            </button>
            <button class="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors">
              <i class="fas fa-sync mr-2"></i>Rinnova
            </button>
          </div>
        </div>

        <!-- Related Party Alert -->
        <div v-if="contract.parteCorrelata" class="mt-4 p-4 bg-orange-50 border border-orange-200 rounded-lg">
          <div class="flex items-start gap-3">
            <i class="fas fa-exclamation-triangle text-orange-600 mt-1"></i>
            <div class="flex-1">
              <h4 class="font-semibold text-orange-800 mb-1">Contratto con Parte Correlata</h4>
              <p class="text-sm text-orange-700">
                Questo contratto è stipulato con una parte correlata. Verificare la conformità alle procedure interne e agli obblighi di disclosure.
                <NuxtLink to="/parti-correlate" class="underline font-medium ml-1">Visualizza registro parti correlate →</NuxtLink>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Contract Details -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
      <!-- General Info -->
      <div class="card">
        <div class="card-header">
          <h3 class="card-title">Informazioni Generali</h3>
        </div>
        <div class="card-content">
          <dl class="space-y-4">
            <div>
              <dt class="text-sm font-medium text-slate-500">Oggetto</dt>
              <dd class="mt-1 text-slate-800">{{ contract.oggetto }}</dd>
            </div>
            <div>
              <dt class="text-sm font-medium text-slate-500">Controparte</dt>
              <dd class="mt-1 text-slate-800">{{ contract.controparte }}</dd>
            </div>
            <div>
              <dt class="text-sm font-medium text-slate-500">Categoria</dt>
              <dd class="mt-1">
                <span :class="getCategoryBadgeClass(contract.categoria)" class="px-2.5 py-1 rounded-full text-xs font-medium">
                  {{ contract.categoria }}
                </span>
              </dd>
            </div>
            <div>
              <dt class="text-sm font-medium text-slate-500">Valore Annuo</dt>
              <dd class="mt-1 text-lg font-semibold text-slate-800">{{ formatCurrency(contract.valoreAnnuo) }}</dd>
            </div>
          </dl>
        </div>
      </div>

      <!-- Timeline -->
      <div class="card">
        <div class="card-header">
          <h3 class="card-title">Timeline Contrattuale</h3>
        </div>
        <div class="card-content">
          <dl class="space-y-4">
            <div>
              <dt class="text-sm font-medium text-slate-500">Decorrenza</dt>
              <dd class="mt-1 text-slate-800">{{ formatDate(contract.decorrenza) }}</dd>
            </div>
            <div>
              <dt class="text-sm font-medium text-slate-500">Durata</dt>
              <dd class="mt-1 text-slate-800">{{ contract.durata }}</dd>
            </div>
            <div>
              <dt class="text-sm font-medium text-slate-500">Scadenza</dt>
              <dd class="mt-1 text-slate-800">
                <span v-if="contract.scadenza">{{ formatDate(contract.scadenza) }}</span>
                <span v-else class="text-slate-400">Indeterminato</span>
              </dd>
            </div>
            <div>
              <dt class="text-sm font-medium text-slate-500">Tipo di Rinnovo</dt>
              <dd class="mt-1 text-slate-800">{{ contract.tipoRinnovo }}</dd>
            </div>
            <div v-if="contract.disdettaEntro">
              <dt class="text-sm font-medium text-slate-500">Disdetta entro</dt>
              <dd class="mt-1 text-red-600 font-semibold">{{ formatDate(contract.disdettaEntro) }}</dd>
            </div>
          </dl>
        </div>
      </div>
    </div>

    <!-- Key Clauses -->
    <div class="card mb-6">
      <div class="card-header">
        <h3 class="card-title">Clausole Chiave</h3>
      </div>
      <div class="card-content">
        <ul class="space-y-2">
          <li v-for="(clause, index) in contract.clausoleChiave" :key="index" class="flex items-start gap-2">
            <i class="fas fa-check-circle text-emerald-500 mt-1"></i>
            <span class="text-slate-700">{{ clause }}</span>
          </li>
        </ul>
      </div>
    </div>

    <!-- Documents -->
    <div class="card mb-6">
      <div class="card-header">
        <div class="flex items-center justify-between">
          <h3 class="card-title">Documenti</h3>
          <button class="px-3 py-1.5 bg-emerald-600 text-white text-sm rounded-lg hover:bg-emerald-700">
            <i class="fas fa-upload mr-2"></i>Carica PDF
          </button>
        </div>
      </div>
      <div class="card-content">
        <div class="border-2 border-dashed border-slate-300 rounded-lg p-8 text-center">
          <i class="fas fa-file-pdf text-4xl text-slate-300 mb-3"></i>
          <p class="text-slate-500">Nessun documento caricato</p>
          <button class="mt-3 px-4 py-2 bg-slate-100 text-slate-700 text-sm rounded-lg hover:bg-slate-200">
            Carica contratto PDF
          </button>
        </div>
      </div>
    </div>

    <!-- Renewal History -->
    <div class="card mb-6">
      <div class="card-header">
        <h3 class="card-title">Storico Rinnovi</h3>
      </div>
      <div class="card-content">
        <div class="space-y-4">
          <div v-for="(renewal, index) in contract.storicoRinnovi" :key="index" class="flex items-start gap-4">
            <div class="w-2 h-2 bg-emerald-500 rounded-full mt-2"></div>
            <div class="flex-1">
              <p class="font-medium text-slate-800">{{ renewal.tipo }}</p>
              <p class="text-sm text-slate-600">{{ formatDate(renewal.data) }}</p>
              <p v-if="renewal.note" class="text-sm text-slate-500 mt-1">{{ renewal.note }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Actions -->
    <div class="card">
      <div class="card-content">
        <div class="flex gap-3">
          <button class="px-4 py-2 bg-slate-100 text-slate-700 rounded-lg hover:bg-slate-200">
            <i class="fas fa-edit mr-2"></i>Modifica
          </button>
          <button class="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700">
            <i class="fas fa-sync mr-2"></i>Rinnova
          </button>
          <button class="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700">
            <i class="fas fa-ban mr-2"></i>Termina
          </button>
          <button class="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 ml-auto">
            <i class="fas fa-trash mr-2"></i>Elimina
          </button>
        </div>
      </div>
    </div>
  </div>

  <div v-else class="card">
    <div class="card-content text-center py-12">
      <i class="fas fa-file-contract text-6xl text-slate-300 mb-4"></i>
      <p class="text-slate-500">Contratto non trovato</p>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  layout: 'default',
  middleware: ['auth']
})

const route = useRoute()
const contractId = computed(() => route.params.id as string)

const { data: contract } = await useFetch(`/api/contratti/${contractId.value}`)

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

const formatCurrency = (value: number) => {
  return new Intl.NumberFormat('it-IT', {
    style: 'currency',
    currency: 'EUR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(value)
}

const formatDate = (dateStr: string) => {
  return new Date(dateStr).toLocaleDateString('it-IT', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  })
}
</script>
