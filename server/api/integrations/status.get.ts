/**
 * Endpoint che restituisce lo status di tutti i sistemi integrati
 * Usato dalla dashboard ecosistema per mostrare status real-time
 */

export default defineEventHandler(async (event) => {
  try {
    // Check status sistemi (health check)
    const [kontabilaStatus, imperiumStatus] = await Promise.all([
      checkKontabilaStatus(),
      checkImperiumStatus()
    ])

    // Aggrega KPI da tutti i sistemi
    const kpiUnificati = await aggregateKPI()

    return {
      success: true,
      systems: {
        profitera: {
          online: true,
          aziende: 5, // TODO: Query real DB
          movimenti: 324,
          conciliazione: 87
        },
        kontabila: kontabilaStatus,
        imperium: imperiumStatus
      },
      kpi: kpiUnificati,
      sync: {
        kontabila: {
          last_sync: '2 minuti fa', // TODO: Da DB sync log
          status: 'ok'
        },
        imperium: {
          last_sync: '5 minuti fa',
          status: 'ok'
        }
      },
      timestamp: new Date().toISOString()
    }
  } catch (error: any) {
    console.error('[Status] Errore:', error)
    return {
      success: false,
      error: error.message || 'Errore nel recupero status'
    }
  }
})

async function checkKontabilaStatus() {
  try {
    // Real health check a Kontabila
    const kontabilaUrl = process.env.KONTABILA_API_URL || 'http://localhost:3001'
    const response = await $fetch<any>(`${kontabilaUrl}/api/health`, {
      timeout: 3000 // 3 secondi timeout
    }).catch(() => null)

    if (!response || !response.success) {
      throw new Error('Kontabila unreachable')
    }

    return {
      online: true,
      fatture: response.stats?.fatture || 45,
      autofatture: response.stats?.autofatture || 12,
      sync_ok: response.stats?.sync_ok || 156
    }
  } catch (e) {
    console.warn('[Status] Kontabila offline:', e)
    return {
      online: false,
      fatture: 0,
      autofatture: 0,
      sync_ok: 0
    }
  }
}

async function checkImperiumStatus() {
  try {
    // Real health check a Imperium
    const imperiumUrl = process.env.IMPERIUM_API_URL || 'http://localhost:3005'
    const response = await $fetch<any>(`${imperiumUrl}/api/health`, {
      timeout: 3000 // 3 secondi timeout
    }).catch(() => null)

    if (!response || !response.success) {
      throw new Error('Imperium unreachable')
    }

    return {
      online: true,
      patrimonio: response.stats?.patrimonio || 1250000,
      health_score: response.stats?.health_score || 78,
      status: response.stats?.status || 'stable',
      status_label: response.stats?.status_label || 'Stabile'
    }
  } catch (e) {
    console.warn('[Status] Imperium offline:', e)
    return {
      online: false,
      patrimonio: 0,
      health_score: 0,
      status: 'unknown',
      status_label: 'Sconosciuto'
    }
  }
}

async function aggregateKPI() {
  // TODO: Query DB per aggregare KPI da tutti i sistemi
  // - Fatturato da Kontabila
  // - Patrimonio da Imperium
  // - Costi da Profitera
  // - Calcolare margini e ROI

  return {
    fatturato_totale: 245000,
    fatturato_var: 12,
    liquidita: 145000,
    margine_percentuale: 32,
    roi: 18
  }
}
