"use client";

import React, { useEffect } from "react";

import { Box } from "@mui/material";
import CharacteristicsCard from "@/app/announcements/[id]/CharacteristicsCard";
import CircularProgress from "@mui/material/CircularProgress";
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

const DetailsContainer = styled(({ $flexdirection, children, ...rest }: { $flexdirection: string, children: React.ReactNode }) => (
  <Box {...rest}>{children}</Box>
))`
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
const AnnouncementDetailPage = () => {
  const {
    announcementStore: { getAnnouncementById, currentAnnouncement },
  } = useStore();
  const params = useParams();
  const { id } = params;
  const isMobile = useMediaQuery(SIZES_NUMBER_TINY_SMALL);

  useEffect(() => {
    (async () => {
      if (id) {
        await getAnnouncementById(Array.isArray(id) ? id[0] : id);
      }
    })();
  }, []);

  return (
    <Layout paddingContainer>
      {!currentAnnouncement?.id ? (
        <CircularProgress />
      ) : (
        <>
          {isMobile ? (
            <Box display={"flex"} sx={{ flexDirection: "column" }}>
              {currentAnnouncement && <TitleCard />}

              <DetailsContainer $flexdirection={isMobile ? "column" : "row"}>
                <ImagesCardComponent />
                {currentAnnouncement?.description && <DescriptionCard />}
                <CharacteristicsCard />
              </DetailsContainer>
              <ContactContainer>
                <ContactCardComponent />
              </ContactContainer>
            </Box>
          ) : (
            <>
              {currentAnnouncement && <TitleCard />}
              <DetailsContainer $flexdirection="row">
                <div>
                  <ImagesCardComponent />
                  {currentAnnouncement?.description && <DescriptionCard />}
                  <CharacteristicsCard />
                </div>
                <ContactContainer>
                  <ContactCardComponent />
                </ContactContainer>
              </DetailsContainer>
            </>
          )}
        </>
      )}
    </Layout>
  );
};

export default observer(AnnouncementDetailPage);
