<template>
  <div>
    <!-- Header -->
    <div class="card mb-6">
      <div class="card-header flex justify-between items-center">
        <h2 class="card-title">
          <i class="fas fa-balance-scale mr-2 text-cyan-600"></i>
          <span>Conciliazione Bancaria</span>
        </h2>
        <div class="flex items-center space-x-4">
          <NuxtLink to="/bank" class="text-cyan-600 hover:text-cyan-800">
            <i class="fas fa-arrow-left mr-1"></i> Bank Control
          </NuxtLink>
        </div>
      </div>
    </div>

    <!-- Statistiche Generali -->
    <div class="grid grid-cols-2 md:grid-cols-6 gap-4 mb-6">
      <div class="bg-blue-50 rounded-lg p-4 text-center">
        <div class="text-2xl font-bold text-blue-700">{{ stats.totale_movimenti }}</div>
        <div class="text-sm text-blue-600">Movimenti Totali</div>
      </div>
      <div class="bg-green-50 rounded-lg p-4 text-center">
        <div class="text-2xl font-bold text-green-700">{{ stats.entrate_conciliate }}</div>
        <div class="text-sm text-green-600">Entrate Conciliate</div>
      </div>
      <div class="bg-red-50 rounded-lg p-4 text-center">
        <div class="text-2xl font-bold text-red-700">{{ stats.uscite_conciliate }}</div>
        <div class="text-sm text-red-600">Uscite Conciliate</div>
      </div>
      <div class="bg-yellow-50 rounded-lg p-4 text-center">
        <div class="text-2xl font-bold text-yellow-700">{{ stats.da_conciliare }}</div>
        <div class="text-sm text-yellow-600">Da Conciliare</div>
      </div>
      <div class="bg-purple-50 rounded-lg p-4 text-center">
        <div class="text-2xl font-bold text-purple-700">{{ stats.auto_match }}</div>
        <div class="text-sm text-purple-600">Auto Match</div>
      </div>
      <div class="bg-cyan-50 rounded-lg p-4 text-center">
        <div class="text-2xl font-bold text-cyan-700">{{ stats.tasso_conciliazione }}%</div>
        <div class="text-sm text-cyan-600">Tasso Conciliazione</div>
      </div>
    </div>

    <!-- Tab Navigation -->
    <div class="card mb-6">
      <div class="border-b border-gray-200">
        <nav class="flex -mb-px">
          <button
            @click="activeTab = 'entrate'"
            class="tab-btn"
            :class="activeTab === 'entrate' ? 'tab-active' : 'tab-inactive'"
          >
            <i class="fas fa-arrow-down mr-2 text-green-500"></i>
            Entrate (Ricavi)
            <span class="ml-2 px-2 py-0.5 rounded-full text-xs" :class="activeTab === 'entrate' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'">
              {{ entrateCount }}
            </span>
          </button>
          <button
            @click="activeTab = 'uscite'"
            class="tab-btn"
            :class="activeTab === 'uscite' ? 'tab-active' : 'tab-inactive'"
          >
            <i class="fas fa-arrow-up mr-2 text-red-500"></i>
            Uscite (Costi)
            <span class="ml-2 px-2 py-0.5 rounded-full text-xs" :class="activeTab === 'uscite' ? 'bg-red-100 text-red-700' : 'bg-gray-100 text-gray-600'">
              {{ usciteCount }}
            </span>
          </button>
          <button
            @click="activeTab = 'registrati'"
            class="tab-btn"
            :class="activeTab === 'registrati' ? 'tab-active' : 'tab-inactive'"
          >
            <i class="fas fa-check-circle mr-2 text-cyan-500"></i>
            Registrati in Prima Nota
            <span class="ml-2 px-2 py-0.5 rounded-full text-xs" :class="activeTab === 'registrati' ? 'bg-cyan-100 text-cyan-700' : 'bg-gray-100 text-gray-600'">
              {{ registratiCount }}
            </span>
          </button>
        </nav>
      </div>

      <div class="card-content">
        <!-- Filtri -->
        <div class="flex flex-wrap items-center justify-between gap-4 mb-6">
          <div class="flex items-center space-x-4">
            <select v-model="filters.bank_account_id" class="input-field w-48" @change="loadData()">
              <option value="">Tutti i conti</option>
              <option v-for="a in accounts" :key="a.id" :value="a.id">{{ a.name }}</option>
            </select>
            <input
              type="date"
              v-model="filters.data_dal"
              class="input-field"
              @change="loadData()"
            />
            <input
              type="date"
              v-model="filters.data_al"
              class="input-field"
              @change="loadData()"
            />
            <select v-model="filters.status" class="input-field w-40" @change="loadData()">
              <option value="non_conciliato">Da conciliare</option>
              <option value="tutti">Tutti</option>
              <option value="conciliato">Conciliati</option>
              <option value="registrato">Registrati</option>
            </select>
          </div>
          <div class="flex items-center space-x-3">
            <button @click="runAutoConciliazione" :disabled="autoProcessing" class="btn-primary">
              <i :class="autoProcessing ? 'fas fa-spinner fa-spin' : 'fas fa-magic'" class="mr-2"></i>
              Auto Concilia
            </button>
            <button @click="registraSelezionati" :disabled="selectedItems.length === 0" class="btn-secondary">
              <i class="fas fa-file-invoice mr-2"></i>
              Registra in Prima Nota ({{ selectedItems.length }})
            </button>
          </div>
        </div>

        <!-- Loading -->
        <div v-if="loading" class="text-center py-8">
          <i class="fas fa-spinner fa-spin text-4xl text-cyan-600"></i>
        </div>

        <!-- Tab Entrate -->
        <div v-else-if="activeTab === 'entrate'">
          <div v-if="entrate.length === 0" class="text-center py-12 text-gray-500">
            <i class="fas fa-check-circle text-5xl mb-4 text-green-400"></i>
            <p>Nessuna entrata da conciliare</p>
          </div>

          <div v-else class="space-y-3">
            <div
              v-for="mov in entrate"
              :key="mov.id"
              class="border rounded-lg p-4 hover:shadow-md transition-shadow"
              :class="getRowClass(mov)"
            >
              <div class="flex items-start">
                <!-- Checkbox -->
                <div class="mr-4 pt-1">
                  <input
                    type="checkbox"
                    :value="mov.id"
                    v-model="selectedItems"
                    :disabled="mov.registrato_prima_nota"
                    class="w-4 h-4 text-cyan-600 rounded"
                  />
                </div>

                <!-- Info Movimento -->
                <div class="flex-1">
                  <div class="flex items-center space-x-3 mb-2">
                    <span class="text-sm text-gray-500">{{ formatDate(mov.transaction_date) }}</span>
                    <span class="text-lg font-bold text-green-600">+{{ formatCurrency(mov.amount) }}</span>
                    <span v-if="mov.conciliato" class="px-2 py-0.5 rounded text-xs bg-green-100 text-green-700">
                      <i class="fas fa-link mr-1"></i> Conciliato
                    </span>
                    <span v-if="mov.registrato_prima_nota" class="px-2 py-0.5 rounded text-xs bg-cyan-100 text-cyan-700">
                      <i class="fas fa-check mr-1"></i> Registrato
                    </span>
                  </div>
                  <p class="text-gray-800 font-medium">{{ mov.description || mov.original_description }}</p>
                  <p v-if="mov.counterparty" class="text-sm text-gray-500 mt-1">
                    <i class="fas fa-user mr-1"></i> {{ mov.counterparty }}
                  </p>

                  <!-- Fattura collegata -->
                  <div v-if="mov.fattura_collegata" class="mt-2 p-2 bg-green-50 rounded text-sm">
                    <i class="fas fa-file-invoice text-green-600 mr-2"></i>
                    <span class="font-medium">Fattura #{{ mov.fattura_collegata.numero }}</span>
                    <span class="text-gray-500 ml-2">{{ mov.fattura_collegata.cliente }}</span>
                    <span class="text-green-600 ml-2">{{ formatCurrency(mov.fattura_collegata.importo) }}</span>
                  </div>
                </div>

                <!-- Azioni -->
                <div class="flex items-center space-x-2">
                  <button
                    v-if="!mov.conciliato"
                    @click="openMatchModal(mov, 'entrata')"
                    class="btn-primary-sm"
                  >
                    <i class="fas fa-link mr-1"></i> Collega Fattura
                  </button>
                  <button
                    v-else-if="!mov.registrato_prima_nota"
                    @click="registraSingolo(mov)"
                    class="btn-success-sm"
                  >
                    <i class="fas fa-file-invoice mr-1"></i> Registra
                  </button>
                  <button
                    v-if="mov.conciliato && !mov.registrato_prima_nota"
                    @click="rimuoviConciliazione(mov)"
                    class="btn-danger-sm"
                    title="Rimuovi collegamento"
                  >
                    <i class="fas fa-unlink"></i>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Tab Uscite -->
        <div v-else-if="activeTab === 'uscite'">
          <div v-if="uscite.length === 0" class="text-center py-12 text-gray-500">
            <i class="fas fa-check-circle text-5xl mb-4 text-red-400"></i>
            <p>Nessuna uscita da conciliare</p>
          </div>

          <div v-else class="space-y-3">
            <div
              v-for="mov in uscite"
              :key="mov.id"
              class="border rounded-lg p-4 hover:shadow-md transition-shadow"
              :class="getRowClass(mov)"
            >
              <div class="flex items-start">
                <!-- Checkbox -->
                <div class="mr-4 pt-1">
                  <input
                    type="checkbox"
                    :value="mov.id"
                    v-model="selectedItems"
                    :disabled="mov.registrato_prima_nota"
                    class="w-4 h-4 text-cyan-600 rounded"
                  />
                </div>

                <!-- Info Movimento -->
                <div class="flex-1">
                  <div class="flex items-center space-x-3 mb-2">
                    <span class="text-sm text-gray-500">{{ formatDate(mov.transaction_date) }}</span>
                    <span class="text-lg font-bold text-red-600">-{{ formatCurrency(Math.abs(mov.amount)) }}</span>
                    <span v-if="mov.conciliato" class="px-2 py-0.5 rounded text-xs bg-green-100 text-green-700">
                      <i class="fas fa-link mr-1"></i> Conciliato
                    </span>
                    <span v-if="mov.registrato_prima_nota" class="px-2 py-0.5 rounded text-xs bg-cyan-100 text-cyan-700">
                      <i class="fas fa-check mr-1"></i> Registrato
                    </span>
                    <span v-if="mov.richiede_autofattura" class="px-2 py-0.5 rounded text-xs bg-orange-100 text-orange-700">
                      <i class="fas fa-exclamation-triangle mr-1"></i> Autofattura
                    </span>
                  </div>
                  <p class="text-gray-800 font-medium">{{ mov.description || mov.original_description }}</p>
                  <p v-if="mov.counterparty" class="text-sm text-gray-500 mt-1">
                    <i class="fas fa-building mr-1"></i> {{ mov.counterparty }}
                  </p>

                  <!-- Costo collegato -->
                  <div v-if="mov.costo_collegato" class="mt-2 p-2 bg-red-50 rounded text-sm">
                    <i class="fas fa-file-invoice-dollar text-red-600 mr-2"></i>
                    <span class="font-medium">{{ mov.costo_collegato.intestatario }}</span>
                    <span class="text-gray-500 ml-2">{{ mov.costo_collegato.riferimento }}</span>
                    <span class="text-red-600 ml-2">{{ formatCurrency(mov.costo_collegato.valore) }}</span>
                  </div>
                </div>

                <!-- Azioni -->
                <div class="flex items-center space-x-2">
                  <button
                    v-if="!mov.conciliato"
                    @click="openMatchModal(mov, 'uscita')"
                    class="btn-primary-sm"
                  >
                    <i class="fas fa-link mr-1"></i> Collega Costo
                  </button>
                  <button
                    v-if="!mov.conciliato"
                    @click="creaNuovoCosto(mov)"
                    class="btn-secondary-sm"
                  >
                    <i class="fas fa-plus mr-1"></i> Nuovo Costo
                  </button>
                  <button
                    v-else-if="!mov.registrato_prima_nota"
                    @click="registraSingolo(mov)"
                    class="btn-success-sm"
                  >
                    <i class="fas fa-file-invoice mr-1"></i> Registra
                  </button>
                  <button
                    v-if="mov.conciliato && !mov.registrato_prima_nota"
                    @click="rimuoviConciliazione(mov)"
                    class="btn-danger-sm"
                    title="Rimuovi collegamento"
                  >
                    <i class="fas fa-unlink"></i>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Tab Registrati -->
        <div v-else-if="activeTab === 'registrati'">
          <div v-if="registrati.length === 0" class="text-center py-12 text-gray-500">
            <i class="fas fa-inbox text-5xl mb-4 text-gray-400"></i>
            <p>Nessun movimento registrato nel periodo</p>
          </div>

          <table v-else class="w-full">
            <thead class="bg-gray-50">
              <tr>
                <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Data</th>
                <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Descrizione</th>
                <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Documento</th>
                <th class="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">Importo</th>
                <th class="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase">Prima Nota</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-200">
              <tr v-for="mov in registrati" :key="mov.id" class="hover:bg-gray-50">
                <td class="px-4 py-3 text-sm">{{ formatDate(mov.transaction_date) }}</td>
                <td class="px-4 py-3 text-sm">{{ mov.description }}</td>
                <td class="px-4 py-3 text-sm">
                  <span v-if="mov.fattura_collegata" class="text-green-600">
                    <i class="fas fa-file-invoice mr-1"></i> Fattura #{{ mov.fattura_collegata.numero }}
                  </span>
                  <span v-else-if="mov.costo_collegato" class="text-red-600">
                    <i class="fas fa-file-invoice-dollar mr-1"></i> {{ mov.costo_collegato.intestatario }}
                  </span>
                </td>
                <td class="px-4 py-3 text-sm text-right" :class="mov.type === 'credit' ? 'text-green-600' : 'text-red-600'">
                  {{ mov.type === 'credit' ? '+' : '-' }}{{ formatCurrency(Math.abs(mov.amount)) }}
                </td>
                <td class="px-4 py-3 text-sm text-center">
                  <NuxtLink
                    v-if="mov.prima_nota_id"
                    :to="`/prima-nota?id=${mov.prima_nota_id}`"
                    class="text-cyan-600 hover:underline"
                  >
                    #{{ mov.prima_nota_id }}
                  </NuxtLink>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- Paginazione -->
        <div v-if="pagination.pages > 1" class="flex justify-center mt-6">
          <div class="flex items-center space-x-2">
            <button @click="changePage(pagination.page - 1)" :disabled="pagination.page === 1" class="btn-page">
              <i class="fas fa-chevron-left"></i>
            </button>
            <span class="text-sm text-gray-600">
              Pagina {{ pagination.page }} di {{ pagination.pages }}
            </span>
            <button @click="changePage(pagination.page + 1)" :disabled="pagination.page === pagination.pages" class="btn-page">
              <i class="fas fa-chevron-right"></i>
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal Match Fattura/Costo -->
    <div v-if="showMatchModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div class="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[85vh] overflow-hidden">
        <div class="px-6 py-4 border-b flex justify-between items-center">
          <h3 class="text-lg font-semibold">
            <i :class="matchType === 'entrata' ? 'fas fa-file-invoice text-green-600' : 'fas fa-file-invoice-dollar text-red-600'" class="mr-2"></i>
            {{ matchType === 'entrata' ? 'Collega a Fattura Emessa' : 'Collega a Fattura Ricevuta (Costo)' }}
          </h3>
          <button @click="closeMatchModal" class="text-gray-500 hover:text-gray-700">
            <i class="fas fa-times"></i>
          </button>
        </div>

        <div class="p-6">
          <!-- Info movimento -->
          <div class="rounded-lg p-4 mb-6" :class="matchType === 'entrata' ? 'bg-green-50' : 'bg-red-50'">
            <div class="text-sm text-gray-600 mb-1">Movimento bancario da collegare:</div>
            <div class="flex items-center justify-between">
              <div>
                <span class="font-bold text-xl" :class="matchType === 'entrata' ? 'text-green-600' : 'text-red-600'">
                  {{ matchType === 'entrata' ? '+' : '-' }}{{ formatCurrency(Math.abs(selectedMovimento?.amount || 0)) }}
                </span>
                <span class="text-gray-500 ml-3">{{ formatDate(selectedMovimento?.transaction_date) }}</span>
              </div>
            </div>
            <p class="text-sm text-gray-700 mt-2">{{ selectedMovimento?.description }}</p>
            <p v-if="selectedMovimento?.counterparty" class="text-sm text-gray-500 mt-1">
              <i class="fas fa-user mr-1"></i> {{ selectedMovimento?.counterparty }}
            </p>
          </div>

          <!-- Ricerca -->
          <div class="mb-4">
            <input
              type="text"
              v-model="searchMatch"
              @input="debounceSearch"
              placeholder="Cerca per cliente/fornitore, numero fattura, importo..."
              class="input-field w-full"
            />
          </div>

          <!-- Loading -->
          <div v-if="loadingMatches" class="text-center py-8">
            <i class="fas fa-spinner fa-spin text-2xl text-cyan-600"></i>
            <p class="text-gray-500 mt-2">Cercando documenti corrispondenti...</p>
          </div>

          <!-- Lista Match -->
          <div v-else-if="possibleMatches.length > 0" class="space-y-3 max-h-80 overflow-y-auto">
            <div
              v-for="match in possibleMatches"
              :key="match.id"
              class="border rounded-lg p-4 hover:border-cyan-500 cursor-pointer transition-all"
              :class="match.confidence >= 80 ? 'border-green-300 bg-green-50' : ''"
              @click="confermaMatch(match)"
            >
              <div class="flex items-center justify-between">
                <div>
                  <div class="flex items-center space-x-3">
                    <span class="font-bold">{{ match.intestatario || match.cliente }}</span>
                    <span v-if="match.numero" class="text-gray-500">#{{ match.numero }}</span>
                    <span :class="matchType === 'entrata' ? 'text-green-600' : 'text-red-600'" class="font-semibold">
                      {{ formatCurrency(match.importo || match.valore) }}
                    </span>
                  </div>
                  <div class="text-sm text-gray-500 mt-1">
                    <span v-if="match.data_fattura || match.data">
                      Data: {{ formatDate(match.data_fattura || match.data) }}
                    </span>
                    <span v-if="match.riferimento" class="ml-3">Rif: {{ match.riferimento }}</span>
                  </div>
                </div>
                <div class="text-right">
                  <div class="text-lg font-bold" :class="getConfidenceColor(match.confidence)">
                    {{ match.confidence }}%
                  </div>
                  <div class="text-xs text-gray-500">match</div>
                </div>
              </div>
            </div>
          </div>

          <div v-else class="text-center py-8 text-gray-500">
            <i class="fas fa-search text-4xl mb-2"></i>
            <p>Nessun documento corrispondente trovato</p>
          </div>
        </div>

        <div class="px-6 py-4 border-t bg-gray-50 flex justify-end">
          <button @click="closeMatchModal" class="btn-secondary">
            Annulla
          </button>
        </div>
      </div>
    </div>

    <!-- Modal Nuovo Costo -->
    <div v-if="showNuovoCostoModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div class="bg-white rounded-lg shadow-xl max-w-2xl w-full">
        <div class="px-6 py-4 border-b flex justify-between items-center">
          <h3 class="text-lg font-semibold">
            <i class="fas fa-plus-circle text-cyan-600 mr-2"></i>
            Registra Nuovo Costo
          </h3>
          <button @click="showNuovoCostoModal = false" class="text-gray-500 hover:text-gray-700">
            <i class="fas fa-times"></i>
          </button>
        </div>

        <div class="p-6">
          <form @submit.prevent="salvaNuovoCosto" class="space-y-4">
            <div class="grid grid-cols-2 gap-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Data *</label>
                <input type="date" v-model="nuovoCosto.data" class="input-field w-full" required />
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Data Fattura</label>
                <input type="date" v-model="nuovoCosto.data_fattura" class="input-field w-full" />
              </div>
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Intestatario/Fornitore *</label>
              <input type="text" v-model="nuovoCosto.intestatario" class="input-field w-full" required />
            </div>

            <div class="grid grid-cols-2 gap-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Importo *</label>
                <input type="number" step="0.01" v-model="nuovoCosto.valore" class="input-field w-full" required />
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Tipo Pagamento</label>
                <select v-model="nuovoCosto.tipo_pagamento" class="input-field w-full">
                  <option value="">Seleziona...</option>
                  <option value="Bonifico">Bonifico</option>
                  <option value="Carta">Carta di Credito</option>
                  <option value="Contanti">Contanti</option>
                  <option value="RID">RID/SDD</option>
                  <option value="PayPal">PayPal</option>
                </select>
              </div>
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Riferimento Fattura</label>
              <input type="text" v-model="nuovoCosto.riferimento" class="input-field w-full" placeholder="es. FT-2024/001" />
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Note</label>
              <textarea v-model="nuovoCosto.note" class="input-field w-full" rows="2"></textarea>
            </div>

            <div class="flex items-center space-x-4">
              <label class="flex items-center">
                <input type="checkbox" v-model="nuovoCosto.ammortamento" class="mr-2" />
                <span class="text-sm text-gray-700">Ammortamento</span>
              </label>
              <label class="flex items-center">
                <input type="checkbox" v-model="nuovoCosto.richiede_autofattura" class="mr-2" />
                <span class="text-sm text-gray-700">Richiede Autofattura</span>
              </label>
            </div>
          </form>
        </div>

        <div class="px-6 py-4 border-t bg-gray-50 flex justify-end space-x-3">
          <button @click="showNuovoCostoModal = false" class="btn-secondary">Annulla</button>
          <button @click="salvaNuovoCosto" class="btn-primary">
            <i class="fas fa-save mr-2"></i> Salva e Collega
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useCentroStore } from '~/stores/centro'

definePageMeta({ layout: 'default' })

const { fetchApi } = useApi()
const centroStore = useCentroStore()

// State
const loading = ref(true)
const autoProcessing = ref(false)
const loadingMatches = ref(false)

const activeTab = ref<'entrate' | 'uscite' | 'registrati'>('entrate')
const accounts = ref<any[]>([])
const entrate = ref<any[]>([])
const uscite = ref<any[]>([])
const registrati = ref<any[]>([])
const selectedItems = ref<number[]>([])

const stats = ref({
  totale_movimenti: 0,
  entrate_conciliate: 0,
  uscite_conciliate: 0,
  da_conciliare: 0,
  auto_match: 0,
  tasso_conciliazione: 0
})

const pagination = ref({ page: 1, pages: 1, total: 0 })

const filters = reactive({
  bank_account_id: '',
  data_dal: new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString().split('T')[0],
  data_al: new Date().toISOString().split('T')[0],
  status: 'non_conciliato'
})

// Match Modal
const showMatchModal = ref(false)
const selectedMovimento = ref<any>(null)
const matchType = ref<'entrata' | 'uscita'>('entrata')
const possibleMatches = ref<any[]>([])
const searchMatch = ref('')
let searchTimeout: any = null

// Nuovo Costo Modal
const showNuovoCostoModal = ref(false)
const nuovoCosto = reactive({
  data: '',
  data_fattura: '',
  intestatario: '',
  valore: 0,
  tipo_pagamento: '',
  riferimento: '',
  note: '',
  ammortamento: false,
  richiede_autofattura: false
})

// Computed
const entrateCount = computed(() => entrate.value.filter(e => !e.conciliato).length)
const usciteCount = computed(() => uscite.value.filter(u => !u.conciliato).length)
const registratiCount = computed(() => registrati.value.length)

// Utils
const formatCurrency = (v: any) => new Intl.NumberFormat('it-IT', { style: 'currency', currency: 'EUR' }).format(parseFloat(v) || 0)
const formatDate = (d: string) => { if (!d) return '-'; const date = new Date(d); return `${String(date.getDate()).padStart(2, '0')}-${String(date.getMonth() + 1).padStart(2, '0')}-${date.getFullYear()}`; }

const getRowClass = (mov: any) => {
  if (mov.registrato_prima_nota) return 'bg-cyan-50 border-cyan-200'
  if (mov.conciliato) return 'bg-green-50 border-green-200'
  return 'bg-white'
}

const getConfidenceColor = (confidence: number) => {
  if (confidence >= 80) return 'text-green-600'
  if (confidence >= 60) return 'text-yellow-600'
  return 'text-red-600'
}

// API Calls
const loadAccounts = async () => {
  try {
    const res = await fetchApi<any>('/bank/accounts')
    if (res.success) {
      accounts.value = res.data || []
    }
  } catch (e) {
    console.error('Errore caricamento conti:', e)
  }
}

const loadStats = async () => {
  try {
    const params = new URLSearchParams({
      data_dal: filters.data_dal,
      data_al: filters.data_al
    })
    if (filters.bank_account_id) params.append('bank_account_id', filters.bank_account_id)

    const res = await fetchApi<any>(`/bank/conciliazione/stats?${params}`)
    if (res.success) {
      stats.value = res.data
    }
  } catch (e) {
    console.error('Errore caricamento stats:', e)
  }
}

const loadEntrate = async () => {
  try {
    const params = new URLSearchParams({
      type: 'credit',
      data_dal: filters.data_dal,
      data_al: filters.data_al,
      page: pagination.value.page.toString()
    })
    if (filters.bank_account_id) params.append('bank_account_id', filters.bank_account_id)
    if (filters.status !== 'tutti') params.append('status_conciliazione', filters.status)

    const res = await fetchApi<any>(`/bank/conciliazione/movimenti?${params}`)
    if (res.success) {
      entrate.value = res.data || []
      if (res.pagination) pagination.value = res.pagination
    }
  } catch (e) {
    console.error('Errore caricamento entrate:', e)
  }
}

const loadUscite = async () => {
  try {
    const params = new URLSearchParams({
      type: 'debit',
      data_dal: filters.data_dal,
      data_al: filters.data_al,
      page: pagination.value.page.toString()
    })
    if (filters.bank_account_id) params.append('bank_account_id', filters.bank_account_id)
    if (filters.status !== 'tutti') params.append('status_conciliazione', filters.status)

    const res = await fetchApi<any>(`/bank/conciliazione/movimenti?${params}`)
    if (res.success) {
      uscite.value = res.data || []
      if (res.pagination) pagination.value = res.pagination
    }
  } catch (e) {
    console.error('Errore caricamento uscite:', e)
  }
}

const loadRegistrati = async () => {
  try {
    const params = new URLSearchParams({
      status_conciliazione: 'registrato',
      data_dal: filters.data_dal,
      data_al: filters.data_al,
      page: pagination.value.page.toString()
    })
    if (filters.bank_account_id) params.append('bank_account_id', filters.bank_account_id)

    const res = await fetchApi<any>(`/bank/conciliazione/movimenti?${params}`)
    if (res.success) {
      registrati.value = res.data || []
      if (res.pagination) pagination.value = res.pagination
    }
  } catch (e) {
    console.error('Errore caricamento registrati:', e)
  }
}

const loadData = async () => {
  loading.value = true
  selectedItems.value = []
  pagination.value.page = 1

  try {
    await loadStats()
    if (activeTab.value === 'entrate') await loadEntrate()
    else if (activeTab.value === 'uscite') await loadUscite()
    else await loadRegistrati()
  } finally {
    loading.value = false
  }
}

const changePage = (page: number) => {
  if (page >= 1 && page <= pagination.value.pages) {
    pagination.value.page = page
    if (activeTab.value === 'entrate') loadEntrate()
    else if (activeTab.value === 'uscite') loadUscite()
    else loadRegistrati()
  }
}

// Watch tab changes
watch(activeTab, () => {
  loadData()
})

// Match Modal
const openMatchModal = async (mov: any, type: 'entrata' | 'uscita') => {
  selectedMovimento.value = mov
  matchType.value = type
  showMatchModal.value = true
  searchMatch.value = mov.counterparty || ''
  await searchDocumenti()
}

const closeMatchModal = () => {
  showMatchModal.value = false
  selectedMovimento.value = null
  possibleMatches.value = []
  searchMatch.value = ''
}

const debounceSearch = () => {
  clearTimeout(searchTimeout)
  searchTimeout = setTimeout(() => searchDocumenti(), 300)
}

const searchDocumenti = async () => {
  if (!selectedMovimento.value) return

  loadingMatches.value = true
  try {
    const endpoint = matchType.value === 'entrata'
      ? '/bank/conciliazione/match-fatture'
      : '/bank/conciliazione/match-costi'

    const res = await fetchApi<any>(endpoint, {
      method: 'POST',
      body: {
        movimento_id: selectedMovimento.value.id,
        importo: Math.abs(selectedMovimento.value.amount),
        search: searchMatch.value
      }
    })

    if (res.success) {
      possibleMatches.value = res.data || []
    }
  } catch (e) {
    console.error('Errore ricerca match:', e)
  } finally {
    loadingMatches.value = false
  }
}

const confermaMatch = async (match: any) => {
  if (!selectedMovimento.value) return

  try {
    const res = await fetchApi<any>('/bank/conciliazione/collega', {
      method: 'POST',
      body: {
        movimento_id: selectedMovimento.value.id,
        tipo: matchType.value,
        documento_id: match.id
      }
    })

    if (res.success) {
      closeMatchModal()
      await loadData()
    } else {
      alert(res.message || 'Errore durante collegamento')
    }
  } catch (e: any) {
    alert(e.message || 'Errore durante collegamento')
  }
}

const rimuoviConciliazione = async (mov: any) => {
  if (!confirm('Rimuovere la conciliazione?')) return

  try {
    const res = await fetchApi<any>(`/bank/conciliazione/${mov.id}/scollega`, {
      method: 'DELETE'
    })

    if (res.success) {
      await loadData()
    } else {
      alert(res.message || 'Errore durante rimozione')
    }
  } catch (e: any) {
    alert(e.message || 'Errore durante rimozione')
  }
}

// Auto Conciliazione
const runAutoConciliazione = async () => {
  if (!confirm('Avviare la conciliazione automatica? I movimenti con alta corrispondenza verranno collegati automaticamente.')) return

  autoProcessing.value = true
  try {
    const res = await fetchApi<any>('/bank/conciliazione/auto', {
      method: 'POST',
      body: {
        bank_account_id: filters.bank_account_id || null,
        data_dal: filters.data_dal,
        data_al: filters.data_al,
        min_confidence: 85
      }
    })

    if (res.success) {
      alert(`Conciliazione completata:\n- Entrate: ${res.data.entrate_collegate}\n- Uscite: ${res.data.uscite_collegate}`)
      await loadData()
    } else {
      alert(res.message || 'Errore durante conciliazione')
    }
  } catch (e: any) {
    alert(e.message || 'Errore durante conciliazione')
  } finally {
    autoProcessing.value = false
  }
}

// Registrazione Prima Nota
const registraSingolo = async (mov: any) => {
  try {
    const res = await fetchApi<any>('/bank/conciliazione/registra', {
      method: 'POST',
      body: { movimento_ids: [mov.id] }
    })

    if (res.success) {
      await loadData()
    } else {
      alert(res.message || 'Errore durante registrazione')
    }
  } catch (e: any) {
    alert(e.message || 'Errore durante registrazione')
  }
}

const registraSelezionati = async () => {
  if (selectedItems.value.length === 0) return
  if (!confirm(`Registrare ${selectedItems.value.length} movimenti in Prima Nota?`)) return

  try {
    const res = await fetchApi<any>('/bank/conciliazione/registra', {
      method: 'POST',
      body: { movimento_ids: selectedItems.value }
    })

    if (res.success) {
      alert(`Registrati ${res.data.registrati} movimenti in Prima Nota`)
      selectedItems.value = []
      await loadData()
    } else {
      alert(res.message || 'Errore durante registrazione')
    }
  } catch (e: any) {
    alert(e.message || 'Errore durante registrazione')
  }
}

// Nuovo Costo
const creaNuovoCosto = (mov: any) => {
  selectedMovimento.value = mov
  nuovoCosto.data = mov.transaction_date
  nuovoCosto.intestatario = mov.counterparty || ''
  nuovoCosto.valore = Math.abs(mov.amount)
  nuovoCosto.tipo_pagamento = 'Bonifico'
  nuovoCosto.riferimento = ''
  nuovoCosto.note = mov.description || ''
  nuovoCosto.ammortamento = false
  nuovoCosto.richiede_autofattura = false
  showNuovoCostoModal.value = true
}

const salvaNuovoCosto = async () => {
  if (!nuovoCosto.intestatario || !nuovoCosto.valore) {
    alert('Compila i campi obbligatori')
    return
  }

  try {
    const res = await fetchApi<any>('/bank/conciliazione/nuovo-costo', {
      method: 'POST',
      body: {
        movimento_id: selectedMovimento.value?.id,
        ...nuovoCosto
      }
    })

    if (res.success) {
      showNuovoCostoModal.value = false
      await loadData()
    } else {
      alert(res.message || 'Errore durante salvataggio')
    }
  } catch (e: any) {
    alert(e.message || 'Errore durante salvataggio')
  }
}

// Init
onMounted(async () => {
  if (!centroStore.centroCorrente && centroStore.centri.length === 0) {
    await centroStore.fetchCentri()
  }
  await loadAccounts()
  await loadData()
})
</script>

<style scoped>
.card { @apply bg-white rounded-lg shadow; }
.card-header { @apply px-4 py-3 border-b border-gray-200; }
.card-title { @apply text-lg font-semibold text-gray-800 flex items-center; }
.card-content { @apply p-4; }
.input-field { @apply px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500; }
.btn-primary { @apply bg-cyan-600 text-white px-4 py-2 rounded-lg hover:bg-cyan-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center; }
.btn-primary-sm { @apply bg-cyan-600 text-white px-3 py-1.5 rounded-lg hover:bg-cyan-700 text-sm flex items-center; }
.btn-secondary { @apply bg-gray-200 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-300 disabled:opacity-50 flex items-center; }
.btn-secondary-sm { @apply bg-gray-200 text-gray-700 px-3 py-1.5 rounded-lg hover:bg-gray-300 text-sm flex items-center; }
.btn-success-sm { @apply bg-green-600 text-white px-3 py-1.5 rounded-lg hover:bg-green-700 text-sm flex items-center; }
.btn-danger-sm { @apply bg-red-100 text-red-600 px-3 py-1.5 rounded-lg hover:bg-red-200 text-sm; }
.btn-page { @apply px-3 py-1 border rounded hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed; }

.tab-btn { @apply px-6 py-3 font-medium text-sm focus:outline-none transition-colors flex items-center; }
.tab-active { @apply border-b-2 border-cyan-600 text-cyan-600; }
.tab-inactive { @apply text-gray-500 hover:text-gray-700 hover:border-b-2 hover:border-gray-300; }
</style>
