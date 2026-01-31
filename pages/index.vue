<template>
  <div v-if="isAuthenticated">
    <NuxtLayout name="auth">
      <div class="w-full">
        <!-- Hero Section -->
        <section class="text-center py-16 px-4">
          <div class="max-w-4xl mx-auto">
            <div class="w-20 h-20 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-xl">
              <i class="fas fa-chart-pie text-white text-3xl"></i>
            </div>
            <h1 class="text-5xl md:text-6xl font-bold text-slate-800 mb-6">
              Profitera
            </h1>
            <h2 class="text-3xl md:text-4xl font-semibold text-emerald-600 mb-6">
              Controllo di Gestione Intelligente
            </h2>
            <p class="text-xl text-slate-600 mb-8 max-w-2xl mx-auto leading-relaxed">
              La piattaforma SaaS completa per il controllo di gestione delle aziende italiane.
              Gestisci contabilità, finanza e analisi in un'unica soluzione cloud.
            </p>
            <div class="flex flex-col sm:flex-row gap-4 justify-center">
              <NuxtLink
                to="/register"
                class="px-8 py-4 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-xl transition shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
              >
                <i class="fas fa-rocket mr-2"></i>Inizia Gratis
              </NuxtLink>
              <NuxtLink
                to="/login"
                class="px-8 py-4 bg-white hover:bg-slate-50 text-emerald-600 font-semibold rounded-xl transition border-2 border-emerald-600"
              >
                <i class="fas fa-sign-in-alt mr-2"></i>Accedi
              </NuxtLink>
            </div>
          </div>
        </section>

        <!-- Features Section -->
        <section class="py-16 px-4 bg-white">
          <div class="max-w-6xl mx-auto">
            <div class="text-center mb-12">
              <h3 class="text-3xl font-bold text-slate-800 mb-4">Tutte le funzionalità che ti servono</h3>
              <p class="text-lg text-slate-600">Una suite completa per il controllo di gestione aziendale</p>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div v-for="feature in features" :key="feature.title" class="feature-card group">
                <div :class="[feature.color, 'w-14 h-14 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform']">
                  <i :class="['fas', feature.icon, 'text-2xl', feature.iconColor]"></i>
                </div>
                <h4 class="text-lg font-semibold text-slate-800 mb-2">{{ feature.title }}</h4>
                <p class="text-sm text-slate-600">{{ feature.description }}</p>
              </div>
            </div>
          </div>
        </section>

        <!-- Pricing Section -->
        <section class="py-16 px-4 bg-slate-50">
          <div class="max-w-6xl mx-auto">
            <div class="text-center mb-12">
              <h3 class="text-3xl font-bold text-slate-800 mb-4">Prezzi semplici e trasparenti</h3>
              <p class="text-lg text-slate-600">Scegli il piano perfetto per la tua azienda</p>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div v-for="plan in pricingPlans" :key="plan.name" :class="[plan.featured ? 'pricing-card-featured' : 'pricing-card']">
                <div v-if="plan.featured" class="absolute top-0 right-0 bg-emerald-600 text-white text-xs font-bold px-3 py-1 rounded-bl-lg rounded-tr-xl">
                  POPOLARE
                </div>
                <h4 class="text-2xl font-bold text-slate-800 mb-2">{{ plan.name }}</h4>
                <div class="mb-6">
                  <span class="text-4xl font-bold text-emerald-600">€{{ plan.price }}</span>
                  <span class="text-slate-600">/mese</span>
                </div>
                <ul class="space-y-3 mb-8">
                  <li v-for="feature in plan.features" :key="feature" class="flex items-start text-slate-700">
                    <i class="fas fa-check text-emerald-600 mt-1 mr-3"></i>
                    <span>{{ feature }}</span>
                  </li>
                </ul>
                <NuxtLink
                  to="/register"
                  :class="plan.featured ? 'btn-primary' : 'btn-secondary'"
                >
                  Inizia ora
                </NuxtLink>
              </div>
            </div>

            <div class="text-center mt-8 text-sm text-slate-500">
              Tutti i prezzi sono IVA esclusa. Cancellazione possibile in qualsiasi momento.
            </div>
          </div>
        </section>

        <!-- CTA Section -->
        <section class="py-16 px-4 bg-gradient-to-br from-emerald-600 to-emerald-700 text-white">
          <div class="max-w-4xl mx-auto text-center">
            <h3 class="text-3xl md:text-4xl font-bold mb-4">Pronto a migliorare il controllo di gestione?</h3>
            <p class="text-xl mb-8 text-emerald-100">
              Unisciti a centinaia di aziende italiane che hanno già scelto Profitera
            </p>
            <NuxtLink
              to="/register"
              class="inline-block px-10 py-4 bg-white text-emerald-600 hover:bg-emerald-50 font-bold rounded-xl transition shadow-xl transform hover:-translate-y-0.5"
            >
              <i class="fas fa-rocket mr-2"></i>Inizia la prova gratuita
            </NuxtLink>
            <p class="mt-6 text-sm text-emerald-100">
              <i class="fas fa-lock mr-2"></i>Nessuna carta di credito richiesta
            </p>
          </div>
        </section>

        <!-- Footer -->
        <footer class="bg-slate-900 text-white py-12 px-4">
          <div class="max-w-6xl mx-auto">
            <div class="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
              <div>
                <div class="flex items-center gap-3 mb-4">
                  <div class="w-10 h-10 bg-emerald-600 rounded-xl flex items-center justify-center">
                    <i class="fas fa-chart-pie text-white"></i>
                  </div>
                  <h5 class="text-lg font-bold">Profitera</h5>
                </div>
                <p class="text-slate-400 text-sm">
                  Controllo di gestione intelligente per aziende moderne
                </p>
              </div>
              <div>
                <h6 class="font-semibold mb-4">Prodotto</h6>
                <ul class="space-y-2 text-sm text-slate-400">
                  <li><a href="#" class="hover:text-white transition">Funzionalità</a></li>
                  <li><a href="#" class="hover:text-white transition">Prezzi</a></li>
                  <li><a href="#" class="hover:text-white transition">Sicurezza</a></li>
                  <li><a href="#" class="hover:text-white transition">Roadmap</a></li>
                </ul>
              </div>
              <div>
                <h6 class="font-semibold mb-4">Azienda</h6>
                <ul class="space-y-2 text-sm text-slate-400">
                  <li><a href="#" class="hover:text-white transition">Chi siamo</a></li>
                  <li><a href="#" class="hover:text-white transition">Blog</a></li>
                  <li><a href="#" class="hover:text-white transition">Contatti</a></li>
                  <li><a href="#" class="hover:text-white transition">Supporto</a></li>
                </ul>
              </div>
              <div>
                <h6 class="font-semibold mb-4">Legale</h6>
                <ul class="space-y-2 text-sm text-slate-400">
                  <li><a href="#" class="hover:text-white transition">Privacy Policy</a></li>
                  <li><a href="#" class="hover:text-white transition">Termini di Servizio</a></li>
                  <li><a href="#" class="hover:text-white transition">Cookie Policy</a></li>
                  <li><a href="#" class="hover:text-white transition">GDPR</a></li>
                </ul>
              </div>
            </div>
            <div class="border-t border-slate-800 pt-8 text-center text-sm text-slate-400">
              <p>&copy; 2025 Profitera. Tutti i diritti riservati.</p>
            </div>
          </div>
        </footer>
      </div>
    </NuxtLayout>
  </div>
</template>

<script setup lang="ts">
definePageMeta({ layout: false })

const brand = useBrand()
const router = useRouter()
const isAuthenticated = ref(false)

// Check authentication on mount
onMounted(() => {
  // Check for token in localStorage
  if (typeof localStorage !== 'undefined') {
    const token = localStorage.getItem('token')
    isAuthenticated.value = !!token
  }

  // If not authenticated, redirect to appropriate landing page
  if (!isAuthenticated.value) {
    if (brand.isProfitera) {
      router.push('/landing-profitera')
    } else {
      router.push('/landing-geniusmile')
    }
  }
})

const features = [
  {
    title: 'Budget Previsionale',
    description: 'Pianifica e monitora il budget aziendale con precisione',
    icon: 'fa-chart-line',
    color: 'bg-blue-100',
    iconColor: 'text-blue-600'
  },
  {
    title: 'Contabilità Analitica',
    description: 'Dashboard automatica e regole di contabilizzazione intelligenti',
    icon: 'fa-calculator',
    color: 'bg-cyan-100',
    iconColor: 'text-cyan-600'
  },
  {
    title: 'Analisi Fatturato',
    description: 'Analizza ricavi e marginalità per prodotto e cliente',
    icon: 'fa-chart-bar',
    color: 'bg-purple-100',
    iconColor: 'text-purple-600'
  },
  {
    title: 'Gestione Banca',
    description: 'Bank control e conciliazione bancaria automatizzata',
    icon: 'fa-university',
    color: 'bg-emerald-100',
    iconColor: 'text-emerald-600'
  },
  {
    title: 'Break-Even Point',
    description: 'Calcola il punto di pareggio e analizza i costi',
    icon: 'fa-balance-scale',
    color: 'bg-amber-100',
    iconColor: 'text-amber-600'
  },
  {
    title: 'Monitoraggio Finanziario',
    description: 'KPI e indicatori finanziari in tempo reale',
    icon: 'fa-tachometer-alt',
    color: 'bg-red-100',
    iconColor: 'text-red-600'
  },
  {
    title: 'Registri Contabili',
    description: 'Registro economico, contabile e fiscale integrati',
    icon: 'fa-book',
    color: 'bg-indigo-100',
    iconColor: 'text-indigo-600'
  },
  {
    title: 'Riclassificazione Bilancio',
    description: 'Riclassifica bilanci per tipologia e analisi interna',
    icon: 'fa-sitemap',
    color: 'bg-pink-100',
    iconColor: 'text-pink-600'
  }
]

const pricingPlans = [
  {
    name: 'Starter',
    price: 49,
    featured: false,
    features: [
      '1 azienda',
      'Dashboard contabile',
      'Bank control base',
      'Report mensili',
      'Supporto email',
      '1 utente'
    ]
  },
  {
    name: 'Professional',
    price: 99,
    featured: true,
    features: [
      'Fino a 3 aziende',
      'Tutte le funzionalità Starter',
      'Analisi fatturato avanzata',
      'BEP e costi previsionali',
      'Riclassificazione bilancio',
      'Supporto prioritario',
      'Fino a 5 utenti',
      'API access'
    ]
  },
  {
    name: 'Enterprise',
    price: 199,
    featured: false,
    features: [
      'Aziende illimitate',
      'Tutte le funzionalità Professional',
      'White label',
      'Integrazioni custom',
      'Account manager dedicato',
      'Utenti illimitati',
      'SLA garantito 99.9%',
      'Backup giornalieri'
    ]
  }
]
</script>

<style scoped>
.feature-card {
  @apply bg-white rounded-2xl border border-slate-200 p-6 hover:shadow-lg transition-all duration-300 hover:-translate-y-1;
}

.pricing-card {
  @apply bg-white rounded-2xl border-2 border-slate-200 p-8 hover:shadow-lg transition-all duration-300 hover:-translate-y-1 relative;
}

.pricing-card-featured {
  @apply bg-white rounded-2xl border-2 border-emerald-600 p-8 shadow-xl transform scale-105 relative;
}

.btn-primary {
  @apply w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-xl transition shadow-md inline-block text-center;
}

.btn-secondary {
  @apply w-full py-3 bg-slate-100 hover:bg-slate-200 text-slate-800 font-semibold rounded-xl transition inline-block text-center;
}
</style>
