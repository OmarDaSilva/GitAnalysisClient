import Image from "next/image";
import emitter from "../eventemitter";
import { useEffect, useState } from "react";
import { useRecoilState, useRecoilValue } from "recoil";
import {
  currentDateState,
  repoDatesState,
  VideoControllerActiveState,
  VideoControllerNextDateKeyState,
  progressSelector,
  SignificantEventsState,
  VideoSpeedState,
} from "../atoms";

import getMarkerPosition from "/src/utils/VideoControllerUtils";
import { NumberInput, Select, Tooltip } from "@mantine/core";

export default function VideoController({ dates }) {
  const [currentDateRecoil, setCurrentDateRecoil] =
    useRecoilState(currentDateState);
  const [currentDate, setCurrentDate] = useRecoilState(currentDateState);
  const [dateKeys, setDateKeys] = useRecoilState(repoDatesState);
  const [videoControllerState, setVideoControllerState] = useRecoilState(
    VideoControllerActiveState
  );
  const [videoControllerNextDateKey, setVideoControllerNextDateKey] =
    useRecoilState(VideoControllerNextDateKeyState);
  const percentage = useRecoilValue(progressSelector);
  const significantEvents = useRecoilValue(SignificantEventsState);
  const [videoSpeed, setVideoSpeedState] = useRecoilState(VideoSpeedState);

  const onPlay = async () => {
    setVideoControllerState(true);
  };

  const onClickNext = () => {
    if (videoControllerNextDateKey < dateKeys.length - 1) {
      setCurrentDate(dateKeys[videoControllerNextDateKey + 1]);
      setVideoControllerNextDateKey((val) => ++val);
    } else {
      setCurrentDate(dateKeys[0]);
      setVideoControllerNextDateKey(0);
    }
  };

  const onClickBack = () => {
    if (videoControllerNextDateKey > 0) {
      setCurrentDate(dateKeys[videoControllerNextDateKey - 1]);
      setVideoControllerNextDateKey((val) => --val);
    }
  };

  const onPause = () => {
    // setPause((value => !value));
    setVideoControllerState(false);
  };

  const onRestart = async () => {
    setVideoControllerNextDateKey(0);
    setCurrentDate(dateKeys[0]);
    // setPercentage(0)
  };

  const onEnd = async () => {
    setCurrentDate(dateKeys.at(-1));
    setVideoControllerNextDateKey(dateKeys.length - 1);
  };

  const changeDate = (val) => {
    let ind = dateKeys.indexOf(val);

    setCurrentDate(val);
    setVideoControllerNextDateKey(ind);
  };

  const changeToMarkerDate = (date) => {
    let ind = dateKeys.indexOf(date);

    setCurrentDate(date);
    setVideoControllerNextDateKey(ind);
  };

  useEffect(() => {
    if (videoControllerState) {
      const visualInterval = setInterval(() => {
        if (videoControllerNextDateKey == 0) {
          setCurrentDate(dateKeys[videoControllerNextDateKey + 1]);
          setVideoControllerNextDateKey((val) => ++val);
        } else if (videoControllerNextDateKey < dateKeys.length - 1) {
          setVideoControllerNextDateKey((val) => ++val);
          setCurrentDate(dateKeys[videoControllerNextDateKey + 1]);
          calculatePercenage(dateKeys.length, videoControllerNextDateKey);
        } else {
          setVideoControllerNextDateKey(0);
          setCurrentDate(dateKeys[0]);
          setVideoControllerState(false);
        }

        console.log(videoControllerNextDateKey);
      }, videoSpeed);

      return () => clearInterval(visualInterval);
    }
  }, [
    videoControllerState,
    videoControllerNextDateKey,
    SignificantEventsState,
  ]);

  return (
    <div className="grid grid-cols-1 gap-5 mt-5">
      <div className="flex justify-between">
        <div className="text-center flex">
          <p>
            {currentDateRecoil
              ? "Date: " + currentDateRecoil.slice(0, 10)
              : null}
          </p>
        </div>

        {significantEvents
          ? significantEvents[currentDateRecoil]
            ? significantEvents[currentDateRecoil].events.map((event, index) => {
                return <p key={index}>{event.eventComment}</p>;
              })
            : null
          : null}

        <div className="mr-5">
          <Select
            label="Select date"
            data={dateKeys ?? []}
            onChange={(val) => {
              changeDate(val);
            }}
          />
        </div>
      </div>

      {true ? (
        <div className="flex flex-col" id="progress-bar">
          <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700 flex flex-row">
            <div
              className="bg-blue-600 h-2.5 rounded-full"
              style={{ width: `${percentage}%` }}
            >
              <div className="w-[3px] h-[15px]"></div>
            </div>
            {significantEvents
              ? Object.entries(significantEvents).map(([eventDate, events]) => {
                  const eventLabels = events.events
                    .map((event) => event.eventLabel)
                    .join("\n");
                  const position = getMarkerPosition(eventDate, dateKeys);

                  return (
                    <Tooltip label={eventLabels} key={eventDate}>
                      <div
                        key={eventDate}
                        onClick={() => {
                          changeToMarkerDate(eventDate)
                        }}
                        className="absolute h-6 w-1 bg-red-500 cursor-pointer"
                        style={{ left: `calc(${position}% )` }}
                      ></div>
                    </Tooltip>
                  );
                })
              : null}
          </div>
        </div>
      ) : null}

      <div className="w-[100%] flex justify-center">
        <div className="flex justify-between w-[50%]">
          <Image
            className="cursor-pointer"
            src="/assets/backward.svg"
            width={30}
            height={30}
            onClick={onRestart}
          />
          <Image
            className="cursor-pointer"
            src="/assets/rewind.svg"
            width={30}
            height={30}
            onClick={onClickBack}
          />
          <Image
            className="cursor-pointer"
            src="/assets/pause.svg"
            width={30}
            height={30}
            onClick={onPause}
          />
          <Image
            className="cursor-pointer"
            src="/assets/play.svg"
            width={30}
            height={30}
            onClick={onPlay}
          />
          <Image
            className="cursor-pointer"
            src="/assets/flash forward.svg"
            width={30}
            height={30}
            onClick={onClickNext}
          />

          <Image
            className="cursor-pointer"
            src="/assets/forward.svg"
            width={30}
            height={30}
            onClick={onEnd}
          />
        </div>
        <div className="w-[100px] ml-9 flex flex-row">
          <NumberInput
            defaultValue={4000}
            min={1000}
            step={100}
            onChange={(val) => {
              setVideoSpeedState(val);
            }}
          />
        </div>

        <p className="align-bottom	self-center text-[14px] ml-3">
          Play speed (Ms)
        </p>
      </div>
    </div>
  );
}
