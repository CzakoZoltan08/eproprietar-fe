"use client";

import React, { Suspense } from "react";

import { Layout } from "@/common/layout/Layout";
import { Main } from "@/MainPage";

export default function Home() {
  return (
    <Layout>
      <Suspense fallback={<div>Se încarcă pagina principală...</div>}>
        <Main />
      </Suspense>
    </Layout>
  );
}