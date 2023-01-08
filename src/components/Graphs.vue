<template>
  <a-button class="plot-button" @click="showBoxPlot">BoxPlots erstellen</a-button>
  <div v-for="stwMaxTime of stwMaxTimes">
    STW total time: {{ stwMaxTime }} ms
  </div>
  <div id="graph">
  </div>
</template>

<script setup lang="ts">

import { contentStore } from "@/stores/content";
import { onMounted, ref, watch } from "vue";
import { FileAnalyzer } from "@/service/FileAnalyzer";
import { message } from "ant-design-vue";
import * as d3 from "d3";


const logFiles = contentStore();
const stwMaxTimes = ref<number[]>([]);

watch(logFiles.contents, () => {
  const logfileContent = logFiles.contents[logFiles.contents.length - 1].content;
  if (FileAnalyzer.readTotalPauseTime(logfileContent) !== null)
    stwMaxTimes.value.push(FileAnalyzer.readTotalPauseTime(logfileContent)!);
  else message.error("Unknown GC");
});

function showBoxPlot() {
  createHistogram(stwMaxTimes.value)
}

onMounted(()=>{
  let data =  [20, 57, 57, 71, 174, 23, 81]
  createHistogram(data)
})

function createHistogram(data: number[]) {
  // svg attributes
  let margin = { top: 10, right: 30, bottom: 30, left: 40 },
    width = 420 - margin.left - margin.right,
    height = 400 - margin.top - margin.bottom;

  let svg = d3.select("#graph")
    .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform",
      "translate(" + margin.left + "," + margin.top + ")")
  svg.append('text')
    .attr("x", height - 50)
    .attr("y", width)
    .attr("font-size", 12)
    .attr("fill", "black")
    .text("Shenandoah")

  // x axis
  const x = d3.scaleBand()
    .range([ 1, width/1.2 ])
    .domain(data.map((data, index)=>(index+1).toString()))
  svg.append("g")
    .attr("transform", `translate(0, ${height})`)
    .call(d3.axisBottom(x))
    .selectAll("text")
    .attr("transform", "translate(-10,0)rotate(-45)")
    .style("text-anchor", "end");

// Add Y axis
  const y = d3.scaleLinear()
    .domain([0, d3.max(data)!])
    .range([ height, 0]);
  svg.append("g")
    .call(d3.axisLeft(y));

// Bars
  svg.selectAll("mybar")
    .data(data)
    .join("rect")
    .attr("x", (d,i) => x((i + 1).toString()) as unknown as string)
    .attr("y", d => y(d))
    .attr("width", x.bandwidth()-1)
    .attr("height", d => height - y(d))
    .attr("fill", "#488c7d")

}


</script>

<style scoped>
.plot-button {
  margin: 10px;
}
</style>
