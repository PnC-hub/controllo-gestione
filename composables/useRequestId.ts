/**
 * Correlation ID (Request ID) Composable
 *
 * Generates and manages unique request IDs for end-to-end tracing.
 * Format: req_<uuid-v4>
 *
 * Usage:
 *   const { generateRequestId, getCurrentRequestId, setRequestId } = useRequestId()
 *   const requestId = generateRequestId()
 *
 * The request ID follows the flow:
 *   User Action → Frontend (generates ID) → API (receives via header) → Logs
 */

// Store current request ID in a reactive ref (per-request in SSR, global in client)
const currentRequestId = ref<string | null>(null)

export const useRequestId = () => {
  /**
   * Generate a new request ID
   * Format: req_xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx
   */
  const generateRequestId = (): string => {
    // Use crypto.randomUUID if available (modern browsers/Node 19+)
    if (typeof crypto !== 'undefined' && crypto.randomUUID) {
      return `req_${crypto.randomUUID()}`
    }

    // Fallback for older environments
    const uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
      const r = (Math.random() * 16) | 0
      const v = c === 'x' ? r : (r & 0x3) | 0x8
      return v.toString(16)
    })
    return `req_${uuid}`
  }

  /**
   * Get current request ID (or generate new one)
   */
  const getCurrentRequestId = (): string => {
    if (!currentRequestId.value) {
      currentRequestId.value = generateRequestId()
    }
    return currentRequestId.value
  }

  /**
   * Set request ID (e.g., from server response header)
   */
  const setRequestId = (id: string): void => {
    currentRequestId.value = id
  }

  /**
   * Clear current request ID (for new request chain)
   */
  const clearRequestId = (): void => {
    currentRequestId.value = null
  }

  /**
   * Get request ID header object for fetch calls
   */
  const getRequestIdHeader = (): Record<string, string> => {
    return {
      'X-Request-ID': getCurrentRequestId()
    }
  }

  return {
    generateRequestId,
    getCurrentRequestId,
    setRequestId,
    clearRequestId,
    getRequestIdHeader,
    // Expose reactive ref for components that need to watch it
    currentRequestId: readonly(currentRequestId)
  }
}
