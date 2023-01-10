<template>
  <div class="wrapper">
    <div class="header">
      <div class="file-input">
        <FileInput />
      </div>
    </div>
    <div class="graphs">
      <Graphs></Graphs>
    </div>
  </div>
</template>

<script setup lang="ts">
import Graphs from "@/components/Graphs.vue";
import FileInput from "@/components/FileInput.vue";
</script>


<style scoped>
.wrapper {
  display: grid;
  grid-template-columns: 1fr 1500px;
  gap: 30px;
}
.file-input {
  grid-column: 1;
}
.graphs {
  border: 1px solid #afafaf;
  background: #efefef;
  border-radius: 8px;
}

</style>
