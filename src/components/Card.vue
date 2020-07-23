<template>
  <v-card :style="cardStyle" class="mx-auto">
    <v-card-actions v-if="addCardTF">
      <v-btn icon @click="addToLeft" color="primary">
        <v-icon>keyboard_backspace</v-icon>
      </v-btn>
      <v-spacer></v-spacer>
      <v-btn icon @click="addToRight" color="primary">
        <v-icon>arrow_right_alt</v-icon>
      </v-btn>
    </v-card-actions>
    <v-card-actions>
      <v-btn @click="zoomIn" icon small>
        <v-icon>zoom_in</v-icon>
      </v-btn>
      <v-btn @click="zoomOut" icon small>
        <v-icon>zoom_out</v-icon>
      </v-btn>
      <v-btn icon small>
        <v-icon @click="deleteCard">delete</v-icon>
      </v-btn>
    </v-card-actions>
    <slot></slot>
  </v-card>
</template>

<script lang="ts">
import Vue from "vue";
import axios from "axios";

export default Vue.extend({
  props: ["cardData", "addCardTF", "index"],
  data() {
    return {
      cardStyle: {
        width: this.cardData.style.width + "px",
        height: "auto",
      },
    };
  },

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
    updateSize(width: number, height: number) {
      // 要update資料，partial updates to documents
      axios({
        method: "post",
        baseURL: "/api",
        url: `/${this.cardData.type.toLowerCase()}/_doc/${
          this.cardData.id
        }/_update`,
        data: {
          doc: {
            style: {
              width: width,
              height: height,
            },
          },
        },
        responseType: "json",
      })
        .then((result) => {
          console.log(result);
        })
        .catch((err) => {
          console.log(err);
        });
    },
    zoomIn() {
      const newWidth = this.$el.clientWidth + 100;
      this.cardStyle.width = newWidth.toString() + "px";
      this.updateSize(newWidth, 200);
    },
    zoomOut() {
      if (this.$el.clientWidth > 200) {
        const newWidth = this.$el.clientWidth - 100;
        this.cardStyle.width = (this.$el.clientWidth - 100).toString() + "px";
        this.updateSize(newWidth, 200);
      }
    },
    deleteCard() {
      // 會刪除elasticSearch中的這張卡的document
      axios({
        method: "delete",
        baseURL: "/api",
        url: `/${this.cardData.type.toLowerCase()}/_doc/${this.cardData.id}`,
        responseType: "json",
      })
        .then((result) => {
          console.log(result);
        })
        .catch((err) => {
          console.log(err);
        });
      let vm = this.$parent;

      while (vm) {
        vm.$emit("deleteCard", this.index);
        vm = vm.$parent;
      }
    },
  },
});
</script>
<style scoped>
@import "~material-icons/iconfont/material-icons.css";
</style>
