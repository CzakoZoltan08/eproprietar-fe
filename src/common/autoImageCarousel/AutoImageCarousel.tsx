"use client";

import React, { useEffect, useState } from "react";

import styled from "styled-components";

interface AutoImageCarouselProps {
  images: { url: string }[];
  interval?: number;
}

const CarouselWrapper = styled.div`
  position: relative;
  width: 100%;
  height: 400px;
  border-radius: 16px;
  overflow: hidden;
`;

const Image = styled.img.withConfig({
  shouldForwardProp: (prop) => prop !== "$active",
})<{ $active: boolean }>`
  position: absolute;
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: opacity 0.6s ease-in-out;
  opacity: ${({ $active }) => ($active ? 1 : 0)};
`;

const Dots = styled.div`
  position: absolute;
  bottom: 16px;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  gap: 6px;
`;

const Dot = styled.div.withConfig({
  shouldForwardProp: (prop) => prop !== "$active",
})<{ $active: boolean }>`
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background-color: ${({ $active }) => ($active ? "#fff" : "#aaa")};
  transition: background-color 0.3s ease;
`;

export const AutoImageCarousel: React.FC<AutoImageCarouselProps> = ({
  images,
  interval = 4000,
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % images.length);
    }, interval);
    return () => clearInterval(timer);
  }, [images.length, interval]);

  if (!images || images.length === 0) return null;

  return (
    <CarouselWrapper>
      {images.map((img, index) => (
        <Image key={index} src={img.url} alt={`Image ${index}`} $active={index === currentIndex} />
      ))}
      <Dots>
        {images.map((_, index) => (
          <Dot key={index} $active={index === currentIndex} />
        ))}
      </Dots>
    </CarouselWrapper>
  );
};