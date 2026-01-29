import { useCentroStore } from '~/stores/centro'
import { useAuthStore } from '~/stores/auth'
import { useRequestId } from '~/composables/useRequestId'
import { getApiBaseFromDomain } from '~/utils/apiConfig'

export const useApi = () => {
  const config = useRuntimeConfig()
  const apiBase = getApiBaseFromDomain(config.public.apiBase as string)
  const apiKey = config.public.apiKey as string

  // Correlation ID for request tracing
  const { generateRequestId, setRequestId } = useRequestId()

  const fetchApi = async <T>(
    endpoint: string,
    options: {
      method?: 'GET' | 'POST' | 'PUT' | 'DELETE'
      body?: Record<string, unknown>
      params?: Record<string, string | number>
      skipCentro?: boolean  // Per endpoint che non richiedono centro_id
    } = {}
  ): Promise<T> => {
    const { method = 'GET', body, params, skipCentro = false } = options

    // Generate unique request ID for this call
    const requestId = generateRequestId()

    // Ottieni centro_id dallo store
    const centroStore = useCentroStore()
    const centroId = centroStore.centroId

    // Ottieni token auth dallo store o da localStorage (fallback per refresh pagina)
    const authStore = useAuthStore()
    let authToken = authStore.token
    if (!authToken && typeof localStorage !== 'undefined') {
      authToken = localStorage.getItem('auth_token')
    }

    // Separa endpoint e query string esistente
    const [basePath, existingQuery] = endpoint.split('?')
    let url = `${apiBase}${basePath}`

    const searchParams = new URLSearchParams(existingQuery || '')

    // Aggiungi centro_id automaticamente (se non escluso)
    if (!skipCentro && centroId) {
      searchParams.set('centro_id', String(centroId))
    }

    // Aggiungi altri parametri
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        searchParams.set(key, String(value))
      })
    }

    if (searchParams.toString()) {
      url += `?${searchParams.toString()}`
    }

    // Costruisci headers con API Key, Bearer token e Request ID
    const headers: Record<string, string> = {
      'X-API-Key': apiKey,
      'X-Request-ID': requestId,
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    }

    // Aggiungi Bearer token se autenticato
    if (authToken) {
      headers['Authorization'] = `Bearer ${authToken}`
    }

    try {
      const response = await $fetch<T>(url, {
        method,
        headers,
        body: body,
        onResponse({ response }) {
          // Capture request ID from response (backend may have generated one)
          const serverRequestId = response.headers.get('X-Request-ID')
          if (serverRequestId) {
            setRequestId(serverRequestId)
          }
        },
        onResponseError({ response }) {
          // Log error with request ID for debugging
          const errorRequestId = response.headers.get('X-Request-ID') || requestId
          console.error(`[API Error] ${method} ${endpoint}`, {
            requestId: errorRequestId,
            status: response.status,
            statusText: response.statusText,
          })
        }
      })

      return response
    } catch (error: unknown) {
      // Enrich error with request ID for debugging
      const enrichedError = error as Error & { requestId?: string }
      enrichedError.requestId = requestId
      throw enrichedError
    }
  }

  return {
    fetchApi,
    apiBase,
    apiKey
  }
}
