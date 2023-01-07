<template>
  <div>
    <a-upload v-model:file-list="fileList" name="upload" :before-upload="loadText" @remove="removeFile">
      <a-button>
        <upload-outlined></upload-outlined>
        Upload GC log
      </a-button>
    </a-upload>
  </div>
  <div>
    <ul>
      <li v-for="file in fileList">
        {{ file.name }}
      </li>
    </ul>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { UploadOutlined } from "@ant-design/icons-vue";
import { contentStore} from "@/stores/store";

const contents = contentStore()
const fileList = ref()

// returning false to disable default POST fetch
function loadText(file: any) {
  contents.addNewEntry(file)
  return false;
}

function removeFile(file: any) {
  contents.removeEntry(file.name)
}
</script>
