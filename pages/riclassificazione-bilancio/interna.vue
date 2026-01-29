<template>
  <div>
    <!-- Header -->
    <div class="mb-6">
      <div class="flex items-center gap-3 mb-2">
        <NuxtLink to="/analisi-fatturato" class="text-gray-400 hover:text-gray-600">
          <i class="fas fa-arrow-left"></i>
        </NuxtLink>
        <div class="w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
          <i class="fas fa-sitemap text-white text-xl"></i>
        </div>
        <div class="flex-1">
          <h1 class="text-2xl font-bold text-gray-800">Riclassificazione Interna</h1>
          <p class="text-gray-500">Riclassificazione bilancio per analisi gestionali</p>
        </div>
        <!-- Info Modal -->
        <AiSectionInfoModal
          title="Riclassificazione Interna"
          subtitle="Analisi gestionale"
          icon="fa-sitemap"
          header-gradient="bg-gradient-to-r from-indigo-500 to-purple-600"
          description="La Riclassificazione Interna permette di riorganizzare le voci di bilancio secondo criteri gestionali personalizzati, diversi dalla classificazione civilistica, per analisi di performance più significative."
          :how-it-works="[
            'Definisci le macro-categorie gestionali',
            'Mappa le voci contabili alle categorie',
            'Il sistema riclassifica automaticamente i dati',
            'Genera report gestionali personalizzati'
          ]"
          :advantages="[
            'Analisi per aree di business',
            'KPI gestionali significativi',
            'Confronto tra periodi coerente',
            'Indipendente dalla contabilità ufficiale'
          ]"
          :limitations="[
            'Richiede configurazione iniziale',
            'Mappature da aggiornare con nuove voci'
          ]"
          quick-start-intro="Per configurare la riclassificazione:"
          :quick-start-tips="[
            'Parti dalle macro-categorie più importanti',
            'Mappa tutte le voci esistenti',
            'Verifica la coerenza con report esistenti'
          ]"
          :related-pages="[
            { label: 'Analisi Fatturato', route: '/analisi-fatturato', icon: 'fa-chart-bar' },
            { label: 'Riclass. Commercialista', route: '/riclassificazione-bilancio/commercialista', icon: 'fa-file-export' }
          ]"
        />
      </div>
    </div>
    <div class="bg-white rounded-lg shadow p-6">
      <p class="text-gray-500">Riclassificazione interna del bilancio per analisi gestionali.</p>
      <div class="mt-6 text-center py-8 text-gray-400">
        <i class="fas fa-sitemap text-4xl mb-2"></i>
        <p>Configura le voci di riclassificazione</p>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">definePageMeta({ layout: 'default' })</script>
