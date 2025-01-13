import * as breakpoints from "@/constants/breakpoints";
import * as palette from "@/constants/colors";

import Flex from "@/common/flex/Flex";
import styled from "styled-components";

interface SelectDropdownContainerProps {
  $isWide?: boolean;
}

export const SelectDropdownContainer = styled.div<SelectDropdownContainerProps>`
  flex: ${(props) => (props.$isWide ? "2" : "1")}; /* Styled-components convention: Use $ for props */
  min-width: ${(props) => (props.$isWide ? "200px" : "100px")};
  max-width: ${(props) => (props.$isWide ? "400px" : "200px")};
`;

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
  height: auto;
  width: 90%;
  justifyContent: center;
  max-width: 1200px; 
  min-width: 500px; 
  background: ${palette.COLOR_WHITE};
  padding: 16px 24px;
  border-radius: 12px;
  box-shadow: -1px 0px 20px -6px rgba(5, 20, 42, 0.5);
  border: 2px solid rgba(21, 85, 174, 0.5);
  display: flex;
  align-items: center;
  gap: 4px; /* Reduced space between input and button */

  @media only screen and (max-width: ${breakpoints.SIZES_NUMBER_MEDIUM}) {
    width: 95%;
    flex-wrap: wrap;
    justify-content: center;
    height: auto;
  }

  @media only screen and (max-width: ${breakpoints.MIN_PHONE}) {
    width: 100%;
    padding: 16px;
    margin: 12px auto;
  }
`;

export const SearchInput = styled.input`
  flex: 4; 
  height: 70px;
  padding: 0 24px;
  font-size: 22px;
  color: ${palette.COLOR_TEXT};
  border: 2px solid ${palette.COLOR_BORDER_PRIMARY};
  border-radius: 12px;
  outline: none;

  &::placeholder {
    color: ${palette.COLOR_LIGHT_GREY};
  }
`;

export const SearchButton = styled.button`
  height: 70px;
  width: 200px; /* Wider button */
  background: ${palette.COLOR_PRIMARY};
  color: ${palette.COLOR_WHITE};
  font-size: 22px; 
  font-weight: bold;
  border: none;
  border-radius: 12px;
  cursor: pointer;
  transition: background 0.3s ease;

  &:hover {
    background: ${palette.COLOR_BLUE_BUTTON};
  }
`;

export const Divider = styled.div`
  width: 1px;
  height: 56px;
  background: ${palette.COLOR_LIGHT_GREY};
  margin-right: 12px;
`;
