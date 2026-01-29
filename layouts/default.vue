<template>
  <div class="min-h-screen bg-slate-50 flex">
    <!-- Sidebar -->
    <aside :class="[sidebarOpen ? 'w-72' : 'w-20', 'sidebar-gradient flex-shrink-0 transition-all duration-300 flex flex-col relative']">
      <!-- Logo -->
      <div class="p-4 flex items-center justify-between border-b border-white/10">
        <div v-if="sidebarOpen" class="flex items-center gap-3">
          <div class="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
            <i class="fas fa-chart-pie text-white text-lg"></i>
          </div>
          <div>
            <h1 class="text-white font-bold text-sm">Controllo di Gestione</h1>
            <p class="text-white/50 text-xs">Multi-Azienda</p>
          </div>
        </div>
        <div v-else class="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center mx-auto">
          <i class="fas fa-chart-pie text-white text-lg"></i>
        </div>
        <button @click="sidebarOpen = !sidebarOpen" class="text-white/50 hover:text-white transition-colors">
          <i :class="sidebarOpen ? 'fas fa-chevron-left' : 'fas fa-chevron-right'" class="text-sm"></i>
        </button>
      </div>

      <!-- Centro Selector -->
      <div v-if="sidebarOpen && centroStore.centri.length > 0" class="px-4 py-3 border-b border-white/10">
        <label class="text-white/40 text-xs font-semibold uppercase tracking-wider mb-1 block">Azienda</label>
        <select
          :value="centroStore.centroId"
          @change="changeCentro(Number(($event.target as HTMLSelectElement).value))"
          class="w-full bg-white/10 text-white text-sm rounded-lg border border-white/20 px-3 py-2 focus:outline-none focus:border-cyan-400"
        >
          <option v-for="c in centroStore.centri" :key="c.id" :value="c.id" class="bg-slate-800">
            {{ c.denominazione || c.nome }}
          </option>
        </select>
      </div>

      <!-- Menu -->
      <div class="flex-1 overflow-y-auto custom-scrollbar mt-2">
        <SidebarMenu :sidebar-open="sidebarOpen" />
      </div>

      <!-- User -->
      <div class="p-4 border-t border-white/10">
        <div v-if="sidebarOpen" class="flex items-center gap-3">
          <div class="w-9 h-9 bg-cyan-500/30 rounded-full flex items-center justify-center text-white font-semibold text-sm">
            {{ authStore.userInitials }}
          </div>
          <div class="flex-1 min-w-0">
            <p class="text-white text-sm font-medium truncate">{{ authStore.fullName }}</p>
            <p class="text-white/40 text-xs truncate">{{ authStore.user?.email }}</p>
          </div>
          <button @click="logout" class="text-white/40 hover:text-white">
            <i class="fas fa-sign-out-alt"></i>
          </button>
        </div>
        <button v-else @click="logout" class="w-full flex justify-center text-white/40 hover:text-white">
          <i class="fas fa-sign-out-alt"></i>
        </button>
      </div>
    </aside>

    <!-- Main content -->
    <main class="flex-1 flex flex-col min-w-0">
      <!-- Header -->
      <header class="bg-white border-b border-slate-200 px-6 py-4 flex items-center justify-between sticky top-0 z-10">
        <div>
          <h2 class="text-lg font-semibold text-slate-800">{{ pageTitle }}</h2>
          <p v-if="centroStore.centroNome" class="text-sm text-slate-400">{{ centroStore.centroNome }}</p>
        </div>
        <div class="flex items-center gap-3">
          <span class="text-xs text-slate-400">
            <i class="fas fa-building mr-1"></i>
            {{ centroStore.centri.length }} aziende
          </span>
        </div>
      </header>

      <!-- Content -->
      <main class="p-6 flex-1">
        <slot />
      </main>
    </main>
  </div>
</template>

<script setup lang="ts">
import { useAuthStore } from '~/stores/auth'
import { useCentroStore } from '~/stores/centro'

const authStore = useAuthStore()
const centroStore = useCentroStore()
const route = useRoute()
const router = useRouter()

const sidebarOpen = ref(true)

const pageTitle = computed(() => {
  const titles: Record<string, string> = {
    '/': 'Dashboard',
    '/contabilita': 'Dashboard Automatica',
    '/contabilita/regole': 'Regole Automatiche',
    '/contabilita/report': 'Report Contabile',
    '/bank': 'Bank Control',
    '/bank/conti': 'Conti Bancari',
    '/bank/import': 'Import Movimenti',
    '/bank/conciliazione': 'Conciliazione',
    '/prima-nota': 'Prima Nota',
    '/fatture': 'Ricavi',
    '/memo-economici': 'Costi',
    '/autofatture': 'Autofatture',
    '/riclassificazione-bilancio/interna': 'Riclassificazione Interna',
    '/riclassificazione-bilancio/fatturato': 'Bilancio Fatturato',
    '/riclassificazione-bilancio/produzione': 'Bilancio Produzione',
    '/riclassificazione-bilancio/commercialista': 'Riclassificazione Commercialista',
    '/registro-economico': 'Registro Economico',
    '/registro-contabile': 'Registro Contabile',
    '/registro-fiscale': 'Registro Fiscale',
    '/analisi-fatturato': 'Analisi Fatturato',
    '/bep': 'Break Even Point',
    '/costi/variabili-indiretti': 'Costi Variabili Indiretti',
    '/costi/variabili-gestionali': 'Costi Variabili Gestionali',
    '/costi/materiali-previsionali': 'Costi Materiali Previsionali',
    '/costi/fissi': 'Costi Fissi',
    '/costi/totali': 'Costi Totali',
    '/monitoraggio/finanziario': 'Monitor Finanziario',
    '/prestazioni/gestione-prezzi': 'Gestione Prezzi',
  }
  return titles[route.path] || 'Controllo di Gestione'
})

const changeCentro = (id: number) => {
  centroStore.setCentro(id)
}

const logout = () => {
  authStore.logout()
  router.push('/login')
}
</script>

<style>
.sidebar-gradient {
  background: linear-gradient(180deg, #0f172a 0%, #1e3a5f 50%, #164e63 100%);
}
.custom-scrollbar::-webkit-scrollbar { width: 4px; }
.custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
.custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.1); border-radius: 4px; }

/* Card utility classes */
.card {
  @apply bg-white rounded-xl border border-slate-200 shadow-sm;
}
.card-header {
  @apply px-6 py-4 border-b border-slate-100;
}
.card-title {
  @apply text-lg font-semibold text-slate-800;
}
.card-content {
  @apply p-6;
}
</style>
