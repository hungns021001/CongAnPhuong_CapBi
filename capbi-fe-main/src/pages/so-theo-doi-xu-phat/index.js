import Head from "next/head";
import { Inter } from "@next/font/google";

import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import CheckAuth from "@/components/checkAuth.js";
import NewLayout from "../../NewLayout";
import Sanctions from "@/NewComponents/sanctions";

const inter = Inter({ subsets: ["latin"] });

export default function DispatchBookPage() {
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/dang-nhap");
    } else {
      setLoading(false);
    }
  }, []);
  return (
    <>
      <Head>
        <title>Sổ theo dõi xử phạt</title>
        <meta name="description" content="Generated by create next app" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon-logo.png" />
      </Head>
      <main style={{ marginTop: "52px" }}>
        {loading && <CheckAuth />}
        <NewLayout>
          <Sanctions />
        </NewLayout>
      </main>
    </>
  );
}