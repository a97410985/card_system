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


export default Vue.extend({
  name: "PureTextCard",

  props: ["textContent", "addCardTF", "index"],

  data: () => ({ editTF: true }),

  methods: {
    changeEditMode() {
      this.editTF = !this.editTF;
    },
    addToLeft() {
      console.log("haha");
      this.$emit("addCard", this.index, 0);
    },
    addToRight() {
      console.log("haha");
      this.$emit("addCard", this.index, 1);
    },
  },
});
</script>
