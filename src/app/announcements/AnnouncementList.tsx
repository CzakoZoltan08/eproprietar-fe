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

    const minPrice = searchParams.get("minPrice");
    const maxPrice = searchParams.get("maxPrice");

    if (minPrice && maxPrice) {
      initialFilters.price = `$between:${minPrice},${maxPrice}`;
    } else if (minPrice) {
      initialFilters.price = `$gte:${minPrice}`;
    } else if (maxPrice) {
      initialFilters.price = `$lte:${maxPrice}`;
    }

    const minSurface = searchParams.get("minSurface");
    const maxSurface = searchParams.get("maxSurface");

    if (minSurface) {
      initialFilters.minSurface = parseInt(minSurface, 10);
    }

    if (maxSurface) {
      initialFilters.maxSurface = parseInt(maxSurface, 10);
    }

    const minLandSurface = searchParams.get("minLandSurface");
    const maxLandSurface = searchParams.get("maxLandSurface");

    if (minLandSurface) {
      initialFilters.minLandSurface = parseInt(minLandSurface, 10);
    }
    if (maxLandSurface) {
      initialFilters.maxLandSurface = parseInt(maxLandSurface, 10);
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

  // ✅ Empty state — se afișează pentru orice providerType când nu există rezultate
  if (announcements.length === 0) {
    return (
      <Paper
        elevation={1}
        sx={{
          p: 3,
          textAlign: "center",
          borderRadius: 2,
          border: "1px solid #e7e7e7",
          bgcolor: "#fff",
        }}
      >
        <Typography variant="h6" sx={{ mb: 1, color: COLOR_TEXT, fontWeight: 600 }}>
          Ups! Nu am găsit nimic acum…
        </Typography>
        <Typography variant="body1" sx={{ whiteSpace: "pre-line", color: COLOR_TEXT }}>
          {`…dar nu-i nimic, poate chiar mâine apare exact oferta care ți se potrivește! 🍀\nÎncearcă să ajustezi filtrele și hai să vedem din nou.`}
        </Typography>
      </Paper>
    );
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

  // If the providerType is "agency", render a two-column (list + detail) layout (NO SCROLL, USE PAGING)
  if (filters.providerType === "agency") {
    return (
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: {
            xs: "1fr",     // single column on mobile
            md: "3fr 1fr", // list left, details right on desktop
          },
          gap: "24px",
          alignItems: "start",
          marginBottom: "24px",
        }}
      >
        {/* Right Column: Paper with either details or explanation (shown first on mobile) */}
        <Paper
          elevation={2}
          sx={{
            p: 2,
            order: { xs: 1, md: 2 }, // show first on mobile, second on desktop
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
            </>
          ) : (
            <>
              <Typography variant="h6" sx={{ mb: 2, color: COLOR_TEXT }}>
                Ce înseamnă Reprezentarea Exclusivă?
              </Typography>
              <Typography
                variant="body2"
                sx={{ whiteSpace: "pre-line", wordBreak: "break-word", color: COLOR_TEXT }}
              >{`Am creat această secțiune special pentru tine, o secțiune care conține anunțuri imobiliare publicate exclusiv de agenți care au un contract oficial de reprezentare directă cu proprietarul imobilului, pentru a avea acces la toate imobilele de pe piața imobiliara si a le putea accesa fără a plăti comision!
🟢 Ce înseamnă asta pentru tine, ca potențial cumpărător?
✅ Informații corecte și verificate – Agentul are acces direct la toate detaliile importante despre imobil și este obligat să ofere transparență totală.
✅ Fără anunțuri dublate sau false – Fiecare proprietate este unică în platformă, fără suprapuneri sau confuzii.
✅ Un singur punct de contact – Comunici cu un agent autorizat, profesionist, care reprezintă interesele vânzătorului în mod exclusiv.
✅ Timp câștigat – Nu mai pierzi vremea cu vizionări inutile sau oferte neclare.
✅ Proces de achiziție clar și controlat – Ai parte de un flux bine organizat, cu pași clari de la vizionare până la semnarea contractului.
✅ Documentație completă și sprijin juridic – Poți primi sprijin în obținerea actelor, evaluări sau consultanță juridică prin agentul responsabil.
✅ Acces la proprietăți înaintea pieței largi – Unele imobile în regim exclusiv nu sunt listate în altă parte.
________________________________________
🎯 Reprezentarea Exclusivă este o garanție a profesionalismului în tranzacțiile imobiliare.
Explorează această secțiune cu încredere – ai acces la cele mai serioase și sigure oferte din piață!`}</Typography>
            </>
          )}
        </Paper>

        {/* Left Column: Announcement list with paging (no scroll) */}
        <Box sx={{ order: { xs: 2, md: 1 } }}>
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
