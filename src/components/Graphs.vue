<template>
  <div v-for="stwMaxTime of stwMaxTimes">
    STW total time: {{ stwMaxTime.stwTotalTime }} ms
  </div>
  <div id="graph">
  </div>
</template>

<script setup lang="ts">

import { contentStore } from "@/stores/content";
import { onMounted, ref } from "vue";
import { FileAnalyzer } from "@/service/FileAnalyzer";
import { message } from "ant-design-vue";
import * as d3 from "d3";
import { GcContentFile } from "@/models/GcContentFile";

const logFiles = contentStore();
const stwMaxTimes = ref<GcContentFile[]>([]);

onMounted(() => {
  logFiles.$onAction((context) => {
    if (context.name === "createGraphEvent" && stwMaxTimes.value.length > 0) {
      createHistogram(stwMaxTimes.value.map(it => it.stwTotalTime), stwMaxTimes.value[0].gcName);
    }
  });
  logFiles.$subscribe((mutation, state) => {
    if (mutation.type === "direct" && stwMaxTimes.value.length > state.contents.length) {
      stwMaxTimes.value = [];
      fillStwMaxTimes();
    }
    if (mutation.type === "direct" && stwMaxTimes.value.length < state.contents.length) {
      const logfileContent = logFiles.contents[logFiles.contents.length - 1].content;
      if (FileAnalyzer.readTotalPauseTime(logfileContent) !== null)
        stwMaxTimes.value.push(FileAnalyzer.readTotalPauseTime(logfileContent)!);
      else message.error("Unknown GC");
    }
  });
});

function fillStwMaxTimes() {
  logFiles.contents.forEach(contentEntry => {
    if (FileAnalyzer.readTotalPauseTime(contentEntry.content) !== null)
      stwMaxTimes.value.push(FileAnalyzer.readTotalPauseTime(contentEntry.content)!);
    else message.error("Unknown GC");
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
    .text("Testnumber")
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
    .domain([0, d3.max(data)!])
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


</script>
