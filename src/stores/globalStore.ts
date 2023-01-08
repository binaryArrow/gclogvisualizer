import { ref } from "vue";
import { defineStore } from "pinia";
import { LogFile } from "@/models/LogFile";

export const gcLogStore = defineStore("gcLog", () => {
  const logFiles = ref<LogFile[]>([])

  function addNewEntry(file: any){
    const reader = new FileReader();
    reader.onload = (res) => {
      logFiles.value?.push(new LogFile(file.name,(res.target?.result as string).split(/[\r\n]+/g)))
    };
    reader.readAsText(file);
  }

  function removeEntry(name: string) {
    logFiles.value = logFiles.value.filter(entry => entry.name != name)
  }

  function createGraphEvent(){
    // just for throwing an event
  }
  return{contents: logFiles, addNewEntry, removeEntry, createGraphEvent}
})

export const requestLogStore = defineStore("requestLog", () => {
  const requestLogList = ref<LogFile[]>([])

  function addNewEntry(file: any){
    const reader = new FileReader();
    reader.onload = (res) => {
      requestLogList.value?.push(new LogFile(file.name,(res.target?.result as string).split(/[\r\n]+/g)))
    };
    reader.readAsText(file);
  }

  function removeEntry(name: string) {
    requestLogList.value = requestLogList.value.filter(entry => entry.name != name)
  }

  function createGraphEvent(){
    // just for throwing an event
  }
  return{contents: requestLogList, addNewEntry, removeEntry, createGraphEvent}
})
