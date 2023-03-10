import { type NextPage } from "next";
import Link from "next/link";
import { signIn, signOut, useSession } from "next-auth/react";
import FileSelect from "@/components/FileSelect";
import DataOutput from "@/components/DataOutput";

const Home: NextPage = () => {
  return (
    <>
      <main className="min-h-screen bg-orange-400 px-12 py-6 ">
        <div>
          <h1 className="text-3x text-center">Transcribe your file</h1>
        </div>
        <div>
          <p className="pt-2 text-center">
            Capable of handling the following file types:
            <br /> M4A, MP3, MP4, MPEG, MPGA, WAV and WEBM
          </p>
        </div>
        <FileSelect />
        <div className="">
          <DataOutput />
        </div>
      </main>
    </>
  );
};

export default Home;
