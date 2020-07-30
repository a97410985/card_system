<template>
  <v-menu
    v-model="menu"
    :close-on-content-click="false"
    offset-x
    :open-on-hover="true"
  >
    <template v-slot:activator="{ on, attrs }">
      <v-btn color="indigo" dark v-bind="attrs" v-on="on" icon small>
        <v-icon>description</v-icon>
      </v-btn>
    </template>
    <v-card>
      <v-card-title>說明</v-card-title>
      <v-card-text>
        <auto-upload-text-area
          :cardData="cardData"
          :updateObj="{ doc: { description: '' } }"
          :textField="textField"
        ></auto-upload-text-area>
      </v-card-text>
    </v-card>
  </v-menu>
</template>

<script lang="ts">
import Vue from "vue";
import AutoUploadTextArea from "./AutoUploadTextArea.vue";
import { cardType } from "../card";
export default Vue.extend({
  name: "HoverEditableDescription",
  props: ["cardData"],
  components: { AutoUploadTextArea },
  data() {
    return {
      menu: false,
    };
  },
  computed: {
    textField() {
      if ((this.cardData.type as cardType) !== "PureTextCard") {
        return "description";
      } else {
        return "text";
      }
    },
  },
});
</script>
