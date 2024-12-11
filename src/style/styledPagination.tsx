import * as screenSizes from "../constants/breakpoints";

import { Box } from "@mui/material";
import { MAX_TABLET } from "../constants/breakpoints";
import Pagination from "@mui/material/Pagination";
import PaginationItem from "@mui/material/PaginationItem";
import styled from "styled-components";

/*
This grid container is used in all the pages that have a grid of cards
insights, experiences, concepts, etc.
 */
export const GridContainer = styled(Box)`
  display: grid;
  grid-column-gap: 1.9rem;
  grid-row-gap: 2.7rem;
  width: 100%;

  @media (max-width: ${screenSizes.MAX_DESKTOP}) {
    grid-template-columns: repeat(3, 1fr);
  }

  @media (min-width: ${screenSizes.MIN_LARGE_DESKTOP}) {
    grid-template-columns: repeat(4, minmax(40rem, 1fr));
  }
`;

const BaseStyledPagination = styled(Pagination)`
  && {
    width: 100%;
  }
`;

export const StyledPagination = styled(BaseStyledPagination)`
  & .MuiPagination-ul {
    display: flex;
    justify-content: center;
  }
`;

export const StyledPaginationFlexEnd = styled(BaseStyledPagination)`
  & .MuiPagination-ul {
    display: flex;
    justify-content: flex-end;
  }
`;

export const StyledPaginationItem = styled(PaginationItem)`
  && {
    gap: 8px;
    width: 24px;
    height: 24px;
    border-radius: 4px;
    font-size: 12px;

    & .MuiPaginationItem-icon {
      font-size: 24px;
    }
  }
`;

