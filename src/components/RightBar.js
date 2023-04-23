import { Divider, Paper } from "@mantine/core";
import { useEffect, useState } from "react";
import { useRecoilState, useRecoilValue } from "recoil";
import {
  currentDateState,
  repoStoreItemFamily,
  CurrentRepoKeyState,
  FileColourLegendState,
} from "../atoms";

const dict = {
  0: "#FFA500",
  1: "#32CD32",
  2: "#FF69B4",
  3: "#8A2BE2",
  4: "#00FFFF",
  5: "#FFD700",
  6: "#D2691E",
  7: "#ADFF2F",
  8: "#FF4500",
  9: "#BA55D3",
};

export default function RightBar() {
  const [contributors, setContributors] = useState(null);
  const [commitShas, setcommitShas] = useState(null);

  const [currentDate, setCurrentDate] = useRecoilState(currentDateState);
  const [repoKeyState, setCurrentRepoKeyState] =
    useRecoilState(CurrentRepoKeyState);
  const [fileColourLegend, setFileColourLegendState] = useRecoilState(
    FileColourLegendState
  );
  const storeItem = useRecoilValue(repoStoreItemFamily(repoKeyState));

  const sortExtensionColours = (extensionList) => {
    const extensionDict = {};

    let extensionsKeys = Object.entries(extensionList);

    for (const [key, value] of extensionsKeys) {
      if (extensionDict[value.indexOfExtension] == undefined) {
        extensionDict[value.indexOfExtension] = {
          extensions: [key],
          total: value.totalNumber,
        };
      } else {
        extensionDict[value.indexOfExtension].extensions.push(key);
        extensionDict[value.indexOfExtension].total =
          extensionDict[value.indexOfExtension].total + value.totalNumber;
      }
    }

    return extensionDict;
  };

  useEffect(() => {
    if (storeItem?.commitsByDay) {
      setContributors(
        Object.keys(storeItem.commitsByDay[currentDate].contributors)
      );
      setcommitShas(storeItem.commitsByDay[currentDate].commitShas);
      let fileColourLegend = sortExtensionColours(
        storeItem.cleanData.fileIndex[currentDate]
      );
      setFileColourLegendState(fileColourLegend);
    }
  }, [storeItem, currentDate]);

  return (
    <>
      <div className="w-1/4 grid grid-rows-2 gap-2">
        <Paper shadow="md" radius="lg" p="xl">
          <div className="bg-Secondary p-3 flex flex-col justify-between ">
            <p className="text-[20px] text-[#495057] mb-3">File changes</p>
            <div className="bg-Primary">Hello</div>
          </div>
          <Divider />

          <div className="bg-Secondary p-3 flex flex-col justify-between ">
            <p className="text-[20px] text-[#495057] mb-3">File colours</p>
            <div className="bg-Primary">
              {fileColourLegend
                ? Object.entries(fileColourLegend).map(([key, value]) => {
                    return (
                      <div className="text-right" style={{ backgroundColor: dict[key] }}>
                        <p>
                          {value.extensions.toString()}
                        </p>
                        <p>
                          {value.total}
                        </p>
                        </div>
                    );
                  })
                : null}
            </div>
          </div>

          <Divider />

          <div className="bg-Secondary p-3 flex flex-col justify-between ">
            <p className="text-[20px] text-[#495057] mb-3">Commit </p>
            {commitShas
              ? commitShas.map((value) => {
                  return (
                    <div className="bg-Primary">{value.substring(0, 8)}</div>
                  );
                })
              : null}
          </div>
          <Divider />
          {

          <div className="bg-Secondary p-3 flex flex-col justify-between ">
            <p className="text-[20px] text-[#495057] mb-3">Contributors </p>
            {contributors
              ? contributors.map((value) => {
                  return <div className="bg-Primary">{value}</div>;
                })
              : null}
          </div>
          }
          <Divider />
          <Divider />
        </Paper>
      </div>
    </>
  );
}
