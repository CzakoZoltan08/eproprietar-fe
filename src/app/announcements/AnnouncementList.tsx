"use client";

import { Box, Typography } from "@mui/material";
import React, { useEffect, useState } from "react";
import {
  StyledPagination,
  StyledPaginationItem,
} from "@/style/styledPagination";

import AnnouncementListItem from "@/app/announcements/AnnouncementListItem";
import { COLOR_TEXT } from "@/constants/colors";
import { observer } from "mobx-react";
import { useSearchParams } from "next/navigation";
import { useStore } from "@/hooks/useStore";

const AnnouncementList = ({ paginated = true }: { paginated: boolean }) => {
  const {
    announcementStore: { fetchPaginatedAnnouncements, announcements, meta },
  } = useStore();
  const searchParams = useSearchParams();

  const [page, setPage] = useState<number | null>(null); // Initialize as null
  const [filters, setFilters] = useState<Record<string, string | number>>({});
  const [isInitialized, setIsInitialized] = useState(false);

  const initializeFilters = () => {
    const type = searchParams.get("type") || sessionStorage.getItem("type") || "";
    const parseNumber = (value: string | null) => (value ? parseInt(value, 10) : 0);

    const initialFilters: Record<string, string | number> = {
      transactionType: searchParams.get("transactionType") || sessionStorage.getItem("transactionType") || "",
      price: searchParams.get("price") || sessionStorage.getItem("price") || "",
      minSurface: parseNumber(searchParams.get("minSurface") || sessionStorage.getItem("minSurface")),
      maxSurface: parseNumber(searchParams.get("maxSurface") || sessionStorage.getItem("maxSurface")),
      city: searchParams.get("city") || sessionStorage.getItem("city") || "",
      type,
      userId: searchParams.get("userId") || sessionStorage.getItem("userId") || "",
      status: "active"
    };

    // Ensure `rooms` is included only when `type` is "apartament"
    if (type === "apartament") {
      initialFilters.rooms = searchParams.get("rooms") || sessionStorage.getItem("rooms") || "";
    }

    setPage(Number(sessionStorage.getItem("page")) || Number(searchParams.get("page")) || 1);
    initialFilters.status = "active";
    setFilters(initialFilters);
    setIsInitialized(true);
  };

  const fetchData = async (newPage?: number) => {
    if (!isInitialized) return;

    const updatedPage = newPage || page;
    if (updatedPage !== null) {
      sessionStorage.setItem("page", updatedPage.toString());
    }

    Object.entries(filters).forEach(([key, value]) => {
      sessionStorage.setItem(key, value.toString());
    });

    await fetchPaginatedAnnouncements({
      page: updatedPage || 1,
      limit: 8,
      filter: filters, // Filters include parsed numbers for minSurface and maxSurface
    });
  };

  useEffect(() => {
    initializeFilters();
  }, []);

  useEffect(() => {
    if (isInitialized) {
      fetchData();
    }
  }, [filters, page, isInitialized]);

  const handleChangePage = async (
    event: React.ChangeEvent<unknown>,
    newPage: number
  ) => {
    setPage(newPage);
  };

  if (!isInitialized) {
    return null; // Render nothing until initialization is complete
  }

  return (
    <Box>
      <Typography
        variant="h4"
        sx={{ fontWeight: 600, marginBottom: "32px" }}
        color={COLOR_TEXT}
      >
        {filters.type || "Anunturi"}
      </Typography>
      {announcements.map((item, index) => (
        <AnnouncementListItem key={`announcement-${index}`} item={item} />
      ))}
      {paginated && (
        <Box component="span">
          <StyledPagination
            count={meta?.totalPages}
            page={page || 1}
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