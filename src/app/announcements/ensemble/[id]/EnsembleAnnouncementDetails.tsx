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
import { COLOR_RED_BUTTON, COLOR_TEXT } from "@/constants/colors";

import Image from "next/image";
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
    <Box sx={{ padding: "32px" }}>
      {/* Header */}
      <Typography variant="h3" fontWeight={700} mb={2} color={COLOR_TEXT}>
        {announcement.title}
      </Typography>

      {/* Main Image */}
      <Box sx={{ width: "100%", height: 400, position: "relative", mb: 3 }}>
        <Image
          src={announcement.imageUrl || "/default.jpg"}
          alt={announcement.title}
          layout="fill"
          objectFit="cover"
          style={{ borderRadius: "16px" }}
        />
      </Box>

      {/* Info Grid */}
      <Grid container spacing={4} mb={4}>
        <Grid item xs={12} md={6}>
          <Paper elevation={3} sx={{ p: 3, borderRadius: 2 }}>
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
        </Grid>

        <Grid item xs={12} md={6}>
          <Paper elevation={3} sx={{ p: 3, borderRadius: 2 }}>
            <Typography variant="h5" fontWeight={600} mb={2}>Descriere</Typography>
            <Divider sx={{ mb: 2 }} />
            <Typography variant="body1" sx={{ whiteSpace: "pre-line" }}>
              {announcement.description || "Fără descriere disponibilă."}
            </Typography>
          </Paper>
        </Grid>
      </Grid>

      {/* Contact Developer Section */}
      <Box sx={{ textAlign: "center", mt: 6 }}>
        <Typography variant="h5" fontWeight={600} mb={2} color={COLOR_TEXT}>
          Contactați dezvoltatorul pentru mai multe detalii
        </Typography>
        <PrimaryButton
          text="Trimite mesaj"
          onClick={() => alert("Mesaj către dezvoltator")}
        />
      </Box>

      {/* Tags / Chips */}
      <Box sx={{ mt: 6, display: "flex", flexWrap: "wrap", gap: 1 }}>
        {announcement.city && <Chip label={announcement.city} />}
        {announcement.announcementType && <Chip label={announcement.announcementType} />}
      </Box>
    </Box>
  );
};

export default observer(EnsembleAnnouncementDetailsPage);