<template>
  <v-app>
    <v-app-bar app color="primary" dark> </v-app-bar>

    <v-main> </v-main>
  </v-app>
</template>

<script lang="ts">
import Vue from "vue";
import store from "./store";

export default Vue.extend({
  store,
  name: "App"
});
</script>
