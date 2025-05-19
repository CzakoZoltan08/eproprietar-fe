"use client";

import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

import { ArrowLeft, ArrowRight, Pause, PlayArrow } from "@mui/icons-material";
import { Box, CircularProgress, IconButton, Typography } from "@mui/material";
import React, { useEffect, useRef, useState } from "react";

import CharacteristicsCard from "@/app/announcements/[id]/CharacteristicsCard";
import ContactCardComponent from "@/app/announcements/[id]/ContactCard";
import DescriptionCard from "@/app/announcements/[id]/DescriptionCard";
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
  aspect-ratio: 16 / 9;
  overflow: hidden;
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

const ResponsiveBox = styled(Box)`
  display: flex;
  flex-direction: row;
  justifyContent: center;
  alignItems: center;
  width: 50%;
  overflow: hidden;

  @media (max-width: 480px) {
    width: 100vw; /* Ensures it does not exceed viewport width */
  }
`;


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
  object-fit: cover;
  display: block;
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
    adaptiveHeight: false, // ❌ Disables height jumping issue
  };

  return (
    <ImageGalleryWrapper>
      <CustomSliderImage {...settings}>
        {images.map((image, index) => (
          <ImageContainer key={index}>
            <Image src={image.original} alt={`Image ${index}`} />
          </ImageContainer>
        ))}
      </CustomSliderImage>
    </ImageGalleryWrapper>
  );
};

const VideoContainer = styled(Box)`
  display: flex;
  flex-direction: column;
  gap: 16px;
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
  const {
    announcementStore: { getAnnouncementById, setCurrentAnnouncement, currentAnnouncement, fetchAnnouncementImages },
  } = useStore();
  const params = useParams();
  const { id } = params;
  const isMobile = useMediaQuery(SIZES_NUMBER_TINY_SMALL);

  const [announcement, setAnnouncement] = useState<typeof currentAnnouncement | null>(null);
  const [images, setImages] = useState<Image[]>([]);
  const [videos, setVideos] = useState<VideoItem[]>([]);

  useEffect(() => {
    if (!id) return;

    // Clear previous content immediately
    setAnnouncement(null);
    setImages([]);
    setVideos([]);

    // Fetch and wait
    const announcementId = Array.isArray(id) ? id[0] : id;
    getAnnouncementById(announcementId).then(() => {
      const fetched = currentAnnouncement;
      if (fetched?.id && fetched?.user?.id) {
        fetchAnnouncementImages(fetched.user.id, fetched.id).then(() => {
          setAnnouncement({ ...fetched });
          setImages(fetched.images ?? []);
          setVideos(fetched.videos ?? []);
        });
      }
    });
 }, [id]);

  useEffect(() => {
    if (currentAnnouncement?.id && currentAnnouncement.images) {
      setAnnouncement(currentAnnouncement);
    } else {
      setAnnouncement(null); // Reset to avoid showing stale content
    }
  }, [currentAnnouncement?.id, currentAnnouncement?.images]);


  // Fetch Announcement Data
  useEffect(() => {
    if (id) {
      // reset before loading new announcement
      setCurrentAnnouncement({
        id: "",
        title: "",
        description: "",
        images: [],
        videos: [],
        user: {
          email: null,
          firstName: null,
          lastName: null,
          firebaseId: null,
          role: ""
        },
        announcementType: "",
        providerType: "",
        transactionType: "",
        city: "",
        county: "",
        price: 0,
        rooms: 0,
        surface: 0,
        currency: "",
        floor: 0
      }); // 👈 reset
      getAnnouncementById(Array.isArray(id) ? id[0] : id);
    }
  }, [id, getAnnouncementById]);


  useEffect(() => {
    if (announcement?.id && announcement?.user?.id) {
      fetchAnnouncementImages(announcement.user.id, announcement.id);
    }
  }, [announcement?.id, announcement?.user?.id, fetchAnnouncementImages]);

  // Render Loading Spinner
  if (!announcement?.id || !announcement.images) {
    return (
      <Layout paddingContainer>
        <CircularProgress />
      </Layout>
    );
  }

  // Common Layout
  const renderDetails = () => (
    <DetailsContainer $flexdirection={isMobile ? "column" : "row"}>
      <div style={{ display: "flex", flexDirection: "column", gap: 16, justifyContent: "center", alignItems: "center" }}>
        <ResponsiveBox>
          <GalleryContainerImage>
            {images.length > 0 ? (
              <ImageGallery key={announcement.id} images={images} />
            ) : (
              <Box>No images available</Box>
            )}
          </GalleryContainerImage>
        </ResponsiveBox>
  
        {/* ✅ Responsive Video Gallery Section */}
        <ResponsiveBox>
          {videos.length > 0 && (
            <GalleryContainer>
              <VideoGallery key={announcement.id} videos={videos} />
            </GalleryContainer>
          )}
        </ResponsiveBox>
  
        {/* Description & Characteristics */}
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