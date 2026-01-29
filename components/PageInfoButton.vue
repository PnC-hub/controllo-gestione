<template>
  <div class="inline-flex items-center">
    <!-- Info Button -->
    <button
      @click="showModal = true"
      class="w-6 h-6 rounded-full bg-cyan-100 text-cyan-600 hover:bg-cyan-200 hover:text-cyan-700 flex items-center justify-center transition-colors ml-2"
      title="Informazioni sulla pagina"
    >
      <i class="fas fa-info text-xs"></i>
    </button>

    <!-- Modal -->
    <Teleport to="body">
      <div
        v-if="showModal"
        class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
        @click.self="showModal = false"
      >
        <div class="bg-white rounded-lg shadow-xl max-w-lg w-full mx-4 overflow-hidden">
          <!-- Header -->
          <div class="px-6 py-4 bg-gradient-to-r from-cyan-500 to-cyan-600 text-white">
            <div class="flex items-center justify-between">
              <div class="flex items-center">
                <i class="fas fa-info-circle text-2xl mr-3"></i>
                <h3 class="text-lg font-semibold">{{ title }}</h3>
              </div>
              <button
                @click="showModal = false"
                class="text-white hover:text-cyan-100 transition-colors"
              >
                <i class="fas fa-times text-xl"></i>
              </button>
            </div>
          </div>

          <!-- Content -->
          <div class="px-6 py-5">
            <div class="text-gray-700 leading-relaxed whitespace-pre-line">
              {{ description }}
            </div>

            <!-- Features list if provided -->
            <div v-if="features && features.length > 0" class="mt-4">
              <h4 class="font-medium text-gray-800 mb-2">Funzionalita principali:</h4>
              <ul class="space-y-2">
                <li
                  v-for="(feature, index) in features"
                  :key="index"
                  class="flex items-start text-sm text-gray-600"
                >
                  <i class="fas fa-check-circle text-green-500 mt-0.5 mr-2 flex-shrink-0"></i>
                  <span>{{ feature }}</span>
                </li>
              </ul>
            </div>
          </div>

          <!-- Footer -->
          <div class="px-6 py-4 bg-gray-50 flex justify-end">
            <button
              @click="showModal = false"
              class="px-4 py-2 bg-cyan-600 text-white rounded-lg hover:bg-cyan-700 transition-colors"
            >
              Ho capito
            </button>
          </div>
        </div>
      </div>
    </Teleport>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  title: string
  description: string
  features?: string[]
}>()

const showModal = ref(false)
</script>
