<template>
  <card :cardData="cardData" :addCardTF="addCardTF" :index="index">
    <v-textarea
      :readonly="!editTF"
      :auto-grow="true"
      :outlined="true"
      style="margin: 10px 10px 0 10px "
      v-model="textContent"
      label="純文字敘述"
    ></v-textarea>
    <v-btn @click="changeEditMode" color="primary">{{
      editTF ? "修改完成" : "修改"
    }}</v-btn>
  </card>
</template>

<script lang="ts">
import Vue from "vue";
import axios from "axios";
import Card from "./Card.vue";

export default Vue.extend({
  name: "PureTextCard",

  components: { Card },
  props: ["cardData", "index", "addCardTF"],

  data() {
    return { textContent: this.cardData.text, editTF: true };
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
  },
});
</script>
