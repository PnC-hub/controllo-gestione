<template>
  <div>
    <!-- Header -->
    <div class="mb-6">
      <div class="flex items-start">
        <PageHeader
          title="REGOLE AUTOMATICHE"
          subtitle="Configura regole per categorizzazione e conciliazione automatica"
          :related-pages="[
            { label: 'Contabilità', route: '/contabilita', icon: 'fa-calculator' },
            { label: 'Conciliazione', route: '/bank/conciliazione', icon: 'fa-balance-scale' }
          ]"
        />
        <PageInfoButton
          title="Regole Automatiche"
          description="Qui puoi creare e gestire le regole che automatizzano la contabilità. Le regole permettono di categorizzare automaticamente i movimenti bancari e abbinarli alle fatture senza intervento manuale."
          :features="[
            'Regole di Categorizzazione: assegna automaticamente categoria e sottocategoria ai movimenti',
            'Regole di Conciliazione: abbina automaticamente movimenti bancari a fatture/memo',
            'Fornitori Noti: riconosci e categorizza i pagamenti ricorrenti (utenze, affitti, ecc.)',
            'Suggerimenti AI: il sistema propone nuove regole basate sui pattern rilevati',
            'Attiva/disattiva regole singole per un controllo granulare'
          ]"
        />
      </div>
    </div>

    <!-- Stats Regole -->
    <div class="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
      <div class="bg-purple-50 rounded-lg p-4 text-center">
        <div class="text-2xl font-bold text-purple-700">{{ stats.totale_regole }}</div>
        <div class="text-sm text-purple-600">Regole Totali</div>
      </div>
      <div class="bg-green-50 rounded-lg p-4 text-center">
        <div class="text-2xl font-bold text-green-700">{{ stats.regole_attive }}</div>
        <div class="text-sm text-green-600">Attive</div>
      </div>
      <div class="bg-cyan-50 rounded-lg p-4 text-center">
        <div class="text-2xl font-bold text-cyan-700">{{ stats.match_totali }}</div>
        <div class="text-sm text-cyan-600">Match Totali</div>
      </div>
      <div class="bg-amber-50 rounded-lg p-4 text-center">
        <div class="text-2xl font-bold text-amber-700">{{ stats.match_mese }}</div>
        <div class="text-sm text-amber-600">Match Questo Mese</div>
      </div>
    </div>

    <!-- Tabs -->
    <div class="card mb-6">
      <div class="border-b border-gray-200">
        <nav class="flex -mb-px">
          <button
            @click="activeTab = 'categorizzazione'"
            class="tab-btn"
            :class="activeTab === 'categorizzazione' ? 'tab-active' : 'tab-inactive'"
          >
            <i class="fas fa-tags mr-2"></i>
            Categorizzazione
            <span class="ml-2 px-2 py-0.5 rounded-full text-xs" :class="activeTab === 'categorizzazione' ? 'bg-cyan-100 text-cyan-700' : 'bg-gray-100 text-gray-600'">
              {{ regoleCategorizzazione.length }}
            </span>
          </button>
          <button
            @click="activeTab = 'conciliazione'"
            class="tab-btn"
            :class="activeTab === 'conciliazione' ? 'tab-active' : 'tab-inactive'"
          >
            <i class="fas fa-link mr-2"></i>
            Conciliazione
            <span class="ml-2 px-2 py-0.5 rounded-full text-xs" :class="activeTab === 'conciliazione' ? 'bg-cyan-100 text-cyan-700' : 'bg-gray-100 text-gray-600'">
              {{ regoleConciliazione.length }}
            </span>
          </button>
          <button
            @click="activeTab = 'fornitori'"
            class="tab-btn"
            :class="activeTab === 'fornitori' ? 'tab-active' : 'tab-inactive'"
          >
            <i class="fas fa-building mr-2"></i>
            Fornitori Noti
            <span class="ml-2 px-2 py-0.5 rounded-full text-xs" :class="activeTab === 'fornitori' ? 'bg-cyan-100 text-cyan-700' : 'bg-gray-100 text-gray-600'">
              {{ fornitoriNoti.length }}
            </span>
          </button>
        </nav>
      </div>

      <div class="card-content">
        <!-- Azioni -->
        <div class="flex justify-between items-center mb-6">
          <div class="flex items-center space-x-3">
            <input
              type="text"
              v-model="searchQuery"
              placeholder="Cerca regola..."
              class="input-field w-64"
            />
          </div>
          <button @click="openNuovaRegola" class="btn-primary">
            <i class="fas fa-plus mr-2"></i>
            Nuova Regola
          </button>
        </div>

        <!-- Loading -->
        <div v-if="loading" class="text-center py-12">
          <i class="fas fa-spinner fa-spin text-4xl text-cyan-600"></i>
        </div>

        <!-- Tab Categorizzazione -->
        <div v-else-if="activeTab === 'categorizzazione'">
          <div v-if="filteredRegoleCategorizzazione.length === 0" class="text-center py-12 text-gray-500">
            <i class="fas fa-tags text-5xl mb-4"></i>
            <p>Nessuna regola di categorizzazione</p>
            <p class="text-sm mt-2">Crea una regola per categorizzare automaticamente i movimenti</p>
          </div>

          <div v-else class="space-y-3">
            <div
              v-for="regola in filteredRegoleCategorizzazione"
              :key="regola.id"
              class="border rounded-lg p-4 hover:shadow-md transition-shadow"
              :class="regola.attiva ? 'bg-white' : 'bg-gray-50 opacity-60'"
            >
              <div class="flex items-start justify-between">
                <div class="flex-1">
                  <div class="flex items-center space-x-3 mb-2">
                    <span class="font-medium text-gray-800">{{ regola.nome }}</span>
                    <span
                      class="px-2 py-0.5 rounded text-xs"
                      :class="regola.attiva ? 'bg-green-100 text-green-700' : 'bg-gray-200 text-gray-600'"
                    >
                      {{ regola.attiva ? 'Attiva' : 'Disattivata' }}
                    </span>
                    <span class="px-2 py-0.5 bg-purple-100 text-purple-700 rounded text-xs">
                      {{ regola.match_count }} match
                    </span>
                  </div>

                  <div class="text-sm text-gray-600 space-y-1">
                    <p>
                      <span class="font-medium">Se:</span>
                      <span class="text-gray-500">{{ formatCondizione(regola) }}</span>
                    </p>
                    <p>
                      <span class="font-medium">Allora:</span>
                      <span class="px-2 py-0.5 rounded text-xs ml-1" :style="{ backgroundColor: regola.categoria_colore + '20', color: regola.categoria_colore }">
                        {{ regola.categoria_nome }}
                      </span>
                    </p>
                  </div>
                </div>

                <div class="flex items-center space-x-2">
                  <button @click="toggleRegola(regola)" class="p-2 rounded-lg hover:bg-gray-100" :title="regola.attiva ? 'Disattiva' : 'Attiva'">
                    <i :class="regola.attiva ? 'fas fa-toggle-on text-green-500' : 'fas fa-toggle-off text-gray-400'" class="text-xl"></i>
                  </button>
                  <button @click="editRegola(regola)" class="p-2 rounded-lg hover:bg-gray-100" title="Modifica">
                    <i class="fas fa-edit text-gray-500"></i>
                  </button>
                  <button @click="deleteRegola(regola)" class="p-2 rounded-lg hover:bg-red-100" title="Elimina">
                    <i class="fas fa-trash text-red-500"></i>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Tab Conciliazione -->
        <div v-else-if="activeTab === 'conciliazione'">
          <div v-if="filteredRegoleConciliazione.length === 0" class="text-center py-12 text-gray-500">
            <i class="fas fa-link text-5xl mb-4"></i>
            <p>Nessuna regola di conciliazione</p>
            <p class="text-sm mt-2">Crea una regola per conciliare automaticamente i movimenti</p>
          </div>

          <div v-else class="space-y-3">
            <div
              v-for="regola in filteredRegoleConciliazione"
              :key="regola.id"
              class="border rounded-lg p-4 hover:shadow-md transition-shadow"
              :class="regola.attiva ? 'bg-white' : 'bg-gray-50 opacity-60'"
            >
              <div class="flex items-start justify-between">
                <div class="flex-1">
                  <div class="flex items-center space-x-3 mb-2">
                    <span class="font-medium text-gray-800">{{ regola.nome }}</span>
                    <span
                      class="px-2 py-0.5 rounded text-xs"
                      :class="regola.attiva ? 'bg-green-100 text-green-700' : 'bg-gray-200 text-gray-600'"
                    >
                      {{ regola.attiva ? 'Attiva' : 'Disattivata' }}
                    </span>
                    <span class="px-2 py-0.5 bg-cyan-100 text-cyan-700 rounded text-xs">
                      {{ regola.match_count }} match
                    </span>
                  </div>

                  <div class="text-sm text-gray-600 space-y-1">
                    <p>
                      <span class="font-medium">Se:</span>
                      <span class="text-gray-500">{{ formatCondizione(regola) }}</span>
                    </p>
                    <p>
                      <span class="font-medium">Collega a:</span>
                      <span class="text-gray-500 ml-1">{{ regola.tipo_documento === 'fattura' ? 'Fattura' : 'Costo' }} di {{ regola.fornitore_cliente || 'qualsiasi' }}</span>
                    </p>
                  </div>
                </div>

                <div class="flex items-center space-x-2">
                  <button @click="toggleRegola(regola)" class="p-2 rounded-lg hover:bg-gray-100" :title="regola.attiva ? 'Disattiva' : 'Attiva'">
                    <i :class="regola.attiva ? 'fas fa-toggle-on text-green-500' : 'fas fa-toggle-off text-gray-400'" class="text-xl"></i>
                  </button>
                  <button @click="editRegola(regola)" class="p-2 rounded-lg hover:bg-gray-100" title="Modifica">
                    <i class="fas fa-edit text-gray-500"></i>
                  </button>
                  <button @click="deleteRegola(regola)" class="p-2 rounded-lg hover:bg-red-100" title="Elimina">
                    <i class="fas fa-trash text-red-500"></i>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Tab Fornitori Noti -->
        <div v-else-if="activeTab === 'fornitori'">
          <div class="mb-4 p-4 bg-blue-50 rounded-lg">
            <div class="flex items-start">
              <i class="fas fa-info-circle text-blue-500 mt-0.5 mr-3"></i>
              <div class="text-sm text-blue-700">
                <p>I fornitori noti vengono riconosciuti automaticamente nei movimenti bancari.</p>
                <p class="mt-1">Quando un movimento contiene il nome di un fornitore noto, viene automaticamente associato alla categoria corretta.</p>
              </div>
            </div>
          </div>

          <div v-if="filteredFornitori.length === 0" class="text-center py-12 text-gray-500">
            <i class="fas fa-building text-5xl mb-4"></i>
            <p>Nessun fornitore registrato</p>
          </div>

          <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div
              v-for="fornitore in filteredFornitori"
              :key="fornitore.id"
              class="border rounded-lg p-4 hover:shadow-md transition-shadow bg-white"
            >
              <div class="flex items-start justify-between">
                <div>
                  <h4 class="font-medium text-gray-800">{{ fornitore.nome }}</h4>
                  <p class="text-sm text-gray-500 mt-1">{{ fornitore.partita_iva || 'P.IVA non specificata' }}</p>
                  <div class="flex items-center mt-2 space-x-2">
                    <span
                      class="px-2 py-0.5 rounded text-xs"
                      :style="{ backgroundColor: fornitore.categoria_colore + '20', color: fornitore.categoria_colore }"
                    >
                      {{ fornitore.categoria_nome }}
                    </span>
                    <span class="text-xs text-gray-400">{{ fornitore.match_count }} match</span>
                  </div>
                  <div v-if="fornitore.keywords?.length" class="mt-2 flex flex-wrap gap-1">
                    <span
                      v-for="kw in fornitore.keywords.slice(0, 3)"
                      :key="kw"
                      class="px-1.5 py-0.5 bg-gray-100 text-gray-600 rounded text-xs"
                    >
                      {{ kw }}
                    </span>
                    <span v-if="fornitore.keywords.length > 3" class="text-xs text-gray-400">
                      +{{ fornitore.keywords.length - 3 }}
                    </span>
                  </div>
                </div>

                <div class="flex items-center space-x-1">
                  <button @click="editFornitore(fornitore)" class="p-2 rounded-lg hover:bg-gray-100" title="Modifica">
                    <i class="fas fa-edit text-gray-500"></i>
                  </button>
                  <button @click="deleteFornitore(fornitore)" class="p-2 rounded-lg hover:bg-red-100" title="Elimina">
                    <i class="fas fa-trash text-red-500"></i>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Regole Suggerite -->
    <div v-if="regoleSuggerite.length > 0" class="card">
      <div class="card-header">
        <h3 class="card-title">
          <i class="fas fa-lightbulb mr-2 text-yellow-500"></i>
          Regole Suggerite
        </h3>
      </div>
      <div class="card-content">
        <p class="text-sm text-gray-500 mb-4">
          Basandosi sui movimenti recenti, il sistema suggerisce queste nuove regole:
        </p>
        <div class="space-y-3">
          <div
            v-for="suggerita in regoleSuggerite"
            :key="suggerita.id"
            class="border border-dashed border-yellow-300 rounded-lg p-4 bg-yellow-50"
          >
            <div class="flex items-center justify-between">
              <div>
                <p class="font-medium text-gray-800">{{ suggerita.nome_suggerito }}</p>
                <p class="text-sm text-gray-600 mt-1">
                  Pattern: <code class="bg-white px-2 py-0.5 rounded text-xs">{{ suggerita.pattern }}</code>
                  → {{ suggerita.categoria_suggerita }}
                </p>
                <p class="text-xs text-gray-500 mt-1">
                  Trovato in {{ suggerita.occorrenze }} movimenti
                </p>
              </div>
              <div class="flex items-center space-x-2">
                <button @click="accettaSuggerimento(suggerita)" class="btn-primary-sm">
                  <i class="fas fa-check mr-1"></i> Accetta
                </button>
                <button @click="rifiutaSuggerimento(suggerita)" class="btn-secondary-sm">
                  <i class="fas fa-times mr-1"></i> Ignora
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal Nuova/Modifica Regola -->
    <div v-if="showRegolaModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div class="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[85vh] overflow-y-auto">
        <div class="px-6 py-4 border-b flex justify-between items-center sticky top-0 bg-white">
          <h3 class="text-lg font-semibold">
            <i class="fas fa-cog text-cyan-600 mr-2"></i>
            {{ editingRegola ? 'Modifica Regola' : 'Nuova Regola' }}
          </h3>
          <button @click="closeRegolaModal" class="text-gray-500 hover:text-gray-700">
            <i class="fas fa-times"></i>
          </button>
        </div>

        <div class="p-6">
          <form @submit.prevent="saveRegola" class="space-y-4">
            <!-- Tipo Regola -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Tipo Regola *</label>
              <select v-model="regolaForm.tipo" class="input-field w-full" required>
                <option value="categorizzazione">Categorizzazione</option>
                <option value="conciliazione">Conciliazione</option>
              </select>
            </div>

            <!-- Nome -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Nome Regola *</label>
              <input type="text" v-model="regolaForm.nome" class="input-field w-full" placeholder="es. Bollette Enel" required />
            </div>

            <!-- Condizioni -->
            <div class="p-4 bg-gray-50 rounded-lg">
              <h4 class="font-medium text-gray-800 mb-3">Condizioni (SE)</h4>

              <div class="space-y-3">
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1">Descrizione contiene</label>
                  <input type="text" v-model="regolaForm.descrizione_contiene" class="input-field w-full" placeholder="es. ENEL, ENERGIA" />
                  <p class="text-xs text-gray-500 mt-1">Separa più parole con virgola (OR)</p>
                </div>

                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1">Controparte contiene</label>
                  <input type="text" v-model="regolaForm.controparte_contiene" class="input-field w-full" placeholder="es. ENEL ENERGIA SPA" />
                </div>

                <div class="grid grid-cols-2 gap-4">
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">Importo minimo</label>
                    <input type="number" step="0.01" v-model="regolaForm.importo_min" class="input-field w-full" placeholder="0.00" />
                  </div>
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">Importo massimo</label>
                    <input type="number" step="0.01" v-model="regolaForm.importo_max" class="input-field w-full" placeholder="99999.99" />
                  </div>
                </div>

                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1">Tipo movimento</label>
                  <select v-model="regolaForm.tipo_movimento" class="input-field w-full">
                    <option value="">Qualsiasi</option>
                    <option value="credit">Entrata (credito)</option>
                    <option value="debit">Uscita (debito)</option>
                  </select>
                </div>
              </div>
            </div>

            <!-- Azioni Categorizzazione -->
            <div v-if="regolaForm.tipo === 'categorizzazione'" class="p-4 bg-purple-50 rounded-lg">
              <h4 class="font-medium text-gray-800 mb-3">Azione (ALLORA)</h4>

              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Assegna Categoria *</label>
                <select v-model="regolaForm.categoria_id" class="input-field w-full" required>
                  <option value="">Seleziona categoria...</option>
                  <option v-for="cat in categorie" :key="cat.id" :value="cat.id">{{ cat.nome }}</option>
                </select>
              </div>
            </div>

            <!-- Azioni Conciliazione -->
            <div v-if="regolaForm.tipo === 'conciliazione'" class="p-4 bg-cyan-50 rounded-lg">
              <h4 class="font-medium text-gray-800 mb-3">Azione (ALLORA)</h4>

              <div class="space-y-3">
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1">Tipo Documento *</label>
                  <select v-model="regolaForm.tipo_documento" class="input-field w-full" required>
                    <option value="fattura">Fattura Emessa (Entrata)</option>
                    <option value="costo">Fattura Ricevuta/Costo (Uscita)</option>
                  </select>
                </div>

                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1">Fornitore/Cliente specifico</label>
                  <input type="text" v-model="regolaForm.fornitore_cliente" class="input-field w-full" placeholder="Lascia vuoto per qualsiasi" />
                </div>

                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1">Tolleranza importo (%)</label>
                  <input type="number" v-model="regolaForm.tolleranza_importo" class="input-field w-full" placeholder="5" min="0" max="100" />
                  <p class="text-xs text-gray-500 mt-1">Permetti match con differenza fino al X%</p>
                </div>
              </div>
            </div>

            <!-- Priorità e Stato -->
            <div class="grid grid-cols-2 gap-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Priorità</label>
                <input type="number" v-model="regolaForm.priorita" class="input-field w-full" min="1" max="100" />
                <p class="text-xs text-gray-500 mt-1">Regole con priorità alta vengono valutate prima</p>
              </div>
              <div class="flex items-center pt-6">
                <label class="flex items-center cursor-pointer">
                  <input type="checkbox" v-model="regolaForm.attiva" class="w-4 h-4 text-cyan-600 rounded mr-2" />
                  <span class="text-sm text-gray-700">Regola attiva</span>
                </label>
              </div>
            </div>
          </form>
        </div>

        <div class="px-6 py-4 border-t bg-gray-50 flex justify-end space-x-3 sticky bottom-0">
          <button @click="closeRegolaModal" class="btn-secondary">Annulla</button>
          <button @click="saveRegola" class="btn-primary" :disabled="saving">
            <i :class="saving ? 'fas fa-spinner fa-spin' : 'fas fa-save'" class="mr-2"></i>
            Salva
          </button>
        </div>
      </div>
    </div>

    <!-- Modal Fornitore -->
    <div v-if="showFornitoreModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div class="bg-white rounded-lg shadow-xl max-w-lg w-full">
        <div class="px-6 py-4 border-b flex justify-between items-center">
          <h3 class="text-lg font-semibold">
            <i class="fas fa-building text-cyan-600 mr-2"></i>
            {{ editingFornitore ? 'Modifica Fornitore' : 'Nuovo Fornitore' }}
          </h3>
          <button @click="showFornitoreModal = false" class="text-gray-500 hover:text-gray-700">
            <i class="fas fa-times"></i>
          </button>
        </div>

        <div class="p-6">
          <form @submit.prevent="saveFornitore" class="space-y-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Nome Fornitore *</label>
              <input type="text" v-model="fornitoreForm.nome" class="input-field w-full" required />
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Partita IVA</label>
              <input type="text" v-model="fornitoreForm.partita_iva" class="input-field w-full" />
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Categoria *</label>
              <select v-model="fornitoreForm.categoria_id" class="input-field w-full" required>
                <option value="">Seleziona...</option>
                <option v-for="cat in categorie" :key="cat.id" :value="cat.id">{{ cat.nome }}</option>
              </select>
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Parole chiave (per riconoscimento)</label>
              <input type="text" v-model="fornitoreForm.keywords_str" class="input-field w-full" placeholder="ENEL, ENERGIA, E-DISTRIBUZIONE" />
              <p class="text-xs text-gray-500 mt-1">Separa con virgola. Usate per riconoscere il fornitore nei movimenti.</p>
            </div>
          </form>
        </div>

        <div class="px-6 py-4 border-t bg-gray-50 flex justify-end space-x-3">
          <button @click="showFornitoreModal = false" class="btn-secondary">Annulla</button>
          <button @click="saveFornitore" class="btn-primary" :disabled="saving">
            <i :class="saving ? 'fas fa-spinner fa-spin' : 'fas fa-save'" class="mr-2"></i>
            Salva
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
const saving = ref(false)
const activeTab = ref<'categorizzazione' | 'conciliazione' | 'fornitori'>('categorizzazione')
const searchQuery = ref('')

const stats = ref({
  totale_regole: 0,
  regole_attive: 0,
  match_totali: 0,
  match_mese: 0
})

const regoleCategorizzazione = ref<any[]>([])
const regoleConciliazione = ref<any[]>([])
const fornitoriNoti = ref<any[]>([])
const regoleSuggerite = ref<any[]>([])
const categorie = ref<any[]>([])

// Modal Regola
const showRegolaModal = ref(false)
const editingRegola = ref<any>(null)
const regolaForm = reactive({
  tipo: 'categorizzazione' as 'categorizzazione' | 'conciliazione',
  nome: '',
  descrizione_contiene: '',
  controparte_contiene: '',
  importo_min: null as number | null,
  importo_max: null as number | null,
  tipo_movimento: '',
  categoria_id: '',
  tipo_documento: 'fattura',
  fornitore_cliente: '',
  tolleranza_importo: 5,
  priorita: 50,
  attiva: true
})

// Modal Fornitore
const showFornitoreModal = ref(false)
const editingFornitore = ref<any>(null)
const fornitoreForm = reactive({
  nome: '',
  partita_iva: '',
  categoria_id: '',
  keywords_str: ''
})

// Computed
const filteredRegoleCategorizzazione = computed(() => {
  if (!searchQuery.value) return regoleCategorizzazione.value
  const q = searchQuery.value.toLowerCase()
  return regoleCategorizzazione.value.filter(r =>
    r.nome.toLowerCase().includes(q) ||
    r.descrizione_contiene?.toLowerCase().includes(q)
  )
})

const filteredRegoleConciliazione = computed(() => {
  if (!searchQuery.value) return regoleConciliazione.value
  const q = searchQuery.value.toLowerCase()
  return regoleConciliazione.value.filter(r =>
    r.nome.toLowerCase().includes(q) ||
    r.descrizione_contiene?.toLowerCase().includes(q)
  )
})

const filteredFornitori = computed(() => {
  if (!searchQuery.value) return fornitoriNoti.value
  const q = searchQuery.value.toLowerCase()
  return fornitoriNoti.value.filter(f =>
    f.nome.toLowerCase().includes(q) ||
    f.partita_iva?.toLowerCase().includes(q)
  )
})

// Utils
const formatCondizione = (regola: any) => {
  const parts = []
  if (regola.descrizione_contiene) parts.push(`descrizione contiene "${regola.descrizione_contiene}"`)
  if (regola.controparte_contiene) parts.push(`controparte contiene "${regola.controparte_contiene}"`)
  if (regola.importo_min) parts.push(`importo >= €${regola.importo_min}`)
  if (regola.importo_max) parts.push(`importo <= €${regola.importo_max}`)
  if (regola.tipo_movimento) parts.push(`tipo = ${regola.tipo_movimento === 'credit' ? 'entrata' : 'uscita'}`)
  return parts.length > 0 ? parts.join(' E ') : 'Nessuna condizione'
}

// API Calls
const loadData = async () => {
  loading.value = true
  try {
    // Load stats
    const statsRes = await fetchApi<any>('/bank/rules/stats')
    if (statsRes.success) {
      stats.value = statsRes.data || stats.value
    }

    // Load categorization rules
    const catRes = await fetchApi<any>('/bank/rules?type=categorizzazione')
    if (catRes.success) {
      regoleCategorizzazione.value = catRes.data || []
    }

    // Load reconciliation rules
    const concRes = await fetchApi<any>('/bank/rules?type=conciliazione')
    if (concRes.success) {
      regoleConciliazione.value = concRes.data || []
    }

    // Load known suppliers
    const fornRes = await fetchApi<any>('/bank/fornitori')
    if (fornRes.success) {
      fornitoriNoti.value = fornRes.data || []
    }

    // Load suggested rules
    const suggRes = await fetchApi<any>('/bank/rules/suggestions')
    if (suggRes.success) {
      regoleSuggerite.value = suggRes.data || []
    }

    // Load categories
    const categorieRes = await fetchApi<any>('/bank/categories')
    if (categorieRes.success) {
      categorie.value = categorieRes.data || []
    }
  } catch (e) {
    console.error('Errore caricamento dati:', e)
  } finally {
    loading.value = false
  }
}

// Regola CRUD
const openNuovaRegola = () => {
  editingRegola.value = null
  Object.assign(regolaForm, {
    tipo: activeTab.value === 'conciliazione' ? 'conciliazione' : 'categorizzazione',
    nome: '',
    descrizione_contiene: '',
    controparte_contiene: '',
    importo_min: null,
    importo_max: null,
    tipo_movimento: '',
    categoria_id: '',
    tipo_documento: 'fattura',
    fornitore_cliente: '',
    tolleranza_importo: 5,
    priorita: 50,
    attiva: true
  })
  showRegolaModal.value = true
}

const editRegola = (regola: any) => {
  editingRegola.value = regola
  Object.assign(regolaForm, {
    tipo: regola.tipo || 'categorizzazione',
    nome: regola.nome,
    descrizione_contiene: regola.descrizione_contiene || '',
    controparte_contiene: regola.controparte_contiene || '',
    importo_min: regola.importo_min,
    importo_max: regola.importo_max,
    tipo_movimento: regola.tipo_movimento || '',
    categoria_id: regola.categoria_id || '',
    tipo_documento: regola.tipo_documento || 'fattura',
    fornitore_cliente: regola.fornitore_cliente || '',
    tolleranza_importo: regola.tolleranza_importo || 5,
    priorita: regola.priorita || 50,
    attiva: regola.attiva
  })
  showRegolaModal.value = true
}

const closeRegolaModal = () => {
  showRegolaModal.value = false
  editingRegola.value = null
}

const saveRegola = async () => {
  if (!regolaForm.nome) {
    alert('Il nome è obbligatorio')
    return
  }

  saving.value = true
  try {
    const method = editingRegola.value ? 'PUT' : 'POST'
    const url = editingRegola.value ? `/bank/rules/${editingRegola.value.id}` : '/bank/rules'

    const res = await fetchApi<any>(url, {
      method,
      body: regolaForm
    })

    if (res.success) {
      closeRegolaModal()
      await loadData()
    } else {
      alert(res.message || 'Errore durante il salvataggio')
    }
  } catch (e: any) {
    alert(e.message || 'Errore durante il salvataggio')
  } finally {
    saving.value = false
  }
}

const toggleRegola = async (regola: any) => {
  try {
    await fetchApi<any>(`/bank/rules/${regola.id}/toggle`, { method: 'POST' })
    regola.attiva = !regola.attiva
  } catch (e) {
    console.error('Errore toggle regola:', e)
  }
}

const deleteRegola = async (regola: any) => {
  if (!confirm(`Eliminare la regola "${regola.nome}"?`)) return

  try {
    const res = await fetchApi<any>(`/bank/rules/${regola.id}`, { method: 'DELETE' })
    if (res.success) {
      await loadData()
    } else {
      alert(res.message || 'Errore durante eliminazione')
    }
  } catch (e: any) {
    alert(e.message || 'Errore durante eliminazione')
  }
}

// Fornitore CRUD
const editFornitore = (fornitore: any) => {
  editingFornitore.value = fornitore
  Object.assign(fornitoreForm, {
    nome: fornitore.nome,
    partita_iva: fornitore.partita_iva || '',
    categoria_id: fornitore.categoria_id || '',
    keywords_str: fornitore.keywords?.join(', ') || ''
  })
  showFornitoreModal.value = true
}

const saveFornitore = async () => {
  if (!fornitoreForm.nome) {
    alert('Il nome è obbligatorio')
    return
  }

  saving.value = true
  try {
    const method = editingFornitore.value ? 'PUT' : 'POST'
    const url = editingFornitore.value ? `/bank/fornitori/${editingFornitore.value.id}` : '/bank/fornitori'

    const res = await fetchApi<any>(url, {
      method,
      body: {
        ...fornitoreForm,
        keywords: fornitoreForm.keywords_str.split(',').map(k => k.trim()).filter(Boolean)
      }
    })

    if (res.success) {
      showFornitoreModal.value = false
      editingFornitore.value = null
      await loadData()
    } else {
      alert(res.message || 'Errore durante il salvataggio')
    }
  } catch (e: any) {
    alert(e.message || 'Errore durante il salvataggio')
  } finally {
    saving.value = false
  }
}

const deleteFornitore = async (fornitore: any) => {
  if (!confirm(`Eliminare il fornitore "${fornitore.nome}"?`)) return

  try {
    const res = await fetchApi<any>(`/bank/fornitori/${fornitore.id}`, { method: 'DELETE' })
    if (res.success) {
      await loadData()
    } else {
      alert(res.message || 'Errore durante eliminazione')
    }
  } catch (e: any) {
    alert(e.message || 'Errore durante eliminazione')
  }
}

// Suggerimenti
const accettaSuggerimento = async (suggerita: any) => {
  try {
    const res = await fetchApi<any>(`/bank/rules/suggestions/${suggerita.id}/accept`, { method: 'POST' })
    if (res.success) {
      await loadData()
    }
  } catch (e) {
    console.error('Errore accettazione suggerimento:', e)
  }
}

const rifiutaSuggerimento = async (suggerita: any) => {
  try {
    await fetchApi<any>(`/bank/rules/suggestions/${suggerita.id}/reject`, { method: 'POST' })
    regoleSuggerite.value = regoleSuggerite.value.filter(s => s.id !== suggerita.id)
  } catch (e) {
    console.error('Errore rifiuto suggerimento:', e)
  }
}

// Init
onMounted(async () => {
  if (!centroStore.centroCorrente && centroStore.centri.length === 0) {
    await centroStore.fetchCentri()
  }
  await loadData()
})
</script>

<style scoped>
.card { @apply bg-white rounded-lg shadow; }
.card-header { @apply px-4 py-3 border-b border-gray-200; }
.card-title { @apply text-lg font-semibold text-gray-800 flex items-center; }
.card-content { @apply p-4; }
.input-field { @apply px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500; }
.btn-primary { @apply bg-cyan-600 text-white px-4 py-2 rounded-lg hover:bg-cyan-700 disabled:opacity-50 flex items-center; }
.btn-primary-sm { @apply bg-cyan-600 text-white px-3 py-1.5 rounded-lg hover:bg-cyan-700 text-sm flex items-center; }
.btn-secondary { @apply bg-gray-200 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-300 flex items-center; }
.btn-secondary-sm { @apply bg-gray-200 text-gray-700 px-3 py-1.5 rounded-lg hover:bg-gray-300 text-sm flex items-center; }

.tab-btn { @apply px-6 py-3 font-medium text-sm focus:outline-none transition-colors flex items-center; }
.tab-active { @apply border-b-2 border-cyan-600 text-cyan-600; }
.tab-inactive { @apply text-gray-500 hover:text-gray-700 hover:border-b-2 hover:border-gray-300; }
</style>
