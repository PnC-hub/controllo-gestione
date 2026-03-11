<template>
  <div>
    <div class="card mb-4">
      <div class="card-header">
        <div class="flex items-center justify-between flex-wrap gap-2">
          <h2 class="card-title">
            <i class="fas fa-university mr-2 text-indigo-600"></i>
            Stato Patrimoniale Riclassificato — WSNO-006
          </h2>
          <span class="text-xs text-gray-500">Fonte: Kontabila · Smiledoc</span>
        </div>
      </div>
    </div>

    <div v-if="loading.sp" class="bg-white rounded-lg shadow p-12 text-center">
      <i class="fas fa-spinner fa-spin text-4xl text-indigo-600 mb-4"></i>
      <p class="text-gray-500">Caricamento Stato Patrimoniale...</p>
    </div>

    <div v-else-if="error.sp" class="bg-red-50 border border-red-200 rounded-lg p-4 text-red-700">
      <i class="fas fa-exclamation-circle mr-2"></i>
      Errore nel caricamento: {{ error.sp?.message || 'Kontabila non raggiungibile' }}
    </div>

    <div v-else-if="spData" class="bg-white rounded-lg shadow overflow-hidden">
      <div class="overflow-x-auto">
        <table class="w-full text-sm">
          <thead>
            <tr class="bg-indigo-700 text-white">
              <th class="text-left px-3 py-2">Voce</th>
              <th class="text-right px-3 py-2 w-32">2023</th>
              <th class="text-right px-3 py-2 w-32">2024</th>
              <th class="text-right px-3 py-2 w-32">2025</th>
            </tr>
          </thead>
          <tbody>
            <!-- ===== ATTIVO ===== -->
            <tr class="bg-indigo-600 text-white font-bold">
              <td colspan="4" class="px-3 py-2 uppercase tracking-wider text-sm">ATTIVO</td>
            </tr>

            <!-- Immobilizzazioni Immateriali -->
            <tr class="bg-indigo-50">
              <td colspan="4" class="px-3 py-1 text-xs font-bold text-indigo-700 uppercase">Immobilizzazioni Immateriali</td>
            </tr>
            <tr v-for="(row, i) in immobImmRows" :key="'immi' + i" class="border-b border-gray-100 hover:bg-gray-50">
              <td class="px-3 py-1.5 pl-6 text-gray-600">{{ row.label }}</td>
              <td v-for="anno in ANNI" :key="anno" class="px-3 py-1.5 text-right font-mono" :class="row.negative ? 'text-red-600' : ''">
                {{ fmtN(getAnno(anno)?.attivo[row.key]) }}
              </td>
            </tr>
            <tr class="bg-indigo-100 font-semibold">
              <td class="px-3 py-1.5 pl-6 text-indigo-800">Netto Imm. Immateriali</td>
              <td v-for="anno in ANNI" :key="anno" class="px-3 py-1.5 text-right font-mono text-indigo-900">
                {{ fmtN(getAnno(anno)?.attivo.nettoImmobImmateriali) }}
              </td>
            </tr>

            <!-- Immobilizzazioni Materiali -->
            <tr class="bg-indigo-50">
              <td colspan="4" class="px-3 py-1 text-xs font-bold text-indigo-700 uppercase">Immobilizzazioni Materiali</td>
            </tr>
            <tr v-for="(row, i) in immobMatRows" :key="'immm' + i" class="border-b border-gray-100 hover:bg-gray-50">
              <td class="px-3 py-1.5 pl-6 text-gray-600">{{ row.label }}</td>
              <td v-for="anno in ANNI" :key="anno" class="px-3 py-1.5 text-right font-mono" :class="row.negative ? 'text-red-600' : ''">
                {{ fmtN(getAnno(anno)?.attivo[row.key]) }}
              </td>
            </tr>
            <tr class="bg-indigo-100 font-semibold">
              <td class="px-3 py-1.5 pl-6 text-indigo-800">Netto Imm. Materiali</td>
              <td v-for="anno in ANNI" :key="anno" class="px-3 py-1.5 text-right font-mono text-indigo-900">
                {{ fmtN(getAnno(anno)?.attivo.nettoImmobMateriali) }}
              </td>
            </tr>

            <!-- Immobilizzazioni Finanziarie -->
            <tr class="border-b border-gray-100 hover:bg-gray-50">
              <td class="px-3 py-1.5 pl-6 text-gray-600">Immobilizzazioni Finanziarie</td>
              <td v-for="anno in ANNI" :key="anno" class="px-3 py-1.5 text-right font-mono">
                {{ fmtN(getAnno(anno)?.attivo.immobilizzazioniFinanziarie) }}
              </td>
            </tr>

            <!-- ATTIVO FISSO NETTO -->
            <tr class="bg-indigo-200 font-bold">
              <td class="px-3 py-2 text-indigo-900 uppercase">ATTIVO FISSO NETTO</td>
              <td v-for="anno in ANNI" :key="anno" class="px-3 py-2 text-right font-mono text-indigo-900">
                {{ fmtN(getAnno(anno)?.attivo.attivoFissoNetto) }}
              </td>
            </tr>

            <!-- Attivo Circolante -->
            <tr class="bg-cyan-50">
              <td colspan="4" class="px-3 py-1 text-xs font-bold text-cyan-700 uppercase">Attivo Circolante</td>
            </tr>
            <tr v-for="(row, i) in circolanteRows" :key="'circ' + i" class="border-b border-gray-100 hover:bg-gray-50">
              <td class="px-3 py-1.5 pl-6 text-gray-600">{{ row.label }}</td>
              <td v-for="anno in ANNI" :key="anno" class="px-3 py-1.5 text-right font-mono">
                {{ fmtN(getAnno(anno)?.attivo[row.key]) }}
              </td>
            </tr>
            <tr class="bg-cyan-100 font-semibold">
              <td class="px-3 py-2 text-cyan-900">ATTIVO CIRCOLANTE</td>
              <td v-for="anno in ANNI" :key="anno" class="px-3 py-2 text-right font-mono text-cyan-900">
                {{ fmtN(getAnno(anno)?.attivo.attivoCircolante) }}
              </td>
            </tr>

            <!-- TOTALE ATTIVITÀ -->
            <tr class="bg-indigo-700 text-white font-bold border-t-2 border-indigo-900">
              <td class="px-3 py-2.5 uppercase">TOTALE ATTIVITÀ</td>
              <td v-for="anno in ANNI" :key="anno" class="px-3 py-2.5 text-right font-mono">
                {{ fmtN(getAnno(anno)?.attivo.totaleAttivita) }}
              </td>
            </tr>

            <!-- ===== PASSIVO ===== -->
            <tr class="bg-gray-700 text-white font-bold">
              <td colspan="4" class="px-3 py-2 uppercase tracking-wider text-sm">PASSIVO</td>
            </tr>

            <!-- Patrimonio Netto -->
            <tr class="bg-green-50">
              <td colspan="4" class="px-3 py-1 text-xs font-bold text-green-700 uppercase">Patrimonio Netto</td>
            </tr>
            <tr v-for="(row, i) in patrimonioRows" :key="'pn' + i" class="border-b border-gray-100 hover:bg-gray-50">
              <td class="px-3 py-1.5 pl-6 text-gray-600">{{ row.label }}</td>
              <td v-for="anno in ANNI" :key="anno" class="px-3 py-1.5 text-right font-mono" :class="row.resultKey ? nettoColor(getAnno(anno)?.passivo[row.key]) : ''">
                {{ fmtN(getAnno(anno)?.passivo[row.key]) }}
              </td>
            </tr>
            <tr class="bg-green-100 font-semibold">
              <td class="px-3 py-2 text-green-900">TOTALE PATRIMONIO NETTO</td>
              <td v-for="anno in ANNI" :key="anno" class="px-3 py-2 text-right font-mono text-green-900">
                {{ fmtN(getAnno(anno)?.passivo.totalePatrimonioNetto) }}
              </td>
            </tr>

            <!-- Passività Consolidate -->
            <tr class="bg-orange-50">
              <td colspan="4" class="px-3 py-1 text-xs font-bold text-orange-700 uppercase">Passività Consolidate</td>
            </tr>
            <tr v-for="(row, i) in passConsolidateRows" :key="'pc' + i" class="border-b border-gray-100 hover:bg-gray-50">
              <td class="px-3 py-1.5 pl-6 text-gray-600">{{ row.label }}</td>
              <td v-for="anno in ANNI" :key="anno" class="px-3 py-1.5 text-right font-mono">
                {{ fmtN(getAnno(anno)?.passivo[row.key]) }}
              </td>
            </tr>
            <tr class="bg-orange-100 font-semibold">
              <td class="px-3 py-2 text-orange-900">TOTALE PASSIVITÀ CONSOLIDATE</td>
              <td v-for="anno in ANNI" :key="anno" class="px-3 py-2 text-right font-mono text-orange-900">
                {{ fmtN(getAnno(anno)?.passivo.totalePassivitaConsolidate) }}
              </td>
            </tr>

            <!-- Passività Correnti -->
            <tr class="bg-red-50">
              <td colspan="4" class="px-3 py-1 text-xs font-bold text-red-700 uppercase">Passività Correnti</td>
            </tr>
            <tr v-for="(row, i) in passCorrentRows" :key="'pcorr' + i" class="border-b border-gray-100 hover:bg-gray-50">
              <td class="px-3 py-1.5 pl-6 text-gray-600">{{ row.label }}</td>
              <td v-for="anno in ANNI" :key="anno" class="px-3 py-1.5 text-right font-mono">
                {{ fmtN(getAnno(anno)?.passivo[row.key]) }}
              </td>
            </tr>
            <tr class="bg-red-100 font-semibold">
              <td class="px-3 py-2 text-red-900">TOTALE PASSIVITÀ CORRENTI</td>
              <td v-for="anno in ANNI" :key="anno" class="px-3 py-2 text-right font-mono text-red-900">
                {{ fmtN(getAnno(anno)?.passivo.totalePassivitaCorrenti) }}
              </td>
            </tr>

            <!-- TOTALE PASSIVITÀ -->
            <tr class="bg-gray-700 text-white font-bold border-t-2 border-gray-900">
              <td class="px-3 py-2.5 uppercase">TOTALE PASSIVITÀ</td>
              <td v-for="anno in ANNI" :key="anno" class="px-3 py-2.5 text-right font-mono">
                {{ fmtN(getAnno(anno)?.passivo.totalePassivita) }}
              </td>
            </tr>

            <!-- CHECK -->
            <tr class="font-bold border-t-4 border-gray-300">
              <td class="px-3 py-2 text-gray-700">CHECK (Attivo − Passivo)</td>
              <td v-for="anno in ANNI" :key="anno" class="px-3 py-2 text-right font-mono" :class="checkColor(getAnno(anno)?.check)">
                {{ fmtN(getAnno(anno)?.check) }}
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <div class="px-4 py-3 bg-gray-50 border-t border-gray-200 text-xs text-gray-500 flex items-center gap-1">
        <i class="fas fa-info-circle"></i>
        Check = Totale Attività − Totale Passività (ideale = 0). Dati da Kontabila per entityId=1 (Smiledoc).
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({ layout: 'default' })

const { spData, loading, error, fetchSP } = useBilancio()

const ANNI = [2023, 2024, 2025]

const getAnno = (anno: number) => spData.value?.find((d: any) => d.anno === anno)

const fmtN = (v: any) => {
  if (v == null) return '—'
  return new Intl.NumberFormat('it-IT', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 }).format(Number(v) || 0)
}

const checkColor = (v: any) => {
  if (v == null) return 'text-gray-400'
  const n = Math.abs(Number(v))
  if (n < 1) return 'text-green-600'
  if (n < 1000) return 'text-yellow-600'
  return 'text-red-600'
}

const nettoColor = (v: any) => {
  if (v == null) return ''
  return Number(v) >= 0 ? 'text-green-700' : 'text-red-700'
}

const immobImmRows = [
  { key: 'immobilizzazioniImmateriali', label: 'Immobilizzazioni Immateriali', negative: false },
  { key: 'fondoAmmImmateriali', label: 'Fondo Ammortamento Immateriali', negative: true },
]

const immobMatRows = [
  { key: 'immobilizzazioniMateriali', label: 'Immobilizzazioni Materiali', negative: false },
  { key: 'fondoAmmMateriali', label: 'Fondo Ammortamento Materiali', negative: true },
]

const circolanteRows = [
  { key: 'rimanenzeMerce', label: 'Rimanenze Merce' },
  { key: 'creditiEntroEsercizio', label: 'Crediti entro esercizio' },
  { key: 'creditiOltreEsercizio', label: 'Crediti oltre esercizio' },
  { key: 'liquiditaDifferite', label: 'Liquidità Differite (Crediti)' },
  { key: 'liquiditaImmediate', label: 'Liquidità Immediate (Banca/Cassa)' },
  { key: 'rateieRiscontiAttivi', label: 'Ratei e Risconti Attivi' },
]

const patrimonioRows = [
  { key: 'capitaleSociale', label: 'Capitale Sociale', resultKey: false },
  { key: 'riservaLegale', label: 'Riserva Legale', resultKey: false },
  { key: 'riservaEstraordinaria', label: 'Riserva Straordinaria', resultKey: false },
  { key: 'risultatoEsercizio', label: 'Risultato di Esercizio', resultKey: true },
]

const passConsolidateRows = [
  { key: 'passivitaConsolidateVarie', label: 'Passività Consolidate Varie' },
  { key: 'mutuiEFinanziamenti', label: 'Mutui e Finanziamenti (lungo)' },
]

const passCorrentRows = [
  { key: 'banchEntro12Mesi', label: 'Banche entro 12 mesi' },
  { key: 'passivitaCorrentiVarie', label: 'Passività Correnti Varie (fornitori, altro)' },
]

onMounted(() => fetchSP())
</script>

<style scoped>
.card { @apply bg-white rounded-lg shadow; }
.card-header { @apply px-4 py-3 border-b border-gray-200; }
.card-title { @apply text-lg font-semibold text-gray-800 flex items-center; }
</style>
