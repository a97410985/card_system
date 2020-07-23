<template>
  <div class="dropArea" @drop="atDrop" @dragover="dragOver">
    allow drop file
  </div>
</template>

<script lang="ts">
import Vue from "vue";
export default Vue.extend({
  name: "DropFilesArea",
  methods: {
    atDrop(e: DragEvent) {
      e.preventDefault();
      if (e.dataTransfer) {
        console.log(e.dataTransfer);
        if (e.dataTransfer.files.length > 0) {
          this.$emit("DropDownGetFiles", e.dataTransfer.files);
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
<style scoped>
.dropArea {
  border: gray dashed 1px;
}
.dropArea:-moz-drag-over {
  border: blue, dashed 1px;
}
</style>
