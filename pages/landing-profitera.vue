<template>
  <div>
    <NuxtLayout name="marketing">
      <!-- Navbar -->
      <nav class="fixed top-0 w-full bg-white/90 backdrop-blur-md border-b border-slate-200 z-50">
        <div class="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <div class="flex items-center gap-3">
            <div class="w-10 h-10 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl flex items-center justify-center">
              <i class="fas fa-chart-trend-up text-white"></i>
            </div>
            <span class="font-bold text-slate-800 text-lg">Profitera</span>
          </div>
          <div class="flex items-center gap-4">
            <a href="#funzionalita" class="text-slate-600 hover:text-slate-800 text-sm font-medium hidden md:inline">Funzionalità</a>
            <a href="#pricing" class="text-slate-600 hover:text-slate-800 text-sm font-medium hidden md:inline">Prezzi</a>
            <a href="#faq" class="text-slate-600 hover:text-slate-800 text-sm font-medium hidden md:inline">FAQ</a>
            <NuxtLink to="/login" class="px-5 py-2.5 bg-gradient-to-r from-emerald-500 to-teal-600 text-white rounded-xl font-semibold text-sm hover:shadow-lg hover:shadow-emerald-500/25 transition-all">
              Accedi
            </NuxtLink>
          </div>
        </div>
      </nav>

      <!-- Hero -->
      <section class="pt-32 pb-20 bg-gradient-to-b from-slate-50 to-white">
        <div class="max-w-6xl mx-auto px-6">
          <div class="max-w-3xl mx-auto text-center">
            <h1 class="text-5xl md:text-6xl font-extrabold text-slate-900 leading-tight mb-6">
              Smetti di navigare a vista.
              <span class="bg-gradient-to-r from-emerald-500 to-teal-600 bg-clip-text text-transparent block mt-2">
                Controlla i numeri in tempo reale.
              </span>
            </h1>
            <p class="text-xl text-slate-600 mb-8 leading-relaxed">
              La piattaforma completa per gestire contabilità, finanza e controllo di gestione della tua azienda.
              Automatizza il 98% delle operazioni e prendi decisioni con dati certi.
            </p>
            <div class="flex flex-col sm:flex-row gap-4 justify-center">
              <a href="#pricing" class="px-8 py-4 bg-gradient-to-r from-emerald-500 to-teal-600 text-white rounded-2xl font-bold text-lg hover:shadow-xl hover:shadow-emerald-500/25 transition-all hover:-translate-y-0.5">
                Prova Gratis 14 Giorni <i class="fas fa-arrow-right ml-2"></i>
              </a>
              <a href="#funzionalita" class="px-8 py-4 bg-white border-2 border-slate-200 text-slate-700 rounded-2xl font-bold text-lg hover:border-emerald-500 hover:text-emerald-600 transition-all">
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
              <p class="text-3xl font-extrabold text-emerald-600">Real-time</p>
              <p class="text-sm text-slate-500 mt-1">Dati finanziari</p>
            </div>
            <div class="text-center">
              <p class="text-3xl font-extrabold text-emerald-600">Multi</p>
              <p class="text-sm text-slate-500 mt-1">Azienda</p>
            </div>
          </div>
        </div>
      </section>

      <!-- Pain Points -->
      <section class="py-20 bg-white">
        <div class="max-w-6xl mx-auto px-6">
          <div class="text-center mb-12">
            <h2 class="text-3xl font-extrabold text-slate-900 mb-4">Ti riconosci in questi problemi?</h2>
            <p class="text-lg text-slate-500">Ogni giorno centinaia di imprenditori affrontano le stesse sfide</p>
          </div>
          <div class="grid md:grid-cols-3 gap-8">
            <div class="p-6 rounded-2xl border-2 border-red-100 bg-red-50/50">
              <div class="w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center mb-4">
                <i class="fas fa-file-excel text-red-500 text-xl"></i>
              </div>
              <h3 class="font-bold text-slate-800 text-lg mb-2">Contabilità su Excel sparsi</h3>
              <p class="text-slate-600">Dati contabili sparpagliati su 10 fogli Excel diversi. Ogni modifica richiede ore di lavoro e rischio errori.</p>
            </div>
            <div class="p-6 rounded-2xl border-2 border-amber-100 bg-amber-50/50">
              <div class="w-12 h-12 bg-amber-100 rounded-xl flex items-center justify-center mb-4">
                <i class="fas fa-eye-slash text-amber-500 text-xl"></i>
              </div>
              <h3 class="font-bold text-slate-800 text-lg mb-2">Margini scoperti solo a fine anno</h3>
              <p class="text-slate-600">Non sai se stai guadagnando o perdendo finché il commercialista non chiude il bilancio. Troppo tardi per correggere.</p>
            </div>
            <div class="p-6 rounded-2xl border-2 border-orange-100 bg-orange-50/50">
              <div class="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center mb-4">
                <i class="fas fa-unlink text-orange-500 text-xl"></i>
              </div>
              <h3 class="font-bold text-slate-800 text-lg mb-2">Commercialista e imprenditore disconnessi</h3>
              <p class="text-slate-600">Il commercialista lavora su dati vecchi. Tu non hai visibilità. Zero sinergia operativa.</p>
            </div>
          </div>
        </div>
      </section>

      <!-- Features -->
      <section id="funzionalita" class="py-20 bg-slate-50">
        <div class="max-w-6xl mx-auto px-6">
          <div class="text-center mb-16">
            <span class="text-emerald-600 font-bold text-sm uppercase tracking-wider">Funzionalità</span>
            <h2 class="text-3xl font-extrabold text-slate-900 mt-2 mb-4">Due moduli, un ecosistema completo</h2>
            <p class="text-lg text-slate-500">Tutto ciò che serve per il controllo economico-finanziario della tua impresa</p>
          </div>

          <!-- Contabilità -->
          <div class="mb-16">
            <div class="flex items-center gap-3 mb-8">
              <div class="w-12 h-12 bg-emerald-500 rounded-xl flex items-center justify-center">
                <i class="fas fa-calculator text-white text-xl"></i>
              </div>
              <h3 class="text-2xl font-bold text-slate-800">Contabilità</h3>
            </div>
            <div class="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div v-for="f in contabilitaFeatures" :key="f.title" class="bg-white rounded-xl p-5 border border-slate-200 hover:border-emerald-300 hover:shadow-md transition-all">
                <div class="flex items-start gap-3">
                  <div class="w-9 h-9 bg-emerald-50 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5">
                    <i :class="'fas fa-' + f.icon + ' text-emerald-500 text-sm'"></i>
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
              <div class="w-12 h-12 bg-teal-600 rounded-xl flex items-center justify-center">
                <i class="fas fa-chart-line text-white text-xl"></i>
              </div>
              <h3 class="text-2xl font-bold text-slate-800">Finanziario</h3>
            </div>
            <div class="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div v-for="f in finanziarioFeatures" :key="f.title" class="bg-white rounded-xl p-5 border border-slate-200 hover:border-teal-300 hover:shadow-md transition-all">
                <div class="flex items-start gap-3">
                  <div class="w-9 h-9 bg-teal-50 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5">
                    <i :class="'fas fa-' + f.icon + ' text-teal-500 text-sm'"></i>
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

      <!-- How it works -->
      <section class="py-20 bg-white">
        <div class="max-w-6xl mx-auto px-6">
          <div class="text-center mb-16">
            <h2 class="text-3xl font-extrabold text-slate-900 mb-4">Come funziona</h2>
            <p class="text-lg text-slate-500">Tre semplici passaggi per avere il controllo totale</p>
          </div>
          <div class="grid md:grid-cols-3 gap-8">
            <div class="text-center">
              <div class="w-16 h-16 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <span class="text-white text-2xl font-bold">1</span>
              </div>
              <h3 class="text-xl font-bold text-slate-800 mb-3">Collega i tuoi conti</h3>
              <p class="text-slate-600">Importa i movimenti bancari in CSV/OFX. Connetti le fatture elettroniche. Bastano 5 minuti.</p>
            </div>
            <div class="text-center">
              <div class="w-16 h-16 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <span class="text-white text-2xl font-bold">2</span>
              </div>
              <h3 class="text-xl font-bold text-slate-800 mb-3">L'automazione fa il lavoro</h3>
              <p class="text-slate-600">Il sistema categorizza, concilia e registra automaticamente. Tu controlli e correggi solo le eccezioni.</p>
            </div>
            <div class="text-center">
              <div class="w-16 h-16 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <span class="text-white text-2xl font-bold">3</span>
              </div>
              <h3 class="text-xl font-bold text-slate-800 mb-3">Monitora e decidi</h3>
              <p class="text-slate-600">Dashboard real-time con KPI, margini, BEP e alert. Esporta i report per il commercialista.</p>
            </div>
          </div>
        </div>
      </section>

      <!-- Pricing -->
      <section id="pricing" class="py-20 bg-slate-50">
        <div class="max-w-6xl mx-auto px-6">
          <div class="text-center mb-16">
            <span class="text-emerald-600 font-bold text-sm uppercase tracking-wider">Prezzi</span>
            <h2 class="text-3xl font-extrabold text-slate-900 mt-2 mb-4">Scegli il piano giusto per la tua azienda</h2>
            <p class="text-lg text-slate-500">Tutti i piani includono 14 giorni di prova gratuita. Nessuna carta richiesta.</p>
          </div>

          <!-- Toggle annuale/mensile -->
          <div class="flex items-center justify-center gap-4 mb-12">
            <span :class="!annual ? 'text-slate-800 font-semibold' : 'text-slate-400'" class="text-sm">Mensile</span>
            <button @click="annual = !annual" :class="annual ? 'bg-emerald-500' : 'bg-slate-300'" class="relative w-14 h-7 rounded-full transition-colors">
              <span :class="annual ? 'translate-x-7' : 'translate-x-1'" class="absolute top-1 w-5 h-5 bg-white rounded-full shadow transition-transform"></span>
            </button>
            <span :class="annual ? 'text-slate-800 font-semibold' : 'text-slate-400'" class="text-sm">
              Annuale <span class="text-emerald-500 font-bold">-20%</span>
            </span>
          </div>

          <div class="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <!-- Starter -->
            <div class="bg-white rounded-2xl border border-slate-200 p-8 hover:shadow-lg transition-all">
              <div class="mb-6">
                <h3 class="text-lg font-bold text-slate-800">Starter</h3>
                <p class="text-slate-500 text-sm mt-1">Per piccole imprese</p>
              </div>
              <div class="mb-6">
                <span class="text-4xl font-extrabold text-slate-900">&euro;{{ annual ? '39' : '49' }}</span>
                <span class="text-slate-500">/mese</span>
                <p v-if="annual" class="text-sm text-emerald-600 mt-1">Fatturato annualmente (&euro;468/anno)</p>
              </div>
              <ul class="space-y-3 mb-8">
                <li v-for="f in starterFeatures" :key="f" class="flex items-start gap-2 text-sm text-slate-600">
                  <i class="fas fa-check text-emerald-500 mt-0.5"></i>
                  <span>{{ f }}</span>
                </li>
              </ul>
              <a href="mailto:info@profitera.it?subject=Richiesta Piano Starter" class="block w-full py-3 text-center bg-emerald-50 text-emerald-600 rounded-xl font-semibold hover:bg-emerald-100 transition-all">
                Inizia Gratis
              </a>
            </div>

            <!-- Professional - Recommended -->
            <div class="bg-white rounded-2xl border-2 border-emerald-500 p-8 shadow-xl shadow-emerald-500/10 relative transform scale-105">
              <div class="absolute -top-4 left-1/2 -translate-x-1/2 bg-gradient-to-r from-emerald-500 to-teal-600 text-white px-4 py-1 rounded-full text-sm font-bold">
                Più Popolare
              </div>
              <div class="mb-6">
                <h3 class="text-lg font-bold text-slate-800">Professional</h3>
                <p class="text-slate-500 text-sm mt-1">Per aziende strutturate</p>
              </div>
              <div class="mb-6">
                <span class="text-4xl font-extrabold text-slate-900">&euro;{{ annual ? '79' : '99' }}</span>
                <span class="text-slate-500">/mese</span>
                <p v-if="annual" class="text-sm text-emerald-600 mt-1">Fatturato annualmente (&euro;948/anno)</p>
              </div>
              <ul class="space-y-3 mb-8">
                <li v-for="f in proFeatures" :key="f" class="flex items-start gap-2 text-sm text-slate-600">
                  <i class="fas fa-check text-emerald-500 mt-0.5"></i>
                  <span>{{ f }}</span>
                </li>
              </ul>
              <a href="mailto:info@profitera.it?subject=Richiesta Piano Professional" class="block w-full py-3 text-center bg-gradient-to-r from-emerald-500 to-teal-600 text-white rounded-xl font-bold hover:shadow-lg hover:shadow-emerald-500/25 transition-all">
                Inizia Gratis
              </a>
            </div>

            <!-- Business -->
            <div class="bg-white rounded-2xl border border-slate-200 p-8 hover:shadow-lg transition-all">
              <div class="mb-6">
                <h3 class="text-lg font-bold text-slate-800">Business</h3>
                <p class="text-slate-500 text-sm mt-1">Per gruppi aziendali</p>
              </div>
              <div class="mb-6">
                <span class="text-4xl font-extrabold text-slate-900">&euro;{{ annual ? '159' : '199' }}</span>
                <span class="text-slate-500">/mese</span>
                <p v-if="annual" class="text-sm text-emerald-600 mt-1">Fatturato annualmente (&euro;1.908/anno)</p>
              </div>
              <ul class="space-y-3 mb-8">
                <li v-for="f in businessFeatures" :key="f" class="flex items-start gap-2 text-sm text-slate-600">
                  <i class="fas fa-check text-emerald-500 mt-0.5"></i>
                  <span>{{ f }}</span>
                </li>
              </ul>
              <a href="mailto:info@profitera.it?subject=Richiesta Piano Business" class="block w-full py-3 text-center bg-emerald-50 text-emerald-600 rounded-xl font-semibold hover:bg-emerald-100 transition-all">
                Contattaci
              </a>
            </div>
          </div>

          <div class="text-center mt-8 text-sm text-slate-500">
            Tutti i prezzi sono IVA esclusa. Cancellazione possibile in qualsiasi momento.
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
      <section class="py-20 bg-gradient-to-br from-emerald-500 to-teal-600">
        <div class="max-w-3xl mx-auto px-6 text-center">
          <h2 class="text-3xl md:text-4xl font-extrabold text-white mb-4">Prendi il controllo dei tuoi numeri. Oggi.</h2>
          <p class="text-lg text-emerald-100 mb-8">14 giorni gratis. Nessuna carta richiesta. Cancellazione immediata.</p>
          <a href="mailto:info@profitera.it?subject=Prova Gratuita Profitera" class="inline-block px-8 py-4 bg-white text-emerald-600 rounded-2xl font-bold text-lg hover:shadow-xl transition-all hover:-translate-y-0.5">
            Prova Gratis 14 Giorni <i class="fas fa-arrow-right ml-2"></i>
          </a>
          <p class="mt-6 text-sm text-emerald-100">
            <i class="fas fa-lock mr-2"></i>Dati protetti e criptati. Server in EU.
          </p>
        </div>
      </section>

      <!-- Footer -->
      <footer class="bg-slate-900 py-12">
        <div class="max-w-6xl mx-auto px-6">
          <div class="flex flex-col md:flex-row items-center justify-between gap-6">
            <div class="flex items-center gap-3">
              <div class="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center">
                <i class="fas fa-chart-trend-up text-white"></i>
              </div>
              <div>
                <span class="font-bold text-white">Profitera</span>
                <p class="text-slate-400 text-xs">Controllo di gestione intelligente</p>
              </div>
            </div>
            <div class="flex items-center gap-6 text-sm text-slate-400">
              <a href="mailto:info@profitera.it" class="hover:text-white transition">info@profitera.it</a>
              <a href="#" class="hover:text-white transition">Privacy</a>
              <a href="#" class="hover:text-white transition">Termini</a>
            </div>
          </div>
          <div class="border-t border-slate-800 mt-8 pt-8 text-center text-sm text-slate-400">
            <p>&copy; 2025 Profitera. Tutti i diritti riservati.</p>
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
  { icon: 'robot', title: 'Dashboard Automatica', desc: 'Panoramica contabile real-time con KPI e automazione' },
  { icon: 'university', title: 'Bank Control', desc: 'Monitora saldi e movimenti di tutti i conti bancari' },
  { icon: 'file-import', title: 'Import Movimenti', desc: 'Importa CSV/OFX con mapping automatico categorie' },
  { icon: 'check-double', title: 'Conciliazione', desc: 'Riconcilia fatture e movimenti automaticamente' },
  { icon: 'cogs', title: 'Regole Automatiche', desc: 'Categorizza i movimenti ricorrenti senza intervento' },
  { icon: 'book', title: 'Prima Nota', desc: 'Registro di prima nota con categorie personalizzabili' },
  { icon: 'file-invoice-dollar', title: 'Ricavi e Costi', desc: 'Fatture attive, passive, autofatture integrate' },
  { icon: 'chart-bar', title: 'Report Contabile', desc: 'Report mensili/annuali con export PDF ed Excel' },
]

const finanziarioFeatures = [
  { icon: 'sitemap', title: 'Riclassificazione Bilancio', desc: 'Bilancio riclassificato per tipologia e analisi interna' },
  { icon: 'book-open', title: 'Registri', desc: 'Registro economico, contabile e fiscale integrati' },
  { icon: 'chart-line', title: 'Analisi Fatturato', desc: 'Analisi ricavi per cliente, prodotto, periodo' },
  { icon: 'balance-scale', title: 'Break Even Point', desc: 'Calcola il BEP e scopri quando vai in profitto' },
  { icon: 'coins', title: 'Analisi Costi', desc: 'Costi fissi, variabili, gestionali con previsionale' },
  { icon: 'tachometer-alt', title: 'Monitor Finanziario', desc: 'KPI real-time con alert su scostamenti budget' },
]

const starterFeatures = [
  '1 azienda',
  'Contabilità completa',
  'Bank Control',
  'Conciliazione',
  'Prima Nota',
  'Report',
  'Supporto email',
]

const proFeatures = [
  'Tutto di Starter +',
  'Finanziario completo',
  'Riclassificazione bilancio',
  'BEP e analisi costi',
  'Monitor real-time',
  '3 aziende',
  'Supporto prioritario',
]

const businessFeatures = [
  'Tutto di Professional +',
  'Aziende illimitate',
  'White-label',
  'API dedicata',
  'Account manager',
  'SLA 99.9%',
  'Onboarding personalizzato',
]

const faqs = [
  {
    q: 'Serve un commercialista per usare Profitera?',
    a: 'No, Profitera è progettato per imprenditori e amministrativi. Però il commercialista può accedere ai dati esportati per fare bilanci e dichiarazioni fiscali più velocemente.'
  },
  {
    q: 'Come funziona l\'import bancario?',
    a: 'Scarichi i movimenti dalla tua banca in formato CSV o OFX e li importi in Profitera. Il sistema riconosce automaticamente le categorie grazie alle regole intelligenti.'
  },
  {
    q: 'Posso gestire più aziende?',
    a: 'Sì. Il piano Professional include fino a 3 aziende, il Business è illimitato. Basta un click per switchare tra le diverse aziende.'
  },
  {
    q: 'I dati sono al sicuro?',
    a: 'Sì. I server sono in Europa, i dati sono criptati end-to-end, backup giornalieri automatici. Conformi GDPR e standard bancari.'
  },
  {
    q: 'Posso provare prima di acquistare?',
    a: '14 giorni di prova gratuita, nessuna carta richiesta. Accesso completo a tutte le funzionalità del piano scelto.'
  },
  {
    q: 'Posso disdire in qualsiasi momento?',
    a: 'Sì, nessun vincolo contrattuale. Cancelli quando vuoi con un click. Puoi esportare tutti i tuoi dati prima di chiudere l\'account.'
  },
]
</script>
