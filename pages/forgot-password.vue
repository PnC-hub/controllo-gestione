<template>
  <div>
    <NuxtLayout name="auth">
      <div class="w-full max-w-md">
        <div class="text-center mb-8">
          <div class="bg-emerald-600 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <i class="fas fa-lock text-white text-2xl"></i>
          </div>
          <h1 class="text-2xl font-bold text-slate-800">Reset Password</h1>
          <p class="text-slate-500 mt-1">Recupera l'accesso al tuo account</p>
        </div>

        <div class="bg-white rounded-2xl shadow-lg border border-slate-200 p-8">
          <!-- Success -->
          <div v-if="resetSuccess" class="text-center">
            <div class="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <i class="fas fa-check text-2xl text-emerald-600"></i>
            </div>
            <h2 class="text-xl font-semibold text-slate-800 mb-2">Password aggiornata!</h2>
            <p class="text-slate-500 mb-6">Puoi ora accedere con la nuova password.</p>
            <NuxtLink
              to="/login"
              class="inline-block w-full py-3 bg-emerald-500 hover:bg-emerald-600 text-white font-semibold rounded-xl transition text-center"
            >
              Vai al login
            </NuxtLink>
          </div>

          <!-- Step 2: OTP + New Password -->
          <div v-else-if="step === 'reset'">
            <button @click="step = 'email'; error = ''" class="mb-6 text-slate-500 hover:text-slate-700 flex items-center text-sm">
              <i class="fas fa-arrow-left mr-2"></i>Indietro
            </button>

            <p class="text-sm text-slate-600 mb-4">
              Abbiamo inviato un codice a <span class="font-medium">{{ email }}</span>
            </p>

            <form @submit.prevent="handleReset">
              <div class="mb-4">
                <label class="block text-sm font-medium text-slate-700 mb-1">Codice OTP</label>
                <input
                  v-model="otp"
                  type="text"
                  maxlength="6"
                  pattern="[0-9]*"
                  inputmode="numeric"
                  required
                  class="w-full text-center text-xl tracking-[0.4em] py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none"
                  placeholder="000000"
                />
              </div>

              <div class="mb-4">
                <label class="block text-sm font-medium text-slate-700 mb-1">Nuova Password</label>
                <input
                  v-model="newPassword"
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
                  v-model="confirmPassword"
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
                :disabled="loading || otp.length !== 6"
                class="w-full py-3 bg-emerald-500 hover:bg-emerald-600 text-white font-semibold rounded-xl transition disabled:opacity-50"
              >
                <span v-if="loading"><i class="fas fa-spinner fa-spin mr-2"></i>Aggiornamento...</span>
                <span v-else>Aggiorna Password</span>
              </button>
            </form>
          </div>

          <!-- Step 1: Email -->
          <form v-else @submit.prevent="handleForgot">
            <p class="text-sm text-slate-600 mb-6">
              Inserisci la tua email e ti invieremo un codice per reimpostare la password.
            </p>

            <div class="mb-6">
              <label class="block text-sm font-medium text-slate-700 mb-1">Email</label>
              <input
                v-model="email"
                type="email"
                required
                class="w-full px-4 py-3 rounded-xl border border-slate-300 outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20"
                placeholder="la-tua@email.it"
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
              <span v-if="loading"><i class="fas fa-spinner fa-spin mr-2"></i>Invio...</span>
              <span v-else>Invia codice di reset</span>
            </button>

            <p class="text-center text-sm text-slate-500 mt-4">
              <NuxtLink to="/login" class="text-emerald-600 hover:text-emerald-700 font-medium">
                <i class="fas fa-arrow-left mr-1"></i>Torna al login
              </NuxtLink>
            </p>
          </form>
        </div>
      </div>
    </NuxtLayout>
  </div>
</template>

<script setup lang="ts">
definePageMeta({ layout: false })

const email = ref('')
const otp = ref('')
const newPassword = ref('')
const confirmPassword = ref('')
const error = ref('')
const loading = ref(false)
const step = ref<'email' | 'reset'>('email')
const resetSuccess = ref(false)

const handleForgot = async () => {
  error.value = ''
  loading.value = true

  try {
    await $fetch('/api/auth/forgot-password', {
      method: 'POST',
      body: { email: email.value }
    })
    step.value = 'reset'
  } catch (e: any) {
    error.value = e.data?.message || 'Errore durante l\'invio'
  } finally {
    loading.value = false
  }
}

const handleReset = async () => {
  error.value = ''

  if (newPassword.value !== confirmPassword.value) {
    error.value = 'Le password non coincidono'
    return
  }

  if (newPassword.value.length < 8) {
    error.value = 'La password deve avere almeno 8 caratteri'
    return
  }

  loading.value = true

  try {
    const response = await $fetch<{ success: boolean }>('/api/auth/reset-password', {
      method: 'POST',
      body: {
        email: email.value,
        otp: otp.value,
        newPassword: newPassword.value
      }
    })

    if (response.success) {
      resetSuccess.value = true
    }
  } catch (e: any) {
    error.value = e.data?.message || 'Codice non valido o scaduto'
  } finally {
    loading.value = false
  }
}
</script>
