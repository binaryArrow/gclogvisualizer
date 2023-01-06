<script setup lang="ts">

  import { ref } from "vue";

  const content = ref()

  function loadText(ev: any){
    const file = ev.target.files[0]
    const reader = new FileReader()
    reader.onerror = (err) => console.log(err)
    reader.onload = (res) => {
      if(res.target)
      content.value = res.target.result
      console.log(res.target?.result);
    }
    reader.readAsText(file)
  }
</script>

<template>
  <input type="file" name="upload" @change="loadText">
  <div>{{content}}</div>
</template>
