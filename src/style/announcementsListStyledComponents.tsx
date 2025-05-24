import { COLOR_LIGHT_GREY, COLOR_TEXT_LIGHT } from "@/constants/colors";

// announcementsListStyledComponents.ts
import styled from "styled-components";

export const AnnouncementCard = styled.div`
  display: flex;
  position: relative;
  padding: 16px;
  margin-bottom: 12px;
  background: white;
  border-radius: 8px;
  box-shadow: 0px 2px 8px rgba(0, 0, 0, 0.1);
  flex-direction: row;
  gap: 16px;
  width: 100%;
  box-sizing: border-box;

  @media (max-width: 768px) {
    flex-direction: column;
    align-items: center;
    gap: 12px;
    margin-bottom: 16px;
    padding-top: 64px; /* Increased padding for icon space */
  }
`;

export const ImageContainer = styled.div`
  flex-shrink: 0;
  position: relative;
  width: 100%;

  img {
    width: 100%;
    height: auto;
    border-radius: 8px;
    object-fit: cover;
  }

  @media (min-width: 768px) {
    width: 250px;
    height: 200px;
  }

  @media (max-width: 768px) {
    width: 100%;
    height: auto;
  }
`;

export const DescriptionContainer = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  width: 100%;

  @media (max-width: 768px) {
    align-items: center;
    text-align: center;
    padding: 0 12px;
  }
`;

export const Title = styled.h2`
  font-size: 1.5rem;
  margin: 0 0 8px;
  color: black;
  width: 100%;

  @media (max-width: 768px) {
    font-size: 1.25rem;
    text-align: center;
  }
`;

export const Subtitle = styled.h3`
  font-size: 1.1rem;
  color: ${COLOR_TEXT_LIGHT};
  margin: 0;
`;

export const Price = styled.div`
  font-weight: bold;
  margin-left: auto;
  text-align: right;

  @media (max-width: 768px) {
    margin-left: 0;
    text-align: center;
  }
`;

export const PriceMP = styled.div`
  font-size: 0.9rem;
  color: ${COLOR_TEXT_LIGHT};
`;

export const Description = styled.p`
  font-size: 1rem;
  color: ${COLOR_TEXT_LIGHT};
  margin-top: 8px;

  @media (max-width: 768px) {
    font-size: 0.875rem;
  }
`;

export const ResponsiveListWrapper = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 24px;
  margin-bottom: 64px;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 16px;
  }
`;

export const IconButtonWrapper = styled.div`
  position: absolute;
  top: 12px;
  right: 12px;
  display: flex;
  gap: 12px;
  z-index: 2;

  @media (max-width: 768px) {
    top: 8px;
    right: 8px;
    gap: 8px;
    background: rgba(255, 255, 255, 0.8);
    border-radius: 8px;
    padding: 4px;
  }
`;

export const FlexRowToColumn = styled.div`
  display: flex;
  width: 100%;
  align-items: flex-start;

  @media (max-width: 768px) {
    flex-direction: column;
    align-items: center;
    gap: 8px;
  }
`;
