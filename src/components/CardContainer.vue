<template>
  <v-card class="mx-2">
    <!-- TODO: 最上面一列，放加卡片、取消加卡片還有搜尋的區塊 -->

    <div class="d-flex flex-row custome-scroll-bar card-container"></div>
  </v-card>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";
import store from "../store/index";

@Component
export default class CardContainer extends Vue {
  // data
  searchText = ""; // 搜尋卡片的文字
  // displayCards

  // computed

  // vue component lifecircle hook

  // method
}
</script>
<style scoped>
/* 客製化scroll bar樣式為深色 */
.custom-scroll-bar::-webkit-scrollbar {
  width: 5px;
}
.custom-scroll-bar::-webkit-scrollbar-thumb {
  background-color: #123456;
  border-radius: 10px;
}
.custom-scroll-bar::-webkit-scrollbar-thumb:hover {
  background-color: #25517c;
}
</style>
