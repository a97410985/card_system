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
    <v-card-text>
      <v-textarea
        v-bind:readonly="!editTF"
        :auto-grow="true"
        :outlined="true"
        v-model="textContent"
        label="純文字敘述"
      ></v-textarea>
    </v-card-text>
    <v-card-actions>
      <v-btn @click="changeEditMode" color="primary">{{
        editTF ? "修改完成" : "修改"
      }}</v-btn>
    </v-card-actions>
  </v-card>
</template>

<script lang="ts">
import Vue from "vue";
import axios from "axios";

export default Vue.extend({
  name: "PureTextCard",

  props: ["cardData", "addCardTF", "index"],

  data() {
    return { editTF: true, textContent: this.cardData.text };
  },

  methods: {
    changeEditMode() {
      if (this.editTF) {
        // 要update資料，partial updates to documents
        axios({
          method: "post",
          baseURL: "/api",
          url: `card_system/card/${this.cardData.id}/_update`,
          data: {
            doc: {
              text: this.textContent,
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
      }
      this.editTF = !this.editTF;
    },
    addToLeft() {
      this.$emit("addCard", this.index, 0);
    },
    addToRight() {
      this.$emit("addCard", this.index, 1);
    },
  },
});
</script>
