<template>
  <div>
    <!-- Header -->
    <div class="bg-white rounded-xl border border-slate-200 shadow-sm mb-4">
      <div class="px-6 py-4 border-b border-slate-100 flex items-center justify-between flex-wrap gap-2">
        <div>
          <h2 class="text-lg font-semibold text-slate-800 flex items-center gap-2">
            <i class="fas fa-stream text-emerald-600"></i>
            Cash Flow Mensile — WSNO-006
          </h2>
          <p class="text-xs text-slate-400 mt-0.5">Smiledoc · Fonte: Kontabila CE mensile · Proiezione mensile su base annuale</p>
        </div>
        <div class="flex items-center gap-2">
          <button
            v-for="a in [2023, 2024, 2025]" :key="a"
            @click="annoSelezionato = a"
            :class="annoSelezionato === a ? 'bg-emerald-600 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'"
            class="px-3 py-1.5 rounded-lg text-sm font-semibold transition-colors"
          >{{ a }}</button>
        </div>
      </div>
    </div>

    <div v-if="loading.cf" class="bg-white rounded-xl shadow-sm p-12 text-center">
      <i class="fas fa-spinner fa-spin text-4xl text-emerald-600 mb-4"></i>
      <p class="text-slate-500">Caricamento Cash Flow...</p>
    </div>

    <div v-else-if="error.cf" class="bg-red-50 border border-red-200 rounded-xl p-4 text-red-700">
      <i class="fas fa-exclamation-circle mr-2"></i>{{ error.cf?.message || 'Errore' }}
    </div>

    <div v-else-if="annoData">
      <!-- KPI row -->
      <div class="grid grid-cols-3 gap-4 mb-4">
        <div class="bg-white rounded-xl border border-slate-200 shadow-sm p-4 text-center">
          <p class="text-xs text-slate-400 mb-1">Tot. Entrate {{ annoSelezionato }}</p>
          <p class="text-xl font-bold text-emerald-600">{{ fmt(totEntrate) }}</p>
        </div>
        <div class="bg-white rounded-xl border border-slate-200 shadow-sm p-4 text-center">
          <p class="text-xs text-slate-400 mb-1">Tot. Uscite {{ annoSelezionato }}</p>
          <p class="text-xl font-bold text-red-600">{{ fmt(totUscite) }}</p>
        </div>
        <div class="bg-white rounded-xl border border-slate-200 shadow-sm p-4 text-center">
          <p class="text-xs text-slate-400 mb-1">Saldo Finale {{ annoSelezionato }}</p>
          <p class="text-xl font-bold" :class="totSaldo >= 0 ? 'text-emerald-600' : 'text-red-600'">{{ fmt(totSaldo) }}</p>
        </div>
      </div>

      <div class="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div class="overflow-x-auto">
          <table class="text-xs border-collapse" style="min-width: 1400px; width: 100%">
            <thead>
              <tr class="bg-slate-800 text-white">
                <th class="text-left px-3 py-3 w-56 text-xs font-semibold tracking-wide sticky left-0 bg-slate-800 z-20">Voce</th>
                <th v-for="mese in annoData.mesi" :key="mese.mese" class="text-right px-2 py-3 text-xs font-semibold" style="width:80px">{{ mese.mese.substring(0,3) }}</th>
                <th class="text-right px-3 py-3 text-xs font-semibold" style="width:90px; background:#374151">TOTALE</th>
              </tr>
            </thead>
            <tbody>

              <!-- SALDO INIZIO -->
              <tr class="bg-slate-100 font-semibold border-b-2 border-slate-300">
                <td class="px-3 py-2 text-slate-700 text-xs sticky left-0 bg-slate-100 z-10">SALDO BANCA INIZIO MESE</td>
                <td v-for="mese in annoData.mesi" :key="'si'+mese.mese" class="px-2 py-2 text-right font-mono" :class="saldoColor(mese.saldoBancaInizio)">{{ fmtK(mese.saldoBancaInizio) }}</td>
                <td class="px-3 py-2 text-right text-slate-400 font-mono" style="background:#f8fafc">—</td>
              </tr>

              <!-- ENTRATE header -->
              <tr class="bg-emerald-700 text-white">
                <td colspan="14" class="px-3 py-2 font-bold text-xs uppercase tracking-wider sticky left-0 bg-emerald-700">ENTRATE</td>
              </tr>
              <tr v-for="voce in entrateVoci" :key="voce.key" class="border-b border-slate-100 hover:bg-emerald-50">
                <td class="px-3 py-1.5 text-slate-600 sticky left-0 bg-white hover:bg-emerald-50 z-10 pl-5 text-xs">{{ voce.label }}</td>
                <td v-for="mese in annoData.mesi" :key="mese.mese+voce.key" class="px-2 py-1.5 text-right font-mono text-emerald-700">{{ fmtK(mese[voce.key]) }}</td>
                <td class="px-3 py-1.5 text-right font-mono text-emerald-800 font-semibold" style="background:#ecfdf5">{{ fmtK(sumMesi(voce.key)) }}</td>
              </tr>
              <tr class="bg-emerald-100 font-bold">
                <td class="px-3 py-2 text-emerald-900 text-xs uppercase sticky left-0 bg-emerald-100 z-10">TOTALE ENTRATE</td>
                <td v-for="mese in annoData.mesi" :key="'te'+mese.mese" class="px-2 py-2 text-right font-mono text-emerald-900">{{ fmtK(mese.totaleEntrate) }}</td>
                <td class="px-3 py-2 text-right font-mono font-bold text-emerald-900" style="background:#d1fae5">{{ fmtK(totEntrate) }}</td>
              </tr>

              <!-- USCITE header -->
              <tr class="bg-red-700 text-white">
                <td colspan="14" class="px-3 py-2 font-bold text-xs uppercase tracking-wider sticky left-0 bg-red-700">USCITE</td>
              </tr>

              <!-- Personale -->
              <tr class="bg-red-50">
                <td colspan="14" class="px-3 py-1 text-xs font-semibold text-red-600 uppercase sticky left-0 bg-red-50">→ Personale</td>
              </tr>
              <tr v-for="voce in usciteSalariVoci" :key="voce.key" class="border-b border-slate-100 hover:bg-red-50">
                <td class="px-3 py-1.5 text-slate-600 sticky left-0 bg-white hover:bg-red-50 z-10 pl-6 text-xs">{{ voce.label }}</td>
                <td v-for="mese in annoData.mesi" :key="mese.mese+voce.key" class="px-2 py-1.5 text-right font-mono text-red-700">{{ fmtK(mese[voce.key]) }}</td>
                <td class="px-3 py-1.5 text-right font-mono text-red-800 font-semibold" style="background:#fff1f2">{{ fmtK(sumMesi(voce.key)) }}</td>
              </tr>

              <!-- Fornitori -->
              <tr class="bg-red-50">
                <td colspan="14" class="px-3 py-1 text-xs font-semibold text-red-600 uppercase sticky left-0 bg-red-50">→ Fornitori e Materiale</td>
              </tr>
              <tr v-for="voce in usciteFornitoriVoci" :key="voce.key" class="border-b border-slate-100 hover:bg-red-50">
                <td class="px-3 py-1.5 text-slate-600 sticky left-0 bg-white hover:bg-red-50 z-10 pl-6 text-xs">{{ voce.label }}</td>
                <td v-for="mese in annoData.mesi" :key="mese.mese+voce.key" class="px-2 py-1.5 text-right font-mono text-red-700">{{ fmtK(mese[voce.key]) }}</td>
                <td class="px-3 py-1.5 text-right font-mono text-red-800 font-semibold" style="background:#fff1f2">{{ fmtK(sumMesi(voce.key)) }}</td>
              </tr>

              <!-- F24 -->
              <tr class="bg-red-50">
                <td colspan="14" class="px-3 py-1 text-xs font-semibold text-red-600 uppercase sticky left-0 bg-red-50">→ F24 — Fiscale e Previdenziale</td>
              </tr>
              <tr v-for="voce in usciteF24Voci" :key="voce.key" class="border-b border-slate-100 hover:bg-red-50">
                <td class="px-3 py-1.5 text-slate-600 sticky left-0 bg-white hover:bg-red-50 z-10 pl-6 text-xs">{{ voce.label }}</td>
                <td v-for="mese in annoData.mesi" :key="mese.mese+voce.key" class="px-2 py-1.5 text-right font-mono text-red-700">{{ fmtK(mese[voce.key]) }}</td>
                <td class="px-3 py-1.5 text-right font-mono text-red-800 font-semibold" style="background:#fff1f2">{{ fmtK(sumMesi(voce.key)) }}</td>
              </tr>

              <!-- Altre Spese -->
              <tr class="bg-red-50">
                <td colspan="14" class="px-3 py-1 text-xs font-semibold text-red-600 uppercase sticky left-0 bg-red-50">→ Altre Spese Operative</td>
              </tr>
              <tr v-for="voce in usciteAltreVoci" :key="voce.key" class="border-b border-slate-100 hover:bg-red-50">
                <td class="px-3 py-1.5 text-slate-600 sticky left-0 bg-white hover:bg-red-50 z-10 pl-6 text-xs">{{ voce.label }}</td>
                <td v-for="mese in annoData.mesi" :key="mese.mese+voce.key" class="px-2 py-1.5 text-right font-mono text-red-700">{{ fmtK(mese[voce.key]) }}</td>
                <td class="px-3 py-1.5 text-right font-mono text-red-800 font-semibold" style="background:#fff1f2">{{ fmtK(sumMesi(voce.key)) }}</td>
              </tr>

              <!-- Totale Uscite -->
              <tr class="bg-red-100 font-bold">
                <td class="px-3 py-2 text-red-900 text-xs uppercase sticky left-0 bg-red-100 z-10">TOTALE USCITE</td>
                <td v-for="mese in annoData.mesi" :key="'tu'+mese.mese" class="px-2 py-2 text-right font-mono text-red-900">{{ fmtK(mese.totaleUscite) }}</td>
                <td class="px-3 py-2 text-right font-mono font-bold text-red-900" style="background:#fee2e2">{{ fmtK(totUscite) }}</td>
              </tr>

              <!-- SALDO FINALE -->
              <tr class="font-bold border-t-4 border-slate-400" style="background:#f1f5f9">
                <td class="px-3 py-3 text-slate-800 uppercase text-xs sticky left-0 z-10" style="background:#f1f5f9">LIQUIDITÀ FINALE MESE</td>
                <td v-for="mese in annoData.mesi" :key="'sf'+mese.mese" class="px-2 py-3 text-right font-mono text-sm" :class="saldoColor(mese.saldoFinale)">{{ fmtK(mese.saldoFinale) }}</td>
                <td class="px-3 py-3 text-right font-mono text-sm font-bold" :class="saldoColor(totSaldo)" style="background:#e2e8f0">{{ fmtK(totSaldo) }}</td>
              </tr>

            </tbody>
          </table>
        </div>
        <div class="px-4 py-3 bg-amber-50 border-t border-amber-200 text-xs text-amber-700">
          <i class="fas fa-info-circle mr-1"></i>
          I valori mensili sono derivati dai dati CE mensili Kontabila. Le sottovoci operative sono stime proporzionali; per un CF finanziario preciso è necessario l'estratto conto bancario.
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({ layout: 'default' })

const { cfData, loading, error, fetchCF } = useBilancio()

const annoSelezionato = ref(2024)
const annoData = computed(() => cfData.value?.find((d: any) => d.anno === annoSelezionato.value) ?? null)

const sumMesi = (key: string): number => {
  if (!annoData.value) return 0
  return annoData.value.mesi.reduce((s: number, m: any) => s + (Number(m[key]) || 0), 0)
}

const totEntrate = computed(() => annoData.value?.mesi.reduce((s: number, m: any) => s + m.totaleEntrate, 0) ?? 0)
const totUscite = computed(() => annoData.value?.mesi.reduce((s: number, m: any) => s + m.totaleUscite, 0) ?? 0)
const totSaldo = computed(() => {
  const mesi = annoData.value?.mesi
  return mesi?.length ? mesi[mesi.length - 1].saldoFinale : 0
})

const entrateVoci = [
  { key: 'erogazioneFinanziamenti', label: 'Erogazione Mutui / Finanziamenti' },
  { key: 'apportoSoci', label: 'Apporto / Finanziamento Soci' },
  { key: 'incassiClienti', label: 'Incassi da Clienti (prestazioni)' },
  { key: 'creditoImposta', label: "Credito d'Imposta / Contributi" },
  { key: 'pianiRientro', label: 'Piani di Rientro / Rate Incassate' },
  { key: 'liquidazioniInteressi', label: 'Liquidazioni Interessi Attivi' },
  { key: 'caparre', label: 'Clienti c/Caparre' },
  { key: 'rimborsiAssicurativi', label: 'Rimborsi Assicurativi / Convenzioni' },
  { key: 'altreEntrate', label: 'Altre Entrate' },
]

const usciteSalariVoci = [
  { key: 'salariStipendi', label: 'Salari e Stipendi Dipendenti (8.10)' },
  { key: 'emolumentoAmministratore', label: 'Emolumento Amministratori' },
]

const usciteFornitoriVoci = [
  { key: 'fornitori', label: 'Pagamenti Fornitori Vari' },
  { key: 'materialeConsumo', label: 'Acquisto Materiale di Consumo (8.01)' },
  { key: 'laboratorio', label: 'Lavorazioni Laboratorio Esterno' },
]

const usciteF24Voci = [
  { key: 'f24Iva', label: 'F24 — IVA (versamento periodico)' },
  { key: 'f24Imposte', label: 'F24 — Imposte Dirette (IRPEF/IRES/IRAP)' },
  { key: 'f24INPS', label: 'F24 — Contributi INPS (8.11)' },
  { key: 'f24Ritenute', label: "F24 — Ritenute d'Acconto Professionisti" },
]

const usciteAltreVoci = [
  { key: 'affittiCanoni', label: 'Affitti e Canoni (8.05)' },
  { key: 'energiaElettrica', label: 'Energia Elettrica' },
  { key: 'utenzeTelefono', label: 'Utenze Telefoniche' },
  { key: 'consulenzeAmministrative', label: 'Consulenze Commercialista / Professionali' },
  { key: 'canoniLeasing', label: 'Canoni Leasing Attrezzature' },
  { key: 'speseBancarie', label: 'Spese Bancarie e Oneri Finanziari (8.43)' },
  { key: 'manutenzioni', label: 'Manutenzioni e Riparazioni' },
  { key: 'formazione', label: 'Corsi di Formazione' },
  { key: 'assicurazioni', label: 'Assicurazioni' },
  { key: 'smaltimentoRifiuti', label: 'Smaltimento Rifiuti Speciali' },
  { key: 'altreSpese', label: 'Altre Spese Operative' },
  { key: 'rateMutui', label: 'Rate Mutui (quota capitale)' },
]

const fmt = (v: any) =>
  new Intl.NumberFormat('it-IT', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 }).format(Number(v) || 0)

const fmtK = (v: any) => {
  const n = Number(v) || 0
  if (n === 0) return '—'
  return new Intl.NumberFormat('it-IT', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 }).format(n)
}

const saldoColor = (v: any) => {
  const n = Number(v) || 0
  if (n > 0) return 'text-emerald-700'
  if (n < 0) return 'text-red-700'
  return 'text-slate-500'
}

onMounted(() => fetchCF())
</script>
