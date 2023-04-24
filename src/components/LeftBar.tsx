import { useRef, useState } from "react";
import { analyseRepoDeltaDates, repoDates } from "../services/UploadService";
import {
  Accordion,
  Button,
  Divider,
  Group,
  LoadingOverlay,
  MultiSelect,
  Paper,
  Select,
  TextInput,
  Tooltip,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import * as validUrl from "valid-url";
import { useRecoilState } from "recoil";
import {
  repoStoreItemFamily,
  CurrentRepoKeyState,
  RepoKeysState,
  repoSelector,
  RepoAnalysedState,
  RepoStoreItemDatesState,
} from "../atoms";
import Image from "next/image";
interface FromValues {
  repoURL: string;
  branch: string;
  selectedDates: string[] | null;
  config: File | null;
}

export default function LeftBar() {
  const [repoName, setRepoName] = useState<string | null>("Repository");
  const [dates, setDates] = useState<null | string[]>(null);
  const [branches, setBranches] = useState<null | string[]>(null);
  const [currentBranch, setCurrentBranch] = useState<null | string>(null);
  const [loading, setLoading] = useState(false);
  const [currentRepoDates, setCurrentRepoDates] = useState(null)
  const [currRepoURL, setCurrentRepoURL] = useState(null)

  const [required, setRequired] = useState<boolean>(false);
  let fromDateRef = useRef<string | null>(null);
  let toDateRef = useRef<string | null>(null);
  const [repoKeys, setRepoKeysState] = useRecoilState(RepoKeysState);
  const [currentRepoKey, setCurrentRepoKey] =
    useRecoilState(CurrentRepoKeyState);
  const [repoStore, setRepoStoreItemState] = useRecoilState(
    repoStoreItemFamily(currentRepoKey)
  );

  const [repoStoreDates, setRepoStoreItemDates] = useRecoilState(
    RepoStoreItemDatesState
  );
  const [repoSelectorValue, setRepoSelector] = useRecoilState(repoSelector);
  const [repoAnalysed, setRepoAnalysedState] =
    useRecoilState(RepoAnalysedState);

  const onRepoUpload = async (values: FromValues) => {
    setLoading(true);

    if (values.branch != "" && values.selectedDates) {
      let config = values.config;

      let response = await analyseRepoDeltaDates(
        values.repoURL,
        values.branch,
        config ?? null,
        values.selectedDates
      );
      if (response) {
        const { repoURL, repoDates } = response;
        let repoKey = repoName;

        let events = repoDates?.significantEvents;
        setRepoSelector({ repoKey, repoDates, repoName, events });
      }
    } else {
      let { repoName, dates, branches, main } = await repoDates(
        values.repoURL,
        values.branch
      );
      setRepoStoreItemDates((val) => [
        ...val,
        { name: repoName, dates: dates, branches: branches, main: main, url: values.repoURL },
      ]);
      debugger
      if (currentRepoDates) {
        setCurrentRepoDates(val => [ ...val , repoName])
      } else {
        setCurrentRepoDates([repoName])
      }
      setRepoName(repoName);
      setDates(Object.keys(dates));
      setBranches(branches);
      form.setFieldValue("branch", main);
      setCurrentBranch(main);
      setRepoAnalysedState(true);
      setCurrentRepoURL(values.repoURL)
    }
    setLoading(false);
  };

  const changeRepoSelection = (repoName: string) => {
    const repo = repoStoreDates.filter(repo => repo.name == repoName)[0]
    setRepoName(repoName)
    setDates(Object.keys(repo.dates));
    setBranches(repo.branches);
    setCurrentBranch(repo.main)
    setRepoAnalysedState(true);
    setCurrentRepoURL(repo.url)


    form.setFieldValue("repoURL", repo.url);
    form.setFieldValue("branch", repo.main)
    form.setFieldValue("config", null)


  }

  const form = useForm({
    initialValues: {
      repoURL: "",
      branch: "",
      selectedDates: null as string[] | null,
      config: null as File | null,
    },
    validate: {
      repoURL: (value) => (validUrl.isHttpsUri(value) ? null : "invalid url"),
      selectedDates: (value) =>
        (value === null || value.length === 0) && repoAnalysed
          ? "Please select at least one date"
          : null,
    },
  });

  const readFileAsync = (file: File) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        resolve(reader.result);
      };
      reader.onerror = reject;
      reader.readAsText(file);
    });
  };

  return (
    <div className="w-1/4 grid grid-rows-2 gap-3">
      <Paper shadow="md" radius="lg" p="xl">
        <LoadingOverlay visible={loading} overlayBlur={2} />
        <div className="grid grid-cols-1 ">
          <form onSubmit={form.onSubmit((values) => onRepoUpload(values))}>
            <div className="bg-Secondary  flex flex-row justify-between mb-3 w-full">
              <Accordion mx="auto" defaultValue="selectedRepo" maw={400}>
                <Accordion.Item value="selectedRepo">
                  <Accordion.Control>
                    <p className="text-[22px]">
                      {repoName}

                    </p>
                  </Accordion.Control>
                  <Accordion.Panel>
                    <Select
                      disabled={!dates}
                      data={ currentRepoDates ?? [] }
                      placeholder="Change Repository"
                      variant="filled"
                      radius="sm"
                      size="sm"
                      style={{ width: "100%" }}
                      value={repoName}
                      onChange={(val) => {
                        changeRepoSelection(val)
                      }}
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
                  </Accordion.Panel>
                </Accordion.Item>
              </Accordion>
            </div>

            {!repoAnalysed ? (
              <div className="p-3 flex flex-row justify-between bg-Secondary mb-3">
                <Tooltip label="Insert a public github repository URL">
                  <TextInput
                    label="Repository URL"
                    placeholder="URL"
                    required
                    onChange={(value) => {
                      setDates(null);
                      form.setFieldValue("repoURL", value.currentTarget.value);
                    }}
                  />
                </Tooltip>
              </div>
            ) : (
              <div className="my-3">
                <Button
                  variant="white"
                  leftIcon={
                    <Image
                      src={"/assets/database-plus.svg"}
                      width={20}
                      height={20}
                      alt=""
                    />
                  }
                  onClick={() => {
                    setRepoAnalysedState(false);
                    setRepoName('Repository')
                    form.setFieldValue("branch", "");
                  }}
                >
                  Analyse new repository
                </Button>
              </div>
            )}
            <Divider />

            {repoAnalysed ? (
              <>
                <div>
                  <div className="bg-Secondary p-3 grid grid-row-2 gap-3 justify-between">
                    <Select
                      disabled={!branches}
                      data={branches ?? []}
                      placeholder={currentBranch ?? "branch"}
                      label="Select branch"
                      variant="filled"
                      radius="sm"
                      size="sm"
                      style={{ width: "100%" }}
                      styles={() => {
                        return {
                          label: {
                            fontSize: "14px",
                          },
                        };
                      }}
                      onChange={(value) => {
                        setDates(null);
                        setRequired(false);
                        form.setFieldValue("fromDate", "");
                        form.setFieldValue("toDate", "");
                        form.setFieldValue("branch", value!);
                      }}
                    />
                  </div>
                </div>

                <div className="mb-5">
                  <div className="bg-Secondary p-3 grid grid-row-2 gap-3 justify-between">
                    <MultiSelect
                      data={dates ?? []}
                      label="Select dates"
                      placeholder="Scroll to see all options"
                      dropdownComponent="div"
                      maxDropdownHeight={200}
                      maxSelectedValues={10}
                      searchable
                      limit={20}
                      error={form.errors.selectedDates}
                      onChange={(value) =>
                        form.setFieldValue("selectedDates", value)
                      }
                      style={{'width' : '90%'}}
                    />
                  </div>
                </div>

                <Divider />

                <div className="my-2">
                  <Accordion defaultValue="Configuration">
                    <Accordion.Item value="Configuration">
                      <Accordion.Control>Configuration</Accordion.Control>
                      <Accordion.Panel>
                        <input
                          type="file"
                          onChange={(event) => {
                            const file =
                              event.currentTarget.files &&
                              event.currentTarget.files[0];
                            form.setFieldValue("config", file || null);
                          }}
                          name="uploadFile"
                          accept=".json"
                        />
                      </Accordion.Panel>
                    </Accordion.Item>
                  </Accordion>
                </div>
              </>
            ) : null}

            <Group className="flex justify-center">
              <Button variant="white" type="submit">
                {repoAnalysed ? 'Analyse' : 'Fetch dates' }
              </Button>
            </Group>
          </form>
        </div>
      </Paper>
    </div>
  );
}
