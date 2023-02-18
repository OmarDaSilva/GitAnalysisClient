import ForceGraph from "./ForceGraph";
import data from '../data/data.json';
import { useEffect, useRef, useLayoutEffect } from "react";
import { createRoot } from 'react-dom/client';
import Filter from "./Filter";

export default function VisualRepo() {
  // const [visual, setVis] = useRef(null)
  
  useEffect(() => {
    console.log('UseEffect');
    const chart = ForceGraph(data, {
      nodeId: d => d.id,
      nodeGroup: d => d.group,
      nodeTitle: d => `${d.id}\n${d.group}`,
      linkStrokeWidth: l => Math.sqrt(l.value),
      width: 500,
      height: 600,
    })

    document.getElementById("graph").appendChild(chart)
  }, [])

  return (

    <div className="w-3/4 p-4 pt-0 flex flex-col grid grid-cols-1 gap-3">
      <Filter />
      <div id="graph" className="bg-white"/>
    </div>
  );
}
