"use client";

import React, { Suspense, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

import AnnouncementList from "@/app/announcements/AnnouncementList";
import { CircularProgress } from "@mui/material";
import { Endpoints } from "@/constants/endpoints";
import { observer } from "mobx-react";
import { useStore } from "@/hooks/useStore";

const SavedAnnouncementsWrapper = () => {
  const {
    userStore: { user, getCurrentUser },
    announcementStore: { fetchSavedAnnouncements },
  } = useStore();

  const [loading, setLoading] = useState(true);
  const searchParams = useSearchParams();
  const router = useRouter();

  const updateQueryParams = (key: string, value: string | null) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value) {
      params.set(key, value);
    } else {
      params.delete(key);
    }
    return params.toString();
  };

  useEffect(() => {
    if (!user?.id) {
      getCurrentUser();
    }
  }, [user, getCurrentUser]);

  useEffect(() => {
    if (!user?.id) return;

    (async () => {
      setLoading(true);
      await fetchSavedAnnouncements(user.id!.toString());

      const updatedParams = updateQueryParams("title", "Anunturi salvate");
      router.push(`${Endpoints.SAVED_ANNOUNCEMENTS}?${updatedParams}`);

      setLoading(false);
    })();
  }, [user?.id, fetchSavedAnnouncements, router]);

  return (
    <Suspense fallback={<CircularProgress size={42} sx={{ margin: "0 auto" }} />}>
      {loading ? (
        <CircularProgress sx={{ margin: "0 auto" }} size={42} />
      ) : (
        <AnnouncementList paginated={false} />
      )}
    </Suspense>
  );
};

export default observer(SavedAnnouncementsWrapper);
