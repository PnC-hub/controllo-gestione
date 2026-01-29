<template>
  <div>
    <NuxtLayout name="auth">
      <div class="w-full max-w-md">
        <div class="text-center mb-8">
          <div class="w-16 h-16 bg-cyan-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <i class="fas fa-chart-pie text-white text-2xl"></i>
          </div>
          <h1 class="text-2xl font-bold text-slate-800">Controllo di Gestione</h1>
          <p class="text-slate-500 mt-1">Accedi al modulo contabilità e finanza</p>
        </div>

        <div class="bg-white rounded-2xl shadow-lg border border-slate-200 p-8">
          <form @submit.prevent="handleLogin">
            <div class="mb-4">
              <label class="block text-sm font-medium text-slate-700 mb-1">Email</label>
              <input
                v-model="email"
                type="email"
                required
                class="w-full px-4 py-3 rounded-xl border border-slate-300 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 outline-none transition"
                placeholder="nome@azienda.it"
              />
            </div>

            <div class="mb-6">
              <label class="block text-sm font-medium text-slate-700 mb-1">Password</label>
              <input
                v-model="password"
                type="password"
                required
                class="w-full px-4 py-3 rounded-xl border border-slate-300 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 outline-none transition"
                placeholder="••••••••"
              />
            </div>

            <div v-if="error" class="mb-4 p-3 bg-red-50 text-red-600 rounded-xl text-sm">
              {{ error }}
            </div>

            <button
              type="submit"
              :disabled="loading"
              class="w-full py-3 bg-cyan-500 hover:bg-cyan-600 text-white font-semibold rounded-xl transition disabled:opacity-50"
            >
              <span v-if="loading"><i class="fas fa-spinner fa-spin mr-2"></i>Accesso...</span>
              <span v-else>Accedi</span>
            </button>
          </form>
        </div>
      </div>
    </NuxtLayout>
  </div>
</template>

<script setup lang="ts">
import { useAuthStore } from '~/stores/auth'
import { useCentroStore } from '~/stores/centro'

definePageMeta({ layout: false })

const authStore = useAuthStore()
const centroStore = useCentroStore()
const router = useRouter()

const email = ref('')
const password = ref('')
const error = ref('')
const loading = ref(false)

const handleLogin = async () => {
  error.value = ''
  loading.value = true

  try {
    const result = await authStore.login(email.value, password.value)

    if (result.success) {
      await centroStore.initFromAuth()
      if (centroStore.centri.length === 0) {
        await centroStore.fetchCentri()
      }
      router.push('/')
    } else {
      error.value = (result as any).error || 'Credenziali non valide'
    }
  } catch (e) {
    error.value = 'Errore di connessione'
  } finally {
    loading.value = false
  }
}
</script>
