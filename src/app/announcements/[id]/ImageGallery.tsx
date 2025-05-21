import { ArrowLeft, ArrowRight } from "@mui/icons-material";
import { Box, Dialog } from "@mui/material";
import React, { useState } from "react";

import { SIZES_NUMBER_TINY_SMALL } from "@/constants/breakpoints";
import Slider from "react-slick";
import styled from "styled-components";
import { useMediaQuery } from "@/hooks/useMediaquery";

// Custom Arrow Buttons
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

const ImageGalleryWrapper = styled.div`
  width: 100%;
  height: 100%;
  overflow: hidden;
  position: relative;
`;

const ImageContainer = styled.div`
  width: 100%;
  aspect-ratio: 16 / 9;
  position: relative;
  overflow: hidden;
  cursor: zoom-in;
`;

const Image = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
`;

const CustomSliderImage = styled(Slider)`
  position: static;

  .slick-slide > div {
    height: 100%;
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

  .slick-list {
    overflow: hidden;
  }
`;

interface Image {
  original: string;
  thumbnail?: string;
}

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
    arrows: !isMobile,
    swipe: true,
    nextArrow: <NextArrow />,
    prevArrow: <PrevArrow />,
    lazyLoad: "ondemand" as const,
    adaptiveHeight: false,
  };

  return (
    <>
      <ImageGalleryWrapper>
        <CustomSliderImage {...settings}>
          {images.map((image, index) => (
            <ImageContainer key={index} onClick={() => openFullScreen(index)}>
              <Image src={image.original} alt={`Image ${index}`} />
            </ImageContainer>
          ))}
        </CustomSliderImage>
      </ImageGalleryWrapper>

      <Dialog
        fullScreen
        open={isFullScreenOpen}
        onClose={closeFullScreen}
        PaperProps={{ style: { backgroundColor: "black" } }}
        >
        <Box height="100%" width="100%" display="flex" alignItems="center" justifyContent="center">
            <Box width="100%" maxWidth="900px">
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

export default ImageGallery;