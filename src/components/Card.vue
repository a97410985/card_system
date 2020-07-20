<template>
  <v-card class="mx-auto">
    <v-card-actions v-if="addCardTF">
      <v-btn @click="addToLeft" color="primary">
        加到左邊
      </v-btn>
      <v-spacer></v-spacer>
      <v-btn @click="addToRight" color="primary">
        加到右邊
      </v-btn>
    </v-card-actions>
    <slot></slot>
  </v-card>
</template>

<script lang="ts">
import Vue from "vue";
export default Vue.extend({
  props: ["cardData", "addCardTF", "index"],

  methods: {
    addToLeft() {
      let vm = this.$parent;

      while (vm) {
        vm.$emit("addCard", this.index, 0);
        vm = vm.$parent;
      }
    },
    addToRight() {
      let vm = this.$parent;

      while (vm) {
        vm.$emit("addCard", this.index, 1);
        vm = vm.$parent;
      }
    },
  },
});
</script>
