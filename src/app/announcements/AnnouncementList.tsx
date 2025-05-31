"use client";

import { Box, CircularProgress, Divider, Paper, Typography } from "@mui/material";
import React, { useEffect, useState } from "react";
import {
  StyledPagination,
  StyledPaginationItem,
} from "@/style/styledPagination";

import AnnouncementListItem from "@/app/announcements/AnnouncementListItem";
import { COLOR_TEXT } from "@/constants/colors";
import EnsembleAnnouncementTileItem from "./ensemble/EnsembleAnnouncementTileItem";
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

  // Track which announcement is selected (for "agency" layout)
  const [selectedAnnouncement, setSelectedAnnouncement] =
    useState<typeof announcements[0] | null>(null);

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

  // If the providerType is "ensemble", keep the tile layout unchanged
  if (filters.providerType === "ensemble") {
    return (
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
          gap: "12px",
          marginBottom: "64px",
        }}
      >
        {announcements.map((item, index) => (
          <EnsembleAnnouncementTileItem key={`ensemble-${index}`} item={item} />
        ))}
      </Box>
    );
  }

  // If the providerType is "agency", render a two-column (list + detail) layout
  if (filters.providerType === "agency") {
    return (
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: "3fr 1fr", // left column wider, right narrower
          gap: "24px",
          alignItems: "start",
          marginBottom: "24px",
        }}
      >
        {/* Left Column: render AnnouncementListItem directly (no Paper) */}
        <Box
          sx={{
            maxHeight: "calc(100vh - 150px)",
            overflowY: "auto",
          }}
        >
          {announcements.map((item, index) => (
            <Box
              key={`agency-item-${index}`}
              sx={{ mb: 2, cursor: "pointer" }}
              onClick={() => setSelectedAnnouncement(item)}
            >
              <AnnouncementListItem item={item} />
            </Box>
          ))}

          {paginated && source === "paginated" && announcements.length > 0 && meta?.totalPages > 1 && (
            <Box component="span" sx={{ mt: 4, display: "flex", justifyContent: "center" }}>
              <StyledPagination
                count={meta.totalPages}
                page={page || 1}
                onChange={(event, newPage) => {
                  setPage(newPage);
                  setSelectedAnnouncement(null); // reset detail when page changes
                }}
                defaultPage={1}
                color="primary"
                size="large"
                renderItem={(item) => <StyledPaginationItem {...item} />}
              />
            </Box>
          )}
        </Box>

        {/* Right Column: use Paper for textual details */}
        <Paper
          elevation={2}
          sx={{
            p: 2,
            maxHeight: "calc(100vh - 150px)",
            overflowY: "auto",
          }}
        >
          {selectedAnnouncement ? (
            <>
              <Typography
                variant="h5"
                sx={{ mb: 1, fontWeight: 600, color: COLOR_TEXT }}
              >
                {selectedAnnouncement.title}
              </Typography>
              <Typography variant="subtitle1" sx={{ mb: 1 }}>
                {selectedAnnouncement.price} EUR — {selectedAnnouncement.surface} mp
              </Typography>
              <Divider sx={{ mb: 2 }} />
              <Typography variant="body2" sx={{ whiteSpace: "pre-line", color: COLOR_TEXT }}>
                {selectedAnnouncement.description}
              </Typography>

              {/* Adaugă aici câmpurile suplimentare (de ex. adresă, camere etc.) */}
            </>
          ) : (
            <Typography variant="body2" color={COLOR_TEXT}>
              Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.
              Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.
            </Typography>
          )}
        </Paper>
      </Box>
    );
  }

  // Default case (any other providerType): exact same list-of-cards as before
  return (
    <Box>
      {announcements.map((item, index) => (
        <AnnouncementListItem key={`announcement-${index}`} item={item} />
      ))}

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