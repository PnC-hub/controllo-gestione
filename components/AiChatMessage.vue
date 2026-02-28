<template>
  <div class="flex gap-3 mb-4" :class="isUser ? 'flex-row-reverse' : 'flex-row'">
    <!-- Avatar -->
    <div class="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 text-white text-xs font-bold"
      :class="isUser ? 'bg-purple-500' : 'bg-gradient-to-br from-indigo-500 to-purple-600'">
      <i :class="isUser ? 'fas fa-user' : 'fas fa-brain'" class="text-[11px]"></i>
    </div>

    <!-- Bubble -->
    <div class="max-w-[85%] rounded-2xl px-4 py-3 text-sm leading-relaxed"
      :class="isUser
        ? 'bg-purple-600 text-white rounded-tr-sm'
        : 'bg-slate-100 text-slate-800 rounded-tl-sm'">
      <!-- Markdown content for AI -->
      <div v-if="!isUser" class="ai-message prose prose-sm prose-slate max-w-none" v-html="renderedContent"></div>
      <!-- Plain text for user -->
      <div v-else>{{ content }}</div>
    </div>
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{
  role: 'user' | 'assistant'
  content: string
}>()

const isUser = computed(() => props.role === 'user')

// Simple markdown rendering (bold, italic, lists, headers, code, tables)
const renderedContent = computed(() => {
  if (props.role === 'user') return props.content

  let html = props.content
    // Escape HTML first
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    // Code blocks
    .replace(/```(\w*)\n([\s\S]*?)```/g, '<pre class="bg-slate-200 rounded p-2 my-2 text-xs overflow-x-auto"><code>$2</code></pre>')
    // Inline code
    .replace(/`([^`]+)`/g, '<code class="bg-slate-200 px-1 rounded text-xs">$1</code>')
    // Headers
    .replace(/^### (.+)$/gm, '<h4 class="font-bold text-sm mt-3 mb-1">$1</h4>')
    .replace(/^## (.+)$/gm, '<h3 class="font-bold text-base mt-3 mb-1">$1</h3>')
    .replace(/^# (.+)$/gm, '<h2 class="font-bold text-lg mt-3 mb-1">$1</h2>')
    // Bold and italic
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.+?)\*/g, '<em>$1</em>')
    // Lists
    .replace(/^- (.+)$/gm, '<li class="ml-4 list-disc">$1</li>')
    .replace(/^\d+\. (.+)$/gm, '<li class="ml-4 list-decimal">$1</li>')
    // Line breaks
    .replace(/\n\n/g, '<br><br>')
    .replace(/\n/g, '<br>')

  return html
})
</script>

<style scoped>
.ai-message :deep(table) {
  @apply w-full text-xs border-collapse my-2;
}
.ai-message :deep(th),
.ai-message :deep(td) {
  @apply border border-slate-300 px-2 py-1;
}
.ai-message :deep(th) {
  @apply bg-slate-200 font-semibold;
}
</style>
