export interface BrandConfig {
  isProfitera: boolean
  isGeniusmile: boolean
  name: string
  tagline: string
  color: string
  target: string
  logo: string
  loginUrl: string
  contactEmail: string
  website: string
}

export function useBrand(): BrandConfig {
  const hostname = typeof window !== 'undefined' ? window.location.hostname : ''
  const isProfitera = hostname.includes('profitera')

  return {
    isProfitera,
    isGeniusmile: !isProfitera,
    name: isProfitera ? 'Profitera' : 'Controllo di Gestione',
    tagline: isProfitera ? 'I numeri della tua azienda, sempre sotto controllo' : 'Modulo contabilità e finanza per il tuo studio',
    color: isProfitera ? 'emerald' : 'cyan',
    target: isProfitera ? 'professionisti e PMI' : 'studi dentistici',
    logo: isProfitera ? 'fa-chart-trend-up' : 'fa-chart-pie',
    loginUrl: '/login',
    contactEmail: isProfitera ? 'info@profitera.it' : 'info@geniusmile.com',
    website: isProfitera ? 'profitera.it' : 'geniusmile.com',
  }
}
