<script setup lang="ts">
const { user, logout } = useAuth()

const navigation = [
  { name: 'Dashboard', href: '/dashboard', icon: 'heroicons:chart-bar' },
  { name: 'Report AI', href: '/dashboard/report', icon: 'heroicons:document-text' },
  { name: 'Piano Industriale', href: '/dashboard/piano-industriale', icon: 'heroicons:clipboard-document-list' },
  { name: 'Allerta Crisi', href: '/dashboard/allerta-crisi', icon: 'heroicons:exclamation-triangle' },
  { name: 'Benchmark', href: '/dashboard/benchmark', icon: 'heroicons:chart-bar-square' },
  { name: 'Export', href: '/dashboard/export', icon: 'heroicons:arrow-down-tray' },
  { name: 'Impostazioni', href: '/dashboard/impostazioni', icon: 'heroicons:cog-6-tooth' },
]

const handleLogout = () => {
  logout()
  navigateTo('/login')
}
</script>

<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Sidebar -->
    <aside class="fixed inset-y-0 left-0 w-64 bg-gray-900 text-white">
      <div class="flex flex-col h-full">
        <!-- Logo -->
        <div class="flex items-center gap-3 px-6 py-6 border-b border-gray-800">
          <div class="w-10 h-10 bg-violet-600 rounded-lg flex items-center justify-center">
            <Icon name="heroicons:chart-bar-square" class="w-6 h-6" />
          </div>
          <div>
            <h1 class="font-bold text-lg">Geniusmile BI</h1>
            <p class="text-xs text-gray-400">Business Intelligence</p>
          </div>
        </div>

        <!-- Navigation -->
        <nav class="flex-1 px-3 py-6 space-y-1 overflow-y-auto">
          <NuxtLink
            v-for="item in navigation"
            :key="item.href"
            :to="item.href"
            class="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors hover:bg-gray-800"
            active-class="bg-violet-600 hover:bg-violet-700"
          >
            <Icon :name="item.icon" class="w-5 h-5" />
            {{ item.name }}
          </NuxtLink>
        </nav>

        <!-- User -->
        <div class="border-t border-gray-800 p-4">
          <div class="flex items-center gap-3 mb-3">
            <div class="w-10 h-10 bg-violet-600 rounded-full flex items-center justify-center text-sm font-bold">
              {{ user?.name?.charAt(0) || 'U' }}
            </div>
            <div class="flex-1 min-w-0">
              <p class="text-sm font-medium truncate">{{ user?.name }}</p>
              <p class="text-xs text-gray-400 truncate">{{ user?.studio }}</p>
            </div>
          </div>
          <UiButton variant="ghost" size="sm" class="w-full text-gray-300 hover:bg-gray-800" @click="handleLogout">
            <Icon name="heroicons:arrow-right-on-rectangle" class="w-4 h-4" />
            Esci
          </UiButton>
        </div>
      </div>
    </aside>

    <!-- Main content -->
    <div class="pl-64">
      <main class="p-8">
        <slot />
      </main>
    </div>
  </div>
</template>
