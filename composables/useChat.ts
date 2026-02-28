import { useCentroStore } from '~/stores/centro'
import { useAuthStore } from '~/stores/auth'

export interface ChatMessage {
  id: number
  role: 'user' | 'assistant'
  content: string
  createdAt: string
}

export interface ChatConversation {
  id: number
  title: string
  centroId: number
  messageCount: number
  createdAt: string
  updatedAt: string
}

export const useChat = () => {
  const isOpen = ref(false)
  const loading = ref(false)
  const error = ref<string | null>(null)
  const messages = ref<ChatMessage[]>([])
  const conversations = ref<ChatConversation[]>([])
  const currentConversationId = ref<number | null>(null)
  const inputMessage = ref('')

  const centroStore = useCentroStore()
  const authStore = useAuthStore()
  const route = useRoute()

  const getAuthHeaders = () => {
    let token = authStore.token
    if (!token && typeof localStorage !== 'undefined') {
      token = localStorage.getItem('auth_token')
    }
    return token ? { Authorization: `Bearer ${token}` } : {}
  }

  const toggle = () => {
    isOpen.value = !isOpen.value
    if (isOpen.value && conversations.value.length === 0) {
      loadConversations()
    }
  }

  const close = () => {
    isOpen.value = false
  }

  const loadConversations = async () => {
    try {
      const centroId = centroStore.centroId
      const response = await $fetch<{ success: boolean; data: ChatConversation[] }>(
        `/api/chat/conversations?centro_id=${centroId}`,
        { headers: getAuthHeaders() }
      )
      if (response.success) {
        conversations.value = response.data
      }
    } catch (e: any) {
      console.error('Errore caricamento conversazioni:', e)
    }
  }

  const loadConversation = async (id: number) => {
    loading.value = true
    error.value = null
    try {
      const response = await $fetch<{ success: boolean; data: { id: number; title: string; messages: ChatMessage[] } }>(
        `/api/chat/conversations/${id}`,
        { headers: getAuthHeaders() }
      )
      if (response.success) {
        currentConversationId.value = id
        messages.value = response.data.messages
      }
    } catch (e: any) {
      error.value = 'Errore caricamento conversazione'
      console.error(e)
    } finally {
      loading.value = false
    }
  }

  const newConversation = () => {
    currentConversationId.value = null
    messages.value = []
    inputMessage.value = ''
    error.value = null
  }

  const sendMessage = async () => {
    const text = inputMessage.value.trim()
    if (!text || loading.value) return

    const centroId = centroStore.centroId
    if (!centroId) {
      error.value = 'Seleziona un centro prima di usare la chat'
      return
    }

    // Aggiungi messaggio utente alla UI subito
    const userMsg: ChatMessage = {
      id: Date.now(),
      role: 'user',
      content: text,
      createdAt: new Date().toISOString(),
    }
    messages.value = [...messages.value, userMsg]
    inputMessage.value = ''
    loading.value = true
    error.value = null

    try {
      const response = await $fetch<{
        success: boolean
        data: {
          conversationId: number
          message: ChatMessage
        }
      }>('/api/chat/send', {
        method: 'POST',
        headers: getAuthHeaders(),
        body: {
          message: text,
          conversationId: currentConversationId.value,
          centroId,
          currentPage: route.path,
          authToken: authStore.token || (typeof localStorage !== 'undefined' ? localStorage.getItem('auth_token') : null),
        },
      })

      if (response.success) {
        currentConversationId.value = response.data.conversationId
        messages.value = [...messages.value, response.data.message]
        // Refresh lista conversazioni
        loadConversations()
      }
    } catch (e: any) {
      error.value = 'Errore nella risposta AI. Riprova.'
      console.error('[Chat] Errore invio:', e)
    } finally {
      loading.value = false
    }
  }

  const deleteConversation = async (id: number) => {
    try {
      await $fetch(`/api/chat/conversations/${id}`, {
        method: 'DELETE',
        headers: getAuthHeaders(),
      })
      conversations.value = conversations.value.filter(c => c.id !== id)
      if (currentConversationId.value === id) {
        newConversation()
      }
    } catch (e: any) {
      console.error('Errore eliminazione conversazione:', e)
    }
  }

  return {
    isOpen: readonly(isOpen),
    loading: readonly(loading),
    error: readonly(error),
    messages: readonly(messages),
    conversations: readonly(conversations),
    currentConversationId: readonly(currentConversationId),
    inputMessage,
    toggle,
    close,
    loadConversations,
    loadConversation,
    newConversation,
    sendMessage,
    deleteConversation,
  }
}
