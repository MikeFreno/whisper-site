"use client";

import CopyIcon from "@/icons/CopyIcon";

export default function DataOutput() {
  return (
    <>
      <div className="flex justify-center">
        <textarea
          id="output"
          className="flex w-3/4 rounded-md px-6 py-4 lg:w-1/2"
          placeholder="output will appear here"
          rows={10}
        />
      </div>
      <button className="absolute ">
        <CopyIcon width={24} height={24} fill={"#60a5fa"} />
      </button>
    </>
  );
}
