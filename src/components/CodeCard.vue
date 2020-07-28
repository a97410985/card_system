<template>
  <card :cardData="cardData" :addCardTF="addCardTF" :index="index">
    <div id="editor">code card</div>
  </card>
</template>

<script lang="ts">
import Vue from "vue";
import ace, { edit } from "ace-builds";
import "ace-builds/src-noconflict/theme-twilight";
import "ace-builds/src-noconflict/mode-javascript";
import Card from "./Card.vue";
export default Vue.extend({
  name: "CodeCard",
  components: { Card },
  props: ["cardData", "index", "addCardTF"],
  mounted() {
    const editor = ace.edit("editor");
    editor.setTheme("ace/theme/twilight");
    editor.getSession().setMode("ace/mode/javascript");
  },
  data() {
    return {};
  },
  methods: {},
});
</script>
<style scoped>
#editor {
  position: absolute;
  width: 100%;
  height: 100%;
}
</style>
