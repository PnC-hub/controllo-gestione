<template>
  <div>
    <div class="card mb-4">
      <div class="card-header">
        <div class="flex items-center justify-between flex-wrap gap-2">
          <h2 class="card-title">
            <i class="fas fa-water mr-2 text-green-600"></i>
            Cash Flow Mensile — WSNO-006
          </h2>
          <div class="flex items-center gap-3">
            <div class="flex gap-1">
              <button
                v-for="a in ANNI" :key="a"
                @click="annoSelezionato = a"
                class="px-3 py-1 rounded text-sm font-medium transition-colors"
                :class="annoSelezionato === a ? 'bg-green-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'"
              >{{ a }}</button>
            </div>
            <span class="text-xs text-gray-500">Fonte: Kontabila · Smiledoc</span>
          </div>
        </div>
      </div>
    </div>

    <div v-if="loading.cf" class="bg-white rounded-lg shadow p-12 text-center">
      <i class="fas fa-spinner fa-spin text-4xl text-green-600 mb-4"></i>
      <p class="text-gray-500">Caricamento Cash Flow...</p>
    </div>

    <div v-else-if="error.cf" class="bg-red-50 border border-red-200 rounded-lg p-4 text-red-700">
      <i class="fas fa-exclamation-circle mr-2"></i>
      Errore: {{ error.cf?.message || 'Kontabila non raggiungibile' }}
    </div>

    <div v-else-if="cfAnno" class="bg-white rounded-lg shadow overflow-hidden">
      <div class="overflow-x-auto">
        <table class="text-xs min-w-max w-full">
          <thead>
            <tr class="bg-green-700 text-white">
              <th class="text-left px-3 py-2 w-48 sticky left-0 bg-green-700 z-10">Voce</th>
              <th v-for="m in cfAnno.mesi" :key="m.indice" class="text-right px-2 py-2 min-w-[80px]">
                {{ m.mese.slice(0, 3) }}
              </th>
              <th class="text-right px-3 py-2 min-w-[90px] bg-green-800">TOTALE</th>
            </tr>
          </thead>
          <tbody>
            <!-- Saldo Banca Inizio -->
            <tr class="bg-gray-100 font-semibold">
              <td class="px-3 py-1.5 text-gray-700 sticky left-0 bg-gray-100 z-10">Saldo Banca Inizio</td>
              <td v-for="m in cfAnno.mesi" :key="m.indice" class="px-2 py-1.5 text-right font-mono" :class="m.saldoBancaInizio >= 0 ? 'text-gray-700' : 'text-red-600'">
                {{ fmtK(m.saldoBancaInizio) }}
              </td>
              <td class="px-3 py-1.5 text-right font-mono text-gray-500">—</td>
            </tr>

            <!-- ENTRATE -->
            <tr class="bg-green-600 text-white font-bold">
              <td colspan="14" class="px-3 py-1.5 sticky left-0 bg-green-600 z-10 uppercase tracking-wide">ENTRATE</td>
            </tr>
            <tr v-for="(row, i) in entrateRows" :key="'e' + i" class="border-b border-gray-100 hover:bg-green-50">
              <td class="px-3 py-1.5 pl-5 text-gray-600 sticky left-0 bg-white hover:bg-green-50 z-10">{{ row.label }}</td>
              <td v-for="m in cfAnno.mesi" :key="m.indice" class="px-2 py-1.5 text-right font-mono text-green-700">
                {{ fmtK(m[row.key]) }}
              </td>
              <td class="px-3 py-1.5 text-right font-mono text-green-800 font-semibold">
                {{ fmtK(sumMesi(row.key)) }}
              </td>
            </tr>
            <tr class="bg-green-100 font-bold">
              <td class="px-3 py-2 text-green-900 sticky left-0 bg-green-100 z-10">TOTALE ENTRATE</td>
              <td v-for="m in cfAnno.mesi" :key="m.indice" class="px-2 py-2 text-right font-mono text-green-900">
                {{ fmtK(m.totaleEntrate) }}
              </td>
              <td class="px-3 py-2 text-right font-mono text-green-900">{{ fmtK(sumMesi('totaleEntrate')) }}</td>
            </tr>

            <!-- USCITE -->
            <tr class="bg-red-600 text-white font-bold">
              <td colspan="14" class="px-3 py-1.5 sticky left-0 bg-red-600 z-10 uppercase tracking-wide">USCITE</td>
            </tr>
            <tr v-for="(row, i) in usciteRows" :key="'u' + i" class="border-b border-gray-100 hover:bg-red-50">
              <td class="px-3 py-1.5 pl-5 text-gray-600 sticky left-0 bg-white hover:bg-red-50 z-10">{{ row.label }}</td>
              <td v-for="m in cfAnno.mesi" :key="m.indice" class="px-2 py-1.5 text-right font-mono text-red-700">
                {{ fmtK(m[row.key]) }}
              </td>
              <td class="px-3 py-1.5 text-right font-mono text-red-800 font-semibold">
                {{ fmtK(sumMesi(row.key)) }}
              </td>
            </tr>
            <tr class="bg-red-100 font-bold">
              <td class="px-3 py-2 text-red-900 sticky left-0 bg-red-100 z-10">TOTALE USCITE</td>
              <td v-for="m in cfAnno.mesi" :key="m.indice" class="px-2 py-2 text-right font-mono text-red-900">
                {{ fmtK(m.totaleUscite) }}
              </td>
              <td class="px-3 py-2 text-right font-mono text-red-900">{{ fmtK(sumMesi('totaleUscite')) }}</td>
            </tr>

            <!-- SALDO FINALE -->
            <tr class="font-bold border-t-4 border-gray-400">
              <td class="px-3 py-2.5 bg-gray-800 text-white sticky left-0 z-10">SALDO FINALE</td>
              <td v-for="m in cfAnno.mesi" :key="m.indice"
                  class="px-2 py-2.5 text-right font-mono font-bold"
                  :class="m.saldoFinale >= 0 ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'">
                {{ fmtK(m.saldoFinale) }}
              </td>
              <td class="px-3 py-2.5 text-right font-mono bg-gray-100 text-gray-700">
                {{ fmtK(cfAnno.mesi[cfAnno.mesi.length - 1]?.saldoFinale) }}
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <div class="px-4 py-3 bg-gray-50 border-t border-gray-200 text-xs text-gray-500 flex flex-wrap gap-4">
        <span class="flex items-center gap-1"><i class="fas fa-info-circle"></i> Importi in €. Uscite mostrate con segno negativo.</span>
        <span class="flex items-center gap-1 text-green-600"><i class="fas fa-circle"></i> Saldo positivo</span>
        <span class="flex items-center gap-1 text-red-600"><i class="fas fa-circle"></i> Saldo negativo</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({ layout: 'default' })

const { cfData, loading, error, fetchCF } = useBilancio()

const ANNI = [2023, 2024, 2025]
const annoSelezionato = ref(2024)

const cfAnno = computed(() => cfData.value?.find((d: any) => d.anno === annoSelezionato.value))

const sumMesi = (key: string) => {
  if (!cfAnno.value) return 0
  return cfAnno.value.mesi.reduce((s: number, m: any) => s + (m[key] || 0), 0)
}

const fmtK = (v: any) => {
  if (v == null) return '—'
  const n = Number(v) || 0
  return new Intl.NumberFormat('it-IT', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 }).format(n)
}

const entrateRows = [
  { key: 'erogazioneFinanziamenti', label: 'Erogazione Finanziamenti/Mutui' },
  { key: 'apportoSoci', label: 'Apporto Soci' },
  { key: 'incassiClienti', label: 'Incassi Clienti' },
  { key: 'creditoImposta', label: 'Crediti d\'Imposta' },
  { key: 'altreEntrate', label: 'Altre Entrate' },
]

const usciteRows = [
  { key: 'salariStipendi', label: 'Salari e Stipendi' },
  { key: 'emolumentoAmministratore', label: 'Emolumento Amministratore' },
  { key: 'fornitori', label: 'Pagamenti Fornitori' },
  { key: 'imposteTasse', label: 'Imposte e Tasse (F24)' },
  { key: 'versamentoIva', label: 'Versamento IVA' },
  { key: 'contributiDipendenti', label: 'Contributi Dipendenti (INPS)' },
  { key: 'ritenuteProfessionisti', label: 'Ritenute Professionisti' },
  { key: 'canoniManutenzione', label: 'Canoni e Manutenzione' },
  { key: 'energiaElettrica', label: 'Energia Elettrica' },
  { key: 'telefoniche', label: 'Spese Telefoniche' },
  { key: 'consulenzeAmministrative', label: 'Consulenze Amministrative' },
  { key: 'canoniLeasing', label: 'Canoni Leasing' },
  { key: 'altreUscite', label: 'Altre Uscite' },
]

onMounted(() => fetchCF())
</script>

<style scoped>
.card { @apply bg-white rounded-lg shadow; }
.card-header { @apply px-4 py-3 border-b border-gray-200; }
.card-title { @apply text-lg font-semibold text-gray-800 flex items-center; }
</style>
