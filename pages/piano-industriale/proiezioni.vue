<template>
  <div class="space-y-6">
    <!-- Header -->
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-3xl font-bold text-slate-800">Proiezioni Economico-Finanziarie</h1>
        <p class="text-slate-600 mt-1">Dettaglio quinquennale Conto Economico, Stato Patrimoniale, Cash Flow</p>
      </div>
      <div class="flex items-center gap-3">
        <button @click="exportExcel" class="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition flex items-center gap-2">
          <i class="fas fa-file-excel"></i>
          <span>Esporta Excel</span>
        </button>
      </div>
    </div>

    <!-- Tab Navigation -->
    <div class="bg-white rounded-xl border border-slate-200">
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

      <div class="p-8">
        <!-- Conto Economico -->
        <div v-if="activeTab === 'ce'" class="overflow-x-auto">
          <table class="w-full">
            <thead>
              <tr class="bg-slate-50 border-b-2 border-slate-300">
                <th class="px-6 py-4 text-left text-sm font-bold text-slate-800">Conto Economico</th>
                <th class="px-6 py-4 text-right text-sm font-semibold text-slate-700">2026</th>
                <th class="px-6 py-4 text-right text-sm font-semibold text-slate-700">2027</th>
                <th class="px-6 py-4 text-right text-sm font-semibold text-slate-700">2028</th>
                <th class="px-6 py-4 text-right text-sm font-semibold text-slate-700">2029</th>
                <th class="px-6 py-4 text-right text-sm font-semibold text-slate-700 bg-emerald-50">2030</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-slate-100">
              <tr class="bg-blue-50">
                <td class="px-6 py-3 text-sm font-bold text-slate-800">RICAVI</td>
                <td class="px-6 py-3 text-sm text-right font-bold text-blue-700">€1.200.000</td>
                <td class="px-6 py-3 text-sm text-right font-bold text-blue-700">€1.500.000</td>
                <td class="px-6 py-3 text-sm text-right font-bold text-blue-700">€1.800.000</td>
                <td class="px-6 py-3 text-sm text-right font-bold text-blue-700">€2.100.000</td>
                <td class="px-6 py-3 text-sm text-right font-bold text-blue-700 bg-blue-100">€2.500.000</td>
              </tr>
              <tr class="hover:bg-slate-50">
                <td class="px-6 py-3 text-sm text-slate-700 pl-10">Prestazioni Odontoiatriche</td>
                <td class="px-6 py-3 text-sm text-right text-slate-700">€900.000</td>
                <td class="px-6 py-3 text-sm text-right text-slate-700">€1.100.000</td>
                <td class="px-6 py-3 text-sm text-right text-slate-700">€1.300.000</td>
                <td class="px-6 py-3 text-sm text-right text-slate-700">€1.500.000</td>
                <td class="px-6 py-3 text-sm text-right text-slate-700 bg-emerald-50">€1.700.000</td>
              </tr>
              <tr class="hover:bg-slate-50">
                <td class="px-6 py-3 text-sm text-slate-700 pl-10">Implantologia</td>
                <td class="px-6 py-3 text-sm text-right text-slate-700">€200.000</td>
                <td class="px-6 py-3 text-sm text-right text-slate-700">€250.000</td>
                <td class="px-6 py-3 text-sm text-right text-slate-700">€320.000</td>
                <td class="px-6 py-3 text-sm text-right text-slate-700">€400.000</td>
                <td class="px-6 py-3 text-sm text-right text-slate-700 bg-emerald-50">€500.000</td>
              </tr>
              <tr class="hover:bg-slate-50">
                <td class="px-6 py-3 text-sm text-slate-700 pl-10">Medicina Estetica</td>
                <td class="px-6 py-3 text-sm text-right text-slate-700">€100.000</td>
                <td class="px-6 py-3 text-sm text-right text-slate-700">€150.000</td>
                <td class="px-6 py-3 text-sm text-right text-slate-700">€180.000</td>
                <td class="px-6 py-3 text-sm text-right text-slate-700">€200.000</td>
                <td class="px-6 py-3 text-sm text-right text-slate-700 bg-emerald-50">€300.000</td>
              </tr>

              <tr class="bg-red-50 border-t-2 border-slate-200">
                <td class="px-6 py-3 text-sm font-bold text-slate-800">COSTI OPERATIVI</td>
                <td class="px-6 py-3 text-sm text-right font-bold text-red-700">€840.000</td>
                <td class="px-6 py-3 text-sm text-right font-bold text-red-700">€1.000.000</td>
                <td class="px-6 py-3 text-sm text-right font-bold text-red-700">€1.200.000</td>
                <td class="px-6 py-3 text-sm text-right font-bold text-red-700">€1.350.000</td>
                <td class="px-6 py-3 text-sm text-right font-bold text-red-700 bg-red-100">€1.600.000</td>
              </tr>
              <tr class="hover:bg-slate-50">
                <td class="px-6 py-3 text-sm text-slate-700 pl-10">Materiali e Laboratorio</td>
                <td class="px-6 py-3 text-sm text-right text-slate-700">€180.000</td>
                <td class="px-6 py-3 text-sm text-right text-slate-700">€225.000</td>
                <td class="px-6 py-3 text-sm text-right text-slate-700">€270.000</td>
                <td class="px-6 py-3 text-sm text-right text-slate-700">€315.000</td>
                <td class="px-6 py-3 text-sm text-right text-slate-700 bg-emerald-50">€375.000</td>
              </tr>
              <tr class="hover:bg-slate-50">
                <td class="px-6 py-3 text-sm text-slate-700 pl-10">Personale</td>
                <td class="px-6 py-3 text-sm text-right text-slate-700">€400.000</td>
                <td class="px-6 py-3 text-sm text-right text-slate-700">€480.000</td>
                <td class="px-6 py-3 text-sm text-right text-slate-700">€570.000</td>
                <td class="px-6 py-3 text-sm text-right text-slate-700">€640.000</td>
                <td class="px-6 py-3 text-sm text-right text-slate-700 bg-emerald-50">€750.000</td>
              </tr>
              <tr class="hover:bg-slate-50">
                <td class="px-6 py-3 text-sm text-slate-700 pl-10">Affitti e Utenze</td>
                <td class="px-6 py-3 text-sm text-right text-slate-700">€120.000</td>
                <td class="px-6 py-3 text-sm text-right text-slate-700">€130.000</td>
                <td class="px-6 py-3 text-sm text-right text-slate-700">€140.000</td>
                <td class="px-6 py-3 text-sm text-right text-slate-700">€155.000</td>
                <td class="px-6 py-3 text-sm text-right text-slate-700 bg-emerald-50">€180.000</td>
              </tr>
              <tr class="hover:bg-slate-50">
                <td class="px-6 py-3 text-sm text-slate-700 pl-10">Marketing</td>
                <td class="px-6 py-3 text-sm text-right text-slate-700">€20.000</td>
                <td class="px-6 py-3 text-sm text-right text-slate-700">€20.000</td>
                <td class="px-6 py-3 text-sm text-right text-slate-700">€20.000</td>
                <td class="px-6 py-3 text-sm text-right text-slate-700">€20.000</td>
                <td class="px-6 py-3 text-sm text-right text-slate-700 bg-emerald-50">€20.000</td>
              </tr>
              <tr class="hover:bg-slate-50">
                <td class="px-6 py-3 text-sm text-slate-700 pl-10">Altri Costi Operativi</td>
                <td class="px-6 py-3 text-sm text-right text-slate-700">€120.000</td>
                <td class="px-6 py-3 text-sm text-right text-slate-700">€145.000</td>
                <td class="px-6 py-3 text-sm text-right text-slate-700">€200.000</td>
                <td class="px-6 py-3 text-sm text-right text-slate-700">€220.000</td>
                <td class="px-6 py-3 text-sm text-right text-slate-700 bg-emerald-50">€275.000</td>
              </tr>

              <tr class="bg-emerald-50 border-t-2 border-slate-200">
                <td class="px-6 py-4 text-sm font-bold text-slate-800">EBITDA</td>
                <td class="px-6 py-4 text-sm text-right font-bold text-emerald-700">€360.000</td>
                <td class="px-6 py-4 text-sm text-right font-bold text-emerald-700">€500.000</td>
                <td class="px-6 py-4 text-sm text-right font-bold text-emerald-700">€600.000</td>
                <td class="px-6 py-4 text-sm text-right font-bold text-emerald-700">€750.000</td>
                <td class="px-6 py-4 text-sm text-right font-extrabold text-emerald-700 bg-emerald-100">€900.000</td>
              </tr>
              <tr class="bg-emerald-50">
                <td class="px-6 py-3 text-sm font-medium text-slate-700">EBITDA Margin %</td>
                <td class="px-6 py-3 text-sm text-right font-semibold text-emerald-600">30.0%</td>
                <td class="px-6 py-3 text-sm text-right font-semibold text-emerald-600">33.3%</td>
                <td class="px-6 py-3 text-sm text-right font-semibold text-emerald-600">33.3%</td>
                <td class="px-6 py-3 text-sm text-right font-semibold text-emerald-600">35.7%</td>
                <td class="px-6 py-3 text-sm text-right font-bold text-emerald-600 bg-emerald-100">36.0%</td>
              </tr>

              <tr class="hover:bg-slate-50 border-t border-slate-200">
                <td class="px-6 py-3 text-sm text-slate-700">Ammortamenti</td>
                <td class="px-6 py-3 text-sm text-right text-slate-700">€80.000</td>
                <td class="px-6 py-3 text-sm text-right text-slate-700">€100.000</td>
                <td class="px-6 py-3 text-sm text-right text-slate-700">€120.000</td>
                <td class="px-6 py-3 text-sm text-right text-slate-700">€140.000</td>
                <td class="px-6 py-3 text-sm text-right text-slate-700 bg-emerald-50">€160.000</td>
              </tr>

              <tr class="bg-blue-50">
                <td class="px-6 py-4 text-sm font-bold text-slate-800">EBIT</td>
                <td class="px-6 py-4 text-sm text-right font-bold text-blue-700">€280.000</td>
                <td class="px-6 py-4 text-sm text-right font-bold text-blue-700">€400.000</td>
                <td class="px-6 py-4 text-sm text-right font-bold text-blue-700">€480.000</td>
                <td class="px-6 py-4 text-sm text-right font-bold text-blue-700">€610.000</td>
                <td class="px-6 py-4 text-sm text-right font-bold text-blue-700 bg-blue-100">€740.000</td>
              </tr>

              <tr class="hover:bg-slate-50 border-t border-slate-200">
                <td class="px-6 py-3 text-sm text-slate-700">Oneri Finanziari</td>
                <td class="px-6 py-3 text-sm text-right text-slate-700">€20.000</td>
                <td class="px-6 py-3 text-sm text-right text-slate-700">€30.000</td>
                <td class="px-6 py-3 text-sm text-right text-slate-700">€35.000</td>
                <td class="px-6 py-3 text-sm text-right text-slate-700">€40.000</td>
                <td class="px-6 py-3 text-sm text-right text-slate-700 bg-emerald-50">€45.000</td>
              </tr>
              <tr class="hover:bg-slate-50">
                <td class="px-6 py-3 text-sm text-slate-700">Imposte (IRES 24%)</td>
                <td class="px-6 py-3 text-sm text-right text-slate-700">€62.400</td>
                <td class="px-6 py-3 text-sm text-right text-slate-700">€88.800</td>
                <td class="px-6 py-3 text-sm text-right text-slate-700">€106.800</td>
                <td class="px-6 py-3 text-sm text-right text-slate-700">€136.800</td>
                <td class="px-6 py-3 text-sm text-right text-slate-700 bg-emerald-50">€166.800</td>
              </tr>

              <tr class="bg-emerald-100 border-t-2 border-emerald-300">
                <td class="px-6 py-4 text-sm font-extrabold text-slate-900">UTILE NETTO</td>
                <td class="px-6 py-4 text-sm text-right font-extrabold text-emerald-700">€197.600</td>
                <td class="px-6 py-4 text-sm text-right font-extrabold text-emerald-700">€281.200</td>
                <td class="px-6 py-4 text-sm text-right font-extrabold text-emerald-700">€338.200</td>
                <td class="px-6 py-4 text-sm text-right font-extrabold text-emerald-700">€433.200</td>
                <td class="px-6 py-4 text-sm text-right font-extrabold text-emerald-700 bg-emerald-200">€528.200</td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- Stato Patrimoniale -->
        <div v-if="activeTab === 'sp'" class="overflow-x-auto">
          <table class="w-full">
            <thead>
              <tr class="bg-slate-50 border-b-2 border-slate-300">
                <th class="px-6 py-4 text-left text-sm font-bold text-slate-800">Stato Patrimoniale</th>
                <th class="px-6 py-4 text-right text-sm font-semibold text-slate-700">2026</th>
                <th class="px-6 py-4 text-right text-sm font-semibold text-slate-700">2027</th>
                <th class="px-6 py-4 text-right text-sm font-semibold text-slate-700">2028</th>
                <th class="px-6 py-4 text-right text-sm font-semibold text-slate-700">2029</th>
                <th class="px-6 py-4 text-right text-sm font-semibold text-slate-700 bg-emerald-50">2030</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-slate-100">
              <tr class="bg-blue-50">
                <td class="px-6 py-3 text-sm font-bold text-slate-800">ATTIVO</td>
                <td colspan="5"></td>
              </tr>
              <tr class="hover:bg-slate-50">
                <td class="px-6 py-3 text-sm font-medium text-slate-800">Immobilizzazioni</td>
                <td class="px-6 py-3 text-sm text-right text-slate-700">€450.000</td>
                <td class="px-6 py-3 text-sm text-right text-slate-700">€620.000</td>
                <td class="px-6 py-3 text-sm text-right text-slate-700">€700.000</td>
                <td class="px-6 py-3 text-sm text-right text-slate-700">€1.010.000</td>
                <td class="px-6 py-3 text-sm text-right text-slate-700 bg-emerald-50">€1.100.000</td>
              </tr>
              <tr class="hover:bg-slate-50">
                <td class="px-6 py-3 text-sm text-slate-700 pl-10">Attrezzature</td>
                <td class="px-6 py-3 text-sm text-right text-slate-700">€300.000</td>
                <td class="px-6 py-3 text-sm text-right text-slate-700">€420.000</td>
                <td class="px-6 py-3 text-sm text-right text-slate-700">€450.000</td>
                <td class="px-6 py-3 text-sm text-right text-slate-700">€510.000</td>
                <td class="px-6 py-3 text-sm text-right text-slate-700 bg-emerald-50">€550.000</td>
              </tr>
              <tr class="hover:bg-slate-50">
                <td class="px-6 py-3 text-sm text-slate-700 pl-10">Immobili</td>
                <td class="px-6 py-3 text-sm text-right text-slate-700">€150.000</td>
                <td class="px-6 py-3 text-sm text-right text-slate-700">€200.000</td>
                <td class="px-6 py-3 text-sm text-right text-slate-700">€250.000</td>
                <td class="px-6 py-3 text-sm text-right text-slate-700">€500.000</td>
                <td class="px-6 py-3 text-sm text-right text-slate-700 bg-emerald-50">€550.000</td>
              </tr>
              <tr class="hover:bg-slate-50">
                <td class="px-6 py-3 text-sm font-medium text-slate-800">Attivo Circolante</td>
                <td class="px-6 py-3 text-sm text-right text-slate-700">€320.000</td>
                <td class="px-6 py-3 text-sm text-right text-slate-700">€410.000</td>
                <td class="px-6 py-3 text-sm text-right text-slate-700">€530.000</td>
                <td class="px-6 py-3 text-sm text-right text-slate-700">€680.000</td>
                <td class="px-6 py-3 text-sm text-right text-slate-700 bg-emerald-50">€850.000</td>
              </tr>
              <tr class="hover:bg-slate-50">
                <td class="px-6 py-3 text-sm text-slate-700 pl-10">Crediti vs Clienti</td>
                <td class="px-6 py-3 text-sm text-right text-slate-700">€180.000</td>
                <td class="px-6 py-3 text-sm text-right text-slate-700">€230.000</td>
                <td class="px-6 py-3 text-sm text-right text-slate-700">€280.000</td>
                <td class="px-6 py-3 text-sm text-right text-slate-700">€330.000</td>
                <td class="px-6 py-3 text-sm text-right text-slate-700 bg-emerald-50">€400.000</td>
              </tr>
              <tr class="hover:bg-slate-50">
                <td class="px-6 py-3 text-sm text-slate-700 pl-10">Rimanenze</td>
                <td class="px-6 py-3 text-sm text-right text-slate-700">€40.000</td>
                <td class="px-6 py-3 text-sm text-right text-slate-700">€50.000</td>
                <td class="px-6 py-3 text-sm text-right text-slate-700">€60.000</td>
                <td class="px-6 py-3 text-sm text-right text-slate-700">€70.000</td>
                <td class="px-6 py-3 text-sm text-right text-slate-700 bg-emerald-50">€80.000</td>
              </tr>
              <tr class="hover:bg-slate-50">
                <td class="px-6 py-3 text-sm text-slate-700 pl-10">Liquidità</td>
                <td class="px-6 py-3 text-sm text-right text-slate-700">€100.000</td>
                <td class="px-6 py-3 text-sm text-right text-slate-700">€130.000</td>
                <td class="px-6 py-3 text-sm text-right text-slate-700">€190.000</td>
                <td class="px-6 py-3 text-sm text-right text-slate-700">€280.000</td>
                <td class="px-6 py-3 text-sm text-right text-slate-700 bg-emerald-50">€370.000</td>
              </tr>
              <tr class="bg-blue-100 border-t-2 border-blue-300">
                <td class="px-6 py-4 text-sm font-bold text-slate-900">TOTALE ATTIVO</td>
                <td class="px-6 py-4 text-sm text-right font-bold text-blue-700">€770.000</td>
                <td class="px-6 py-4 text-sm text-right font-bold text-blue-700">€1.030.000</td>
                <td class="px-6 py-4 text-sm text-right font-bold text-blue-700">€1.230.000</td>
                <td class="px-6 py-4 text-sm text-right font-bold text-blue-700">€1.690.000</td>
                <td class="px-6 py-4 text-sm text-right font-bold text-blue-700 bg-blue-200">€1.950.000</td>
              </tr>

              <tr class="bg-red-50 border-t-4 border-slate-400">
                <td class="px-6 py-3 text-sm font-bold text-slate-800">PASSIVO</td>
                <td colspan="5"></td>
              </tr>
              <tr class="hover:bg-slate-50">
                <td class="px-6 py-3 text-sm font-medium text-slate-800">Patrimonio Netto</td>
                <td class="px-6 py-3 text-sm text-right text-slate-700">€400.000</td>
                <td class="px-6 py-3 text-sm text-right text-slate-700">€530.000</td>
                <td class="px-6 py-3 text-sm text-right text-slate-700">€680.000</td>
                <td class="px-6 py-3 text-sm text-right text-slate-700">€900.000</td>
                <td class="px-6 py-3 text-sm text-right text-slate-700 bg-emerald-50">€1.150.000</td>
              </tr>
              <tr class="hover:bg-slate-50">
                <td class="px-6 py-3 text-sm font-medium text-slate-800">Debiti Finanziari M/L Termine</td>
                <td class="px-6 py-3 text-sm text-right text-slate-700">€200.000</td>
                <td class="px-6 py-3 text-sm text-right text-slate-700">€180.000</td>
                <td class="px-6 py-3 text-sm text-right text-slate-700">€140.000</td>
                <td class="px-6 py-3 text-sm text-right text-slate-700">€80.000</td>
                <td class="px-6 py-3 text-sm text-right text-slate-700 bg-emerald-50">€30.000</td>
              </tr>
              <tr class="hover:bg-slate-50">
                <td class="px-6 py-3 text-sm font-medium text-slate-800">Debiti Correnti</td>
                <td class="px-6 py-3 text-sm text-right text-slate-700">€170.000</td>
                <td class="px-6 py-3 text-sm text-right text-slate-700">€320.000</td>
                <td class="px-6 py-3 text-sm text-right text-slate-700">€410.000</td>
                <td class="px-6 py-3 text-sm text-right text-slate-700">€710.000</td>
                <td class="px-6 py-3 text-sm text-right text-slate-700 bg-emerald-50">€770.000</td>
              </tr>
              <tr class="hover:bg-slate-50">
                <td class="px-6 py-3 text-sm text-slate-700 pl-10">Debiti vs Fornitori</td>
                <td class="px-6 py-3 text-sm text-right text-slate-700">€120.000</td>
                <td class="px-6 py-3 text-sm text-right text-slate-700">€240.000</td>
                <td class="px-6 py-3 text-sm text-right text-slate-700">€300.000</td>
                <td class="px-6 py-3 text-sm text-right text-slate-700">€580.000</td>
                <td class="px-6 py-3 text-sm text-right text-slate-700 bg-emerald-50">€630.000</td>
              </tr>
              <tr class="hover:bg-slate-50">
                <td class="px-6 py-3 text-sm text-slate-700 pl-10">Debiti Tributari</td>
                <td class="px-6 py-3 text-sm text-right text-slate-700">€50.000</td>
                <td class="px-6 py-3 text-sm text-right text-slate-700">€80.000</td>
                <td class="px-6 py-3 text-sm text-right text-slate-700">€110.000</td>
                <td class="px-6 py-3 text-sm text-right text-slate-700">€130.000</td>
                <td class="px-6 py-3 text-sm text-right text-slate-700 bg-emerald-50">€140.000</td>
              </tr>
              <tr class="bg-red-100 border-t-2 border-red-300">
                <td class="px-6 py-4 text-sm font-bold text-slate-900">TOTALE PASSIVO</td>
                <td class="px-6 py-4 text-sm text-right font-bold text-red-700">€770.000</td>
                <td class="px-6 py-4 text-sm text-right font-bold text-red-700">€1.030.000</td>
                <td class="px-6 py-4 text-sm text-right font-bold text-red-700">€1.230.000</td>
                <td class="px-6 py-4 text-sm text-right font-bold text-red-700">€1.690.000</td>
                <td class="px-6 py-4 text-sm text-right font-bold text-red-700 bg-red-200">€1.950.000</td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- Cash Flow -->
        <div v-if="activeTab === 'cf'" class="overflow-x-auto">
          <table class="w-full">
            <thead>
              <tr class="bg-slate-50 border-b-2 border-slate-300">
                <th class="px-6 py-4 text-left text-sm font-bold text-slate-800">Rendiconto Finanziario</th>
                <th class="px-6 py-4 text-right text-sm font-semibold text-slate-700">2026</th>
                <th class="px-6 py-4 text-right text-sm font-semibold text-slate-700">2027</th>
                <th class="px-6 py-4 text-right text-sm font-semibold text-slate-700">2028</th>
                <th class="px-6 py-4 text-right text-sm font-semibold text-slate-700">2029</th>
                <th class="px-6 py-4 text-right text-sm font-semibold text-slate-700 bg-emerald-50">2030</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-slate-100">
              <tr class="bg-blue-50">
                <td class="px-6 py-3 text-sm font-bold text-slate-800">CASH FLOW OPERATIVO</td>
                <td colspan="5"></td>
              </tr>
              <tr class="hover:bg-slate-50">
                <td class="px-6 py-3 text-sm text-slate-700">Utile Netto</td>
                <td class="px-6 py-3 text-sm text-right text-slate-700">€197.600</td>
                <td class="px-6 py-3 text-sm text-right text-slate-700">€281.200</td>
                <td class="px-6 py-3 text-sm text-right text-slate-700">€338.200</td>
                <td class="px-6 py-3 text-sm text-right text-slate-700">€433.200</td>
                <td class="px-6 py-3 text-sm text-right text-slate-700 bg-emerald-50">€528.200</td>
              </tr>
              <tr class="hover:bg-slate-50">
                <td class="px-6 py-3 text-sm text-slate-700">Ammortamenti</td>
                <td class="px-6 py-3 text-sm text-right text-slate-700">€80.000</td>
                <td class="px-6 py-3 text-sm text-right text-slate-700">€100.000</td>
                <td class="px-6 py-3 text-sm text-right text-slate-700">€120.000</td>
                <td class="px-6 py-3 text-sm text-right text-slate-700">€140.000</td>
                <td class="px-6 py-3 text-sm text-right text-slate-700 bg-emerald-50">€160.000</td>
              </tr>
              <tr class="hover:bg-slate-50">
                <td class="px-6 py-3 text-sm text-slate-700">Variazione Capitale Circolante</td>
                <td class="px-6 py-3 text-sm text-right text-red-600">-€27.600</td>
                <td class="px-6 py-3 text-sm text-right text-red-600">-€31.200</td>
                <td class="px-6 py-3 text-sm text-right text-red-600">-€38.200</td>
                <td class="px-6 py-3 text-sm text-right text-red-600">-€43.200</td>
                <td class="px-6 py-3 text-sm text-right text-red-600 bg-emerald-50">-€48.200</td>
              </tr>
              <tr class="bg-emerald-100">
                <td class="px-6 py-4 text-sm font-bold text-slate-800">Cash Flow Operativo Netto</td>
                <td class="px-6 py-4 text-sm text-right font-bold text-emerald-700">€250.000</td>
                <td class="px-6 py-4 text-sm text-right font-bold text-emerald-700">€350.000</td>
                <td class="px-6 py-4 text-sm text-right font-bold text-emerald-700">€420.000</td>
                <td class="px-6 py-4 text-sm text-right font-bold text-emerald-700">€530.000</td>
                <td class="px-6 py-4 text-sm text-right font-bold text-emerald-700 bg-emerald-200">€640.000</td>
              </tr>

              <tr class="bg-blue-50 border-t-2 border-slate-200">
                <td class="px-6 py-3 text-sm font-bold text-slate-800">CASH FLOW INVESTIMENTI</td>
                <td colspan="5"></td>
              </tr>
              <tr class="hover:bg-slate-50">
                <td class="px-6 py-3 text-sm text-slate-700">Investimenti in Immobilizzazioni</td>
                <td class="px-6 py-3 text-sm text-right text-red-600">-€110.000</td>
                <td class="px-6 py-3 text-sm text-right text-red-600">-€270.000</td>
                <td class="px-6 py-3 text-sm text-right text-red-600">-€200.000</td>
                <td class="px-6 py-3 text-sm text-right text-red-600">-€450.000</td>
                <td class="px-6 py-3 text-sm text-right text-red-600 bg-emerald-50">-€250.000</td>
              </tr>

              <tr class="bg-red-50 border-t-2 border-slate-200">
                <td class="px-6 py-3 text-sm font-bold text-slate-800">CASH FLOW FINANZIARIO</td>
                <td colspan="5"></td>
              </tr>
              <tr class="hover:bg-slate-50">
                <td class="px-6 py-3 text-sm text-slate-700">Variazione Debiti Finanziari</td>
                <td class="px-6 py-3 text-sm text-right text-red-600">-€20.000</td>
                <td class="px-6 py-3 text-sm text-right text-red-600">-€20.000</td>
                <td class="px-6 py-3 text-sm text-right text-red-600">-€40.000</td>
                <td class="px-6 py-3 text-sm text-right text-red-600">-€60.000</td>
                <td class="px-6 py-3 text-sm text-right text-red-600 bg-emerald-50">-€50.000</td>
              </tr>
              <tr class="hover:bg-slate-50">
                <td class="px-6 py-3 text-sm text-slate-700">Apporti/Prelievi Soci</td>
                <td class="px-6 py-3 text-sm text-right text-slate-700">€0</td>
                <td class="px-6 py-3 text-sm text-right text-red-600">-€30.000</td>
                <td class="px-6 py-3 text-sm text-right text-red-600">-€120.000</td>
                <td class="px-6 py-3 text-sm text-right text-red-600">-€130.000</td>
                <td class="px-6 py-3 text-sm text-right text-red-600 bg-emerald-50">-€250.000</td>
              </tr>

              <tr class="bg-emerald-100 border-t-2 border-emerald-300">
                <td class="px-6 py-4 text-sm font-bold text-slate-900">VARIAZIONE LIQUIDITÀ</td>
                <td class="px-6 py-4 text-sm text-right font-bold text-emerald-700">+€120.000</td>
                <td class="px-6 py-4 text-sm text-right font-bold text-emerald-700">+€30.000</td>
                <td class="px-6 py-4 text-sm text-right font-bold text-emerald-700">+€60.000</td>
                <td class="px-6 py-4 text-sm text-right font-bold text-emerald-700">+€90.000</td>
                <td class="px-6 py-4 text-sm text-right font-bold text-emerald-700 bg-emerald-200">+€90.000</td>
              </tr>
              <tr class="bg-slate-100">
                <td class="px-6 py-3 text-sm font-medium text-slate-800">Liquidità Iniziale</td>
                <td class="px-6 py-3 text-sm text-right text-slate-700">€0</td>
                <td class="px-6 py-3 text-sm text-right text-slate-700">€100.000</td>
                <td class="px-6 py-3 text-sm text-right text-slate-700">€130.000</td>
                <td class="px-6 py-3 text-sm text-right text-slate-700">€190.000</td>
                <td class="px-6 py-3 text-sm text-right text-slate-700 bg-emerald-50">€280.000</td>
              </tr>
              <tr class="bg-blue-100 border-t-2 border-blue-300">
                <td class="px-6 py-4 text-sm font-bold text-slate-900">LIQUIDITÀ FINALE</td>
                <td class="px-6 py-4 text-sm text-right font-bold text-blue-700">€100.000</td>
                <td class="px-6 py-4 text-sm text-right font-bold text-blue-700">€130.000</td>
                <td class="px-6 py-4 text-sm text-right font-bold text-blue-700">€190.000</td>
                <td class="px-6 py-4 text-sm text-right font-bold text-blue-700">€280.000</td>
                <td class="px-6 py-4 text-sm text-right font-bold text-blue-700 bg-blue-200">€370.000</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  middleware: 'auth'
})

const activeTab = ref('ce')

const tabs = [
  { id: 'ce', label: 'Conto Economico', icon: 'fa-file-invoice-dollar' },
  { id: 'sp', label: 'Stato Patrimoniale', icon: 'fa-balance-scale' },
  { id: 'cf', label: 'Cash Flow', icon: 'fa-exchange-alt' }
]

const exportExcel = async () => {
  try {
    const { data } = await useFetch('/api/piano-industriale/proiezioni')
    if (data.value) {
      alert('Excel generato con successo! (Mock)')
    }
  } catch (error) {
    console.error('Export failed:', error)
  }
}
</script>
