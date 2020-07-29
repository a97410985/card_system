<template>
  <v-menu
    v-model="menu"
    :close-on-content-click="false"
    offset-x
    :open-on-hover="true"
  >
    <template v-slot:activator="{ on, attrs }">
      <v-btn color="indigo" dark v-bind="attrs" v-on="on" icon small>
        <v-icon>description</v-icon>
      </v-btn>
    </template>
    <v-card>
      <v-card-title>說明</v-card-title>
      <v-card-text>
        <v-textarea counter="50" outlined></v-textarea>
      </v-card-text>
    </v-card>
  </v-menu>
</template>

<script lang="ts">
import Vue from "vue";
export default Vue.extend({
  name: "HoverEditableDescription",
  data() {
    return {
      menu: false,
    };
  },
});
</script>
