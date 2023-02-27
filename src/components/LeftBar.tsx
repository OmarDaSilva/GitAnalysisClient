import Image from "next/image";
import { useRef, useState } from "react";
import UploadService from "../services/UploadService";
import emitter from "../eventemitter";
import { Divider, List, Menu, Paper, Select } from "@mantine/core";

type dateItem = {
  value: string;
  label: string;
};
export default function LeftBar() {
  const [repoName, setRepoName] = useState<String | null>("Repository");
  const inputRepo = useRef<HTMLInputElement | null>(null);

  const [dates, setData] = useState<null | dateItem[]>(null);
  const [showDateMenu, toggleDateMenu] = useState(false);

  emitter.addListener("RepoAnalysedDates", (data: string[]) => {
    const dates = data.map((date) => {
      return {
        value: date,
        label: date,
      };
    });
    setData(dates);
  });

  const changeRepoDateAnalysis = (date: string) => {
    emitter.emit("RepoDateAnalaysisChange", date);
    console.log(date);
  };

  const onRepoUpload = () => {
    if (inputRepo.current) {
      inputRepo.current.click();
    }
  };

  function changeRepoName() {
    const uploadedFile = inputRepo.current;
    if (uploadedFile) {
      setRepoName(uploadedFile!.files![0].name.replace(".zip", ""));
      UploadService(uploadedFile!.files![0]);
    }
  }

  return (
    <div className="w-1/4">
      <Paper shadow="md" radius="lg" p="xl">
        <div className="grid grid-cols-1 gap-2">
          <div className="bg-Secondary p-3 flex flex-row justify-between ">
            <p className="text-[32px] text-[#495057]">{repoName}</p>
          </div>
          <Divider />
          <div className="p-3 flex flex-row justify-between bg-Secondary">
            <p className="text-[26px] text-[#495057] ">Add Repo</p>
            <button onClick={() => onRepoUpload()}>
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
          <div className="bg-Secondary p-3 flex flex-row justify-between ">
            <p className="text-[20px] text-[#495057]">Event: Merge</p>
          </div>
          <Divider />
          <div>
            <div className="bg-Secondary p-3 flex flex-row justify-between">
              <Select
                disabled={!dates}
                data={dates ?? []}
                placeholder="Repository date"
                // label="Repository date changes"
                variant="filled"
                radius="md"
                size="md"
                onChange={(value) => changeRepoDateAnalysis(value!)}
                style={{ width: "100%" }}
              />
            </div>
          </div>
          <Divider />
          <div className="bg-Secondary p-3 flex flex-col justify-between ">
            <p className="text-[20px] text-[#495057] mb-3">File changes</p>
            <div className="bg-Primary">Hello</div>
          </div>
          <Divider />
          <div className="bg-Secondary p-3 flex flex-col justify-between ">
            <p className="text-[20px] text-[#495057] mb-3">Commit Details</p>
            <div className="bg-Primary">Hello</div>
          </div>
          <Divider />
        </div>
      </Paper>
    </div>
  );
}
