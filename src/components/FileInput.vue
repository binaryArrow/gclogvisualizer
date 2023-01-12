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
          {{ content.index + 1 }}
          <div id="log-file-element" :style="content.style" @click="activateGCLogfileForSwap(content.index)">
            {{ content.name }}
          </div>
          <font-awesome-icon v-if="content.active && gcLogFiles.actives === 2" id="swap"
                             :icon="['fas', 'repeat']" @click="swapGCs" />
          <font-awesome-icon v-if="gcLogFiles.actives === 0" id="delete" :icon="['fas', 'arrow-down']"
                             @click="moveGcDown(content.index)" />
          <font-awesome-icon v-if="gcLogFiles.actives === 0" id="delete" :icon="['fas', 'arrow-up']"
                             @click="moveGcLogUp(content.index)" />
          <font-awesome-icon v-if="gcLogFiles.actives === 0" id="delete" :icon="['fas', 'trash']"
                             @click="showDeleteGcModal(content.index)" />
        </div>
      </div>
      <a-button v-if="gcLogFiles.contents.length > 0 " class="plot-button" @click="gcLogFiles.createTotalStwChart()">
        Create STW Graph
      </a-button>
      <a-button v-if="gcLogFiles.contents.length > 0 " class="plot-button" @click="showDeleteGcModal(-1)">
        Delete All
      </a-button>
      <a-modal v-model:visible="deleteModalVisibleGc" title="Delete?" @ok="handleOkGc"></a-modal>
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
          {{ content.index + 1 }}
          <div id="log-file-element" :style="content.style" @click="activateRequestLogFileForSwap(content.index)">
            {{ content.name }}
          </div>
          <font-awesome-icon v-if="content.active && requestLogFiles.actives === 2" id="swap" :icon="['fas', 'repeat']"
                             @click="swapRequests()" />
          <font-awesome-icon v-if="requestLogFiles.actives === 0" id="delete" :icon="['fas', 'arrow-down']"
                             @click="moveRequestlogDown(content.index)" />
          <font-awesome-icon v-if="requestLogFiles.actives === 0" id="delete" :icon="['fas', 'arrow-up']"
                             @click="moveRequestLogUp(content.index)" />
          <font-awesome-icon v-if="requestLogFiles.actives === 0" id="delete" :icon="['fas', 'trash']"
                             @click="showDeleteReqModal(content.index)" />
        </div>
      </div>
      <a-button v-if="requestLogFiles.contents.length > 0 " class="plot-button"
                @click="requestLogFiles.createRequestChart()">
        Create Response Graph
      </a-button>
      <a-button v-if="requestLogFiles.contents.length > 0 " class="plot-button" @click="showDeleteReqModal(-1)">
        Delete All
      </a-button>
      <a-modal v-model:visible="deleteModalVisibleReq" title="Delete?" @ok="handleOkReq"></a-modal>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { UploadOutlined } from "@ant-design/icons-vue";
import { gcLogStore, requestLogStore } from "@/stores/globalStore";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";

// for GC logs
const gcLogFiles = gcLogStore();
const fileList = ref();
// for request logs
const requestLogFiles = requestLogStore();
const requestsLogList = ref();

const deleteIndex = ref<number>(-1);

const deleteModalVisibleReq = ref<boolean>(false);
const deleteModalVisibleGc = ref<boolean>(false);

function showDeleteReqModal(singleOrAll: number) {
  deleteIndex.value = singleOrAll;
  deleteModalVisibleReq.value = true;
}

function showDeleteGcModal(singleOrAll: number) {
  deleteIndex.value = singleOrAll
  deleteModalVisibleGc.value = true;
}

function handleOkReq() {
  if (deleteIndex.value === -1)
    requestLogFiles.deleteAll();
  else requestLogFiles.removeEntry(deleteIndex.value)
  deleteModalVisibleReq.value = false;
}

function handleOkGc() {
  if (deleteIndex.value === -1)
    gcLogFiles.deleteAll();
  else gcLogFiles.removeEntry(deleteIndex.value)
  deleteModalVisibleGc.value = false;
}


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

function moveGcLogUp(index: number) {
  gcLogFiles.moveUp(index);
}

function moveGcDown(index: number) {
  gcLogFiles.moveDown(index);
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

function moveRequestLogUp(index: number) {
  requestLogFiles.moveUp(index);
}

function moveRequestlogDown(index: number) {
  requestLogFiles.moveDown(index);
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
  padding-left: 2px;
}

#swap:hover, #delete:hover {
  color: #5fa9e7;
}

#log-file-element-container {
  display: flex;
  justify-content: center;
}
</style>
