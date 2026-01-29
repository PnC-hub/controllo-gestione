<template>
  <div>
    <div class="flex justify-between items-center mb-6">
      <h1 class="text-2xl font-bold text-gray-900">Gestione Prezzi</h1>
      <button class="btn-primary"><i class="fas fa-save mr-2"></i>Salva Modifiche</button>
    </div>
    <div class="bg-white rounded-lg shadow p-6">
      <p class="text-gray-500 mb-4">Modifica i prezzi delle prestazioni del tariffario.</p>
      <table class="min-w-full divide-y divide-gray-200">
        <thead><tr>
          <th class="text-left text-xs font-medium text-gray-500 uppercase py-3">Prestazione</th>
          <th class="text-right text-xs font-medium text-gray-500 uppercase py-3">Prezzo Attuale</th>
          <th class="text-right text-xs font-medium text-gray-500 uppercase py-3">Nuovo Prezzo</th>
        </tr></thead>
        <tbody class="divide-y divide-gray-200">
          <tr v-for="p in prestazioni" :key="p.id">
            <td class="py-3">{{ p.nome }}</td>
            <td class="py-3 text-right">{{ formatCurrency(p.prezzo) }}</td>
            <td class="py-3 text-right"><input type="number" v-model="p.nuovo" class="w-24 px-2 py-1 border rounded text-right" /></td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>
<script setup lang="ts">
definePageMeta({ layout: 'default' })
const prestazioni = ref([
  { id: 1, nome: 'Prima Visita', prezzo: 50, nuovo: 50 },
  { id: 2, nome: 'Igiene Dentale', prezzo: 80, nuovo: 80 },
  { id: 3, nome: 'Otturazione', prezzo: 120, nuovo: 120 }
])
const formatCurrency = (v: number) => new Intl.NumberFormat('it-IT', { style: 'currency', currency: 'EUR' }).format(v)
</script>
<style scoped>.btn-primary { @apply px-4 py-2 bg-cyan-600 text-white rounded-lg hover:bg-cyan-700; }</style>
