import {
  Divider,
  Drawer,
  Group,
  Paper,
  Button,
  Title,
  Tooltip,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import emitter from "../eventemitter";
import { useEffect, useState } from "react";
import { emit } from "process";
import { useRecoilState, useRecoilValue } from "recoil";
import {
  currentDateState,
  repoStoreItemFamily,
  CurrentRepoKeyState,
} from "../atoms";

const label =
  "Upload a JSON file to exclude directories nodes in the view" +
  " and/or " +
  " mark signifcant events in the progress bar";

export default function RightBar() {
  const [contributors, setContributors] = useState(null);
  const [commitShas, setcommitShas] = useState(null);

  const [currentDate, setCurrentDate] = useRecoilState(currentDateState);
  const [repoKeyState, setCurrentRepoKeyState] =
    useRecoilState(CurrentRepoKeyState);
  const storeItem = useRecoilValue(repoStoreItemFamily(repoKeyState));

  useEffect(() => {
    if (storeItem?.commitsByDay) {
      setContributors(
        Object.keys(storeItem.commitsByDay[currentDate].contributors)
      );
      setcommitShas(storeItem.commitsByDay[currentDate].commitShas);
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
            <p className="text-[20px] text-[#495057] mb-3">Commits </p>
            {commitShas
              ? commitShas.map((value) => {
                  return (
                    <div className="bg-Primary">{value.substring(0, 8)}</div>
                  );
                })
              : null}
          </div>
          <Divider />
          <div className="bg-Secondary p-3 flex flex-col justify-between ">
            <p className="text-[20px] text-[#495057] mb-3">Contributors </p>
            {contributors
              ? contributors.map((value) => {
                  return <div className="bg-Primary">{value}</div>;
                })
              : null}
          </div>
          <Divider />
          <Divider />
        </Paper>
      </div>
    </>
  );
}
