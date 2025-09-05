"use client";

import { Suspense, useEffect, useState } from "react";
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
  const [shouldRender, setShouldRender] = useState(false);

  useEffect(() => {
    if (!user?.id) return;

    const params = new URLSearchParams(searchParams.toString());

    const alreadySet =
      params.get("userId") === user.id &&
      params.get("title") === "Anunțurile mele";

    if (alreadySet) {
      setShouldRender(true);
      return;
    }

    params.set("page", "1");
    params.set("userId", user.id);
    params.set("title", "Anunțurile mele");

    router.replace(`/my-announcements?${params.toString()}`);
  }, [user, searchParams, router]);

  if (!user?.id || !shouldRender) {
    return <div>Se încarcă...</div>;
  }

  return (
    <Suspense fallback={<div>Loading announcements...</div>}>
      <AnnouncementList paginated={true} source="mine" />
    </Suspense>
  );
};

export default observer(MyAnnouncementsWrapper);