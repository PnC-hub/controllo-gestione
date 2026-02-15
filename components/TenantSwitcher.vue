<template>
  <div class="relative">
    <!-- Current Tenant Button -->
    <button
      @click="open = !open"
      class="flex items-center gap-3 w-full p-3 hover:bg-emerald-900/30 rounded-lg transition border border-emerald-500/20"
    >
      <!-- Icon -->
      <div
        class="w-10 h-10 rounded-lg flex items-center justify-center text-white font-bold"
        :class="isAggregated ? 'bg-amber-600' : 'bg-emerald-600'"
      >
        <i v-if="isAggregated" class="fas fa-layer-group"></i>
        <span v-else>{{ currentCentro?.denominazione?.charAt(0) || currentCentro?.nome?.charAt(0) || '?' }}</span>
      </div>

      <!-- Info -->
      <div class="flex-1 text-left min-w-0">
        <div class="font-medium text-white truncate">
          {{ isAggregated ? 'Vista Aggregata' : (currentCentro?.denominazione || currentCentro?.nome || 'Seleziona azienda') }}
        </div>
        <div class="text-xs text-emerald-300 truncate">
          <template v-if="isAggregated">
            {{ centri.length }} aziende
          </template>
          <template v-else>
            {{ currentCentro?.citta || 'Nessuna città' }}
          </template>
        </div>
      </div>

      <!-- Chevron -->
      <i class="fas fa-chevron-down text-emerald-300 transition-transform" :class="{ 'rotate-180': open }"></i>
    </button>

    <!-- Dropdown -->
    <Teleport to="body">
      <div v-if="open" class="fixed inset-0 z-40" @click="open = false" />
    </Teleport>

    <Transition name="dropdown">
      <div
        v-if="open"
        class="absolute top-full left-0 right-0 mt-1 bg-slate-900 border border-emerald-500/30 rounded-lg shadow-2xl z-50 overflow-hidden"
      >
        <!-- Vista Aggregata (solo se più di un centro) -->
        <button
          v-if="centri.length > 1"
          @click="handleSwitchAggregated"
          class="flex items-center gap-3 w-full p-3 hover:bg-emerald-900/30 border-b border-slate-700 transition"
          :class="{ 'bg-emerald-900/30': isAggregated }"
        >
          <div class="w-10 h-10 bg-amber-600 rounded-lg flex items-center justify-center">
            <i class="fas fa-layer-group text-white"></i>
          </div>
          <div class="flex-1 text-left">
            <div class="font-medium text-white">Vista Aggregata</div>
            <div class="text-xs text-slate-400">Tutte le aziende</div>
          </div>
          <i v-if="isAggregated" class="fas fa-check text-green-400"></i>
        </button>

        <!-- Lista Centri -->
        <div class="max-h-64 overflow-y-auto">
          <button
            v-for="centro in centri"
            :key="centro.id"
            @click="handleSwitchCentro(centro.id)"
            class="flex items-center gap-3 w-full p-3 hover:bg-emerald-900/30 transition"
            :class="{ 'bg-emerald-900/30': centro.id === currentCentro?.id && !isAggregated }"
          >
            <!-- Avatar -->
            <div class="w-10 h-10 bg-slate-700 rounded-lg flex items-center justify-center text-white font-bold">
              {{ (centro.denominazione || centro.nome)?.charAt(0) }}
            </div>

            <!-- Info -->
            <div class="flex-1 text-left min-w-0">
              <div class="font-medium text-white truncate">{{ centro.denominazione || centro.nome }}</div>
              <div class="text-xs text-slate-400">
                {{ centro.citta || 'Italia' }}
              </div>
            </div>

            <!-- Check se selezionato -->
            <i
              v-if="centro.id === currentCentro?.id && !isAggregated"
              class="fas fa-check text-green-400 flex-shrink-0"
            ></i>
          </button>
        </div>

        <!-- Aggiungi Azienda -->
        <NuxtLink
          to="/impostazioni/nuova-azienda"
          class="flex items-center gap-3 w-full p-3 hover:bg-emerald-900/30 border-t border-slate-700 text-emerald-400 transition"
          @click="open = false"
        >
          <i class="fas fa-plus"></i>
          <span>Aggiungi azienda</span>
        </NuxtLink>
      </div>
    </Transition>
  </div>
</template>

<script setup lang="ts">
import { useCentroStore } from '~/stores/centro'

const centroStore = useCentroStore()

const open = ref(false)
const isAggregated = ref(false)

// Computed
const currentCentro = computed(() => centroStore.centroCorrente)
const centri = computed(() => centroStore.centri)

// Handlers
const handleSwitchCentro = async (centroId: number) => {
  isAggregated.value = false
  await centroStore.setCentro(centroId)
  open.value = false
}

const handleSwitchAggregated = () => {
  isAggregated.value = true
  open.value = false
  // TODO: Implementare logica vista aggregata
}
</script>

<style scoped>
.dropdown-enter-active,
.dropdown-leave-active {
  transition: all 0.2s ease;
}

.dropdown-enter-from,
.dropdown-leave-to {
  opacity: 0;
  transform: translateY(-8px);
}
</style>
