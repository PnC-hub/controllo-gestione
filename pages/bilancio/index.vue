<template>
  <div>
    <div class="card mb-6">
      <div class="card-header">
        <h2 class="card-title">
          <i class="fas fa-balance-scale mr-2 text-cyan-600"></i>
          Bilancio Integrato
        </h2>
        <p class="text-sm text-gray-500 mt-1">
          Conto Economico · Stato Patrimoniale · Cash Flow · KPI — Smiledoc 2023–2025
        </p>
      </div>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
      <NuxtLink to="/bilancio/conto-economico" class="card hover:shadow-lg transition-shadow group">
        <div class="card-content p-6 flex flex-col items-center text-center">
          <div class="w-16 h-16 bg-cyan-100 rounded-full flex items-center justify-center mb-4 group-hover:bg-cyan-200 transition-colors">
            <i class="fas fa-file-invoice-dollar text-3xl text-cyan-600"></i>
          </div>
          <h3 class="font-semibold text-gray-800 text-lg">Conto Economico</h3>
          <p class="text-sm text-gray-500 mt-2">
            Ricavi, costi, EBITDA e risultato netto riclassificati secondo il template WSNO-006
          </p>
          <span class="mt-4 inline-flex items-center gap-1 text-xs bg-cyan-50 text-cyan-700 px-3 py-1 rounded-full">
            <i class="fas fa-calendar-alt"></i> 2023 · 2024 · 2025
          </span>
        </div>
      </NuxtLink>

      <NuxtLink to="/bilancio/stato-patrimoniale" class="card hover:shadow-lg transition-shadow group">
        <div class="card-content p-6 flex flex-col items-center text-center">
          <div class="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center mb-4 group-hover:bg-indigo-200 transition-colors">
            <i class="fas fa-university text-3xl text-indigo-600"></i>
          </div>
          <h3 class="font-semibold text-gray-800 text-lg">Stato Patrimoniale</h3>
          <p class="text-sm text-gray-500 mt-2">
            Attivo, passivo e patrimonio netto con check di quadratura automatico
          </p>
          <span class="mt-4 inline-flex items-center gap-1 text-xs bg-indigo-50 text-indigo-700 px-3 py-1 rounded-full">
            <i class="fas fa-check-circle"></i> Check = Attivo − Passivo
          </span>
        </div>
      </NuxtLink>

      <NuxtLink to="/bilancio/cash-flow" class="card hover:shadow-lg transition-shadow group">
        <div class="card-content p-6 flex flex-col items-center text-center">
          <div class="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4 group-hover:bg-green-200 transition-colors">
            <i class="fas fa-water text-3xl text-green-600"></i>
          </div>
          <h3 class="font-semibold text-gray-800 text-lg">Cash Flow</h3>
          <p class="text-sm text-gray-500 mt-2">
            Flussi di cassa mensili con entrate, uscite e saldo banca per ogni mese
          </p>
          <span class="mt-4 inline-flex items-center gap-1 text-xs bg-green-50 text-green-700 px-3 py-1 rounded-full">
            <i class="fas fa-calendar"></i> 12 mesi · Anno selezionabile
          </span>
        </div>
      </NuxtLink>

      <NuxtLink to="/bilancio/kpi" class="card hover:shadow-lg transition-shadow group">
        <div class="card-content p-6 flex flex-col items-center text-center">
          <div class="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mb-4 group-hover:bg-orange-200 transition-colors">
            <i class="fas fa-tachometer-alt text-3xl text-orange-600"></i>
          </div>
          <h3 class="font-semibold text-gray-800 text-lg">KPI Finanziari</h3>
          <p class="text-sm text-gray-500 mt-2">
            ROE, ROI, EBITDA margin, Current Ratio, Debt/Equity e crescita ricavi
          </p>
          <span class="mt-4 inline-flex items-center gap-1 text-xs bg-orange-50 text-orange-700 px-3 py-1 rounded-full">
            <i class="fas fa-chart-line"></i> Alert colorati per settore
          </span>
        </div>
      </NuxtLink>
    </div>

    <div class="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg text-sm text-blue-700">
      <i class="fas fa-info-circle mr-2"></i>
      I dati sono recuperati in tempo reale da <strong>Kontabila</strong> (entityId=1 · Smiledoc).
      Se un anno non è disponibile, vengono mostrati zeri coerentemente con i template Excel WSNO-006.
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({ layout: 'default' })
</script>

<style scoped>
.card { @apply bg-white rounded-lg shadow; }
.card-header { @apply px-4 py-3 border-b border-gray-200; }
.card-title { @apply text-lg font-semibold text-gray-800 flex items-center; }
.card-content { @apply p-4; }
</style>
