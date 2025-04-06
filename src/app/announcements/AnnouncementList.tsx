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

const AnnouncementList = ({
  paginated = true,
  defaultFilters = {},
  title = "",
}: {
  paginated: boolean;
  defaultFilters?: Record<string, string | number>;
  title?: string;
}) => {
  const {
    announcementStore: { fetchPaginatedAnnouncements, announcements, meta },
  } = useStore();
  const searchParams = useSearchParams();

  const [page, setPage] = useState<number | null>(null); // Initialize as null
  const [filters, setFilters] = useState<Record<string, string | number>>({});
  const [isInitialized, setIsInitialized] = useState(false);

  console.log("Received defaultFilters:", defaultFilters);

  const initializeFilters = () => {
    const type = searchParams.get("type") || sessionStorage.getItem("type") || "";
    const providerType = searchParams.get("providerType") || ""; // Ensure providerType is captured from URL
    const parseNumber = (value: string | null) => (value ? parseInt(value, 10) : 0);
  
    // Initialize filters conditionally based on query parameters
    const initialFilters: Record<string, string | number> = {
      status: "active", // Default status is active
      providerType, // Always include providerType from the URL
      ...defaultFilters, // Ensure any passed defaultFilters are applied
    };
  
    // Add query parameters only if they exist in the URL
    if (searchParams.get("transactionType")) {
      initialFilters.transactionType = searchParams.get("transactionType") || "";
    }
  
    if (searchParams.get("price")) {
      initialFilters.price = `$lte:${searchParams.get("price")}`; // Apply price filter if present
    }
  
    if (searchParams.get("minSurface") || searchParams.get("maxSurface")) {
      initialFilters.surface = `$btw:${searchParams.get("minSurface")},${searchParams.get("maxSurface")}`;
    }
  
    if (searchParams.get("city")) {
      initialFilters.city = `$in:${searchParams.get("city")}`;
    }
  
    if (searchParams.get("rooms")) {
      initialFilters.rooms = `$eq:${searchParams.get("rooms")}`;
    }
  
    if (searchParams.get("announcementType")) {
      initialFilters.announcementType = `$in:${searchParams.get("announcementType")}`;
    }

    if (type) {
      initialFilters.type = type;
    }
  
    if (providerType) {
      initialFilters.providerType = providerType;
    }
  
    setPage(Number(sessionStorage.getItem("page")) || Number(searchParams.get("page")) || 1);
  
    // Remove sessionStorage values to avoid using old filters
    Object.keys(defaultFilters).forEach((key) => {
      sessionStorage.removeItem(key);
    });
  
    // Set the filters with the correct merged state
    setFilters({
      ...initialFilters, // Only include filters set above
      ...defaultFilters, // Ensure default filters are still applied
    });
  
    console.log("Filters after merging:", { ...initialFilters, ...defaultFilters });
    setIsInitialized(true);
  };
  
  // Run `initializeFilters` when URL search parameters change
  useEffect(() => {
    initializeFilters();
  }, [searchParams.toString()]); // Depend on searchParams to detect changes

  // Fetch announcements when filters or page changes
  useEffect(() => {
    if (isInitialized) {
      fetchPaginatedAnnouncements({
        page: page || 1,
        limit: 8,
        filter: filters,
      });
    }
  }, [filters, page, isInitialized]);

  const fetchData = async (newPage?: number) => {
    if (!isInitialized) return;

    const updatedPage = newPage || page;
    if (updatedPage !== null) {
      sessionStorage.setItem("page", updatedPage.toString());
    }

    Object.entries(filters).forEach(([key, value]) => {
      sessionStorage.setItem(key, value.toString());
    });

    console.log("FETCHING WITH FILTERS:", filters);

    await fetchPaginatedAnnouncements({
      page: updatedPage || 1,
      limit: 8,
      filter: filters, // Filters include parsed numbers for minSurface and maxSurface
    });
  };

  useEffect(() => {
    initializeFilters();
  }, []); // Initialize filters once

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
        {title || filters.type || "Anunțuri"}
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