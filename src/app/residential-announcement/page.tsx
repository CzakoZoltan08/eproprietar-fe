"use client";

import AnnouncementList from "@/app/announcements/AnnouncementList";
import { Layout } from "@/common/layout/Layout";
import { Suspense } from "react";

export default function Announcements() {
  return (
    <Layout paddingContainer>
      <Suspense fallback={<div>Se încarcă anunțurile...</div>}>
        <AnnouncementList paginated={true} />
      </Suspense>
    </Layout>
  );
}