import Head from "next/head";
import { Inter } from "@next/font/google";
import LeftBar from "../components/LeftBar";
import VisualRepo from "../components/VisualRepo";
import RightBar from "../components/RightBar";
import { createContext, useState, useReducer } from "react";
import { RecoilRoot, atom, selector, useRecoilState, useRecoilValue } from "recoil";

export type storedRepos = {
  [key: string]: {
    [key: string]: {
      links: {};
      nodes: {};
    };
  };
};

type Repos = {
  repos: storedRepos;
};

export type repoAnalysis = {
  [key: string]: {
    links: {};
    nodes: {};
  };
};

type RepoStateAction = {
  type: "Add" | "Remove";
  payload: { key: string; value: repoAnalysis };
};


export type RepoStateDispatch = React.Dispatch<RepoStateAction>;

const initialState: Repos = { repos: {} };

function reducer(state: Repos, action: RepoStateAction): Repos {
  if (action.type == "Add") {
    return {
      repos: {
        ...state.repos,
        [action.payload.key]: action.payload.value,
      },
    };
  } else {
    throw new Error();
  }
}

// export type currentRepo = {
//   repoName: string
// }

type Repo = {
  repo: string
}

type CurrentRepoStateAction = {
  type: "Set";
  payload: string
};

export type CurrentRepoDispatch = React.Dispatch<CurrentRepoStateAction>;

const intialCurrentRepoState: Repo = { repo: ''}

function currentRepoReducer(state: Repo, action: CurrentRepoStateAction): Repo {
  return {
    repo: action.payload
  }
}

export const CurrentRepoContext = createContext<{
  currentRepoState: Repo;
  currentRepoDispatch: CurrentRepoDispatch
}>({
  currentRepoState: intialCurrentRepoState,
  currentRepoDispatch: () => null
})


export const ReposContext = createContext<{
  state: Repos;
  dispatch: RepoStateDispatch;
}>({
  state: initialState,
  dispatch: () => null,
});

export default function Home() {
  const [state, dispatch] = useReducer(reducer, initialState);
  const [currentRepoState, currentRepoDispatch] = useReducer(currentRepoReducer, intialCurrentRepoState)
  
  return (
    <>
    <RecoilRoot>
      <CurrentRepoContext.Provider value={{currentRepoState, currentRepoDispatch}}>
        <ReposContext.Provider value={{ state, dispatch }}>
          <Head>
            <title>Git Visuals</title>
          </Head>
          <main className="flex flex-row justify-between">
            <LeftBar />
            <VisualRepo />
            <RightBar />
          </main>
        </ReposContext.Provider>
      </CurrentRepoContext.Provider>
    </RecoilRoot>
    </>
  );
}
