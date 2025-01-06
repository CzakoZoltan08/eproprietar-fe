import * as palette from "@/constants/colors";

import { Flex } from "../common/flex/Flex";
import styled from "styled-components";

export const Card = styled(Flex)`
  background: ${palette.COLOR_WHITE};
  box-shadow: 0 1px 5px -1px rgb(0 0 0 / 13%);
  border-radius: 8px;
  width: ${(props) => props.width || "100%"};
  height: fit-content;
  margin-bottom: 20px;
  padding: 18px;
  box-sizing: border-box;
  color: ${palette.COLOR_TEXT};
`;

export const TitleCard = styled(Card).withConfig({
  shouldForwardProp: (prop) => prop !== "alignItems",
})`
  flex-direction: column;
  align-items: ${(props) => props.$alignItems || "flex-start"};
`;

interface TitleProps {
  $marginBottom?: string;
}

export const Title = styled.div<TitleProps>`
  line-height: 20px;
  font-size: 20px;
  margin-bottom: ${(props) => props.$marginBottom || "0"};
`;


interface DividerProps {
  background?: string;
  margin?: string;
}

export const Divider = styled.div<DividerProps>`
  height: 1px;
  width: 100%;
  background: ${(props) => props.background || "#979797"};
  margin: ${(props) => props.margin || "16px 0"};
`;

export const Subtitle = styled.div`
  font-size: 15px;
  font-weight: 700;
  width: 100%;
  text-align: right;

  span {
    font-weight: normal;
  }
`;

export const Price = styled.div`
  font-size: 20px;
  font-weight: 700;
  width: 100%;
  color: ${palette.COLOR_TEXT};
`;

export const PriceMP = styled(Price)`
  font-size: 12px !important;
  color: ${palette.COLOR_TEXT_LIGHT};
`;

export const TextGrayLabel = styled.div`
  padding: 3px 5px;
  line-height: 16px;
  text-transform: uppercase;
  background: #e4e4e4;
  border-radius: 4px;
  color: #fff;
  height: 24px;
  font-size: 16px;
  margin: 16px;
`;
