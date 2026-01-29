<template>
  <div>
    <!-- Header -->
    <div class="mb-6">
      <div class="flex items-center gap-3 mb-2">
        <NuxtLink to="/analisi-fatturato" class="text-gray-400 hover:text-gray-600">
          <i class="fas fa-arrow-left"></i>
        </NuxtLink>
        <div class="w-12 h-12 rounded-xl bg-gradient-to-br from-gray-500 to-slate-600 flex items-center justify-center">
          <i class="fas fa-file-export text-white text-xl"></i>
        </div>
        <div class="flex-1">
          <h1 class="text-2xl font-bold text-gray-800">Riclassificazione Commercialista</h1>
          <p class="text-gray-500">Mapping per export verso il commercialista</p>
        </div>
        <!-- Info Modal -->
        <AiSectionInfoModal
          title="Riclassificazione Commercialista"
          subtitle="Export contabile"
          icon="fa-file-export"
          header-gradient="bg-gradient-to-r from-gray-500 to-slate-600"
          description="La Riclassificazione Commercialista definisce il mapping tra le voci interne e il piano dei conti del commercialista, facilitando l'export dei dati contabili nel formato richiesto."
          :how-it-works="[
            'Importa il piano dei conti del commercialista',
            'Mappa le voci interne ai conti esterni',
            'Esporta i movimenti nel formato corretto',
            'Il commercialista importa direttamente in contabilità'
          ]"
          :advantages="[
            'Riduce errori di trascrizione',
            'Velocizza la chiusura contabile',
            'Formato compatibile con software contabili',
            'Tracciabilità delle mappature'
          ]"
          :limitations="[
            'Richiede piano dei conti aggiornato',
            'Modifiche al piano richiedono riallineamento'
          ]"
          quick-start-intro="Per configurare l'export:"
          :quick-start-tips="[
            'Richiedi il piano dei conti al commercialista',
            'Mappa tutte le voci utilizzate',
            'Testa l\'export con un periodo campione'
          ]"
          :related-pages="[
            { label: 'Registro Contabile', route: '/registro-contabile', icon: 'fa-book' },
            { label: 'Riclass. Interna', route: '/riclassificazione-bilancio/interna', icon: 'fa-sitemap' }
          ]"
        />
      </div>
    </div>
    <div class="bg-white rounded-lg shadow p-6">
      <p class="text-gray-500">Riclassificazione per export verso il commercialista.</p>
      <div class="mt-6 text-center py-8 text-gray-400">
        <i class="fas fa-file-export text-4xl mb-2"></i>
        <p>Configura il mapping per il commercialista</p>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">definePageMeta({ layout: 'default' })</script>
