<template>
  <card
    :cardData="cardData"
    :addCardType="addCardType"
    :index="index"
    :containerName="containerName"
  >
    <template v-slot:top-right-bar>
      <hover-editable-description
        :cardData="cardData"
      ></hover-editable-description>
    </template>
    <template v-slot:content>
      <div
        style=" margin: 10px; min-width:200px; min-height:200px; display: flex;"
      >
        <drop-files-area
          v-if="imgSrc === 'data:image/png;base64, '"
          style="flex-grow: 1; margin-bottom:10px"
          @DropDownGetFiles="handleDropFiles"
        ></drop-files-area>
        <img
          v-else
          style="width: 100%; height: auto;"
          :src="imgSrc"
          alt="haha no image"
        />
      </div>
    </template>
  </card>
</template>

<script lang="ts">
import Vue from "vue";
import Card from "./Card.vue";
import DropFilesArea from "./DropFilesArea.vue";
import HoverEditableDescription from "./HoverEditableDescription.vue";
import axios from "axios";

export default Vue.extend({
  name: "ImageCard",
  components: { Card, DropFilesArea, HoverEditableDescription },

  props: ["cardData", "index", "addCardType", "containerName"],

  data() {
    return {
      settingMenu: false,
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
    handleDropFiles(files: FileList) {
      console.log("handleDropFiles");
      if (files.length > 0) {
        this.blobToBase64(files[0], (base64) => {
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
    },
  },
});
</script>

<style scoped>
@import "~material-icons/iconfont/material-icons.css";
</style>
