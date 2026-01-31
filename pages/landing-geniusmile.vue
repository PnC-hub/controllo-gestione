<template>
  <div>
    <NuxtLayout name="marketing">
      <!-- Navbar -->
      <nav class="fixed top-0 w-full bg-white/90 backdrop-blur-md border-b border-slate-200 z-50">
        <div class="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <div class="flex items-center gap-3">
            <div class="w-10 h-10 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-xl flex items-center justify-center">
              <i class="fas fa-chart-pie text-white"></i>
            </div>
            <span class="font-bold text-slate-800 text-lg">Controllo di Gestione</span>
          </div>
          <div class="flex items-center gap-4">
            <a href="#funzionalita" class="text-slate-600 hover:text-slate-800 text-sm font-medium hidden md:inline">Funzionalità</a>
            <a href="#pricing" class="text-slate-600 hover:text-slate-800 text-sm font-medium hidden md:inline">Prezzi</a>
            <a href="#faq" class="text-slate-600 hover:text-slate-800 text-sm font-medium hidden md:inline">FAQ</a>
            <NuxtLink to="/login" class="px-5 py-2.5 bg-gradient-to-r from-cyan-500 to-blue-600 text-white rounded-xl font-semibold text-sm hover:shadow-lg hover:shadow-cyan-500/25 transition-all">
              Accedi
            </NuxtLink>
          </div>
        </div>
      </nav>

      <!-- Hero -->
      <section class="pt-32 pb-20 bg-gradient-to-b from-slate-50 to-white">
        <div class="max-w-6xl mx-auto px-6">
          <div class="max-w-3xl mx-auto text-center">
            <div class="inline-flex items-center gap-2 bg-cyan-50 text-cyan-700 px-4 py-2 rounded-full text-sm font-semibold mb-6">
              <i class="fas fa-bolt"></i>
              Modulo CRM Geniusmile
            </div>
            <h1 class="text-4xl md:text-5xl font-extrabold text-slate-900 leading-tight mb-6">
              I numeri del tuo studio,
              <span class="bg-gradient-to-r from-cyan-500 to-blue-600 bg-clip-text text-transparent">integrati con il CRM</span>
            </h1>
            <p class="text-xl text-slate-500 mb-8 leading-relaxed">
              Contabilità, finanza e analisi dei costi in un unico modulo.
              Integrato con il CRM Geniusmile, i dati si alimentano automaticamente
              dalla produzione clinica.
            </p>
            <div class="flex flex-col sm:flex-row gap-4 justify-center">
              <a href="#pricing" class="px-8 py-4 bg-gradient-to-r from-cyan-500 to-blue-600 text-white rounded-2xl font-bold text-lg hover:shadow-xl hover:shadow-cyan-500/25 transition-all hover:-translate-y-0.5">
                Richiedi Demo <i class="fas fa-arrow-right ml-2"></i>
              </a>
              <a href="#funzionalita" class="px-8 py-4 bg-white border-2 border-slate-200 text-slate-700 rounded-2xl font-bold text-lg hover:border-cyan-500 hover:text-cyan-600 transition-all">
                Scopri le Funzionalità
              </a>
            </div>
          </div>

          <!-- Hero Stats -->
          <div class="grid grid-cols-2 md:grid-cols-4 gap-6 mt-16 max-w-4xl mx-auto">
            <div class="text-center">
              <p class="text-3xl font-extrabold text-slate-800">98%</p>
              <p class="text-sm text-slate-500 mt-1">Automazione contabile</p>
            </div>
            <div class="text-center">
              <p class="text-3xl font-extrabold text-slate-800">-70%</p>
              <p class="text-sm text-slate-500 mt-1">Tempo amministrativo</p>
            </div>
            <div class="text-center">
              <p class="text-3xl font-extrabold text-cyan-600">Real-time</p>
              <p class="text-sm text-slate-500 mt-1">Dati finanziari</p>
            </div>
            <div class="text-center">
              <p class="text-3xl font-extrabold text-cyan-600">Multi</p>
              <p class="text-sm text-slate-500 mt-1">Centro / Sede</p>
            </div>
          </div>
        </div>
      </section>

      <!-- Pain Points -->
      <section class="py-20 bg-white">
        <div class="max-w-6xl mx-auto px-6">
          <div class="text-center mb-12">
            <h2 class="text-3xl font-extrabold text-slate-900 mb-4">Problemi che risolviamo</h2>
            <p class="text-lg text-slate-500">Lo studio dentistico ha esigenze contabili specifiche</p>
          </div>
          <div class="grid md:grid-cols-3 gap-8">
            <div class="p-6 rounded-2xl border-2 border-red-100 bg-red-50/50">
              <div class="w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center mb-4">
                <i class="fas fa-clock text-red-500 text-xl"></i>
              </div>
              <h3 class="font-bold text-slate-800 text-lg mb-2">Ore perse in Excel</h3>
              <p class="text-slate-600">L'amministrativa passa ore a riconciliare movimenti bancari con fatture, copiando dati tra fogli diversi.</p>
            </div>
            <div class="p-6 rounded-2xl border-2 border-amber-100 bg-amber-50/50">
              <div class="w-12 h-12 bg-amber-100 rounded-xl flex items-center justify-center mb-4">
                <i class="fas fa-eye-slash text-amber-500 text-xl"></i>
              </div>
              <h3 class="font-bold text-slate-800 text-lg mb-2">Zero visibilità sui costi</h3>
              <p class="text-slate-600">Non sai quanto costa realmente ogni prestazione. Il BEP dello studio resta un mistero fino al bilancio annuale.</p>
            </div>
            <div class="p-6 rounded-2xl border-2 border-orange-100 bg-orange-50/50">
              <div class="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center mb-4">
                <i class="fas fa-unlink text-orange-500 text-xl"></i>
              </div>
              <h3 class="font-bold text-slate-800 text-lg mb-2">Dati scollegati</h3>
              <p class="text-slate-600">Produzione clinica e contabilità vivono in mondi separati. Nessuna integrazione automatica.</p>
            </div>
          </div>
        </div>
      </section>

      <!-- Features -->
      <section id="funzionalita" class="py-20 bg-slate-50">
        <div class="max-w-6xl mx-auto px-6">
          <div class="text-center mb-16">
            <span class="text-cyan-600 font-bold text-sm uppercase tracking-wider">Funzionalità</span>
            <h2 class="text-3xl font-extrabold text-slate-900 mt-2 mb-4">Due moduli, un ecosistema</h2>
            <p class="text-lg text-slate-500">Tutto ciò che serve per il controllo economico-finanziario</p>
          </div>

          <!-- Contabilità -->
          <div class="mb-16">
            <div class="flex items-center gap-3 mb-8">
              <div class="w-12 h-12 bg-cyan-500 rounded-xl flex items-center justify-center">
                <i class="fas fa-calculator text-white text-xl"></i>
              </div>
              <h3 class="text-2xl font-bold text-slate-800">Contabilità</h3>
            </div>
            <div class="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div v-for="f in contabilitaFeatures" :key="f.title" class="bg-white rounded-xl p-5 border border-slate-200 hover:border-cyan-300 hover:shadow-md transition-all">
                <div class="flex items-start gap-3">
                  <div class="w-9 h-9 bg-cyan-50 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5">
                    <i :class="'fas fa-' + f.icon + ' text-cyan-500 text-sm'"></i>
                  </div>
                  <div>
                    <h4 class="font-semibold text-slate-800">{{ f.title }}</h4>
                    <p class="text-sm text-slate-500 mt-1">{{ f.desc }}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Finanziario -->
          <div>
            <div class="flex items-center gap-3 mb-8">
              <div class="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center">
                <i class="fas fa-chart-line text-white text-xl"></i>
              </div>
              <h3 class="text-2xl font-bold text-slate-800">Finanziario</h3>
            </div>
            <div class="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div v-for="f in finanziarioFeatures" :key="f.title" class="bg-white rounded-xl p-5 border border-slate-200 hover:border-blue-300 hover:shadow-md transition-all">
                <div class="flex items-start gap-3">
                  <div class="w-9 h-9 bg-blue-50 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5">
                    <i :class="'fas fa-' + f.icon + ' text-blue-500 text-sm'"></i>
                  </div>
                  <div>
                    <h4 class="font-semibold text-slate-800">{{ f.title }}</h4>
                    <p class="text-sm text-slate-500 mt-1">{{ f.desc }}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- Integration -->
      <section class="py-20 bg-white">
        <div class="max-w-6xl mx-auto px-6">
          <div class="bg-gradient-to-br from-slate-900 to-slate-800 rounded-3xl p-10 md:p-16 text-center">
            <h2 class="text-3xl font-extrabold text-white mb-4">Integrato con Geniusmile CRM</h2>
            <p class="text-lg text-slate-300 mb-8 max-w-2xl mx-auto">
              I dati di produzione, fatturazione e incassi si sincronizzano automaticamente.
              Nessun doppio inserimento, nessun errore umano.
            </p>
            <div class="grid md:grid-cols-3 gap-6 max-w-3xl mx-auto">
              <div class="bg-white/10 rounded-2xl p-6 backdrop-blur">
                <i class="fas fa-sync text-cyan-400 text-2xl mb-3"></i>
                <h4 class="font-bold text-white">Sync automatico</h4>
                <p class="text-slate-400 text-sm mt-1">Fatture e incassi dal CRM al modulo contabile</p>
              </div>
              <div class="bg-white/10 rounded-2xl p-6 backdrop-blur">
                <i class="fas fa-building text-cyan-400 text-2xl mb-3"></i>
                <h4 class="font-bold text-white">Multi-centro</h4>
                <p class="text-slate-400 text-sm mt-1">Gestisci più studi da un unico pannello</p>
              </div>
              <div class="bg-white/10 rounded-2xl p-6 backdrop-blur">
                <i class="fas fa-shield-alt text-cyan-400 text-2xl mb-3"></i>
                <h4 class="font-bold text-white">Accesso separato</h4>
                <p class="text-slate-400 text-sm mt-1">L'amministrativa accede solo ai dati finanziari</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- Pricing -->
      <section id="pricing" class="py-20 bg-slate-50">
        <div class="max-w-6xl mx-auto px-6">
          <div class="text-center mb-16">
            <span class="text-cyan-600 font-bold text-sm uppercase tracking-wider">Prezzi</span>
            <h2 class="text-3xl font-extrabold text-slate-900 mt-2 mb-4">Scegli il piano giusto per il tuo studio</h2>
            <p class="text-lg text-slate-500">Tutti i piani includono aggiornamenti e supporto</p>
          </div>

          <!-- Toggle annuale/mensile -->
          <div class="flex items-center justify-center gap-4 mb-12">
            <span :class="!annual ? 'text-slate-800 font-semibold' : 'text-slate-400'" class="text-sm">Mensile</span>
            <button @click="annual = !annual" :class="annual ? 'bg-cyan-500' : 'bg-slate-300'" class="relative w-14 h-7 rounded-full transition-colors">
              <span :class="annual ? 'translate-x-7' : 'translate-x-1'" class="absolute top-1 w-5 h-5 bg-white rounded-full shadow transition-transform"></span>
            </button>
            <span :class="annual ? 'text-slate-800 font-semibold' : 'text-slate-400'" class="text-sm">
              Annuale <span class="text-cyan-500 font-bold">-20%</span>
            </span>
          </div>

          <div class="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <!-- Starter -->
            <div class="bg-white rounded-2xl border border-slate-200 p-8 hover:shadow-lg transition-all">
              <div class="mb-6">
                <h3 class="text-lg font-bold text-slate-800">Starter</h3>
                <p class="text-slate-500 text-sm mt-1">Per studi singoli</p>
              </div>
              <div class="mb-6">
                <span class="text-4xl font-extrabold text-slate-900">&euro;{{ annual ? '39' : '49' }}</span>
                <span class="text-slate-500">/mese</span>
                <p v-if="annual" class="text-sm text-cyan-600 mt-1">Fatturato annualmente (&euro;468/anno)</p>
              </div>
              <ul class="space-y-3 mb-8">
                <li v-for="f in starterFeatures" :key="f" class="flex items-start gap-2 text-sm text-slate-600">
                  <i class="fas fa-check text-cyan-500 mt-0.5"></i>
                  <span>{{ f }}</span>
                </li>
              </ul>
              <a href="mailto:info@geniusmile.com?subject=Richiesta Piano Starter CDG" class="block w-full py-3 text-center border-2 border-slate-200 text-slate-700 rounded-xl font-semibold hover:border-cyan-500 hover:text-cyan-600 transition-all">
                Richiedi Info
              </a>
            </div>

            <!-- Professional - Recommended -->
            <div class="bg-white rounded-2xl border-2 border-cyan-500 p-8 shadow-xl shadow-cyan-500/10 relative transform scale-105">
              <div class="absolute -top-4 left-1/2 -translate-x-1/2 bg-gradient-to-r from-cyan-500 to-blue-600 text-white px-4 py-1 rounded-full text-sm font-bold">
                Consigliato
              </div>
              <div class="mb-6">
                <h3 class="text-lg font-bold text-slate-800">Professional</h3>
                <p class="text-slate-500 text-sm mt-1">Per studi strutturati</p>
              </div>
              <div class="mb-6">
                <span class="text-4xl font-extrabold text-slate-900">&euro;{{ annual ? '79' : '99' }}</span>
                <span class="text-slate-500">/mese</span>
                <p v-if="annual" class="text-sm text-cyan-600 mt-1">Fatturato annualmente (&euro;948/anno)</p>
              </div>
              <ul class="space-y-3 mb-8">
                <li v-for="f in proFeatures" :key="f" class="flex items-start gap-2 text-sm text-slate-600">
                  <i class="fas fa-check text-cyan-500 mt-0.5"></i>
                  <span>{{ f }}</span>
                </li>
              </ul>
              <a href="mailto:info@geniusmile.com?subject=Richiesta Demo Professional CDG" class="block w-full py-3 text-center bg-gradient-to-r from-cyan-500 to-blue-600 text-white rounded-xl font-bold hover:shadow-lg hover:shadow-cyan-500/25 transition-all">
                Richiedi Demo
              </a>
            </div>

            <!-- Enterprise -->
            <div class="bg-white rounded-2xl border border-slate-200 p-8 hover:shadow-lg transition-all">
              <div class="mb-6">
                <h3 class="text-lg font-bold text-slate-800">Enterprise</h3>
                <p class="text-slate-500 text-sm mt-1">Per gruppi e franchising</p>
              </div>
              <div class="mb-6">
                <span class="text-4xl font-extrabold text-slate-900">Custom</span>
                <p class="text-sm text-slate-500 mt-1">Prezzo su misura</p>
              </div>
              <ul class="space-y-3 mb-8">
                <li v-for="f in enterpriseFeatures" :key="f" class="flex items-start gap-2 text-sm text-slate-600">
                  <i class="fas fa-check text-cyan-500 mt-0.5"></i>
                  <span>{{ f }}</span>
                </li>
              </ul>
              <a href="mailto:info@geniusmile.com?subject=Richiesta Piano Enterprise CDG" class="block w-full py-3 text-center border-2 border-slate-200 text-slate-700 rounded-xl font-semibold hover:border-cyan-500 hover:text-cyan-600 transition-all">
                Contattaci
              </a>
            </div>
          </div>
        </div>
      </section>

      <!-- FAQ -->
      <section id="faq" class="py-20 bg-white">
        <div class="max-w-3xl mx-auto px-6">
          <div class="text-center mb-12">
            <h2 class="text-3xl font-extrabold text-slate-900">Domande frequenti</h2>
          </div>
          <div class="space-y-4">
            <div v-for="(faq, i) in faqs" :key="i" class="border border-slate-200 rounded-xl overflow-hidden">
              <button @click="openFaq === i ? openFaq = -1 : openFaq = i" class="w-full px-6 py-4 flex items-center justify-between text-left hover:bg-slate-50 transition">
                <span class="font-semibold text-slate-800">{{ faq.q }}</span>
                <i :class="openFaq === i ? 'fa-chevron-up' : 'fa-chevron-down'" class="fas text-slate-400 text-sm"></i>
              </button>
              <div v-show="openFaq === i" class="px-6 pb-4 text-slate-600">
                {{ faq.a }}
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- CTA Final -->
      <section class="py-20 bg-gradient-to-br from-cyan-500 to-blue-600">
        <div class="max-w-3xl mx-auto px-6 text-center">
          <h2 class="text-3xl font-extrabold text-white mb-4">Pronto a prendere il controllo dei numeri?</h2>
          <p class="text-lg text-cyan-100 mb-8">Inizia con una demo gratuita. Ti mostriamo come il modulo si integra con il tuo studio.</p>
          <a href="mailto:info@geniusmile.com?subject=Richiesta Demo Controllo di Gestione" class="inline-block px-8 py-4 bg-white text-cyan-600 rounded-2xl font-bold text-lg hover:shadow-xl transition-all hover:-translate-y-0.5">
            Richiedi una Demo Gratuita <i class="fas fa-arrow-right ml-2"></i>
          </a>
        </div>
      </section>

      <!-- Footer -->
      <footer class="bg-slate-900 py-12">
        <div class="max-w-6xl mx-auto px-6">
          <div class="flex flex-col md:flex-row items-center justify-between gap-6">
            <div class="flex items-center gap-3">
              <div class="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center">
                <i class="fas fa-chart-pie text-white"></i>
              </div>
              <div>
                <span class="font-bold text-white">Controllo di Gestione</span>
                <p class="text-slate-400 text-xs">by Geniusmile</p>
              </div>
            </div>
            <div class="flex items-center gap-6 text-sm text-slate-400">
              <a href="mailto:info@geniusmile.com" class="hover:text-white transition">info@geniusmile.com</a>
              <a href="https://geniusmile.com" target="_blank" class="hover:text-white transition">geniusmile.com</a>
            </div>
          </div>
          <div class="border-t border-slate-800 mt-8 pt-8 text-center text-sm text-slate-400">
            <p>&copy; 2025 Geniusmile. Tutti i diritti riservati.</p>
          </div>
        </div>
      </footer>
    </NuxtLayout>
  </div>
</template>

<script setup lang="ts">
definePageMeta({ layout: false })

const annual = ref(true)
const openFaq = ref(-1)

const contabilitaFeatures = [
  { icon: 'robot', title: 'Dashboard Automatica', desc: 'Panoramica con KPI contabili in tempo reale e automazione intelligente' },
  { icon: 'university', title: 'Bank Control', desc: 'Collega i conti bancari e monitora saldi e movimenti' },
  { icon: 'exchange-alt', title: 'Import Movimenti', desc: 'Importa movimenti bancari in formato CSV/OFX con mapping automatico' },
  { icon: 'check-double', title: 'Conciliazione', desc: 'Riconcilia fatture e movimenti bancari automaticamente o manualmente' },
  { icon: 'cogs', title: 'Regole Automatiche', desc: 'Crea regole per categorizzare automaticamente i movimenti ricorrenti' },
  { icon: 'book', title: 'Prima Nota', desc: 'Registro di prima nota con categorie personalizzabili' },
  { icon: 'file-invoice', title: 'Ricavi e Costi', desc: 'Gestione completa di fatture attive, passive e autofatture' },
  { icon: 'chart-bar', title: 'Report Contabile', desc: 'Report mensili e annuali con export in PDF e Excel' },
]

const finanziarioFeatures = [
  { icon: 'sitemap', title: 'Riclassificazione Bilancio', desc: 'Bilancio riclassificato interno e per il commercialista' },
  { icon: 'book-open', title: 'Registri', desc: 'Registro economico, contabile e fiscale integrati' },
  { icon: 'chart-bar', title: 'Analisi Fatturato', desc: 'Analisi dettagliata del fatturato per periodo, prestazione, operatore' },
  { icon: 'balance-scale', title: 'Break Even Point', desc: 'Calcolo BEP per capire quando lo studio diventa profittevole' },
  { icon: 'coins', title: 'Analisi Costi', desc: 'Costi variabili, fissi, gestionali e materiali con previsionale' },
  { icon: 'tachometer-alt', title: 'Monitor Finanziario', desc: 'Dashboard real-time con alert su scostamenti dal budget' },
]

const starterFeatures = [
  '1 centro / studio',
  'Modulo Contabilità completo',
  'Bank Control + Import movimenti',
  'Conciliazione automatica',
  'Prima Nota e Report',
  'Supporto email',
]

const proFeatures = [
  'Tutto di Starter +',
  'Modulo Finanziario completo',
  'Riclassificazione bilancio',
  'Analisi BEP e Costi previsionali',
  'Monitor Finanziario real-time',
  'Fino a 3 centri / studi',
  'Supporto prioritario',
]

const enterpriseFeatures = [
  'Tutto di Professional +',
  'Centri illimitati',
  'White-label personalizzabile',
  'API dedicata',
  'Account manager dedicato',
  'SLA garantito 99.9%',
  'Onboarding personalizzato',
]

const faqs = [
  {
    q: 'Serve avere Geniusmile CRM per usare il modulo?',
    a: 'Sì, il modulo Controllo di Gestione si integra nativamente con Geniusmile CRM. I dati di produzione, fatturazione e incassi vengono sincronizzati automaticamente.'
  },
  {
    q: 'Posso dare accesso solo all\'amministrativa?',
    a: 'Assolutamente. Il modulo ha un accesso separato dal CRM clinico. L\'amministrativa accede solo ai dati contabili e finanziari, senza vedere cartelle cliniche o dati sensibili dei pazienti.'
  },
  {
    q: 'Come funziona l\'import dei movimenti bancari?',
    a: 'Puoi importare i movimenti in formato CSV o OFX (standard bancario). Il sistema riconosce automaticamente i movimenti ricorrenti grazie alle regole che configuri.'
  },
  {
    q: 'Posso gestire più studi da un unico account?',
    a: 'Sì, con il piano Professional puoi gestire fino a 3 centri, con Enterprise centri illimitati. Basta un click per switchare tra le aziende.'
  },
  {
    q: 'È possibile provare il modulo prima di acquistare?',
    a: 'Certo. Offriamo una demo gratuita personalizzata dove ti mostriamo il modulo con i dati del tuo studio. Contattaci per prenotare.'
  },
]
</script>
