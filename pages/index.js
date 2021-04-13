import Head from "next/head";

import { Calendar } from "../components/Calendar";

export default function Home() {
  return (
    <div>
      <Head>
        <title>Meals</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main>
        <Calendar />
      </main>
    </div>
  );
}
