<template>
  <!--  <div v-for="stwMaxTime of stwMaxTimes">-->
  <!--    STW total time: {{ stwMaxTime.stwTotalTime }} ms-->
  <!--  </div>-->
  <div id="container">
    <div id="graph"></div>
    <div id="heatmap"></div>
  </div>
</template>

<script setup lang="ts">

import { gcLogStore } from "@/stores/globalStore";
import { onMounted, ref } from "vue";
import { FileAnalyzer } from "@/service/FileAnalyzer";
import { message } from "ant-design-vue";
import * as d3 from "d3";
import { GcAnalyzeFile } from "@/models/GcAnalyzeFile";

const gcLogFiles = gcLogStore();
const stwMaxTimes = ref<GcAnalyzeFile[]>([]);

onMounted(() => {
  gcLogFiles.$onAction((context) => {
    if (context.name === "createGraphEvent" && stwMaxTimes.value.length > 0) {
      createHistogram(stwMaxTimes.value.map(it => it.stwTotalTime), stwMaxTimes.value[0].gcName);
      createHeatMap("test");
    }
  });
  gcLogFiles.$subscribe((mutation, state) => {
    if (mutation.type === "direct" && stwMaxTimes.value.length > state.contents.length) {
      stwMaxTimes.value = [];
      fillStwMaxTimes();
    }
    if (mutation.type === "direct" && stwMaxTimes.value.length < state.contents.length) {
      const logfileContent = gcLogFiles.contents[gcLogFiles.contents.length - 1].content;
      if (FileAnalyzer.readTotalPauseTime(logfileContent) !== null)
        stwMaxTimes.value.push(FileAnalyzer.readTotalPauseTime(logfileContent)!);
      else message.error("Unknown GC");
    }
  });
  createHeatMap("test")
});

function fillStwMaxTimes() {
  gcLogFiles.contents.forEach(contentEntry => {
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

function createHeatMap(gcName: string) {
  // set the dimensions and margins of the graph
  let margin = { top: 10, right: 30, bottom: 30, left: 40 },
    width = 480 - margin.left - margin.right,
    height = 400 - margin.top - margin.bottom;

// append the svg object to the body of the page
  let svg = d3.select("#graph")
    .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform",
      "translate(" + 55 + ")");

  // label x axis
  svg.append("text")
    .attr("class", "x label")
    .attr("text-anchor", "end")
    .attr("x", width - 150)
    .attr("y", 390)
    .text("Server Response Timeouts")
    .attr("font-size", 13)
    .attr("fill", "black");

  // label y axis
  svg.append("text")
    .attr("class", "y label")
    .attr("text-anchor", "end")
    .attr("y", -40)
    .attr("dy", ".50em")
    .attr("x", -100)
    .attr("transform", "rotate(-90)")
    .text(" Test Number GC")
    .attr("font-size", 13)
    .attr("fill", "black");

  // GC name
  svg.append("text")
    .attr("class", "gc-name")
    .attr("text-anchor", "end")
    .attr("y", 415)
    .attr("dy", ".50em")
    .attr("x", -250)
    .attr("transform", "rotate(-90)")
    .text(`${gcName}`)
    .attr("font-size", 15)
    .attr("fill", "black");

// Labels of row and columns
  const myGroups = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J"];
  const myVars = ["v1", "v2", "v3", "v4", "v5", "v6", "v7", "v8", "v9", "v10"];

// Build X scales and axis:
  const x = d3.scaleBand()
    .range([0, width])
    .domain(myGroups)
    .padding(0.01);
  svg.append("g")
    .attr("transform", `translate(0, ${height})`)
    .call(d3.axisBottom(x));

// Build X scales and axis:
  const y = d3.scaleBand()
    .range([height, 0])
    .domain(myVars)
    .padding(0.01);
  svg.append("g")
    .call(d3.axisLeft(y));

// Build color scale
  const myColor = d3.scaleLinear()
    .range(["white", "#b60d0d"])
    .domain([1, 100]);

//Read the data
  d3.csv("https://raw.githubusercontent.com/holtzy/D3-graph-gallery/master/DATA/heatmap_data.csv").then(function(data) {

    svg.selectAll()
      .data(data, function(d) {
        return d.group + ":" + d.variable;
      })
      .join("rect")
      .attr("x", function(d) {
        return x(d.group);
      })
      .attr("y", function(d) {
        return y(d.variable);
      })
      .attr("width", x.bandwidth())
      .attr("height", y.bandwidth())
      .style("fill", function(d) {
        return myColor(d.value);
      });

  });
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
