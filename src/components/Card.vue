<template>
  <v-card :style="cardStyle" class="mx-auto">
    <v-card-actions v-if="addCardTF">
      <v-btn @click="addToLeft" color="primary">
        加到左邊
      </v-btn>
      <v-spacer></v-spacer>
      <v-btn @click="addToRight" color="primary">
        加到右邊
      </v-btn>
    </v-card-actions>
    <v-card-actions>
      <v-btn @click="zoomIn" icon small>
        <v-icon>zoom_in</v-icon>
      </v-btn>
      <v-btn @click="zoomOut" icon small>
        <v-icon>zoom_out</v-icon>
      </v-btn>
    </v-card-actions>
    <slot></slot>
  </v-card>
</template>

<script lang="ts">
import Vue from "vue";
export default Vue.extend({
  props: ["cardData", "addCardTF", "index"],
  data: () => ({
    cardStyle: {
      width: "250px",
      height: "auto",
    },
  }),

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
    zoomIn() {
      this.cardStyle.width = (this.$el.clientWidth + 100).toString() + "px";
    },
    zoomOut() {
      if (this.$el.clientWidth > 200) {
        this.cardStyle.width = (this.$el.clientWidth - 100).toString() + "px";
      }
    },
  },
});
</script>
<style scoped>
@import "~material-icons/iconfont/material-icons.css";
</style>
