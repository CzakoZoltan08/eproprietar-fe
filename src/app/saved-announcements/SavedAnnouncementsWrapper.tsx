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

  useEffect(() => {
    const init = async () => {
      let resolvedUser = user;

      // Load user if missing
      if (!resolvedUser?.id) {
        await getCurrentUser();
        resolvedUser = user;
      }

      if (!resolvedUser?.id) {
        console.warn("User not found; cannot load favorites.");
        return;
      }

      // Update query string
      const params = new URLSearchParams(searchParams.toString());
      params.set("userId", resolvedUser.id);
      params.set("title", "Anunturi salvate");

      router.replace(`${Endpoints.SAVED_ANNOUNCEMENTS}?${params.toString()}`);
      setIsReady(true);
    };

    init();
  }, []);

  if (!isReady) {
    return <CircularProgress sx={{ margin: "0 auto", display: "block" }} size={42} />;
  }

  return <AnnouncementList paginated={true} source="saved" />;
};

export default observer(SavedAnnouncementsWrapper);