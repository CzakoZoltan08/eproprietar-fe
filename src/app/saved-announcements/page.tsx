"use client";

import { AuthLayout } from "@/common/layout/AuthLayout";
import SavedAnnouncementsWrapper from "@/app/saved-announcements/SavedAnnouncementsWrapper";
import { Suspense } from "react";

export default function SavedAnnouncements() {
  return (
    <AuthLayout>
      <Suspense fallback={<div>Loading...</div>}>
        <SavedAnnouncementsWrapper />
      </Suspense>
    </AuthLayout>
  );
}