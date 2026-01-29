<template>
  <div>
    <!-- Header -->
    <div class="mb-6">
      <div class="flex items-center gap-3 mb-2">
        <NuxtLink to="/analisi-fatturato" class="text-gray-400 hover:text-gray-600">
          <i class="fas fa-arrow-left"></i>
        </NuxtLink>
        <div class="w-12 h-12 rounded-xl bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center">
          <i class="fas fa-chart-bar text-white text-xl"></i>
        </div>
        <div class="flex-1">
          <h1 class="text-2xl font-bold text-gray-800">Riclassificazione Fatturato</h1>
          <p class="text-gray-500">Categorizzazione del fatturato per analisi</p>
        </div>
        <!-- Info Modal -->
        <AiSectionInfoModal
          title="Riclassificazione Fatturato"
          subtitle="Analisi revenue"
          icon="fa-chart-bar"
          header-gradient="bg-gradient-to-r from-green-500 to-emerald-600"
          description="La Riclassificazione Fatturato organizza i ricavi in categorie significative per l'analisi: per tipo di prestazione, per medico, per canale di acquisizione. Fondamentale per capire da dove provengono i ricavi."
          :how-it-works="[
            'Definisci le categorie di fatturato',
            'Associa le prestazioni alle categorie',
            'Il sistema classifica automaticamente le fatture',
            'Genera report per categoria'
          ]"
          :advantages="[
            'Comprensione fonti di ricavo',
            'Analisi per branca odontoiatrica',
            'Identificazione servizi più redditizi',
            'Supporto decisioni strategiche'
          ]"
          :limitations="[
            'Richiede categorizzazione prestazioni',
            'Prestazioni miste difficili da classificare'
          ]"
          quick-start-intro="Per categorizzare il fatturato:"
          :quick-start-tips="[
            'Crea categorie per branca (conservativa, protesi, etc)',
            'Includi una categoria residuale per casi speciali',
            'Rivedi periodicamente le classificazioni'
          ]"
          :related-pages="[
            { label: 'Analisi Fatturato', route: '/analisi-fatturato', icon: 'fa-chart-bar' },
            { label: 'Riclass. Produzione', route: '/riclassificazione-bilancio/produzione', icon: 'fa-industry' }
          ]"
        />
      </div>
    </div>
    <div class="bg-white rounded-lg shadow p-6">
      <p class="text-gray-500">Riclassificazione del fatturato per categoria.</p>
      <div class="mt-6 text-center py-8 text-gray-400">
        <i class="fas fa-chart-bar text-4xl mb-2"></i>
        <p>Configura le categorie di fatturato</p>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">definePageMeta({ layout: 'default' })</script>
