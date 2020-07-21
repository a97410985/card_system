<template>
  <card :cardData="cardData" :addCardTF="addCardTF" :index="index">
    <div
      style=" margin: 10px; min-width:200px; min-height:200px; display: flex;"
    >
      <div
        v-if="imgSrc === 'data:image/png;base64, '"
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
import axios from "axios";

export default Vue.extend({
  name: "ImageCard",
  components: { Card },

  props: ["cardData", "index", "addCardTF"],

  data() {
    return {
      editTF: true,
      imgSrc: "data:image/png;base64, " + this.cardData.img,
    };
  },

  created() {
    // 一開始要到
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
            // 要update資料，partial updates to documents
            axios({
              method: "post",
              baseURL: "/api",
              url: `/${this.cardData.type.toLowerCase()}/_doc/${
                this.cardData.id
              }/_update`,
              data: {
                doc: {
                  img: base64,
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
