import { defineStore } from 'pinia'

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
  emailMasked: string | null
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
      emailMasked: null,
      otpSentAt: null,
      userEmail: null
    } as TwoFactorState
  }),

  getters: {
    fullName: (state) => state.user ? `${state.user.nome} ${state.user.cognome}` : '',
    userInitials: (state) => state.user ? `${state.user.nome[0]}${state.user.cognome[0]}` : '',
    tenantName: (state) => state.user?.tenant_nome || '',

    hasPermission: (state) => (permission: string): boolean => {
      if (!permission) return true
      if (state.user?.ruolo === 'admin') return true
      if (state.permissions.includes(permission.toUpperCase())) return true
      if (!permission.includes('.')) {
        return state.permissions.includes(permission.toUpperCase() + '.view')
      }
      return false
    },

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
      try {
        const response = await $fetch<{
          success: boolean
          token?: string
          user?: any
          requires_2fa?: boolean
          session_token?: string
          email_masked?: string
        }>('/api/auth/login', {
          method: 'POST',
          body: { email, password }
        })

        // 2FA richiesto
        if (response.requires_2fa) {
          this.twoFactor = {
            required: true,
            sessionToken: response.session_token || null,
            emailMasked: response.email_masked || null,
            otpSentAt: new Date().toISOString(),
            userEmail: email
          }
          return { success: true, requires2fa: true }
        }

        // Login diretto
        if (response.token) {
          this.setToken(response.token)
        }
        if (response.user) {
          const userData: User = {
            id: response.user.id,
            nome: response.user.nome,
            cognome: response.user.cognome,
            email: response.user.email,
            ruolo: response.user.ruolo,
            tenant_id: 0,
            tenant_nome: 'Profitera',
            gruppo: null
          }
          this.setUser(userData)
        }

        this.twoFactor = { required: false, sessionToken: null, emailMasked: null, otpSentAt: null, userEmail: null }
        return { success: true }
      } catch (error: any) {
        return {
          success: false,
          error: error.data?.message || 'Errore durante il login'
        }
      }
    },

    async verify2fa(otp: string, _trustDevice: boolean = false) {
      if (!this.twoFactor.sessionToken) {
        return { success: false, error: 'Sessione 2FA non valida' }
      }

      try {
        const response = await $fetch<{
          success: boolean
          token: string
          user: any
        }>('/api/auth/verify-2fa', {
          method: 'POST',
          body: {
            session_token: this.twoFactor.sessionToken,
            otp
          }
        })

        if (!response.success) {
          return { success: false, error: 'Codice OTP non valido' }
        }

        this.setToken(response.token)
        const userData: User = {
          id: response.user.id,
          nome: response.user.nome,
          cognome: response.user.cognome,
          email: response.user.email,
          ruolo: response.user.ruolo,
          tenant_id: 0,
          tenant_nome: 'Profitera',
          gruppo: null
        }
        this.setUser(userData)

        this.twoFactor = { required: false, sessionToken: null, emailMasked: null, otpSentAt: null, userEmail: null }
        return { success: true }
      } catch (error: any) {
        return {
          success: false,
          error: error.data?.message || 'Codice OTP non valido'
        }
      }
    },

    async resend2faOtp() {
      if (!this.twoFactor.sessionToken) {
        return { success: false, error: 'Sessione 2FA non valida' }
      }

      try {
        const response = await $fetch<{
          success: boolean
          otp_sent_at?: string
        }>('/api/auth/resend-otp', {
          method: 'POST',
          body: { session_token: this.twoFactor.sessionToken }
        })

        if (response.success) {
          this.twoFactor.otpSentAt = response.otp_sent_at || new Date().toISOString()
        }

        return { success: response.success }
      } catch (error: any) {
        return {
          success: false,
          error: error.data?.message || 'Impossibile reinviare il codice'
        }
      }
    },

    cancel2fa() {
      this.twoFactor = { required: false, sessionToken: null, emailMasked: null, otpSentAt: null, userEmail: null }
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

      try {
        const response = await $fetch<{
          success: boolean
          user: any
        }>('/api/auth/me', {
          headers: {
            'Authorization': `Bearer ${token}`
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
          tenant_id: 0,
          tenant_nome: 'Profitera',
          gruppo: null
        }
        this.setUser(userData)

        return true
      } catch {
        this.logout()
        return false
      }
    }
  }
})
