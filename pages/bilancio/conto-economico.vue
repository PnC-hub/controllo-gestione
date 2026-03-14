<template>
  <div>
    <!-- Header -->
    <div class="bg-white rounded-xl border border-slate-200 shadow-sm mb-4">
      <div class="px-6 py-4 border-b border-slate-100 flex items-center justify-between flex-wrap gap-2">
        <div>
          <h2 class="text-lg font-semibold text-slate-800 flex items-center gap-2">
            <i class="fas fa-file-invoice-dollar text-cyan-600"></i>
            Conto Economico Riclassificato — WSNO-006
          </h2>
          <p class="text-xs text-slate-400 mt-0.5">Smiledoc · Fonte: Kontabila · Triennio 2023–2024–2025</p>
        </div>
        <span class="text-xs px-2 py-1 bg-cyan-50 text-cyan-700 rounded-full border border-cyan-200">
          <i class="fas fa-database mr-1"></i>Dati live
        </span>
      </div>
    </div>

    <!-- Loading -->
    <div v-if="loading.ce" class="bg-white rounded-xl shadow-sm p-12 text-center">
      <i class="fas fa-spinner fa-spin text-4xl text-cyan-600 mb-4"></i>
      <p class="text-slate-500">Caricamento Conto Economico...</p>
    </div>

    <!-- Error -->
    <div v-else-if="error.ce" class="bg-red-50 border border-red-200 rounded-xl p-4 text-red-700">
      <i class="fas fa-exclamation-circle mr-2"></i>
      {{ error.ce?.message || 'Kontabila non raggiungibile' }}
    </div>

    <!-- Table -->
    <div v-else-if="ceData" class="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
      <div class="overflow-x-auto">
        <table class="w-full text-sm border-collapse">
          <thead>
            <tr class="bg-slate-800 text-white">
              <th class="text-left px-3 py-3 w-16 text-xs font-semibold tracking-wide">Cod.</th>
              <th class="text-left px-3 py-3 text-xs font-semibold tracking-wide">Descrizione</th>
              <th class="text-right px-3 py-3 w-28 text-xs font-semibold">2023</th>
              <th class="text-right px-2 py-3 w-12 text-xs font-semibold text-slate-400">%</th>
              <th class="text-right px-3 py-3 w-28 text-xs font-semibold">2024</th>
              <th class="text-right px-2 py-3 w-12 text-xs font-semibold text-slate-400">%</th>
              <th class="text-right px-3 py-3 w-28 text-xs font-semibold">2025</th>
              <th class="text-right px-2 py-3 w-12 text-xs font-semibold text-slate-400">%</th>
            </tr>
          </thead>
          <tbody>

            <!-- ═══ A) RICAVI ═══ -->
            <tr class="bg-cyan-700 text-white">
              <td colspan="8" class="px-3 py-2 font-bold text-xs uppercase tracking-wider">A) RICAVI DI PRODUZIONE</td>
            </tr>
            <tr v-for="(voce, i) in ricaviVoci" :key="'rv'+i" class="border-b border-slate-100 hover:bg-slate-50">
              <td class="px-3 py-1.5 text-slate-400 font-mono text-xs">{{ voce.cod }}</td>
              <td class="px-3 py-1.5 text-slate-700 pl-6">{{ voce.label }}</td>
              <td class="px-3 py-1.5 text-right font-mono" :class="voce.cod === '9.70' ? numColor(get(2023, voce.key)?.importo) : 'text-slate-800'">{{ fmt(get(2023, voce.key)?.importo) }}</td>
              <td class="px-2 py-1.5 text-right text-xs text-slate-400">{{ fmtP(get(2023, voce.key)?.perc) }}</td>
              <td class="px-3 py-1.5 text-right font-mono" :class="voce.cod === '9.70' ? numColor(get(2024, voce.key)?.importo) : 'text-slate-800'">{{ fmt(get(2024, voce.key)?.importo) }}</td>
              <td class="px-2 py-1.5 text-right text-xs text-slate-400">{{ fmtP(get(2024, voce.key)?.perc) }}</td>
              <td class="px-3 py-1.5 text-right font-mono" :class="voce.cod === '9.70' ? numColor(get(2025, voce.key)?.importo) : 'text-slate-800'">{{ fmt(get(2025, voce.key)?.importo) }}</td>
              <td class="px-2 py-1.5 text-right text-xs text-slate-400">{{ fmtP(get(2025, voce.key)?.perc) }}</td>
            </tr>
            <tr class="bg-cyan-100 font-bold">
              <td colspan="2" class="px-3 py-2 text-cyan-900 uppercase text-xs">TOTALE RICAVI (A)</td>
              <td class="px-3 py-2 text-right font-mono text-cyan-900">{{ fmt(ce(2023)?.totaleRicavi?.importo) }}</td>
              <td class="px-2 py-2 text-right text-xs text-cyan-700">100%</td>
              <td class="px-3 py-2 text-right font-mono text-cyan-900">{{ fmt(ce(2024)?.totaleRicavi?.importo) }}</td>
              <td class="px-2 py-2 text-right text-xs text-cyan-700">100%</td>
              <td class="px-3 py-2 text-right font-mono text-cyan-900">{{ fmt(ce(2025)?.totaleRicavi?.importo) }}</td>
              <td class="px-2 py-2 text-right text-xs text-cyan-700">100%</td>
            </tr>

            <!-- PIL -->
            <tr class="bg-slate-50 border-t-2 border-slate-200">
              <td class="px-3 py-1.5 text-slate-400 font-mono text-xs"></td>
              <td class="px-3 py-1.5 font-semibold text-slate-700">PIL — Produzione Interna Lorda (= Totale Ricavi)</td>
              <td class="px-3 py-1.5 text-right font-mono font-semibold text-slate-700">{{ fmt(ce(2023)?.pil?.importo) }}</td>
              <td class="px-2 py-1.5 text-right text-xs font-semibold text-slate-500">100%</td>
              <td class="px-3 py-1.5 text-right font-mono font-semibold text-slate-700">{{ fmt(ce(2024)?.pil?.importo) }}</td>
              <td class="px-2 py-1.5 text-right text-xs font-semibold text-slate-500">100%</td>
              <td class="px-3 py-1.5 text-right font-mono font-semibold text-slate-700">{{ fmt(ce(2025)?.pil?.importo) }}</td>
              <td class="px-2 py-1.5 text-right text-xs font-semibold text-slate-500">100%</td>
            </tr>

            <!-- ═══ B) RIMANENZE INIZIALI ═══ -->
            <tr class="bg-orange-600 text-white">
              <td colspan="8" class="px-3 py-2 font-bold text-xs uppercase tracking-wider">B) RIMANENZE INIZIALI</td>
            </tr>
            <tr class="border-b border-slate-100">
              <td class="px-3 py-1.5 text-slate-400 font-mono text-xs"></td>
              <td class="px-3 py-1.5 text-slate-400 italic pl-6">Rimanenze Iniziali Materie / Merci</td>
              <td class="px-3 py-1.5 text-right font-mono text-slate-400">—</td>
              <td class="px-2 py-1.5 text-slate-400 text-right text-xs">—</td>
              <td class="px-3 py-1.5 text-right font-mono text-slate-400">—</td>
              <td class="px-2 py-1.5 text-slate-400 text-right text-xs">—</td>
              <td class="px-3 py-1.5 text-right font-mono text-slate-400">—</td>
              <td class="px-2 py-1.5 text-slate-400 text-right text-xs">—</td>
            </tr>
            <tr class="bg-orange-100 font-bold">
              <td colspan="2" class="px-3 py-2 text-orange-900 uppercase text-xs">TOTALE RIMANENZE INIZIALI (B)</td>
              <td class="px-3 py-2 text-right font-mono text-orange-900">{{ fmt(0) }}</td>
              <td class="px-2 py-2 text-right text-xs text-orange-700">—</td>
              <td class="px-3 py-2 text-right font-mono text-orange-900">{{ fmt(0) }}</td>
              <td class="px-2 py-2 text-right text-xs text-orange-700">—</td>
              <td class="px-3 py-2 text-right font-mono text-orange-900">{{ fmt(0) }}</td>
              <td class="px-2 py-2 text-right text-xs text-orange-700">—</td>
            </tr>

            <!-- ═══ C) ACQUISTI ═══ -->
            <tr class="bg-red-700 text-white">
              <td colspan="8" class="px-3 py-2 font-bold text-xs uppercase tracking-wider">C) ACQUISTI — MATERIE PRIME E MATERIALE DI CONSUMO</td>
            </tr>
            <tr class="border-b border-slate-100 hover:bg-slate-50">
              <td class="px-3 py-1.5 text-slate-400 font-mono text-xs">8.01</td>
              <td class="px-3 py-1.5 text-slate-700 pl-6">B6) Acquisto Materiale di Consumo / Materie Prime</td>
              <td class="px-3 py-1.5 text-right font-mono text-red-700">{{ fmt(ce(2023)?.materierime?.importo) }}</td>
              <td class="px-2 py-1.5 text-right text-xs text-slate-400">{{ fmtP(ce(2023)?.materierime?.perc) }}</td>
              <td class="px-3 py-1.5 text-right font-mono text-red-700">{{ fmt(ce(2024)?.materierime?.importo) }}</td>
              <td class="px-2 py-1.5 text-right text-xs text-slate-400">{{ fmtP(ce(2024)?.materierime?.perc) }}</td>
              <td class="px-3 py-1.5 text-right font-mono text-red-700">{{ fmt(ce(2025)?.materierime?.importo) }}</td>
              <td class="px-2 py-1.5 text-right text-xs text-slate-400">{{ fmtP(ce(2025)?.materierime?.perc) }}</td>
            </tr>
            <tr class="bg-red-100 font-bold">
              <td colspan="2" class="px-3 py-2 text-red-900 uppercase text-xs">TOTALE ACQUISTI (C)</td>
              <td class="px-3 py-2 text-right font-mono text-red-900">{{ fmt(ce(2023)?.materierime?.importo) }}</td>
              <td class="px-2 py-2 text-right text-xs text-red-700">{{ fmtP(ce(2023)?.materierime?.perc) }}</td>
              <td class="px-3 py-2 text-right font-mono text-red-900">{{ fmt(ce(2024)?.materierime?.importo) }}</td>
              <td class="px-2 py-2 text-right text-xs text-red-700">{{ fmtP(ce(2024)?.materierime?.perc) }}</td>
              <td class="px-3 py-2 text-right font-mono text-red-900">{{ fmt(ce(2025)?.materierime?.importo) }}</td>
              <td class="px-2 py-2 text-right text-xs text-red-700">{{ fmtP(ce(2025)?.materierime?.perc) }}</td>
            </tr>

            <!-- D) RIMANENZE FINALI -->
            <tr class="bg-orange-600 text-white">
              <td colspan="8" class="px-3 py-2 font-bold text-xs uppercase tracking-wider">D) RIMANENZE FINALI</td>
            </tr>
            <tr class="bg-orange-100 font-bold">
              <td colspan="2" class="px-3 py-2 text-orange-900 uppercase text-xs">TOTALE RIMANENZE FINALI (D)</td>
              <td class="px-3 py-2 text-right font-mono text-orange-900">{{ fmt(0) }}</td>
              <td class="px-2 py-2 text-right text-xs text-orange-700">—</td>
              <td class="px-3 py-2 text-right font-mono text-orange-900">{{ fmt(0) }}</td>
              <td class="px-2 py-2 text-right text-xs text-orange-700">—</td>
              <td class="px-3 py-2 text-right font-mono text-orange-900">{{ fmt(0) }}</td>
              <td class="px-2 py-2 text-right text-xs text-orange-700">—</td>
            </tr>

            <!-- COSTO MATERIE PRIME -->
            <tr class="bg-red-200 border-t-2 border-red-400">
              <td class="px-3 py-2 text-red-700 font-mono text-xs font-bold">CMP</td>
              <td class="px-3 py-2 font-bold text-red-900 text-xs uppercase">COSTO MATERIE PRIME (A − B + C − D)</td>
              <td class="px-3 py-2 text-right font-mono font-bold text-red-900">{{ fmt(ce(2023)?.materierime?.importo) }}</td>
              <td class="px-2 py-2 text-right text-xs text-red-700">{{ fmtP(ce(2023)?.materierime?.perc) }}</td>
              <td class="px-3 py-2 text-right font-mono font-bold text-red-900">{{ fmt(ce(2024)?.materierime?.importo) }}</td>
              <td class="px-2 py-2 text-right text-xs text-red-700">{{ fmtP(ce(2024)?.materierime?.perc) }}</td>
              <td class="px-3 py-2 text-right font-mono font-bold text-red-900">{{ fmt(ce(2025)?.materierime?.importo) }}</td>
              <td class="px-2 py-2 text-right text-xs text-red-700">{{ fmtP(ce(2025)?.materierime?.perc) }}</td>
            </tr>

            <!-- ═══ E) SERVIZI ═══ -->
            <tr class="bg-violet-700 text-white">
              <td colspan="8" class="px-3 py-2 font-bold text-xs uppercase tracking-wider">E) SERVIZI — Prestazioni Professionali, Lab, Consulenze, Utenze, Vari (8.04 netto)</td>
            </tr>
            <tr class="border-b border-slate-100 hover:bg-slate-50">
              <td class="px-3 py-1.5 text-slate-400 font-mono text-xs">8.04</td>
              <td class="px-3 py-1.5 text-slate-700 pl-6">B7) Servizi — Valore Netto (include storni contabili)</td>
              <td class="px-3 py-1.5 text-right font-mono" :class="numColor(ce(2023)?.serviziNetti?.importo)">{{ fmt(ce(2023)?.serviziNetti?.importo) }}</td>
              <td class="px-2 py-1.5 text-right text-xs text-slate-400">{{ fmtP(ce(2023)?.serviziNetti?.perc) }}</td>
              <td class="px-3 py-1.5 text-right font-mono" :class="numColor(ce(2024)?.serviziNetti?.importo)">{{ fmt(ce(2024)?.serviziNetti?.importo) }}</td>
              <td class="px-2 py-1.5 text-right text-xs text-slate-400">{{ fmtP(ce(2024)?.serviziNetti?.perc) }}</td>
              <td class="px-3 py-1.5 text-right font-mono" :class="numColor(ce(2025)?.serviziNetti?.importo)">{{ fmt(ce(2025)?.serviziNetti?.importo) }}</td>
              <td class="px-2 py-1.5 text-right text-xs text-slate-400">{{ fmtP(ce(2025)?.serviziNetti?.perc) }}</td>
            </tr>
            <tr class="bg-violet-100 font-bold">
              <td colspan="2" class="px-3 py-2 text-violet-900 uppercase text-xs">TOTALE SERVIZI (E)</td>
              <td class="px-3 py-2 text-right font-mono" :class="numColor(ce(2023)?.serviziNetti?.importo)">{{ fmt(ce(2023)?.serviziNetti?.importo) }}</td>
              <td class="px-2 py-2 text-right text-xs text-violet-700">{{ fmtP(ce(2023)?.serviziNetti?.perc) }}</td>
              <td class="px-3 py-2 text-right font-mono" :class="numColor(ce(2024)?.serviziNetti?.importo)">{{ fmt(ce(2024)?.serviziNetti?.importo) }}</td>
              <td class="px-2 py-2 text-right text-xs text-violet-700">{{ fmtP(ce(2024)?.serviziNetti?.perc) }}</td>
              <td class="px-3 py-2 text-right font-mono" :class="numColor(ce(2025)?.serviziNetti?.importo)">{{ fmt(ce(2025)?.serviziNetti?.importo) }}</td>
              <td class="px-2 py-2 text-right text-xs text-violet-700">{{ fmtP(ce(2025)?.serviziNetti?.perc) }}</td>
            </tr>

            <!-- ═══ F) GODIMENTO BENI DI TERZI ═══ -->
            <tr class="bg-amber-700 text-white">
              <td colspan="8" class="px-3 py-2 font-bold text-xs uppercase tracking-wider">F) GODIMENTO BENI DI TERZI — Affitti, Canoni, Leasing</td>
            </tr>
            <tr class="border-b border-slate-100 hover:bg-slate-50">
              <td class="px-3 py-1.5 text-slate-400 font-mono text-xs">8.05</td>
              <td class="px-3 py-1.5 text-slate-700 pl-6">B8) Godimento Beni di Terzi (affitti sede, leasing attrezzature, noleggi)</td>
              <td class="px-3 py-1.5 text-right font-mono text-amber-800">{{ fmt(ce(2023)?.godimentoBeni?.importo) }}</td>
              <td class="px-2 py-1.5 text-right text-xs text-slate-400">{{ fmtP(ce(2023)?.godimentoBeni?.perc) }}</td>
              <td class="px-3 py-1.5 text-right font-mono text-amber-800">{{ fmt(ce(2024)?.godimentoBeni?.importo) }}</td>
              <td class="px-2 py-1.5 text-right text-xs text-slate-400">{{ fmtP(ce(2024)?.godimentoBeni?.perc) }}</td>
              <td class="px-3 py-1.5 text-right font-mono text-amber-800">{{ fmt(ce(2025)?.godimentoBeni?.importo) }}</td>
              <td class="px-2 py-1.5 text-right text-xs text-slate-400">{{ fmtP(ce(2025)?.godimentoBeni?.perc) }}</td>
            </tr>
            <tr class="bg-amber-100 font-bold">
              <td colspan="2" class="px-3 py-2 text-amber-900 uppercase text-xs">TOTALE GODIMENTO BENI DI TERZI (F)</td>
              <td class="px-3 py-2 text-right font-mono text-amber-900">{{ fmt(ce(2023)?.godimentoBeni?.importo) }}</td>
              <td class="px-2 py-2 text-right text-xs text-amber-700">{{ fmtP(ce(2023)?.godimentoBeni?.perc) }}</td>
              <td class="px-3 py-2 text-right font-mono text-amber-900">{{ fmt(ce(2024)?.godimentoBeni?.importo) }}</td>
              <td class="px-2 py-2 text-right text-xs text-amber-700">{{ fmtP(ce(2024)?.godimentoBeni?.perc) }}</td>
              <td class="px-3 py-2 text-right font-mono text-amber-900">{{ fmt(ce(2025)?.godimentoBeni?.importo) }}</td>
              <td class="px-2 py-2 text-right text-xs text-amber-700">{{ fmtP(ce(2025)?.godimentoBeni?.perc) }}</td>
            </tr>

            <!-- ═══ G) COSTO DEL PERSONALE ═══ -->
            <tr class="bg-blue-700 text-white">
              <td colspan="8" class="px-3 py-2 font-bold text-xs uppercase tracking-wider">G) COSTO DEL PERSONALE</td>
            </tr>
            <tr v-for="(voce, i) in personaleVoci" :key="'pv'+i" class="border-b border-slate-100 hover:bg-slate-50">
              <td class="px-3 py-1.5 text-slate-400 font-mono text-xs">{{ voce.cod }}</td>
              <td class="px-3 py-1.5 text-slate-700 pl-6">{{ voce.label }}</td>
              <td class="px-3 py-1.5 text-right font-mono text-blue-800">{{ fmt(ce(2023)?.personale?.[voce.key]?.importo) }}</td>
              <td class="px-2 py-1.5 text-right text-xs text-slate-400">{{ fmtP(ce(2023)?.personale?.[voce.key]?.perc) }}</td>
              <td class="px-3 py-1.5 text-right font-mono text-blue-800">{{ fmt(ce(2024)?.personale?.[voce.key]?.importo) }}</td>
              <td class="px-2 py-1.5 text-right text-xs text-slate-400">{{ fmtP(ce(2024)?.personale?.[voce.key]?.perc) }}</td>
              <td class="px-3 py-1.5 text-right font-mono text-blue-800">{{ fmt(ce(2025)?.personale?.[voce.key]?.importo) }}</td>
              <td class="px-2 py-1.5 text-right text-xs text-slate-400">{{ fmtP(ce(2025)?.personale?.[voce.key]?.perc) }}</td>
            </tr>
            <tr class="bg-blue-100 font-bold">
              <td colspan="2" class="px-3 py-2 text-blue-900 uppercase text-xs">TOTALE COSTO PERSONALE (G)</td>
              <td class="px-3 py-2 text-right font-mono text-blue-900">{{ fmt(ce(2023)?.personale?.totale?.importo) }}</td>
              <td class="px-2 py-2 text-right text-xs text-blue-700">{{ fmtP(ce(2023)?.personale?.totale?.perc) }}</td>
              <td class="px-3 py-2 text-right font-mono text-blue-900">{{ fmt(ce(2024)?.personale?.totale?.importo) }}</td>
              <td class="px-2 py-2 text-right text-xs text-blue-700">{{ fmtP(ce(2024)?.personale?.totale?.perc) }}</td>
              <td class="px-3 py-2 text-right font-mono text-blue-900">{{ fmt(ce(2025)?.personale?.totale?.importo) }}</td>
              <td class="px-2 py-2 text-right text-xs text-blue-700">{{ fmtP(ce(2025)?.personale?.totale?.perc) }}</td>
            </tr>

            <!-- ═══ H) ONERI DIVERSI ═══ -->
            <tr class="bg-teal-700 text-white">
              <td colspan="8" class="px-3 py-2 font-bold text-xs uppercase tracking-wider">H) ONERI DIVERSI DI GESTIONE</td>
            </tr>
            <tr class="border-b border-slate-100 hover:bg-slate-50">
              <td class="px-3 py-1.5 text-slate-400 font-mono text-xs">8.35</td>
              <td class="px-3 py-1.5 text-slate-700 pl-6">B14) Oneri Diversi di Gestione (IMU, bolli, tasse locali, varie)</td>
              <td class="px-3 py-1.5 text-right font-mono text-teal-800">{{ fmt(ce(2023)?.oneriDiversi?.importo) }}</td>
              <td class="px-2 py-1.5 text-right text-xs text-slate-400">{{ fmtP(ce(2023)?.oneriDiversi?.perc) }}</td>
              <td class="px-3 py-1.5 text-right font-mono text-teal-800">{{ fmt(ce(2024)?.oneriDiversi?.importo) }}</td>
              <td class="px-2 py-1.5 text-right text-xs text-slate-400">{{ fmtP(ce(2024)?.oneriDiversi?.perc) }}</td>
              <td class="px-3 py-1.5 text-right font-mono text-teal-800">{{ fmt(ce(2025)?.oneriDiversi?.importo) }}</td>
              <td class="px-2 py-1.5 text-right text-xs text-slate-400">{{ fmtP(ce(2025)?.oneriDiversi?.perc) }}</td>
            </tr>
            <tr class="bg-teal-100 font-bold">
              <td colspan="2" class="px-3 py-2 text-teal-900 uppercase text-xs">TOTALE ONERI DIVERSI (H)</td>
              <td class="px-3 py-2 text-right font-mono text-teal-900">{{ fmt(ce(2023)?.oneriDiversi?.importo) }}</td>
              <td class="px-2 py-2 text-right text-xs text-teal-700">{{ fmtP(ce(2023)?.oneriDiversi?.perc) }}</td>
              <td class="px-3 py-2 text-right font-mono text-teal-900">{{ fmt(ce(2024)?.oneriDiversi?.importo) }}</td>
              <td class="px-2 py-2 text-right text-xs text-teal-700">{{ fmtP(ce(2024)?.oneriDiversi?.perc) }}</td>
              <td class="px-3 py-2 text-right font-mono text-teal-900">{{ fmt(ce(2025)?.oneriDiversi?.importo) }}</td>
              <td class="px-2 py-2 text-right text-xs text-teal-700">{{ fmtP(ce(2025)?.oneriDiversi?.perc) }}</td>
            </tr>

            <!-- TOTALE COSTI OPERATIVI -->
            <tr class="bg-slate-200 border-t-2 border-slate-400">
              <td class="px-3 py-2 text-slate-500 font-mono text-xs">TOT</td>
              <td class="px-3 py-2 font-bold text-slate-800 text-xs uppercase">TOTALE COSTI OPERATIVI (C+E+F+G+H)</td>
              <td class="px-3 py-2 text-right font-mono font-bold text-slate-800">{{ fmt(ce(2023)?.totaleCostiOperativi?.importo) }}</td>
              <td class="px-2 py-2 text-right text-xs text-slate-600">{{ fmtP(ce(2023)?.totaleCostiOperativi?.perc) }}</td>
              <td class="px-3 py-2 text-right font-mono font-bold text-slate-800">{{ fmt(ce(2024)?.totaleCostiOperativi?.importo) }}</td>
              <td class="px-2 py-2 text-right text-xs text-slate-600">{{ fmtP(ce(2024)?.totaleCostiOperativi?.perc) }}</td>
              <td class="px-3 py-2 text-right font-mono font-bold text-slate-800">{{ fmt(ce(2025)?.totaleCostiOperativi?.importo) }}</td>
              <td class="px-2 py-2 text-right text-xs text-slate-600">{{ fmtP(ce(2025)?.totaleCostiOperativi?.perc) }}</td>
            </tr>

            <!-- EBITDA -->
            <tr class="bg-emerald-600 text-white font-bold border-t-4 border-emerald-800">
              <td class="px-3 py-3 font-mono text-xs">EBITDA</td>
              <td class="px-3 py-3 font-bold text-sm uppercase">EBITDA — Margine Operativo Lordo</td>
              <td class="px-3 py-3 text-right font-mono text-base" :class="ebitdaColor(ce(2023)?.ebitda?.importo)">{{ fmt(ce(2023)?.ebitda?.importo) }}</td>
              <td class="px-2 py-3 text-right text-sm font-bold text-emerald-200">{{ fmtP(ce(2023)?.ebitda?.perc) }}</td>
              <td class="px-3 py-3 text-right font-mono text-base" :class="ebitdaColor(ce(2024)?.ebitda?.importo)">{{ fmt(ce(2024)?.ebitda?.importo) }}</td>
              <td class="px-2 py-3 text-right text-sm font-bold text-emerald-200">{{ fmtP(ce(2024)?.ebitda?.perc) }}</td>
              <td class="px-3 py-3 text-right font-mono text-base" :class="ebitdaColor(ce(2025)?.ebitda?.importo)">{{ fmt(ce(2025)?.ebitda?.importo) }}</td>
              <td class="px-2 py-3 text-right text-sm font-bold text-emerald-200">{{ fmtP(ce(2025)?.ebitda?.perc) }}</td>
            </tr>

            <!-- ═══ I) ONERI FINANZIARI ═══ -->
            <tr class="bg-rose-700 text-white">
              <td colspan="8" class="px-3 py-2 font-bold text-xs uppercase tracking-wider">I) ONERI FINANZIARI — Interessi e Oneri Bancari</td>
            </tr>
            <tr class="border-b border-slate-100 hover:bg-slate-50">
              <td class="px-3 py-1.5 text-slate-400 font-mono text-xs">8.43</td>
              <td class="px-3 py-1.5 text-slate-700 pl-6">C17) Interessi e Oneri Finanziari Passivi</td>
              <td class="px-3 py-1.5 text-right font-mono text-rose-700">{{ fmt(ce(2023)?.oneriFinanziari?.importo) }}</td>
              <td class="px-2 py-1.5 text-right text-xs text-slate-400">{{ fmtP(ce(2023)?.oneriFinanziari?.perc) }}</td>
              <td class="px-3 py-1.5 text-right font-mono text-rose-700">{{ fmt(ce(2024)?.oneriFinanziari?.importo) }}</td>
              <td class="px-2 py-1.5 text-right text-xs text-slate-400">{{ fmtP(ce(2024)?.oneriFinanziari?.perc) }}</td>
              <td class="px-3 py-1.5 text-right font-mono text-rose-700">{{ fmt(ce(2025)?.oneriFinanziari?.importo) }}</td>
              <td class="px-2 py-1.5 text-right text-xs text-slate-400">{{ fmtP(ce(2025)?.oneriFinanziari?.perc) }}</td>
            </tr>
            <tr class="bg-rose-100 font-bold">
              <td colspan="2" class="px-3 py-2 text-rose-900 uppercase text-xs">TOTALE ONERI FINANZIARI (I)</td>
              <td class="px-3 py-2 text-right font-mono text-rose-900">{{ fmt(ce(2023)?.oneriFinanziari?.importo) }}</td>
              <td class="px-2 py-2 text-right text-xs text-rose-700">{{ fmtP(ce(2023)?.oneriFinanziari?.perc) }}</td>
              <td class="px-3 py-2 text-right font-mono text-rose-900">{{ fmt(ce(2024)?.oneriFinanziari?.importo) }}</td>
              <td class="px-2 py-2 text-right text-xs text-rose-700">{{ fmtP(ce(2024)?.oneriFinanziari?.perc) }}</td>
              <td class="px-3 py-2 text-right font-mono text-rose-900">{{ fmt(ce(2025)?.oneriFinanziari?.importo) }}</td>
              <td class="px-2 py-2 text-right text-xs text-rose-700">{{ fmtP(ce(2025)?.oneriFinanziari?.perc) }}</td>
            </tr>

            <!-- RISULTATO NETTO -->
            <tr class="bg-slate-900 text-white font-bold border-t-4 border-slate-700">
              <td class="px-3 py-3 font-mono text-xs">RN</td>
              <td class="px-3 py-3 font-bold text-sm uppercase">RISULTATO NETTO D'ESERCIZIO (EBITDA − Oneri Finanziari)</td>
              <td class="px-3 py-3 text-right font-mono text-base" :class="nettoColor(ce(2023)?.risultatoNetto?.importo)">{{ fmt(ce(2023)?.risultatoNetto?.importo) }}</td>
              <td class="px-2 py-3 text-right text-sm font-bold" :class="nettoColor(ce(2023)?.risultatoNetto?.importo)">{{ fmtP(ce(2023)?.risultatoNetto?.perc) }}</td>
              <td class="px-3 py-3 text-right font-mono text-base" :class="nettoColor(ce(2024)?.risultatoNetto?.importo)">{{ fmt(ce(2024)?.risultatoNetto?.importo) }}</td>
              <td class="px-2 py-3 text-right text-sm font-bold" :class="nettoColor(ce(2024)?.risultatoNetto?.importo)">{{ fmtP(ce(2024)?.risultatoNetto?.perc) }}</td>
              <td class="px-3 py-3 text-right font-mono text-base" :class="nettoColor(ce(2025)?.risultatoNetto?.importo)">{{ fmt(ce(2025)?.risultatoNetto?.importo) }}</td>
              <td class="px-2 py-3 text-right text-sm font-bold" :class="nettoColor(ce(2025)?.risultatoNetto?.importo)">{{ fmtP(ce(2025)?.risultatoNetto?.perc) }}</td>
            </tr>

            <!-- BEP -->
            <tr class="bg-indigo-50 border-t-2 border-indigo-200">
              <td class="px-3 py-2 text-indigo-400 font-mono text-xs font-bold">BEP</td>
              <td class="px-3 py-2 font-semibold text-indigo-800 text-xs">
                BREAK EVEN POINT — Ricavi minimi per coprire i costi fissi
                <span class="text-indigo-400 font-normal ml-1">(Fissi: Personale + Beni Terzi)</span>
              </td>
              <td class="px-3 py-2 text-right font-mono font-semibold text-indigo-700">{{ ce(2023)?.bep != null ? fmt(ce(2023)?.bep) : '—' }}</td>
              <td class="px-2 py-2 text-right text-xs text-indigo-400">—</td>
              <td class="px-3 py-2 text-right font-mono font-semibold text-indigo-700">{{ ce(2024)?.bep != null ? fmt(ce(2024)?.bep) : '—' }}</td>
              <td class="px-2 py-2 text-right text-xs text-indigo-400">—</td>
              <td class="px-3 py-2 text-right font-mono font-semibold text-indigo-700">{{ ce(2025)?.bep != null ? fmt(ce(2025)?.bep) : '—' }}</td>
              <td class="px-2 py-2 text-right text-xs text-indigo-400">—</td>
            </tr>

          </tbody>
        </table>
      </div>

      <!-- Footer -->
      <div class="px-4 py-3 bg-slate-50 border-t border-slate-200 text-xs text-slate-500 flex flex-wrap items-start gap-3">
        <span><i class="fas fa-info-circle text-cyan-500 mr-1"></i>% calcolate su Totale Ricavi.</span>
        <span class="text-amber-600"><i class="fas fa-exclamation-triangle mr-1"></i>La sezione <strong>8.04 Servizi</strong> include storni contabili — il valore netto può risultare negativo: questo è normale nella contabilità per centro di costo. EBITDA e Risultato Netto sono i valori certificati.</span>
        <span><i class="fas fa-database mr-1"></i>Fonte: Kontabila — EntityId=1 (Smiledoc)</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({ layout: 'default' })

const { ceData, loading, error, fetchCE } = useBilancio()

const ce = (anno: number) => ceData.value?.[anno] ?? null

const get = (anno: number, key: string) => ce(anno)?.[key] ?? null

const ricaviVoci = [
  { cod: '9.01', label: 'A1) Ricavi Vendite e Prestazioni', key: 'ricaviVendite' },
  { cod: '9.05', label: 'A5) Altri Ricavi', key: 'altriRicavi' },
  { cod: '9.70', label: 'E20) Proventi / Oneri Straordinari', key: 'proventiStraord' },
]

const personaleVoci = [
  { cod: '8.10', label: 'B9-A) Salari e Stipendi', key: 'salari' },
  { cod: '8.11', label: 'B9-B) Oneri Sociali (INPS, INAIL)', key: 'oneriSociali' },
  { cod: '8.12', label: 'B9-C) TFR — Trattamento Fine Rapporto', key: 'tfr' },
  { cod: '8.14', label: 'B9-E) Altri Costi del Personale', key: 'altriCosti' },
]

const fmt = (v: any): string => {
  if (v == null) return '—'
  return new Intl.NumberFormat('it-IT', {
    style: 'currency', currency: 'EUR', maximumFractionDigits: 0,
  }).format(Number(v))
}

const fmtP = (v: any): string => v != null ? `${v}%` : '—'

const numColor = (v: any) => Number(v) < 0 ? 'text-rose-600' : 'text-slate-800'
const ebitdaColor = (v: any) => Number(v) >= 0 ? 'text-emerald-200' : 'text-red-300'
const nettoColor = (v: any) => Number(v) >= 0 ? 'text-emerald-300' : 'text-red-300'

onMounted(() => fetchCE())
</script>
