"use client";

import EnsembleAnnouncementDetailsPage from "@/app/announcements/ensemble/[id]/EnsembleAnnouncementDetails";
import { Layout } from "@/common/layout/Layout";
import { Suspense } from "react";

export default function Announcements() {
  return (
    <Layout paddingContainer>
      <Suspense fallback={<div>Loading...</div>}>
        <EnsembleAnnouncementDetailsPage />
      </Suspense>
    </Layout>
  );
}
