"use client";

import AnnouncementList from "@/app/announcements/AnnouncementList";
import { Layout } from "@/common/layout/Layout";
import { Suspense } from "react";

export default function EnsembleAnnouncements() {
  return (
    <Layout paddingContainer>
      <Suspense fallback={<div>Loading...</div>}>
      <AnnouncementList
        paginated={true}
        title="Ansambluri rezidențiale disponibile"
        defaultFilters={{ providerType: "ensemble", status: "active", announcementType: "apartamente" }}
        />
      </Suspense>
    </Layout>
  );
}