<template>
  <div id="container">
    <div id="gc-log">
      <a-upload v-model:file-list="fileList" :multiple="true" name="upload"
                :before-upload="addNewGCLogEntry"
                :show-upload-list="false">
        <a-button>
          <upload-outlined></upload-outlined>
          Upload GC log
        </a-button>
      </a-upload>
      <div v-if="gcLogFiles.contents.length > 0 " v-for="content of gcLogFiles.contents">
        <div id="log-file-element-container">
          <div id="log-file-element" :style="content.style" @click="activateGCLogfileForSwap(content.index)">
            {{ content.index + 1 }}-{{ content.name }}
          </div>
          <font-awesome-icon v-if="content.active && gcLogFiles.actives === 2" id="swap"
                             :icon="['fas', 'repeat']" @click="swapGCs" />
          <font-awesome-icon v-if="gcLogFiles.actives === 0" id="delete" :icon="['fas', 'trash']"
                             @click="removeGCLogEntry(content.index)" />
        </div>
      </div>
      <a-button v-if="gcLogFiles.contents.length > 0 " class="plot-button" @click="gcLogFiles.createTotalStwChart()">
        STW Graph erstellen
      </a-button>
    </div>
    <div id="request-log">
      <a-upload v-model:file-list="requestsLogList" :multiple="true" name="uploadRequestLog"
                :before-upload="addNewRequestLogEntry"
                :show-upload-list="false">
        <a-button>
          <upload-outlined></upload-outlined>
          Upload Request log
        </a-button>
      </a-upload>
      <div v-if="requestLogFiles.contents.length > 0 " v-for="content of requestLogFiles.contents">
        <div id="log-file-element-container">
          <div id="log-file-element" :style="content.style" @click="activateRequestLogFileForSwap(content.index)">
            {{content.index + 1}} - {{ content.name }}
          </div>
          <font-awesome-icon v-if="content.active && requestLogFiles.actives === 2" id="swap" :icon="['fas', 'repeat']" @click="swapRequests()" />
          <font-awesome-icon v-if="requestLogFiles.actives === 0" id="delete" :icon="['fas', 'trash']" @click="removeRequestLogEntry(content.index)" />
        </div>
      </div>
      <a-button v-if="requestLogFiles.contents.length > 0 " class="plot-button"
                @click="requestLogFiles.createRequestChart()">
        Response Graph erstellen
      </a-button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from "vue";
import { UploadOutlined } from "@ant-design/icons-vue";
import { gcLogStore, requestLogStore } from "@/stores/globalStore";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";

// for GC logs
const gcLogFiles = gcLogStore();
const fileList = ref();
// for request logs
const requestLogFiles = requestLogStore();
const requestsLogList = ref();


onMounted(() => {
  gcLogFiles.$onAction((context) => {
    if (context.name === "lastEntryDeletedEvent")
      fileList.value.pop();
  });
  requestLogFiles.$onAction((context) => {
    if (context.name === "lastEntryDeletedEvent")
      requestsLogList.value.pop();
  });
});

// returning false to disable default POST fetch
// GC LOG STUFF
function addNewGCLogEntry(file: any) {
  gcLogFiles.addNewEntry(file);
  return false;
}

function removeGCLogEntry(index: number) {
  gcLogFiles.removeEntry(index);
}

function activateGCLogfileForSwap(index: number) {
  gcLogFiles.activate(index);
}

function swapGCs() {
  gcLogFiles.swapGC();
}

// Request log stuff
function addNewRequestLogEntry(file: any) {
  requestLogFiles.addNewEntry(file);
  return false;
}

function removeRequestLogEntry(index: number) {
  requestLogFiles.removeEntry(index);
}
function activateRequestLogFileForSwap(index: number) {
  requestLogFiles.activate(index);
}

function swapRequests() {
  requestLogFiles.swapRequestLogFiles();
}

</script>

<style>
#container {
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-gap: 15px;
}

#log-file-element {
  margin: 5px;
  padding: 4px;
  background-color: #efefef;
  border-radius: 8px;
}

#log-file-element:hover {
  color: #1c91f5;
}

#request-log, #gc-log {
  text-align: center;
}

#swap, #delete {
  cursor: pointer;
  color: #40a9ff;
  padding-top: 14px;
}

#swap:hover, #delete:hover {
  color: #5fa9e7;
}

#log-file-element-container {
  display: flex;
  justify-content: center;
}
</style>
