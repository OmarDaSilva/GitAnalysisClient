import emitter from "../eventemitter";
import { CurrentRepoDispatch, RepoStateDispatch, repoAnalysis } from "../pages";
import useRepoLocalStorage from "../hooks/useRepoDates";
import LocalRepoData from "../types/LocalRepoData.type";
import delta from "../types/deltaDates.type";

// export default async function UploadService(
//   repo: File,
//   dispatch: RepoStateDispatch,
//   currentRepoDispatch: CurrentRepoDispatch,
// ) {
//   if (process.env.NEXT_PUBLIC_REPO_ANALYSIS_BACKEND_ROUTE) {
//     const file = new FormData();
//     const repoName = repo.name;
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
//         const data = await analysisResponse.json();
//         let repoDates = Object.keys(data);
//         let repo = data[repoDates[0]];
//         emitter.emit("RepoAnalaysed", repo);
//         emitter.emit("RepoAnalysedDates", Object.keys(data));

//         currentRepoDispatch({
//           type: "Set",
//           payload:
//         dispatch({
//           type: "Add",
//           payload: {
//             key: repoName,
//             value: data,
//           },
//         });

//         emitter.emit("RepoAnalysis", repoName);
//       }
//     } catch {}
//   }
// }

export async function analyseRepoDeltaDates(
  repoURL: string,
  delta: delta,
  branch: string,
  dispatch: RepoStateDispatch
) {
  if (process.env.NEXT_PUBLIC_REPO_ANALYSIS_DELTA_ROUTE) {
    try {
      const analysisResponse = await fetch(
        process.env.NEXT_PUBLIC_REPO_ANALYSIS_DELTA_ROUTE,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            url: repoURL,
            branch: branch,
            deltaDates: delta,  
          }),
        }
      );

      if (analysisResponse) {
        const repoInfo = await analysisResponse.json();
        
        const { repoName, repoDates } = repoInfo;

        dispatch({
          type: "Add",
          payload: {
            key: repoName,
            value: repoDates,
          },
        });
        sessionStorage.setItem(repoName, JSON.stringify(repoDates))

        return {
          repoURL,
          repoDates
        }

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
            branch: branch
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
