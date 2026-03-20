import { defineStore } from 'pinia'

interface Entity {
  id: number
  name: string
  type: string
  vatNumber: string | null
  fiscalCode: string | null
}

export const useEntityStore = defineStore('entity', {
  state: () => ({
    entities: [] as Entity[],
    selectedEntityId: null as number | null,
    loading: false,
  }),

  getters: {
    selectedEntity(state): Entity | null {
      if (!state.selectedEntityId) return null
      return state.entities.find(e => e.id === state.selectedEntityId) ?? null
    },
    selectedEntityName(): string {
      return this.selectedEntity?.name ?? 'Tutte le aziende'
    },
  },

  actions: {
    async fetchEntities() {
      this.loading = true
      try {
        const data = await $fetch<Entity[]>('/api/kontabila/entities')
        this.entities = data
        // Ripristina selezione da localStorage
        if (import.meta.client) {
          const saved = localStorage.getItem('profitera_entity_id')
          if (saved) {
            const id = parseInt(saved)
            if (this.entities.find(e => e.id === id)) {
              this.selectedEntityId = id
            }
          }
        }
      } finally {
        this.loading = false
      }
    },

    selectEntity(id: number | null) {
      this.selectedEntityId = id
      if (import.meta.client) {
        if (id) {
          localStorage.setItem('profitera_entity_id', String(id))
        } else {
          localStorage.removeItem('profitera_entity_id')
        }
      }
    },
  },
})
