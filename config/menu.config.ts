/**
 * Menu Configuration - Controllo di Gestione
 *
 * Struttura dichiarativa del menu con solo le sezioni
 * Contabilità e Finanziario.
 */

export interface MenuItem {
  label: string
  route?: string
  icon?: string
  permission?: string
  children?: MenuItem[]
  section?: string
}

export const menuConfig: MenuItem[] = [
  // DASHBOARD
  {
    label: 'Dashboard',
    icon: 'home',
    children: [
      { label: 'Controllo di Gestione', route: '/dashboard', icon: 'tachometer-alt' },
      { label: 'Ecosistema Integrato', route: '/dashboard/ecosystem', icon: 'network-wired' },
      { label: 'Revenue & Crescita', route: '/dashboard/revenue', icon: 'coins' },
      { label: 'Allerta Crisi', route: '/dashboard/allerta-crisi', icon: 'exclamation-triangle' },
      { label: 'Benchmark', route: '/dashboard/benchmark', icon: 'chart-bar' },
      { label: 'Piano Industriale', route: '/dashboard/piano-industriale', icon: 'rocket' },
      { label: 'Report & Export', route: '/dashboard/export', icon: 'file-download' },
      { label: 'Analisi Flusso Pazienti', route: '/analisi-flussi', icon: 'filter' }
    ]
  },

  // CONTABILITÀ
  {
    label: 'Contabilità',
    icon: 'calculator',
    children: [
      { label: 'Dashboard Automatica', route: '/contabilita', icon: 'robot' },
      { label: 'Bank Control', route: '/bank', icon: 'university' },
      { label: 'Conti Bancari', route: '/bank/conti' },
      { label: 'Import Movimenti', route: '/bank/import' },
      { label: 'Conciliazione', route: '/bank/conciliazione' },
      { label: 'Regole Automatiche', route: '/contabilita/regole', icon: 'cogs' },
      { label: 'Prima Nota', route: '/prima-nota', icon: 'book' },
      { label: 'Ricavi', route: '/fatture' },
      { label: 'Costi', route: '/memo-economici' },
      { label: 'Autofatture', route: '/autofatture' },
      { label: 'Report Contabile', route: '/contabilita/report', icon: 'chart-bar' }
    ]
  },

  // FINANZIARIO
  {
    label: 'Finanziario',
    icon: 'chart-line',
    children: [
      { label: 'Riclassificazione Int', route: '/riclassificazione-bilancio/interna' },
      { label: 'Bilancio Fatturato', route: '/riclassificazione-bilancio/fatturato' },
      { label: 'Bilancio Produzione', route: '/riclassificazione-bilancio/produzione' },
      { label: 'Registro Economico', route: '/registro-economico' },
      { label: 'Registro Contabile', route: '/registro-contabile' },
      { label: 'Registro Fiscale', route: '/registro-fiscale' },
      { label: 'Analisi Fatturato', route: '/analisi-fatturato' },
      { label: 'BEP', route: '/bep' },
      { label: 'Riclassificazione Comm', route: '/riclassificazione-bilancio/commercialista' },
      { label: 'Costi Variabili Indiretti Previsionali', route: '/costi/variabili-indiretti' },
      { label: 'Costi Variabili Gestionali Previsionali', route: '/costi/variabili-gestionali' },
      { label: 'Costi Materiali Previsionali', route: '/costi/materiali-previsionali' },
      { label: 'Costi Fissi Previsionali', route: '/costi/fissi' },
      { label: 'Costi Totali Previsionali', route: '/costi/totali' },
      { label: 'Monitor Finanziario', route: '/monitoraggio/finanziario' },
      { label: 'Gestione prezzi', route: '/prestazioni/gestione-prezzi' }
    ]
  }
]

export const routePermissions: Record<string, string> = {}
