// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2024-04-03',
  devtools: { enabled: true },
  modules: ['@nuxt/ui'],
  typescript: {
    shim: false
  },
  runtimeConfig: {
    apiBaseUrl: process.env.API_BASE_URL || 'http://localhost:8080',
  },
})
