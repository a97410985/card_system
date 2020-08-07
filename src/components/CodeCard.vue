<template>
  <card :cardData="cardData" :addCardTF="addCardTF" :index="index">
    <template v-slot:top-right-bar>
      <v-menu v-model="settingMenu" :close-on-content-click="false">
        <template v-slot:activator="{ on, attrs }">
          <v-btn color="indigo" dark v-bind="attrs" v-on="on" icon small>
            <v-icon>settings</v-icon>
          </v-btn>
        </template>
        <v-card>
          <v-card-title>設定</v-card-title>
          <v-card-text>
            <v-autocomplete
              :items="programmingLanguageArr"
              label="progrmming language"
              v-model="selectProgrammingLanguage"
              @change="setProgrammingLanguage"
            >
            </v-autocomplete>
          </v-card-text>
        </v-card>
      </v-menu>
      <hover-editable-description
        :cardData="cardData"
      ></hover-editable-description>
    </template>
    <template v-slot:content>
      <div>
        <div>
          <div :id="editorID" class="editor"></div>
        </div>
      </div>
    </template>
  </card>
</template>

<script lang="ts">
import Vue from "vue";
import ace, { edit } from "ace-builds";
import "ace-builds/webpack-resolver";
import "ace-builds/src-noconflict/theme-twilight";
import "ace-builds/src-noconflict/mode-javascript";
import "ace-builds/src-noconflict/mode-c_cpp";
import "ace-builds/src-noconflict/mode-typescript";
import "ace-builds/src-noconflict/mode-json";
import Card from "./Card.vue";
import HoverEditableDescription from "./HoverEditableDescription.vue";
import { updateCardSingleField } from "../elasticSearchHelper";
import { v4 as uuidv4 } from "uuid";

export default Vue.extend({
  name: "CodeCard",
  components: { Card, HoverEditableDescription },
  props: ["cardData", "index", "addCardTF"],
  mounted() {
    const editor = ace.edit(this.editorID);
    this.editor = editor;
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
    return {
      editor: null as ace.Ace.Editor | null,
      editorID: uuidv4(),
      settingMenu: false,
      selectProgrammingLanguage: "javascript",
      idArr: [] as number[],
      programmingLanguageArr: ["c_cpp", "typescript", "javascript", "json"],
    };
  },
  methods: {
    setProgrammingLanguage() {
      if (this.editor) {
        this.editor.session.setMode(
          "ace/mode/" + this.selectProgrammingLanguage
        );
      }
    },
  },
});
</script>
<style scoped>
.editor {
  position: absolute;
  height: 100%;
  width: 100%;
}
</style>
