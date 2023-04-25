This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).
## Getting Started

First, run the frontend client:
- Clone both the frontend (gitanalysisclient) and backend (gitanalysisserve) repositories.
- Install dependencies by running npm install or yarn install in each project folder.
- Start client:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

Git Repository Visualiser Tool
This Tool offers an interactive way to analyze and visualize Git repositories' history and structure. With a powerful tech stack, including Next.js 12, Nodegit, Express, Mantine, Tailwind, D3 force directed graph, RecoilJS, and Emotion, the tool provides a user-friendly experience.

## Usage
- Enter the repository's GitHub URL and click "Fetch Dates."
- Select a branch and date range (up to 10 days) for analysis.
- (Optional) Upload a JSON configuration file for customization.
- Click "Analyze" to retrieve repository information and visualize the data.

## Key Features
- Analyze repositories by entering a GitHub URL
- Select branches and date ranges (up to 10 days) for analysis
- Customize analysis with a JSON configuration file
- Visualize daily code additions, deletions, merges, renames, new files, and deleted files
- Search for specific files or directories
- Interact with visualizations by hovering, panning, zooming, and pinning nodes
- Customize visualizations by dragging pinned nodes
- Track significant events with markers on the progress bar

## Visualization Features
- Locate files/directories using the search function.
- Interact with nodes by hovering, pinning, and dragging.
- Navigate the visualization with pan and zoom controls.
- Refer to the color legend for easier interpretation.
- Use the video player to watch day-by-day visualizations with adjustable speed.
- Click on significant event markers to display event details.
## Upload Config File (Optional) 

If desired, upload a configuration file in JSON format to customize your analysis. 
The structure of the file should be as follows: 

```{
  "excludeDirectories": ["/path/to/directory/", "/path/*"],
  "includeContributors": ["name"],
  "significantEvents": [
    {
      "eventTitle": "<eventTitle>",
      "commitSha": "<commitSha>"
    }
  ]
}
```