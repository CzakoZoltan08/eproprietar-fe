"use client";

import React, { useEffect, useState } from "react";

import AnnouncementForm from "@/app/create-announcement/AnnouncementForm";
import { CircularProgress } from "@mui/material";
import ResidentialAnnouncementForm from "@/app/create-announcement/ResidentialAnnouncementForm";
import { observer } from "mobx-react";
import { useParams } from "next/navigation";
import { useStore } from "@/hooks/useStore";

const EditAnnouncementType = () => {
  const {
    announcementStore: { getAnnouncementById, currentAnnouncement },
  } = useStore();
  const [loading, setLoading] = useState(true);
  const params = useParams();
  const { id } = params;

  useEffect(() => {
    if (!currentAnnouncement?.id) {
      (async () => {
        await getAnnouncementById(id as string);
      })();
    }
  }, []);

  useEffect(() => {
    if (currentAnnouncement && loading) {
      setLoading(false);
    }
  }, [currentAnnouncement]);

  return (
    <>
      {loading ? (
        <CircularProgress
          sx={{
            margin: "0 auto",
          }}
          size={42}
        />
      ) : (
        <>
          {currentAnnouncement?.providerType === "owner" ? (
            <AnnouncementForm />
          ) : (
            <ResidentialAnnouncementForm />
          )}
        </>
      )}
    </>
  );
};

export default observer(EditAnnouncementType);
