<template>
  <div id="container">
    <a-upload v-model:file-list="fileList" :multiple="true" name="upload" :before-upload="loadText" @remove="removeFile">
      <a-button>
        <upload-outlined></upload-outlined>
        Upload GC log
      </a-button>
    </a-upload>
  <a-button v-if="logFiles.contents.length > 0" class="plot-button" @click="logFiles.createGraphEvent()">STW Graphen erstellen</a-button>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { UploadOutlined } from "@ant-design/icons-vue";
import { contentStore} from "@/stores/content";

const logFiles = contentStore()
const fileList = ref()

// returning false to disable default POST fetch
function loadText(file: any) {
  logFiles.addNewEntry(file)
  return false;
}

function removeFile(file: any) {
  logFiles.removeEntry(file.name)
}
</script>

<style>
#container{
  text-align: center;
}
</style>
