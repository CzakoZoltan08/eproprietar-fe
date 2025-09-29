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
import FlyerViewer from "@/common/flyerViewer/FlyerViewer";
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
        <Grid item xs={12} md={8}>
          <Paper elevation={1} sx={{ p: 1.5, borderRadius: 1, mb: 1 }}>
            <Typography variant="subtitle1" fontWeight={600} mb={0.5}>
              Detalii proiect
            </Typography>
            <Divider sx={{ mb: 1 }} />

            {(() => {
              const details: { label: string; value?: React.ReactNode }[] = [
                a.city && { label: "Oraș", value: a.city },
                a.county && { label: "Județ", value: a.county },
                a.street && { label: "Stradă", value: a.street },
                a.neighborhood && { label: "Cartier/Zonă", value: a.neighborhood },
                a.announcementType && { label: "Tip", value: a.announcementType },
                hasNumber(a.rooms) && { label: "Camere", value: a.rooms },
                hasNumber(a.surface) && { label: "Suprafață utilă", value: `${a.surface} mp` },
                hasNumber(a.builtSurface) && { label: "Suprafață construită", value: `${a.builtSurface} mp` },
                hasNumber(a.landSurface) && { label: "Suprafață teren", value: `${a.landSurface} mp` },
                hasNumber(a.floorsCount) && { label: "Nr. de etaje", value: a.floorsCount },
                hasNumber(a.price) && { label: "Preț", value: `${a.price} ${a.currency || "EUR"}` },
                a.stage && { label: "Stadiu", value: a.stage },
                a.constructionStart && { label: "Începerea construcției", value: formatMonthYear(a.constructionStart) },
                a.endDate && { label: "Finalizare", value: formatMonthYear(a.endDate) },
                a.frameType && { label: "Tip chenar (prezentare)", value: a.frameType },
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
            {a.flyerUrl && (
              <Paper elevation={1} sx={{ p: 1.5, borderRadius: 1, width: "100%" }}>
                <Divider sx={{ mb: 1 }} />
                <FlyerViewer url={a.flyerUrl} mimeType={a.flyerMimeType} />
              </Paper>
            )}

            {(a.logoUrl || a.phoneContact) && (
              <Paper elevation={1} sx={{ p: 1.5, borderRadius: 1, width: "100%", justifyContent: "center" }}>
                <DeveloperContactCard
                  name={a.developerName || "Dezvoltator"}
                  phone={a.phoneContact || "N/A"}
                  logoUrl={a.logoUrl || "/default-logo.png"}
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