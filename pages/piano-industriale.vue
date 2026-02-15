<template>
  <div class="space-y-6">
    <!-- Header -->
    <div class="flex items-center justify-between">
      <div>
        <div class="flex items-center gap-2">
          <h1 class="text-3xl font-bold text-slate-800">Piano Industriale 2026-2030</h1>
          <PageInfoButton
            title="Piano Industriale"
            description="Piano industriale quinquennale con executive summary, proiezioni e scenari"
            :features="[
              '4 tab: summary, proiezioni, scenari, allegati',
              'Export PDF completo',
              'Periodo 2026-2030'
            ]"
          />
        </div>
        <p class="text-slate-600 mt-1">Business plan strategico quinquennale</p>
      </div>
      <div class="flex items-center gap-3">
        <select v-model="selectedVersion" class="px-4 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500">
          <option value="v1">Versione 1.0 - Gennaio 2026</option>
          <option value="v2">Versione 2.0 - Draft</option>
        </select>
        <button @click="exportPDF" class="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition flex items-center gap-2">
          <i class="fas fa-file-pdf"></i>
          <span>Esporta PDF</span>
        </button>
      </div>
    </div>

    <!-- Tab Navigation -->
    <div class="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
      <div class="border-b border-slate-200">
        <nav class="flex">
          <button
            v-for="tab in tabs"
            :key="tab.id"
            @click="activeTab = tab.id"
            :class="[
              'px-6 py-4 text-sm font-medium transition-colors relative',
              activeTab === tab.id
                ? 'text-emerald-600 bg-emerald-50'
                : 'text-slate-600 hover:text-slate-800 hover:bg-slate-50'
            ]"
          >
            <i :class="['fas', tab.icon, 'mr-2']"></i>
            {{ tab.label }}
            <div v-if="activeTab === tab.id" class="absolute bottom-0 left-0 right-0 h-0.5 bg-emerald-600"></div>
          </button>
        </nav>
      </div>

      <!-- Tab Content -->
      <div class="p-8">
        <!-- Tab 1: Executive Summary -->
        <div v-if="activeTab === 'summary'" class="space-y-6">
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div class="bg-gradient-to-br from-emerald-50 to-emerald-100 rounded-xl p-6 border border-emerald-200">
              <div class="text-emerald-600 text-sm font-semibold mb-1">Fatturato Target 2030</div>
              <div class="text-3xl font-bold text-emerald-900">€2.5M</div>
              <div class="text-emerald-600 text-xs mt-1">+108% vs 2026</div>
            </div>
            <div class="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-6 border border-blue-200">
              <div class="text-blue-600 text-sm font-semibold mb-1">EBITDA Target</div>
              <div class="text-3xl font-bold text-blue-900">36%</div>
              <div class="text-blue-600 text-xs mt-1">+6pp vs 2026</div>
            </div>
            <div class="bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl p-6 border border-purple-200">
              <div class="text-purple-600 text-sm font-semibold mb-1">Investimenti Previsti</div>
              <div class="text-3xl font-bold text-purple-900">€350K</div>
              <div class="text-purple-600 text-xs mt-1">5 anni</div>
            </div>
            <div class="bg-gradient-to-br from-amber-50 to-amber-100 rounded-xl p-6 border border-amber-200">
              <div class="text-amber-600 text-sm font-semibold mb-1">Espansione Team</div>
              <div class="text-3xl font-bold text-amber-900">+5</div>
              <div class="text-amber-600 text-xs mt-1">3 poltrone, 5 dipendenti</div>
            </div>
          </div>

          <div class="bg-white rounded-xl border border-slate-200 p-6">
            <h3 class="text-lg font-semibold text-slate-800 mb-4">Executive Summary</h3>
            <div class="prose prose-slate max-w-none">
              <p class="text-slate-600 leading-relaxed">
                Il presente Piano Industriale 2026-2030 delinea la strategia quinquennale dello Studio Odontoiatrico Smiledoc per consolidare la propria posizione di leadership nel mercato locale e raggiungere un fatturato di €2.5M entro il 2030, con un margine EBITDA del 36%.
              </p>
              <p class="text-slate-600 leading-relaxed mt-4">
                La strategia si fonda su tre pilastri fondamentali: <strong>crescita organica</strong> attraverso l'incremento delle prestazioni per poltrona e l'acquisizione di nuovi pazienti via marketing digitale; <strong>espansione della capacità produttiva</strong> con l'aggiunta di 3 nuove poltrone e una sede satellite; <strong>differenziazione dell'offerta</strong> con servizi ad alto valore aggiunto come implantologia avanzata, medicina estetica e gnatologia.
              </p>
              <p class="text-slate-600 leading-relaxed mt-4">
                Gli investimenti previsti ammontano a €350,000 distribuiti su 5 anni, focalizzati su attrezzature diagnostiche avanzate (CBCT 3D), nuovi riuniti odontoiatrici, ristrutturazione spazi e marketing digitale. Il ritorno atteso sugli investimenti è stimato tra il 18% e il 40% a seconda della tipologia.
              </p>
              <p class="text-slate-600 leading-relaxed mt-4">
                La posizione finanziaria netta migliorerà progressivamente, passando da -€100K nel 2026 a +€400K nel 2030, garantendo solidità patrimoniale e autonomia finanziaria per future opportunità di crescita.
              </p>
            </div>
          </div>
        </div>

        <!-- Tab 2: Analisi Mercato -->
        <div v-if="activeTab === 'market'" class="space-y-6">
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div class="bg-white rounded-xl border border-slate-200 p-6">
              <div class="flex items-center gap-3 mb-4">
                <div class="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center">
                  <i class="fas fa-globe text-emerald-600 text-xl"></i>
                </div>
                <div>
                  <div class="text-2xl font-bold text-slate-800">€12.8B</div>
                  <div class="text-sm text-slate-600">Mercato Italia</div>
                </div>
              </div>
              <p class="text-xs text-slate-500">Dimensione mercato odontoiatrico italiano (2025)</p>
            </div>

            <div class="bg-white rounded-xl border border-slate-200 p-6">
              <div class="flex items-center gap-3 mb-4">
                <div class="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                  <i class="fas fa-chart-line text-blue-600 text-xl"></i>
                </div>
                <div>
                  <div class="text-2xl font-bold text-slate-800">+3.2%</div>
                  <div class="text-sm text-slate-600">Crescita Annua</div>
                </div>
              </div>
              <p class="text-xs text-slate-500">CAGR atteso 2025-2030</p>
            </div>

            <div class="bg-white rounded-xl border border-slate-200 p-6">
              <div class="flex items-center gap-3 mb-4">
                <div class="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
                  <i class="fas fa-map-marker-alt text-purple-600 text-xl"></i>
                </div>
                <div>
                  <div class="text-2xl font-bold text-slate-800">15%</div>
                  <div class="text-sm text-slate-600">Quota Locale</div>
                </div>
              </div>
              <p class="text-xs text-slate-500">Market share area Monterotondo</p>
            </div>

            <div class="bg-white rounded-xl border border-slate-200 p-6">
              <div class="flex items-center gap-3 mb-4">
                <div class="w-12 h-12 bg-amber-100 rounded-xl flex items-center justify-center">
                  <i class="fas fa-users text-amber-600 text-xl"></i>
                </div>
                <div>
                  <div class="text-2xl font-bold text-slate-800">8</div>
                  <div class="text-sm text-slate-600">Competitor</div>
                </div>
              </div>
              <p class="text-xs text-slate-500">Studi concorrenti diretti in zona</p>
            </div>

            <div class="bg-white rounded-xl border border-slate-200 p-6 md:col-span-2">
              <h4 class="text-sm font-semibold text-slate-800 mb-3">Trend di Mercato</h4>
              <div class="space-y-2">
                <div class="flex items-center justify-between">
                  <span class="text-sm text-slate-600">Implantologia</span>
                  <span class="text-sm font-semibold text-emerald-600">+8%</span>
                </div>
                <div class="w-full bg-slate-100 rounded-full h-2">
                  <div class="bg-emerald-500 h-2 rounded-full" style="width: 80%"></div>
                </div>
                <div class="flex items-center justify-between mt-3">
                  <span class="text-sm text-slate-600">Ortodonzia Invisibile</span>
                  <span class="text-sm font-semibold text-blue-600">+12%</span>
                </div>
                <div class="w-full bg-slate-100 rounded-full h-2">
                  <div class="bg-blue-500 h-2 rounded-full" style="width: 100%"></div>
                </div>
                <div class="flex items-center justify-between mt-3">
                  <span class="text-sm text-slate-600">Estetica Dentale</span>
                  <span class="text-sm font-semibold text-purple-600">+15%</span>
                </div>
                <div class="w-full bg-slate-100 rounded-full h-2">
                  <div class="bg-purple-500 h-2 rounded-full" style="width: 100%"></div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Tab 3: Strategia -->
        <div v-if="activeTab === 'strategy'" class="space-y-6">
          <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div class="bg-white rounded-xl border-2 border-emerald-200 p-6 hover:shadow-lg transition-shadow">
              <div class="w-14 h-14 bg-emerald-100 rounded-2xl flex items-center justify-center mb-4">
                <i class="fas fa-seedling text-emerald-600 text-2xl"></i>
              </div>
              <h3 class="text-xl font-bold text-slate-800 mb-3">Crescita Organica</h3>
              <p class="text-slate-600 mb-4 leading-relaxed">
                Incremento delle prestazioni per poltrona attraverso ottimizzazione dei processi e riduzione dei tempi morti. Acquisizione nuovi pazienti via SEO, Google Ads e campagne social mirate.
              </p>
              <ul class="space-y-2 text-sm text-slate-600">
                <li class="flex items-start gap-2">
                  <i class="fas fa-check-circle text-emerald-600 mt-0.5"></i>
                  <span>Aumento prestazioni/poltrona del 20%</span>
                </li>
                <li class="flex items-start gap-2">
                  <i class="fas fa-check-circle text-emerald-600 mt-0.5"></i>
                  <span>+150 nuovi pazienti/anno</span>
                </li>
                <li class="flex items-start gap-2">
                  <i class="fas fa-check-circle text-emerald-600 mt-0.5"></i>
                  <span>Budget marketing €20K/anno</span>
                </li>
              </ul>
            </div>

            <div class="bg-white rounded-xl border-2 border-blue-200 p-6 hover:shadow-lg transition-shadow">
              <div class="w-14 h-14 bg-blue-100 rounded-2xl flex items-center justify-center mb-4">
                <i class="fas fa-expand-arrows-alt text-blue-600 text-2xl"></i>
              </div>
              <h3 class="text-xl font-bold text-slate-800 mb-3">Espansione Capacità</h3>
              <p class="text-slate-600 mb-4 leading-relaxed">
                Investimento in nuove poltrone e apertura sede satellite per servire aree limitrofe. Ampliamento team medico e assistenti specializzati.
              </p>
              <ul class="space-y-2 text-sm text-slate-600">
                <li class="flex items-start gap-2">
                  <i class="fas fa-check-circle text-blue-600 mt-0.5"></i>
                  <span>+3 poltrone operative entro 2029</span>
                </li>
                <li class="flex items-start gap-2">
                  <i class="fas fa-check-circle text-blue-600 mt-0.5"></i>
                  <span>Nuova sede satellite 2029</span>
                </li>
                <li class="flex items-start gap-2">
                  <i class="fas fa-check-circle text-blue-600 mt-0.5"></i>
                  <span>+2 odontoiatri, +3 assistenti</span>
                </li>
              </ul>
            </div>

            <div class="bg-white rounded-xl border-2 border-purple-200 p-6 hover:shadow-lg transition-shadow">
              <div class="w-14 h-14 bg-purple-100 rounded-2xl flex items-center justify-center mb-4">
                <i class="fas fa-star text-purple-600 text-2xl"></i>
              </div>
              <h3 class="text-xl font-bold text-slate-800 mb-3">Differenziazione</h3>
              <p class="text-slate-600 mb-4 leading-relaxed">
                Posizionamento premium con servizi ad alto valore: implantologia avanzata, medicina estetica del volto, gnatologia e disturbi ATM.
              </p>
              <ul class="space-y-2 text-sm text-slate-600">
                <li class="flex items-start gap-2">
                  <i class="fas fa-check-circle text-purple-600 mt-0.5"></i>
                  <span>Medicina estetica integrata</span>
                </li>
                <li class="flex items-start gap-2">
                  <i class="fas fa-check-circle text-purple-600 mt-0.5"></i>
                  <span>Centro di riferimento gnatologia</span>
                </li>
                <li class="flex items-start gap-2">
                  <i class="fas fa-check-circle text-purple-600 mt-0.5"></i>
                  <span>Impianti All-on-4/6 specializzati</span>
                </li>
              </ul>
            </div>
          </div>
        </div>

        <!-- Tab 4: Proiezioni -->
        <div v-if="activeTab === 'projections'" class="space-y-6">
          <div class="bg-white rounded-xl border border-slate-200 overflow-hidden">
            <div class="overflow-x-auto">
              <table class="w-full">
                <thead>
                  <tr class="bg-slate-50 border-b border-slate-200">
                    <th class="px-6 py-4 text-left text-sm font-semibold text-slate-700">Voce</th>
                    <th class="px-6 py-4 text-right text-sm font-semibold text-slate-700">2026</th>
                    <th class="px-6 py-4 text-right text-sm font-semibold text-slate-700">2027</th>
                    <th class="px-6 py-4 text-right text-sm font-semibold text-slate-700">2028</th>
                    <th class="px-6 py-4 text-right text-sm font-semibold text-slate-700">2029</th>
                    <th class="px-6 py-4 text-right text-sm font-semibold text-slate-700 bg-emerald-50">2030</th>
                  </tr>
                </thead>
                <tbody class="divide-y divide-slate-100">
                  <tr class="hover:bg-slate-50">
                    <td class="px-6 py-4 text-sm font-medium text-slate-800">Ricavi</td>
                    <td class="px-6 py-4 text-sm text-right text-slate-700">€1.200.000</td>
                    <td class="px-6 py-4 text-sm text-right text-slate-700">€1.500.000</td>
                    <td class="px-6 py-4 text-sm text-right text-slate-700">€1.800.000</td>
                    <td class="px-6 py-4 text-sm text-right text-slate-700">€2.100.000</td>
                    <td class="px-6 py-4 text-sm text-right font-semibold text-emerald-600 bg-emerald-50">€2.500.000</td>
                  </tr>
                  <tr class="hover:bg-slate-50">
                    <td class="px-6 py-4 text-sm font-medium text-slate-800">Costi Operativi</td>
                    <td class="px-6 py-4 text-sm text-right text-slate-700">€840.000</td>
                    <td class="px-6 py-4 text-sm text-right text-slate-700">€1.000.000</td>
                    <td class="px-6 py-4 text-sm text-right text-slate-700">€1.200.000</td>
                    <td class="px-6 py-4 text-sm text-right text-slate-700">€1.350.000</td>
                    <td class="px-6 py-4 text-sm text-right font-semibold text-slate-700 bg-emerald-50">€1.600.000</td>
                  </tr>
                  <tr class="hover:bg-slate-50 bg-blue-50">
                    <td class="px-6 py-4 text-sm font-semibold text-slate-800">EBITDA</td>
                    <td class="px-6 py-4 text-sm text-right font-semibold text-blue-700">€360.000</td>
                    <td class="px-6 py-4 text-sm text-right font-semibold text-blue-700">€500.000</td>
                    <td class="px-6 py-4 text-sm text-right font-semibold text-blue-700">€600.000</td>
                    <td class="px-6 py-4 text-sm text-right font-semibold text-blue-700">€750.000</td>
                    <td class="px-6 py-4 text-sm text-right font-bold text-blue-700 bg-blue-100">€900.000</td>
                  </tr>
                  <tr class="hover:bg-slate-50">
                    <td class="px-6 py-4 text-sm font-medium text-slate-800">EBITDA %</td>
                    <td class="px-6 py-4 text-sm text-right text-slate-700">30%</td>
                    <td class="px-6 py-4 text-sm text-right text-slate-700">33%</td>
                    <td class="px-6 py-4 text-sm text-right text-slate-700">33%</td>
                    <td class="px-6 py-4 text-sm text-right text-slate-700">36%</td>
                    <td class="px-6 py-4 text-sm text-right font-semibold text-emerald-600 bg-emerald-50">36%</td>
                  </tr>
                  <tr class="hover:bg-slate-50">
                    <td class="px-6 py-4 text-sm font-medium text-slate-800">Ammortamenti</td>
                    <td class="px-6 py-4 text-sm text-right text-slate-700">€80.000</td>
                    <td class="px-6 py-4 text-sm text-right text-slate-700">€100.000</td>
                    <td class="px-6 py-4 text-sm text-right text-slate-700">€120.000</td>
                    <td class="px-6 py-4 text-sm text-right text-slate-700">€140.000</td>
                    <td class="px-6 py-4 text-sm text-right font-semibold text-slate-700 bg-emerald-50">€160.000</td>
                  </tr>
                  <tr class="hover:bg-slate-50">
                    <td class="px-6 py-4 text-sm font-medium text-slate-800">Oneri Finanziari</td>
                    <td class="px-6 py-4 text-sm text-right text-slate-700">€20.000</td>
                    <td class="px-6 py-4 text-sm text-right text-slate-700">€30.000</td>
                    <td class="px-6 py-4 text-sm text-right text-slate-700">€35.000</td>
                    <td class="px-6 py-4 text-sm text-right text-slate-700">€40.000</td>
                    <td class="px-6 py-4 text-sm text-right font-semibold text-slate-700 bg-emerald-50">€45.000</td>
                  </tr>
                  <tr class="hover:bg-slate-50">
                    <td class="px-6 py-4 text-sm font-medium text-slate-800">Imposte (24%)</td>
                    <td class="px-6 py-4 text-sm text-right text-slate-700">€60.000</td>
                    <td class="px-6 py-4 text-sm text-right text-slate-700">€90.000</td>
                    <td class="px-6 py-4 text-sm text-right text-slate-700">€105.000</td>
                    <td class="px-6 py-4 text-sm text-right text-slate-700">€140.000</td>
                    <td class="px-6 py-4 text-sm text-right font-semibold text-slate-700 bg-emerald-50">€165.000</td>
                  </tr>
                  <tr class="hover:bg-slate-50 bg-emerald-50">
                    <td class="px-6 py-4 text-sm font-bold text-slate-800">Utile Netto</td>
                    <td class="px-6 py-4 text-sm text-right font-bold text-emerald-700">€200.000</td>
                    <td class="px-6 py-4 text-sm text-right font-bold text-emerald-700">€280.000</td>
                    <td class="px-6 py-4 text-sm text-right font-bold text-emerald-700">€340.000</td>
                    <td class="px-6 py-4 text-sm text-right font-bold text-emerald-700">€430.000</td>
                    <td class="px-6 py-4 text-sm text-right font-extrabold text-emerald-700 bg-emerald-100">€520.000</td>
                  </tr>
                  <tr class="hover:bg-slate-50">
                    <td class="px-6 py-4 text-sm font-medium text-slate-800">Cash Flow Operativo</td>
                    <td class="px-6 py-4 text-sm text-right text-slate-700">€250.000</td>
                    <td class="px-6 py-4 text-sm text-right text-slate-700">€350.000</td>
                    <td class="px-6 py-4 text-sm text-right text-slate-700">€420.000</td>
                    <td class="px-6 py-4 text-sm text-right text-slate-700">€530.000</td>
                    <td class="px-6 py-4 text-sm text-right font-semibold text-slate-700 bg-emerald-50">€640.000</td>
                  </tr>
                  <tr class="hover:bg-slate-50">
                    <td class="px-6 py-4 text-sm font-medium text-slate-800">PFN (Posizione Fin. Netta)</td>
                    <td class="px-6 py-4 text-sm text-right text-red-600">-€100.000</td>
                    <td class="px-6 py-4 text-sm text-right text-red-600">-€50.000</td>
                    <td class="px-6 py-4 text-sm text-right text-emerald-600">+€50.000</td>
                    <td class="px-6 py-4 text-sm text-right text-emerald-600">+€200.000</td>
                    <td class="px-6 py-4 text-sm text-right font-bold text-emerald-600 bg-emerald-50">+€400.000</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <!-- Revenue Growth Chart -->
          <div class="bg-white rounded-xl border border-slate-200 p-6">
            <h3 class="text-lg font-semibold text-slate-800 mb-6">Crescita Ricavi 2026-2030</h3>
            <div class="space-y-3">
              <div v-for="year in revenueData" :key="year.year" class="flex items-center gap-4">
                <div class="w-16 text-sm font-medium text-slate-700">{{ year.year }}</div>
                <div class="flex-1">
                  <div class="w-full bg-slate-100 rounded-full h-8 relative overflow-hidden">
                    <div
                      class="bg-gradient-to-r from-emerald-500 to-emerald-600 h-8 rounded-full flex items-center justify-end px-4 transition-all duration-1000"
                      :style="{ width: year.percentage + '%' }"
                    >
                      <span class="text-white text-sm font-semibold">{{ year.amount }}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Tab 5: Investimenti -->
        <div v-if="activeTab === 'investments'" class="space-y-6">
          <div class="bg-white rounded-xl border border-slate-200 overflow-hidden">
            <div class="overflow-x-auto">
              <table class="w-full">
                <thead>
                  <tr class="bg-slate-50 border-b border-slate-200">
                    <th class="px-6 py-4 text-left text-sm font-semibold text-slate-700">Investimento</th>
                    <th class="px-6 py-4 text-center text-sm font-semibold text-slate-700">Anno</th>
                    <th class="px-6 py-4 text-right text-sm font-semibold text-slate-700">Importo</th>
                    <th class="px-6 py-4 text-center text-sm font-semibold text-slate-700">Tipo</th>
                    <th class="px-6 py-4 text-right text-sm font-semibold text-slate-700">ROI Atteso</th>
                  </tr>
                </thead>
                <tbody class="divide-y divide-slate-100">
                  <tr class="hover:bg-slate-50">
                    <td class="px-6 py-4">
                      <div class="flex items-center gap-3">
                        <div class="w-10 h-10 bg-emerald-100 rounded-lg flex items-center justify-center">
                          <i class="fas fa-teeth text-emerald-600"></i>
                        </div>
                        <div>
                          <div class="text-sm font-medium text-slate-800">Riunito Odontoiatrico x2</div>
                          <div class="text-xs text-slate-500">Nuove poltrone operative</div>
                        </div>
                      </div>
                    </td>
                    <td class="px-6 py-4 text-center">
                      <span class="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-700">2026</span>
                    </td>
                    <td class="px-6 py-4 text-right text-sm font-semibold text-slate-800">€80.000</td>
                    <td class="px-6 py-4 text-center">
                      <span class="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-700">Attrezzatura</span>
                    </td>
                    <td class="px-6 py-4 text-right text-sm font-semibold text-emerald-600">25%</td>
                  </tr>
                  <tr class="hover:bg-slate-50">
                    <td class="px-6 py-4">
                      <div class="flex items-center gap-3">
                        <div class="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                          <i class="fas fa-x-ray text-blue-600"></i>
                        </div>
                        <div>
                          <div class="text-sm font-medium text-slate-800">CBCT 3D</div>
                          <div class="text-xs text-slate-500">Scanner tomografico digitale</div>
                        </div>
                      </div>
                    </td>
                    <td class="px-6 py-4 text-center">
                      <span class="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-700">2027</span>
                    </td>
                    <td class="px-6 py-4 text-right text-sm font-semibold text-slate-800">€120.000</td>
                    <td class="px-6 py-4 text-center">
                      <span class="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-700">Attrezzatura</span>
                    </td>
                    <td class="px-6 py-4 text-right text-sm font-semibold text-emerald-600">30%</td>
                  </tr>
                  <tr class="hover:bg-slate-50">
                    <td class="px-6 py-4">
                      <div class="flex items-center gap-3">
                        <div class="w-10 h-10 bg-amber-100 rounded-lg flex items-center justify-center">
                          <i class="fas fa-building text-amber-600"></i>
                        </div>
                        <div>
                          <div class="text-sm font-medium text-slate-800">Ristrutturazione Sala</div>
                          <div class="text-xs text-slate-500">Ampliamento spazi operativi</div>
                        </div>
                      </div>
                    </td>
                    <td class="px-6 py-4 text-center">
                      <span class="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-700">2027</span>
                    </td>
                    <td class="px-6 py-4 text-right text-sm font-semibold text-slate-800">€50.000</td>
                    <td class="px-6 py-4 text-center">
                      <span class="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-cyan-100 text-cyan-700">Immobile</span>
                    </td>
                    <td class="px-6 py-4 text-right text-sm font-semibold text-emerald-600">15%</td>
                  </tr>
                  <tr class="hover:bg-slate-50">
                    <td class="px-6 py-4">
                      <div class="flex items-center gap-3">
                        <div class="w-10 h-10 bg-pink-100 rounded-lg flex items-center justify-center">
                          <i class="fas fa-bullhorn text-pink-600"></i>
                        </div>
                        <div>
                          <div class="text-sm font-medium text-slate-800">Marketing Digitale</div>
                          <div class="text-xs text-slate-500">SEO, Google Ads, Social Media</div>
                        </div>
                      </div>
                    </td>
                    <td class="px-6 py-4 text-center">
                      <span class="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-emerald-100 text-emerald-700">2026-2030</span>
                    </td>
                    <td class="px-6 py-4 text-right text-sm font-semibold text-slate-800">€20.000/anno</td>
                    <td class="px-6 py-4 text-center">
                      <span class="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-pink-100 text-pink-700">Marketing</span>
                    </td>
                    <td class="px-6 py-4 text-right text-sm font-semibold text-emerald-600">40%</td>
                  </tr>
                  <tr class="hover:bg-slate-50">
                    <td class="px-6 py-4">
                      <div class="flex items-center gap-3">
                        <div class="w-10 h-10 bg-indigo-100 rounded-lg flex items-center justify-center">
                          <i class="fas fa-laptop-code text-indigo-600"></i>
                        </div>
                        <div>
                          <div class="text-sm font-medium text-slate-800">Software Gestionale</div>
                          <div class="text-xs text-slate-500">CRM, agenda, cartelle digitali</div>
                        </div>
                      </div>
                    </td>
                    <td class="px-6 py-4 text-center">
                      <span class="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-700">2026</span>
                    </td>
                    <td class="px-6 py-4 text-right text-sm font-semibold text-slate-800">€30.000</td>
                    <td class="px-6 py-4 text-center">
                      <span class="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-indigo-100 text-indigo-700">IT</span>
                    </td>
                    <td class="px-6 py-4 text-right text-sm font-semibold text-emerald-600">20%</td>
                  </tr>
                  <tr class="hover:bg-slate-50 bg-amber-50">
                    <td class="px-6 py-4">
                      <div class="flex items-center gap-3">
                        <div class="w-10 h-10 bg-amber-200 rounded-lg flex items-center justify-center">
                          <i class="fas fa-map-marked-alt text-amber-700"></i>
                        </div>
                        <div>
                          <div class="text-sm font-medium text-slate-800">Nuova Sede Satellite</div>
                          <div class="text-xs text-slate-500">Espansione geografica</div>
                        </div>
                      </div>
                    </td>
                    <td class="px-6 py-4 text-center">
                      <span class="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-amber-200 text-amber-800">2029</span>
                    </td>
                    <td class="px-6 py-4 text-right text-sm font-bold text-slate-800">€150.000</td>
                    <td class="px-6 py-4 text-center">
                      <span class="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-cyan-100 text-cyan-700">Immobile</span>
                    </td>
                    <td class="px-6 py-4 text-right text-sm font-semibold text-emerald-600">18%</td>
                  </tr>
                </tbody>
                <tfoot class="bg-slate-50 border-t-2 border-slate-300">
                  <tr>
                    <td colspan="2" class="px-6 py-4 text-sm font-bold text-slate-800">TOTALE INVESTIMENTI</td>
                    <td class="px-6 py-4 text-right text-lg font-bold text-emerald-600">€350.000</td>
                    <td colspan="2"></td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div class="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-6 border border-blue-200">
              <div class="text-blue-600 text-sm font-semibold mb-1">ROI Medio Ponderato</div>
              <div class="text-3xl font-bold text-blue-900">24.5%</div>
            </div>
            <div class="bg-gradient-to-br from-emerald-50 to-emerald-100 rounded-xl p-6 border border-emerald-200">
              <div class="text-emerald-600 text-sm font-semibold mb-1">Payback Period</div>
              <div class="text-3xl font-bold text-emerald-900">3.2 anni</div>
            </div>
            <div class="bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl p-6 border border-purple-200">
              <div class="text-purple-600 text-sm font-semibold mb-1">VAN (r=8%)</div>
              <div class="text-3xl font-bold text-purple-900">€1.2M</div>
            </div>
          </div>
        </div>

        <!-- Tab 6: Scenari -->
        <div v-if="activeTab === 'scenarios'" class="space-y-6">
          <div class="bg-amber-50 border border-amber-200 rounded-xl p-6">
            <div class="flex items-start gap-3">
              <i class="fas fa-info-circle text-amber-600 text-xl mt-0.5"></i>
              <div>
                <h4 class="text-sm font-semibold text-amber-900 mb-1">Analisi di Sensibilità</h4>
                <p class="text-sm text-amber-700">
                  Le proiezioni sottostanti rappresentano tre scenari basati su diverse ipotesi di crescita e condizioni di mercato.
                  Lo scenario Base riflette le previsioni più probabili.
                </p>
              </div>
            </div>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
            <!-- Pessimistic Scenario -->
            <div class="bg-white rounded-xl border-2 border-red-200 overflow-hidden">
              <div class="bg-gradient-to-r from-red-500 to-red-600 px-6 py-4">
                <h3 class="text-lg font-bold text-white flex items-center gap-2">
                  <i class="fas fa-exclamation-triangle"></i>
                  Scenario Pessimistico
                </h3>
              </div>
              <div class="p-6 space-y-4">
                <div>
                  <div class="text-xs text-slate-500 uppercase tracking-wide mb-1">Ricavi 2030</div>
                  <div class="text-2xl font-bold text-red-600">€1.8M</div>
                  <div class="text-xs text-red-600">Crescita +50%</div>
                </div>
                <div>
                  <div class="text-xs text-slate-500 uppercase tracking-wide mb-1">EBITDA 2030</div>
                  <div class="text-2xl font-bold text-slate-700">18%</div>
                  <div class="text-xs text-slate-500">€324K</div>
                </div>
                <div>
                  <div class="text-xs text-slate-500 uppercase tracking-wide mb-1">Utile Netto 2030</div>
                  <div class="text-2xl font-bold text-slate-700">€180.000</div>
                </div>
                <div class="border-t border-slate-200 pt-4 mt-4">
                  <h4 class="text-xs font-semibold text-slate-700 mb-2">Ipotesi</h4>
                  <ul class="space-y-1 text-xs text-slate-600">
                    <li class="flex items-start gap-2">
                      <i class="fas fa-minus-circle text-red-500 mt-0.5"></i>
                      <span>Crescita mercato +1%</span>
                    </li>
                    <li class="flex items-start gap-2">
                      <i class="fas fa-minus-circle text-red-500 mt-0.5"></i>
                      <span>Aumento competitor</span>
                    </li>
                    <li class="flex items-start gap-2">
                      <i class="fas fa-minus-circle text-red-500 mt-0.5"></i>
                      <span>Costi superiori +15%</span>
                    </li>
                    <li class="flex items-start gap-2">
                      <i class="fas fa-minus-circle text-red-500 mt-0.5"></i>
                      <span>Ritardi investimenti</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            <!-- Base Scenario -->
            <div class="bg-white rounded-xl border-2 border-blue-300 overflow-hidden shadow-lg">
              <div class="bg-gradient-to-r from-blue-500 to-blue-600 px-6 py-4">
                <h3 class="text-lg font-bold text-white flex items-center gap-2">
                  <i class="fas fa-chart-line"></i>
                  Scenario Base
                </h3>
                <div class="text-xs text-blue-100 mt-1">Previsione più probabile</div>
              </div>
              <div class="p-6 space-y-4">
                <div>
                  <div class="text-xs text-slate-500 uppercase tracking-wide mb-1">Ricavi 2030</div>
                  <div class="text-2xl font-bold text-blue-600">€2.5M</div>
                  <div class="text-xs text-blue-600">Crescita +108%</div>
                </div>
                <div>
                  <div class="text-xs text-slate-500 uppercase tracking-wide mb-1">EBITDA 2030</div>
                  <div class="text-2xl font-bold text-slate-700">36%</div>
                  <div class="text-xs text-slate-500">€900K</div>
                </div>
                <div>
                  <div class="text-xs text-slate-500 uppercase tracking-wide mb-1">Utile Netto 2030</div>
                  <div class="text-2xl font-bold text-slate-700">€520.000</div>
                </div>
                <div class="border-t border-slate-200 pt-4 mt-4">
                  <h4 class="text-xs font-semibold text-slate-700 mb-2">Ipotesi</h4>
                  <ul class="space-y-1 text-xs text-slate-600">
                    <li class="flex items-start gap-2">
                      <i class="fas fa-check-circle text-blue-500 mt-0.5"></i>
                      <span>Crescita mercato +3.2%</span>
                    </li>
                    <li class="flex items-start gap-2">
                      <i class="fas fa-check-circle text-blue-500 mt-0.5"></i>
                      <span>Piano investimenti completo</span>
                    </li>
                    <li class="flex items-start gap-2">
                      <i class="fas fa-check-circle text-blue-500 mt-0.5"></i>
                      <span>Marketing efficace</span>
                    </li>
                    <li class="flex items-start gap-2">
                      <i class="fas fa-check-circle text-blue-500 mt-0.5"></i>
                      <span>Prezzi stabili</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            <!-- Optimistic Scenario -->
            <div class="bg-white rounded-xl border-2 border-emerald-200 overflow-hidden">
              <div class="bg-gradient-to-r from-emerald-500 to-emerald-600 px-6 py-4">
                <h3 class="text-lg font-bold text-white flex items-center gap-2">
                  <i class="fas fa-rocket"></i>
                  Scenario Ottimistico
                </h3>
              </div>
              <div class="p-6 space-y-4">
                <div>
                  <div class="text-xs text-slate-500 uppercase tracking-wide mb-1">Ricavi 2030</div>
                  <div class="text-2xl font-bold text-emerald-600">€3.2M</div>
                  <div class="text-xs text-emerald-600">Crescita +167%</div>
                </div>
                <div>
                  <div class="text-xs text-slate-500 uppercase tracking-wide mb-1">EBITDA 2030</div>
                  <div class="text-2xl font-bold text-slate-700">40%</div>
                  <div class="text-xs text-slate-500">€1.28M</div>
                </div>
                <div>
                  <div class="text-xs text-slate-500 uppercase tracking-wide mb-1">Utile Netto 2030</div>
                  <div class="text-2xl font-bold text-slate-700">€780.000</div>
                </div>
                <div class="border-t border-slate-200 pt-4 mt-4">
                  <h4 class="text-xs font-semibold text-slate-700 mb-2">Ipotesi</h4>
                  <ul class="space-y-1 text-xs text-slate-600">
                    <li class="flex items-start gap-2">
                      <i class="fas fa-star text-emerald-500 mt-0.5"></i>
                      <span>Crescita mercato +5%</span>
                    </li>
                    <li class="flex items-start gap-2">
                      <i class="fas fa-star text-emerald-500 mt-0.5"></i>
                      <span>Acquisizione competitor</span>
                    </li>
                    <li class="flex items-start gap-2">
                      <i class="fas fa-star text-emerald-500 mt-0.5"></i>
                      <span>Economie di scala</span>
                    </li>
                    <li class="flex items-start gap-2">
                      <i class="fas fa-star text-emerald-500 mt-0.5"></i>
                      <span>Premium pricing</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          <!-- Sensitivity Variables -->
          <div class="bg-white rounded-xl border border-slate-200 p-6">
            <h3 class="text-lg font-semibold text-slate-800 mb-4">Variabili Critiche</h3>
            <div class="space-y-4">
              <div>
                <div class="flex items-center justify-between mb-2">
                  <label class="text-sm font-medium text-slate-700">Crescita Ricavi Annua (%)</label>
                  <span class="text-sm font-semibold text-emerald-600">+20%</span>
                </div>
                <input type="range" min="5" max="35" value="20" class="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer slider-emerald">
                <div class="flex justify-between text-xs text-slate-500 mt-1">
                  <span>5%</span>
                  <span>35%</span>
                </div>
              </div>
              <div>
                <div class="flex items-center justify-between mb-2">
                  <label class="text-sm font-medium text-slate-700">Riduzione Costi (%)</label>
                  <span class="text-sm font-semibold text-blue-600">-5%</span>
                </div>
                <input type="range" min="0" max="15" value="5" class="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer slider-blue">
                <div class="flex justify-between text-xs text-slate-500 mt-1">
                  <span>0%</span>
                  <span>15%</span>
                </div>
              </div>
              <div>
                <div class="flex items-center justify-between mb-2">
                  <label class="text-sm font-medium text-slate-700">Investimenti Aggiuntivi (€K)</label>
                  <span class="text-sm font-semibold text-purple-600">€50K</span>
                </div>
                <input type="range" min="0" max="200" value="50" step="10" class="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer slider-purple">
                <div class="flex justify-between text-xs text-slate-500 mt-1">
                  <span>€0</span>
                  <span>€200K</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  middleware: 'auth'
})

const selectedVersion = ref('v1')
const activeTab = ref('summary')

const tabs = [
  { id: 'summary', label: 'Executive Summary', icon: 'fa-file-alt' },
  { id: 'market', label: 'Analisi Mercato', icon: 'fa-chart-pie' },
  { id: 'strategy', label: 'Strategia', icon: 'fa-chess' },
  { id: 'projections', label: 'Proiezioni', icon: 'fa-chart-line' },
  { id: 'investments', label: 'Investimenti', icon: 'fa-coins' },
  { id: 'scenarios', label: 'Scenari', icon: 'fa-sitemap' }
]

const revenueData = [
  { year: '2026', amount: '€1.2M', percentage: 48 },
  { year: '2027', amount: '€1.5M', percentage: 60 },
  { year: '2028', amount: '€1.8M', percentage: 72 },
  { year: '2029', amount: '€2.1M', percentage: 84 },
  { year: '2030', amount: '€2.5M', percentage: 100 }
]

const exportPDF = async () => {
  try {
    const { data } = await useFetch('/api/piano-industriale/export-pdf')
    if (data.value) {
      alert('PDF generato con successo! (Mock)')
    }
  } catch (error) {
    console.error('Export failed:', error)
  }
}
</script>

<style scoped>
.slider-emerald::-webkit-slider-thumb {
  appearance: none;
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background: #059669;
  cursor: pointer;
}

.slider-blue::-webkit-slider-thumb {
  appearance: none;
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background: #3b82f6;
  cursor: pointer;
}

.slider-purple::-webkit-slider-thumb {
  appearance: none;
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background: #a855f7;
  cursor: pointer;
}

.slider-emerald::-moz-range-thumb {
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background: #059669;
  cursor: pointer;
  border: none;
}

.slider-blue::-moz-range-thumb {
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background: #3b82f6;
  cursor: pointer;
  border: none;
}

.slider-purple::-moz-range-thumb {
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background: #a855f7;
  cursor: pointer;
  border: none;
}
</style>
