"use client";

import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

import { Box, CircularProgress, Typography } from "@mui/material";
import React, { useEffect, useRef, useState } from "react";
import UnifiedMediaGallery, { MediaItem } from "./UnifiedMediaGallery";

import CharacteristicsCard from "@/app/announcements/[id]/CharacteristicsCard";
import ContactCardComponent from "@/app/announcements/[id]/ContactCard";
import DescriptionCard from "@/app/announcements/[id]/DescriptionCard";
import HistoryStatsCard from "./HistoryStatsCard";
import { Layout } from "@/common/layout/Layout";
import { SIZES_NUMBER_TINY_SMALL } from "@/constants/breakpoints";
import ShareButtonsCard from "@/common/shareButtons/ShareButtonsCard";
import TitleCard from "@/app/announcements/[id]/TitleCard";
import { observer } from "mobx-react";
import styled from "styled-components";
import { useMediaQuery } from "@/hooks/useMediaquery";
import { useParams } from "next/navigation";
import { useStore } from "@/hooks/useStore";

// Styled Components
const DetailsContainer = styled(Box)<{ $flexdirection: string }>`
  display: flex;
  flex-direction: ${(p) => p.$flexdirection};
  justify-content: space-between;
  align-items: stretch;
  gap: 0px;
  width: 100%;
`;

const ContactContainer = styled.div`
  flex: 0 0 300px;
  max-width: 300px;
  margin-left: 8px !important;

  @media (max-width: 600px) {
    flex: 1 1 100%;
    max-width: 100%;
    margin-top: 0;
  }
`;

const ColumnBox = styled(Box)`
  display: flex;
  flex-direction: column;
  gap: 0px;
`;

const GalleryAlignmentWrapper = styled.div`
  display: flex;
  justify-content: center;
  width: 100%;
  margin: 0;
  padding: 0;
`;

// --- AdditionalDetailsCard: shows new fields only when present ---
const SectionCard = styled(Box)`
  border: 1px solid #eee;
  border-radius: 8px;
  padding: 16px;
  background: #fff;
`;

const Row = styled.div`
  display: grid;
  grid-template-columns: 180px 1fr;
  gap: 8px;
  padding: 6px 0;
  border-bottom: 1px dashed #eee;

  &:last-child {
    border-bottom: none;
  }

  @media (max-width: 600px) {
    grid-template-columns: 1fr;
  }
`;

const Label = styled.span`
  color: #666;
  font-size: 14px;
`;

const Value = styled.span`
  color: #111;
  font-weight: 500;
  font-size: 14px;
  white-space: pre-wrap;
`;

// Accept "any" to avoid TS friction with your store model
const AdditionalDetailsCard: React.FC<{ announcement: any }> = ({ announcement }) => {
  if (!announcement) return null;

  const {
    landType,
    landPlacement,
    urbanismDocuments,
    utilities,
    streetFront,
    streetFrontLength,
    heightRegime,
    balconyCount,
    parkingCount,
    commercialSpaceType,
    usableSurface,
    builtSurface,
    spaceHeight,
    hasStreetWindow,
    streetWindowLength,
    hasStreetEntrance,
    hasLift,
    vehicleAccess,
  } = announcement ?? {};

  const toYesNo = (v: boolean | null | undefined) => (v === true ? "Da" : v === false ? "Nu" : undefined);
  const joinArr = (arr?: string[]) => (Array.isArray(arr) && arr.length ? arr.join(", ") : undefined);

  const utilRows: (string | undefined)[][] = [
    ["Curent", toYesNo(utilities?.curent)],
    ["Apă", toYesNo(utilities?.apa)],
    ["Canalizare", toYesNo(utilities?.canalizare)],
    ["Gaz", toYesNo(utilities?.gaz)],
  ].filter(([, v]) => v !== undefined);

  const hasAnything =
    !!landType ||
    !!landPlacement ||
    (urbanismDocuments && urbanismDocuments.length > 0) ||
    utilRows.length > 0 ||
    typeof streetFront === "boolean" ||
    (typeof streetFrontLength === "number" && streetFrontLength > 0) ||
    (heightRegime && heightRegime.length > 0) ||
    (typeof balconyCount === "number" && balconyCount > 0) ||
    (typeof parkingCount === "number" && parkingCount > 0) ||
    !!commercialSpaceType ||
    (typeof usableSurface === "number" && usableSurface > 0) ||
    (typeof builtSurface === "number" && builtSurface > 0) ||
    (typeof spaceHeight === "number" && spaceHeight > 0) ||
    typeof hasStreetWindow === "boolean" ||
    (typeof streetWindowLength === "number" && streetWindowLength > 0) ||
    typeof hasStreetEntrance === "boolean" ||
    typeof hasLift === "boolean" ||
    (vehicleAccess && vehicleAccess.length > 0);

  if (!hasAnything) return null;

  return (
    <SectionCard>
      <Typography variant="h6" sx={{ mb: 1.5 }}>
        Detalii suplimentare
      </Typography>

      {landType && (
        <Row>
          <Label>Tip teren</Label>
          <Value>{landType}</Value>
        </Row>
      )}
      {landPlacement && (
        <Row>
          <Label>Amplasare</Label>
          <Value>{landPlacement}</Value>
        </Row>
      )}
      {urbanismDocuments?.length > 0 && (
        <Row>
          <Label>Urbanism</Label>
          <Value>{joinArr(urbanismDocuments)}</Value>
        </Row>
      )}
      {utilRows.length > 0 && (
        <>
          {utilRows.map(([k, v]) => (
            <Row key={k}>
              <Label>{k}</Label>
              <Value>{v}</Value>
            </Row>
          ))}
        </>
      )}

      {typeof streetFront === "boolean" && (
        <Row>
          <Label>Front la stradă</Label>
          <Value>{toYesNo(streetFront)}</Value>
        </Row>
      )}
      {streetFront && typeof streetFrontLength === "number" && streetFrontLength > 0 && (
        <Row>
          <Label>Front la stradă (ml)</Label>
          <Value>{streetFrontLength}</Value>
        </Row>
      )}
      {heightRegime?.length > 0 && (
        <Row>
          <Label>Regim înălțime</Label>
          <Value>{joinArr(heightRegime)}</Value>
        </Row>
      )}

      {typeof balconyCount === "number" && balconyCount > 0 && (
        <Row>
          <Label>Număr balcoane</Label>
          <Value>{balconyCount}</Value>
        </Row>
      )}
      {typeof parkingCount === "number" && parkingCount > 0 && (
        <Row>
          <Label>Locuri parcare/garaj</Label>
          <Value>{parkingCount}</Value>
        </Row>
      )}

      {commercialSpaceType && (
        <Row>
          <Label>Tip spațiu</Label>
          <Value>{commercialSpaceType[0].toUpperCase() + commercialSpaceType.slice(1)}</Value>
        </Row>
      )}
      {typeof usableSurface === "number" && usableSurface > 0 && (
        <Row>
          <Label>Suprafață utilă (mp)</Label>
          <Value>{usableSurface}</Value>
        </Row>
      )}
      {typeof builtSurface === "number" && builtSurface > 0 && (
        <Row>
          <Label>Suprafață construită (mp)</Label>
          <Value>{builtSurface}</Value>
        </Row>
      )}
      {typeof spaceHeight === "number" && spaceHeight > 0 && (
        <Row>
          <Label>Înălțime spațiu (m)</Label>
          <Value>{spaceHeight}</Value>
        </Row>
      )}
      {typeof hasStreetWindow === "boolean" && (
        <Row>
          <Label>Vitrină la stradă</Label>
          <Value>{toYesNo(hasStreetWindow)}</Value>
        </Row>
      )}
      {typeof streetWindowLength === "number" && streetWindowLength > 0 && (
        <Row>
          <Label>Front vitrină (ml)</Label>
          <Value>{streetWindowLength}</Value>
        </Row>
      )}
      {typeof hasStreetEntrance === "boolean" && (
        <Row>
          <Label>Intrare din stradă</Label>
          <Value>{toYesNo(hasStreetEntrance)}</Value>
        </Row>
      )}
      {typeof hasLift === "boolean" && (
        <Row>
          <Label>Lift</Label>
          <Value>{toYesNo(hasLift)}</Value>
        </Row>
      )}
      {vehicleAccess?.length > 0 && (
        <Row>
          <Label>Acces auto</Label>
          <Value>{joinArr(vehicleAccess)}</Value>
        </Row>
      )}
    </SectionCard>
  );
};

const AnnouncementDetailPage: React.FC = () => {
  const { announcementStore } = useStore();
  const { getAnnouncementById, fetchAnnouncementImages, currentAnnouncement } = announcementStore;
  const params = useParams();
  const id = Array.isArray(params.id) ? params.id[0] : params.id;
  const isMobile = useMediaQuery(SIZES_NUMBER_TINY_SMALL);

  const [loading, setLoading] = useState(true);

  // 👉 Ref pentru a putea găsi primul <video> din galerie și a-l porni
  const galleryRootRef = useRef<HTMLDivElement | null>(null);

  // Load data
  useEffect(() => {
    if (!id) return;

    (async () => {
      setLoading(true);
      try {
        await getAnnouncementById(id);
        await fetchAnnouncementImages(id);
      } catch (err) {
        console.error("Error loading announcement or images:", err);
      } finally {
        setLoading(false);
      }
    })();
  }, [id, getAnnouncementById, fetchAnnouncementImages]);

  // ✅ Autoplay pe primul video după ce media e disponibilă și s-a randat
  useEffect(() => {
    if (loading) return;

    // mic delay ca să ne asigurăm că DOM-ul e gata
    const t = setTimeout(() => {
      const root = galleryRootRef.current ?? document;
      const firstVideo = root.querySelector("video") as HTMLVideoElement | null;
      if (firstVideo) {
        try {
          firstVideo.muted = false;        // necesar pentru autoplay pe mobile/desktop
          firstVideo.volume = 1.0;
          // @ts-ignore
          firstVideo.playsInline = true;  // iOS Safari
          firstVideo.setAttribute("playsinline", "true");
          firstVideo.autoplay = true;
          firstVideo.play().catch((e) => {
            // dacă browserul blochează autoplay, nu stricăm UX-ul
            console.warn("Autoplay blocked:", e);
          });
        } catch (e) {
          console.warn("Could not start autoplay:", e);
        }
      }
    }, 50);

    return () => clearTimeout(t);
  }, [loading]);

  if (loading) {
    return (
      <Layout paddingContainer>
        <CircularProgress />
      </Layout>
    );
  }

  const images = currentAnnouncement?.images ?? [];
  const videos = currentAnnouncement?.videos ?? [];
  const sketchUrl = currentAnnouncement?.sketchUrl;

  // 🔥 VIDEOURILE PRIMELE
  const media: MediaItem[] = [
    ...videos.map((vid) => ({ type: "video" as const, src: vid.original, format: vid.format })),
    ...images.map((img) => ({ type: "image" as const, src: img.original })),
    ...(sketchUrl ? [{ type: "floorplan" as const, src: sketchUrl }] : []),
  ];

  const renderDetails = () => (
    <DetailsContainer $flexdirection={isMobile ? "column" : "row"}>
      <Box flex={1} display="flex" flexDirection="column" gap={1}>
        <GalleryAlignmentWrapper ref={galleryRootRef}>
          {media.length > 0 ? (
            <UnifiedMediaGallery media={media} />
          ) : (
            <Box>No media available</Box>
          )}
        </GalleryAlignmentWrapper>

        <AdditionalDetailsCard announcement={currentAnnouncement} />

        <CharacteristicsCard />

        {currentAnnouncement?.description && <DescriptionCard />}
      </Box>

      {/* Right-side content (fixed width) */}
      <ContactContainer>
        <ContactCardComponent />
        {currentAnnouncement?.createdAt && <HistoryStatsCard createdAt={currentAnnouncement.createdAt} />}
        <ShareButtonsCard />
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
