<template>
  <div id="container">
    <div id="gc-log">
      <a-upload v-model:file-list="fileList" :multiple="true" name="upload" :before-upload="addNewGCLogEntry"
                @remove="removeGCLogEntry">
        <a-button>
          <upload-outlined></upload-outlined>
          Upload GC log
        </a-button>
      </a-upload>
      <a-button v-if="gcLogFiles.contents.length > 0" class="plot-button" @click="gcLogFiles.createGraphEvent()">STW
        Graphen erstellen
      </a-button>
    </div>
    <div id="request-log">
      <a-upload v-model:file-list="requestsLogList" :multiple="true" name="uploadRequestLog" :before-upload="addNewRequestLogEntry"
                @remove="removeRequestLogEntry">
        <a-button>
          <upload-outlined></upload-outlined>
          Upload GC log
        </a-button>
      </a-upload>
      <a-button v-if="requestLogFiles.contents.length > 0" class="plot-button" @click="gcLogFiles.createGraphEvent()">
        Heatmap erstellen
      </a-button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { UploadOutlined } from "@ant-design/icons-vue";
import { gcLogStore, requestLogStore } from "@/stores/globalStore";

// for GC logs
const gcLogFiles = gcLogStore();
const fileList = ref();
// for request logs
const requestLogFiles = requestLogStore();
const requestsLogList = ref();

// returning false to disable default POST fetch
function addNewGCLogEntry(file: any) {
  gcLogFiles.addNewEntry(file);
  return false;
}
function addNewRequestLogEntry(file: any) {
  requestLogFiles.addNewEntry(file);
  return false;
}

function removeGCLogEntry(file: any) {
  gcLogFiles.removeEntry(file.name);
}
function removeRequestLogEntry(file: any) {
  requestLogFiles.removeEntry(file.name);
}
</script>

<style>
#container {
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-gap: 15px;
}
</style>
