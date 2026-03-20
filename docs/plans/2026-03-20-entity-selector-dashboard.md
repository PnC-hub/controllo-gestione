# Entity Selector + Dashboard Financiali Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Aggiungere selettore entità Kontabila all'header di Profitera e mostrare grafici P&L + Saldo Bancario nella dashboard.

**Architecture:** Proxy server-side — 3 endpoint Nuxt in `server/api/kontabila/` chiamano Kontabila su `localhost:3025`. Pinia store `useEntityStore` gestisce entità selezionata + persistenza localStorage. Dashboard mostra 2 grafici ApexCharts quando un'entità è selezionata.

**Tech Stack:** Nuxt 3, Pinia, ApexCharts (vue3-apexcharts), Tailwind CSS, Kontabila API (localhost:3025)

---

### Task 1: Installa ApexCharts

**Files:**
- Modify: `package.json`
- Modify: `nuxt.config.ts`

**Step 1: Installa dipendenze**

```bash
cd /Users/piernatalecivero/Documents/GitHub/Profitera
npm install apexcharts vue3-apexcharts
```

**Step 2: Registra plugin Nuxt — crea `plugins/apexcharts.client.ts`**

```ts
import VueApexCharts from 'vue3-apexcharts'

export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.vueApp.use(VueApexCharts)
})
```

**Step 3: Verifica che il file esista e sia corretto**

```bash
cat plugins/apexcharts.client.ts
```

**Step 4: Commit**

```bash
git add plugins/apexcharts.client.ts package.json package-lock.json
git commit -m "feat: install apexcharts for dashboard charts"
```

---

### Task 2: Variabili env Kontabila

**Files:**
- Modify: `.env` (locale, già nel .gitignore)
- Modify: `.env` sul server (via SSH)

**Step 1: Aggiungi al `.env` locale**

Apri `/Users/piernatalecivero/Documents/GitHub/Profitera/.env` e aggiungi:

```env
KONTABILA_URL=http://localhost:3025
KONTABILA_EMAIL=your-email@example.com
KONTABILA_PASSWORD=your-password
```

**Step 2: Aggiungi al `.env` sul server**

```bash
ssh geniusmile@93.186.255.213 'echo "
KONTABILA_URL=http://localhost:3025
KONTABILA_EMAIL=your-email@example.com
KONTABILA_PASSWORD=your-password" >> /home/geniusmile/Profitera/.env'
```

**Step 3: Verifica env sul server**

```bash
ssh geniusmile@93.186.255.213 'grep KONTABILA /home/geniusmile/Profitera/.env'
```
Expected: 3 righe KONTABILA_*

---

### Task 3: Utility auth Kontabila (server-side)

**Files:**
- Create: `server/utils/kontabila-auth.ts`

**Step 1: Crea utility per ottenere token Kontabila**

```ts
// server/utils/kontabila-auth.ts
let cachedToken: string | null = null
let tokenExpiry: number = 0

export async function getKontabilaToken(): Promise<string> {
  if (cachedToken && Date.now() < tokenExpiry) return cachedToken

  const config = useRuntimeConfig()
  const res = await fetch(`${config.kontabilaUrl}/api/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      email: config.kontabilaEmail,
      password: config.kontabilaPassword
    })
  })

  if (!res.ok) throw createError({ statusCode: 502, message: 'Kontabila auth failed' })

  const { token } = await res.json()
  cachedToken = token
  tokenExpiry = Date.now() + 50 * 60 * 1000 // 50 minuti cache
  return token
}
```

**Step 2: Aggiungi le runtime config in `nuxt.config.ts`**

Trova il blocco `runtimeConfig` in `nuxt.config.ts` e aggiungi (nelle chiavi private, non in `public`):

```ts
runtimeConfig: {
  // ... chiavi già esistenti ...
  kontabilaUrl: process.env.KONTABILA_URL || 'http://localhost:3025',
  kontabilaEmail: process.env.KONTABILA_EMAIL || '',
  kontabilaPassword: process.env.KONTABILA_PASSWORD || '',
  // ...
}
```

**Step 3: Commit**

```bash
git add server/utils/kontabila-auth.ts nuxt.config.ts
git commit -m "feat: add Kontabila server auth utility"
```

---

### Task 4: Proxy endpoint — Entities

**Files:**
- Create: `server/api/kontabila/entities.get.ts`

**Step 1: Crea l'endpoint**

```ts
// server/api/kontabila/entities.get.ts
import { getKontabilaToken } from '../../utils/kontabila-auth'

export default defineEventHandler(async (event) => {
  const token = await getKontabilaToken()
  const config = useRuntimeConfig()

  const res = await fetch(`${config.kontabilaUrl}/api/entities`, {
    headers: { Authorization: `Bearer ${token}` }
  })

  if (!res.ok) throw createError({ statusCode: 502, message: 'Kontabila entities error' })

  const entities = await res.json()
  // Restituisce solo i campi necessari
  return entities.map((e: any) => ({
    id: e.id,
    name: e.name,
    type: e.type,
    vatNumber: e.vatNumber
  }))
})
```

**Step 2: Testa l'endpoint in locale**

```bash
# Avvia dev server
npm run dev &
sleep 5
curl -s http://localhost:3000/api/kontabila/entities | head -200
```
Expected: JSON array con Smiledoc, Horus, ecc.

**Step 3: Commit**

```bash
git add server/api/kontabila/entities.get.ts
git commit -m "feat: proxy endpoint Kontabila entities"
```

---

### Task 5: Proxy endpoint — Charts (P&L)

**Files:**
- Create: `server/api/kontabila/charts.get.ts`

**Step 1: Crea l'endpoint**

```ts
// server/api/kontabila/charts.get.ts
import { getKontabilaToken } from '../../utils/kontabila-auth'

export default defineEventHandler(async (event) => {
  const query = getQuery(event)
  const entityId = query.entityId

  if (!entityId) throw createError({ statusCode: 400, message: 'entityId required' })

  const token = await getKontabilaToken()
  const config = useRuntimeConfig()

  const res = await fetch(`${config.kontabilaUrl}/api/dashboard/charts?entityId=${entityId}`, {
    headers: { Authorization: `Bearer ${token}` }
  })

  if (!res.ok) throw createError({ statusCode: 502, message: 'Kontabila charts error' })

  return await res.json()
})
```

**Step 2: Testa**

```bash
curl -s "http://localhost:3000/api/kontabila/charts?entityId=1" | python3 -c "import sys,json; d=json.load(sys.stdin); print('months:', d['months'][:3], 'pnl_curr:', d['pnl']['current'][:3])"
```
Expected: months Gen/Feb/Mar, valori P&L

**Step 3: Commit**

```bash
git add server/api/kontabila/charts.get.ts
git commit -m "feat: proxy endpoint Kontabila P&L charts"
```

---

### Task 6: Proxy endpoint — Saldi Bancari

**Files:**
- Create: `server/api/kontabila/saldi.get.ts`

**Step 1: Crea l'endpoint**

```ts
// server/api/kontabila/saldi.get.ts
import { getKontabilaToken } from '../../utils/kontabila-auth'

export default defineEventHandler(async (event) => {
  const query = getQuery(event)
  const entityId = query.entityId

  if (!entityId) throw createError({ statusCode: 400, message: 'entityId required' })

  const token = await getKontabilaToken()
  const config = useRuntimeConfig()

  const res = await fetch(`${config.kontabilaUrl}/api/dashboard/saldi?entityId=${entityId}`, {
    headers: { Authorization: `Bearer ${token}` }
  })

  if (!res.ok) throw createError({ statusCode: 502, message: 'Kontabila saldi error' })

  return await res.json()
})
```

**Step 2: Testa**

```bash
curl -s "http://localhost:3000/api/kontabila/saldi?entityId=1" | python3 -c "import sys,json; d=json.load(sys.stdin); print('totalBalance:', d['summary']['totalBalance'])"
```
Expected: totalBalance 56552.05

**Step 3: Commit**

```bash
git add server/api/kontabila/saldi.get.ts
git commit -m "feat: proxy endpoint Kontabila saldi bancari"
```

---

### Task 7: Pinia Store — Entity

**Files:**
- Create: `stores/entity.ts`

**Step 1: Crea lo store**

```ts
// stores/entity.ts
import { defineStore } from 'pinia'

export interface KontabilaEntity {
  id: number
  name: string
  type: string
  vatNumber: string | null
}

export const useEntityStore = defineStore('entity', () => {
  const entities = ref<KontabilaEntity[]>([])
  const selectedEntityId = ref<number | null>(null)
  const loading = ref(false)

  const selectedEntity = computed(() =>
    entities.value.find(e => e.id === selectedEntityId.value) ?? null
  )

  async function fetchEntities() {
    loading.value = true
    try {
      const data = await $fetch<KontabilaEntity[]>('/api/kontabila/entities')
      entities.value = data
    } finally {
      loading.value = false
    }
  }

  function selectEntity(id: number | null) {
    selectedEntityId.value = id
    if (import.meta.client) {
      if (id === null) localStorage.removeItem('profitera_entity_id')
      else localStorage.setItem('profitera_entity_id', String(id))
    }
  }

  function restoreFromStorage() {
    if (!import.meta.client) return
    const saved = localStorage.getItem('profitera_entity_id')
    if (saved) selectedEntityId.value = parseInt(saved)
  }

  return { entities, selectedEntityId, selectedEntity, loading, fetchEntities, selectEntity, restoreFromStorage }
})
```

**Step 2: Commit**

```bash
git add stores/entity.ts
git commit -m "feat: Pinia store for Kontabila entity selection"
```

---

### Task 8: Componente EntitySelector

**Files:**
- Create: `components/EntitySelector.vue`

**Step 1: Crea il componente dropdown**

```vue
<!-- components/EntitySelector.vue -->
<template>
  <div class="relative" ref="dropdownRef">
    <button
      @click="open = !open"
      class="flex items-center gap-2 text-xs text-slate-500 hover:text-slate-700 transition-colors px-2 py-1 rounded-lg hover:bg-slate-100"
    >
      <i class="fas fa-building"></i>
      <span>{{ entityStore.selectedEntity?.name ?? `${entityStore.entities.length} aziende` }}</span>
      <i :class="open ? 'fas fa-chevron-up' : 'fas fa-chevron-down'" class="text-[10px]"></i>
    </button>

    <div
      v-if="open"
      class="absolute right-0 top-full mt-1 w-56 bg-white border border-slate-200 rounded-xl shadow-lg z-50 py-1"
    >
      <button
        v-for="entity in entityStore.entities"
        :key="entity.id"
        @click="select(entity.id)"
        class="w-full text-left px-4 py-2.5 text-sm hover:bg-slate-50 transition-colors flex items-center gap-2"
        :class="entityStore.selectedEntityId === entity.id ? 'text-emerald-600 font-medium' : 'text-slate-700'"
      >
        <i :class="entity.type === 'srl' ? 'fas fa-building' : 'fas fa-user'" class="text-slate-400 w-4"></i>
        {{ entity.name }}
      </button>
      <div class="border-t border-slate-100 mt-1 pt-1">
        <button
          @click="select(null)"
          class="w-full text-left px-4 py-2 text-xs text-slate-400 hover:text-slate-600 hover:bg-slate-50 transition-colors"
        >
          <i class="fas fa-times mr-1"></i> Deseleziona
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const entityStore = useEntityStore()
const open = ref(false)
const dropdownRef = ref<HTMLElement>()

function select(id: number | null) {
  entityStore.selectEntity(id)
  open.value = false
}

onClickOutside(dropdownRef, () => { open.value = false })
</script>
```

**Step 2: Commit**

```bash
git add components/EntitySelector.vue
git commit -m "feat: EntitySelector dropdown component"
```

---

### Task 9: Integra EntitySelector nel Layout

**Files:**
- Modify: `layouts/default.vue`

**Step 1: Nel `<script setup>` del layout, aggiungi fetchEntities + restore**

Trova `const centroStore = useCentroStore()` e aggiungi dopo:

```ts
const entityStore = useEntityStore()

onMounted(async () => {
  entityStore.restoreFromStorage()
  await entityStore.fetchEntities()
})
```

**Step 2: Nell'header, sostituisci il contatore statico `{{ centroStore.centri.length }} aziende`**

Trova:
```html
<span class="text-xs text-slate-400">
  <i class="fas fa-building mr-1"></i>
  {{ centroStore.centri.length }} aziende
</span>
```

Sostituisci con:
```html
<EntitySelector />
```

**Step 3: Verifica visivamente in locale**

```bash
# Il dropdown deve apparire nell'header con le 4 entità
open http://localhost:3000/dashboard
```

**Step 4: Commit**

```bash
git add layouts/default.vue
git commit -m "feat: integrate EntitySelector in header layout"
```

---

### Task 10: Dashboard — Grafici P&L e Saldo Bancario

**Files:**
- Modify: `pages/dashboard/index.vue`

**Step 1: Riscrivi il componente dashboard**

Sostituisci il contenuto di `pages/dashboard/index.vue` con:

```vue
<template>
  <div>
    <div class="mb-6">
      <div class="flex items-center gap-2">
        <h1 class="text-2xl font-bold text-slate-800">Dashboard Controllo di Gestione</h1>
        <PageInfoButton
          title="Dashboard"
          description="Panoramica contabilità e finanza con KPI principali e quick links"
          :features="['Profit & Loss mensile', 'Saldo Bancario ultimi 24 mesi']"
        />
      </div>
      <p class="text-slate-500">
        {{ entityStore.selectedEntity ? entityStore.selectedEntity.name : 'Seleziona un\'entità per vedere i dati' }}
      </p>
    </div>

    <!-- Stato vuoto: nessuna entità selezionata -->
    <div v-if="!entityStore.selectedEntityId" class="card p-12 text-center">
      <div class="w-16 h-16 bg-slate-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
        <i class="fas fa-building text-slate-400 text-2xl"></i>
      </div>
      <h3 class="text-lg font-semibold text-slate-700 mb-2">Nessuna azienda selezionata</h3>
      <p class="text-slate-400 text-sm">Usa il selettore in alto a destra per scegliere un'entità.</p>
    </div>

    <!-- Grafici -->
    <div v-else>
      <!-- Loading -->
      <div v-if="loading" class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div class="card p-6 h-80 animate-pulse bg-slate-100"></div>
        <div class="card p-6 h-80 animate-pulse bg-slate-100"></div>
      </div>

      <!-- Charts -->
      <div v-else class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <!-- Profit & Loss -->
        <div class="card p-6">
          <div class="flex items-center justify-between mb-4">
            <div>
              <h2 class="font-semibold text-slate-800 flex items-center gap-2">
                <i class="fas fa-chart-bar text-emerald-500"></i>
                Profit &amp; Loss
              </h2>
              <p class="text-xs text-slate-400">Risultato netto mensile</p>
            </div>
            <div class="flex items-center gap-3 text-xs text-slate-500">
              <span class="flex items-center gap-1"><span class="w-3 h-3 rounded-sm bg-emerald-500 inline-block"></span> {{ chartsData?.currentYear }}</span>
              <span class="flex items-center gap-1"><span class="w-3 h-3 rounded-sm bg-slate-300 inline-block"></span> {{ chartsData?.prevYear }}</span>
            </div>
          </div>
          <client-only>
            <apexchart
              v-if="chartsData"
              type="bar"
              height="250"
              :options="pnlOptions"
              :series="pnlSeries"
            />
          </client-only>
        </div>

        <!-- Saldo Bancario -->
        <div class="card p-6">
          <div class="flex items-center justify-between mb-4">
            <div>
              <h2 class="font-semibold text-slate-800 flex items-center gap-2">
                <i class="fas fa-university text-blue-500"></i>
                Saldo Bancario
              </h2>
              <p class="text-xs text-slate-400">Ultimi 24 mesi — tutte le banche</p>
            </div>
            <span class="text-sm font-semibold text-slate-700">
              {{ formatCurrency(saldiData?.summary?.totalBalance ?? 0) }}
            </span>
          </div>
          <client-only>
            <apexchart
              v-if="chartsData"
              type="area"
              height="250"
              :options="liquidityOptions"
              :series="liquiditySeries"
            />
          </client-only>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({ layout: 'default' })

const entityStore = useEntityStore()

const chartsData = ref<any>(null)
const saldiData = ref<any>(null)
const loading = ref(false)

async function loadData(entityId: number) {
  loading.value = true
  try {
    const [charts, saldi] = await Promise.all([
      $fetch(`/api/kontabila/charts?entityId=${entityId}`),
      $fetch(`/api/kontabila/saldi?entityId=${entityId}`)
    ])
    chartsData.value = charts
    saldiData.value = saldi
  } catch (e) {
    console.error('Dashboard data error:', e)
  } finally {
    loading.value = false
  }
}

watch(() => entityStore.selectedEntityId, (id) => {
  if (id) loadData(id)
  else { chartsData.value = null; saldiData.value = null }
}, { immediate: true })

// P&L chart options
const pnlOptions = computed(() => ({
  chart: { toolbar: { show: false }, fontFamily: 'inherit' },
  plotOptions: { bar: { columnWidth: '60%', borderRadius: 3 } },
  colors: ['#10b981', '#cbd5e1'],
  xaxis: { categories: chartsData.value?.months ?? [] },
  yaxis: { labels: { formatter: (v: number) => formatCurrency(v) } },
  tooltip: { y: { formatter: (v: number) => formatCurrency(v) } },
  legend: { show: false },
  grid: { borderColor: '#f1f5f9' },
  dataLabels: { enabled: false }
}))

const pnlSeries = computed(() => [
  { name: String(chartsData.value?.currentYear ?? ''), data: chartsData.value?.pnl?.current ?? [] },
  { name: String(chartsData.value?.prevYear ?? ''), data: chartsData.value?.pnl?.prev ?? [] }
])

// Liquidity chart options
const liquidityOptions = computed(() => ({
  chart: { toolbar: { show: false }, fontFamily: 'inherit' },
  colors: ['#3b82f6'],
  fill: { type: 'gradient', gradient: { shadeIntensity: 1, opacityFrom: 0.3, opacityTo: 0.05 } },
  stroke: { curve: 'smooth', width: 2 },
  xaxis: { categories: chartsData.value?.months ?? [] },
  yaxis: { labels: { formatter: (v: number) => formatCurrency(v) } },
  tooltip: { y: { formatter: (v: number) => formatCurrency(v) } },
  dataLabels: { enabled: false },
  grid: { borderColor: '#f1f5f9' }
}))

const liquiditySeries = computed(() => [
  { name: 'Saldo', data: chartsData.value?.liquidity?.current ?? [] }
])

function formatCurrency(v: number) {
  if (!v && v !== 0) return '€0'
  return new Intl.NumberFormat('it-IT', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 }).format(v)
}
</script>
```

**Step 2: Verifica in locale**

```bash
# Apri browser su http://localhost:3000/dashboard
# Seleziona Smiledoc S.r.l. dal dropdown in header
# I due grafici devono apparire con dati reali
```

**Step 3: Commit**

```bash
git add pages/dashboard/index.vue
git commit -m "feat: dashboard P&L e Saldo Bancario da Kontabila"
```

---

### Task 11: Deploy su server

**Step 1: Git pull su server**

```bash
ssh geniusmile@93.186.255.213 'cd /home/geniusmile/Profitera && git pull origin main'
```

**Step 2: Installa dipendenze**

```bash
ssh geniusmile@93.186.255.213 'cd /home/geniusmile/Profitera && npm install'
```

**Step 3: Build**

```bash
ssh geniusmile@93.186.255.213 'cd /home/geniusmile/Profitera && npm run build 2>&1 | tail -20'
```
Expected: `✓ nitro build complete`

**Step 4: Restart PM2**

```bash
ssh geniusmile@93.186.255.213 'pm2 restart profitera && sleep 3 && pm2 show profitera | grep status'
```
Expected: `online`

**Step 5: Verifica curl**

```bash
curl -sk --resolve "profitera.it:443:93.186.255.213" "https://profitera.it/dashboard" | python3 -c "
import sys, re; html=sys.stdin.read()
print('Size:', len(html))
print('Has content:', len(html) > 5000)
"
```
Expected: Size > 5000

**Step 6: Commit finale push**

```bash
git push origin main
```
