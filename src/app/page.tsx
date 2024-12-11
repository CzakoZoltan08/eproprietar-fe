"use client";

import React, { Suspense } from "react";

import { Layout } from "@/common/layout/Layout";
import { Main } from "@/MainPage";

export default function Home() {
  return (
    <Layout>
      <Suspense fallback={<div>Loading...</div>}>
        <Main />
      </Suspense>
    </Layout>
  );
}
