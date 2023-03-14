import Image from "next/image";
import { useContext, useRef, useState } from "react";
import UploadService from "../services/UploadService";
import { repoDates } from "../services/UploadService";
import emitter from "../eventemitter";
import { Divider, Paper, Select } from "@mantine/core";
import { ReposContext, storedRepos } from "../pages";

import useRepoLocalStorage from '../hooks/useRepoDates'
import LocalRepoData from "../types/LocalRepoData.type";

export default function LeftBar() {
  const [repoName, setRepoName] = useState<string | null>("Repository");
  const inputRepo = useRef<HTMLInputElement | null>(null);

  const [dates, setDates] = useState<null | string[]>(null);
  const [showDateMenu, toggleDateMenu] = useState(false);
  const { state, dispatch } = useContext(ReposContext);
  

  // emitter.addListener("RepoAnalysedDates", (data: storedRepos) => {
  //   const dates = data.map((date) => {
  //     return {
  //       value: date,
  //       label: date,
  //     };
  //   });
  //   setData(dates);
  // });

  // emitter.addListener('RepoAnalysis', (repoName: string) => {
  //   setRepoName(repoName);

  //   const repoCommitDates
  // })

  // const changeRepoDateAnalysis = (date: string) => {
  //   emitter.emit("RepoDateAnalaysisChange", state.repos[date]);
  // };

  // const changeRepo = (repoName: string) => {
  //   state.repos
  //   emitter.emit("RepoDateAnalaysisChange", state.repos[date]);
  // };

  const onRepoUpload = () => {
    if (inputRepo.current) {
      inputRepo.current.click();
    }
  };

  async function changeRepoName() {
    const uploadedFile = inputRepo.current;
    if (uploadedFile) {
      const filename = uploadedFile!.files![0].name.replace(".zip", "")
      setRepoName(filename);
      emitter.emit("RepoAnalysing");
      await repoDates(uploadedFile!.files![0], filename)
      const myData = JSON.parse(sessionStorage.getItem(filename)!)
      setDates(Object.keys(myData.repoDates))
    }
  }

  return (
    <div className="w-1/4 grid grid-rows-2 gap-3">
      <Paper shadow="md" radius="lg" p="xl">
        <div className="grid grid-cols-1 gap-2">
          <div className="bg-Secondary p-3 flex flex-row justify-between ">
            <p className="text-[32px] text-[#495057]" />
              <Select
                disabled={!dates}
                data={dates ?? []}
                placeholder="Change Repository"
                label={repoName}
                variant="filled"
                radius="md"
                size="md"
                // onChange={(value) => changeRepoDateAnalysis(value!)}
                style={{ width: "100%" }}
                styles={() => {
                  return {
                    label: {
                      fontSize: "30px",
                      fontWeight: 400,
                    },
                  };
                }}
              />
            
          </div>
          <Divider />
          <div className="p-3 flex flex-row justify-between bg-Secondary">
            <p className="text-[26px] text-[#495057] ">Add Repo</p>
            <button 
              onClick={() => onRepoUpload()}>
              <Image src="assets/plus-icon.svg" width={25} height={25} alt="" />
              <input
                type="file"
                id="file"
                ref={inputRepo}
                onInput={() => changeRepoName()}
                style={{ display: "none" }}
                accept="zip,application/octet-stream,application/zip,application/x-zip,application/x-zip-compressed"
              />
            </button>
          </div>
          <Divider />
          <div>
            <div className="bg-Secondary p-3 grid grid-row-2 gap-3 justify-between">
              <Select
                disabled={!dates}
                data={dates ?? []}
                placeholder="Branch"
                // label="From"
                variant="filled"
                radius="md"
                size="md"
                // onChange={}
                style={{ width: "100%" }}
              />
            </div>
          </div>

          <Divider />
          <div>
            <div className="bg-Secondary p-3 grid grid-row-2 gap-3 justify-between">
              <Select
                disabled={!dates}
                data={dates ?? []}
                placeholder="Repository date"
                label="From"
                variant="filled"
                radius="md"
                size="md"
                // onChange={(value) => changeRepoDateAnalysis(value!)}
                style={{ width: "100%" }}
              />
              <Select
                disabled={!dates}
                data={dates ?? []}
                placeholder="Repository date"
                label="To"
                variant="filled"
                radius="md"
                size="md"
                // onChange={(value) => changeRepoDateAnalysis(value!)}
                style={{ width: "100%" }}
              />
            </div>
          </div>
          <Divider />
        </div>
      </Paper>

      <Paper shadow="md" radius="lg" p="xl">
        <div className="bg-Secondary p-3 grid grid-row-2 gap-3 justify-between">
          Hierarchical Views
        </div>
        <Divider />
      </Paper>
    </div>
  );
}
