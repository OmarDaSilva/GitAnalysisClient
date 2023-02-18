import Head from "next/head";
import { Inter } from "@next/font/google";
import LeftBar from "../components/LeftBar";
import VisualRepo from "../components/VisualRepo";
import RightBar from "../components/RightBar";

export default function Home() {
  return (
    <>
      <Head>
        <title>Git Visuals</title>
      </Head>
      <main className="flex flex-row justify-between">
        <LeftBar />
        <VisualRepo />
        {/* <RightBar /> */}
      </main>
    </>
  );
}
