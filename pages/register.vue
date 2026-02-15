<template>
  <div>
    <NuxtLayout name="auth">
      <div class="w-full max-w-md">
        <div class="text-center mb-8">
          <div class="w-16 h-16 bg-emerald-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <i class="fas fa-chart-pie text-white text-2xl"></i>
          </div>
          <h1 class="text-2xl font-bold text-slate-800">Crea il tuo account Profitera</h1>
          <p class="text-slate-500 mt-1">Inizia la prova gratuita di 14 giorni</p>
        </div>

        <div class="bg-white rounded-2xl shadow-lg border border-slate-200 p-8">
          <form @submit.prevent="handleRegister">
            <!-- Nome e Cognome -->
            <div class="grid grid-cols-2 gap-4 mb-4">
              <div>
                <label class="block text-sm font-medium text-slate-700 mb-1">Nome</label>
                <input
                  v-model="form.firstName"
                  type="text"
                  required
                  class="w-full px-4 py-3 rounded-xl border border-slate-300 focus:border-emerald-600 focus:ring-2 focus:ring-emerald-600/20 outline-none transition"
                  placeholder="Mario"
                />
              </div>
              <div>
                <label class="block text-sm font-medium text-slate-700 mb-1">Cognome</label>
                <input
                  v-model="form.lastName"
                  type="text"
                  required
                  class="w-full px-4 py-3 rounded-xl border border-slate-300 focus:border-emerald-600 focus:ring-2 focus:ring-emerald-600/20 outline-none transition"
                  placeholder="Rossi"
                />
              </div>
            </div>

            <!-- Email -->
            <div class="mb-4">
              <label class="block text-sm font-medium text-slate-700 mb-1">Email aziendale</label>
              <input
                v-model="form.email"
                type="email"
                required
                class="w-full px-4 py-3 rounded-xl border border-slate-300 focus:border-emerald-600 focus:ring-2 focus:ring-emerald-600/20 outline-none transition"
                placeholder="mario.rossi@azienda.it"
              />
            </div>

            <!-- Telefono -->
            <div class="mb-4">
              <label class="block text-sm font-medium text-slate-700 mb-1">Telefono</label>
              <input
                v-model="form.phone"
                type="tel"
                class="w-full px-4 py-3 rounded-xl border border-slate-300 focus:border-emerald-600 focus:ring-2 focus:ring-emerald-600/20 outline-none transition"
                placeholder="+39 333 1234567"
              />
            </div>

            <!-- Nome Azienda -->
            <div class="mb-4">
              <label class="block text-sm font-medium text-slate-700 mb-1">Nome Azienda</label>
              <input
                v-model="form.companyName"
                type="text"
                required
                class="w-full px-4 py-3 rounded-xl border border-slate-300 focus:border-emerald-600 focus:ring-2 focus:ring-emerald-600/20 outline-none transition"
                placeholder="La Mia Azienda Srl"
              />
            </div>

            <!-- Password -->
            <div class="mb-4">
              <label class="block text-sm font-medium text-slate-700 mb-1">Password</label>
              <input
                v-model="form.password"
                type="password"
                required
                minlength="8"
                class="w-full px-4 py-3 rounded-xl border border-slate-300 focus:border-emerald-600 focus:ring-2 focus:ring-emerald-600/20 outline-none transition"
                placeholder="••••••••"
              />
              <p class="text-xs text-slate-500 mt-1">Minimo 8 caratteri</p>
            </div>

            <!-- Conferma Password -->
            <div class="mb-4">
              <label class="block text-sm font-medium text-slate-700 mb-1">Conferma Password</label>
              <input
                v-model="form.confirmPassword"
                type="password"
                required
                minlength="8"
                class="w-full px-4 py-3 rounded-xl border border-slate-300 focus:border-emerald-600 focus:ring-2 focus:ring-emerald-600/20 outline-none transition"
                placeholder="••••••••"
              />
            </div>

            <!-- Piano -->
            <div class="mb-6">
              <label class="block text-sm font-medium text-slate-700 mb-2">Scegli il tuo piano</label>
              <div class="grid grid-cols-3 gap-2">
                <button
                  v-for="plan in plans"
                  :key="plan.value"
                  type="button"
                  @click="form.plan = plan.value"
                  :class="[
                    'px-3 py-2 rounded-lg text-sm font-medium transition border-2',
                    form.plan === plan.value
                      ? 'bg-emerald-600 text-white border-emerald-600'
                      : 'bg-white text-slate-700 border-slate-300 hover:border-emerald-600'
                  ]"
                >
                  {{ plan.label }}
                </button>
              </div>
              <div class="mt-2 text-center">
                <p class="text-lg font-bold text-emerald-600">€{{ selectedPlanPrice }}/mese</p>
                <p class="text-xs text-slate-500">dopo il periodo di prova</p>
              </div>
            </div>

            <!-- Privacy -->
            <div class="mb-6">
              <label class="flex items-start">
                <input
                  v-model="form.acceptTerms"
                  type="checkbox"
                  required
                  class="w-4 h-4 text-emerald-600 border-slate-300 rounded focus:ring-emerald-600 mt-1"
                />
                <span class="ml-2 text-sm text-slate-600">
                  Accetto i <a href="#" class="text-emerald-600 hover:underline">Termini di Servizio</a> e la
                  <a href="#" class="text-emerald-600 hover:underline">Privacy Policy</a>
                </span>
              </label>
            </div>

            <!-- Error Message -->
            <div v-if="error" class="mb-4 p-3 bg-red-50 text-red-600 rounded-xl text-sm">
              <i class="fas fa-exclamation-circle mr-2"></i>{{ error }}
            </div>

            <!-- Success Message -->
            <div v-if="success" class="mb-4 p-3 bg-emerald-50 text-emerald-600 rounded-xl text-sm">
              <i class="fas fa-check-circle mr-2"></i>{{ success }}
            </div>

            <!-- Submit Button -->
            <button
              type="submit"
              :disabled="loading"
              class="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-xl transition disabled:opacity-50 shadow-md"
            >
              <span v-if="loading"><i class="fas fa-spinner fa-spin mr-2"></i>Creazione account...</span>
              <span v-else><i class="fas fa-rocket mr-2"></i>Inizia la prova gratuita</span>
            </button>
          </form>

          <!-- Login Link -->
          <div class="mt-6 text-center text-sm">
            <span class="text-slate-600">Hai già un account? </span>
            <NuxtLink to="/login" class="text-emerald-600 hover:text-emerald-700 font-medium">
              Accedi
            </NuxtLink>
          </div>
        </div>

        <!-- Trust Badges -->
        <div class="mt-8 text-center">
          <div class="flex items-center justify-center gap-6 text-sm text-slate-500">
            <div class="flex items-center gap-2">
              <i class="fas fa-lock text-emerald-600"></i>
              <span>Pagamento sicuro</span>
            </div>
            <div class="flex items-center gap-2">
              <i class="fas fa-shield-alt text-emerald-600"></i>
              <span>Dati protetti</span>
            </div>
            <div class="flex items-center gap-2">
              <i class="fas fa-check-circle text-emerald-600"></i>
              <span>GDPR compliant</span>
            </div>
          </div>
        </div>
      </div>
    </NuxtLayout>
  </div>
</template>

<script setup lang="ts">
definePageMeta({ layout: false })

const router = useRouter()

const form = reactive({
  firstName: '',
  lastName: '',
  email: '',
  phone: '',
  companyName: '',
  password: '',
  confirmPassword: '',
  plan: 'professional',
  acceptTerms: false
})

const plans = [
  { value: 'starter', label: 'Starter', price: 49 },
  { value: 'professional', label: 'Professional', price: 99 },
  { value: 'enterprise', label: 'Enterprise', price: 199 }
]

const selectedPlanPrice = computed(() => {
  const plan = plans.find(p => p.value === form.plan)
  return plan ? plan.price : 0
})

const error = ref('')
const success = ref('')
const loading = ref(false)

const handleRegister = async () => {
  error.value = ''
  success.value = ''

  // Validation
  if (form.password !== form.confirmPassword) {
    error.value = 'Le password non corrispondono'
    return
  }

  if (form.password.length < 8) {
    error.value = 'La password deve essere di almeno 8 caratteri'
    return
  }

  if (!form.acceptTerms) {
    error.value = 'Devi accettare i Termini di Servizio e la Privacy Policy'
    return
  }

  loading.value = true

  try {
    // TODO: Implement actual registration API call
    // const response = await $fetch('/api/auth/register', {
    //   method: 'POST',
    //   body: {
    //     firstName: form.firstName,
    //     lastName: form.lastName,
    //     email: form.email,
    //     phone: form.phone,
    //     companyName: form.companyName,
    //     password: form.password,
    //     plan: form.plan
    //   }
    // })

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500))

    success.value = 'Account creato con successo! Reindirizzamento al login...'

    setTimeout(() => {
      router.push('/login?registered=true')
    }, 2000)
  } catch (e: any) {
    error.value = e.message || 'Errore durante la registrazione. Riprova.'
  } finally {
    loading.value = false
  }
}
</script>
