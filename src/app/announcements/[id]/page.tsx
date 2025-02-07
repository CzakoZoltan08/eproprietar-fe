"use client";

import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

import { ArrowLeft, ArrowRight } from "@mui/icons-material";
import { Box, CircularProgress } from "@mui/material";
import React, { useEffect, useState } from "react";

import CharacteristicsCard from "@/app/announcements/[id]/CharacteristicsCard";
import ContactCardComponent from "@/app/announcements/[id]/ContactCard";
import DescriptionCard from "@/app/announcements/[id]/DescriptionCard";
import ImagesCardComponent from "@/app/announcements/[id]/ImagesCard";
import { Layout } from "@/common/layout/Layout";
import { SIZES_NUMBER_TINY_SMALL } from "@/constants/breakpoints";
import Slider from "react-slick";
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
  width: 100%;
  max-width: 800px;
  height: 400px;
  margin: 0 auto 20px auto;
  overflow: hidden;

  @media (max-width: 1024px) {
    max-width: 700px;
    height: 350px;
  }

  @media (max-width: 768px) {
    max-width: 500px;
    height: 300px;
  }

  @media (max-width: 480px) {
    max-width: 100%;
    height: 250px;
  }
`;

// 🔹 Custom navigation arrows with better styling
const ArrowButton = styled.button<{ $left?: boolean }>`
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  ${(props) => (props.$left ? "left: 15px;" : "right: 15px;")}
  width: 40px;
  height: 40px;
  background: rgba(0, 0, 0, 0.5);
  color: white;
  border: none;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  z-index: 10;
  border-radius: 50%;
  transition: background 0.3s ease-in-out;

  &:hover {
    background: rgba(0, 0, 0, 0.8);
  }

  svg {
    width: 24px;
    height: 24px;
  }
`;

// 🔹 Custom Arrow Components
const PrevArrow = (props: { onClick: any; }) => {
  const { onClick } = props;
  return (
    <ArrowButton $left onClick={onClick}>
      <ArrowLeft />
    </ArrowButton>
  );
};

const NextArrow = (props: { onClick: any; }) => {
  const { onClick } = props;
  return (
    <ArrowButton onClick={onClick}>
      <ArrowRight />
    </ArrowButton>
  );
};

// 🔹 Ensure images fill the space properly
const ImageContainer = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const Image = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
`;

interface Image {
  original: string;
  thumbnail?: string;
}

const ImageGallery: React.FC<{ images: Image[] }> = ({ images }) => {
  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    arrows: true,
    nextArrow: <NextArrow onClick={undefined} />, // ✅ Custom Right Arrow
    prevArrow: <PrevArrow onClick={undefined} />, // ✅ Custom Left Arrow
  };

  return (
    <Slider {...settings}>
      {images.map((image: { original: string | undefined; }, index: React.Key | null | undefined) => (
        <ImageContainer key={index}>
          <Image src={image.original} alt={`Image ${index}`} />
        </ImageContainer>
      ))}
    </Slider>
  );
};

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
            <ImageGallery images={images} />
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