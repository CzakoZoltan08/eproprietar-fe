"use client";

import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/thumbs";

import { Box, CircularProgress } from "@mui/material";
import { Navigation, Pagination, Thumbs } from "swiper/modules";
import React, { useEffect } from "react";
import { Swiper, SwiperSlide } from "swiper/react";

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

const GalleryContainer = styled.div`
  width: 100%;  // ✅ Allows the gallery to resize with the screen
  max-width: 800px; // ✅ Limits the max width on larger screens
  height: 400px; // ✅ Keeps the height fixed to avoid layout shifts
  margin: 0 auto 20px auto; // ✅ Centers the gallery
  overflow: hidden;

  .swiper {
    width: 100%;
    height: 100%;
  }

  .swiper-slide {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100%;
    height: 100%;
  }

  .swiper-slide img {
    max-width: 100%;
    max-height: 100%;
    width: auto;
    height: auto;
    object-fit: contain;
  }

  @media (max-width: 1024px) {
    max-width: 700px;
    height: 350px;
  }

  @media (max-width: 768px) {
    max-width: 500px;
    height: 300px;
  }

  @media (max-width: 480px) {
    max-width: 100%; // ✅ Ensures full width on mobile
    height: 250px; // ✅ Adjust height for small screens
  }
`;


const AnnouncementDetailPage: React.FC = () => {
  const {
    announcementStore: { getAnnouncementById, currentAnnouncement, fetchAnnouncementImages },
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

  useEffect(() => {
    if (currentAnnouncement?.id && currentAnnouncement?.user?.id) {
      fetchAnnouncementImages(currentAnnouncement.user.id, currentAnnouncement.id);
    }
  }, [currentAnnouncement?.id, currentAnnouncement?.user?.id, fetchAnnouncementImages]);

  // Render Loading Spinner
  if (!currentAnnouncement?.id) {
    return (
      <Layout paddingContainer>
        <CircularProgress />
      </Layout>
    );
  }

  // Prepare images for the gallery
  const images = currentAnnouncement.images?.map((image) => ({
    original: image.original,
    thumbnail: image.thumbnail,
  })) ?? [];

  // Common Layout
  const renderDetails = () => (
    <DetailsContainer $flexdirection={isMobile ? "column" : "row"}>
      <div>
      <GalleryContainer>
          {images.length > 0 ? (
            <>
              <Swiper
                modules={[Navigation, Pagination, Thumbs]}
                navigation
                pagination={{ clickable: true }}
                spaceBetween={10}
                slidesPerView={1}
                loop={true}
                style={{ width: "100%", height: "100%" }} // ✅ Ensures the gallery scales properly
                breakpoints={{
                  1024: { slidesPerView: 1 },
                  768: { slidesPerView: 1 },
                  480: { slidesPerView: 1 },
                }}
              >
                {images.map((image, index) => (
                  <SwiperSlide key={index}>
                    <div
                      style={{
                        width: "100%",
                        height: "100%",
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                      }}
                    >
                      <img src={image.original} alt={`Image ${index}`} />
                    </div>
                  </SwiperSlide>
                ))}
              </Swiper>
            </>
          ) : (
            <Box>No images available</Box>
          )}
        </GalleryContainer>

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