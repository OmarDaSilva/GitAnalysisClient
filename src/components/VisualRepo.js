import ForceGraph from "./ForceGraph";
import Graphdata from "../data/data.json";
import { useContext, useEffect, useState } from "react";
import Filter from "./Filter";
import { Button, Loader, LoadingOverlay } from "@mantine/core";
import { ReposContext } from "../pages";
import Image from "next/image";
import VideoController from "../components/VideoController"
import emitter from "../eventemitter";

export default function VisualRepo() {
  const [data, setData] = useState(null);
  const [currentDate, setCurrentDate] = useState(null);
  const [dates, setDates] = useState(null);
  const [dateAnalysis, setDateAnalysis] = useState(null);
  const [showLoader, toggleLoader] = useState(false);
  const [currentCount, setCurrentCount] = useState(0)
  const { state, dispatch } = useContext(ReposContext);



  const generateVisualAnalysis = (value) => {
    const chart = ForceGraph(value, {
      nodeId: (d) => d.id,
      nodeName: (d) => d.name,
      nodeGroup: (d) => d.group,
      nodeTitle: (d) => `${d.name}\n${d.group}`,
      linkStrokeWidth: (l) => Math.sqrt(l.value),
    });

    const parent = document.getElementById("graph");
    const oldChart = parent.querySelector("svg");

    if (oldChart) {
      parent.replaceChild(chart, oldChart);
    } else {
      parent.appendChild(chart);
    }
  }

  emitter.addListener("RepoAnalaysed", (data) => {
    setData(data);
    const dates = Object.keys(data);
    
    setCurrentDate(dates[0]);
    setDates(dates);  
    setDateAnalysis(data[dates[0]]);
    emitter.emit("videoData", data)
    console.log(data);
  });


  emitter.addListener("onPlay", (value) => {
    toggleLoader(true)
    
    generateVisualAnalysis(value.data)
    toggleLoader(false)
  })

  emitter.addListener("onRestart", (value) => {
    if (value != null) {
      toggleLoader(true)
      generateVisualAnalysis(value.data)
      setCurrentDate(value.key)
      toggleLoader(false)
    }
  })



  useEffect(() => {
    if (dateAnalysis) {
      toggleLoader(false);

      const chart = ForceGraph(dateAnalysis, {
        nodeId: (d) => d.id,
        nodeName: (d) => d.name,
        nodeGroup: (d) => d.group,
        nodeTitle: (d) => `${d.name}\n${d.group}`,
        linkStrokeWidth: (l) => Math.sqrt(l.value),
      });

      const parent = document.getElementById("graph");
      const oldChart = parent.querySelector("svg");

      if (oldChart) {
        parent.replaceChild(chart, oldChart);
      } else {
        parent.appendChild(chart);
      }
    } else {
      const chart = ForceGraph(Graphdata, {
        nodeId: (d) => d.id,
        nodeGroup: (d) => d.group,
        nodeTitle: (d) => `${d.name}\n${d.group}`,
        linkStrokeWidth: (l) => Math.sqrt(l.value),
      });

      const parent = document.getElementById("graph");
      const oldChart = parent.querySelector("svg");

      if (oldChart) {
        parent.replaceChild(chart, oldChart);
      } else {
        parent.appendChild(chart);
      }
    }
  }, [data, dateAnalysis, currentDate]);


  return (
    <div className="w-3/4 p-4 pt-0 flex flex-col relative">
      <LoadingOverlay visible={showLoader} overlayBlur={2} />
      {/* <Filter /> */}
      <div id="graph" className="bg-white border-[#e6e6e6] border-2	">
        {!data ? (
          <div className="text-black">Upload a repository to get started</div>
        ) : null}
      </div>

          // probably need to not define any props, cus the props change value, hence cause 
          this component to render,
      <VideoController />

     
    </div>
  );
}
