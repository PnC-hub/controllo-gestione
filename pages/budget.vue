<template>
  <div class="space-y-6">
    <!-- Header -->
    <div class="flex items-center justify-between">
      <div>
        <div class="flex items-center gap-2">
          <h1 class="text-2xl font-bold text-slate-800">Budget Annuale</h1>
          <PageInfoButton
            title="Budget"
            description="Budget annuale previsionale con tabella interattiva ricavi, costi e EBITDA"
            :features="[
              'Budget mensile interattivo',
              'Calcolo EBITDA automatico',
              'Confronto previsionale vs consuntivo'
            ]"
          />
        </div>
        <p class="text-sm text-slate-500 mt-1">Piano economico previsionale per l'anno</p>
      </div>
      <div class="flex items-center gap-3">
        <select v-model="selectedYear" class="px-4 py-2 border border-slate-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500">
          <option v-for="year in availableYears" :key="year" :value="year">{{ year }}</option>
        </select>
      </div>
    </div>

    <!-- Budget Table -->
    <div class="card">
      <div class="overflow-x-auto">
        <div class="inline-block min-w-full align-middle">
          <table class="min-w-full budget-table">
            <thead>
              <tr>
                <th class="sticky-col">Voce</th>
                <th v-for="month in months" :key="month">{{ month }}</th>
                <th class="total-col">Totale</th>
              </tr>
            </thead>
            <tbody>
              <!-- RICAVI -->
              <tr class="section-header">
                <td colspan="14" class="text-left font-bold text-emerald-700 bg-emerald-50">RICAVI</td>
              </tr>
              <tr v-for="item in ricaviItems" :key="item.key">
                <td class="sticky-col voce-name">{{ item.label }}</td>
                <td v-for="month in months" :key="month" class="editable-cell">
                  <input
                    v-model.number="budgetData.ricavi[item.key][month]"
                    type="number"
                    step="100"
                    class="budget-input"
                    @input="calculateTotals"
                  />
                </td>
                <td class="total-col">{{ formatCurrency(calculateRowTotal('ricavi', item.key)) }}</td>
              </tr>
              <tr class="subtotal-row">
                <td class="sticky-col font-bold">TOTALE RICAVI</td>
                <td v-for="month in months" :key="month" class="font-bold">
                  {{ formatCurrency(calculateMonthTotal('ricavi', month)) }}
                </td>
                <td class="total-col font-bold">{{ formatCurrency(totaleRicavi) }}</td>
              </tr>

              <!-- COSTI -->
              <tr class="section-header">
                <td colspan="14" class="text-left font-bold text-red-700 bg-red-50">COSTI</td>
              </tr>
              <tr v-for="item in costiItems" :key="item.key">
                <td class="sticky-col voce-name">{{ item.label }}</td>
                <td v-for="month in months" :key="month" class="editable-cell">
                  <input
                    v-model.number="budgetData.costi[item.key][month]"
                    type="number"
                    step="100"
                    class="budget-input"
                    @input="calculateTotals"
                  />
                </td>
                <td class="total-col">{{ formatCurrency(calculateRowTotal('costi', item.key)) }}</td>
              </tr>
              <tr class="subtotal-row">
                <td class="sticky-col font-bold">TOTALE COSTI</td>
                <td v-for="month in months" :key="month" class="font-bold">
                  {{ formatCurrency(calculateMonthTotal('costi', month)) }}
                </td>
                <td class="total-col font-bold">{{ formatCurrency(totaleCosti) }}</td>
              </tr>

              <!-- RISULTATO -->
              <tr class="result-row">
                <td class="sticky-col font-bold text-lg">RISULTATO NETTO</td>
                <td v-for="month in months" :key="month" class="font-bold text-lg" :class="calculateMonthResult(month) >= 0 ? 'text-emerald-600' : 'text-red-600'">
                  {{ formatCurrency(calculateMonthResult(month)) }}
                </td>
                <td class="total-col font-bold text-lg" :class="risultatoNetto >= 0 ? 'text-emerald-600' : 'text-red-600'">
                  {{ formatCurrency(risultatoNetto) }}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <!-- Actions -->
    <div class="flex items-center justify-end gap-3">
      <button @click="exportCSV" class="px-4 py-2 border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors">
        <i class="fas fa-file-csv mr-2"></i>
        Esporta CSV
      </button>
      <button @click="exportPDF" class="px-4 py-2 border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors">
        <i class="fas fa-file-pdf mr-2"></i>
        Esporta PDF
      </button>
      <button @click="saveBudget" class="px-6 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors">
        <i class="fas fa-save mr-2"></i>
        Salva Budget
      </button>
    </div>

    <!-- Success Message -->
    <div v-if="saveSuccess" class="fixed bottom-6 right-6 bg-emerald-600 text-white px-6 py-3 rounded-lg shadow-lg flex items-center gap-3 animate-fade-in">
      <i class="fas fa-check-circle"></i>
      <span>Budget salvato con successo</span>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  layout: 'default'
})

const months = ['Gen', 'Feb', 'Mar', 'Apr', 'Mag', 'Giu', 'Lug', 'Ago', 'Set', 'Ott', 'Nov', 'Dic']
const selectedYear = ref(2026)
const availableYears = [2025, 2026, 2027]
const saveSuccess = ref(false)

const ricaviItems = [
  { key: 'prestazioni', label: 'Prestazioni odontoiatriche' },
  { key: 'ortodonzia', label: 'Ortodonzia' },
  { key: 'igiene', label: 'Igiene' }
]

const costiItems = [
  { key: 'personale', label: 'Personale' },
  { key: 'materiali', label: 'Materiali consumo' },
  { key: 'affitto', label: 'Affitto' },
  { key: 'utenze', label: 'Utenze' },
  { key: 'ammortamenti', label: 'Ammortamenti' },
  { key: 'consulenze', label: 'Consulenze' },
  { key: 'marketing', label: 'Marketing' },
  { key: 'assicurazioni', label: 'Assicurazioni' },
  { key: 'oneri_finanziari', label: 'Oneri finanziari' },
  { key: 'imposte', label: 'Imposte (IRES+IRAP)' }
]

// Initialize budget data with mock values
const initializeBudgetData = () => {
  const ricavi: any = {}
  const costi: any = {}

  // Ricavi mock data
  const ricaviValues: Record<string, number> = {
    prestazioni: 80000,
    ortodonzia: 15000,
    igiene: 8000
  }

  // Costi mock data
  const costiValues: Record<string, number> = {
    personale: 28000,
    materiali: 12000,
    affitto: 3500,
    utenze: 2000,
    ammortamenti: 4000,
    consulenze: 2500,
    marketing: 1500,
    assicurazioni: 800,
    oneri_finanziari: 500,
    imposte: 15000
  }

  // Initialize ricavi
  ricaviItems.forEach(item => {
    ricavi[item.key] = {}
    months.forEach(month => {
      ricavi[item.key][month] = ricaviValues[item.key] || 0
    })
  })

  // Initialize costi
  costiItems.forEach(item => {
    costi[item.key] = {}
    months.forEach(month => {
      costi[item.key][month] = costiValues[item.key] || 0
    })
  })

  return { ricavi, costi }
}

const budgetData = reactive(initializeBudgetData())

const totaleRicavi = computed(() => {
  let total = 0
  ricaviItems.forEach(item => {
    months.forEach(month => {
      total += budgetData.ricavi[item.key][month] || 0
    })
  })
  return total
})

const totaleCosti = computed(() => {
  let total = 0
  costiItems.forEach(item => {
    months.forEach(month => {
      total += budgetData.costi[item.key][month] || 0
    })
  })
  return total
})

const risultatoNetto = computed(() => totaleRicavi.value - totaleCosti.value)

const calculateRowTotal = (section: string, key: string) => {
  let total = 0
  months.forEach(month => {
    total += budgetData[section][key][month] || 0
  })
  return total
}

const calculateMonthTotal = (section: string, month: string) => {
  let total = 0
  const items = section === 'ricavi' ? ricaviItems : costiItems
  items.forEach(item => {
    total += budgetData[section][item.key][month] || 0
  })
  return total
}

const calculateMonthResult = (month: string) => {
  return calculateMonthTotal('ricavi', month) - calculateMonthTotal('costi', month)
}

const calculateTotals = () => {
  // Trigger reactivity
}

const formatCurrency = (value: number) => {
  return new Intl.NumberFormat('it-IT', {
    style: 'currency',
    currency: 'EUR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(value)
}

const saveBudget = async () => {
  try {
    const response = await $fetch('/api/budget', {
      method: 'POST',
      body: {
        year: selectedYear.value,
        data: budgetData
      }
    })
    saveSuccess.value = true
    setTimeout(() => {
      saveSuccess.value = false
    }, 3000)
  } catch (error) {
    console.error('Errore salvataggio budget:', error)
  }
}

const exportCSV = () => {
  let csv = 'Voce,' + months.join(',') + ',Totale\n'

  // Ricavi
  csv += 'RICAVI\n'
  ricaviItems.forEach(item => {
    const values = months.map(m => budgetData.ricavi[item.key][m] || 0)
    csv += `${item.label},${values.join(',')},${calculateRowTotal('ricavi', item.key)}\n`
  })
  csv += `TOTALE RICAVI,${months.map(m => calculateMonthTotal('ricavi', m)).join(',')},${totaleRicavi.value}\n`

  // Costi
  csv += '\nCOSTI\n'
  costiItems.forEach(item => {
    const values = months.map(m => budgetData.costi[item.key][m] || 0)
    csv += `${item.label},${values.join(',')},${calculateRowTotal('costi', item.key)}\n`
  })
  csv += `TOTALE COSTI,${months.map(m => calculateMonthTotal('costi', m)).join(',')},${totaleCosti.value}\n`

  // Risultato
  csv += `\nRISULTATO NETTO,${months.map(m => calculateMonthResult(m)).join(',')},${risultatoNetto.value}\n`

  const blob = new Blob([csv], { type: 'text/csv' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `budget-${selectedYear.value}.csv`
  a.click()
}

const exportPDF = () => {
  alert('Export PDF in sviluppo')
}

// Load budget data when year changes
watch(selectedYear, async (newYear) => {
  try {
    const response = await $fetch(`/api/budget?year=${newYear}`)
    if (response && response.data) {
      Object.assign(budgetData, response.data)
    }
  } catch (error) {
    console.error('Errore caricamento budget:', error)
  }
})
</script>

<style scoped>
.budget-table {
  border-collapse: separate;
  border-spacing: 0;
}

.budget-table th {
  background: #f1f5f9;
  color: #475569;
  font-weight: 600;
  font-size: 13px;
  padding: 12px 8px;
  text-align: center;
  border-bottom: 2px solid #e2e8f0;
  white-space: nowrap;
}

.budget-table th:first-child {
  text-align: left;
  padding-left: 16px;
}

.budget-table td {
  padding: 8px;
  border-bottom: 1px solid #e2e8f0;
  text-align: center;
  font-size: 14px;
}

.sticky-col {
  position: sticky;
  left: 0;
  background: white;
  z-index: 2;
  min-width: 250px;
  text-align: left !important;
  padding-left: 16px !important;
  font-weight: 500;
  box-shadow: 2px 0 4px rgba(0,0,0,0.05);
}

.total-col {
  position: sticky;
  right: 0;
  background: #f8fafc;
  font-weight: 600;
  border-left: 2px solid #e2e8f0;
  z-index: 2;
  box-shadow: -2px 0 4px rgba(0,0,0,0.05);
}

.budget-input {
  width: 100%;
  padding: 6px 8px;
  border: 1px solid transparent;
  border-radius: 4px;
  text-align: right;
  font-family: 'Inter', sans-serif;
  transition: all 0.2s;
}

.budget-input:hover {
  border-color: #cbd5e1;
  background: #f8fafc;
}

.budget-input:focus {
  outline: none;
  border-color: #059669;
  background: white;
  box-shadow: 0 0 0 3px rgba(5, 150, 105, 0.1);
}

.section-header td {
  padding: 12px 16px !important;
  font-size: 14px;
}

.subtotal-row {
  background: #f8fafc;
}

.subtotal-row td {
  padding: 10px 8px !important;
  color: #1e293b;
}

.result-row {
  background: linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%);
  border-top: 2px solid #059669;
}

.result-row td {
  padding: 14px 8px !important;
}

.voce-name {
  color: #475569;
}

@keyframes fade-in {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.animate-fade-in {
  animation: fade-in 0.3s ease;
}
</style>
