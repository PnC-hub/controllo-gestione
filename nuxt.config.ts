export default defineNuxtConfig({
  devtools: { enabled: true },

  modules: [
    '@nuxtjs/tailwindcss',
    '@pinia/nuxt'
  ],

  ssr: false,

  app: {
    baseURL: '/',
    head: {
      title: 'Controllo di Gestione - Geniusmile',
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        { name: 'description', content: 'Controllo di Gestione multi-azienda - Contabilità e Finanza' },
        { name: 'theme-color', content: '#0891b2' },
      ],
      link: [
        { rel: 'stylesheet', href: 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css' }
      ]
    },
  },

  runtimeConfig: {
    public: {
      apiBase: process.env.NUXT_PUBLIC_API_BASE || 'https://api.geniusmile.com/api/v1',
      apiKey: process.env.NUXT_PUBLIC_API_KEY || 'sk_smiledoc_2025_xK9mP3nQ7rT2wY5v',
      appEnv: process.env.NUXT_PUBLIC_ENV || 'production',
    }
  },

  compatibilityDate: '2024-01-01'
})
