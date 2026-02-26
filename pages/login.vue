<template>
  <div>
    <NuxtLayout name="auth">
      <div class="w-full max-w-md">
        <div class="text-center mb-8">
          <div :class="[brand.isProfitera ? 'bg-emerald-600' : 'bg-cyan-600', 'w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4']">
            <i :class="['fas', brand.logo, 'text-white text-2xl']"></i>
          </div>
          <h1 class="text-2xl font-bold text-slate-800">{{ brand.name }}</h1>
          <p class="text-slate-500 mt-1">{{ brand.tagline }}</p>
        </div>

        <div class="bg-white rounded-2xl shadow-lg border border-slate-200 p-8">
          <!-- 2FA Verification Form -->
          <div v-if="authStore.twoFactor.required">
            <button
              @click="handleCancel2fa"
              class="mb-6 text-slate-500 hover:text-slate-700 flex items-center text-sm"
            >
              <i class="fas fa-arrow-left mr-2"></i>Torna al login
            </button>

            <!-- OTP Form -->
            <div v-if="!showRecoveryForm">
              <div class="text-center mb-6">
                <div :class="[brand.isProfitera ? 'bg-emerald-100' : 'bg-cyan-100', 'w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4']">
                  <i :class="['fas fa-shield-alt text-2xl', brand.isProfitera ? 'text-emerald-600' : 'text-cyan-600']"></i>
                </div>
                <h2 class="text-xl font-semibold text-slate-800">Verifica a due fattori</h2>
                <p v-if="authStore.twoFactor.userEmail" class="text-sm text-slate-600 mt-2">
                  <i class="fas fa-user mr-1"></i>{{ authStore.twoFactor.userEmail }}
                </p>
                <p class="text-slate-500 mt-2">
                  Inserisci il codice a 6 cifre inviato a<br/>
                  <span class="font-medium">{{ authStore.twoFactor.emailMasked || 'la tua email' }}</span>
                </p>
              </div>

              <form @submit.prevent="handleVerify2fa">
                <div class="space-y-6">
                  <div>
                    <label class="block text-sm font-medium text-slate-700 mb-2">Codice OTP</label>
                    <input
                      v-model="otpCode"
                      type="text"
                      maxlength="6"
                      pattern="[0-9]*"
                      inputmode="numeric"
                      autocomplete="one-time-code"
                      class="w-full text-center text-2xl tracking-[0.5em] py-4 border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none"
                      placeholder="000000"
                    />
                  </div>

                  <label class="flex items-center">
                    <input v-model="trustDevice" type="checkbox" class="w-4 h-4 text-emerald-600 border-slate-300 rounded focus:ring-emerald-500" />
                    <span class="ml-2 text-sm text-slate-600">Ricorda questo dispositivo per 14 giorni</span>
                  </label>

                  <div v-if="error" class="p-3 bg-red-50 text-red-600 rounded-xl text-sm">
                    <i class="fas fa-exclamation-circle mr-2"></i>{{ error }}
                  </div>

                  <button
                    type="submit"
                    :disabled="loading || otpCode.length !== 6"
                    :class="[brand.isProfitera ? 'bg-emerald-500 hover:bg-emerald-600' : 'bg-cyan-500 hover:bg-cyan-600', 'w-full py-3 text-white font-semibold rounded-xl transition disabled:opacity-50']"
                  >
                    <span v-if="loading"><i class="fas fa-spinner fa-spin mr-2"></i>Verifica in corso...</span>
                    <span v-else><i class="fas fa-check mr-2"></i>Verifica</span>
                  </button>

                  <div class="text-center">
                    <button
                      type="button"
                      @click="handleResendOtp"
                      :disabled="resendLoading || resendCooldown > 0"
                      :class="['text-sm disabled:text-slate-400', brand.isProfitera ? 'text-emerald-600 hover:text-emerald-700' : 'text-cyan-600 hover:text-cyan-700']"
                    >
                      <span v-if="resendCooldown > 0">Reinvia codice tra {{ resendCooldown }}s</span>
                      <span v-else-if="resendLoading"><i class="fas fa-spinner fa-spin mr-1"></i>Invio...</span>
                      <span v-else><i class="fas fa-redo mr-1"></i>Reinvia codice</span>
                    </button>
                  </div>

                  <div class="text-center border-t pt-4">
                    <p class="text-xs text-slate-400">
                      Non hai ricevuto l'email? Controlla la cartella spam.
                    </p>
                  </div>
                </div>
              </form>
            </div>

            <!-- Recovery Code Form -->
            <div v-else>
              <div class="text-center mb-6">
                <div class="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <i class="fas fa-key text-2xl text-amber-600"></i>
                </div>
                <h2 class="text-xl font-semibold text-slate-800">Codice di recupero</h2>
                <p class="text-slate-500 mt-2">
                  Inserisci uno dei codici di recupero che hai salvato durante la configurazione 2FA
                </p>
              </div>

              <form @submit.prevent="handleUseRecoveryCode">
                <div class="space-y-6">
                  <div>
                    <label class="block text-sm font-medium text-slate-700 mb-2">Codice di recupero</label>
                    <input
                      v-model="recoveryCode"
                      type="text"
                      class="w-full text-center text-lg tracking-wider py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none font-mono"
                      placeholder="xxxx-xxxx"
                    />
                  </div>

                  <div v-if="error" class="p-3 bg-red-50 text-red-600 rounded-xl text-sm">
                    <i class="fas fa-exclamation-circle mr-2"></i>{{ error }}
                  </div>

                  <button
                    type="submit"
                    :disabled="loading || !recoveryCode"
                    class="w-full py-3 bg-amber-500 hover:bg-amber-600 text-white font-semibold rounded-xl transition disabled:opacity-50"
                  >
                    <span v-if="loading"><i class="fas fa-spinner fa-spin mr-2"></i>Verifica in corso...</span>
                    <span v-else><i class="fas fa-unlock mr-2"></i>Usa codice di recupero</span>
                  </button>

                  <div class="text-center">
                    <button
                      type="button"
                      @click="showRecoveryForm = false; recoveryCode = ''; error = ''"
                      class="text-sm text-slate-500 hover:text-slate-700"
                    >
                      <i class="fas fa-arrow-left mr-1"></i>Torna alla verifica OTP
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </div>

          <!-- Login Form -->
          <form v-else @submit.prevent="handleLogin">
            <div class="mb-4">
              <label class="block text-sm font-medium text-slate-700 mb-1">Email</label>
              <input
                v-model="email"
                type="email"
                required
                :class="['w-full px-4 py-3 rounded-xl border border-slate-300 outline-none transition', brand.isProfitera ? 'focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20' : 'focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20']"
                placeholder="nome@azienda.it"
              />
            </div>

            <div class="mb-6">
              <label class="block text-sm font-medium text-slate-700 mb-1">Password</label>
              <input
                v-model="password"
                type="password"
                required
                :class="['w-full px-4 py-3 rounded-xl border border-slate-300 outline-none transition', brand.isProfitera ? 'focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20' : 'focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20']"
                placeholder="••••••••"
              />
            </div>

            <div v-if="error" class="mb-4 p-3 bg-red-50 text-red-600 rounded-xl text-sm">
              {{ error }}
            </div>

            <button
              type="submit"
              :disabled="loading"
              :class="[brand.isProfitera ? 'bg-emerald-500 hover:bg-emerald-600' : 'bg-cyan-500 hover:bg-cyan-600', 'w-full py-3 text-white font-semibold rounded-xl transition disabled:opacity-50']"
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

const brand = useBrand()
const authStore = useAuthStore()
const centroStore = useCentroStore()
const router = useRouter()

const email = ref('')
const password = ref('')
const error = ref('')
const loading = ref(false)

// 2FA state
const otpCode = ref('')
const trustDevice = ref(false)
const showRecoveryForm = ref(false)
const recoveryCode = ref('')
const resendLoading = ref(false)
const resendCooldown = ref(0)

let cooldownInterval: ReturnType<typeof setInterval> | null = null

const handleLogin = async () => {
  error.value = ''
  loading.value = true

  try {
    const result = await authStore.login(email.value, password.value)

    if (result.success) {
      if ((result as any).requires2fa) {
        startResendCooldown()
      } else {
        await centroStore.initFromAuth()
        if (centroStore.centri.length === 0) {
          await centroStore.fetchCentri()
        }
        router.push('/dashboard')
      }
    } else {
      error.value = (result as any).error || 'Credenziali non valide'
    }
  } catch (e) {
    error.value = 'Errore di connessione'
  } finally {
    loading.value = false
  }
}

const handleVerify2fa = async () => {
  loading.value = true
  error.value = ''

  try {
    const result = await authStore.verify2fa(otpCode.value, trustDevice.value)

    if (result.success) {
      await centroStore.initFromAuth()
      if (centroStore.centri.length === 0) {
        await centroStore.fetchCentri()
      }
      router.push('/')
    } else {
      error.value = result.error || 'Codice OTP non valido'
      otpCode.value = ''
    }
  } catch (e: any) {
    error.value = 'Errore durante la verifica. Riprova.'
  } finally {
    loading.value = false
  }
}

const handleResendOtp = async () => {
  resendLoading.value = true
  error.value = ''

  try {
    const result = await authStore.resend2faOtp()

    if (result.success) {
      startResendCooldown()
    } else {
      error.value = result.error || 'Impossibile reinviare il codice'
    }
  } catch (e: any) {
    error.value = 'Errore durante l\'invio. Riprova.'
  } finally {
    resendLoading.value = false
  }
}

const handleUseRecoveryCode = async () => {
  loading.value = true
  error.value = ''

  try {
    const result = await authStore.useRecoveryCode(recoveryCode.value)

    if (result.success) {
      if ((result as any).recoveryCodesRemaining !== undefined && (result as any).recoveryCodesRemaining < 3) {
        alert(`Attenzione: ti rimangono solo ${(result as any).recoveryCodesRemaining} codici di recupero.`)
      }
      await centroStore.initFromAuth()
      if (centroStore.centri.length === 0) {
        await centroStore.fetchCentri()
      }
      router.push('/')
    } else {
      error.value = result.error || 'Codice di recupero non valido'
    }
  } catch (e: any) {
    error.value = 'Errore durante la verifica. Riprova.'
  } finally {
    loading.value = false
  }
}

const handleCancel2fa = () => {
  authStore.cancel2fa()
  otpCode.value = ''
  recoveryCode.value = ''
  showRecoveryForm.value = false
  error.value = ''
  if (cooldownInterval) {
    clearInterval(cooldownInterval)
    cooldownInterval = null
  }
  resendCooldown.value = 0
}

const startResendCooldown = () => {
  resendCooldown.value = 60
  if (cooldownInterval) {
    clearInterval(cooldownInterval)
  }
  cooldownInterval = setInterval(() => {
    resendCooldown.value--
    if (resendCooldown.value <= 0) {
      if (cooldownInterval) {
        clearInterval(cooldownInterval)
        cooldownInterval = null
      }
    }
  }, 1000)
}

onUnmounted(() => {
  if (cooldownInterval) {
    clearInterval(cooldownInterval)
  }
})
</script>
