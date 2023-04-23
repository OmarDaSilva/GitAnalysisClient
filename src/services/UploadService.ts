import emitter from "../eventemitter";
import { CurrentRepoDispatch, RepoStateDispatch, repoAnalysis } from "../pages";
import useRepoLocalStorage from "../hooks/useRepoDates";
import LocalRepoData from "../types/LocalRepoData.type";
import delta from "../types/deltaDates.type";

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

interface config {
  excludeDirectory: string[];
  includeContributors: string[];
}

export async function analyseRepoDeltaDates(
  repoURL: string,
  delta: delta,
  branch: string,
  config: File | null
) {
  if (process.env.NEXT_PUBLIC_REPO_ANALYSIS_DELTA_ROUTE) {
    try {
      let configData = null;
      if (config) {
        configData = await readConfigFile(config);
      }

      const payload = {
        url: repoURL,
        branch: branch,
        deltaDates: delta,
        config: configData,
      };

      const analysisResponse = await fetch(
        process.env.NEXT_PUBLIC_REPO_ANALYSIS_DELTA_ROUTE,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        }
      );

      if (analysisResponse) {
        const repoInfo = await analysisResponse.json();

        const { repoName, repoDates } = repoInfo;

        // sessionStorage.setItem(repoName, JSON.stringify(repoDates))

        return {
          repoURL,
          repoDates
        };
      } else {
        console.log("ERROR", analysisResponse);
      }
    } catch (error) {
      console.log(error);
    }
  }
}

export async function repoDates(repoURL: string, branch: string) {
  if (process.env.NEXT_PUBLIC_REPO_ANALYSIS_BACKEND_ROUTE) {
    try {
      const analysisResponse = await fetch(
        process.env.NEXT_PUBLIC_REPO_ANALYSIS_BACKEND_ROUTE,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            url: repoURL,
            branch: branch,
          }),
        }
      );

      if (analysisResponse) {
        const repoInfo = await analysisResponse.json();
        // let regex = new RegExp("*/");
        // sessionStorage.setItem(repoName.replace(".zip", ""), JSON.stringify(dates))
        return repoInfo;
        // const [repositoryName, setRepoDates] = useRepoLocalStorage<LocalRepoData>(repoName, dates)
      }
    } catch (error) {
      console.log(error);
    }
  }
}

// export async function repoDates(repoURL: string) {
//   if (process.env.NEXT_PUBLIC_REPO_ANALYSIS_BACKEND_ROUTE) {
//     const file = new FormData();
//     file.append("file", repo);
//     try {
//       const analysisResponse = await fetch(
//         process.env.NEXT_PUBLIC_REPO_ANALYSIS_BACKEND_ROUTE,
//         {
//           method: "POST",
//           body: file,
//         }
//       );

//       if (analysisResponse) {
//         const dates = await analysisResponse.json();
//         sessionStorage.setItem(repoName.replace(".zip", ""), JSON.stringify(dates))
//         // const [repositoryName, setRepoDates] = useRepoLocalStorage<LocalRepoData>(repoName, dates)
//       }
//     } catch {}
//   }
// }
