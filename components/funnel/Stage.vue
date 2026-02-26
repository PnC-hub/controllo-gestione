<template>
  <div class="funnel-stage bg-white rounded-xl shadow-sm border-l-4 p-5 transition-all hover:shadow-md"
    :class="borderColorClass">
    <div class="flex items-center justify-between mb-3">
      <div class="flex items-center gap-3">
        <div class="w-12 h-12 rounded-xl flex items-center justify-center" :class="iconBgClass">
          <i :class="'fas fa-' + icon" class="text-white text-lg"></i>
        </div>
        <div>
          <h4 class="font-semibold text-slate-800 text-sm">{{ label }}</h4>
          <p class="text-xs text-slate-400">{{ details }}</p>
        </div>
      </div>
      <div v-if="trend !== 0" class="flex items-center gap-1 text-xs px-2 py-1 rounded-full"
        :class="trend > 0 ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'">
        <i :class="trend > 0 ? 'fas fa-arrow-up' : 'fas fa-arrow-down'" class="text-[10px]"></i>
        <span>{{ trend > 0 ? '+' : '' }}{{ trend }}%</span>
      </div>
    </div>

    <div class="flex items-end justify-between">
      <div>
        <div class="text-3xl font-bold" :class="textColorClass">{{ count.toLocaleString('it-IT') }}</div>
        <div v-if="value > 0" class="text-sm text-slate-500 mt-1">
          {{ formatCurrency(value) }}
        </div>
      </div>

      <div v-if="conversionRate !== null" class="text-right">
        <div class="text-xs text-slate-400 mb-1">Conversione</div>
        <div class="text-lg font-bold" :class="conversionColorClass">{{ conversionRate }}%</div>
        <div class="w-24 h-2 bg-slate-200 rounded-full overflow-hidden mt-1">
          <div class="h-full rounded-full transition-all duration-700" :class="conversionBarClass"
            :style="{ width: Math.min(conversionRate, 100) + '%' }"></div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{
  label: string
  icon: string
  color: string
  count: number
  value: number
  conversionRate: number | null
  trend: number
  details: string
}>()

const formatCurrency = (v: number) =>
  new Intl.NumberFormat('it-IT', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 }).format(v)

const colorMap: Record<string, { border: string, iconBg: string, text: string }> = {
  purple: { border: 'border-purple-500', iconBg: 'bg-gradient-to-br from-purple-400 to-purple-600', text: 'text-purple-600' },
  indigo: { border: 'border-indigo-500', iconBg: 'bg-gradient-to-br from-indigo-400 to-indigo-600', text: 'text-indigo-600' },
  blue: { border: 'border-blue-500', iconBg: 'bg-gradient-to-br from-blue-400 to-blue-600', text: 'text-blue-600' },
  cyan: { border: 'border-cyan-500', iconBg: 'bg-gradient-to-br from-cyan-400 to-cyan-600', text: 'text-cyan-600' },
  teal: { border: 'border-teal-500', iconBg: 'bg-gradient-to-br from-teal-400 to-teal-600', text: 'text-teal-600' },
  emerald: { border: 'border-emerald-500', iconBg: 'bg-gradient-to-br from-emerald-400 to-emerald-600', text: 'text-emerald-600' },
  green: { border: 'border-green-500', iconBg: 'bg-gradient-to-br from-green-400 to-green-600', text: 'text-green-600' },
}

const colors = computed(() => colorMap[props.color] ?? colorMap.blue)
const borderColorClass = computed(() => colors.value.border)
const iconBgClass = computed(() => colors.value.iconBg)
const textColorClass = computed(() => colors.value.text)

const conversionColorClass = computed(() => {
  if (props.conversionRate === null) return ''
  if (props.conversionRate >= 70) return 'text-emerald-600'
  if (props.conversionRate >= 40) return 'text-yellow-600'
  return 'text-red-600'
})

const conversionBarClass = computed(() => {
  if (props.conversionRate === null) return ''
  if (props.conversionRate >= 70) return 'bg-emerald-500'
  if (props.conversionRate >= 40) return 'bg-yellow-500'
  return 'bg-red-500'
})
</script>
