<template>
  <div>
    <!-- Header -->
    <div class="bg-white rounded-xl border border-slate-200 shadow-sm mb-4">
      <div class="px-6 py-4 border-b border-slate-100 flex items-center justify-between flex-wrap gap-2">
        <div>
          <h2 class="text-lg font-semibold text-slate-800 flex items-center gap-2">
            <i class="fas fa-university text-indigo-600"></i>
            Stato Patrimoniale Riclassificato — WSNO-006
          </h2>
          <p class="text-xs text-slate-400 mt-0.5">Smiledoc · Fonte: Kontabila · Triennio 2023–2024–2025</p>
        </div>
        <span class="text-xs px-2 py-1 bg-amber-50 text-amber-700 rounded-full border border-amber-200">
          <i class="fas fa-exclamation-triangle mr-1"></i>SP parziale
        </span>
      </div>
    </div>

    <!-- Avviso dati parziali -->
    <div class="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-4 text-amber-800 text-sm">
      <i class="fas fa-info-circle mr-2 text-amber-600"></i>
      <strong>Nota:</strong> Kontabila non espone un endpoint Stato Patrimoniale. Il Risultato d'Esercizio è derivato dai dati CE; le restanti voci patrimoniali devono essere inserite manualmente dal commercialista.
    </div>

    <!-- Loading -->
    <div v-if="loading.sp" class="bg-white rounded-xl shadow-sm p-12 text-center">
      <i class="fas fa-spinner fa-spin text-4xl text-indigo-600 mb-4"></i>
      <p class="text-slate-500">Caricamento Stato Patrimoniale...</p>
    </div>

    <div v-else-if="error.sp" class="bg-red-50 border border-red-200 rounded-xl p-4 text-red-700">
      <i class="fas fa-exclamation-circle mr-2"></i>{{ error.sp?.message || 'Errore caricamento' }}
    </div>

    <div v-else-if="spData" class="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
      <div class="overflow-x-auto">
        <table class="w-full text-sm border-collapse">
          <thead>
            <tr class="bg-slate-800 text-white">
              <th class="text-left px-4 py-3 text-xs font-semibold tracking-wide">Voce Patrimoniale</th>
              <th class="text-right px-4 py-3 w-32 text-xs font-semibold">2023</th>
              <th class="text-right px-4 py-3 w-32 text-xs font-semibold">2024</th>
              <th class="text-right px-4 py-3 w-32 text-xs font-semibold">2025</th>
            </tr>
          </thead>
          <tbody>

            <!-- ═══════════ ATTIVO ═══════════ -->
            <tr class="bg-indigo-700 text-white">
              <td colspan="4" class="px-4 py-2 font-bold text-sm uppercase tracking-wider">ATTIVO</td>
            </tr>

            <!-- Immobilizzazioni Immateriali -->
            <tr class="bg-indigo-50">
              <td colspan="4" class="px-4 py-1.5 text-xs font-bold text-indigo-700 uppercase tracking-wide">Immobilizzazioni Immateriali</td>
            </tr>
            <tr v-for="r in immImmRows" :key="r.key" class="border-b border-slate-100 hover:bg-slate-50">
              <td class="px-4 py-1.5 text-slate-600 pl-8">{{ r.label }}</td>
              <td v-for="a in ANNI" :key="a" class="px-4 py-1.5 text-right font-mono" :class="r.neg ? 'text-red-600' : 'text-slate-700'">{{ fmt(sp(a)?.attivo?.[r.key]) }}</td>
            </tr>
            <tr class="bg-indigo-100 font-semibold">
              <td class="px-4 py-1.5 pl-8 text-indigo-800">Netto Immobilizzazioni Immateriali</td>
              <td v-for="a in ANNI" :key="a" class="px-4 py-1.5 text-right font-mono text-indigo-900">{{ fmt(sp(a)?.attivo?.nettoImmImmateriali) }}</td>
            </tr>

            <!-- Immobilizzazioni Materiali -->
            <tr class="bg-indigo-50">
              <td colspan="4" class="px-4 py-1.5 text-xs font-bold text-indigo-700 uppercase tracking-wide">Immobilizzazioni Materiali</td>
            </tr>
            <tr v-for="r in immMatRows" :key="r.key" class="border-b border-slate-100 hover:bg-slate-50">
              <td class="px-4 py-1.5 text-slate-600 pl-8">{{ r.label }}</td>
              <td v-for="a in ANNI" :key="a" class="px-4 py-1.5 text-right font-mono" :class="r.neg ? 'text-red-600' : 'text-slate-700'">{{ fmt(sp(a)?.attivo?.[r.key]) }}</td>
            </tr>
            <tr class="bg-indigo-100 font-semibold">
              <td class="px-4 py-1.5 pl-8 text-indigo-800">Netto Immobilizzazioni Materiali</td>
              <td v-for="a in ANNI" :key="a" class="px-4 py-1.5 text-right font-mono text-indigo-900">{{ fmt(sp(a)?.attivo?.nettoImmMateriali) }}</td>
            </tr>

            <!-- Immobilizzazioni Finanziarie -->
            <tr class="border-b border-slate-100 hover:bg-slate-50">
              <td class="px-4 py-1.5 text-slate-600 pl-8">Immobilizzazioni Finanziarie (Partecipazioni, Depositi)</td>
              <td v-for="a in ANNI" :key="a" class="px-4 py-1.5 text-right font-mono text-slate-700">{{ fmt(sp(a)?.attivo?.immFinanziarie) }}</td>
            </tr>

            <!-- ATTIVO FISSO NETTO -->
            <tr class="bg-indigo-200 font-bold border-t-2 border-indigo-400">
              <td class="px-4 py-2 text-indigo-900 uppercase text-xs">ATTIVO FISSO NETTO</td>
              <td v-for="a in ANNI" :key="a" class="px-4 py-2 text-right font-mono text-indigo-900">{{ fmt(sp(a)?.attivo?.attivoFissoNetto) }}</td>
            </tr>

            <!-- Attivo Circolante -->
            <tr class="bg-cyan-50">
              <td colspan="4" class="px-4 py-1.5 text-xs font-bold text-cyan-700 uppercase tracking-wide">Attivo Circolante</td>
            </tr>
            <tr v-for="r in circolanteRows" :key="r.key" class="border-b border-slate-100 hover:bg-slate-50">
              <td class="px-4 py-1.5 text-slate-600 pl-8">{{ r.label }}</td>
              <td v-for="a in ANNI" :key="a" class="px-4 py-1.5 text-right font-mono text-slate-700">{{ fmt(sp(a)?.attivo?.[r.key]) }}</td>
            </tr>
            <tr class="bg-cyan-100 font-semibold">
              <td class="px-4 py-2 text-cyan-900 uppercase text-xs">ATTIVO CIRCOLANTE</td>
              <td v-for="a in ANNI" :key="a" class="px-4 py-2 text-right font-mono text-cyan-900">{{ fmt(sp(a)?.attivo?.attivoCircolante) }}</td>
            </tr>

            <!-- TOTALE ATTIVITÀ -->
            <tr class="bg-indigo-700 text-white font-bold border-t-4 border-indigo-900">
              <td class="px-4 py-3 uppercase text-sm">TOTALE ATTIVITÀ</td>
              <td v-for="a in ANNI" :key="a" class="px-4 py-3 text-right font-mono text-base">{{ fmt(sp(a)?.attivo?.totaleAttivita) }}</td>
            </tr>

            <!-- ═══════════ PASSIVO ═══════════ -->
            <tr class="bg-slate-700 text-white">
              <td colspan="4" class="px-4 py-2 font-bold text-sm uppercase tracking-wider">PASSIVO</td>
            </tr>

            <!-- Patrimonio Netto -->
            <tr class="bg-emerald-50">
              <td colspan="4" class="px-4 py-1.5 text-xs font-bold text-emerald-700 uppercase tracking-wide">Patrimonio Netto</td>
            </tr>
            <tr v-for="r in pnRows" :key="r.key" class="border-b border-slate-100 hover:bg-slate-50">
              <td class="px-4 py-1.5 text-slate-600 pl-8">{{ r.label }}</td>
              <td v-for="a in ANNI" :key="a" class="px-4 py-1.5 text-right font-mono" :class="r.result ? nettoColor(sp(a)?.passivo?.[r.key]) : 'text-slate-700'">{{ fmt(sp(a)?.passivo?.[r.key]) }}</td>
            </tr>
            <tr class="bg-emerald-100 font-semibold">
              <td class="px-4 py-2 text-emerald-900 uppercase text-xs">TOTALE PATRIMONIO NETTO</td>
              <td v-for="a in ANNI" :key="a" class="px-4 py-2 text-right font-mono text-emerald-900">{{ fmt(sp(a)?.passivo?.totalePatrimonioNetto) }}</td>
            </tr>

            <!-- Passività Consolidate -->
            <tr class="bg-orange-50">
              <td colspan="4" class="px-4 py-1.5 text-xs font-bold text-orange-700 uppercase tracking-wide">Passività Consolidate (Lungo Periodo)</td>
            </tr>
            <tr v-for="r in passConsolRows" :key="r.key" class="border-b border-slate-100 hover:bg-slate-50">
              <td class="px-4 py-1.5 text-slate-600 pl-8">{{ r.label }}</td>
              <td v-for="a in ANNI" :key="a" class="px-4 py-1.5 text-right font-mono text-slate-700">{{ fmt(sp(a)?.passivo?.[r.key]) }}</td>
            </tr>
            <tr class="bg-orange-100 font-semibold">
              <td class="px-4 py-2 text-orange-900 uppercase text-xs">TOTALE PASSIVITÀ CONSOLIDATE</td>
              <td v-for="a in ANNI" :key="a" class="px-4 py-2 text-right font-mono text-orange-900">{{ fmt(sp(a)?.passivo?.totalePassConsolidate) }}</td>
            </tr>

            <!-- Passività Correnti -->
            <tr class="bg-red-50">
              <td colspan="4" class="px-4 py-1.5 text-xs font-bold text-red-700 uppercase tracking-wide">Passività Correnti (Breve Periodo)</td>
            </tr>
            <tr v-for="r in passCorrRows" :key="r.key" class="border-b border-slate-100 hover:bg-slate-50">
              <td class="px-4 py-1.5 text-slate-600 pl-8">{{ r.label }}</td>
              <td v-for="a in ANNI" :key="a" class="px-4 py-1.5 text-right font-mono text-slate-700">{{ fmt(sp(a)?.passivo?.[r.key]) }}</td>
            </tr>
            <tr class="bg-red-100 font-semibold">
              <td class="px-4 py-2 text-red-900 uppercase text-xs">TOTALE PASSIVITÀ CORRENTI</td>
              <td v-for="a in ANNI" :key="a" class="px-4 py-2 text-right font-mono text-red-900">{{ fmt(sp(a)?.passivo?.totalePassCorrenti) }}</td>
            </tr>

            <!-- TOTALE PASSIVITÀ -->
            <tr class="bg-slate-700 text-white font-bold border-t-4 border-slate-900">
              <td class="px-4 py-3 uppercase text-sm">TOTALE PASSIVITÀ</td>
              <td v-for="a in ANNI" :key="a" class="px-4 py-3 text-right font-mono text-base">{{ fmt(sp(a)?.passivo?.totalePassivita) }}</td>
            </tr>

            <!-- CHECK -->
            <tr class="border-t-4 border-slate-300 font-bold">
              <td class="px-4 py-2.5 text-slate-700">CHECK = Totale Attività − Totale Passività (deve essere = 0)</td>
              <td v-for="a in ANNI" :key="a" class="px-4 py-2.5 text-right font-mono text-base" :class="checkColor(sp(a)?.check)">
                {{ fmt(sp(a)?.check) }}
                <i v-if="Math.abs(sp(a)?.check || 0) < 1" class="fas fa-check-circle ml-1 text-emerald-500"></i>
              </td>
            </tr>

          </tbody>
        </table>
      </div>

      <!-- Footer -->
      <div class="px-4 py-3 bg-amber-50 border-t border-amber-200 text-xs text-amber-700 flex items-start gap-2">
        <i class="fas fa-info-circle mt-0.5 flex-shrink-0"></i>
        <span>
          <strong>Dati parziali:</strong> Il Risultato d'Esercizio è derivato dal Conto Economico Kontabila. Tutte le altre voci (immobilizzazioni, crediti, debiti, mutui, capitale sociale, riserve) devono essere integrate manualmente con i dati del bilancio depositato presso la Camera di Commercio. Contattare il commercialista per i dati completi.
        </span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({ layout: 'default' })

const { spData, loading, error, fetchSP } = useBilancio()

const ANNI = [2023, 2024, 2025]
const sp = (anno: number) => spData.value?.find((d: any) => d.anno === anno) ?? null

const immImmRows = [
  { key: 'immImmateriali', label: 'Immobilizzazioni Immateriali Lorde (avviamento, marchi, software)', neg: false },
  { key: 'fammImmateriali', label: 'Fondo Ammortamento Immateriali', neg: true },
]

const immMatRows = [
  { key: 'immMateriali_attrezzature', label: 'Attrezzature Sanitarie e Riuniti', neg: false },
  { key: 'immMateriali_mobili', label: 'Mobili, Arredi e Allestimenti', neg: false },
  { key: 'immMateriali_apparecchi', label: 'Apparecchi Radiologici e Strumenti', neg: false },
  { key: 'immMateriali_hardware', label: 'Hardware, PC, Software Gestionale', neg: false },
  { key: 'immMateriali_autoveicoli', label: 'Autoveicoli Aziendali', neg: false },
  { key: 'immMateriali_altri', label: 'Altre Immobilizzazioni Materiali', neg: false },
  { key: 'fammMateriali', label: 'Fondo Ammortamento Materiali', neg: true },
]

const circolanteRows = [
  { key: 'rimanenzeMerce', label: 'Rimanenze di Magazzino (materiale consumo)' },
  { key: 'creditiEntro', label: 'Crediti vs Clienti entro esercizio (prestazioni erogate)' },
  { key: 'creditiOltre', label: 'Crediti vs Clienti oltre esercizio' },
  { key: 'totaleCrediti', label: 'Totale Crediti' },
  { key: 'liquiditaImmediate', label: 'Liquidità Immediate (Cassa + Conti Bancari)' },
  { key: 'rateieRisconti', label: 'Ratei e Risconti Attivi' },
]

const pnRows = [
  { key: 'capitaleSociale', label: 'Capitale Sociale', result: false },
  { key: 'riservaLegale', label: 'Riserva Legale', result: false },
  { key: 'riservaEstraordinaria', label: 'Riserva Straordinaria / Altre Riserve', result: false },
  { key: 'utiliPortatiANuovo', label: 'Utili / Perdite Portati a Nuovo', result: false },
  { key: 'risultatoEsercizio', label: 'Risultato dell\'Esercizio (da CE Kontabila)', result: true },
]

const passConsolRows = [
  { key: 'mutuiMedioLungo', label: 'Mutui e Finanziamenti Medio/Lungo Periodo' },
  { key: 'finanziamentiSoci', label: 'Finanziamenti Soci (infruttiferi)' },
  { key: 'altrePassConsolidate', label: 'Altre Passività Consolidate (TFR, fondi rischi)' },
]

const passCorrRows = [
  { key: 'bancheBrevePeriodo', label: 'Banche e Istituti (Breve Periodo, Fidi)' },
  { key: 'debitiFornitori', label: 'Debiti verso Fornitori e Laboratori' },
  { key: 'debitiErario', label: 'Debiti verso Erario (IVA, imposte)' },
  { key: 'debitiINPS', label: 'Debiti verso INPS / INAIL' },
  { key: 'altrePassCorrenti', label: 'Altre Passività Correnti' },
]

const fmt = (v: any): string => {
  if (v == null) return '—'
  return new Intl.NumberFormat('it-IT', {
    style: 'currency', currency: 'EUR', maximumFractionDigits: 0,
  }).format(Number(v))
}

const nettoColor = (v: any) => Number(v) >= 0 ? 'text-emerald-700' : 'text-red-700'

const checkColor = (v: any) => {
  const n = Math.abs(Number(v) || 0)
  if (n < 1) return 'text-emerald-600'
  if (n < 1000) return 'text-amber-600'
  return 'text-red-600'
}

onMounted(() => fetchSP())
</script>
