import { defineStore } from 'pinia'
import { getApiBaseFromDomain } from '~/utils/apiConfig'

interface User {
  id: number
  nome: string
  cognome: string
  email: string
  ruolo: string
  tenant_id: number
  tenant_nome: string
  gruppo?: {
    id: number
    nome: string
  } | null
}

interface TwoFactorState {
  required: boolean
  sessionToken: string | null
  cellulare: string | null
  otpSentAt: string | null
  userEmail: string | null
}

interface CentroAccessibile {
  id: number
  nome: string
  citta?: string
}

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: null as User | null,
    token: null as string | null,
    isAuthenticated: false,
    currentCentroId: null as number | null,
    centriAccessibili: [] as CentroAccessibile[],
    permissions: [] as string[],
    // 2FA State
    twoFactor: {
      required: false,
      sessionToken: null,
      cellulare: null,
      otpSentAt: null,
      userEmail: null
    } as TwoFactorState
  }),

  getters: {
    fullName: (state) => state.user ? `${state.user.nome} ${state.user.cognome}` : '',
    userInitials: (state) => state.user ? `${state.user.nome[0]}${state.user.cognome[0]}` : '',
    tenantName: (state) => state.user?.tenant_nome || '',

    /**
     * Verifica se l'utente ha un permesso specifico.
     * Accetta formato: "CODICE" oppure "CODICE.power"
     * Es: "PAZIENTI", "PAZIENTI.view", "FATTURE.edit"
     */
    hasPermission: (state) => (permission: string): boolean => {
      if (!permission) return true // Se non richiesto, sempre visibile

      // Admin ha sempre tutti i permessi
      if (state.user?.ruolo === 'admin') return true

      // Controlla permesso esatto
      if (state.permissions.includes(permission.toUpperCase())) return true

      // Se il permesso richiesto non ha suffisso (es: "PAZIENTI"),
      // controlla se esiste almeno il view power (es: "PAZIENTI.view")
      if (!permission.includes('.')) {
        return state.permissions.includes(permission.toUpperCase() + '.view')
      }

      return false
    },

    /**
     * Verifica multipli permessi (OR logic)
     */
    hasAnyPermission: (state) => (permissions: string[]): boolean => {
      if (!permissions || permissions.length === 0) return true
      if (state.user?.ruolo === 'admin') return true

      return permissions.some(p => {
        const pUpper = p.toUpperCase()
        if (state.permissions.includes(pUpper)) return true
        if (!p.includes('.')) {
          return state.permissions.includes(pUpper + '.view')
        }
        return false
      })
    }
  },

  actions: {
    setUser(user: User) {
      this.user = user
      this.isAuthenticated = true
    },

    setToken(token: string) {
      this.token = token
      if (typeof localStorage !== 'undefined') {
        localStorage.setItem('auth_token', token)
      }
    },

    setPermissions(permissions: string[]) {
      this.permissions = permissions.map(p => p.toUpperCase())
    },

    async login(email: string, password: string) {
      const config = useRuntimeConfig()
      const apiBase = getApiBaseFromDomain(config.public.apiBase as string)

      try {
        // Usa URLSearchParams per form-data (workaround server JSON issue)
        const formData = new URLSearchParams()
        formData.append('email', email)
        formData.append('password', password)

        const response = await $fetch<{ success: boolean; token: string; user: any; tenant: any; requires_2fa?: boolean; session_token?: string; cellulare_masked?: string; otp_sent_at?: string }>(`${apiBase}/auth/login`, {
          method: 'POST',
          headers: {
            'X-API-Key': config.public.apiKey,
            'Content-Type': 'application/x-www-form-urlencoded',
            'Accept': 'application/json'
          },
          body: formData.toString()
        })

        // Check if 2FA is required
        if (response.requires_2fa) {
          this.twoFactor = {
            required: true,
            sessionToken: response.session_token || null,
            cellulare: response.cellulare_masked || null,
            otpSentAt: response.otp_sent_at || null,
            userEmail: email // Salva email per mostrare a chi stiamo inviando
          }
          return { success: true, requires2fa: true }
        }

        // Normal login flow
        this.setToken(response.token)
        // Mappa i dati utente includendo tenant info
        const userData: User = {
          id: response.user.id,
          nome: response.user.nome,
          cognome: response.user.cognome,
          email: response.user.email,
          ruolo: response.user.ruolo,
          tenant_id: response.tenant?.id || 0,
          tenant_nome: response.tenant?.nome || '',
          gruppo: response.user.gruppo
        }
        this.setUser(userData)

        // Gestione permessi
        if ((response as any).permissions) {
          this.setPermissions((response as any).permissions)
        }

        // Gestione centro corrente e centri accessibili
        if ((response as any).current_centro_id) {
          this.currentCentroId = (response as any).current_centro_id
        }
        if ((response as any).centri_accessibili) {
          this.centriAccessibili = (response as any).centri_accessibili
        }

        // Reset 2FA state
        this.twoFactor = { required: false, sessionToken: null, cellulare: null, otpSentAt: null, userEmail: null }

        return { success: true }
      } catch (error: any) {
        return {
          success: false,
          error: error.data?.message || 'Errore durante il login'
        }
      }
    },

    async verify2fa(otp: string, trustDevice: boolean = false) {
      const config = useRuntimeConfig()
      const apiBase = getApiBaseFromDomain(config.public.apiBase as string)

      if (!this.twoFactor.sessionToken) {
        return { success: false, error: 'Sessione 2FA non valida' }
      }

      try {
        const response = await $fetch<{ success: boolean; token: string; user: any; tenant: any }>(`${apiBase}/auth/2fa/verifica`, {
          method: 'POST',
          headers: {
            'X-API-Key': config.public.apiKey,
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          },
          body: JSON.stringify({
            otp,
            session_token: this.twoFactor.sessionToken,
            trust_device: trustDevice
          })
        })

        if (!response.success) {
          return { success: false, error: 'Codice OTP non valido' }
        }

        // Complete login
        this.setToken(response.token)
        const userData: User = {
          id: response.user.id,
          nome: response.user.nome,
          cognome: response.user.cognome,
          email: response.user.email,
          ruolo: response.user.ruolo,
          tenant_id: (response as any).tenant?.id || 0,
          tenant_nome: (response as any).tenant?.nome || '',
          gruppo: response.user.gruppo
        }
        this.setUser(userData)

        if ((response as any).permissions) {
          this.setPermissions((response as any).permissions)
        }
        if ((response as any).current_centro_id) {
          this.currentCentroId = (response as any).current_centro_id
        }
        if ((response as any).centri_accessibili) {
          this.centriAccessibili = (response as any).centri_accessibili
        }

        // Reset 2FA state
        this.twoFactor = { required: false, sessionToken: null, cellulare: null, otpSentAt: null, userEmail: null }

        return { success: true }
      } catch (error: any) {
        return {
          success: false,
          error: error.data?.message || 'Codice OTP non valido'
        }
      }
    },

    async resend2faOtp() {
      const config = useRuntimeConfig()
      const apiBase = getApiBaseFromDomain(config.public.apiBase as string)

      if (!this.twoFactor.sessionToken) {
        return { success: false, error: 'Sessione 2FA non valida' }
      }

      try {
        const response = await $fetch<{ success: boolean; otp_sent_at: string }>(`${apiBase}/auth/2fa/reinvia`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${this.twoFactor.sessionToken}`,
            'X-API-Key': config.public.apiKey,
            'Accept': 'application/json'
          }
        })

        if (response.success) {
          this.twoFactor.otpSentAt = response.otp_sent_at
        }

        return { success: response.success }
      } catch (error: any) {
        return {
          success: false,
          error: error.data?.message || 'Impossibile reinviare il codice'
        }
      }
    },

    async useRecoveryCode(code: string) {
      const config = useRuntimeConfig()
      const apiBase = getApiBaseFromDomain(config.public.apiBase as string)

      if (!this.twoFactor.sessionToken) {
        return { success: false, error: 'Sessione 2FA non valida' }
      }

      try {
        const response = await $fetch<{ success: boolean; token: string; user: any; tenant: any; recovery_codes_remaining: number }>(`${apiBase}/auth/2fa/recovery`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${this.twoFactor.sessionToken}`,
            'X-API-Key': config.public.apiKey,
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          },
          body: JSON.stringify({ recovery_code: code })
        })

        if (!response.success) {
          return { success: false, error: 'Codice di recupero non valido' }
        }

        // Complete login
        this.setToken(response.token)
        const userData: User = {
          id: response.user.id,
          nome: response.user.nome,
          cognome: response.user.cognome,
          email: response.user.email,
          ruolo: response.user.ruolo,
          tenant_id: (response as any).tenant?.id || 0,
          tenant_nome: (response as any).tenant?.nome || '',
          gruppo: response.user.gruppo
        }
        this.setUser(userData)

        // Reset 2FA state
        this.twoFactor = { required: false, sessionToken: null, cellulare: null, otpSentAt: null, userEmail: null }

        return { success: true, recoveryCodesRemaining: response.recovery_codes_remaining }
      } catch (error: any) {
        return {
          success: false,
          error: error.data?.message || 'Codice di recupero non valido'
        }
      }
    },

    cancel2fa() {
      this.twoFactor = { required: false, sessionToken: null, cellulare: null, otpSentAt: null, userEmail: null }
    },

    logout() {
      this.user = null
      this.token = null
      this.isAuthenticated = false
      this.currentCentroId = null
      this.centriAccessibili = []
      this.permissions = []
      if (typeof localStorage !== 'undefined') {
        localStorage.removeItem('auth_token')
        localStorage.removeItem('centro_id')
      }
    },

    async checkAuth() {
      if (typeof localStorage === 'undefined') return false

      const token = localStorage.getItem('auth_token')
      if (!token) return false

      const config = useRuntimeConfig()
      const apiBase = getApiBaseFromDomain(config.public.apiBase as string)

      try {
        const response = await $fetch<{ success: boolean; user: any; tenant: any }>(`${apiBase}/auth/me`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'X-API-Key': config.public.apiKey,
            'Accept': 'application/json'
          }
        })

        if (!response.success) {
          this.logout()
          return false
        }

        this.setToken(token)
        const userData: User = {
          id: response.user.id,
          nome: response.user.nome,
          cognome: response.user.cognome,
          email: response.user.email,
          ruolo: response.user.ruolo,
          tenant_id: response.tenant?.id || 0,
          tenant_nome: response.tenant?.nome || '',
          gruppo: response.user.gruppo
        }
        this.setUser(userData)

        // Gestione permessi
        if ((response as any).permissions) {
          this.setPermissions((response as any).permissions)
        }

        // Gestione centro corrente e centri accessibili
        if ((response as any).current_centro_id) {
          this.currentCentroId = (response as any).current_centro_id
        }
        if ((response as any).centri_accessibili) {
          this.centriAccessibili = (response as any).centri_accessibili
        }

        return true
      } catch {
        this.logout()
        return false
      }
    }
  }
})
