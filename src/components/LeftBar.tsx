import Image from "next/image";
import { useContext, useEffect, useRef, useState } from "react";
// import UploadService from "../services/UploadService";
import { analyseRepoDeltaDates, repoDates } from "../services/UploadService";
import emitter from "../eventemitter";
import {
  Button,
  Divider,
  Group,
  LoadingOverlay,
  Paper,
  Select,
  TextInput,
  Tooltip,
} from "@mantine/core";
import { ReposContext, storedRepos } from "../pages";
import { useForm } from "@mantine/form";
import * as validUrl from "valid-url";


import useRepoLocalStorage from "../hooks/useRepoDates";
import LocalRepoData from "../types/LocalRepoData.type";

interface FromValues {
  repoURL: string;
  branch: string;
  fromDate: string;
  toDate: string;
  config: File | null;
}

export default function LeftBar() {
  const [repoName, setRepoName] = useState<string | null>("Repository");
  // const [repoURL, setRepoURL] = useState("");
  const [dates, setDates] = useState<null | string[]>(null);
  const [branches, setBranches] = useState<null | string[]>(null);
  const [currentBranch, setCurrentBranch] = useState<null | string>(null);
  const [loading, setLoading] = useState(false);
  // const [fromDate, setFromDate] = useState<null | string>(null);
  // const [toDate, setToDate] = useState<null | string>(null);
  const [required, setRequired] = useState<boolean>(false);

  // let disableAnalyseButton = useRef<boolean>(true);
  // let currentBranchRef = useRef<string | null>(null);
  let fromDateRef = useRef<string | null>(null);
  let toDateRef = useRef<string | null>(null);
  // let urlRef = useRef<string | null>(null);

  const [showDateMenu, toggleDateMenu] = useState(false);
  const { state, dispatch } = useContext(ReposContext);

  const onRepoUpload = async (values: FromValues) => {
    setLoading(true);
    if (values.branch != "" && values.toDate != "") {

      // const response = await fetch('/api/repoDelta', {
      //   method: 'POST',
      //   body: JSON.stringify({
      //     url: values.repoURL,
      //     branch: values.branch,
      //     deltaDates: { start: values.fromDate, finish: values.toDate }
      //   })
      // })

      let response = await analyseRepoDeltaDates(
        values.repoURL,
        { start: values.fromDate, finish: values.toDate },
        values.branch,
        dispatch
      );
      if (response) {
        const { repoURL, repoDates } = response
        // const dayInformation = repoDates.commitsByDay
        emitter.emit("RepoAnalaysed", repoDates.cleanData);
        emitter.emit("commitsByDay", repoDates.commitsByDay)


        if (values.config) {
          let keys = repoDates;
        }
      }
    } else {
      let { repoName, dates, branches, main } = await repoDates(
        values.repoURL,
        values.branch
      );
      setRepoName(repoName);
      setDates(Object.keys(dates));
      setBranches(branches);
      form.setFieldValue("branch", main);
      setCurrentBranch(main);
      setRequired(true);
      // sessionStorage.setItem(String(repoName) +  String(main), JSON.stringify(Object.keys(dates)))
      // currentBranchRef.current = main;
      // console.log(response);
    }
    setLoading(false);
  };

  // const changeBranch = async (branchName: string) => {};

  const form = useForm({
    initialValues: {
      repoURL: "",
      branch: "",
      fromDate: "",
      toDate: "",
      config: null as File | null,
    },
    validate: {
      repoURL: (value) => (validUrl.isHttpsUri(value) ? null : "invalid url"),
      fromDate: (value) => {
        if (toDateRef.current == "") {
          return null;
        } else if (new Date(value) > new Date(toDateRef.current!)) {
          return "From Date, must not be greater than to Date";
        }
      },
      toDate: (value) => {
        if (new Date(value) < new Date(fromDateRef.current!)) {
          return "To Date, must not be less than From Date";
        }
      },
    },
  });

  return (
    <div className="w-1/4 grid grid-rows-2 gap-3">
      <Paper shadow="md" radius="lg" p="xl">
        <LoadingOverlay visible={loading} overlayBlur={2} />
        <div className="grid grid-cols-1 ">
          <form onSubmit={form.onSubmit((values) => onRepoUpload(values))}>
            <div className="bg-Secondary p-3 flex flex-row justify-between ">
              <p className="text-[32px] text-[#495057]" />
              <Select
                disabled={!dates}
                data={[]}
                placeholder="Change Repository"
                label={repoName}
                variant="filled"
                radius="md"
                size="md"
                style={{ width: "100%" }}
                styles={() => {
                  return {
                    label: {
                      fontSize: "30px",
                      fontWeight: 400,
                      marginBottom: "15px",
                    },
                    root: {
                      textAlign: "center",
                      textOverflow: "ellipsis",
                    },
                  };
                }}
              />
            </div>

            <Divider />
            <div className="p-3 flex flex-row justify-between bg-Secondary">
              <Tooltip label="Insert a public github repository URL">
                <TextInput
                  label="Repository URL"
                  placeholder="URL"
                  // error="Invalid URL"
                  required
                  onChange={(value) => {
                    setDates(null);
                    form.setFieldValue("repoURL", value.currentTarget.value);
                  }}
                  // {...form.getInputProps('repoURL')}
                />
              </Tooltip>
            </div>
            <div>
              <div className="bg-Secondary p-3 grid grid-row-2 gap-3 justify-between">
                <Select
                  disabled={!branches}
                  data={branches ?? []}
                  placeholder={currentBranch ?? "branch"}
                  // label="From"
                  variant="filled"
                  radius="md"
                  size="md"
                  required={required}
                  // onInput={() => alert("Input changed")}
                  // onChange={(value) => changeBranch(value!)}
                  style={{ width: "100%" }}
                  onChange={(value) => {
                    setDates(null);
                    setRequired(false);
                    form.setFieldValue("fromDate", "");
                    form.setFieldValue("toDate", "");
                    form.setFieldValue("branch", value!);
                  }}
                  // {...form.getInputProps("branch")}
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
                  required={required}
                  // onChange={(value) => changeRepoDateAnalysis(value!)}
                  style={{ width: "100%" }}
                  // {...form.getInputProps("fromDate")}
                  onChange={(value) => {
                    form.setFieldValue("fromDate", value!);
                    fromDateRef.current = value;
                  }}
                />
                <Select
                  disabled={!dates}
                  data={dates ?? []}
                  placeholder="Repository date"
                  label="To"
                  variant="filled"
                  radius="md"
                  size="md"
                  required={required}
                  // onChange={(value) => changeRepoDateAnalysis(value!)}
                  style={{ width: "100%" }}
                  // {...form.getInputProps("toDate")}
                  onChange={(value) => {
                    form.setFieldValue("toDate", value!);
                    toDateRef.current = value;
                  }}
                />
              </div>
            </div>
            <Divider />

            <Group className="flex justify-center">
              <Button variant="white" type="submit">
                Analyse
              </Button>
            </Group>

            <Divider />

            <div className="my-5">
              <div className="mt-5 mb-5">Configuration</div>
              <input
                type="file"
                onChange={(event) => {
                  const file =
                    event.currentTarget.files && event.currentTarget.files[0];
                  form.setFieldValue("config", file || null);
                }}
                name="uploadFile"
                accept=".json"
              />

              <div className="flex justify-center">
                <Button variant="white" type="submit">
                  Add Config
                </Button>
              </div>
            </div>


          </form>
        </div>
      </Paper>
    </div>
  );
}
