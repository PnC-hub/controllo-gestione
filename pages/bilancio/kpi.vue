<template>
  <div>
    <!-- Header -->
    <div class="bg-white rounded-xl border border-slate-200 shadow-sm mb-6">
      <div class="px-6 py-4 border-b border-slate-100">
        <h2 class="text-lg font-semibold text-slate-800 flex items-center gap-2">
          <i class="fas fa-tachometer-alt text-orange-500"></i>
          KPI Finanziari — Smiledoc 2023–2024–2025
        </h2>
        <p class="text-xs text-slate-400 mt-0.5">Indicatori chiave di performance derivati dal Conto Economico Kontabila</p>
      </div>
    </div>

    <div v-if="loading.kpi" class="bg-white rounded-xl shadow-sm p-12 text-center">
      <i class="fas fa-spinner fa-spin text-4xl text-orange-500 mb-4"></i>
      <p class="text-slate-500">Calcolo KPI in corso...</p>
    </div>

    <div v-else-if="error.kpi" class="bg-red-50 border border-red-200 rounded-xl p-4 text-red-700">
      <i class="fas fa-exclamation-circle mr-2"></i>{{ error.kpi?.message }}
    </div>

    <div v-else-if="kpiData" class="space-y-6">

      <!-- CAGR badge -->
      <div v-if="cagr != null" class="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-xl p-4 text-white flex items-center gap-4">
        <i class="fas fa-chart-line text-3xl text-white/70"></i>
        <div>
          <p class="text-white/60 text-xs uppercase tracking-wide">CAGR Ricavi 2023→2025</p>
          <p class="text-3xl font-bold">{{ cagr > 0 ? '+' : '' }}{{ cagr }}%</p>
          <p class="text-white/60 text-xs">Tasso di crescita annuo composto</p>
        </div>
        <div class="ml-auto text-right">
          <p class="text-white/60 text-xs">Ricavi 2023</p>
          <p class="text-xl font-semibold">{{ fmtM(kpi(2023)?.ricavi) }}</p>
          <p class="text-white/60 text-xs mt-1">Ricavi 2025</p>
          <p class="text-xl font-semibold">{{ fmtM(kpi(2025)?.ricavi) }}</p>
        </div>
      </div>

      <!-- ════ RICAVI E REDDITIVITÀ ════ -->
      <div>
        <h3 class="text-sm font-bold text-slate-500 uppercase tracking-wider mb-3">Ricavi e Redditività</h3>
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">

          <!-- Ricavi per anno -->
          <div v-for="a in ANNI" :key="'ric'+a" class="bg-white rounded-xl border border-slate-200 shadow-sm p-4">
            <div class="flex items-center justify-between mb-3">
              <span class="text-xs font-bold text-slate-400 uppercase tracking-wide">{{ a }}</span>
              <span v-if="kpi(a)?.deltaRicavi != null" class="text-xs px-2 py-0.5 rounded-full font-semibold"
                :class="kpi(a).deltaRicavi >= 0 ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'">
                {{ kpi(a).deltaRicavi > 0 ? '+' : '' }}{{ kpi(a).deltaRicavi }}% YoY
              </span>
            </div>
            <div class="space-y-2">
              <KpiRow label="Ricavi" :value="fmtE(kpi(a)?.ricavi)" icon="fa-coins" color="text-slate-800" />
              <KpiRow label="EBITDA" :value="fmtE(kpi(a)?.ebitda)" :sub="kpi(a)?.ebitdaMargin + '%'" icon="fa-chart-bar"
                :color="kpi(a)?.ebitda >= 0 ? 'text-emerald-600' : 'text-red-600'" />
              <KpiRow label="Risultato Netto" :value="fmtE(kpi(a)?.netto)" :sub="kpi(a)?.netMargin + '%'" icon="fa-check-circle"
                :color="kpi(a)?.netto >= 0 ? 'text-emerald-600' : 'text-red-600'" />
            </div>
          </div>
        </div>
      </div>

      <!-- ════ MARGINI ════ -->
      <div>
        <h3 class="text-sm font-bold text-slate-500 uppercase tracking-wider mb-3">Margini e Indicatori</h3>
        <div class="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
          <table class="w-full text-sm">
            <thead>
              <tr class="bg-slate-50 border-b border-slate-200">
                <th class="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">KPI</th>
                <th class="text-right px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide w-32">2023</th>
                <th class="text-right px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide w-32">2024</th>
                <th class="text-right px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide w-32">2025</th>
                <th class="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide w-32">Target</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(row, i) in kpiRows" :key="i" class="border-b border-slate-100 hover:bg-slate-50">
                <td class="px-4 py-3">
                  <p class="font-semibold text-slate-700">{{ row.label }}</p>
                  <p class="text-xs text-slate-400">{{ row.desc }}</p>
                </td>
                <td v-for="a in ANNI" :key="'kpi'+a+i" class="px-4 py-3 text-right font-mono">
                  <span :class="row.colorFn(kpi(a)?.[row.key])">{{ row.fmtFn(kpi(a)?.[row.key]) }}</span>
                  <div v-if="row.subKey" class="text-xs text-slate-400 mt-0.5">{{ fmtDelta(kpi(a)?.[row.subKey]) }}</div>
                </td>
                <td class="px-4 py-3">
                  <span class="text-xs" :class="row.targetColor">{{ row.target }}</span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- ════ STRUTTURA COSTI ════ -->
      <div>
        <h3 class="text-sm font-bold text-slate-500 uppercase tracking-wider mb-3">Struttura Costi</h3>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div v-for="a in ANNI" :key="'cost'+a" class="bg-white rounded-xl border border-slate-200 shadow-sm p-4">
            <p class="text-sm font-bold text-slate-700 mb-3">{{ a }}</p>
            <div class="space-y-2">
              <CostBar label="Personale" :value="kpi(a)?.costiPersonalePerc" color="bg-blue-400" />
              <CostBar label="Beni di Terzi (affitti)" :value="kpi(a)?.costiStrutturaPerc" color="bg-amber-400" />
              <CostBar label="Materie Prime" :value="kpi(a)?.materierime != null && kpi(a)?.ricavi > 0 ? parseFloat(((kpi(a).materie8_01 / kpi(a).ricavi) * 100).toFixed(1)) : null" color="bg-red-400" />
              <CostBar label="Oneri Finanziari" :value="kpi(a)?.oneriFinanz != null && kpi(a)?.ricavi > 0 ? parseFloat(((kpi(a).oneriFinanz / kpi(a).ricavi) * 100).toFixed(1)) : null" color="bg-rose-400" />
            </div>
            <div class="mt-3 pt-3 border-t border-slate-100 text-xs text-slate-400">
              Margine EBITDA: <strong :class="kpi(a)?.ebitdaMargin >= 10 ? 'text-emerald-600' : 'text-amber-600'">{{ kpi(a)?.ebitdaMargin }}%</strong>
            </div>
          </div>
        </div>
      </div>

      <!-- ════ BEP ════ -->
      <div>
        <h3 class="text-sm font-bold text-slate-500 uppercase tracking-wider mb-3">Break Even Point</h3>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div v-for="a in ANNI" :key="'bep'+a" class="bg-white rounded-xl border border-slate-200 shadow-sm p-4">
            <p class="text-xs text-slate-400 uppercase font-semibold tracking-wide mb-2">{{ a }}</p>
            <p class="text-2xl font-bold" :class="bepColor(a)">{{ kpi(a)?.bep != null ? fmtE(kpi(a)?.bep) : '—' }}</p>
            <p class="text-xs text-slate-400 mt-1">Ricavi minimi per coprire i costi fissi</p>
            <div v-if="kpi(a)?.bep != null && kpi(a)?.ricavi > 0" class="mt-2">
              <div class="flex justify-between text-xs mb-1">
                <span class="text-slate-500">BEP / Ricavi reali</span>
                <span :class="(kpi(a).bep / kpi(a).ricavi) < 1 ? 'text-emerald-600 font-semibold' : 'text-red-600 font-semibold'">
                  {{ ((kpi(a).bep / kpi(a).ricavi) * 100).toFixed(0) }}%
                </span>
              </div>
              <div class="bg-slate-100 rounded-full h-2">
                <div class="h-2 rounded-full transition-all"
                  :class="(kpi(a).bep / kpi(a).ricavi) < 1 ? 'bg-emerald-500' : 'bg-red-500'"
                  :style="{ width: Math.min((kpi(a).bep / kpi(a).ricavi) * 100, 100) + '%' }">
                </div>
              </div>
              <p class="text-xs mt-1" :class="(kpi(a).bep / kpi(a).ricavi) < 1 ? 'text-emerald-600' : 'text-red-600'">
                {{ (kpi(a).bep / kpi(a).ricavi) < 1 ? '✓ Ricavi > BEP — in utile' : '⚠ Ricavi < BEP — in perdita' }}
              </p>
            </div>
          </div>
        </div>
      </div>

    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({ layout: 'default' })

const { kpiData, cagr, loading, error, fetchKPI } = useBilancio()

const ANNI = [2023, 2024, 2025]
const kpi = (a: number) => kpiData.value?.find((d: any) => d.anno === a) ?? null

const fmtE = (v: any) => {
  if (v == null) return '—'
  return new Intl.NumberFormat('it-IT', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 }).format(Number(v))
}

const fmtM = (v: any) => {
  if (v == null) return '—'
  const n = Number(v)
  if (n >= 1_000_000) return `€${(n / 1_000_000).toFixed(2)}M`
  if (n >= 1_000) return `€${(n / 1_000).toFixed(0)}K`
  return fmtE(v)
}

const fmtP = (v: any) => v != null ? `${v}%` : '—'
const fmtDelta = (v: any) => v != null ? `${v > 0 ? '+' : ''}${v}% YoY` : ''

const greenRed = (v: any) => Number(v) >= 0 ? 'text-emerald-600 font-bold' : 'text-red-600 font-bold'
const greenAmber = (threshold: number) => (v: any) => Number(v) >= threshold ? 'text-emerald-600 font-bold' : (Number(v) >= threshold / 2 ? 'text-amber-600 font-bold' : 'text-red-600 font-bold')

const kpiRows = [
  {
    label: 'EBITDA Margin', desc: 'Margine operativo lordo su ricavi',
    key: 'ebitdaMargin', subKey: 'deltaEbitda',
    fmtFn: fmtP, colorFn: greenAmber(10),
    target: '> 10%', targetColor: 'text-slate-500',
  },
  {
    label: 'Net Margin', desc: 'Risultato netto su ricavi',
    key: 'netMargin', subKey: 'deltaNetto',
    fmtFn: fmtP, colorFn: greenAmber(5),
    target: '> 5%', targetColor: 'text-slate-500',
  },
  {
    label: 'Costo Personale %', desc: 'Incidenza personale su ricavi',
    key: 'costiPersonalePerc',
    fmtFn: fmtP, colorFn: (v: any) => Number(v) <= 50 ? 'text-emerald-600 font-bold' : (Number(v) <= 70 ? 'text-amber-600 font-bold' : 'text-red-600 font-bold'),
    target: '< 50%', targetColor: 'text-slate-500',
  },
  {
    label: 'Struttura (Affitti) %', desc: 'Incidenza beni di terzi su ricavi',
    key: 'costiStrutturaPerc',
    fmtFn: fmtP, colorFn: (v: any) => Number(v) <= 20 ? 'text-emerald-600 font-bold' : (Number(v) <= 35 ? 'text-amber-600 font-bold' : 'text-red-600 font-bold'),
    target: '< 20%', targetColor: 'text-slate-500',
  },
  {
    label: 'Δ Ricavi YoY', desc: 'Variazione ricavi anno precedente',
    key: 'deltaRicavi',
    fmtFn: (v: any) => v != null ? `${v > 0 ? '+' : ''}${v}%` : '—',
    colorFn: greenRed,
    target: '> 0%', targetColor: 'text-slate-500',
  },
]

const bepColor = (a: number) => {
  const k = kpi(a)
  if (!k?.bep || !k?.ricavi) return 'text-slate-400'
  return k.bep <= k.ricavi ? 'text-emerald-600' : 'text-red-600'
}

onMounted(() => fetchKPI())

// Inline sub-components (devono stare in script setup per evitare mismatch lang)
const KpiRow = defineComponent({
  props: ['label', 'value', 'sub', 'icon', 'color'],
  template: `
    <div class="flex items-center justify-between">
      <span class="text-xs text-slate-500 flex items-center gap-1">
        <i :class="'fas ' + icon + ' text-slate-300'"></i>{{ label }}
      </span>
      <div class="text-right">
        <span class="text-sm font-mono font-semibold" :class="color">{{ value }}</span>
        <span v-if="sub" class="text-xs text-slate-400 ml-1">{{ sub }}</span>
      </div>
    </div>
  `,
})

const CostBar = defineComponent({
  props: ['label', 'value', 'color'],
  template: `
    <div>
      <div class="flex justify-between text-xs mb-0.5">
        <span class="text-slate-600">{{ label }}</span>
        <span class="font-semibold text-slate-700">{{ value != null ? value + '%' : '—' }}</span>
      </div>
      <div class="bg-slate-100 rounded-full h-1.5">
        <div v-if="value != null" class="h-1.5 rounded-full transition-all" :class="color"
          :style="{ width: Math.min(value, 100) + '%' }"></div>
      </div>
    </div>
  `,
})
</script>
