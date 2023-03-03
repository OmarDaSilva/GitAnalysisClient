import emitter from "../eventemitter";
import { RepoStateDispatch, repoAnalysis } from "../pages";

export default async function UploadService(repo: File, dispatch: RepoStateDispatch) {
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
        
        const data = await analysisResponse.json()
        let repoDates = Object.keys(data);
        let repo = data[repoDates[0]];
        emitter.emit('RepoAnalaysed', repo);
        emitter.emit('RepoAnalysedDates', Object.keys(data))    
        Object.keys(data).forEach((date => {
          dispatch({ type: 'Add', payload: { key: date, value: data[date]}})
        }))  
      }
    } catch {}
  }
}
