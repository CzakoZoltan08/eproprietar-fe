"use client";

import { Box, CircularProgress } from "@mui/material";
import React, { useEffect } from "react";

import CharacteristicsCard from "@/app/announcements/[id]/CharacteristicsCard";
import ContactCardComponent from "@/app/announcements/[id]/ContactCard";
import DescriptionCard from "@/app/announcements/[id]/DescriptionCard";
import ImagesCardComponent from "@/app/announcements/[id]/ImagesCard";
import { Layout } from "@/common/layout/Layout";
import { SIZES_NUMBER_TINY_SMALL } from "@/constants/breakpoints";
import TitleCard from "@/app/announcements/[id]/TitleCard";
import { observer } from "mobx-react";
import styled from "styled-components";
import { useMediaQuery } from "@/hooks/useMediaquery";
import { useParams } from "next/navigation";
import { useStore } from "@/hooks/useStore";

// Styled Components
const DetailsContainer = styled(Box)<{ $flexdirection: string }>`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  flex-direction: ${(props) => props.$flexdirection};
  gap: 16px;

  div:first-of-type {
    flex: 2;
  }
`;

const ContactContainer = styled.div`
  flex: 1;
`;

const ColumnBox = styled(Box)`
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

const AnnouncementDetailPage: React.FC = () => {
  const {
    announcementStore: { getAnnouncementById, currentAnnouncement },
  } = useStore();
  const params = useParams();
  const { id } = params;
  const isMobile = useMediaQuery(SIZES_NUMBER_TINY_SMALL);

  // Fetch Announcement Data
  useEffect(() => {
    if (id) {
      getAnnouncementById(Array.isArray(id) ? id[0] : id);
    }
  }, [id, getAnnouncementById]);

  // Render Loading Spinner
  if (!currentAnnouncement?.id) {
    return (
      <Layout paddingContainer>
        <CircularProgress />
      </Layout>
    );
  }

  // Common Layout
  const renderDetails = () => (
    <DetailsContainer $flexdirection={isMobile ? "column" : "row"}>
      <div>
        <ImagesCardComponent />
        {currentAnnouncement?.description && <DescriptionCard />}
        <CharacteristicsCard />
      </div>
      <ContactContainer>
        <ContactCardComponent />
      </ContactContainer>
    </DetailsContainer>
  );

  return (
    <Layout paddingContainer>
      {isMobile ? (
        <ColumnBox>
          <TitleCard />
          {renderDetails()}
        </ColumnBox>
      ) : (
        <>
          <TitleCard />
          {renderDetails()}
        </>
      )}
    </Layout>
  );
};

export default observer(AnnouncementDetailPage);