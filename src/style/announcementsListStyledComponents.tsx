import styled from "styled-components";
import { Box } from "@mui/material";

import { COLOR_TEXT, COLOR_TEXT_LIGHT, COLOR_WHITE } from "@/constants/colors";
import * as breakpoints from "@/constants/breakpoints";

export const AnnouncementCard = styled(Box)`
  background: ${COLOR_WHITE};
  box-shadow: 0 1px 5px -1px rgb(0 0 0 / 13%);
  border-radius: 8px;
  width: 100%;
  height: 200px;
  margin-bottom: 20px;
  position: relative;
`;

export const ImageContainer = styled.div`
  //flex: 1;
  height: 100%;
  overflow: hidden;
  border-radius: 8px;
`;

export const Image = styled.img`
  height: 100%;
  width: 100%;
`;

export const DescriptionContainer = styled.div`
  flex: 2;
  color: ${COLOR_TEXT_LIGHT};
  padding: 16px;
`;

export const Title = styled.div`
  margin: 0 0 16px 0;
  line-height: 20px;
  font-size: 18px;
  color: ${COLOR_TEXT};
`;

export const Subtitle = styled.div`
  font-size: 15px;
  font-weight: 700;
  text-align: left;
  width: 100%;
  span {
    font-weight: normal;
  }

  @media only screen and (max-width: ${breakpoints.MAX_PHONE}) {
    font-size: 12px;
  }
`;

export const Description = styled.div`
  text-overflow: ellipsis;
  overflow: hidden;
  display: -webkit-box;
  max-height: 48px;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  margin-top: 12px;

  @media only screen and (max-width: ${breakpoints.MAX_PHONE}) {
    font-size: 14px;
  }
`;

export const Price = styled.div`
  font-size: 20px;
  font-weight: 700;
  width: 100%;
  color: ${COLOR_TEXT};
  text-align: right;
  @media only screen and (max-width: ${breakpoints.MAX_PHONE}) {
    font-size: 14px;
  }
`;

export const PriceMP = styled(Price)`
  font-size: 12px !important;
  color: ${COLOR_TEXT_LIGHT};
`;
