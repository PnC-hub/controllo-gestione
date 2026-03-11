<template>
  <div>
    <div class="card mb-4">
      <div class="card-header">
        <div class="flex items-center justify-between flex-wrap gap-2">
          <h2 class="card-title">
            <i class="fas fa-file-invoice-dollar mr-2 text-cyan-600"></i>
            Conto Economico Riclassificato — WSNO-006
          </h2>
          <span class="text-xs text-gray-500">Fonte: Kontabila · Smiledoc</span>
        </div>
      </div>
    </div>

    <div v-if="loading.ce" class="bg-white rounded-lg shadow p-12 text-center">
      <i class="fas fa-spinner fa-spin text-4xl text-cyan-600 mb-4"></i>
      <p class="text-gray-500">Caricamento dati Conto Economico...</p>
    </div>

    <div v-else-if="error.ce" class="bg-red-50 border border-red-200 rounded-lg p-4 text-red-700">
      <i class="fas fa-exclamation-circle mr-2"></i>
      Errore nel caricamento: {{ error.ce?.message || 'Kontabila non raggiungibile' }}
    </div>

    <div v-else-if="ceData" class="bg-white rounded-lg shadow overflow-hidden">
      <div class="overflow-x-auto">
        <table class="w-full text-sm">
          <thead>
            <tr class="bg-cyan-700 text-white">
              <th class="text-left px-3 py-2 w-20">Cod.</th>
              <th class="text-left px-3 py-2">Descrizione</th>
              <th class="text-right px-3 py-2 w-28">2023</th>
              <th class="text-right px-3 py-2 w-16">%</th>
              <th class="text-right px-3 py-2 w-28">2024</th>
              <th class="text-right px-3 py-2 w-16">%</th>
              <th class="text-right px-3 py-2 w-28">2025</th>
              <th class="text-right px-3 py-2 w-16">%</th>
            </tr>
          </thead>
          <tbody>
            <!-- RICAVI -->
            <tr class="bg-cyan-50">
              <td colspan="8" class="px-3 py-1.5 font-bold text-cyan-800 uppercase text-xs tracking-wide">A · Ricavi</td>
            </tr>
            <template v-for="anno in ceData" :key="'_'"><!-- solo per accedere alle voci del primo anno disponibile --></template>
            <template v-if="primoAnno">
              <tr v-for="(voce, i) in primoAnno.ricavi.voci" :key="'r' + i" class="border-b border-gray-100 hover:bg-gray-50">
                <td class="px-3 py-1.5 text-gray-400 font-mono text-xs">{{ voce.cod }}</td>
                <td class="px-3 py-1.5 text-gray-700">{{ voce.desc }}</td>
                <td class="px-3 py-1.5 text-right font-mono">{{ fmtN(getAnnoVoce(2023, 'ricavi', i)?.importo) }}</td>
                <td class="px-3 py-1.5 text-right text-gray-400 text-xs">{{ fmtP(getAnnoVoce(2023, 'ricavi', i)?.perc) }}</td>
                <td class="px-3 py-1.5 text-right font-mono">{{ fmtN(getAnnoVoce(2024, 'ricavi', i)?.importo) }}</td>
                <td class="px-3 py-1.5 text-right text-gray-400 text-xs">{{ fmtP(getAnnoVoce(2024, 'ricavi', i)?.perc) }}</td>
                <td class="px-3 py-1.5 text-right font-mono">{{ fmtN(getAnnoVoce(2025, 'ricavi', i)?.importo) }}</td>
                <td class="px-3 py-1.5 text-right text-gray-400 text-xs">{{ fmtP(getAnnoVoce(2025, 'ricavi', i)?.perc) }}</td>
              </tr>
            </template>
            <tr class="bg-cyan-100 font-semibold">
              <td colspan="2" class="px-3 py-2 text-cyan-900">TOTALE RICAVI (A)</td>
              <td class="px-3 py-2 text-right font-mono text-cyan-900">{{ fmtN(getAnno(2023)?.ricavi.totale) }}</td>
              <td class="px-3 py-2 text-right text-cyan-700 text-xs">{{ fmtP(getAnno(2023)?.ricavi.totalePerc) }}</td>
              <td class="px-3 py-2 text-right font-mono text-cyan-900">{{ fmtN(getAnno(2024)?.ricavi.totale) }}</td>
              <td class="px-3 py-2 text-right text-cyan-700 text-xs">{{ fmtP(getAnno(2024)?.ricavi.totalePerc) }}</td>
              <td class="px-3 py-2 text-right font-mono text-cyan-900">{{ fmtN(getAnno(2025)?.ricavi.totale) }}</td>
              <td class="px-3 py-2 text-right text-cyan-700 text-xs">{{ fmtP(getAnno(2025)?.ricavi.totalePerc) }}</td>
            </tr>

            <!-- PIL -->
            <tr class="bg-gray-50 border-t-2 border-gray-300">
              <td colspan="2" class="px-3 py-1.5 font-semibold text-gray-700">Prodotto Interno Lordo (PIL)</td>
              <td class="px-3 py-1.5 text-right font-mono">{{ fmtN(getAnno(2023)?.prodottoInterneLordo.importo) }}</td>
              <td class="px-3 py-1.5 text-right text-gray-400 text-xs">{{ fmtP(getAnno(2023)?.prodottoInterneLordo.perc) }}</td>
              <td class="px-3 py-1.5 text-right font-mono">{{ fmtN(getAnno(2024)?.prodottoInterneLordo.importo) }}</td>
              <td class="px-3 py-1.5 text-right text-gray-400 text-xs">{{ fmtP(getAnno(2024)?.prodottoInterneLordo.perc) }}</td>
              <td class="px-3 py-1.5 text-right font-mono">{{ fmtN(getAnno(2025)?.prodottoInterneLordo.importo) }}</td>
              <td class="px-3 py-1.5 text-right text-gray-400 text-xs">{{ fmtP(getAnno(2025)?.prodottoInterneLordo.perc) }}</td>
            </tr>

            <!-- RIMANENZE INIZIALI -->
            <tr class="bg-orange-50">
              <td colspan="8" class="px-3 py-1.5 font-bold text-orange-800 uppercase text-xs tracking-wide">B · Rimanenze Iniziali</td>
            </tr>
            <tr class="border-b border-gray-100">
              <td colspan="2" class="px-3 py-1.5 text-gray-500 italic pl-6">Nessuna rimanenza registrata</td>
              <td colspan="6" class="px-3 py-1.5 text-right text-gray-400">—</td>
            </tr>
            <tr class="bg-orange-100 font-semibold">
              <td colspan="2" class="px-3 py-2 text-orange-900">TOTALE RIMANENZE INIZIALI (B)</td>
              <td class="px-3 py-2 text-right font-mono text-orange-900">{{ fmtN(0) }}</td>
              <td colspan="5" class="px-3 py-2 text-right text-gray-400">—</td>
            </tr>

            <!-- ACQUISTI / COSTI -->
            <tr class="bg-red-50">
              <td colspan="8" class="px-3 py-1.5 font-bold text-red-800 uppercase text-xs tracking-wide">C · Acquisti e Costi Operativi</td>
            </tr>
            <template v-if="primoAnno">
              <tr v-for="(voce, i) in primoAnno.acquisti.voci" :key="'c' + i" class="border-b border-gray-100 hover:bg-gray-50">
                <td class="px-3 py-1.5 text-gray-400 font-mono text-xs">{{ voce.cod }}</td>
                <td class="px-3 py-1.5 text-gray-700">{{ voce.desc }}</td>
                <td class="px-3 py-1.5 text-right font-mono text-red-700">{{ fmtN(getAnnoVoce(2023, 'acquisti', i)?.importo) }}</td>
                <td class="px-3 py-1.5 text-right text-gray-400 text-xs">{{ fmtP(getAnnoVoce(2023, 'acquisti', i)?.perc) }}</td>
                <td class="px-3 py-1.5 text-right font-mono text-red-700">{{ fmtN(getAnnoVoce(2024, 'acquisti', i)?.importo) }}</td>
                <td class="px-3 py-1.5 text-right text-gray-400 text-xs">{{ fmtP(getAnnoVoce(2024, 'acquisti', i)?.perc) }}</td>
                <td class="px-3 py-1.5 text-right font-mono text-red-700">{{ fmtN(getAnnoVoce(2025, 'acquisti', i)?.importo) }}</td>
                <td class="px-3 py-1.5 text-right text-gray-400 text-xs">{{ fmtP(getAnnoVoce(2025, 'acquisti', i)?.perc) }}</td>
              </tr>
            </template>
            <tr class="bg-red-100 font-semibold">
              <td colspan="2" class="px-3 py-2 text-red-900">TOTALE ACQUISTI/COSTI (C)</td>
              <td class="px-3 py-2 text-right font-mono text-red-900">{{ fmtN(getAnno(2023)?.acquisti.totale) }}</td>
              <td class="px-3 py-2 text-right text-red-700 text-xs">{{ fmtP(getAnno(2023)?.acquisti.totalePerc) }}</td>
              <td class="px-3 py-2 text-right font-mono text-red-900">{{ fmtN(getAnno(2024)?.acquisti.totale) }}</td>
              <td class="px-3 py-2 text-right text-red-700 text-xs">{{ fmtP(getAnno(2024)?.acquisti.totalePerc) }}</td>
              <td class="px-3 py-2 text-right font-mono text-red-900">{{ fmtN(getAnno(2025)?.acquisti.totale) }}</td>
              <td class="px-3 py-2 text-right text-red-700 text-xs">{{ fmtP(getAnno(2025)?.acquisti.totalePerc) }}</td>
            </tr>

            <!-- RIMANENZE FINALI -->
            <tr class="bg-orange-50">
              <td colspan="8" class="px-3 py-1.5 font-bold text-orange-800 uppercase text-xs tracking-wide">D · Rimanenze Finali</td>
            </tr>
            <tr class="bg-orange-100 font-semibold">
              <td colspan="2" class="px-3 py-2 text-orange-900">TOTALE RIMANENZE FINALI (D)</td>
              <td class="px-3 py-2 text-right font-mono text-orange-900">{{ fmtN(0) }}</td>
              <td colspan="5" class="px-3 py-2 text-right text-gray-400">—</td>
            </tr>

            <!-- EBITDA -->
            <tr class="bg-cyan-600 text-white font-bold border-t-2 border-cyan-800">
              <td colspan="2" class="px-3 py-2.5 text-white">EBITDA (A − B − C + D)</td>
              <td class="px-3 py-2.5 text-right font-mono" :class="ebitdaClass(getAnno(2023)?.ebitda.importo)">{{ fmtN(getAnno(2023)?.ebitda.importo) }}</td>
              <td class="px-3 py-2.5 text-right text-cyan-200 text-xs">{{ fmtP(getAnno(2023)?.ebitda.perc) }}</td>
              <td class="px-3 py-2.5 text-right font-mono" :class="ebitdaClass(getAnno(2024)?.ebitda.importo)">{{ fmtN(getAnno(2024)?.ebitda.importo) }}</td>
              <td class="px-3 py-2.5 text-right text-cyan-200 text-xs">{{ fmtP(getAnno(2024)?.ebitda.perc) }}</td>
              <td class="px-3 py-2.5 text-right font-mono" :class="ebitdaClass(getAnno(2025)?.ebitda.importo)">{{ fmtN(getAnno(2025)?.ebitda.importo) }}</td>
              <td class="px-3 py-2.5 text-right text-cyan-200 text-xs">{{ fmtP(getAnno(2025)?.ebitda.perc) }}</td>
            </tr>

            <!-- RISULTATO NETTO -->
            <tr class="font-bold border-t-4 border-gray-400 bg-gray-800 text-white">
              <td colspan="2" class="px-3 py-2.5">RISULTATO NETTO</td>
              <td class="px-3 py-2.5 text-right font-mono" :class="nettoClass(getAnno(2023)?.risultatoNetto.importo)">{{ fmtN(getAnno(2023)?.risultatoNetto.importo) }}</td>
              <td class="px-3 py-2.5 text-right text-gray-400 text-xs">{{ fmtP(getAnno(2023)?.risultatoNetto.perc) }}</td>
              <td class="px-3 py-2.5 text-right font-mono" :class="nettoClass(getAnno(2024)?.risultatoNetto.importo)">{{ fmtN(getAnno(2024)?.risultatoNetto.importo) }}</td>
              <td class="px-3 py-2.5 text-right text-gray-400 text-xs">{{ fmtP(getAnno(2024)?.risultatoNetto.perc) }}</td>
              <td class="px-3 py-2.5 text-right font-mono" :class="nettoClass(getAnno(2025)?.risultatoNetto.importo)">{{ fmtN(getAnno(2025)?.risultatoNetto.importo) }}</td>
              <td class="px-3 py-2.5 text-right text-gray-400 text-xs">{{ fmtP(getAnno(2025)?.risultatoNetto.perc) }}</td>
            </tr>
          </tbody>
        </table>
      </div>

      <div class="px-4 py-3 bg-gray-50 border-t border-gray-200 text-xs text-gray-500 flex items-center gap-1">
        <i class="fas fa-info-circle"></i>
        % calcolate rispetto a Totale Ricavi. Dati aggregati annuali da Kontabila per entityId=1 (Smiledoc).
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({ layout: 'default' })

const { ceData, loading, error, fetchCE } = useBilancio()

const ANNI = [2023, 2024, 2025]

const primoAnno = computed(() => {
  if (!ceData.value?.length) return null
  return ceData.value.find((d: any) => d.ricavi.voci.length > 0) ?? ceData.value[0]
})

const getAnno = (anno: number) => ceData.value?.find((d: any) => d.anno === anno)

const getAnnoVoce = (anno: number, sezione: 'ricavi' | 'acquisti', idx: number) => {
  const a = getAnno(anno)
  if (!a) return null
  return a[sezione]?.voci?.[idx] ?? null
}

const fmtN = (v: any) => {
  if (v == null) return '—'
  return new Intl.NumberFormat('it-IT', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 }).format(Number(v) || 0)
}
const fmtP = (v: any) => v != null ? `${v}%` : '—'

const ebitdaClass = (v: any) => {
  if (v == null) return ''
  return Number(v) >= 0 ? 'text-green-300' : 'text-red-300'
}
const nettoClass = (v: any) => {
  if (v == null) return ''
  return Number(v) >= 0 ? 'text-green-400' : 'text-red-400'
}

onMounted(() => fetchCE())
</script>

<style scoped>
.card { @apply bg-white rounded-lg shadow; }
.card-header { @apply px-4 py-3 border-b border-gray-200; }
.card-title { @apply text-lg font-semibold text-gray-800 flex items-center; }
</style>
