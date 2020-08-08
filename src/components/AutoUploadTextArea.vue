<template>
  <v-textarea v-model="textContent" outlined @input="updateText"></v-textarea>
</template>

<script lang="ts">
import Vue from "vue";
import axios from "axios";
import { updateCardSingleField } from "../elasticSearchHelper";
import { cardTypes, genralCardInterface } from "../card";

export default Vue.extend({
  name: "AutoUploadTextArea",
  data() {
    return {
      idArr: [] as number[],
      textContent: this.cardData[this.textField] as string
    };
  },
  // updataObj是要傳部分要更新的資料{doc:{xxx:""}} ; textField是要更新欄位的名稱
  props: ["cardData", "updateObj", "textField"],
  methods: {
    updateText() {
      this.idArr.forEach(id => {
        clearTimeout(id);
      });
      this.idArr = [];
      const id = setTimeout(() => {
        // 更新資料到elasticSearch
        this.updateObj.doc[this.textField] = this.textContent;
        updateCardSingleField(
          this.cardData.type,
          this.cardData.id,
          this.updateObj
        );

        console.log(this.textContent);
        this.idArr.forEach(id => {
          clearTimeout(id);
        });
        this.idArr = [];
      }, 3000);
      this.idArr.push(id);
    }
  }
});
</script>

<style scoped></style>
