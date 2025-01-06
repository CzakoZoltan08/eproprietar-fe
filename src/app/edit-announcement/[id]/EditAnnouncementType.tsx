"use client";

import React, { useEffect, useState } from "react";

import AnnouncementForm from "@/app/create-announcement/AnnouncementForm";
import { CircularProgress } from "@mui/material";
import { ProviderType } from "@/constants/provider-types.enum";
import ResidentialAnnouncementForm from "@/app/create-announcement/ResidentialAnnouncementForm";
import { observer } from "mobx-react";
import styles from "./EditAnnouncementType.module.css"; // Assuming a CSS module
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
        <CircularProgress className={styles.circularProgress} size={42} />
      ) : (
        <>
          {currentAnnouncement?.providerType === ProviderType.OWNER ? (
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