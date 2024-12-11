import styled from "styled-components";

import * as palette from "@/constants/colors";
import * as breakpoints from "@/constants/breakpoints";

import Flex from "@/common/flex/Flex";

export const Container = styled.div`
  background: ${palette.COLOR_CONTRAST};
  width: 100vw;
  height: 100vh;
  display: flex;
  align-items: center;
  flex-direction: column;
  justify-content: center;
  color: ${palette.COLOR_WHITE};
`;

export const Subtitle = styled.h2`
  font-weight: 500;
  font-size: 30px;
  @media only screen and (max-width: ${breakpoints.MIN_PHONE}) {
    font-size: 24px;
  }
`;

export const SearchContainer = styled(Flex)`
  height: 56px;
  width: fit-content !important;
  background: ${palette.COLOR_WHITE};
  padding: 2px 4px;
  border-radius: 4px;
  box-shadow: -1px 0px 20px -6px rgba(5, 20, 42, 0.5);
  border: 2px solid rgba(21, 85, 174, 0.5);

  @media screen and(max-width: ${breakpoints.SIZES_NUMBER_MEDIUM}) {
    padding: 40px 60px;
    width: 50%;
    flex-wrap: wrap;
    height: fit-content;
    margin: 0 32px;
  }
`;

export const Divider = styled.div`
  width: 1px;
  height: 56px;
  background: ${palette.COLOR_LIGHT_GREY};
  margin-right: 12px;
`;
