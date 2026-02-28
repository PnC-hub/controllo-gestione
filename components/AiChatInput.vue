<template>
  <div class="border-t border-slate-200 p-4 bg-white">
    <!-- Error -->
    <div v-if="error" class="mb-2 text-xs text-red-500 flex items-center gap-1">
      <i class="fas fa-exclamation-circle"></i> {{ error }}
    </div>

    <div class="flex items-end gap-2">
      <textarea
        ref="inputRef"
        v-model="model"
        @keydown.enter.exact.prevent="$emit('send')"
        :disabled="loading"
        placeholder="Chiedi al CFO AI..."
        rows="1"
        class="flex-1 resize-none border border-slate-300 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent disabled:opacity-50 max-h-32 overflow-y-auto"
      ></textarea>
      <button
        @click="$emit('send')"
        :disabled="loading || !model.trim()"
        class="w-10 h-10 rounded-xl bg-purple-600 text-white flex items-center justify-center hover:bg-purple-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex-shrink-0"
      >
        <i v-if="!loading" class="fas fa-paper-plane text-sm"></i>
        <div v-else class="flex gap-1">
          <span class="w-1.5 h-1.5 bg-white rounded-full animate-bounce" style="animation-delay: 0ms"></span>
          <span class="w-1.5 h-1.5 bg-white rounded-full animate-bounce" style="animation-delay: 150ms"></span>
          <span class="w-1.5 h-1.5 bg-white rounded-full animate-bounce" style="animation-delay: 300ms"></span>
        </div>
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  loading: boolean
  error: string | null
}>()

defineEmits<{
  send: []
}>()

const model = defineModel<string>({ required: true })
const inputRef = ref<HTMLTextAreaElement>()

// Auto-resize textarea
watch(model, () => {
  nextTick(() => {
    if (inputRef.value) {
      inputRef.value.style.height = 'auto'
      inputRef.value.style.height = Math.min(inputRef.value.scrollHeight, 128) + 'px'
    }
  })
})

// Focus on mount
onMounted(() => {
  inputRef.value?.focus()
})
</script>
