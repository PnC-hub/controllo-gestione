<template>
  <div>
    <!-- Header -->
    <div class="mb-6">
      <div class="flex items-center gap-3 mb-2">
        <NuxtLink to="/analisi-fatturato" class="text-gray-400 hover:text-gray-600">
          <i class="fas fa-arrow-left"></i>
        </NuxtLink>
        <div class="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-600 flex items-center justify-center">
          <i class="fas fa-industry text-white text-xl"></i>
        </div>
        <div class="flex-1">
          <h1 class="text-2xl font-bold text-gray-800">Riclassificazione Produzione</h1>
          <p class="text-gray-500">Categorizzazione produzione per tipo prestazione</p>
        </div>
        <!-- Info Modal -->
        <AiSectionInfoModal
          title="Riclassificazione Produzione"
          subtitle="Analisi produzione"
          icon="fa-industry"
          header-gradient="bg-gradient-to-r from-blue-500 to-cyan-600"
          description="La Riclassificazione Produzione organizza il valore della produzione (prestazioni eseguite) per categoria, permettendo di analizzare le performance operative indipendentemente dalla fatturazione."
          :how-it-works="[
            'Definisci le categorie di produzione',
            'Mappa le prestazioni alle categorie',
            'Il sistema classifica le prestazioni eseguite',
            'Confronta produzione vs fatturato per categoria'
          ]"
          :advantages="[
            'Vista operativa delle performance',
            'Indipendente dai tempi di fatturazione',
            'Analisi produttività per medico',
            'Identificazione colli di bottiglia'
          ]"
          :limitations="[
            'Richiede registrazione puntuale prestazioni',
            'Prezzi devono essere aggiornati'
          ]"
          quick-start-intro="Per analizzare la produzione:"
          :quick-start-tips="[
            'Usa le stesse categorie del fatturato',
            'Confronta produzione e fatturato mensilmente',
            'Monitora il delta produzione-incassato'
          ]"
          :related-pages="[
            { label: 'Analisi Fatturato', route: '/analisi-fatturato', icon: 'fa-chart-bar' },
            { label: 'Riclass. Fatturato', route: '/riclassificazione-bilancio/fatturato', icon: 'fa-chart-bar' }
          ]"
        />
      </div>
    </div>
    <div class="bg-white rounded-lg shadow p-6">
      <p class="text-gray-500">Riclassificazione della produzione per tipo prestazione.</p>
      <div class="mt-6 text-center py-8 text-gray-400">
        <i class="fas fa-industry text-4xl mb-2"></i>
        <p>Configura le categorie di produzione</p>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">definePageMeta({ layout: 'default' })</script>
