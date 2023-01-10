import { ref } from "vue";
import { defineStore } from "pinia";
import { LogFile } from "@/models/LogFile";

export const gcLogStore = defineStore("gcLog", () => {
  const logFiles = ref<LogFile[]>([]);
  const actives = ref<number>(0);

  function addNewEntry(file: any) {
    const reader = new FileReader();
    reader.onload = (res) => {
      logFiles.value?.push(new LogFile(file.name, (res.target?.result as string).split("\n")));
      logFiles.value[logFiles.value.length -1 ].index = logFiles.value.length -1
    };
    reader.readAsText(file);
  }

  function removeEntry(index: number) {
    logFiles.value.splice(index, 1)
    logFiles.value.forEach((file, index) => {
      file.index = index
    })
  }

  function activate(index: number) {
    let file = logFiles.value[index]
    if (file != null && !file.active && actives.value < 2) {
      file.active = !file.active;
      if (file.active) {
        file.style = {
          cursor: "pointer",
          "background-color": "#a4a4a4"
        };
        actives.value++;
      }
    } else if (file != null && file.active) {
      file.active = !file.active;
      file.style = {
        cursor: "pointer",
        "background-color": "#dad5d5"
      };
      actives.value--;
    }
  }

  function swapGC() {
    if (actives.value == 2) {
      const swapFiles = logFiles.value.filter(it => it.active);
      const foundIndex1 = swapFiles[0].index
      const foundIndex2 = swapFiles[1].index

      const temp = logFiles.value[foundIndex1];

      logFiles.value[foundIndex1] = logFiles.value[foundIndex2];
      logFiles.value[foundIndex1].index = foundIndex1

      logFiles.value[foundIndex2] = temp;
      logFiles.value[foundIndex2].index = foundIndex2

      logFiles.value[foundIndex1].active = false;
      logFiles.value[foundIndex2].active = false;
      actives.value = 0
      logFiles.value[foundIndex1].style = {
        cursor: "pointer",
        "background-color": "#dad5d5"
      };
      logFiles.value[foundIndex2].style = {
        cursor: "pointer",
        "background-color": "#dad5d5"
      };
    }
  }

  function moveUp(index: number) {
    if(index > 0) {
      const tempVar = logFiles.value[index-1]
      logFiles.value[index-1] = logFiles.value[index]
      logFiles.value[index-1].index = index-1

      logFiles.value[index] = tempVar
      logFiles.value[index].index = index

    }
  }

  function moveDown(index: number) {
    if(index < logFiles.value.length - 1) {
      const tempVar = logFiles.value[index+1]
      logFiles.value[index+1] = logFiles.value[index]
      logFiles.value[index+1].index = index+1

      logFiles.value[index] = tempVar
      logFiles.value[index].index = index
    }
  }

  function createTotalStwChart() {
    // just for throwing an event
  }

  function deleteAll(){
    logFiles.value.splice(0, logFiles.value.length)
  }


  return {
    contents: logFiles,
    addNewEntry,
    removeEntry,
    createTotalStwChart,
    deleteAll,
    activate,
    swapGC,
    moveUp,
    moveDown,
    actives
  };
});

export const requestLogStore = defineStore("requestLog", () => {
  const requestLogList = ref<LogFile[]>([]);
  const actives = ref<number>(0);

  function addNewEntry(file: any) {
    const reader = new FileReader();
    reader.onload = (res) => {
      requestLogList.value?.push(new LogFile(file.name, (res.target?.result as string).split("\n")));
      requestLogList.value[requestLogList.value.length -1 ].index = requestLogList.value.length -1
    };
    reader.readAsText(file);
  }

  function activate(index: number) {
    const file = requestLogList.value[index]
    if (file != null && !file.active && actives.value < 2) {
      file.active = !file.active;
      if (file.active) {
        file.style = {
          cursor: "pointer",
          "background-color": "#a4a4a4"
        };
        actives.value++;
      }
    } else if (file != null && file.active) {
      file.active = !file.active;
      file.style = {
        cursor: "pointer",
        "background-color": "#dad5d5"
      };
      actives.value--;
    }
  }

  function swapRequestLogFiles() {
    if (actives.value == 2) {
      const swapFiles = requestLogList.value.filter(it => it.active);
      const foundIndex1 = swapFiles[0].index
      const foundIndex2 = swapFiles[1].index

      const temp = requestLogList.value[foundIndex1];
      // swap first file
      requestLogList.value[foundIndex1] = requestLogList.value[foundIndex2];
      requestLogList.value[foundIndex1].index = foundIndex1
      // swap second file
      requestLogList.value[foundIndex2] = temp;
      requestLogList.value[foundIndex2].index = foundIndex2

      requestLogList.value[foundIndex1].active = false;
      requestLogList.value[foundIndex2].active = false;
      actives.value = 0

      requestLogList.value[foundIndex1].style = {
        cursor: "pointer",
        "background-color": "#dad5d5"
      };
      requestLogList.value[foundIndex2].style = {
        cursor: "pointer",
        "background-color": "#dad5d5"
      };

    }
  }
  function moveUp(index: number) {
    if(index > 0) {
      const tempVar = requestLogList.value[index-1]
      requestLogList.value[index-1] = requestLogList.value[index]
      requestLogList.value[index-1].index = index-1

      requestLogList.value[index] = tempVar
      requestLogList.value[index].index = index

    }
  }

  function moveDown(index: number) {
    if(index < requestLogList.value.length - 1) {
      const tempVar = requestLogList.value[index+1]
      requestLogList.value[index+1] = requestLogList.value[index]
      requestLogList.value[index+1].index = index+1

      requestLogList.value[index] = tempVar
      requestLogList.value[index].index = index
    }
  }

  function removeEntry(index: number) {
    requestLogList.value.splice(index, 1)
    requestLogList.value.forEach((file, index) => {
      file.index = index
    })

  }

  function deleteAll(){
    requestLogList.value.splice(0, requestLogList.value.length)
  }

  function createRequestChart() {
    // just for throwing an event
  }

  return {
    contents: requestLogList,
    addNewEntry,
    removeEntry,
    createRequestChart,
    deleteAll,
    swapRequestLogFiles,
    actives,
    moveUp,
    moveDown,
    activate
  };
});
