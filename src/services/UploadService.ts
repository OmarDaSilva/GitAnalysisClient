export default async function UploadService(repo: File) {
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

      if (analysisResponse.ok) {
        alert("File recieved!");
      }
    } catch {}
  }
}
