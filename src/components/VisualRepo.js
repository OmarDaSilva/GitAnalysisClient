import ForceGraph from "./ForceGraph";
import Graphdata from "../data/data.json";
import { useContext, useEffect, useState } from "react";
import Filter from "./Filter";
import { Button, Loader, LoadingOverlay } from "@mantine/core";
import { ReposContext } from "../pages";
import Image from "next/image";
import VideoController from "../components/VideoController";
import emitter from "../eventemitter";
import { useRecoilState, useResetRecoilState, useRecoilValue } from "recoil";
import {
  CurrentRepoKeyState,
  repoStoreItemFamily,
  currentDateState,
} from "../atoms";

export default function VisualRepo() {
  const [data, setData] = useState(null);
  // const [currentDate, setCurrentDate] = useState(null);
  const [dates, setDates] = useState(null);
  const [dateAnalysis, setDateAnalysis] = useState(null);
  const [showLoader, toggleLoader] = useState(false);
  const [currentCount, setCurrentCount] = useState(0);
  const { state, dispatch } = useContext(ReposContext);

  const [currentDateRecoil, setCurrentDateRecoil] =
    useRecoilState(currentDateState);

  const [currentRepoKey, setCurrentRepoKey] =
    useRecoilState(CurrentRepoKeyState);
  const [repoStore, setRepoStoreItemState] = useRecoilState(
    repoStoreItemFamily(currentRepoKey)
  );
  const [currentDate, setCurrentDateState] = useRecoilState(currentDateState);
  const repoItem = useRecoilValue(repoStoreItemFamily(currentRepoKey));

  const generateVisualAnalysis = (value) => {
    const chart = ForceGraph(value, {
      nodeId: (d) => d.id,
      nodeName: (d) => d.name,
      nodeGroup: (d) => d.group,
      nodeTitle: (d) => `${d.name }\n${d.group}`,
      linkStrokeWidth: (l) => Math.sqrt(l.value),
    });

    const parent = document.getElementById("graph");
    const oldChart = parent.querySelector("svg");

    if (oldChart) {
      parent.replaceChild(chart, oldChart);
    } else {
      parent.appendChild(chart);
    }
  };

  useEffect(() => {
    if (currentRepoKey) {
      generateVisualAnalysis(repoItem.cleanData.dataFormatted[currentDate]);
      toggleLoader(false);
    }
  }, [repoStore, currentDate]);

  return (
    <div className="w-3/4 p-4 pt-0 flex flex-col relative">
      <LoadingOverlay visible={showLoader} overlayBlur={2} />
      <div id="graph" className="bg-white border-[#e6e6e6] border-2	">
        {!data ? (
          <div className="text-black">Upload a rpository to get started</div>
        ) : null}
      </div>
      <VideoController />
    </div>
  );
}
