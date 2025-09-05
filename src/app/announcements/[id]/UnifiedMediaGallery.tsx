"use client";

import {
  ArrowLeft,
  ArrowRight,
  Collections,
  Layers,
  Photo,
  VideoLibrary,
} from "@mui/icons-material";
import { Box, Dialog, IconButton, Typography } from "@mui/material";
import React, { useState } from "react";

import Slider from "react-slick";
import styled from "styled-components";

// Types
export type MediaItem = {
  type: "image" | "video" | "floorplan";
  src: string;
  thumbnail?: string;
  format?: string;
};

interface Props {
  media: MediaItem[];
}

const GalleryContainer = styled.div`
  width: 100%;
  max-width: 800px;
  position: relative;
  margin: 0 auto;
`;

const GalleryWrapper = styled.div`
  width: 100%;
  aspect-ratio: 16 / 9;
  overflow: hidden;
  position: relative;
`;

const MediaContainer = styled.div`
  width: 100%;
  aspect-ratio: 16 / 9;
  position: relative;
  overflow: hidden;
  background: #000;
  cursor: pointer;
`;

const StyledImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: contain;
  background-color: white;
`;

const StyledVideo = styled.video`
  width: 100%;
  height: 100%;
  object-fit: contain;
  background-color: black;
`;

const OverlayLabel = styled.div`
  position: absolute;
  top: 8px;
  left: 8px;
  background: rgba(0, 0, 0, 0.6);
  color: white;
  padding: 2px 6px;
  font-size: 12px;
  border-radius: 4px;
`;

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
`;

const CategoryRow = styled.div`
  margin-top: 8px;
  display: flex;
  gap: 8px;
  align-items: center;
  justify-content: center;
`;

const CategoryButton = styled(IconButton)<{ selected: boolean }>`
  width: 40px;
  height: 40px;
  border: 1px solid ${(props) => (props.selected ? "#007BFF" : "#ccc")};
  background-color: ${(props) => (props.selected ? "#007BFF" : "white")};
  color: ${(props) => (props.selected ? "white" : "black")};
  border-radius: 8px;

  &:hover {
    background-color: ${(props) => (props.selected ? "#005bb5" : "#f0f0f0")};
  }
`;

const PrevArrow = (props: any) => (
  <ArrowButton $left onClick={props.onClick}>
    <ArrowLeft />
  </ArrowButton>
);
const NextArrow = (props: any) => (
  <ArrowButton onClick={props.onClick}>
    <ArrowRight />
  </ArrowButton>
);

const UnifiedMediaGallery: React.FC<Props> = ({ media }) => {
  const [fullscreen, setFullscreen] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(0); // Global index in media[]
  const [mainSlide, setMainSlide] = useState(0); // Filtered view index
  const [fullscreenSlide, setFullscreenSlide] = useState(0); // Fullscreen slider index
  const [selectedType, setSelectedType] = useState<
    "all" | "image" | "video" | "floorplan"
  >("all");

  const hasImages = media.some((item) => item.type === "image");
  const hasVideos = media.some((item) => item.type === "video");
  const hasFloorplans = media.some((item) => item.type === "floorplan");

  const filteredMedia =
    selectedType === "all"
      ? media
      : media.filter((item) => item.type === selectedType);

  const sliderSettings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    arrows: true,
    swipe: true,
    nextArrow: <NextArrow />,
    prevArrow: <PrevArrow />,
  };

  return (
    <>
      <GalleryContainer>
        <GalleryWrapper>
          <Slider
            {...sliderSettings}
            beforeChange={(_, next) => setMainSlide(next)}
          >
            {filteredMedia.map((item, index) => (
              <MediaContainer
                key={index}
                onClick={() => {
                  if (item.type !== "video") {
                    const globalIndex = media.findIndex(
                      (m) => m.src === item.src && m.type === item.type
                    );
                    setSelectedIndex(globalIndex);
                    setFullscreenSlide(globalIndex);
                    setFullscreen(true);
                  }
                }}
              >
                {item.type === "video" ? (
                  <StyledVideo controls>
                    <source
                      src={item.src}
                      type={`video/${item.format || "mp4"}`}
                    />
                  </StyledVideo>
                ) : (
                  <StyledImage src={item.src} alt={`media-${index}`} />
                )}

                {item.type !== "image" && (
                  <OverlayLabel>
                    {item.type === "video" ? "Video" : "Plan"}
                  </OverlayLabel>
                )}
              </MediaContainer>
            ))}
          </Slider>

          <Typography
            position="absolute"
            bottom={8}
            right={8}
            fontSize="14px"
            color="white"
            bgcolor="rgba(0,0,0,0.6)"
            px={1}
            borderRadius="4px"
          >
            {fullscreen
              ? `${fullscreenSlide + 1} / ${media.length}`
              : `${mainSlide + 1} / ${filteredMedia.length}`}
          </Typography>
        </GalleryWrapper>

        <CategoryRow>
          {hasImages && (
            <CategoryButton
              selected={selectedType === "image"}
              onClick={() => {
                setSelectedType("image");
                setMainSlide(0);
              }}
            >
              <Photo />
            </CategoryButton>
          )}
          {hasFloorplans && (
            <CategoryButton
              selected={selectedType === "floorplan"}
              onClick={() => {
                setSelectedType("floorplan");
                setMainSlide(0);
              }}
            >
              <Layers />
            </CategoryButton>
          )}
          {hasVideos && (
            <CategoryButton
              selected={selectedType === "video"}
              onClick={() => {
                setSelectedType("video");
                setMainSlide(0);
              }}
            >
              <VideoLibrary />
            </CategoryButton>
          )}
          <CategoryButton
            selected={selectedType === "all"}
            onClick={() => {
              setSelectedType("all");
              setMainSlide(0);
            }}
          >
            <Collections />
          </CategoryButton>
        </CategoryRow>
      </GalleryContainer>

      {/* Fullscreen Dialog */}
      <Dialog
        fullScreen
        open={fullscreen}
        onClose={() => {
          setFullscreen(false);
          setFullscreenSlide(0);
        }}
      >
        <Box
          width="100%"
          height="100%"
          display="flex"
          alignItems="center"
          justifyContent="center"
        >
          <Box width="100%" maxWidth="900px">
            <Slider
              {...sliderSettings}
              initialSlide={selectedIndex}
              beforeChange={(_, next) => setFullscreenSlide(next)}
            >
              {media.map((item, index) => (
                <MediaContainer key={index}>
                  {item.type === "video" ? (
                    <StyledVideo controls>
                      <source
                        src={item.src}
                        type={`video/${item.format || "mp4"}`}
                      />
                    </StyledVideo>
                  ) : (
                    <StyledImage src={item.src} alt={`media-${index}`} />
                  )}
                  {item.type !== "image" && (
                    <OverlayLabel>
                      {item.type === "video" ? "Video" : "Plan"}
                    </OverlayLabel>
                  )}
                </MediaContainer>
              ))}
            </Slider>
          </Box>
        </Box>
      </Dialog>
    </>
  );
};

export default UnifiedMediaGallery;