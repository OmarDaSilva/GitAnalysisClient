import Image from "next/image";
import { useRef, useState } from "react";
import UploadService from "../services/UploadService";

export default function LeftBar() {
  const [repoName, setRepoName] = useState<String | null>("Repository");
  const inputRepo = useRef<HTMLInputElement | null>(null);

  const onRepoUpload = () => {
    if (inputRepo.current) {
      inputRepo.current.click();
    }
  };

  function changeRepoName() {
    const uploadedFile = inputRepo.current;
    if (uploadedFile) {
      setRepoName(uploadedFile!.files![0].name.replace(".zip", ""));
      UploadService(uploadedFile!.files![0])
    }
  }

  return (
    <div className="w-1/4">
      <div className="grid grid-cols-1 gap-2">
        <div className="bg-Secondary p-3 flex flex-row justify-between ">
          <p className="text-[32px] text-white">{repoName}</p>
        </div>
        <div className="p-3 flex flex-row justify-between bg-Secondary">
          <p className="text-[26px] text-white ">Add Repo</p>
          <button onClick={() => onRepoUpload()}>
            <Image src="assets/plus-icon.svg" width={25} height={25} alt="" />
            <input
              type="file"
              id="file"
              ref={inputRepo}
              onInput={() => changeRepoName()}
              style={{ display: "none" }}
              accept="zip,application/octet-stream,application/zip,application/x-zip,application/x-zip-compressed"
            />
          </button>
        </div>
        <div className="bg-Secondary p-3 flex flex-row justify-between ">
          <p className="text-[20px] text-white">Event: Merge</p>
        </div>
        <div className="bg-Secondary p-3 flex flex-row justify-between">
          <p className="text-white">Commit</p>
          <p className="text-white/50">1234abcd</p>
          <Image src="assets/dropdown-repo.svg" width={15} height={15} alt="" />
        </div>
        <div className="bg-Secondary p-3 flex flex-col justify-between ">
          <p className="text-[20px] text-white mb-3">File changes</p>
          <div className="bg-Primary">
              Hello
          </div>
        </div>
        <div className="bg-Secondary p-3 flex flex-col justify-between ">
          <p className="text-[20px] text-white mb-3">Commit Details</p>
          <div className="bg-Primary">
              Hello
          </div>
        </div>
      </div>
    </div>
  );
}
