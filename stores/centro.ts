import { defineStore } from 'pinia'
import { useAuthStore } from './auth'

interface Centro {
  id: number
  denominazione?: string
  nome?: string
  citta?: string
  stato_attivazione?: number
}

export const useCentroStore = defineStore('centro', {
  state: () => ({
    centroCorrente: null as Centro | null,
    centri: [] as Centro[],
    loading: false
  }),

  getters: {
    centroId: (state): number | null => state.centroCorrente?.id ?? null,
    centroNome: (state) => state.centroCorrente?.denominazione || state.centroCorrente?.nome || '',
    centroNomeBreve: (state) => {
      const nome = state.centroCorrente?.denominazione || state.centroCorrente?.nome || ''
      if (nome.length > 25) {
        return nome.substring(0, 22) + '...'
      }
      return nome
    }
  },

  actions: {
    async fetchCentri() {
      const config = useRuntimeConfig()
      const authStore = useAuthStore()
      this.loading = true

      try {
        // Costruisci headers con API Key e Bearer token se disponibile
        const headers: Record<string, string> = {
          'X-API-Key': config.public.apiKey as string
        }

        // Aggiungi token se autenticato (per filtrare i centri accessibili)
        let authToken = authStore.token
        if (!authToken && typeof localStorage !== 'undefined') {
          authToken = localStorage.getItem('auth_token')
        }
        if (authToken) {
          headers['Authorization'] = `Bearer ${authToken}`
        }

        const response = await $fetch<{ success: boolean; data: Centro[] }>(
          `${config.public.apiBase}/centri`,
          { headers }
        )

        if (response.success) {
          this.centri = response.data
          // Dopo aver caricato i centri, prova a inizializzare da localStorage
          this.initFromStorage()
        }
      } catch (error) {
        console.error('Errore fetch centri:', error)
      } finally {
        this.loading = false
      }
    },

    async initFromAuth() {
      const authStore = useAuthStore()

      // Se abbiamo i dati dall'auth, usiamo quelli
      if (authStore.centriAccessibili && authStore.centriAccessibili.length > 0) {
        this.centri = authStore.centriAccessibili
      }

      // Imposta il centro corrente da auth
      if (authStore.currentCentroId) {
        const centro = this.centri.find(c => c.id === authStore.currentCentroId)
        if (centro) {
          this.centroCorrente = centro
          return
        }
      }

      // Fallback al primo centro disponibile
      if (this.centri.length > 0 && !this.centroCorrente) {
        this.centroCorrente = this.centri[0]
      }
    },

    async setCentro(centroId: number) {
      const config = useRuntimeConfig()
      const authStore = useAuthStore()

      // Verifica che il centro esista nella lista
      const centro = this.centri.find(c => c.id === centroId)
      if (!centro) {
        console.error('Centro non trovato:', centroId)
        return false
      }

      this.loading = true

      try {
        // Sincronizza con il backend
        if (authStore.token) {
          await $fetch(`${config.public.apiBase}/user/set-current-centro`, {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${authStore.token}`,
              'Content-Type': 'application/json'
            },
            body: { centro_id: centroId }
          })
        }

        // Aggiorna lo stato locale
        this.centroCorrente = centro

        // Salva anche in localStorage come backup
        if (typeof localStorage !== 'undefined') {
          localStorage.setItem('centro_id', String(centroId))
        }

        // Ricarica la pagina per aggiornare tutti i dati
        if (typeof window !== 'undefined') {
          window.location.reload()
        }

        return true
      } catch (error) {
        console.error('Errore cambio centro:', error)

        // Fallback: imposta comunque localmente
        this.centroCorrente = centro
        if (typeof localStorage !== 'undefined') {
          localStorage.setItem('centro_id', String(centroId))
        }

        return false
      } finally {
        this.loading = false
      }
    },

    initFromStorage() {
      if (typeof localStorage !== 'undefined') {
        const savedId = localStorage.getItem('centro_id')
        if (savedId && this.centri.length > 0) {
          const centro = this.centri.find(c => c.id === parseInt(savedId))
          if (centro) {
            this.centroCorrente = centro
          }
        }
      }
    }
  }
})
