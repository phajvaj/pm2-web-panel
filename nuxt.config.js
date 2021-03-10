import colors from 'vuetify/es5/util/colors'

export default {
  cli: {
    badgeMessages: [
      'PM2 WEB PANEL @ 2021',
      'App power by. PhingoSoft.com',
    ]
  },
  // Global page headers: https://go.nuxtjs.dev/config-head
  head: {
    titleTemplate: '%s - PM2-WEB-PANEL',
    title: 'PM2-WEB-PANEL',
    htmlAttrs: {
      lang: 'en'
    },
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { name: 'generator', content: 'DoiSoft<phingosoft.com>' },
      { hid: 'description', name: 'description', content: '' }
    ],
    link: [
      { rel: 'icon', type: 'image/x-icon', href: process.env.APP_BASE_URI + 'favicon.ico' }
    ]
  },
  router: {
    base: process.env.APP_BASE_URI || '',
  },
  loading: {
    name: 'chasing-dots',
    color: '#ff5638',
    background: 'white',
    height: '6px'
  },
  toast: {
    position: 'top-right',
    duration: 2000
  },

  // Global CSS: https://go.nuxtjs.dev/config-css
  css: [
  ],

  // Plugins to run before rendering page: https://go.nuxtjs.dev/config-plugins
  plugins: [
  ],

  // Auto import components: https://go.nuxtjs.dev/config-components
  components: true,

  serverMiddleware: ['~/api/index.js'],

  // Modules for dev and build (recommended): https://go.nuxtjs.dev/config-modules
  buildModules: [
    // https://go.nuxtjs.dev/vuetify
    '@nuxtjs/vuetify',
  ],
  server: {
    host: process.env.APP_HOST || '0.0.0.0', // default: localhost
    port: process.env.APP_PORT || '3099' // default: 3080
  },

  // Modules: https://go.nuxtjs.dev/config-modules
  modules: [
    // https://go.nuxtjs.dev/axios
    'nuxt-sweetalert2',
    '@nuxtjs/toast',
    '@nuxtjs/axios',
    '@nuxtjs/auth'
  ],

  // Axios module configuration: https://go.nuxtjs.dev/config-axios
  //axios: { proxy: true, debug: true, prefix: '/api' },
  axios: {
    baseURL: process.env.APP_BASE_URI + 'api',
    credentials: true
  },
  auth: {
    strategies: {
      local: {
        endpoints: {
          login: { url: 'login', method: 'post', propertyName: 'token' },
          user: { url: 'me', method: 'get', propertyName: 'data' },
          logout: false
        }
      }
    },
    redirect: {
      login: '/login'
    }
  },

  // Vuetify module configuration: https://go.nuxtjs.dev/config-vuetify
  vuetify: {
    customVariables: ['~/assets/variables.scss'],
    theme: {
      dark: true,
      themes: {
        dark: {
          primary: colors.blue.darken2,
          accent: colors.grey.darken3,
          secondary: colors.amber.darken3,
          info: colors.teal.lighten1,
          warning: colors.amber.base,
          error: colors.deepOrange.accent4,
          success: colors.green.accent3
        }
      }
    }
  },

  // Build Configuration: https://go.nuxtjs.dev/config-build
  build: {
  }
}
