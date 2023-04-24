import { atom, atomFamily, selector } from "recoil";

export const repoStoreItemFamily = atomFamily({
  key: 'storeItem',
  default: (id) => (
    {
      id: id
    }
  )
});

export const RepoStoreItemDatesState = atom({
  key: 'storeItemDates',
  default: []
})

export const CurrentRepoKeyState = atom({
  key: 'currentRepoKeyState',
  default: ''
})

export const RepoKeysState = atom({
  key: 'repoKeysState',
  default: []
})

export const repoDatesState = atom({
  key: 'repoDatesState',
  default: null
})

export const currentDateState = atom({
  key: 'currentDateState',
  default: null
})

export const VideoControllerActiveState = atom({
  key: 'VideoControllerActiveState',
  default: false
})

export const VideoControllerNextDateKeyState = atom({
  key: 'VideoControllerNextDateKeyState',
  default: 0
})

export const FileColourLegendState = atom({
  key: "FileColourLegendState", 
  default: null
})

export const SignificantEventsState = atom({
  key: "SignificantEventsState", 
  default: null
})

export const VideoSpeedState = atom({
  key: "VideoSpeedState",
  default: 4000
})

export const RepoAnalysedState = atom({
  key: "RepoAnalysedState",
  default: false 
})

export const repoSelector = selector({
  key: 'repoSelector',
  get: ({get}) => {
    let key = get(CurrentRepoKeyState)
    return {
      repo: get(repoStoreItemFamily(key))
    }
  },
  set: ({ set }, { repoKey, repoDates, repoName, events }) => {
    set(RepoKeysState, (keys) => [...keys, repoKey])
    set(repoStoreItemFamily(repoKey), {
      id: repoKey,  
      cleanData: repoDates.cleanData,
      commitsByDay: repoDates.commitsByDay,
      repoName: repoKey
    })
    set(CurrentRepoKeyState, repoName)
    let dates = Object.keys(repoDates.cleanData.dataFormatted)
    set(repoDatesState, dates)
    set(currentDateState, dates[0])
    set( SignificantEventsState, events)
  },
});

export const progressSelector = selector({
  key: "progressSelector",
  get: ({ get }) => {
    const nextDateKey = get(VideoControllerNextDateKeyState);
    const dateKeys = get(repoDatesState);
    if (nextDateKey < 0 || nextDateKey >= dateKeys?.length) {
      throw new Error("Invalid date key");
    }

    if (dateKeys == null) {
      return 0
    }
    return ((nextDateKey + 1) / dateKeys.length) * 100;
  },
});