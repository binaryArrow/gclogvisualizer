import { ref } from "vue";
import { defineStore } from "pinia";
import { LogFile } from "@/models/LogFile";

export const gcLogStore = defineStore("gcLog", () => {
  const logFiles = ref<LogFile[]>([])

  function addNewEntry(file: any){
    const reader = new FileReader();
    reader.onload = (res) => {
      logFiles.value?.push(new LogFile(file.name,(res.target?.result as string).split('\n')))
    };
    reader.readAsText(file);
  }

  function removeEntry(name: string) {
    logFiles.value = logFiles.value.filter(entry => entry.name != name)
  }

  function moveUp(name: string) {
    const foundIndex = logFiles.value.findIndex(element => element.name == name)
    if(foundIndex > 0) {
      const tempVar = logFiles.value[foundIndex-1]
      logFiles.value[foundIndex-1] = logFiles.value[foundIndex]
      logFiles.value[foundIndex] = tempVar
    }
  }
  function moveDown(name:string) {
    const foundIndex = logFiles.value.findIndex(element => element.name == name)
    if(foundIndex < logFiles.value.length-1) {
      const tempVar = logFiles.value[foundIndex+1]
      logFiles.value[foundIndex+1] = logFiles.value[foundIndex]
      logFiles.value[foundIndex] = tempVar
    }
  }

  function createTotalStwChart(){
    // just for throwing an event
  }
  function lastEntryDeletedEvent() {
    // event
  }
  return{contents: logFiles, addNewEntry, removeEntry, createTotalStwChart, lastEntryDeletedEvent, moveUp, moveDown}
})

export const requestLogStore = defineStore("requestLog", () => {
  const requestLogList = ref<LogFile[]>([])

  function addNewEntry(file: any){
    const reader = new FileReader();
    reader.onload = (res) => {
      requestLogList.value?.push(new LogFile(file.name,(res.target?.result as string).split('\n')))
    };
    reader.readAsText(file);
  }

  function moveUp(name: string) {
    const foundIndex = requestLogList.value.findIndex(element => element.name == name)
    if(foundIndex > 0) {
      const tempVar = requestLogList.value[foundIndex-1]
      requestLogList.value[foundIndex-1] = requestLogList.value[foundIndex]
      requestLogList.value[foundIndex] = tempVar
    }
  }
  function moveDown(name:string) {
    const foundIndex = requestLogList.value.findIndex(element => element.name == name)
    if(foundIndex < requestLogList.value.length-1) {
      const tempVar = requestLogList.value[foundIndex+1]
      requestLogList.value[foundIndex+1] = requestLogList.value[foundIndex]
      requestLogList.value[foundIndex] = tempVar
    }
  }

  function removeEntry(name: string) {
    requestLogList.value = requestLogList.value.filter(entry => entry.name != name)
  }
  function lastEntryDeletedEvent() {
    // event
  }

  function createRequestChart(){
    // just for throwing an event
  }
  return{contents: requestLogList, addNewEntry, removeEntry, createRequestChart, lastEntryDeletedEvent,moveUp, moveDown}
})
