import Head from "next/head";
import LeftBar from "../components/LeftBar";
import VisualRepo from "../components/VisualRepo";
import RightBar from "../components/RightBar";
import { RecoilRoot } from "recoil";


export default function Home() {
  
  return (
    <>
    <RecoilRoot>
          <Head>
            <title>Git Visuals</title>
          </Head>
          <main className="flex flex-row justify-between">
            <LeftBar />
            <VisualRepo />
            <RightBar />
          </main>
    </RecoilRoot>
    </>
  );
}
