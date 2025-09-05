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
import ShareButtonsCard from "@/common/shareButtons/ShareButtonsCard";
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
  align-items: stretch;
  gap: 0px; /* compact spacing */
  width: 100%;
`;

const ContactContainer = styled.div`
  flex: 0 0 300px;
  max-width: 300px;
  margin-left: 8px !important; /* Ensure it doesn't shrink */

  @media (max-width: 600px) {
    flex: 1 1 100%;
    max-width: 100%;
    margin-top: 0;
  }
`;

const ColumnBox = styled(Box)`
  display: flex;
  flex-direction: column;
  gap: 0px; /* compact vertical spacing */
`;

const MediaContainer = styled(Box)<{ $flexdirection: string }>`
  display: flex;
  flex-direction: ${(p) => p.$flexdirection};
  flex-wrap: wrap;
  gap: 0px;
  width: 100%;
`;

const GalleryAlignmentWrapper = styled.div`
  display: flex;
  justify-content: center;
  width: 100%;
  margin: 0;
  padding: 0;
`;

const VideoContainerLegacy = styled(Box)`
  display: flex;
  flex-direction: column;
  gap: 0px;
  overflow: visible;
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

  // Pull values safely
  const {
    // Land
    landType,
    landPlacement,
    urbanismDocuments,
    utilities,
    // House (Casa / Case la tara)
    streetFront,
    streetFrontLength,
    heightRegime,
    // Apartment
    balconyCount,
    parkingCount,
    // Commercial
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

  // Transform helpers
  const toYesNo = (v: boolean | null | undefined) =>
    v === true ? "Da" : v === false ? "Nu" : undefined;

  const joinArr = (arr?: string[]) => Array.isArray(arr) && arr.length ? arr.join(", ") : undefined;

  const utilRows: (string | undefined)[][] = [
    ["Curent", toYesNo(utilities?.curent)],
    ["Apă", toYesNo(utilities?.apa)],
    ["Canalizare", toYesNo(utilities?.canalizare)],
    ["Gaz", toYesNo(utilities?.gaz)],
  ].filter(([, v]) => v !== undefined);

  // Decide if we have anything to show
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

      {/* --- LAND (Teren) --- */}
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

      {/* --- HOUSE (Casa / Case la tara) --- */}
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

      {/* --- APARTMENT --- */}
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

      {/* --- COMMERCIAL (Comercial) --- */}
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

        <AdditionalDetailsCard announcement={currentAnnouncement} />

        <CharacteristicsCard />

        {currentAnnouncement?.description && <DescriptionCard />}
      </Box>

      {/* Right-side content (fixed width) */}
      <ContactContainer>
          <ContactCardComponent />
          {currentAnnouncement?.createdAt && (
            <HistoryStatsCard createdAt={currentAnnouncement.createdAt} />
          )}
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