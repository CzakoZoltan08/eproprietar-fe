"use client";

import { Box, CircularProgress, Typography } from "@mui/material";
import React, { useEffect, useState } from "react";
import {
  StyledPagination,
  StyledPaginationItem,
} from "@/style/styledPagination";

import AgencyAnnouncementListItem from "./AgencyAnnouncementListItem";
import { observer } from "mobx-react";
import { useSearchParams } from "next/navigation";
import { useStore } from "@/hooks/useStore";

// 🧹 Utility to sanitize filters
const sanitizeFilters = (filters: Record<string, any>) =>
  Object.fromEntries(
    Object.entries(filters).filter(
      ([_, val]) => val !== undefined && val !== null && val !== ""
    )
  );

const AnnouncementList = ({
  paginated = true,
  defaultFilters = {},
  title = "",
  source = "paginated",
}: {
  paginated: boolean;
  defaultFilters?: Record<string, string | number>;
  title?: string;
  source?: "paginated" | "saved" | "mine";
}) => {
  const {
    announcementStore: {
      fetchPaginatedAnnouncements,
      fetchSavedAnnouncements,
      announcements,
      meta,
    },
    userStore: { user },
  } = useStore();

  const searchParams = useSearchParams();
  const [page, setPage] = useState<number | null>(null);
  const [filters, setFilters] = useState<Record<string, string | number>>({});
  const [isInitialized, setIsInitialized] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // ✅ Block "saved" and "mine" if user is missing
  if ((source === "mine" || source === "saved") && !user?.id) {
    return null;
  }

  const initializeFilters = () => {
    const type = searchParams.get("type") || sessionStorage.getItem("type") || "";
    const providerType = searchParams.get("providerType");

    const initialFilters: Record<string, string | number> = {
      status: "active",
      ...defaultFilters,
    };

    if (searchParams.get("transactionType")) {
      initialFilters.transactionType = searchParams.get("transactionType")!;
    }

    if (searchParams.get("price")) {
      initialFilters.price = `$lte:${searchParams.get("price")}`;
    }

    const minSurface = searchParams.get("minSurface");
    const maxSurface = searchParams.get("maxSurface");

    if (minSurface) {
      initialFilters.minSurface = parseInt(minSurface, 10);
    }
    
    if (maxSurface) {
      initialFilters.maxSurface = parseInt(maxSurface, 10);
    }

    if (searchParams.get("city")) {
      initialFilters.city = `$in:${searchParams.get("city")}`;
    }

    if (searchParams.get("county")) {
      initialFilters.county = `$in:${searchParams.get("county")}`;
    }

    if (searchParams.get("rooms")) {
      initialFilters.rooms = `$eq:${searchParams.get("rooms")}`;
    }

    if (searchParams.get("announcementType")) {
      initialFilters.announcementType = `$in:${searchParams.get("announcementType")}`;
    }

    if (providerType) {
      initialFilters.providerType = providerType;
    }

    if (type) {
      initialFilters.type = type;
    }

    // ✅ Only use userId for saved/mine, not paginated search
    const userIdParam = searchParams.get("userId");
    if (userIdParam && (source === "saved" || source === "mine")) {
      initialFilters.userId = userIdParam;
    }

    console.log("🔎 All query params:", searchParams.toString());

    setPage(1);
    Object.keys(defaultFilters).forEach((key) => sessionStorage.removeItem(key));
    setFilters({ ...initialFilters, ...defaultFilters });
    setIsInitialized(true);
  };

  useEffect(() => {
    initializeFilters();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams.toString()]);

  useEffect(() => {
    if (!isInitialized || (source === "saved" && !user?.id)) return;

    const fetch = async () => {
      setIsLoading(true);
      announcements.splice(0, announcements.length);

      const sanitizedFilters = sanitizeFilters(filters);
      console.log("🔍 Fetching announcements with filters:", sanitizedFilters);

      if (source === "saved") {
        if (user && user.id) {
          await fetchSavedAnnouncements(user.id);
        }
      } else {
        await fetchPaginatedAnnouncements({
          page: page || 1,
          limit: 12,
          filter: sanitizedFilters,
        });
      }

      setIsLoading(false);
    };

    fetch();
  }, [filters, page, isInitialized, source, user?.id]);

  useEffect(() => {
    setPage(1);
  }, [filters, source, user?.id]);

  if (!isInitialized || isLoading) {
    return <CircularProgress sx={{ margin: "0 auto", display: "block" }} size={42} />;
  }

  return (
    <Box>
      <>
        {announcements.map((item, index) => (
          <AgencyAnnouncementListItem key={`agency-${index}`} item={item} />
        ))}
      </>

      {paginated && source === "paginated" && announcements.length > 0 && meta?.totalPages > 1 && (
        <Box component="span" sx={{ mt: 4 }}>
          <StyledPagination
            count={meta.totalPages}
            page={page || 1}
            onChange={(event, newPage) => setPage(newPage)}
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