import Head from "next/head";
import { Inter } from "@next/font/google";
import LeftBar from "../components/LeftBar";
import VisualRepo from "../components/VisualRepo";
import RightBar from "../components/RightBar";
import { createContext, useState, useReducer} from "react";

type dictionary = {
  [key: string]: {
    links: {},
    nodes: {}
  }
}
type Repos = {
  repos: dictionary
};

export type repoAnalysis = {
  nodes: {}
  links: {}
}

type RepoStateAction = {
  type: 'Add' | 'Remove';
  payload: { key: string; value: repoAnalysis};
};

export type RepoStateDispatch = React.Dispatch<RepoStateAction>;

const initialState: Repos = { repos: {} };

function reducer(state: Repos, action: RepoStateAction): Repos {
  if (action.type == 'Add') {
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

export const ReposContext = createContext<{state: Repos, dispatch: RepoStateDispatch}>({
  state: initialState,
  dispatch: () => null
});

export default function Home() {
  const [state, dispatch] = useReducer(reducer, initialState);

  return (
    <>
      <ReposContext.Provider value={{state, dispatch}}>
        <Head>
          <title>Git Visuals</title>
        </Head>
        <main className="flex flex-row justify-between">
          <LeftBar />
          <VisualRepo />
        </main>
      </ReposContext.Provider>
    </>
  );
}
