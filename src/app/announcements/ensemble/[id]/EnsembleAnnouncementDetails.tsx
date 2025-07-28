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

import { AutoImageCarousel } from "@/common/autoImageCarousel/AutoImageCarousel";
import { COLOR_TEXT } from "@/constants/colors";
import { DeveloperContactCard } from "@/common/developerContactCard/DeveloperContactCard";
import { observer } from "mobx-react";
import { useEffect } from "react";
import { useParams } from "next/navigation";
import { useStore } from "@/hooks/useStore";

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

  return (
    <Box sx={{ px: 1.5, py: 2, maxWidth: "1300px", mx: "auto" }}>
      <Box sx={{ mb: 1 }}>
        <AutoImageCarousel
          images={
            announcement.images?.length
              ? announcement.images.map((img) => ({ url: img.original }))
              : [{ url: announcement.imageUrl || "/default.jpg" }]
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
          {announcement.title}
        </Typography>
        <Typography variant="subtitle2" sx={{ mt: 0.5, color: "#555" }}>
          {announcement.city}
        </Typography>
      </Box>

      <Grid container spacing={1}>
        <Grid item xs={12} md={9}>
          <Paper elevation={1} sx={{ p: 1.5, borderRadius: 1, mb: 1 }}>
            <Typography variant="subtitle1" fontWeight={600} mb={0.5}>
              Detalii proiect
            </Typography>
            <Divider sx={{ mb: 1 }} />

            {announcement.city && (
              <Typography variant="body2"><strong>Oraș:</strong> {announcement.city}</Typography>
            )}
            {announcement.announcementType && (
              <Typography variant="body2"><strong>Tip:</strong> {announcement.announcementType}</Typography>
            )}
            {announcement.rooms !== null && announcement.rooms !== undefined && announcement.rooms !== 0 && (
              <Typography variant="body2"><strong>Camere:</strong> {announcement.rooms}</Typography>
            )}
            {announcement.surface !== null && announcement.surface !== undefined && announcement.surface !== 0 && (
              <Typography variant="body2"><strong>Suprafață:</strong> {announcement.surface} mp</Typography>
            )}
            {announcement.price !== null && announcement.price !== undefined && announcement.price !== 0 && (
              <Typography variant="body2"><strong>Preț:</strong> {announcement.price} EUR</Typography>
            )}
            {announcement.endDate && (
              <Typography variant="body2">
                <strong>Finalizare:</strong> {new Date(announcement.endDate).toLocaleDateString()}
              </Typography>
            )}
          </Paper>

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

        <Grid item xs={12} md={3}>
          {(announcement.logoUrl || announcement.phoneContact) && (
            <Box sx={{ position: { md: "sticky" }, top: 20 }}>
              <DeveloperContactCard
                name={announcement.developerName || "Dezvoltator"}
                phone={announcement.phoneContact || "N/A"}
                logoUrl={announcement.logoUrl || "/default-logo.png"}
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
        {announcement.city && <Chip label={announcement.city} size="small" />}
        {announcement.announcementType && <Chip label={announcement.announcementType} size="small" />}
      </Box>
    </Box>
  );
};

export default observer(EnsembleAnnouncementDetailsPage);
