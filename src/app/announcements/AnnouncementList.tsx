"use client";

import { Box, Typography } from "@mui/material";
import React, { useEffect, useState } from "react";
import {
  StyledPagination,
  StyledPaginationItem,
} from "@/style/styledPagination";
import { useRouter, useSearchParams } from "next/navigation";

import AnnouncementListItem from "@/app/announcements/AnnouncementListItem";
import { COLOR_TEXT } from "@/constants/colors";
import { observer } from "mobx-react";
import { useStore } from "@/hooks/useStore";

const AnnouncementList = ({ paginated = true }: { paginated: boolean }) => {
  const {
    announcementStore: { fetchPaginatedAnnouncements, announcements, meta },
  } = useStore();
  const searchParams = useSearchParams();
  const router = useRouter();

  const [page, setPage] = useState(Number(searchParams.get("page")) || 1);
  const [initialFetch, setInitialFetch] = useState(false);
  const title = searchParams.get("title") || "Anunturi";

  const fetchData = async (newPage: number) => {
    const filters = {
      transactionType: searchParams.get("transactionType"),
      rooms: searchParams.get("rooms"),
      price: searchParams.get("price"),
      minSurface: searchParams.get("minSurface"),
      maxSurface: searchParams.get("maxSurface"),
      city: searchParams.get("city"),
      type: searchParams.get("type"),
      userId: searchParams.get("userId"),
    };
  
    // Remove keys with null values
    const validFilters = Object.fromEntries(
      Object.entries(filters).filter(([_, value]) => value !== null)
    ) as { [column: string]: string | number | string[] };
  
    await fetchPaginatedAnnouncements({
      page: newPage,
      limit: 8,
      filter: validFilters,
    });
  };

  useEffect(() => {
    if (paginated && !initialFetch) {
      fetchData(page);
      setInitialFetch(true);
    }
  }, [page, paginated, initialFetch]);

  const handleChangePage = async (
    event: React.ChangeEvent<unknown>,
    newPage: number
  ) => {
    setPage(newPage); // Update page first
    await fetchData(newPage);

    const params = new URLSearchParams(searchParams.toString());
    params.set("page", newPage.toString());
    router.push(`/my-announcements?${params.toString()}`);
  };

  return (
    <Box>
      <Typography
        variant="h4"
        sx={{ fontWeight: 600, marginBottom: "32px" }}
        color={COLOR_TEXT}
      >
        {title}
      </Typography>

      {announcements.map((item, index) => (
        <AnnouncementListItem key={`announcement-${index}`} item={item} />
      ))}

      {paginated && meta?.totalPages > 1 && (
        <Box component="span">
          <StyledPagination
            count={meta.totalPages}
            page={page}
            onChange={handleChangePage}
            defaultPage={1}
            color="primary"
            size="large"
            renderItem={(item) => <StyledPaginationItem {...item} />}
          />
        </Box>
      )}
    </Box>
  );
};

export default observer(AnnouncementList);