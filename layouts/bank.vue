<template>
  <v-app dark>
    <v-main>
      <v-container
        class="fill-height"
        fluid
      >
        <nuxt />
      </v-container>
    </v-main>
  </v-app>
</template>

<script>
  export default {
    props: {
      source: String,
    },
  }
</script>
