"use client";

import { Box, Typography } from "@mui/material";
import React, { useCallback, useEffect, useState } from "react";
import {
  StyledPagination,
  StyledPaginationItem,
} from "@/style/styledPagination";
import { useRouter, useSearchParams } from "next/navigation";

import AnnouncementListItem from "@/app/announcements/AnnouncementListItem";
import { COLOR_TEXT } from "@/constants/colors";
import { observer } from "mobx-react";
import styled from "styled-components";
import { useStore } from "@/hooks/useStore";

// Constants
const DEFAULT_TITLE = "Anunturi";
const PAGE_LIMIT = 8;
const FILTER_KEYS = [
  "transactionType",
  "rooms",
  "price",
  "minSurface",
  "maxSurface",
  "city",
  "type",
  "userId",
] as const;

// Styled Components
const TitleBox = styled(Typography).attrs({
  variant: "h4",
  as: "h1",
})`
  font-weight: 600;
  margin-bottom: 32px;
  color: ${COLOR_TEXT};
`;

const PaginationContainer = styled(Box)`
  display: flex;
  justify-content: center;
  margin-top: 16px;
`;

const AnnouncementList = ({ paginated = true }: { paginated: boolean }) => {
  const {
    announcementStore: { fetchPaginatedAnnouncements, announcements, meta },
  } = useStore();
  const searchParams = useSearchParams();
  const router = useRouter();

  const [page, setPage] = useState(Number(searchParams.get("page")) || 1);
  const [initialFetch, setInitialFetch] = useState(false);
  const title = searchParams.get("title") || DEFAULT_TITLE;

  // Utility: Extract valid filters from searchParams
  const getFilters = useCallback(() => {
    return FILTER_KEYS.reduce((acc, key) => {
      const value = searchParams.get(key);
      if (value !== null) {
        acc[key] = value;
      }
      return acc;
    }, {} as Record<string, string | number | string[]>);
  }, [searchParams]);

  // Utility: Build pagination URL
  const buildPaginationUrl = useCallback(
    (newPage: number) => {
      const params = new URLSearchParams(searchParams.toString());
      params.set("page", newPage.toString());
      return `/my-announcements?${params.toString()}`;
    },
    [searchParams]
  );

  // Fetch data with pagination
  const fetchData = useCallback(
    async (newPage: number) => {
      try {
        const validFilters = getFilters();
        await fetchPaginatedAnnouncements({
          page: newPage,
          limit: PAGE_LIMIT,
          filter: validFilters,
        });
      } catch (error) {
        console.error("Error fetching announcements:", error);
      }
    },
    [fetchPaginatedAnnouncements, getFilters]
  );

  useEffect(() => {
    if (paginated && !initialFetch) {
      fetchData(page);
      setInitialFetch(true);
    }
  }, [paginated, initialFetch, page, fetchData]);

  const handleChangePage = async (
    event: React.ChangeEvent<unknown>,
    newPage: number
  ) => {
    setPage(newPage); // Update page state first
    await fetchData(newPage);
    router.push(buildPaginationUrl(newPage));
  };

  return (
    <Box>
      <TitleBox>{title}</TitleBox>

      {announcements.map((item, index) => (
        <AnnouncementListItem key={`announcement-${index}`} item={item} />
      ))}

      {paginated && meta?.totalPages > 1 && (
        <PaginationContainer>
          <StyledPagination
            count={meta.totalPages}
            page={page}
            onChange={handleChangePage}
            defaultPage={1}
            color="primary"
            size="large"
            renderItem={(item) => <StyledPaginationItem {...item} />}
          />
        </PaginationContainer>
      )}
    </Box>
  );
};

export default observer(AnnouncementList);