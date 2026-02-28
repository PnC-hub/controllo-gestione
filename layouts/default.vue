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
            <h1 class="text-white font-bold text-sm">Profitera</h1>
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

      <!-- Tenant Switcher -->
      <div v-if="sidebarOpen && centroStore.centri.length > 0" class="px-3 py-3 border-b border-white/10">
        <TenantSwitcher />
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

    <!-- Ticket System -->
    <TicketSystem appName="Profitera" />

    <!-- AI CFO Chat -->
    <button
      @click="chat.toggle()"
      class="fixed bottom-6 right-6 w-14 h-14 bg-gradient-to-br from-purple-600 to-indigo-600 text-white rounded-full shadow-lg hover:shadow-xl hover:scale-105 transition-all z-30 flex items-center justify-center group"
      title="Profitera AI - CFO Assistant"
    >
      <i class="fas fa-brain text-xl group-hover:scale-110 transition-transform"></i>
    </button>

    <AiChatDrawer
      :is-open="chat.isOpen.value"
      :loading="chat.loading.value"
      :error="chat.error.value"
      :messages="chat.messages.value"
      :conversations="chat.conversations.value"
      :current-conversation-id="chat.currentConversationId.value"
      v-model:input-message="chat.inputMessage.value"
      @close="chat.close()"
      @send="chat.sendMessage()"
      @new-conversation="chat.newConversation()"
      @load-conversation="chat.loadConversation($event)"
      @delete-conversation="chat.deleteConversation($event)"
      @quick-send="handleQuickSend"
    />
  </div>
</template>

<script setup lang="ts">
import { useAuthStore } from '~/stores/auth'
import { useCentroStore } from '~/stores/centro'

const authStore = useAuthStore()
const centroStore = useCentroStore()
const route = useRoute()
const router = useRouter()
const chat = useChat()

const sidebarOpen = ref(true)

const pageTitle = computed(() => {
  const titles: Record<string, string> = {
    '/': 'Dashboard',
    '/dashboard': 'Dashboard',
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
    '/budget': 'Budget Annuale',
    '/budget/forecast': 'Rolling Forecast',
    '/budget/scostamenti': 'Analisi Scostamenti',
    '/parti-correlate': 'Parti Correlate',
    '/parti-correlate/operazioni': 'Operazioni Globali',
    '/piano-industriale': 'Piano Industriale',
    '/piano-industriale/proiezioni': 'Proiezioni Economico-Finanziarie',
    '/piano-industriale/scenari': 'Analisi Scenari',
    '/contratti': 'Contratti',
    '/contratti/scadenzario': 'Scadenzario Contratti',
    '/analisi-flussi': 'Analisi Flusso Pazienti',
  }

  // Handle dynamic routes
  if (route.path.startsWith('/parti-correlate/') && route.path !== '/parti-correlate/operazioni') {
    return 'Dettaglio Parte Correlata'
  }

  if (route.path.startsWith('/contratti/') && route.path !== '/contratti/scadenzario') {
    return 'Dettaglio Contratto'
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

const handleQuickSend = (text: string) => {
  chat.inputMessage.value = text
  nextTick(() => chat.sendMessage())
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
