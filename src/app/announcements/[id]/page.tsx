"use client";

import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

import { ArrowLeft, ArrowRight, Pause, PlayArrow } from "@mui/icons-material";
import { Box, CircularProgress, Dialog, IconButton, Typography } from "@mui/material";
import React, { useEffect, useRef, useState } from "react";
import UnifiedMediaGallery, { MediaItem } from "./UnifiedMediaGallery";

import CharacteristicsCard from "@/app/announcements/[id]/CharacteristicsCard";
import ContactCardComponent from "@/app/announcements/[id]/ContactCard";
import DescriptionCard from "@/app/announcements/[id]/DescriptionCard";
import HistoryStatsCard from "./HistoryStatsCard";
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
  flex-direction: ${(p) => p.$flexdirection};
  justify-content: space-between;
  align-items: stretch;   /* ← stretch, not flex-start */
  gap: 2px;
  width: 100%;
`;

// Adjust your ContactContainer:
const ContactContainer = styled.div`
  flex: 0 0 300px;       /* ↪ never shrink below or grow beyond 300px */
  max-width: 300px;
  
  @media (max-width: 600px) {
    flex: 1 1 100%;       /* ↪ full-width on small screens */
    max-width: 100%;
  }
`;

const ColumnBox = styled(Box)`
  display: flex;
  flex-direction: column;
  gap: 2px;
`;

// Near the top, replace your MediaContainer & ResponsiveBox with:

const MediaContainer = styled(Box)<{ $flexdirection: string }>`
  display: flex;
  flex-direction: ${(p) => p.$flexdirection};
  flex-wrap: wrap;            /* ↪ allow items to wrap on narrow screens */
  gap: 2px;
  width: 100%;
`;

const GalleryAlignmentWrapper = styled.div`
  display: flex;
  justify-content: center;
  width: 100%;
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

  @media (max-width: 600px) {
    width: 50px;
    height: 50px;
    
    svg {
      width: 30px;
      height: 30px;
    }
  }
`;

const GalleryContainerImage = styled.div`
  width: 100%;
  max-width: 800px;
  aspect-ratio: 16 / 9;
  height: auto;
  position: relative;

  @media (max-width: 768px) {
    max-width: 100%;
    height: auto; /* Allows it to scale dynamically */
  }

  @media (max-width: 480px) {
    max-width: 100vw; /* Ensures no horizontal scrolling */
    padding: 0 8px;
    overflow-x: hidden;
  }
`;

const CustomSliderImage = styled(Slider)`
  position: static;

  .slick-slide > div {
    height: 100%; /* 🛠 Make sure slick slide wrapper fills height */
  }

  .slick-dots {
    position: absolute;
    bottom: 10px;
    width: 100%;
    display: flex !important;
    justify-content: center;
    align-items: center;
  }

  .slick-dots li {
    margin: 0 5px;
  }

  .slick-list {
    overflow: hidden; /* Hides the cloned ones from being visible outside */
  }

  .slick-dots li button:before {
    font-size: 12px;
    color: white;
    opacity: 0.75;
    transition: opacity 0.3s ease-in-out;
  }

  .slick-dots li.slick-active button:before {
    opacity: 1;
    color: white;
  }
`;

const CustomSlider = styled(Slider)`
  position: static; /* Allows for absolute positioning of arrows */

  .slick-dots {
    position: absolute;
    bottom: 10px; /* Ensures consistent position */
    width: 100%;
    display: flex !important;
    justify-content: center;
    align-items: center;
  }

  .slick-dots li {
    margin: 0 5px; /* Adds spacing between dots */
  }

  .slick-dots li button:before {
    font-size: 12px; /* Adjust dot size */
    color: white; /* Change color if needed */
    opacity: 0.75;
    transition: opacity 0.3s ease-in-out;
  }

  .slick-dots li.slick-active button:before {
    opacity: 1;
    color: white;
  }
`;

// 🔹 Custom Arrow Components
const PrevArrow = (props: any) => {
  const { onClick } = props;
  return (
    <ArrowButton $left onClick={onClick}>
      <ArrowLeft />
    </ArrowButton>
  );
};

const NextArrow = (props: any) => {
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
  aspect-ratio: 16 / 9;
  position: relative;
  overflow: hidden;
`;

const Image = styled.img`
  width: 100%;
  height: 100%;
  object-fit: contain;  // ✅ Ensures full image is visible, adds letterboxing if needed
  display: block;
  background-color: white; // Optional: helps make letterbox areas visually clean
`;

interface Image {
  original: string;
  thumbnail?: string;
}

const ImageGalleryWrapper = styled.div`
  width: 100%;
  height: 100%;
  overflow: hidden;
  position: relative;
`;

const ImageGallery: React.FC<{ images: Image[] }> = ({ images }) => {
  const [isFullScreenOpen, setIsFullScreenOpen] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState<number | null>(0);
  const isMobile = useMediaQuery(SIZES_NUMBER_TINY_SMALL);

  const openFullScreen = (index: number) => {
    setSelectedIndex(index);
    setIsFullScreenOpen(true);
  };

  const closeFullScreen = (index: number) => {
    setSelectedIndex(null);
    setIsFullScreenOpen(false);
  };

  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    arrows: !useMediaQuery(SIZES_NUMBER_TINY_SMALL), // Hide arrows on mobile
    swipe: true,
    nextArrow: <NextArrow onClick={undefined} />,
    prevArrow: <PrevArrow onClick={undefined} />,
    lazyLoad: "ondemand" as const,
    adaptiveHeight: false,
  };

  return (
    <>
      <ImageGalleryWrapper>
        <CustomSliderImage {...settings}>
          {images.map((image, index) => (
            <ImageContainer key={index} onClick={() => openFullScreen(index)} style={{ cursor: "zoom-in" }}>
              <Image src={image.original} alt={`Image ${index}`} />
            </ImageContainer>
          ))}
        </CustomSliderImage>
      </ImageGalleryWrapper>

      <Dialog
        fullScreen
        open={isFullScreenOpen}
        onClose={closeFullScreen}
        PaperProps={{ style: { backgroundColor: "white" } }}
      >
        <Box height="100%" width="100%" display="flex" alignItems="center" justifyContent="center">
          <Box width="100%" maxWidth="800px">
            <CustomSliderImage
              {...settings}
              initialSlide={selectedIndex ?? 0}
            >
              {images.map((image, index) => (
                <ImageContainer key={index}>
                  <Image src={image.original} alt={`Image ${index}`} />
                </ImageContainer>
              ))}
            </CustomSliderImage>
          </Box>
        </Box>
      </Dialog>

    </>
  );
};

const VideoContainer = styled(Box)`
  display: flex;
  flex-direction: column;
  gap: 2px;
  overflow: visible;
`;

const VideoWrapper = styled.div`
  position: relative;
  width: 100%;
  max-width: 800px;
  border-radius: 8px;
  overflow: hidden;
  background: black; /* Added background to prevent transparency issues */
`;

const Video = styled.video`
  width: 100%;
  border-radius: 8px;
  display: block; /* Prevent unwanted space under video */
`;

const ControlsContainer = styled.div`
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  background: rgba(0, 0, 0, 0.6);
  z-index: 10;
`;

const Controls = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px 16px;
`;

const ProgressBarContainer = styled.div`
  width: 100%;
  height: 10px;
  background: #e0e0e0;
  cursor: pointer;
`;

const ProgressBar = styled.div<{ progress: number }>`
  width: ${(props) => props.progress}%;
  height: 100%;
  background: #3f51b5;
`;

const Time = styled.span`
  font-size: 14px;
  color: #fff;
`;

const IconButtonStyled = styled(IconButton)`
  color: #fff;
`;

interface VideoItem {
  original: string;
  format: string;
}

const VideoGallery: React.FC<{ videos: VideoItem[] }> = ({ videos }) => {
  const videoRefs = useRef<HTMLVideoElement[]>([]);
  const [progress, setProgress] = useState<number[]>(Array(videos.length).fill(0));
  const [duration, setDuration] = useState<number[]>(Array(videos.length).fill(0));
  const [currentTime, setCurrentTime] = useState<number[]>(Array(videos.length).fill(0));
  const [isPlaying, setIsPlaying] = useState<boolean[]>(Array(videos.length).fill(false));
  const [mediaReady, setMediaReady] = useState(false);

  useEffect(() => {
    videoRefs.current = videoRefs.current.slice(0, videos.length);
  }, [videos.length]); 

  const getVideoRef = (index: number) => (el: HTMLVideoElement | null) => {
    if (el && !videoRefs.current[index]) {
      videoRefs.current[index] = el;
    }
  };

  const handleTimeUpdate = (index: number) => {
    const video = videoRefs.current[index];
    if (video) {
      const currentTime = video.currentTime;
      const duration = video.duration;
      setCurrentTime((prev) => {
        const newTimes = [...prev];
        newTimes[index] = currentTime;
        return newTimes;
      });
      setProgress((prev) => {
        const newProgress = [...prev];
        newProgress[index] = (currentTime / duration) * 100;
        return newProgress;
      });
    }
  };

  const handleLoadedMetadata = (index: number) => {
    const video = videoRefs.current[index];
    if (video) {
      setDuration((prev) => {
        const newDurations = [...prev];
        newDurations[index] = video.duration;
        return newDurations;
      });
    }
  };

  const handleProgressBarClick = (e: React.MouseEvent<HTMLDivElement>, index: number) => {
    const video = videoRefs.current[index];
    if (video) {
      const rect = e.currentTarget.getBoundingClientRect();
      const clickPosition = e.clientX - rect.left;
      const newTime = (clickPosition / rect.width) * duration[index];
      video.currentTime = newTime;
      setCurrentTime((prev) => {
        const newTimes = [...prev];
        newTimes[index] = newTime;
        return newTimes;
      });
      setProgress((prev) => {
        const newProgress = [...prev];
        newProgress[index] = (newTime / duration[index]) * 100;
        return newProgress;
      });
    }
  };

  const togglePlayPause = (index: number) => {
    const video = videoRefs.current[index];
    if (video) {
      if (video.paused) {
        video.play().catch((error) => console.error("Play error:", error)); // ✅ Catch autoplay errors
      } else {
        video.pause();
      }
      setIsPlaying((prev) => {
        const newPlaying = [...prev];
        newPlaying[index] = !prev[index];
        return newPlaying;
      });
    }
  };

  const formatTime = (time: number): string => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, "0")}`;
  };

  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    arrows: true,
    swipe: true,
    nextArrow: <NextArrow />,
    prevArrow: <PrevArrow />,
    lazyLoad: "ondemand" as const,
    adaptiveHeight: false,
  };

  return (
    <VideoContainer>
      <CustomSlider {...settings}>
        {videos.map((video, index) => (
          <div key={index}>
            <VideoWrapper>
              <Video
                ref={getVideoRef(index)}
                muted // 🔥 Helps with autoplay during testing
                controls={false}
                onTimeUpdate={() => handleTimeUpdate(index)}
                onLoadedMetadata={() => handleLoadedMetadata(index)}
              >
                <source src={video.original} type={`video/${video.format}`} />
                Your browser does not support the video tag.
              </Video>

              <ControlsContainer>
                <ProgressBarContainer onClick={(e) => handleProgressBarClick(e, index)}>
                  <ProgressBar progress={progress[index]} />
                </ProgressBarContainer>

                <Controls>
                  <IconButtonStyled onClick={() => togglePlayPause(index)}>
                    {isPlaying[index] ? <Pause /> : <PlayArrow />}
                  </IconButtonStyled>
                  <Time>
                    {formatTime(currentTime[index])} / {formatTime(duration[index])}
                  </Time>
                </Controls>
              </ControlsContainer>
            </VideoWrapper>
          </div>
        ))}
      </CustomSlider>
    </VideoContainer>
  );
};

const AnnouncementDetailPage: React.FC = () => {
  const { announcementStore } = useStore();
  const { getAnnouncementById, fetchAnnouncementImages, currentAnnouncement } = announcementStore;
  const params = useParams();
  const id = Array.isArray(params.id) ? params.id[0] : params.id;
  const isMobile = useMediaQuery(SIZES_NUMBER_TINY_SMALL);

  const [loading, setLoading] = useState(true);

  // Single effect to load everything in sequence
  useEffect(() => {
    if (!id) return;

    (async () => {
      setLoading(true);
      try {
        // 1) load the announcement by the route-param ID
        await getAnnouncementById(id);

        // 2) now load media for that same ID (we know it must exist)
        await fetchAnnouncementImages(id);
      } catch (err) {
        console.error("Error loading announcement or images:", err);
      } finally {
        setLoading(false);
      }
    })();
  }, [id, getAnnouncementById, fetchAnnouncementImages]);

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

  const media: MediaItem[] = [
    ...images.map((img) => ({ type: "image" as const, src: img.original })),
    ...videos.map((vid) => ({ type: "video" as const, src: vid.original, format: vid.format })),
    ...(sketchUrl ? [{ type: "floorplan" as const, src: sketchUrl }] : []),
  ];

  const renderDetails = () => (
    <DetailsContainer $flexdirection={isMobile ? "column" : "row"}>
      <Box flex={1} display="flex" flexDirection="column" gap={1}>
        <GalleryAlignmentWrapper>
          {media.length > 0 ? (
            <UnifiedMediaGallery media={media} />
          ) : (
            <Box>No media available</Box>
          )}
        </GalleryAlignmentWrapper>

        {currentAnnouncement && currentAnnouncement.description && <DescriptionCard />}
        
        <CharacteristicsCard />
        
        {currentAnnouncement?.createdAt && <HistoryStatsCard createdAt={currentAnnouncement.createdAt} />}

      </Box>

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