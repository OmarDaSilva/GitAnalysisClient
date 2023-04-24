import { useRef } from "react";
import emitter from "../eventemitter";
import { Accordion, Button, Divider, Notification, Paper, TextInput } from "@mantine/core";
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
  const [searchError, setSearchError] = useState(false);

  const [currentDate, setCurrentDate] = useRecoilState(currentDateState);
  const [repoKeyState, setCurrentRepoKeyState] =
    useRecoilState(CurrentRepoKeyState);
  const [fileColourLegend, setFileColourLegendState] = useRecoilState(
    FileColourLegendState
  );
  const storeItem = useRecoilValue(repoStoreItemFamily(repoKeyState));
  const searchRef = useRef(null);

  emitter.addListener("ElementNotFound", () => {
    setSearchError(true);
  })

  // window.addEventListener("ElementNotFound", (event) => {
  //   setSearchError(true);
  // });

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

  const searchForNode = () => {
    console.log(searchRef.current.value);
    const event = new CustomEvent("scrollToNode", {
      detail: { nodeName: searchRef.current.value },
    });
    window.dispatchEvent(event);
  };

  useEffect(() => {
    if (storeItem?.commitsByDay) {
      setContributors(
        Object.keys(storeItem.commitsByDay[currentDate].contributors)
      );
      setcommitShas(storeItem.commitsByDay[currentDate].commitShas);
      let fileColourLegendUnSorted = sortExtensionColours(
        storeItem.cleanData.fileIndex[currentDate]
      );

      let fileColourLegend = {};

      Object.entries(fileColourLegendUnSorted).map(([skey, value]) => {
        let key = skey % 10;
        if (fileColourLegend[key] == undefined) {
          fileColourLegend[key] = {
            index: key,
            extensions: [value.extensions.toString()],
            total: value.total,
          };
        } else {
          fileColourLegend[key].extensions = [
            ...fileColourLegend[key].extensions,
            value.extensions.toString(),
          ];
          fileColourLegend[key].total =
            fileColourLegend[key].total + value.total;
        }
      });

      setFileColourLegendState(Object.entries(fileColourLegend));
    }
  }, [storeItem, currentDate]);

  return (
    <>
      <div className="w-1/4 grid grid-rows-2 gap-2">
        <Paper shadow="md" radius="lg" p="xl">
          <div className="bg-Secondary flex flex-col justify-between ">
            <div className="bg-Primary">
              {storeItem?.commitsByDay ? (
                <Accordion defaultValue="commits">
                  <Accordion.Item value="commits">
                    <Accordion.Control>
                      <p className="text-[20px] text-[#495057] mb-3">
                        Commit timeline{" "}
                      </p>
                    </Accordion.Control>
                    <div className="bg-Secondary p-3 flex flex-col justify-between ">
                      {commitShas
                        ? commitShas.map((value) => {
                            return (
                              <Accordion.Panel>
                                <>
                                  <div className="bg-Primary m-2">
                                    <p>{value.commitSha.substring(0, 8)}</p>
                                    <p>{value.authorName}</p>
                                    <p>{value.message}</p>
                                  </div>
                                  <Divider />
                                </>
                              </Accordion.Panel>
                            );
                          })
                        : null}
                    </div>
                  </Accordion.Item>
                </Accordion>
              ) : null}
            </div>
          </div>

          <div className="bg-Secondary mb-5 flex flex-col justify-between ">
            <div className="bg-Primary">
              <Accordion defaultValue="Filecolours">
                <Accordion.Item value="Filecolours">
                  <Accordion.Control>
                    <p className="text-[18px] text-[#495057] mb-3">
                      File colour legend
                    </p>
                  </Accordion.Control>
                  {fileColourLegend ? (
                    <Accordion.Panel>
                      {fileColourLegend.map(([key, value]) => {
                        return (
                          <div
                            className="text-right m-3"
                            style={{
                              background: `linear-gradient(to right, ${dict[key]}, transparent)`,
                            }}
                          >
                            <p>{value.extensions.toString()}</p>
                            <p>{value.total}</p>
                          </div>
                        );
                      })}
                    </Accordion.Panel>
                  ) : null}
                </Accordion.Item>
              </Accordion>
            </div>
          </div>

          <Accordion
            defaultValue="search"
            styles={() => {
              return {
                item: {
                  padding: 0,
                },
              };
            }}
          >
            <Accordion.Item value="search">
              <Accordion.Control>
                <p className="text-[18px] text-[#495057] mb-3">
                  Search for File/Directory
                </p>
              </Accordion.Control>

              {storeItem?.commitsByDay ? (
                <Accordion.Panel>
                  <div>
                    <TextInput
                      label="Search for File/Directory"
                      ref={searchRef}
                    />
                    <Button
                      styles={() => {
                        return {
                          root: {
                            padding: 0,
                          },
                        };
                      }}
                      onClick={searchForNode}
                      variant="white"
                    >
                      Search
                    </Button>
                    {searchError ? (
                      <Notification 
                      title="Directory/File not found!" 
                      color="red"
                      onClose={() => {
                        setSearchError(false)
                      }}
                      />
                    ) : null}
                   
                  </div>
                </Accordion.Panel>
              ) : null}
            </Accordion.Item>
          </Accordion>

          <Divider />
          {/* 
          <div className="bg-Secondary p-3 flex flex-col justify-between ">
            <p className="text-[20px] text-[#495057] mb-3">Commit </p>
            {commitShas
              ? commitShas.map((value) => {
                  return (
                    <div className="bg-Primary">{value.substring(0, 8)}</div>
                  );
                })
              : null}
          </div> */}
          <Divider />

          {
            <div className="bg-Secondary flex flex-col justify-between ">
              <Accordion defaultValue="contributors">
                <Accordion.Item value="contributors">
                  <Accordion.Control>
                    <p className="text-[18px] text-[#495057] mb-3">
                      Contributor Nodes
                    </p>
                  </Accordion.Control>

                  {contributors?.length ? (
                    <Accordion.Panel>
                      {contributors.map((value) => {
                        return <div className="bg-Primary">{value}</div>;
                      })}
                    </Accordion.Panel>
                  ) : (
                    <Accordion.Panel>
                      No contributor nodes configured
                    </Accordion.Panel>
                  )}
                </Accordion.Item>
              </Accordion>
            </div>
          }

          <div>
            <Accordion defaultValue="stats">
              <Accordion.Item value="stats">
                <Accordion.Control>Day Stats</Accordion.Control>
                {storeItem.commitsByDay ? (
                  <Accordion.Panel>
                    <div className="flex flex-row justify-between">
                      <p className="text-green-600">Added lines</p>
                      <p className="text-green-600">
                        +
                        {
                          storeItem.commitsByDay[currentDate].stats
                            .totalAddedCodeLines
                        }
                      </p>
                    </div>
                    <div className="flex flex-row justify-between">
                      <p className="text-red-600">Removed lines</p>
                      <p className="text-red-600">
                        -
                        {
                          storeItem.commitsByDay[currentDate].stats
                            .totalRemovedCodeLines
                        }
                      </p>
                    </div>
                    <div className="flex flex-row justify-between">
                      <p>Deleted Files</p>
                      {storeItem.commitsByDay[currentDate].stats.totalDeleted}
                    </div>
                    <div className="flex flex-row justify-between">
                      <p>Modified files</p>
                      {storeItem.commitsByDay[currentDate].stats.totalModified}
                    </div>
                    <div className="flex flex-row justify-between">
                      <p>Added new files</p>
                      {
                        storeItem.commitsByDay[currentDate].stats
                          .totalNewAddedFiles
                      }
                    </div>
                    <div className="flex flex-row justify-between">
                      <p>File renames</p>
                      {storeItem.commitsByDay[currentDate].stats.totalRenames}
                    </div>
                  </Accordion.Panel>
                ) : null}
              </Accordion.Item>
            </Accordion>
          </div>

          <Divider />
          <Divider />
        </Paper>
      </div>
    </>
  );
}
