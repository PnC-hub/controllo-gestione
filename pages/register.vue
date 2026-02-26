<template>
  <div>
    <NuxtLayout name="auth">
      <div class="w-full max-w-md">
        <div class="text-center mb-8">
          <div class="bg-emerald-600 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <i class="fas fa-chart-line text-white text-2xl"></i>
          </div>
          <h1 class="text-2xl font-bold text-slate-800">Profitera</h1>
          <p class="text-slate-500 mt-1">Crea il tuo account</p>
        </div>

        <div class="bg-white rounded-2xl shadow-lg border border-slate-200 p-8">
          <div v-if="success" class="text-center">
            <div class="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <i class="fas fa-check text-2xl text-emerald-600"></i>
            </div>
            <h2 class="text-xl font-semibold text-slate-800 mb-2">Registrazione completata!</h2>
            <p class="text-slate-500 mb-6">Puoi ora effettuare il login con le tue credenziali.</p>
            <NuxtLink
              to="/login"
              class="inline-block w-full py-3 bg-emerald-500 hover:bg-emerald-600 text-white font-semibold rounded-xl transition text-center"
            >
              Vai al login
            </NuxtLink>
          </div>

          <form v-else @submit.prevent="handleRegister">
            <div class="grid grid-cols-2 gap-4 mb-4">
              <div>
                <label class="block text-sm font-medium text-slate-700 mb-1">Nome</label>
                <input
                  v-model="form.nome"
                  type="text"
                  required
                  class="w-full px-4 py-3 rounded-xl border border-slate-300 outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20"
                  placeholder="Mario"
                />
              </div>
              <div>
                <label class="block text-sm font-medium text-slate-700 mb-1">Cognome</label>
                <input
                  v-model="form.cognome"
                  type="text"
                  required
                  class="w-full px-4 py-3 rounded-xl border border-slate-300 outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20"
                  placeholder="Rossi"
                />
              </div>
            </div>

            <div class="mb-4">
              <label class="block text-sm font-medium text-slate-700 mb-1">Email</label>
              <input
                v-model="form.email"
                type="email"
                required
                class="w-full px-4 py-3 rounded-xl border border-slate-300 outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20"
                placeholder="mario@azienda.it"
              />
            </div>

            <div class="mb-4">
              <label class="block text-sm font-medium text-slate-700 mb-1">Password</label>
              <input
                v-model="form.password"
                type="password"
                required
                minlength="8"
                class="w-full px-4 py-3 rounded-xl border border-slate-300 outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20"
                placeholder="Minimo 8 caratteri"
              />
            </div>

            <div class="mb-6">
              <label class="block text-sm font-medium text-slate-700 mb-1">Conferma Password</label>
              <input
                v-model="form.confirmPassword"
                type="password"
                required
                minlength="8"
                class="w-full px-4 py-3 rounded-xl border border-slate-300 outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20"
                placeholder="Ripeti la password"
              />
            </div>

            <div v-if="error" class="mb-4 p-3 bg-red-50 text-red-600 rounded-xl text-sm">
              <i class="fas fa-exclamation-circle mr-2"></i>{{ error }}
            </div>

            <button
              type="submit"
              :disabled="loading"
              class="w-full py-3 bg-emerald-500 hover:bg-emerald-600 text-white font-semibold rounded-xl transition disabled:opacity-50"
            >
              <span v-if="loading"><i class="fas fa-spinner fa-spin mr-2"></i>Registrazione...</span>
              <span v-else>Registrati</span>
            </button>

            <p class="text-center text-sm text-slate-500 mt-4">
              Hai già un account?
              <NuxtLink to="/login" class="text-emerald-600 hover:text-emerald-700 font-medium">Accedi</NuxtLink>
            </p>
          </form>
        </div>
      </div>
    </NuxtLayout>
  </div>
</template>

<script setup lang="ts">
definePageMeta({ layout: false })

const form = reactive({
  nome: '',
  cognome: '',
  email: '',
  password: '',
  confirmPassword: ''
})

const error = ref('')
const loading = ref(false)
const success = ref(false)

const handleRegister = async () => {
  error.value = ''

  if (form.password !== form.confirmPassword) {
    error.value = 'Le password non coincidono'
    return
  }

  if (form.password.length < 8) {
    error.value = 'La password deve avere almeno 8 caratteri'
    return
  }

  loading.value = true

  try {
    const response = await $fetch<{ success: boolean; message?: string }>('/api/auth/register', {
      method: 'POST',
      body: {
        nome: form.nome,
        cognome: form.cognome,
        email: form.email,
        password: form.password
      }
    })

    if (response.success) {
      success.value = true
    }
  } catch (e: any) {
    error.value = e.data?.message || 'Errore durante la registrazione'
  } finally {
    loading.value = false
  }
}
</script>
