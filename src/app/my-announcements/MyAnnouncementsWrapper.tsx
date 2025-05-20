"use client";

import { Suspense, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";

import AnnouncementList from "@/app/announcements/AnnouncementList";
import { observer } from "mobx-react";
import { useStore } from "@/hooks/useStore";

const MyAnnouncementsWrapper = () => {
  const {
    userStore: { user },
  } = useStore();

  const searchParams = useSearchParams();
  const router = useRouter();

  function updateQueryParams(params: URLSearchParams, key: string, value: string | null) {
    if (value) {
      params.set(key, value);
    } else {
      params.delete(key);
    }
    return params;
  }

  useEffect(() => {
    if (!user?.id) return;

    const currentUserId = searchParams.get("userId");
    if (currentUserId === user.id) return; // avoid infinite redirect loop

    const params = new URLSearchParams(searchParams.toString());
    updateQueryParams(params, "page", "1");
    updateQueryParams(params, "userId", user.id);
    updateQueryParams(params, "title", "Anunturile mele");

    router.push(`/my-announcements?${params.toString()}`);
  }, [user, searchParams, router]);

  // Block rendering until user is known
  if (!user?.id) {
    return <div>Loading...</div>; // or `null`
  }

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <AnnouncementList paginated={true} source="mine" />
    </Suspense>
  );
};

export default observer(MyAnnouncementsWrapper);