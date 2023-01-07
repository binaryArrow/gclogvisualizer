<template>
  <div class="wrapper">
    <div class="header">
      <div class="file-input">
        <FileInput />
      </div>
    </div>
    <div class="graphs">
    </div>
  </div>
</template>

<script setup lang="ts">
import FileInput from "@/components/FileInput.vue";
</script>


<style scoped>
.wrapper {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 30px;
}
.file-input {
  grid-column: 1;
}
.graphs {
  width: 1600px;
  height: 900px;
  border: 1px solid #afafaf;
  background: #efefef;
  border-radius: 8px;
}
</style>
