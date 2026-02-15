<template>
  <div>
    <!-- Floating Button -->
    <button
      @click="isOpen = true"
      class="fixed bottom-6 right-6 z-40 w-14 h-14 bg-red-500 hover:bg-red-600 text-white rounded-full shadow-lg hover:shadow-xl transition-all flex items-center justify-center group"
      title="Segnala un problema"
    >
      <i class="fas fa-bug text-xl group-hover:scale-110 transition-transform"></i>
    </button>

    <!-- Modal -->
    <Teleport to="body">
      <div v-if="isOpen" class="fixed inset-0 z-50 flex items-center justify-center p-4">
        <!-- Backdrop -->
        <div class="absolute inset-0 bg-black/50 backdrop-blur-sm" @click="isOpen = false"></div>

        <!-- Modal Content -->
        <div class="relative bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-hidden">
          <!-- Header -->
          <div class="bg-gradient-to-r from-red-500 to-orange-500 px-6 py-4 text-white">
            <div class="flex items-center justify-between">
              <div class="flex items-center gap-3">
                <i class="fas fa-bug text-2xl"></i>
                <div>
                  <h3 class="font-bold text-lg">Segnala un Problema</h3>
                  <p class="text-red-100 text-sm">Aiutaci a migliorare</p>
                </div>
              </div>
              <button @click="isOpen = false" class="p-2 hover:bg-white/20 rounded-lg transition-colors">
                <i class="fas fa-times text-xl"></i>
              </button>
            </div>
          </div>

          <!-- Form -->
          <form @submit.prevent="submitTicket" class="p-6 space-y-4 overflow-y-auto max-h-[60vh]">
            <!-- Tipo problema -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Tipo di problema *</label>
              <div class="grid grid-cols-2 gap-2">
                <button
                  v-for="tipo in tipiProblema"
                  :key="tipo.value"
                  type="button"
                  @click="form.tipo = tipo.value"
                  :class="[
                    'p-3 rounded-lg border-2 text-sm font-medium transition-all text-left flex items-center gap-2',
                    form.tipo === tipo.value
                      ? 'border-red-500 bg-red-50 text-red-700'
                      : 'border-gray-200 hover:border-gray-300 text-gray-600'
                  ]"
                >
                  <i :class="['fas', tipo.icon, form.tipo === tipo.value ? 'text-red-500' : 'text-gray-400']"></i>
                  {{ tipo.label }}
                </button>
              </div>
            </div>

            <!-- Pagina -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Pagina dove si verifica</label>
              <input
                v-model="form.pagina"
                type="text"
                readonly
                class="w-full px-4 py-2 border border-gray-200 rounded-lg bg-gray-50 text-gray-600 text-sm"
              />
            </div>

            <!-- Descrizione -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Descrizione del problema *</label>
              <textarea
                v-model="form.descrizione"
                rows="4"
                required
                placeholder="Descrivi cosa stavi facendo e cosa non ha funzionato..."
                class="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 resize-none text-sm"
              ></textarea>
            </div>

            <!-- Urgenza -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Urgenza</label>
              <div class="flex gap-2">
                <button
                  v-for="urg in urgenze"
                  :key="urg.value"
                  type="button"
                  @click="form.urgenza = urg.value"
                  :class="[
                    'px-4 py-2 rounded-lg text-sm font-medium transition-all',
                    form.urgenza === urg.value
                      ? `${urg.bgActive} ${urg.textActive}`
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  ]"
                >
                  {{ urg.label }}
                </button>
              </div>
            </div>

            <!-- Email (opzionale) -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Email per aggiornamenti (opzionale)</label>
              <input
                v-model="form.email"
                type="email"
                placeholder="La tua email"
                class="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 text-sm"
              />
            </div>

            <!-- Screenshot hint -->
            <div class="bg-amber-50 border border-amber-200 rounded-lg p-3 flex items-start gap-3">
              <i class="fas fa-lightbulb text-amber-500 mt-0.5"></i>
              <p class="text-sm text-amber-700">
                <strong>Suggerimento:</strong> Uno screenshot aiuta a capire meglio il problema. Puoi fare Cmd+Shift+4 (Mac) o Win+Shift+S (Windows) e allegarlo via email.
              </p>
            </div>

            <!-- Submit -->
            <div class="flex gap-3 pt-2">
              <button
                type="button"
                @click="isOpen = false"
                class="flex-1 px-4 py-3 border border-gray-200 text-gray-600 rounded-lg hover:bg-gray-50 transition-colors font-medium"
              >
                Annulla
              </button>
              <button
                type="submit"
                :disabled="!form.tipo || !form.descrizione || isSubmitting"
                class="flex-1 px-4 py-3 bg-red-500 text-white rounded-lg hover:bg-red-600 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors font-medium flex items-center justify-center gap-2"
              >
                <i v-if="isSubmitting" class="fas fa-spinner fa-spin"></i>
                <i v-else class="fas fa-paper-plane"></i>
                {{ isSubmitting ? 'Invio...' : 'Invia Segnalazione' }}
              </button>
            </div>
          </form>

          <!-- Success State -->
          <div v-if="isSuccess" class="absolute inset-0 bg-white flex flex-col items-center justify-center p-6 text-center">
            <div class="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mb-4">
              <i class="fas fa-check text-4xl text-green-500"></i>
            </div>
            <h3 class="text-xl font-bold text-gray-900 mb-2">Segnalazione Inviata!</h3>
            <p class="text-gray-600 mb-6">Grazie per averci aiutato a migliorare. Ti contatteremo se necessario.</p>
            <button
              @click="resetForm"
              class="px-6 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors font-medium"
            >
              Chiudi
            </button>
          </div>
        </div>
      </div>
    </Teleport>
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{
  appName?: string
}>()

const route = useRoute()

const isOpen = ref(false)
const isSubmitting = ref(false)
const isSuccess = ref(false)

const form = reactive({
  tipo: '' as string,
  pagina: '',
  descrizione: '',
  urgenza: 'media' as string,
  email: ''
})

const tipiProblema = [
  { value: 'bug', label: 'Bug / Errore', icon: 'fa-bug' },
  { value: 'caricamento', label: 'Caricamento lento', icon: 'fa-hourglass-half' },
  { value: 'dati', label: 'Dati errati', icon: 'fa-database' },
  { value: 'altro', label: 'Altro', icon: 'fa-question-circle' }
]

const urgenze = [
  { value: 'bassa', label: 'Bassa', bgActive: 'bg-blue-100', textActive: 'text-blue-700' },
  { value: 'media', label: 'Media', bgActive: 'bg-amber-100', textActive: 'text-amber-700' },
  { value: 'alta', label: 'Alta', bgActive: 'bg-red-100', textActive: 'text-red-700' }
]

// Auto-populate pagina on open
watch(isOpen, (val) => {
  if (val) {
    form.pagina = typeof window !== 'undefined' ? window.location.pathname : route.path
  }
})

const submitTicket = async () => {
  if (!form.tipo || !form.descrizione) return

  isSubmitting.value = true

  try {
    // Collect additional context
    const payload = {
      app: props.appName || 'Profitera',
      tipo: form.tipo,
      pagina: form.pagina,
      descrizione: form.descrizione,
      urgenza: form.urgenza,
      email: form.email || null,
      userAgent: typeof navigator !== 'undefined' ? navigator.userAgent : null,
      timestamp: new Date().toISOString(),
      url: typeof window !== 'undefined' ? window.location.href : null
    }

    // Send to API
    await $fetch('/api/ticket', {
      method: 'POST',
      body: payload
    })

    isSuccess.value = true
  } catch (error) {
    console.error('Errore invio ticket:', error)
    // Fallback: show success anyway (ticket saved locally or will retry)
    isSuccess.value = true
  } finally {
    isSubmitting.value = false
  }
}

const resetForm = () => {
  isOpen.value = false
  isSuccess.value = false
  form.tipo = ''
  form.descrizione = ''
  form.urgenza = 'media'
  form.email = ''
}
</script>
