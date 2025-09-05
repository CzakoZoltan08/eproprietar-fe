"use client";

import { AuthLayout } from "@/common/layout/AuthLayout";
import MyAnnouncementsWrapper from "@/app/my-announcements/MyAnnouncementsWrapper";
import { Suspense } from "react";

export default function MyAnnouncements() {
  return (
    <AuthLayout>
      <Suspense fallback={<div>Se încarcă...</div>}>
        <MyAnnouncementsWrapper />
      </Suspense>
    </AuthLayout>
  );
}