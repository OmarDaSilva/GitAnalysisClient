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
  const [showLoader, toggleLoader] = useState(false);

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
        {!currentRepoKey ? (
          <div className="text-black w-[100%] h-[400px] text-center bg-[#222222] text-white flex flex-col">

            <p>
              Visit https://github.com/OmarDaSilva/GitAnalysisClient
            </p>

            <br />

            <p>
              Submit  github repository URL to fetch dates to get started
            </p>

          </div>
        ) : null}
      </div>
      <VideoController />
    </div>
  );
}
