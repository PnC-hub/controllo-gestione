import { useAuthStore } from '~/stores/auth'
import { useCentroStore } from '~/stores/centro'
import { routePermissions } from '~/config/menu.config'

export default defineNuxtRouteMiddleware(async (to, from) => {
  // Pagine pubbliche - non applicare middleware
  const publicPages = ['/login', '/unauthorized', '/403', '/vendita', '/landing-profitera', '/landing-geniusmile']
  if (publicPages.includes(to.path)) {
    return
  }

  const authStore = useAuthStore()
  const centroStore = useCentroStore()

  // Se non autenticato, verifica il token in localStorage
  if (!authStore.isAuthenticated) {
    const isValid = await authStore.checkAuth()

    if (!isValid) {
      // Se sta andando alla root, mostra la landing invece del login
      if (to.path === '/') {
        const hostname = typeof window !== 'undefined' ? window.location.hostname : ''
        const isProfitera = hostname.includes('profitera')
        return navigateTo(isProfitera ? '/landing-profitera' : '/landing-geniusmile')
      }
      return navigateTo('/login')
    }
  }

  // Dopo autenticazione valida, inizializza il centro se necessario
  if (authStore.isAuthenticated && !centroStore.centroCorrente) {
    // Prima prova a caricare da auth (contiene centriAccessibili dal login/checkAuth)
    await centroStore.initFromAuth()

    // Se ancora non c'è il centro, prova da localStorage
    if (!centroStore.centroCorrente) {
      // Se non abbiamo i centri, caricali prima
      if (centroStore.centri.length === 0) {
        await centroStore.fetchCentri()
      }
      centroStore.initFromStorage()
    }

    // Ultimo fallback: primo centro disponibile
    if (!centroStore.centroCorrente && centroStore.centri.length > 0) {
      centroStore.centroCorrente = centroStore.centri[0]
      if (typeof localStorage !== 'undefined') {
        localStorage.setItem('centro_id', String(centroStore.centri[0].id))
      }
    }
  }

  // ══════════════════════════════════════════════════════════════
  // VERIFICA PERMESSI - DISABILITATA
  // Tutti gli utenti autenticati possono accedere a tutte le pagine
  // ══════════════════════════════════════════════════════════════

  // Basta essere autenticati per accedere a qualsiasi pagina
  // La verifica dei permessi e' stata rimossa su richiesta
  return
})
