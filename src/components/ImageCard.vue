<template>
  <card :cardData="cardData" :addCardTF="addCardTF" :index="index">
    <div
      style=" margin: 10px; min-width:200px; min-height:200px; display: flex;"
    >
      <div
        v-if="imgSrc === ''"
        style="border: gray dashed 1px; flex-grow: 1; margin-bottom:10px"
        @drop="atDrop"
        @dragover="dragOver"
      >
        allow drop file
      </div>
      <img v-else :src="imgSrc" alt="haha no image" />
    </div>
  </card>
</template>

<script lang="ts">
import Vue from "vue";
import Card from "./Card.vue";

export default Vue.extend({
  name: "ImageCard",
  components: { Card },

  props: ["cardData", "index", "addCardTF"],

  data() {
    return { editTF: true, textContent: this.cardData.text, imgSrc: "" };
  },

  methods: {
    blobToBase64(blob: Blob, callback: (base64: string) => void) {
      const reader = new FileReader();
      reader.onload = function() {
        const dataUrl = reader.result;
        if (typeof dataUrl === "string") {
          const base64 = dataUrl.split(",")[1];
          callback(base64);
        }
      };
      reader.readAsDataURL(blob);
    },
    atDrop(e: DragEvent) {
      e.preventDefault();
      console.log(e.dataTransfer);
      if (e.dataTransfer) {
        console.log(e.dataTransfer.files);
        if (e.dataTransfer.files.length > 0) {
          this.blobToBase64(e.dataTransfer.files[0], (base64) => {
            console.log(base64);
            this.imgSrc = "data:image/png;base64, " + base64;
          });
        }
      }
    },
    dragOver(e: DragEvent) {
      e.preventDefault();
      if (e.dataTransfer) {
        e.dataTransfer.dropEffect = "copy";
      }
    },
  },
});
</script>

<style scoped></style>
