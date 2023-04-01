export default async function handler(req, res) {
    if (process.env.NEXT_PUBLIC_REPO_ANALYSIS_DELTA_ROUTE) {
        let body = req.body
        try {
          const analysisResponse = await fetch(
            process.env.NEXT_PUBLIC_REPO_ANALYSIS_DELTA_ROUTE,
            {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: body,
            }
          );
    
          if (analysisResponse) {
            const repoInfo = await analysisResponse.json();
            
            const { repoURL, repoDates } = repoInfo;
    
         
            // sessionStorage.setItem(repoName, JSON.stringify(repoDates))
    
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