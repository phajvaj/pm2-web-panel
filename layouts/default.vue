<template>
  <v-app dark>
    <v-app-bar
      fixed
      app
    >
      <v-btn
        icon
        @click="isDark()"
      >
        <v-icon>mdi-application</v-icon>
      </v-btn>
      <v-toolbar-title v-text="title" />
    </v-app-bar>
    <v-main>
      <v-container>
        <div v-if="$nuxt.isOffline">
          <v-row>
            <v-col>
              <img src="https://cdn.iconscout.com/icon/premium/png-512-thumb/website-down-496670.png" alt="Server Down">
            </v-col>
          </v-row>
        </div>
        <nuxt />
      </v-container>
    </v-main>
    <v-footer
      app
    >
      <span>&copy; {{ new Date().getFullYear() }} Power by. phingosoft.com</span>
    </v-footer>
  </v-app>
</template>

<script>
export default {
  data () {
    return {
      title: 'PM2 WEB PANEL'
    }
  },
  methods: {
    async isDark() {
      this.$vuetify.theme.dark = !this.$vuetify.theme.dark;
    }
  },
  /*mounted() {
    this.$nextTick(() => {
      this.$nuxt.$loading.start();
      setTimeout(() => this.$nuxt.$loading.finish(), 300)
    })
  }*/
}
</script>
