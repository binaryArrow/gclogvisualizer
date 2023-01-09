<template>
  <!--  <div v-for="stwMaxTime of stwMaxTimes">-->
  <!--    STW total time: {{ stwMaxTime.stwTotalTime }} ms-->
  <!--  </div>-->
  <div id="container">
    <div id="graph"></div>
    <div id="req-graph"></div>
  </div>
</template>

<script setup lang="ts">

import { gcLogStore, requestLogStore } from "@/stores/globalStore";
import { onMounted, ref } from "vue";
import { FileAnalyzer } from "@/service/FileAnalyzer";
import { message } from "ant-design-vue";
import * as d3 from "d3";
import { GcAnalyzedFile } from "@/models/GcAnalyzedFile";
import { RequestAnalyzedFile } from "@/models/RequestAnalyzedFile";

const gcLogFiles = gcLogStore();
const gcFilesAnalyzed = ref<GcAnalyzedFile[]>([]);

const requestLogFiles = requestLogStore();
const requestFilesAnalyzed = ref<RequestAnalyzedFile[]>([])

onMounted(() => {
  // GC stuff
  gcLogFiles.$onAction((context) => {
    if (context.name === "createTotalStwChart" && gcFilesAnalyzed.value.length > 0) {
      createHistogram(gcFilesAnalyzed.value.map(it => it.stwTotalTime), gcFilesAnalyzed.value[0].gcName);
    }
  });
  // deleting files
  gcLogFiles.$subscribe((mutation, state) => {
    if (mutation.type === "direct" && gcFilesAnalyzed.value.length > state.contents.length) {
      gcFilesAnalyzed.value = [];
      updateAnalyzedGCFiles();
    }
    if (mutation.type === "direct" && gcFilesAnalyzed.value.length < state.contents.length) {
      const logfileContent = gcLogFiles.contents[gcLogFiles.contents.length - 1].content;
      const logFileName = gcLogFiles.contents[gcLogFiles.contents.length - 1].name;
      const valid = FileAnalyzer.analyzeGCFile(logfileContent, logFileName)
      if (valid !== null)
        gcFilesAnalyzed.value.push(valid);
      else{
        message.error("Unknown Garbage Collector Log");
        gcLogFiles.removeEntry(logFileName)
        gcLogFiles.lastEntryDeletedEvent()
      }
    }
  });

  // Heatmap stuff
  requestLogFiles.$onAction((context) => {
    if (context.name === "createRequestChart") {
      createReqChart(
        [2000, 3000, 4000, 2123, 4399, 5000, 2300, 5000, 2390, 1200],
        "test"
      )
    }
  });
  requestLogFiles.$subscribe((mutation, state) => {
    if (mutation.type === "direct" && requestFilesAnalyzed.value.length > state.contents.length) {
      requestFilesAnalyzed.value = [];
      updateAnalyzedReqFiles();
    }
    if (mutation.type === "direct" && requestFilesAnalyzed.value.length < state.contents.length) {
      const logfileContent = requestLogFiles.contents[requestLogFiles.contents.length - 1].content;
      const logFileName = requestLogFiles.contents[requestLogFiles.contents.length - 1].name;
      const valid = FileAnalyzer.analyzeRequestFile(logfileContent, logFileName)
      if ( valid !== null)
        requestFilesAnalyzed.value.push(valid);
      else {
        message.error("Unknown File, use Gatling logs!");
        requestLogFiles.removeEntry(logFileName)
        requestLogFiles.lastEntryDeletedEvent()
      }
    }
  })
  createReqChart(
    [2000, 3000, 4000, 2123, 4399, 5000, 2300, 5000, 2390, 1200],
    "test"
  )
});

function updateAnalyzedGCFiles() {
  gcLogFiles.contents.forEach(contentEntry => {
    if (FileAnalyzer.analyzeGCFile(contentEntry.content, contentEntry.name) !== null)
      gcFilesAnalyzed.value.push(FileAnalyzer.analyzeGCFile(contentEntry.content, contentEntry.name)!);
  });
}
function updateAnalyzedReqFiles() {
  requestLogFiles.contents.forEach(contentEntry => {
    const valid = FileAnalyzer.analyzeRequestFile(contentEntry.content, contentEntry.name)
    if ( valid !== null)
      requestFilesAnalyzed.value.push(valid);
  });
}

function createHistogram(data: number[], gcName: string) {
  // svg attributes
  let margin = { top: 10, right: 30, bottom: 30, left: 40 },
    width = 480 - margin.left - margin.right,
    height = 400 - margin.top - margin.bottom;

  let svg = d3.select("#graph")
    .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform",
      "translate(" + 80 + ")");

  // label x axis
  svg.append("text")
    .attr("class", "x label")
    .attr("text-anchor", "end")
    .attr("x", width / 2)
    .attr("y", 390)
    .text("Test Number GC")
    .attr("font-size", 13)
    .attr("fill", "black");

  // label y axis
  svg.append("text")
    .attr("class", "y label")
    .attr("text-anchor", "end")
    .attr("y", -60)
    .attr("dy", ".50em")
    .attr("x", -100)
    .attr("transform", "rotate(-90)")
    .text(" Max STW Time (ms)")
    .attr("font-size", 13)
    .attr("fill", "black");

  // GC name
  svg.append("text")
    .attr("class", "gc-name")
    .attr("text-anchor", "end")
    .attr("y", height)
    .attr("dy", ".50em")
    .attr("x", -250)
    .attr("transform", "rotate(-90)")
    .text(`${gcName}`)
    .attr("font-size", 15)
    .attr("fill", "black");


  // x axis
  const x = d3.scaleBand()
    .range([1, width / 1.2])
    .domain(data.map((data, index) => (index + 1).toString()));
  svg.append("g")
    .attr("transform", `translate(0, ${height})`)
    .call(d3.axisBottom(x))
    .selectAll("text")
    .attr("transform", "translate(-10,0)rotate(-45)")
    .style("text-anchor", "end");

// Add Y axis
  const y = d3.scaleLinear()
    .domain([0, d3.max(data)!*2])
    .range([height, 0]);
  svg.append("g")
    .call(d3.axisLeft(y));

// Bars
  svg.selectAll("mybar")
    .data(data)
    .join("rect")
    .attr("x", (d, i) => x((i + 1).toString()) as unknown as string)
    .attr("y", d => y(d))
    .attr("width", x.bandwidth() - 1)
    .attr("height", d => height - y(d))
    .attr("fill", "#488c7d");

}

function createReqChart(reqData: number[], gcName: string) {
  let margin = { top: 10, right: 30, bottom: 30, left: 40 },
    width = 480 - margin.left - margin.right,
    height = 400 - margin.top - margin.bottom;

  let svg = d3.select("#req-graph")
    .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform",
      "translate(" + 80 + ")");

  // label x axis
  svg.append("text")
    .attr("class", "x label")
    .attr("text-anchor", "end")
    .attr("x", width / 2)
    .attr("y", 390)
    .text("Test Number GC")
    .attr("font-size", 13)
    .attr("fill", "black");

  // label y axis
  svg.append("text")
    .attr("class", "y label")
    .attr("text-anchor", "end")
    .attr("y", -60)
    .attr("dy", ".50em")
    .attr("x", -100)
    .attr("transform", "rotate(-90)")
    .text(" Max STW Time (ms)")
    .attr("font-size", 13)
    .attr("fill", "black");

  // GC name
  svg.append("text")
    .attr("class", "gc-name")
    .attr("text-anchor", "end")
    .attr("y", height)
    .attr("dy", ".50em")
    .attr("x", -250)
    .attr("transform", "rotate(-90)")
    .text(`${gcName}`)
    .attr("font-size", 15)
    .attr("fill", "black");

  const subgroups = 3

  // // List of groups = species here = value of the first column called group -> I show them on the X axis
  // const groups = data.map(d => d.group)
  //
  // console.log(groups)
  //
  // // Add X axis
  // const x = d3.scaleBand()
  //   .domain(groups)
  //   .range([0, width])
  //   .padding([0.2])
  // svg.append("g")
  //   .attr("transform", `translate(0, ${height})`)
  //   .call(d3.axisBottom(x).tickSize(0));
  //
  // // Add Y axis
  // const y = d3.scaleLinear()
  //   .domain([0, 40])
  //   .range([ height, 0 ]);
  // svg.append("g")
  //   .call(d3.axisLeft(y));
  //
  // // Another scale for subgroup position?
  // const xSubgroup = d3.scaleBand()
  //   .domain(subgroups)
  //   .range([0, x.bandwidth()])
  //   .padding([0.05])
  //
  // // color palette = one color per subgroup
  // const color = d3.scaleOrdinal()
  //   .domain(subgroups)
  //   .range(['#e41a1c','#377eb8','#4daf4a'])
  //
  // // Show the bars
  // svg.append("g")
  //   .selectAll("g")
  //   // Enter in data = loop group per group
  //   .data(data)
  //   .join("g")
  //   .attr("transform", d => `translate(${x(d.group)}, 0)`)
  //   .selectAll("rect")
  //   .data(function(d) { return subgroups.map(function(key) { return {key: key, value: d[key]}; }); })
  //   .join("rect")
  //   .attr("x", d => xSubgroup(d.key))
  //   .attr("y", d => y(d.value))
  //   .attr("width", xSubgroup.bandwidth())
  //   .attr("height", d => height - y(d.value))
  //   .attr("fill", d => color(d.key));

}

</script>

<style scoped>
#graph {
  margin-top: 20px;
}

#heatmap {
  margin-top: 20px;
}

#container {
  display: flex;
  justify-content: left;
}
</style>
