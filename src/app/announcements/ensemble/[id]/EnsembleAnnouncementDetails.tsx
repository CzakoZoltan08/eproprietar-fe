"use client";

import {
  Box,
  Chip,
  CircularProgress,
  Divider,
  Grid,
  Paper,
  Typography,
} from "@mui/material";
import UnifiedMediaGallery, { MediaItem } from "../../[id]/UnifiedMediaGallery";
import { useEffect, useMemo, useRef } from "react";

import { COLOR_TEXT } from "@/constants/colors";
import { DeveloperContactCard } from "@/common/developerContactCard/DeveloperContactCard";
import FlyerViewer from "@/common/flyerViewer/FlyerViewer";
import { observer } from "mobx-react";
import styled from "styled-components";
import { useParams } from "next/navigation";
import { useStore } from "@/hooks/useStore";

// --- page-only wrapper to expand gallery full width ---
const WideGalleryWrapper = styled.div`
  width: 100%;
  max-width: 1300px;
  margin: 0 auto;

  /* Override the internal width cap ONLY on this page */
  .gallery-container {
    max-width: 100% !important;
    width: 100% !important;
  }
`;

const formatMonthYear = (iso?: string) => {
  if (!iso) return "";
  const d = new Date(iso);
  if (isNaN(d.getTime())) return "";
  const s = new Intl.DateTimeFormat("ro-RO", {
    month: "long",
    year: "numeric",
  }).format(d);
  return s.charAt(0).toUpperCase() + s.slice(1);
};

const hasNumber = (v: any) => v !== null && v !== undefined && v !== 0;

const EnsembleAnnouncementDetailsPage = () => {
  const {
    announcementStore: { getAnnouncementById, currentAnnouncement },
  } = useStore();

  const params = useParams();
  const id = Array.isArray(params?.id) ? params.id[0] : params?.id;

  useEffect(() => {
    if (id) {
      getAnnouncementById(id);
    }
  }, [id, getAnnouncementById]);

  if (!currentAnnouncement?.id) {
    return (
      <Box sx={{ p: 1.5, display: "flex", justifyContent: "center" }}>
        <CircularProgress size={24} />
      </Box>
    );
  }

  const announcement = currentAnnouncement;

  // Build media: VIDEOS first, then IMAGES, then FLOORPLAN
  const media: MediaItem[] = useMemo(() => {
    const images = Array.isArray(announcement.images) ? announcement.images : [];
    const videos = Array.isArray(announcement.videos) ? announcement.videos : [];
    const fallback = announcement.imageUrl ? [{ original: announcement.imageUrl }] : [];

    return [
      ...videos.map((v) => ({
        type: "video" as const,
        src: v.original,
        format: v.format,
      })),
      ...(images.length
        ? images.map((img) => ({ type: "image" as const, src: img.original }))
        : fallback.map((img) => ({ type: "image" as const, src: img.original }))),
      ...(announcement.sketchUrl ? [{ type: "floorplan" as const, src: announcement.sketchUrl }] : []),
    ];
  }, [announcement]);

  const amenities: string[] = Array.isArray(announcement.amenities)
    ? announcement.amenities.filter(Boolean)
    : [];

  // --- Autoplay first video on this page only ---
  const galleryScopeRef = useRef<HTMLDivElement | null>(null);
  useEffect(() => {
    const scope = galleryScopeRef.current;
    if (!scope) return;

    // small delay to ensure children are mounted
    const t = setTimeout(() => {
      const firstVideo = scope.querySelector("video") as HTMLVideoElement | null;
      if (!firstVideo) return;
      try {
        firstVideo.muted = true;
        // @ts-ignore
        firstVideo.playsInline = true;
        firstVideo.setAttribute("playsinline", "true");
        firstVideo.autoplay = true;
        firstVideo.play().catch(() => {
          /* autoplay might be blocked; fail silently */
        });
      } catch {
        /* ignore */
      }
    }, 60);

    return () => clearTimeout(t);
  }, [media]);

  return (
    <Box sx={{ px: 1.5, py: 2, maxWidth: "1300px", mx: "auto" }}>
      {/* Full-width media only on this page */}
      <Box sx={{ mb: 1 }} ref={galleryScopeRef}>
        {media.length > 0 ? (
          <WideGalleryWrapper>
            <UnifiedMediaGallery media={media} />
          </WideGalleryWrapper>
        ) : (
          <Paper elevation={0} sx={{ p: 2, textAlign: "center" }}>
            <Typography variant="body2">Nu există media disponibilă.</Typography>
          </Paper>
        )}
      </Box>

      <Box
        sx={{
          textAlign: "center",
          py: 1.5,
          mb: 2,
          background: "linear-gradient(to right, #f0f4ff, #ffffff)",
          borderBottom: "1px solid #ddd",
        }}
      >
        <Typography
          variant="h6"
          fontWeight={600}
          sx={{
            color: COLOR_TEXT,
            borderBottom: "2px solid #448aff",
            display: "inline-block",
            pb: 0.5,
            px: 1,
            fontSize: "1.2rem",
          }}
        >
          {announcement.title}
        </Typography>
        <Typography variant="subtitle2" sx={{ mt: 0.5, color: "#555" }}>
          {[announcement.city, announcement.county].filter(Boolean).join(", ")}
        </Typography>
      </Box>

      <Grid container spacing={1}>
        <Grid item xs={12} md={8}>
          <Paper elevation={1} sx={{ p: 1.5, borderRadius: 1, mb: 1 }}>
            <Typography variant="subtitle1" fontWeight={600} mb={0.5}>
              Detalii proiect
            </Typography>
            <Divider sx={{ mb: 1 }} />

            {(() => {
              const details: { label: string; value?: React.ReactNode }[] = [
                announcement.city && { label: "Oraș", value: announcement.city },
                announcement.county && { label: "Județ", value: announcement.county },
                announcement.street && { label: "Stradă", value: announcement.street },
                announcement.neighborhood && { label: "Cartier/Zonă", value: announcement.neighborhood },
                announcement.announcementType && { label: "Tip", value: announcement.announcementType },
                hasNumber(announcement.rooms) && { label: "Camere", value: announcement.rooms },
                hasNumber(announcement.surface) && { label: "Suprafață utilă", value: `${announcement.surface} mp` },
                hasNumber(announcement.builtSurface) && { label: "Suprafață construită", value: `${announcement.builtSurface} mp` },
                hasNumber(announcement.landSurface) && { label: "Suprafață teren", value: `${announcement.landSurface} mp` },
                hasNumber(announcement.floorsCount) && { label: "Nr. de etaje", value: announcement.floorsCount },
                hasNumber(announcement.price) && {
                  label: "Preț",
                  value: `${announcement.price} ${announcement.currency || "EUR"}`,
                },
                announcement.stage && { label: "Stadiu", value: announcement.stage },
                announcement.constructionStart && {
                  label: "Începerea construcției",
                  value: formatMonthYear(announcement.constructionStart),
                },
                announcement.endDate && { label: "Finalizare", value: formatMonthYear(announcement.endDate) },
                announcement.frameType && { label: "Tip chenar (prezentare)", value: announcement.frameType },
              ].filter(Boolean) as { label: string; value: React.ReactNode }[];

              return (
                <Grid container spacing={1}>
                  {details.map((d, idx) => (
                    <Grid key={`${d.label}-${idx}`} item xs={12} md={6}>
                      <Typography variant="body2">
                        <strong>{d.label}:</strong> {d.value}
                      </Typography>
                    </Grid>
                  ))}
                </Grid>
              );
            })()}
          </Paper>

          {amenities.length > 0 && (
            <Paper elevation={1} sx={{ p: 1.5, borderRadius: 1, mb: 1 }}>
              <Typography variant="subtitle1" fontWeight={600} mb={0.5}>
                Facilități
              </Typography>
              <Divider sx={{ mb: 1 }} />
              <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
                {amenities.map((facility, idx) => (
                  <Chip key={`${facility}-${idx}`} label={facility} size="small" />
                ))}
              </Box>
            </Paper>
          )}

          <Paper elevation={1} sx={{ p: 1.5, borderRadius: 1, mb: 1 }}>
            <Typography variant="subtitle1" fontWeight={600} mb={0.5}>
              Descriere
            </Typography>
            <Divider sx={{ mb: 1 }} />
            <Typography variant="body2" sx={{ whiteSpace: "pre-line" }}>
              {announcement.description || "Fără descriere disponibilă."}
            </Typography>
          </Paper>

          {announcement.apartmentTypeOther && (
            <Paper elevation={1} sx={{ p: 1.5, borderRadius: 1 }}>
              <Typography variant="subtitle1" fontWeight={600} mb={0.5}>
                Tipuri de apartamente
              </Typography>
              <Divider sx={{ mb: 1 }} />
              <Typography variant="body2" sx={{ whiteSpace: "pre-line" }}>
                {announcement.apartmentTypeOther}
              </Typography>
            </Paper>
          )}
        </Grid>

        <Grid item xs={12} md={4}>
          <Box
            sx={{
              position: { md: "sticky" },
              top: 20,
              display: "flex",
              flexDirection: "column",
              gap: 1,
            }}
          >
            {announcement.flyerUrl && (
              <Paper elevation={1} sx={{ p: 1.5, borderRadius: 1, width: "100%" }}>
                <Divider sx={{ mb: 1 }} />
                <FlyerViewer url={announcement.flyerUrl} mimeType={announcement.flyerMimeType} />
              </Paper>
            )}

            {(announcement.logoUrl || announcement.phoneContact) && (
              <Paper elevation={1} sx={{ p: 1.5, borderRadius: 1, width: "100%", justifyContent: "center" }}>
                <DeveloperContactCard
                  name={announcement.developerName || "Dezvoltator"}
                  phone={announcement.phoneContact || "N/A"}
                  logoUrl={announcement.logoUrl || "/default-logo.png"}
                />
              </Paper>
            )}
          </Box>
        </Grid>
      </Grid>

      <Box
        sx={{
          mt: 2,
          display: "flex",
          flexWrap: "wrap",
          gap: 0.5,
          justifyContent: { xs: "center", md: "flex-start" },
        }}
      >
        {announcement.city && <Chip label={announcement.city} size="small" />}
        {announcement.announcementType && <Chip label={announcement.announcementType} size="small" />}
        {announcement.neighborhood && <Chip label={announcement.neighborhood} size="small" />}
        {announcement.stage && <Chip label={`Stadiu: ${announcement.stage}`} size="small" />}
        {announcement.endDate && <Chip label={`Finalizare: ${formatMonthYear(announcement.endDate)}`} size="small" />}
      </Box>
    </Box>
  );
};

export default observer(EnsembleAnnouncementDetailsPage);
