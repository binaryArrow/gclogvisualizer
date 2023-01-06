<template>
  <div>
    <a-upload v-model:file-list="fileList" :show-upload-list="false" name="upload" :before-upload="loadText">
      <a-button>
        <upload-outlined></upload-outlined>
        Upload GC log
      </a-button>
    </a-upload>
  </div>
  <div>
    <ul>
      <li v-for="content in contents">
        {{ content }}
      </li>
    </ul>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { UploadOutlined } from "@ant-design/icons-vue";

const contents = ref<string[]>([]);
const fileList = ref([]);

function loadText(file: any) {
  const reader = new FileReader();
  reader.onload = (res) => {
    contents.value.push(res.target?.result as string);
  };
  reader.readAsText(file);
  console.log(file);
  return false;
}
</script>
