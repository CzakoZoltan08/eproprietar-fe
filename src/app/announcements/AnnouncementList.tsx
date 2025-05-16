import { Box, Typography } from "@mui/material";
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

const AnnouncementList = ({
  paginated = true,
  defaultFilters = {},
  title = "",
  source = "paginated", // NEW
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

  const initializeFilters = () => {
    const type = searchParams.get("type") || sessionStorage.getItem("type") || "";
    const providerType = searchParams.get("providerType") || "";

    const initialFilters: Record<string, string | number> = {
      status: "active",
      providerType,
      ...defaultFilters,
    };

    if (searchParams.get("transactionType")) {
      initialFilters.transactionType = searchParams.get("transactionType") || "";
    }

    if (searchParams.get("price")) {
      initialFilters.price = `$lte:${searchParams.get("price")}`;
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

    if (type) initialFilters.type = type;
    if (providerType) initialFilters.providerType = providerType;

    setPage(Number(sessionStorage.getItem("page")) || Number(searchParams.get("page")) || 1);

    Object.keys(defaultFilters).forEach((key) => {
      sessionStorage.removeItem(key);
    });

    setFilters({
      ...initialFilters,
      ...defaultFilters,
    });

    setIsInitialized(true);
  };

  useEffect(() => {
    initializeFilters();
  }, [searchParams.toString()]);

  useEffect(() => {
    if (!isInitialized || (source === "saved" && !user?.id)) return;

    const fetch = async () => {
      if (source === "saved") {
        if (user?.id) {
          await fetchSavedAnnouncements(user.id);
        }
      } else {
        await fetchPaginatedAnnouncements({
          page: page || 1,
          limit: 8,
          filter: filters,
        });
      }
    };

    fetch();
  }, [filters, page, isInitialized, source, user?.id]);

  const handleChangePage = async (
    event: React.ChangeEvent<unknown>,
    newPage: number
  ) => {
    setPage(newPage);
  };

  useEffect(() => {
    if (filters) {
      setPage(1);
    }
  }, [filters]);

  if (!isInitialized) {
    return null;
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
      {filters.providerType === "ensemble" ? (
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
            gap: "24px",
            marginBottom: "64px",
          }}
        >
          {announcements.map((item, index) => (
            <EnsembleAnnouncementTileItem key={`ensemble-${index}`} item={item} />
          ))}
        </Box>
      ) : (
        <>
          {announcements.map((item, index) => (
            <AnnouncementListItem key={`announcement-${index}`} item={item} />
          ))}
        </>
      )}
      {paginated && announcements.length > 0 && meta?.totalPages > 1 && (
        <Box component="span" sx={{ mt: 4 }}>
          <StyledPagination
            count={meta.totalPages}
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