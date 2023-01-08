import { ref } from "vue";
import { defineStore } from "pinia";
import { GcFile } from "@/models/GcFile";

export const contentStore = defineStore("content", () => {
  const logFiles = ref<GcFile[]>([])

  function addNewEntry(file: any){
    const reader = new FileReader();
    reader.onload = (res) => {
      logFiles.value?.push(new GcFile(file.name,(res.target?.result as string).split(/[\r\n]+/g)))
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
