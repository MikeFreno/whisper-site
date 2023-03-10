"use client";

import SpinIcon from "@/icons/SpinIcon";
import { useCallback, useState } from "react";
import Dropzone from "./Dropzone";

export default function FileSelect() {
  const [file, setFile] = useState<File | null>(null);
  const [fileRejected, setFileRejected] = useState<boolean>(false);

  const handleFileDrop = useCallback((acceptedFiles: File[]) => {
    acceptedFiles.forEach((file: File) => {
      setFile(file);
      const ext = file.type.split("/")[1];
      if (
        ext === "m4a" ||
        ext === "mp3" ||
        ext === "mp4" ||
        ext === "mpeg" ||
        ext === "mpga" ||
        ext === "wav" ||
        ext === "webm"
      ) {
        setFileRejected(false);
        const reader = new FileReader();
        reader.onload = () => {
          const str = reader.result;
        };
        reader.readAsDataURL(file);
      } else {
        setFile(null);
        setFileRejected(true);
      }
    });
  }, []);

  return (
    <>
      <div className="flex justify-center rounded-full pt-4">
        {/* <button className="rounded-md bg-blue-400 px-4 py-2 text-white">
          Select File...
        </button> */}
        <div className="">
          <div className="text-center">Server Logo (optional)</div>
          <Dropzone
            onDrop={handleFileDrop}
            acceptedFiles={
              "audio/m4a, audio/mp3, audio/mp4, audio/mpeg, audio/mpga, audio/wav, audio/webm"
            }
            preSet={null}
            file={file}
          />
        </div>
      </div>
      <div className="text-center">
        {fileRejected
          ? "File type rejected"
          : file == null
          ? "No file selected..."
          : file.name}
      </div>
      {file !== null ? (
        <div className="flex justify-center pt-4">
          <button className="flex rounded bg-blue-400 px-4 py-2">
            <SpinIcon height={24} width={24} fill={"#fb923c"} />
            <div className="pl-2 text-white">Transcribe!</div>
          </button>
        </div>
      ) : null}
    </>
  );
}
