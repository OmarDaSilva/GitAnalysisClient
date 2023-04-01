import Image from "next/image";
import emitter from "../eventemitter";
import { useEffect, useState } from "react";

export default function VideoController({ dates }) {
  const [currentCount, setCurrentCount] = useState(-1);
  const [data, setData] = useState(null);
  const [activate, toggleActivate] = useState(false);
  const [keys, setkeys] = useState(null);
  const [pause, setPause] = useState(false);

  emitter.emit("onPause");
  emitter.addListener("videoData", (data) => {
    setData(data);
    setkeys(Object.keys(data));
  });

  const onPlay = async () => {
    setPause(false)
    toggleActivate(true);
  };

  const onPause = () => {
    setPause((value => !value));
  };

  const onRestart = async () => {
    setCurrentCount(0);
    emitter.emit("onRestart", { data: data[keys[0]], key: keys[0] });
    emitter.emit("changValues", { key: keys[0] });
  };

  const onRewind = async () => {
    emitter.emit("onRewind");
  };

  const onFastforward = async () => {
    emitter.emit("onFastforward");
  };

  const onEnd = async () => {
    emitter.emit("onEnd");
  };

  useEffect(() => {
    if (activate) {
      let playInterval = setInterval(() => {
        if (keys && !pause) {
          let length = keys?.length ?? -10;
          if (currentCount <= length - 1) {
            emitter.emit("changValues", { key: keys[currentCount] });
            emitter.emit("onPlay", {
              data: data[keys[currentCount]],
              key: keys[currentCount],
            });

            if (currentCount > length - 1) {
              setCurrentCount(0);
            } else {
              setCurrentCount(currentCount + 1);
            }
          }
        }

        console.log("hi");
      }, 2000);

      return () => clearInterval(playInterval);
    }
  }, [data, activate, currentCount, keys, pause]);

  return (
    <div className="grid grid-cols-1 gap-5 mt-5">
      <div className="flex justify-center">
        {keys && data && !currentCount
          ? "Current Date: 2" + keys[currentCount]
          : keys && currentCount
          ? "Current Date: 1" + keys[currentCount]
          : null}
      </div>

      <div className="flex flex-col">
        <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700 flex flex-row">
          <div
            className="bg-blue-600 h-2.5 rounded-full"
            style={{ width: "70%" }}
          >
            <div
              className="
              w-[3px] h-[15px]"
            ></div>
          </div>

          {
            // we need to insert a map that gets the significan events
            // and renders div at certain marks in the history corresponding
            // when that significant event occured
          }
        </div>
      </div>

      <div className="w-[100%] flex justify-center">
        <div className="flex justify-between w-[50%]">
          <Image
            src="/assets/backward.svg"
            width={30}
            height={30}
            onClick={onRestart}
          />
          <Image src="/assets/rewind.svg" width={30} height={30} />
          <Image
            src="/assets/pause.svg"
            width={30}
            height={30}
            onClick={onPause}
          />
          <Image
            src="/assets/play.svg"
            width={30}
            height={30}
            onClick={onPlay}
          />
          <Image src="/assets/flash forward.svg" width={30} height={30} />

          <Image src="/assets/forward.svg" width={30} height={30} />
        </div>
      </div>
    </div>
  );
}
