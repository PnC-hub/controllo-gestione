<template>
  <div class="flex flex-col items-center py-2">
    <div class="flex items-center gap-2">
      <!-- Linea verticale + freccia -->
      <div class="flex flex-col items-center">
        <div class="w-0.5 h-4" :class="lineColorClass"></div>
        <div class="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold shadow-sm"
          :class="bgColorClass">
          <i class="fas fa-arrow-down text-[10px]"></i>
        </div>
        <div class="w-0.5 h-4" :class="lineColorClass"></div>
      </div>

      <!-- Badge con percentuale -->
      <div class="px-3 py-1 rounded-full text-xs font-semibold border" :class="badgeClass">
        {{ percentage.toFixed(1) }}%
        <span class="text-slate-400 font-normal ml-1">{{ label }}</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{
  percentage: number
  label: string
}>()

const isGood = computed(() => props.percentage >= 70)
const isWarning = computed(() => props.percentage >= 40 && props.percentage < 70)

const lineColorClass = computed(() => {
  if (isGood.value) return 'bg-emerald-300'
  if (isWarning.value) return 'bg-yellow-300'
  return 'bg-red-300'
})

const bgColorClass = computed(() => {
  if (isGood.value) return 'bg-emerald-500'
  if (isWarning.value) return 'bg-yellow-500'
  return 'bg-red-500'
})

const badgeClass = computed(() => {
  if (isGood.value) return 'bg-emerald-50 text-emerald-700 border-emerald-200'
  if (isWarning.value) return 'bg-yellow-50 text-yellow-700 border-yellow-200'
  return 'bg-red-50 text-red-700 border-red-200'
})
</script>
