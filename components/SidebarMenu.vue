<template>
  <nav class="px-3 pb-20">
    <ul class="space-y-1">
      <template v-for="(item, index) in menuConfig" :key="index">
        <!-- Voce con submenu -->
        <li v-if="item.children && item.children.length > 0">
          <button @click="toggleMenu(item.label)" class="nav-link-modern w-full">
            <span class="nav-icon">
              <i :class="'fas fa-' + (item.icon || 'folder')"></i>
            </span>
            <span v-if="sidebarOpen" class="nav-text">{{ item.label }}</span>
            <i v-if="sidebarOpen" :class="openMenus[item.label] ? 'fas fa-chevron-down' : 'fas fa-chevron-right'" class="nav-arrow"></i>
          </button>
          <ul v-show="openMenus[item.label] && sidebarOpen" class="submenu-modern">
            <li v-for="(child, cIndex) in item.children" :key="cIndex">
              <NuxtLink :to="child.route || '/'" class="submenu-link">{{ child.label }}</NuxtLink>
            </li>
          </ul>
        </li>

        <!-- Voce singola -->
        <li v-else-if="item.route">
          <NuxtLink :to="item.route" class="nav-link-modern" active-class="nav-link-active">
            <span class="nav-icon">
              <i :class="'fas fa-' + (item.icon || 'circle')"></i>
            </span>
            <span v-if="sidebarOpen" class="nav-text">{{ item.label }}</span>
          </NuxtLink>
        </li>
      </template>
    </ul>
  </nav>
</template>

<script setup lang="ts">
import { menuConfig } from '~/config/menu.config'

defineProps<{
  sidebarOpen: boolean
}>()

const route = useRoute()
const openMenus = reactive<Record<string, boolean>>({})

const toggleMenu = (label: string) => {
  openMenus[label] = !openMenus[label]
}

onMounted(() => {
  const path = route.path
  const pathToMenu: Record<string, string> = {
    '/contabilita': 'Contabilità',
    '/bank': 'Contabilità',
    '/prima-nota': 'Contabilità',
    '/fatture': 'Contabilità',
    '/memo-economici': 'Contabilità',
    '/autofatture': 'Contabilità',
    '/riclassificazione': 'Finanziario',
    '/registro-economico': 'Finanziario',
    '/registro-contabile': 'Finanziario',
    '/registro-fiscale': 'Finanziario',
    '/analisi-fatturato': 'Finanziario',
    '/bep': 'Finanziario',
    '/costi': 'Finanziario',
    '/monitoraggio': 'Finanziario',
    '/prestazioni': 'Finanziario',
    '/analisi-flussi': 'Dashboard',
    '/piano-industriale': 'Pianificazione',
    '/budget': 'Budget',
    '/contratti': 'Compliance',
    '/parti-correlate': 'Compliance',
  }
  for (const [prefix, menuLabel] of Object.entries(pathToMenu)) {
    if (path.startsWith(prefix)) {
      openMenus[menuLabel] = true
      break
    }
  }
})
</script>

<style scoped>
.nav-link-modern {
  display: flex;
  align-items: center;
  padding: 12px 16px;
  color: rgba(255, 255, 255, 0.7);
  text-decoration: none;
  border-radius: 12px;
  transition: all 0.2s ease;
  font-size: 14px;
}
.nav-link-modern:hover {
  background: rgba(255, 255, 255, 0.1);
  color: white;
}
.nav-link-modern.nav-link-active,
.nav-link-modern.router-link-active {
  background: rgba(255, 255, 255, 0.15);
  color: white;
  font-weight: 500;
}
.nav-icon {
  width: 36px;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 10px;
  margin-right: 12px;
  flex-shrink: 0;
}
.nav-icon i { font-size: 14px; }
.nav-text {
  flex: 1;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  text-align: left;
}
.nav-arrow {
  font-size: 10px;
  opacity: 0.5;
  margin-left: auto;
}
.submenu-modern {
  margin-top: 4px;
  margin-left: 24px;
  padding-left: 24px;
  border-left: 2px solid rgba(255, 255, 255, 0.1);
}
.submenu-link {
  display: block;
  padding: 8px 16px;
  color: rgba(255, 255, 255, 0.6);
  font-size: 13px;
  border-radius: 8px;
  transition: all 0.2s ease;
  text-decoration: none;
}
.submenu-link:hover {
  color: white;
  background: rgba(255, 255, 255, 0.05);
}
.submenu-link.router-link-active {
  color: #22d3ee;
  background: rgba(34, 211, 238, 0.1);
  font-weight: 500;
}
</style>
