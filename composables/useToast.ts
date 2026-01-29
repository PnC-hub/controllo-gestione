/**
 * Composable per mostrare notifiche toast
 * Implementazione semplice senza dipendenze esterne
 */

interface ToastOptions {
  title: string
  description?: string
  color?: 'green' | 'red' | 'amber' | 'blue' | 'gray'
  timeout?: number
}

interface ToastInstance {
  id: number
  title: string
  description?: string
  color: string
  visible: boolean
}

// Stato globale dei toast
const toasts = ref<ToastInstance[]>([])
let toastId = 0

export function useToast() {
  const add = (options: ToastOptions) => {
    const id = ++toastId
    const toast: ToastInstance = {
      id,
      title: options.title,
      description: options.description,
      color: options.color || 'gray',
      visible: true
    }

    toasts.value.push(toast)

    // Auto-remove dopo timeout
    setTimeout(() => {
      remove(id)
    }, options.timeout || 5000)

    // Mostra anche come console.log per debug
    const emoji = options.color === 'green' ? '✅' : options.color === 'red' ? '❌' : 'ℹ️'
    console.log(`${emoji} Toast: ${options.title}${options.description ? ' - ' + options.description : ''}`)

    return toast
  }

  const remove = (id: number) => {
    const index = toasts.value.findIndex(t => t.id === id)
    if (index > -1) {
      toasts.value.splice(index, 1)
    }
  }

  const clear = () => {
    toasts.value = []
  }

  return {
    add,
    remove,
    clear,
    toasts: readonly(toasts)
  }
}
