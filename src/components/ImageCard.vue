<template>
  <v-card> </v-card>
</template>

<script lang="ts">
import Vue from "vue";
export default Vue.extend({
  name: "ImageCard",

  props: ["cardData", "addCardTF", "index"],

  data() {
    return { editTF: true, textContent: this.cardData.text };
  },

  methods: {},
});
</script>

<style scoped></style>
