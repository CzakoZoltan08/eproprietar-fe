"use client";

import {
  Box,
  Chip,
  CircularProgress,
  Divider,
  Grid,
  Link,
  Paper,
  Typography,
} from "@mui/material";

import { AutoImageCarousel } from "@/common/autoImageCarousel/AutoImageCarousel";
import { COLOR_TEXT } from "@/constants/colors";
import { DeveloperContactCard } from "@/common/developerContactCard/DeveloperContactCard";
import { observer } from "mobx-react";
import { useEffect } from "react";
import { useParams } from "next/navigation";
import { useStore } from "@/hooks/useStore";

const formatMonthYear = (iso?: string) => {
  if (!iso) return "";
  const d = new Date(iso);
  if (isNaN(d.getTime())) return "";
  // ex: "august 2026" -> "August 2026"
  const s = new Intl.DateTimeFormat("ro-RO", {
    month: "long",
    year: "numeric",
  }).format(d);
  return s.charAt(0).toUpperCase() + s.slice(1);
};

const hasNumber = (v: any) =>
  v !== null && v !== undefined && v !== 0;

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

  const a = currentAnnouncement;

  const amenities: string[] = Array.isArray(a.amenities)
    ? a.amenities.filter(Boolean)
    : [];

  return (
    <Box sx={{ px: 1.5, py: 2, maxWidth: "1300px", mx: "auto" }}>
      <Box sx={{ mb: 1 }}>
        <AutoImageCarousel
          images={
            a.images?.length
              ? a.images.map((img) => ({ url: img.original }))
              : [{ url: a.imageUrl || "/default.jpg" }]
          }
        />
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
          {a.title}
        </Typography>
        <Typography variant="subtitle2" sx={{ mt: 0.5, color: "#555" }}>
          {[a.city, a.county].filter(Boolean).join(", ")}
        </Typography>
      </Box>

      <Grid container spacing={1}>
        <Grid item xs={12} md={9}>
          <Paper elevation={1} sx={{ p: 1.5, borderRadius: 1, mb: 1 }}>
            <Typography variant="subtitle1" fontWeight={600} mb={0.5}>
              Detalii proiect
            </Typography>
            <Divider sx={{ mb: 1 }} />

            {a.city && (
              <Typography variant="body2">
                <strong>Oraș:</strong> {a.city}
              </Typography>
            )}
            {a.county && (
              <Typography variant="body2">
                <strong>Județ:</strong> {a.county}
              </Typography>
            )}
            {a.street && (
              <Typography variant="body2">
                <strong>Stradă:</strong> {a.street}
              </Typography>
            )}
            {a.neighborhood && (
              <Typography variant="body2">
                <strong>Cartier/Zonă:</strong> {a.neighborhood}
              </Typography>
            )}
            {a.announcementType && (
              <Typography variant="body2">
                <strong>Tip:</strong> {a.announcementType}
              </Typography>
            )}
            {hasNumber(a.rooms) && (
              <Typography variant="body2">
                <strong>Camere:</strong> {a.rooms}
              </Typography>
            )}
            {hasNumber(a.surface) && (
              <Typography variant="body2">
                <strong>Suprafață utilă:</strong> {a.surface} mp
              </Typography>
            )}
            {hasNumber(a.builtSurface) && (
              <Typography variant="body2">
                <strong>Suprafață construită:</strong> {a.builtSurface} mp
              </Typography>
            )}
            {hasNumber(a.landSurface) && (
              <Typography variant="body2">
                <strong>Suprafață teren:</strong> {a.landSurface} mp
              </Typography>
            )}
            {hasNumber(a.floorsCount) && (
              <Typography variant="body2">
                <strong>Nr. de etaje:</strong> {a.floorsCount}
              </Typography>
            )}
            {hasNumber(a.price) && (
              <Typography variant="body2">
                <strong>Preț:</strong> {a.price} {a.currency || "EUR"}
              </Typography>
            )}
            {a.stage && (
              <Typography variant="body2">
                <strong>Stadiu:</strong> {a.stage}
              </Typography>
            )}
            {a.constructionStart && (
              <Typography variant="body2">
                <strong>Începerea construcției:</strong>{" "}
                {formatMonthYear(a.constructionStart)}
              </Typography>
            )}
            {a.endDate && (
              <Typography variant="body2">
                <strong>Finalizare:</strong> {formatMonthYear(a.endDate)}
              </Typography>
            )}
            {a.developerSite && (
              <Typography variant="body2">
                <strong>Site dezvoltator:</strong>{" "}
                <Link
                  href={a.developerSite}
                  target="_blank"
                  rel="noopener noreferrer"
                  underline="hover"
                >
                  {a.developerSite}
                </Link>
              </Typography>
            )}
            {a.frameType && (
              <Typography variant="body2">
                <strong>Tip chenar (prezentare):</strong> {a.frameType}
              </Typography>
            )}
          </Paper>

          {amenities.length > 0 && (
            <Paper elevation={1} sx={{ p: 1.5, borderRadius: 1, mb: 1 }}>
              <Typography variant="subtitle1" fontWeight={600} mb={0.5}>
                Facilități
              </Typography>
              <Divider sx={{ mb: 1 }} />
              <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
                {amenities.map((f, idx) => (
                  <Chip key={`${f}-${idx}`} label={f} size="small" />
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
              {a.description || "Fără descriere disponibilă."}
            </Typography>
          </Paper>

          {a.apartmentTypeOther && (
            <Paper elevation={1} sx={{ p: 1.5, borderRadius: 1 }}>
              <Typography variant="subtitle1" fontWeight={600} mb={0.5}>
                Tipuri de apartamente
              </Typography>
              <Divider sx={{ mb: 1 }} />
              <Typography variant="body2" sx={{ whiteSpace: "pre-line" }}>
                {a.apartmentTypeOther}
              </Typography>
            </Paper>
          )}
        </Grid>

        <Grid item xs={12} md={3}>
          {(a.logoUrl || a.phoneContact) && (
            <Box sx={{ position: { md: "sticky" }, top: 20 }}>
              <DeveloperContactCard
                name={a.developerName || "Dezvoltator"}
                phone={a.phoneContact || "N/A"}
                logoUrl={a.logoUrl || "/default-logo.png"}
              />
            </Box>
          )}
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
        {a.city && <Chip label={a.city} size="small" />}
        {a.announcementType && <Chip label={a.announcementType} size="small" />}
        {a.neighborhood && <Chip label={a.neighborhood} size="small" />}
        {a.stage && <Chip label={`Stadiu: ${a.stage}`} size="small" />}
        {a.endDate && <Chip label={`Finalizare: ${formatMonthYear(a.endDate)}`} size="small" />}
      </Box>
    </Box>
  );
};

export default observer(EnsembleAnnouncementDetailsPage);