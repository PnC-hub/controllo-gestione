<template>
  <div class="bg-white rounded-xl shadow-sm p-5 border-l-4 transition-all hover:shadow-md" :class="borderClass">
    <div class="flex items-start gap-3">
      <div class="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0" :class="iconBgClass">
        <i :class="severityIcon" class="text-white"></i>
      </div>
      <div class="flex-1 min-w-0">
        <div class="flex items-center gap-2 mb-1">
          <h4 class="font-semibold text-slate-800 text-sm truncate">{{ title }}</h4>
          <span class="px-2 py-0.5 rounded-full text-xs font-bold flex-shrink-0" :class="metricBadgeClass">
            {{ metric }}
          </span>
        </div>
        <p class="text-xs text-slate-500 leading-relaxed">{{ description }}</p>
        <button v-if="action"
          class="mt-3 text-xs font-medium flex items-center gap-1 transition-colors" :class="actionColorClass"
          @click="$emit('action')">
          <i class="fas fa-arrow-right text-[10px]"></i>
          {{ action }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{
  title: string
  description: string
  severity: 'critico' | 'attenzione' | 'info'
  metric: string
  action: string
}>()

defineEmits<{
  action: []
}>()

const severityConfig = {
  critico: {
    border: 'border-red-500',
    iconBg: 'bg-red-500',
    icon: 'fas fa-exclamation-triangle',
    metricBadge: 'bg-red-100 text-red-700',
    actionColor: 'text-red-600 hover:text-red-700',
  },
  attenzione: {
    border: 'border-yellow-500',
    iconBg: 'bg-yellow-500',
    icon: 'fas fa-exclamation-circle',
    metricBadge: 'bg-yellow-100 text-yellow-700',
    actionColor: 'text-yellow-600 hover:text-yellow-700',
  },
  info: {
    border: 'border-blue-500',
    iconBg: 'bg-blue-500',
    icon: 'fas fa-info-circle',
    metricBadge: 'bg-blue-100 text-blue-700',
    actionColor: 'text-blue-600 hover:text-blue-700',
  },
}

const config = computed(() => severityConfig[props.severity] ?? severityConfig.info)
const borderClass = computed(() => config.value.border)
const iconBgClass = computed(() => config.value.iconBg)
const severityIcon = computed(() => config.value.icon)
const metricBadgeClass = computed(() => config.value.metricBadge)
const actionColorClass = computed(() => config.value.actionColor)
</script>
