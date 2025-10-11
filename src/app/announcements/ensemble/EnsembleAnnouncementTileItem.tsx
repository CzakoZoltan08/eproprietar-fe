"use client";

import { Box, Button, Chip, Stack, Typography } from "@mui/material";

import { Endpoints } from "@/constants/endpoints";
import Image from "next/image";
import Link from "next/link";
import { PropertyAnnouncementModel } from "@/models/announcementModels";

const DEFAULT_IMAGE_URL = "https://eproprietar.ro/storage/2903/vand-camera-camin-1.jpg";

const EnsembleAnnouncementTileItem = ({ item }: { item: PropertyAnnouncementModel }) => {
  const href = `${Endpoints.ENSEMBLE_ANNOUNCEMENTS}/${item.id}`;
  const formattedEndDate = item.endDate
    ? new Date(item.endDate).getFullYear().toString()
    : null;

  return (
    <Link
      href={href}
      style={{
        textDecoration: "none",
        color: "inherit",
        display: "block",
        width: "100%",
        maxWidth: 340,
        margin: "0 auto",
      }}
    >
      <Box
        sx={{
          borderRadius: 3,
          overflow: "hidden",
          boxShadow: 2,
          backgroundColor: "#fff",
          display: "flex",
          flexDirection: "column",
          transition: "transform 0.2s ease",
          "&:hover": {
            transform: "translateY(-4px)",
            boxShadow: 4,
          },
          cursor: "pointer",
        }}
      >
        {/* Title */}
        <Box
          sx={{
            p: 2,
            backgroundColor: "#f9f9f9",
            borderBottom: "1px solid #eee",
          }}
        >
          <Typography
            variant="subtitle1"
            fontWeight={600}
            sx={{ textAlign: "center", color: "#333" }}
            noWrap
          >
            {item.title}
          </Typography>
        </Box>

        {/* Image */}
        <Box sx={{ width: "100%", height: 200, position: "relative" }}>
          <Image
            src={item.imageUrl || DEFAULT_IMAGE_URL}
            alt={item.title}
            fill
            style={{ objectFit: "cover" }}
          />
        </Box>

        {/* Badges */}
        <Stack
          direction="row"
          spacing={1}
          justifyContent="center"
          alignItems="center"
          sx={{ p: 1, mt: 1, flexWrap: "wrap", minHeight: "48px" }}
        >
          {item.city && (
            <Chip
              label={item.city}
              size="small"
              sx={{
                backgroundColor: "#f0f0f0",
                fontWeight: 500,
              }}
            />
          )}
          {formattedEndDate && (
            <Chip
              label={`Finalizare ${formattedEndDate}`}
              size="small"
              sx={{
                backgroundColor: "#e0f7e9",
                color: "#2e7d32",
                fontWeight: 500,
              }}
            />
          )}
        </Stack>

        {/* Visual button (not separate clickable area) */}
        <Box sx={{ px: 2, pb: 2, mt: "auto", pointerEvents: "none" }}>
          <Button variant="contained" color="primary" fullWidth>
            Vezi detalii
          </Button>
        </Box>
      </Box>
    </Link>
  );
};

export default EnsembleAnnouncementTileItem;