import { Divider, Drawer, Group, Paper, Button, Title, Tooltip } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import emitter from "../eventemitter";
import { useState } from "react";
import { emit } from "process";

const label = "Upload a JSON file to exclude directories nodes in the view"
+ " and/or "
+ " mark signifcant events in the progress bar"

export default function RightBar() {
  const [opened, { open, close }] = useDisclosure(false);
  const [dayInformation, setDayInformation] = useState(null)
  const [commitsByDay, setCommitsByDay] = useState(null)
  const [contributors, setContributors] = useState(null)
  const [commitShas, setcommitShas] = useState(null)



  emitter.addListener("commitsByDay", value => {
    setCommitsByDay(value)
    let dates = Object.keys(value)
    let day1 = dates[0]
    // setDayInformation(value[0])
    setContributors(Object.keys(value[day1].contributors))
    setcommitShas(value[day1].commitShas)
  });


    emitter.addListener("changValues", ({key}) => {
    if (commitsByDay) {
      setContributors(Object.keys(commitsByDay[key].contributors))
      setcommitShas(commitsByDay[key].commitShas)
    }
  })


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
            {commitShas ? commitShas.map((value) => {
              return (
                <div className="bg-Primary">{value.substring(0, 8)}</div>
              )
            }) : null}
          </div>
          <Divider />
          <div className="bg-Secondary p-3 flex flex-col justify-between ">
            <p className="text-[20px] text-[#495057] mb-3">Contributors </p>
            {contributors ? contributors.map((value) => {
              return (
                <div className="bg-Primary">{value}</div>
              )
            }) : null}
          </div>
          <Divider />
          <Divider />
        </Paper>

      </div>
    </>
  );
}
