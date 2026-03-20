<template>
  <div class="relative" ref="dropdownRef">
    <button
      @click="toggleDropdown"
      class="flex items-center gap-2 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-white text-sm rounded-lg transition-colors"
    >
      <i class="fas fa-building text-xs opacity-70"></i>
      <span>{{ entityStore.selectedEntityName }}</span>
      <i class="fas fa-chevron-down text-xs opacity-70 transition-transform" :class="{ 'rotate-180': open }"></i>
    </button>

    <div
      v-if="open"
      class="absolute right-0 top-full mt-1 w-64 bg-white border border-slate-200 rounded-xl shadow-lg z-50 py-1"
    >
      <!-- Loading -->
      <div v-if="entityStore.loading" class="px-4 py-3 text-sm text-slate-500 text-center">
        <i class="fas fa-spinner fa-spin mr-2"></i>Caricamento...
      </div>

      <!-- Tutte le aziende -->
      <button
        v-else
        @click="select(null)"
        class="w-full text-left px-4 py-2.5 text-sm hover:bg-slate-50 flex items-center gap-2 transition-colors"
        :class="{ 'text-blue-600 font-medium bg-blue-50': entityStore.selectedEntityId === null }"
      >
        <i class="fas fa-layer-group text-xs w-4"></i>
        Tutte le aziende
      </button>

      <div class="border-t border-slate-100 my-1"></div>

      <!-- Lista entità -->
      <button
        v-for="entity in entityStore.entities"
        :key="entity.id"
        @click="select(entity.id)"
        class="w-full text-left px-4 py-2.5 text-sm hover:bg-slate-50 flex items-center gap-2 transition-colors"
        :class="{ 'text-blue-600 font-medium bg-blue-50': entityStore.selectedEntityId === entity.id }"
      >
        <i class="fas fa-building text-xs w-4 opacity-60"></i>
        <div class="flex flex-col">
          <span class="font-medium leading-tight">{{ entity.name }}</span>
          <span v-if="entity.vatNumber" class="text-xs text-slate-400">{{ entity.vatNumber }}</span>
        </div>
        <i v-if="entityStore.selectedEntityId === entity.id" class="fas fa-check text-xs ml-auto text-blue-600"></i>
      </button>

      <!-- Nessun risultato -->
      <div v-if="!entityStore.loading && entityStore.entities.length === 0" class="px-4 py-3 text-sm text-slate-400 text-center">
        Nessuna azienda trovata
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { useEntityStore } from '~/stores/entity'

const entityStore = useEntityStore()
const open = ref(false)
const dropdownRef = ref<HTMLElement | null>(null)

function toggleDropdown() {
  if (!open.value && entityStore.entities.length === 0) {
    entityStore.fetchEntities()
  }
  open.value = !open.value
}

function select(id: number | null) {
  entityStore.selectEntity(id)
  open.value = false
}

function handleClickOutside(e: MouseEvent) {
  if (dropdownRef.value && !dropdownRef.value.contains(e.target as Node)) {
    open.value = false
  }
}

onMounted(() => {
  document.addEventListener('click', handleClickOutside)
  entityStore.fetchEntities()
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
})
</script>
