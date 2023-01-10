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
import { Converter } from "@/service/Converter";

const gcLogFiles = gcLogStore();
const gcFilesAnalyzed = ref<GcAnalyzedFile[]>([]);

const requestLogFiles = requestLogStore();
const requestFilesAnalyzed = ref<RequestAnalyzedFile[]>([]);

onMounted(() => {
  // GC stuff
  gcLogFiles.$onAction((context) => {
    if (context.name === "createTotalStwChart") {
      gcFilesAnalyzed.value = [];
      let failed = false;
      gcLogFiles.contents.forEach(contentEntry => {
        if (FileAnalyzer.analyzeGCFile(contentEntry.content, contentEntry.name) !== null)
          gcFilesAnalyzed.value.push(FileAnalyzer.analyzeGCFile(contentEntry.content, contentEntry.name)!);
        else {
          message.error(`Unknown Garbage Collector Log of ${contentEntry.name}`);
          failed = true;
        }
      });
      if (!failed)
        createHistogram(gcFilesAnalyzed.value.map(it => it.stwTotalTime), gcFilesAnalyzed.value[0].gcName);
    }
  });

  // graph stuff
  requestLogFiles.$onAction((context) => {
    if (context.name === "createRequestChart") {
      requestFilesAnalyzed.value = [];
      let failed = false;
      requestLogFiles.contents.forEach(contentEntry => {
        const valid = FileAnalyzer.analyzeRequestFile(contentEntry.content, contentEntry.name);
        if (valid !== null)
          requestFilesAnalyzed.value.push(valid);
        else {
          message.error(`Unknown File ${contentEntry.name}, use Gatling Logs`);
          failed = true;
        }
      });
      if (!failed)
        createReqChart(Converter.convertForD3Use(requestFilesAnalyzed.value));
    }
  });
});

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
    .attr("font-size", 12)
    .attr("fill", "black");

  // label y axis
  svg.append("text")
    .attr("class", "y label")
    .attr("text-anchor", "end")
    .attr("y", -60)
    .attr("dy", ".50em")
    .attr("x", -100)
    .attr("transform", "rotate(-90)")
    .text("STW Total Time (ms)")
    .attr("font-size", 12)
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
    .domain([0, d3.max(data)! * 2])
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

function createReqChart(data: any[]) {

  let margin = { top: 10, right: 30, bottom: 30, left: 40 },
    width = 480 - margin.left - margin.right,
    height = 400 - margin.top - margin.bottom;

  let svg = d3.select("#req-graph")
    .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", `translate(60,20)`);

  svg.append("text")
    .attr("class", "x label")
    .attr("text-anchor", "end")
    .attr("x", width / 2)
    .attr("y", 380)
    .text("Test Number")
    .attr("font-size", 12)
    .attr("fill", "black");

  // label y axis
  svg.append("text")
    .attr("class", "y label")
    .attr("text-anchor", "end")
    .attr("y", -50)
    .attr("dy", ".50em")
    .attr("x", -100)
    .attr("transform", "rotate(-90)")
    .text(" Response Time (ms)")
    .attr("font-size", 12)
    .attr("fill", "black");

  // List of subgroups = header of the csv files = soil condition here
  const subgroups = ["bestResponses", "goodResponses", "badResponses", "failedResponses"];


  // List of groups = species here = value of the first column called group -> I show them on the X axis
  const groups = data.map(d => d.index);

  // Add X axis
  const x = d3.scaleBand()
    .domain(groups)
    .range([0, width])
    .padding(0.2);
  svg.append("g")
    .attr("transform", `translate(0, ${height})`)
    .call(d3.axisBottom(x).tickSize(0));

  const maxCount = Math.max(...requestFilesAnalyzed.value.map(it => it.returnMaxPropCount()));
  // Add Y axis
  const y = d3.scaleLinear()
    .domain([0, maxCount])
    .range([height, 0]);
  svg.append("g")
    .call(d3.axisLeft(y));

  // Another scale for subgroup position?
  const xSubgroup = d3.scaleBand()
    .domain(subgroups)
    .range([0, x.bandwidth()])
    .padding(0.05);

  // color palette = one color per subgroup
  const color = d3.scaleOrdinal()
    .domain(subgroups)
    .range(["#6ca142", "#e0d558", "#e59058", "#ea4a4a"]);

  // Show the bars
  svg.append("g")
    .selectAll("g")
    // Enter in data = loop group per group
    .data(data)
    .join("g")
    .attr("transform", d => `translate(${x(d.index)}, 0)`)
    .selectAll("rect")
    .data(function(d) {
      return subgroups.map(function(key) {
        return { key: key, value: d[key] };
      });
    })
    .join("rect")
    .attr("x", d => xSubgroup(d.key)!)
    .attr("y", d => y(d.value))
    .attr("width", xSubgroup.bandwidth())
    .attr("height", d => height - y(d.value))
    .attr("fill", d => color(d.key) as string);
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
