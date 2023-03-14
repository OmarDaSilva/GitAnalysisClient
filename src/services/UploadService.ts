import emitter from "../eventemitter";
import { CurrentRepoDispatch, RepoStateDispatch, repoAnalysis } from "../pages";
import useRepoLocalStorage from '../hooks/useRepoDates'
import LocalRepoData from "../types/LocalRepoData.type";

export default async function UploadService(
  repo: File,
  dispatch: RepoStateDispatch,
  currentRepoDispatch: CurrentRepoDispatch,
) {
  if (process.env.NEXT_PUBLIC_REPO_ANALYSIS_BACKEND_ROUTE) {
    const file = new FormData();
    const repoName = repo.name;
    file.append("file", repo);
    try {
      const analysisResponse = await fetch(
        process.env.NEXT_PUBLIC_REPO_ANALYSIS_BACKEND_ROUTE,
        {
          method: "POST",
          body: file,
        }
      );

      if (analysisResponse) {
        const data = await analysisResponse.json();
        let repoDates = Object.keys(data);
        let repo = data[repoDates[0]];
        emitter.emit("RepoAnalaysed", repo);
        emitter.emit("RepoAnalysedDates", Object.keys(data));

        currentRepoDispatch({
          type: "Set",
          payload: repoName
        })
        
        dispatch({
          type: "Add",
          payload: {
            key: repoName,
            value: data,
          },
        });

        emitter.emit("RepoAnalysis", repoName);
      }
    } catch {}
  }
}

export async function repoDates(repo: File, repoName: string) {
  if (process.env.NEXT_PUBLIC_REPO_ANALYSIS_BACKEND_ROUTE) {
    const file = new FormData();
    file.append("file", repo);
    try {
      const analysisResponse = await fetch(
        process.env.NEXT_PUBLIC_REPO_ANALYSIS_BACKEND_ROUTE,
        {
          method: "POST",
          body: file,
        }
      );

      if (analysisResponse) {
        const dates = await analysisResponse.json();
        sessionStorage.setItem(repoName.replace(".zip", ""), JSON.stringify(dates))
        // const [repositoryName, setRepoDates] = useRepoLocalStorage<LocalRepoData>(repoName, dates)        
      }
    } catch {}
  }
}
