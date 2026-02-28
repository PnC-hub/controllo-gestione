<template>
  <!-- Backdrop -->
  <Teleport to="body">
    <Transition name="backdrop">
      <div v-if="isOpen" class="fixed inset-0 bg-black/20 z-40" @click="$emit('close')"></div>
    </Transition>

    <!-- Drawer -->
    <Transition name="drawer">
      <div v-if="isOpen"
        class="fixed right-0 top-0 h-full z-50 bg-white shadow-2xl flex flex-col"
        style="width: 560px; max-width: 90vw;">

        <!-- Header -->
        <div class="bg-gradient-to-r from-purple-600 to-indigo-600 text-white px-5 py-4 flex items-center justify-between flex-shrink-0">
          <div class="flex items-center gap-3">
            <div class="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
              <i class="fas fa-brain text-lg"></i>
            </div>
            <div>
              <h3 class="font-bold text-base">Profitera AI</h3>
              <p class="text-purple-200 text-xs">CFO Assistant</p>
            </div>
          </div>
          <div class="flex items-center gap-2">
            <!-- Storico -->
            <button @click="showHistory = !showHistory"
              class="w-8 h-8 rounded-lg bg-white/15 hover:bg-white/25 flex items-center justify-center transition-colors"
              title="Storico conversazioni">
              <i class="fas fa-history text-sm"></i>
            </button>
            <!-- Nuova conversazione -->
            <button @click="$emit('newConversation')"
              class="w-8 h-8 rounded-lg bg-white/15 hover:bg-white/25 flex items-center justify-center transition-colors"
              title="Nuova conversazione">
              <i class="fas fa-plus text-sm"></i>
            </button>
            <!-- Chiudi -->
            <button @click="$emit('close')"
              class="w-8 h-8 rounded-lg bg-white/15 hover:bg-white/25 flex items-center justify-center transition-colors">
              <i class="fas fa-times text-sm"></i>
            </button>
          </div>
        </div>

        <!-- Conversation History Sidebar -->
        <Transition name="slide">
          <div v-if="showHistory" class="border-b border-slate-200 bg-slate-50 max-h-64 overflow-y-auto flex-shrink-0">
            <div class="p-3">
              <p class="text-xs font-semibold text-slate-500 uppercase mb-2">Conversazioni recenti</p>
              <div v-if="conversations.length === 0" class="text-xs text-slate-400 py-2">
                Nessuna conversazione precedente
              </div>
              <div v-for="conv in conversations" :key="conv.id"
                class="flex items-center justify-between p-2 rounded-lg hover:bg-white cursor-pointer group transition-colors"
                :class="currentConversationId === conv.id ? 'bg-purple-50 border border-purple-200' : ''"
                @click="$emit('loadConversation', conv.id); showHistory = false">
                <div class="flex-1 min-w-0">
                  <p class="text-sm text-slate-700 truncate">{{ conv.title || 'Conversazione' }}</p>
                  <p class="text-[10px] text-slate-400">{{ formatDate(conv.updatedAt) }} · {{ conv.messageCount }} msg</p>
                </div>
                <button @click.stop="$emit('deleteConversation', conv.id)"
                  class="w-6 h-6 rounded flex items-center justify-center opacity-0 group-hover:opacity-100 text-red-400 hover:text-red-600 hover:bg-red-50 transition-all">
                  <i class="fas fa-trash-alt text-[10px]"></i>
                </button>
              </div>
            </div>
          </div>
        </Transition>

        <!-- Messages area -->
        <div ref="messagesContainer" class="flex-1 overflow-y-auto p-5 space-y-1">
          <!-- Welcome message -->
          <div v-if="messages.length === 0 && !loading" class="flex flex-col items-center justify-center h-full text-center px-8">
            <div class="w-16 h-16 bg-gradient-to-br from-purple-400 to-indigo-500 rounded-2xl flex items-center justify-center mb-4">
              <i class="fas fa-brain text-white text-2xl"></i>
            </div>
            <h4 class="text-lg font-bold text-slate-800 mb-2">Ciao! Sono il tuo CFO AI</h4>
            <p class="text-sm text-slate-500 mb-6">Posso analizzare i dati finanziari del centro, pianificare strategie e identificare opportunita' di crescita.</p>
            <div class="grid grid-cols-1 gap-2 w-full max-w-sm">
              <button v-for="suggestion in suggestions" :key="suggestion"
                @click="$emit('quickSend', suggestion)"
                class="text-left text-xs p-3 rounded-xl border border-slate-200 hover:border-purple-300 hover:bg-purple-50 transition-all text-slate-600">
                <i class="fas fa-lightbulb text-purple-400 mr-2"></i>{{ suggestion }}
              </button>
            </div>
          </div>

          <!-- Messages -->
          <AiChatMessage
            v-for="msg in messages"
            :key="msg.id"
            :role="msg.role"
            :content="msg.content"
          />

          <!-- Typing indicator -->
          <div v-if="loading" class="flex gap-3 mb-4">
            <div class="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center flex-shrink-0">
              <i class="fas fa-brain text-white text-[11px]"></i>
            </div>
            <div class="bg-slate-100 rounded-2xl rounded-tl-sm px-4 py-3">
              <div class="flex gap-1.5">
                <span class="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style="animation-delay: 0ms"></span>
                <span class="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style="animation-delay: 150ms"></span>
                <span class="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style="animation-delay: 300ms"></span>
              </div>
            </div>
          </div>
        </div>

        <!-- Input -->
        <AiChatInput
          v-model="inputMessage"
          :loading="loading"
          :error="error"
          @send="$emit('send')"
        />
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
import type { ChatMessage, ChatConversation } from '~/composables/useChat'

const props = defineProps<{
  isOpen: boolean
  loading: boolean
  error: string | null
  messages: readonly ChatMessage[]
  conversations: readonly ChatConversation[]
  currentConversationId: number | null
}>()

defineEmits<{
  close: []
  send: []
  newConversation: []
  loadConversation: [id: number]
  deleteConversation: [id: number]
  quickSend: [text: string]
}>()

const inputMessage = defineModel<string>('inputMessage', { required: true })

const showHistory = ref(false)
const messagesContainer = ref<HTMLElement>()

const suggestions = [
  'Analizza il fatturato di questo mese',
  'Quali sono i punti deboli del funnel pazienti?',
  'Crea un piano d\'azione per aumentare le conversioni',
  'Confronta le nostre performance con il benchmark di settore',
]

const formatDate = (date: string) => {
  return new Date(date).toLocaleDateString('it-IT', { day: 'numeric', month: 'short' })
}

// Auto-scroll to bottom when new messages
watch(() => props.messages.length, () => {
  nextTick(() => {
    if (messagesContainer.value) {
      messagesContainer.value.scrollTop = messagesContainer.value.scrollHeight
    }
  })
})

watch(() => props.loading, (val) => {
  if (val) {
    nextTick(() => {
      if (messagesContainer.value) {
        messagesContainer.value.scrollTop = messagesContainer.value.scrollHeight
      }
    })
  }
})
</script>

<style scoped>
.backdrop-enter-active, .backdrop-leave-active {
  transition: opacity 0.2s ease;
}
.backdrop-enter-from, .backdrop-leave-to {
  opacity: 0;
}

.drawer-enter-active, .drawer-leave-active {
  transition: transform 0.3s ease;
}
.drawer-enter-from, .drawer-leave-to {
  transform: translateX(100%);
}

.slide-enter-active, .slide-leave-active {
  transition: all 0.2s ease;
}
.slide-enter-from, .slide-leave-to {
  opacity: 0;
  max-height: 0;
}
.slide-enter-to, .slide-leave-from {
  max-height: 16rem;
}
</style>
