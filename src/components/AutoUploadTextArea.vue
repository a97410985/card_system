<template>
  <v-textarea v-model="textContent" outlined @input="updateText"></v-textarea>
</template>

<script lang="ts">
import Vue from "vue";
import axios from "axios";

export default Vue.extend({
  name: "AutoUploadTextArea",
  data() {
    return {
      idArr: [] as number[],
      textContent: this.cardData.description as string,
    };
  },
  props: ["cardData", "updateObj"],
  methods: {
    updateText() {
      this.idArr.forEach((id) => {
        clearTimeout(id);
      });
      this.idArr = [];
      const id = setTimeout(() => {
        // 更新資料到elasticSearch
        this.updateObj.doc[
          Object.keys(this.updateObj.doc)[0]
        ] = this.textContent;
        axios({
          method: "post",
          baseURL: "/api",
          url: `/${this.cardData.type.toLowerCase()}/_doc/${
            this.cardData.id
          }/_update`,
          data: this.updateObj,
          responseType: "json",
        })
          .then((result) => {
            console.log(result);
          })
          .catch((err) => {
            console.log(err);
          });

        console.log(this.textContent);
        this.idArr.forEach((id) => {
          clearTimeout(id);
        });
        this.idArr = [];
      }, 3000);
      this.idArr.push(id);
    },
  },
});
</script>

<style scoped></style>
