"use client";

import React, { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

import AnnouncementList from "@/app/announcements/AnnouncementList";
import { CircularProgress } from "@mui/material";
import { Endpoints } from "@/constants/endpoints";
import { observer } from "mobx-react";
import { useStore } from "@/hooks/useStore";

const SavedAnnouncementsWrapper = () => {
  const {
    userStore: { user, getCurrentUser },
  } = useStore();

  const [isReady, setIsReady] = useState(false);
  const searchParams = useSearchParams();
  const router = useRouter();

  // Load current user if missing
  useEffect(() => {
    if (!user?.id) {
      getCurrentUser();
    }
  }, [user, getCurrentUser]);

  // After user is available, update the URL or mark as ready
  useEffect(() => {
    if (!user?.id) return;

    const currentUserId = searchParams.get("userId");
    const currentTitle = searchParams.get("title");

    if (currentUserId === user.id && currentTitle === "Anunturi salvate") {
      setIsReady(true);
      return;
    }

    const params = new URLSearchParams(searchParams.toString());
    params.set("userId", String(user.id));
    params.set("title", "Anunturi salvate");

    router.replace(`${Endpoints.SAVED_ANNOUNCEMENTS}?${params.toString()}`);
    setIsReady(true);
  }, [user?.id, searchParams, router]);

  if (!isReady) {
    return <CircularProgress sx={{ margin: "0 auto", display: "block" }} size={42} />;
  }

  return <AnnouncementList paginated={true} source="saved" />;
};

export default observer(SavedAnnouncementsWrapper);