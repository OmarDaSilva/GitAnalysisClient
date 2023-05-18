

async function readConfigFile(file: File) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      try {
        const json = JSON.parse(reader.result as string);
        resolve(json);
      } catch (error) {
        reject(error);
      }
    };
    reader.onerror = (error) => reject(error);
    reader.readAsText(file);
  });
}

export async function analyseRepoDeltaDates(
  repoURL: string,
  branch: string,
  config: File | null,
  selectedDates: string[],
  showChanges: boolean,
  setColourLegend:  (num: number) => void
) {
  let url =
    process.env.NEXT_PUBLIC_REPO_ANALYSIS_DELTA_ROUTE ??
    process.env.NEXT_PUBLIC_REPO_ANALYSIS__VISUALISE_REPO_DATES;

  try {
    let configData = null;
    if (config) {
      configData = await readConfigFile(config);
    }


    const payload = {
      url: repoURL,
      branch: branch,
      config: configData,
      selectedDates: selectedDates,
      showChanges: showChanges,
    };

    if (configData?.includeContributor) {
      setColourLegend(0)
    } else if (showChanges) {
      setColourLegend(1)
    } else {
      setColourLegend(2)
    }

    const analysisResponse = await fetch(url!, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (analysisResponse) {
      const repoInfo = await analysisResponse.json();
      return repoInfo;
    } else {
      console.log("ERROR", analysisResponse);
    }
  } catch (error) {
    console.log(error);
  }
}

export async function repoDates(repoURL: string, branch: string) {
  console.log("url used", process.env.NEXT_PUBLIC_REPO_ANALYSIS_GET_REPO_DATES);

  let url =
    process.env.NEXT_PUBLIC_REPO_ANALYSIS_BACKEND_ROUTE ??
    process.env.NEXT_PUBLIC_REPO_ANALYSIS_GET_REPO_DATES;
  try {
    const analysisResponse = await fetch(
      `${url}?url=${encodeURIComponent(repoURL)}&branch=${encodeURIComponent(
        branch
      )}`,
      {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      }
    );

    if (analysisResponse) {
      const repoInfo = await analysisResponse.json();
      return repoInfo;
    }
  } catch (error) {
    console.log(error);
  }
}
