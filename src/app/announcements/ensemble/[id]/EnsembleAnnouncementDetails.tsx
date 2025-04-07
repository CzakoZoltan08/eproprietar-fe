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
import { PrimaryButton } from "@/common/button/PrimaryButton";
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
      <Box sx={{ padding: "32px", display: "flex", justifyContent: "center" }}>
        <CircularProgress />
      </Box>
    );
  }

  const announcement = currentAnnouncement;

  return (
    <Box sx={{ px: 2, py: 4, maxWidth: "1300px", mx: "auto" }}>

  {/* Carousel */}
<Box sx={{ mb: 0 }}>
  <AutoImageCarousel
    images={
      announcement.images?.length
        ? announcement.images.map((img) => ({ url: img.original }))
        : [{ url: announcement.imageUrl || "/default.jpg" }]
    }
  />
</Box>

{/* Hero Title Section */}
<Box
  sx={{
    textAlign: "center",
    py: 4,
    mb: 4,
    background: "linear-gradient(to right, #f0f4ff, #ffffff)",
    borderBottom: "1px solid #ddd",
  }}
>
  <Typography
    variant="h4"
    fontWeight={700}
    sx={{
      color: COLOR_TEXT,
      display: "inline-block",
      borderBottom: "4px solid #448aff",
      pb: 1,
      px: 2,
    }}
  >
    {announcement.title}
  </Typography>

  <Typography
    variant="subtitle1"
    sx={{ mt: 1, color: "#555", fontWeight: 400 }}
  >
    {announcement.city}
  </Typography>
</Box>

  {/* Grid: Left main + Right narrow developer card */}
  <Grid container spacing={4} alignItems="flex-start">
    {/* Left Column: 9/12 */}
    <Grid item xs={12} md={9}>
      {/* Project Details */}
      <Paper elevation={3} sx={{ p: 3, borderRadius: 2, mb: 3 }}>
        <Typography variant="h5" fontWeight={600} mb={1}>Detalii proiect</Typography>
        <Divider sx={{ mb: 2 }} />
        <Typography variant="body1" mb={1}><strong>Oraș:</strong> {announcement.city}</Typography>
        <Typography variant="body1" mb={1}><strong>Tip:</strong> {announcement.announcementType}</Typography>
        <Typography variant="body1" mb={1}><strong>Camere:</strong> {announcement.rooms}</Typography>
        <Typography variant="body1" mb={1}><strong>Suprafață:</strong> {announcement.surface} mp</Typography>
        <Typography variant="body1" mb={1}><strong>Preț:</strong> {announcement.price} EUR</Typography>
        {announcement.endDate && (
          <Typography variant="body1" mb={1}><strong>Finalizare:</strong> {new Date(announcement.endDate).toLocaleDateString()}</Typography>
        )}
      </Paper>

      {/* Description */}
      <Paper elevation={3} sx={{ p: 3, borderRadius: 2 }}>
        <Typography variant="h5" fontWeight={600} mb={2}>Descriere</Typography>
        <Divider sx={{ mb: 2 }} />
        <Typography variant="body1" sx={{ whiteSpace: "pre-line" }}>
          {announcement.description || "Fără descriere disponibilă."}
        </Typography>
      </Paper>
    </Grid>

    {/* Right Column: 3/12 – aligned to far right */}
    <Grid item xs={12} md={3}>
      {announcement.logoUrl || announcement.phoneContact ? (
        <Box sx={{ position: "sticky", top: 32 }}>
          <DeveloperContactCard
            name={announcement.developerName || "Dezvoltator"}
            phone={announcement.phoneContact || "N/A"}
            logoUrl={announcement.logoUrl || "/default-logo.png"}
          />
        </Box>
      ) : null}
    </Grid>
  </Grid>


  {/* Tags / Chips */}
  <Box sx={{ mt: 6, display: "flex", flexWrap: "wrap", gap: 1 }}>
    {announcement.city && <Chip label={announcement.city} />}
    {announcement.announcementType && <Chip label={announcement.announcementType} />}
  </Box>
</Box>


  );
};

export default observer(EnsembleAnnouncementDetailsPage);