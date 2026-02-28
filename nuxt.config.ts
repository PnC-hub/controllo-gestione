export default defineNuxtConfig({
  devtools: { enabled: true },

  modules: [
    '@nuxtjs/tailwindcss',
    '@pinia/nuxt',
    '@nuxt/icon'
  ],

  ssr: false,

  css: [
    '@/assets/css/main.css',
    '@/assets/css/bi-main.css'
  ],

  app: {
    baseURL: '/',
    head: {
      title: 'Profitera - Controllo di Gestione Intelligente con BI',
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        { name: 'description', content: 'Profitera - La piattaforma SaaS completa per il controllo di gestione delle aziende italiane. Contabilità, finanza, Business Intelligence e analisi in un\'unica soluzione cloud.' },
        { name: 'theme-color', content: '#9333ea' },
      ],
      link: [
        { rel: 'stylesheet', href: 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css' }
      ]
    },
  },

  runtimeConfig: {
    openaiApiKey: process.env.OPENAI_API_KEY || '',
    public: {
      apiBase: process.env.NUXT_PUBLIC_API_BASE || 'https://api.geniusmile.com/api/v1',
      apiKey: process.env.NUXT_PUBLIC_API_KEY || 'sk_smiledoc_2025_xK9mP3nQ7rT2wY5v',
      appEnv: process.env.NUXT_PUBLIC_ENV || 'production',
    }
  },

  compatibilityDate: '2024-01-01'
})
