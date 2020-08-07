<template>
  <card
    :cardData="cardData"
    :addCardTF="addCardTF"
    :index="index"
    :containerName="containerName"
  >
    <template v-slot:content>
      <auto-upload-text-area
        style="margin: 10px"
        :cardData="cardData"
        :updateObj="{ doc: { text: '' } }"
        textField="text"
      ></auto-upload-text-area>
    </template>
  </card>
</template>

<script lang="ts">
import Vue from "vue";
import axios from "axios";
import Card from "./Card.vue";
import AutoUploadTextArea from "./AutoUploadTextArea.vue";

export default Vue.extend({
  name: "PureTextCard",

  components: { Card, AutoUploadTextArea },
  props: ["cardData", "index", "addCardTF", "containerName"],

  data() {
    return { textContent: this.cardData.text, editTF: true };
  },

  methods: {},
});
</script>
