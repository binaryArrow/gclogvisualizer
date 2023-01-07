import { computed, ref } from "vue";
import { defineStore } from "pinia";
import { GcFile } from "@/models/GcFile";

export const useCounterStore = defineStore("counter", () => {
  const count = ref(0)
  const doubleCount = computed(() => count.value * 2)
  function increment() {
    count.value++
  }

  return { count, doubleCount, increment }
})

export const contentStore = defineStore("content", () => {
  const contents = ref<GcFile[]>([])

  function addNewEntry(file: any){
    console.log("test");
    const reader = new FileReader();
    reader.onload = (res) => {
      contents.value?.push(new GcFile(file.name,(res.target?.result as string).split(/[\r\n]+/g)))
    };
    reader.readAsText(file);
  }

  function removeEntry(name: string) {
    contents.value = contents.value.filter(entry => entry.name != name)
  }
  return{contents, addNewEntry, removeEntry}
})
