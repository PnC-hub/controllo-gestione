<script setup lang="ts">
interface Props {
  padding?: boolean
  hover?: boolean
}

withDefaults(defineProps<Props>(), {
  padding: true,
  hover: false
})
</script>

<template>
  <div
    :class="[
      'bg-white rounded-lg border border-gray-200 shadow-sm',
      padding ? 'p-6' : '',
      hover ? 'transition-shadow hover:shadow-md' : ''
    ]"
  >
    <slot />
  </div>
</template>
