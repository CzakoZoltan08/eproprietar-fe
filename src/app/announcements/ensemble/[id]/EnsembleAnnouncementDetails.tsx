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

const WideGalleryWrapper = styled.div`
  width: 100%;
  max-width: 1300px;
  margin: 0 auto;

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
    if (id) getAnnouncementById(id);
  }, [id, getAnnouncementById]);

  const announcement = currentAnnouncement;
  const galleryScopeRef = useRef<HTMLDivElement | null>(null);

  const media: MediaItem[] = useMemo(() => {
    if (!announcement) return [];
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

  const hasVideos = useMemo(() => {
    if (!announcement) return false;
    return Array.isArray(announcement.videos) && announcement.videos.length > 0;
  }, [announcement]);

  const amenities: string[] = useMemo(() => {
    if (!announcement) return [];
    return Array.isArray(announcement.amenities) ? announcement.amenities.filter(Boolean) : [];
  }, [announcement]);

  // ✅ Autoplay with sound if there are videos
  useEffect(() => {
    if (!hasVideos) return;

    const scope = galleryScopeRef.current;
    if (!scope) return;

    const t = setTimeout(() => {
      const firstVideo = scope.querySelector("video") as HTMLVideoElement | null;
      if (!firstVideo) return;

      try {
        // Try to autoplay with sound
        firstVideo.muted = false;
        firstVideo.volume = 1.0;
        firstVideo.autoplay = true;
        // @ts-ignore
        firstVideo.playsInline = true;
        firstVideo.setAttribute("playsinline", "true");
        firstVideo.play().catch((err) => {
          console.warn("Autoplay with sound blocked:", err);
        });
      } catch (err) {
        console.warn("Video autoplay failed:", err);
      }
    }, 60);

    return () => clearTimeout(t);
  }, [hasVideos, media]);

  const isLoading = !currentAnnouncement?.id;
  if (isLoading) {
    return (
      <Box sx={{ p: 1.5, display: "flex", justifyContent: "center" }}>
        <CircularProgress size={24} />
      </Box>
    );
  }

  const ann = announcement!;

  return (
    <Box sx={{ px: 1.5, py: 2, maxWidth: "1300px", mx: "auto" }}>
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
          {ann.title}
        </Typography>
        <Typography variant="subtitle2" sx={{ mt: 0.5, color: "#555" }}>
          {[ann.city, ann.county].filter(Boolean).join(", ")}
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
                ann.city && { label: "Oraș", value: ann.city },
                ann.county && { label: "Județ", value: ann.county },
                ann.street && { label: "Stradă", value: ann.street },
                ann.neighborhood && { label: "Cartier/Zonă", value: ann.neighborhood },
                ann.announcementType && { label: "Tip", value: ann.announcementType },
                hasNumber(ann.rooms) && { label: "Camere", value: ann.rooms },
                hasNumber(ann.surface) && { label: "Suprafață utilă", value: `${ann.surface} mp` },
                hasNumber(ann.builtSurface) && { label: "Suprafață construită", value: `${ann.builtSurface} mp` },
                hasNumber(ann.landSurface) && { label: "Suprafață teren", value: `${ann.landSurface} mp` },
                hasNumber(ann.floorsCount) && { label: "Nr. de etaje", value: ann.floorsCount },
                hasNumber(ann.price) && {
                  label: "Preț",
                  value: `${ann.price} ${ann.currency || "EUR"}`,
                },
                ann.stage && { label: "Stadiu", value: ann.stage },
                ann.constructionStart && {
                  label: "Începerea construcției",
                  value: formatMonthYear(ann.constructionStart),
                },
                ann.endDate && { label: "Finalizare", value: formatMonthYear(ann.endDate) },
                ann.frameType && { label: "Tip chenar (prezentare)", value: ann.frameType },
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
              {ann.description || "Fără descriere disponibilă."}
            </Typography>
          </Paper>

          {ann.apartmentTypeOther && (
            <Paper elevation={1} sx={{ p: 1.5, borderRadius: 1 }}>
              <Typography variant="subtitle1" fontWeight={600} mb={0.5}>
                Tipuri de apartamente
              </Typography>
              <Divider sx={{ mb: 1 }} />
              <Typography variant="body2" sx={{ whiteSpace: "pre-line" }}>
                {ann.apartmentTypeOther}
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
            {ann.flyerUrl && (
              <Paper elevation={1} sx={{ p: 1.5, borderRadius: 1, width: "100%" }}>
                <Divider sx={{ mb: 1 }} />
                <FlyerViewer url={ann.flyerUrl} mimeType={ann.flyerMimeType} />
              </Paper>
            )}

            {(ann.logoUrl || ann.phoneContact) && (
              <Paper elevation={1} sx={{ p: 1.5, borderRadius: 1, width: "100%", justifyContent: "center" }}>
                <DeveloperContactCard
                  name={ann.phoneContactName || "Contact"}
                  phone={ann.phoneContact || "N/A"}
                  logoUrl={ann.logoUrl || "/default-logo.png"}
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
        {ann.city && <Chip label={ann.city} size="small" />}
        {ann.announcementType && <Chip label={ann.announcementType} size="small" />}
        {ann.neighborhood && <Chip label={ann.neighborhood} size="small" />}
        {ann.stage && <Chip label={`Stadiu: ${ann.stage}`} size="small" />}
        {ann.endDate && <Chip label={`Finalizare: ${formatMonthYear(ann.endDate)}`} size="small" />}
      </Box>
    </Box>
  );
};

export default observer(EnsembleAnnouncementDetailsPage);