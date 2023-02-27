import ForceGraph from "./ForceGraph";
import Graphdata from "../data/data.json";
import { useEffect, useState } from "react";
import emitter from "../eventemitter";

import Filter from "./Filter";

export default function VisualRepo() {
  const [data, setData] = useState(null);
  
  emitter.addListener("RepoAnalaysed", (data) => {
    setData(data);
  });
  // const [visual, setVis] = useRef(null)

  useEffect(() => {
    if (data) {
      let dates = Object.keys(data);
      let firstDate = dates[0];
      const LinkNodes = data[firstDate];

      const chart = ForceGraph(LinkNodes, {
        nodeId: (d) => d.id,
        nodeGroup: (d) => d.group,
        nodeTitle: (d) => `${d.id}\n${d.group}`,
        linkStrokeWidth: (l) => Math.sqrt(l.value),
        width: 500,
        height: 600,
      });

      const parent = document.getElementById("graph");
      const oldChart = parent.querySelector("svg");

      if (oldChart) {
        parent.replaceChild(chart, oldChart);
      } else {
        parent.appendChild(chart)
      }
    }
  }, [data]);

  return (
    <div className="w-3/4 p-4 pt-0 flex flex-col grid grid-cols-1 gap-3">
      <Filter />
      <div id="graph" className="bg-white">
        {!data ? (
          <div className="text-black">Upload a repository to get started</div>
        ) : null}
      </div>
    </div>
  );
}
