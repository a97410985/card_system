<template>
  <card :cardData="cardData" :addCardTF="addCardTF" :index="index">
    <div>
      <div>
        <div id="editor"></div>
      </div>
    </div>
  </card>
</template>

<script lang="ts">
import Vue from "vue";
import ace, { edit } from "ace-builds";
import "ace-builds/webpack-resolver";
import "ace-builds/src-noconflict/theme-twilight";
import "ace-builds/src-noconflict/mode-javascript";
import Card from "./Card.vue";
import { updateCardSingleField } from "../elasticSearchHelper";

export default Vue.extend({
  name: "CodeCard",
  components: { Card },
  props: ["cardData", "index", "addCardTF"],
  mounted() {
    const editor = ace.edit("editor");
    editor.setTheme("ace/theme/twilight");
    editor.getSession().setMode("ace/mode/javascript");
    editor.setValue(this.cardData.code);
    editor.on("input", () => {
      this.idArr.forEach((id) => {
        clearTimeout(id);
      });
      this.idArr = [];
      const id = setTimeout(() => {
        // 更新資料到elasticSearch
        const updateObj = { doc: { code: editor.getValue() } };
        updateCardSingleField(this.cardData.type, this.cardData.id, updateObj);

        console.log(editor.getValue());
        this.idArr.forEach((id) => {
          clearTimeout(id);
        });
        this.idArr = [];
      }, 3000);
      this.idArr.push(id);
    });
  },
  data() {
    return { idArr: [] as number[] };
  },
  methods: {},
});
</script>
<style scoped>
#editor {
  position: absolute;
  height: 100%;
  width: 100%;
}
</style>
