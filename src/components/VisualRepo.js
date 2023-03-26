import ForceGraph from "./ForceGraph";
import Graphdata from "../data/data.json";
import { useContext, useEffect, useState } from "react";
import emitter from "../eventemitter";
import Filter from "./Filter";
import { Button, Loader, LoadingOverlay } from "@mantine/core";
import { ReposContext } from "../pages";
import Image from "next/image";

export default function VisualRepo() {
  const [data, setData] = useState(null);
  const [date, setDate] = useState(false);
  const [showLoader, toggleLoader] = useState(false);
  const { state, dispatch } = useContext(ReposContext);

  let currentDate;

  emitter.addListener("RepoAnalaysed", (data) => {
    setData(data);
  });

  emitter.addListener("RepoAnalysing", () => {
    toggleLoader(true);
  });

  emitter.addListener("RepoDateAnalaysisChange", (data) => {
    toggleLoader(true);
    setDate(true);
    setData(data);
  });

  useEffect(() => {
    if (data) {
      toggleLoader(false);

      const chart = ForceGraph(data, {
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
  }, [data]);

  return (
    <div className="w-3/4 p-4 pt-0 flex flex-col relative">
      <LoadingOverlay visible={showLoader} overlayBlur={2} />
      {/* <Filter /> */}
      <div id="graph" className="bg-white border-[#e6e6e6] border-2	">
        {!data ? (
          <div className="text-black">Upload a repository to get started</div>
        ) : null}
      </div>

      <div className="grid grid-cols-1 gap-5 mt-5">
        <div className="flex justify-center">Current Date:</div>

        <div className="flex flex-col">
          <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700 flex flex-row">
            <div
              className="bg-blue-600 h-2.5 rounded-full"
              style={{ width: "30%" }}
            ></div>
            <div
              className="bg-purple-600 h-2.5 rounded-full dark:bg-purple-500"
              style={{ width: "40%" }}
            ></div>
          </div>
        </div>
        
        <div className="w-[100%] flex justify-center">
        <div className="flex justify-between w-[50%]">
          <Image src="/assets/backward.svg" width={30} height={30} />
          <Image src="/assets/rewind.svg" width={30} height={30} />
          <Image src="/assets/pause.svg" width={30} height={30} />
          <Image src="/assets/play.svg" width={30} height={30} />
          <Image src="/assets/flash forward.svg" width={30} height={30} />

          <Image src="/assets/forward.svg" width={30} height={30} />
        </div>
        </div>
      </div>
    </div>
  );
}
