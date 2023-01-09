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
        <div id="log-file-element">
          {{ content.name }}
          <a>
            <font-awesome-icon id="move-down" :icon="['fas', 'arrow-down']" @click="moveGcDown(content.name)" />
          </a>
          <a>
            <font-awesome-icon id="move-up" :icon="['fas', 'arrow-up']" @click="moveGcLogUp(content.name)" />
          </a>
          <a>
            <font-awesome-icon id="delete" :icon="['fas', 'trash']" @click="removeGCLogEntry(content)" />
          </a>
        </div>
      </div>
      <a-button v-if="gcLogFiles.contents.length > 0 " class="plot-button" @click="gcLogFiles.createSTWMaxChart()">
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
        <div id="log-file-element">
          {{ content.name }}
          <a>
            <font-awesome-icon id="move-down" :icon="['fas', 'arrow-down']" @click="moveRequestDown(content.name)" />
          </a>
          <a>
            <font-awesome-icon id="move-up" :icon="['fas', 'arrow-up']" @click="moveRequestUp(content.name)" />
          </a>
          <a>
            <font-awesome-icon id="delete" :icon="['fas', 'trash']" @click="removeRequestLogEntry(content)" />
          </a>
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
function addNewGCLogEntry(file: any) {
  gcLogFiles.addNewEntry(file);
  return false;
}

function removeGCLogEntry(file: any) {
  gcLogFiles.removeEntry(file.name);
}

function moveGcLogUp(name: string) {
  gcLogFiles.moveUp(name)
}
function moveGcDown(name: string) {
  gcLogFiles.moveDown(name)
}

function addNewRequestLogEntry(file: any) {
  requestLogFiles.addNewEntry(file);
  return false;
}

function removeRequestLogEntry(file: any) {
  requestLogFiles.removeEntry(file.name);
}

function moveRequestDown(name:string) {
  requestLogFiles.moveDown(name)
}
function moveRequestUp(name:string) {
  requestLogFiles.moveUp(name)
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
#log-file-element:hover{
  background-color: #dad5d5;
}

#request-log, #gc-log {
  text-align: center;
}

#move-up, #move-down, #delete {
  padding: 0 2px 0;
  color: #40a9ff;
}
</style>
