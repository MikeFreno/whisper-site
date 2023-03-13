"use client";

import SpinIcon from "@/icons/SpinIcon";
import SpinnerIcon from "@/icons/SpinnerIcon";
import { useCallback, useRef, useState } from "react";
import Dropzone from "./Dropzone";
import CopyIcon from "@/icons/CopyIcon";
import { v4 as uuidv4 } from "uuid";

export default function FileSelect() {
  const [file, setFile] = useState<File | Blob | null>(null);
  const [fileRejected, setFileRejected] = useState<boolean>(false);
  const [fileUploading, setFileUploading] = useState<boolean>(false);
  const [fileData, setFileData] = useState<string | ArrayBuffer | null>(null);
  const [uploadProgress, setUploadProgress] = useState<boolean>(false);
  const [ext, setExt] = useState<string>("");
  const [output, setOutput] = useState<string>("");
  const dataArea = useRef<HTMLTextAreaElement | null>(null);
  const [fileProcessed, setFileProcessed] = useState<boolean>(false);
  const [uuidTag] = useState<string>(uuidv4());
  const [processReport, setProcessReport] = useState<string>("");

  const handleFileDrop = useCallback((acceptedFiles: Blob[]) => {
    acceptedFiles.forEach((file: Blob) => {
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
        setFile(file);
        const ext = file.type.split("/")[1];
        setExt(ext!);
        const reader = new FileReader();
        reader.onload = () => {
          const str = reader.result;
          setFileData(str);
        };
        reader.readAsDataURL(file);
        setFileRejected(false);
      } else {
        setFile(null);
        setFileRejected(true);
      }
    });
  }, []);
  // eslint-disable-next-line @typescript-eslint/no-misused-promises
  const sendFileToServer = async () => {
    setFileUploading(true);
    try {
      const response = await fetch(
        `${
          process.env.NEXT_PUBLIC_GCR_API_ROUTE as string
        }/upload?name=${uuidTag}${file?.name as string}`,
        {
          method: "POST",
          body: fileData,
        }
      );
      setUploadProgress(true);
      setProcessReport("File uploaded, processing...");
      setTimeout(() => {
        "This process will take a few minutes...";
      }, 30000);
      setTimeout(() => {
        "File still processing! Don't reload page...";
      }, 60000);
      await processFile();
    } catch {
      setFileUploading(false);
      alert("Error on Upload! Reload the page and try again");
    }
  };
  //eslint-disable-next-line @typescript-eslint/no-misused-promises
  async function processFile() {
    const response = await fetch(
      `${
        process.env.NEXT_PUBLIC_GCR_API_ROUTE as string
      }/process?name=${uuidTag}${file?.name as string}`,
      {
        method: "GET",
      }
    );
    if (response.body) {
      const reader = response.body.getReader();

      const decoder = new TextDecoder();
      let data = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        data += decoder.decode(value);
      }
      setFileProcessed(true);
      setOutput(data);
      setUploadProgress(false);
      setFileUploading(false);
    } else {
      alert("error processing file");
    }
  }

  // eslint-disable-next-line @typescript-eslint/no-misused-promises
  const copyToClipboard = async () => {
    if (dataArea.current) {
      await navigator.clipboard.writeText(dataArea.current.value);
    }
  };
  const saveAsTextFile = () => {
    if (dataArea.current) {
      const toSave = dataArea.current.value;
      const blob = new Blob([toSave], { type: "text/plain" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "my-transcript.txt";
      a.click();
    }
  };

  const buttonState = () => {
    if (file !== null) {
      if (fileUploading) {
        return (
          <div className="flex justify-center pt-4">
            <button
              disabled
              className="flex rounded bg-blue-400 px-4 py-2 hover:bg-blue-500 active:bg-blue-600"
            >
              <div className="text-white">Loading...</div>
            </button>
          </div>
        );
      } else {
        return (
          <div className="flex justify-center pt-4">
            <button
              className="flex rounded bg-blue-400 px-4 py-2 hover:bg-blue-500 active:bg-blue-600"
              //  eslint-disable-next-line @typescript-eslint/no-misused-promises
              onClick={sendFileToServer}
            >
              <SpinIcon height={24} width={24} fill={"#fb923c"} />
              <div className="pl-2 text-white">Transcribe!</div>
            </button>
          </div>
        );
      }
    }
  };

  return (
    <>
      <div className="flex justify-center rounded-full pt-4">
        <div className="">
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
        {fileRejected ? (
          "File type rejected"
        ) : file == null ? (
          "No file selected..."
        ) : (
          <div className="underline underline-offset-[6px]">{file.name}</div>
        )}
      </div>
      {buttonState()}
      {fileUploading ? (
        <>
          <div className="my-4 flex justify-center">
            <div className="animate-spinner">
              <SpinnerIcon height={64} width={64} fill={"#60a5fa"} />
            </div>
          </div>
          {uploadProgress ? (
            <div className="text-center italic">{processReport}</div>
          ) : (
            <div className="text-center italic">File uploading...</div>
          )}
        </>
      ) : null}
      {uploadProgress || fileProcessed ? (
        <>
          <div className="flex justify-center pt-8">
            <textarea
              ref={dataArea}
              id="output"
              className="flex w-3/4 rounded-md py-4 pl-6 pr-12 shadow-lg lg:w-1/2"
              placeholder="output will appear here"
              rows={10}
              onChange={(e) => setOutput(e.target.value)}
              value={output}
            />
            <button
              className="absolute mt-2 ml-[55vw] lg:ml-[44vw]"
              // eslint-disable-next-line @typescript-eslint/no-misused-promises
              onClick={copyToClipboard}
            >
              <CopyIcon width={24} height={24} fill={"#60a5fa"} />
            </button>
          </div>
          <div className="rule-around my-4 mx-auto w-3/4 lg:w-1/2">Or</div>
          <div className="flex justify-center">
            <button
              className="rounded-lg bg-blue-400 px-6 py-4 text-xl text-white hover:bg-blue-500 active:bg-blue-600"
              onClick={saveAsTextFile}
            >
              Save as Text File
            </button>
          </div>
        </>
      ) : null}
    </>
  );
}
