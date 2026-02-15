<template>
  <div>
    <div class="mb-6">
      <div class="flex items-center gap-2">
        <h1 class="text-2xl font-bold text-slate-800">Dashboard Controllo di Gestione</h1>
        <PageInfoButton
          title="Dashboard"
          description="Panoramica contabilità e finanza con KPI principali e quick links"
          :features="[
            'Movimenti mese e percentuale conciliazione',
            'Fatture emesse e da attenzionare',
            'Link rapidi a Contabilità, Finanziario, Pianificazione'
          ]"
        />
      </div>
      <p class="text-slate-500">Panoramica contabilità e finanza</p>
    </div>

    <!-- KPI Cards -->
    <div class="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
      <div class="card p-5">
        <div class="flex items-center gap-3">
          <div class="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center">
            <i class="fas fa-calculator text-emerald-600 text-lg"></i>
          </div>
          <div>
            <p class="text-2xl font-bold text-slate-800">{{ stats.movimentiMese }}</p>
            <p class="text-sm text-slate-500">Movimenti questo mese</p>
          </div>
        </div>
      </div>

      <div class="card p-5">
        <div class="flex items-center gap-3">
          <div class="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
            <i class="fas fa-check-circle text-green-600 text-lg"></i>
          </div>
          <div>
            <p class="text-2xl font-bold text-slate-800">{{ stats.conciliati }}%</p>
            <p class="text-sm text-slate-500">Conciliati</p>
          </div>
        </div>
      </div>

      <div class="card p-5">
        <div class="flex items-center gap-3">
          <div class="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
            <i class="fas fa-file-invoice-dollar text-blue-600 text-lg"></i>
          </div>
          <div>
            <p class="text-2xl font-bold text-slate-800">{{ stats.fatture }}</p>
            <p class="text-sm text-slate-500">Fatture emesse</p>
          </div>
        </div>
      </div>

      <div class="card p-5">
        <div class="flex items-center gap-3">
          <div class="w-12 h-12 bg-amber-100 rounded-xl flex items-center justify-center">
            <i class="fas fa-exclamation-triangle text-amber-600 text-lg"></i>
          </div>
          <div>
            <p class="text-2xl font-bold text-slate-800">{{ stats.daAttenzionare }}</p>
            <p class="text-sm text-slate-500">Da attenzionare</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Quick Links -->
    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div class="card">
        <div class="card-header">
          <h2 class="card-title"><i class="fas fa-calculator mr-2 text-emerald-500"></i>Contabilità</h2>
        </div>
        <div class="card-content">
          <div class="space-y-2">
            <NuxtLink to="/contabilita" class="flex items-center gap-3 p-3 rounded-lg hover:bg-slate-50 transition text-slate-700">
              <i class="fas fa-robot text-slate-400 w-5"></i>
              <span>Dashboard Automatica</span>
            </NuxtLink>
            <NuxtLink to="/bank" class="flex items-center gap-3 p-3 rounded-lg hover:bg-slate-50 transition text-slate-700">
              <i class="fas fa-university text-slate-400 w-5"></i>
              <span>Bank Control</span>
            </NuxtLink>
            <NuxtLink to="/bank/conciliazione" class="flex items-center gap-3 p-3 rounded-lg hover:bg-slate-50 transition text-slate-700">
              <i class="fas fa-check-double text-slate-400 w-5"></i>
              <span>Conciliazione</span>
            </NuxtLink>
            <NuxtLink to="/fatture" class="flex items-center gap-3 p-3 rounded-lg hover:bg-slate-50 transition text-slate-700">
              <i class="fas fa-file-invoice text-slate-400 w-5"></i>
              <span>Ricavi</span>
            </NuxtLink>
            <NuxtLink to="/memo-economici" class="flex items-center gap-3 p-3 rounded-lg hover:bg-slate-50 transition text-slate-700">
              <i class="fas fa-receipt text-slate-400 w-5"></i>
              <span>Costi</span>
            </NuxtLink>
          </div>
        </div>
      </div>

      <div class="card">
        <div class="card-header">
          <h2 class="card-title"><i class="fas fa-chart-line mr-2 text-emerald-500"></i>Finanziario</h2>
        </div>
        <div class="card-content">
          <div class="space-y-2">
            <NuxtLink to="/riclassificazione-bilancio/interna" class="flex items-center gap-3 p-3 rounded-lg hover:bg-slate-50 transition text-slate-700">
              <i class="fas fa-sitemap text-slate-400 w-5"></i>
              <span>Riclassificazione Bilancio</span>
            </NuxtLink>
            <NuxtLink to="/registro-economico" class="flex items-center gap-3 p-3 rounded-lg hover:bg-slate-50 transition text-slate-700">
              <i class="fas fa-book text-slate-400 w-5"></i>
              <span>Registro Economico</span>
            </NuxtLink>
            <NuxtLink to="/analisi-fatturato" class="flex items-center gap-3 p-3 rounded-lg hover:bg-slate-50 transition text-slate-700">
              <i class="fas fa-chart-bar text-slate-400 w-5"></i>
              <span>Analisi Fatturato</span>
            </NuxtLink>
            <NuxtLink to="/bep" class="flex items-center gap-3 p-3 rounded-lg hover:bg-slate-50 transition text-slate-700">
              <i class="fas fa-balance-scale text-slate-400 w-5"></i>
              <span>Break Even Point</span>
            </NuxtLink>
            <NuxtLink to="/monitoraggio/finanziario" class="flex items-center gap-3 p-3 rounded-lg hover:bg-slate-50 transition text-slate-700">
              <i class="fas fa-tachometer-alt text-slate-400 w-5"></i>
              <span>Monitor Finanziario</span>
            </NuxtLink>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({ layout: 'default' })

const stats = reactive({
  movimentiMese: '-',
  conciliati: '-',
  fatture: '-',
  daAttenzionare: '-'
})
</script>
