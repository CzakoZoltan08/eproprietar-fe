"use client";

import { Box, Button, Chip, Stack, Typography } from "@mui/material";

import { Endpoints } from "@/constants/endpoints";
import Image from "next/image";
import { PropertyAnnouncementModel } from "@/models/announcementModels";
import { useRouter } from "next/navigation";

const DEFAULT_IMAGE_URL = "https://eproprietar.ro/storage/2903/vand-camera-camin-1.jpg";

const EnsembleAnnouncementTileItem = ({ item }: { item: PropertyAnnouncementModel }) => {
  const router = useRouter();

  const handleGoToDetails = () => {
    router.push(`${Endpoints.ENSEMBLE_ANNOUNCEMENTS}/${item.id}`);
  };

  const formattedEndDate = item.endDate
    ? new Date(item.endDate).getFullYear().toString()
    : null;

  return (
    <Box
      sx={{
        width: "100%",
        maxWidth: 340,
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
        margin: "0 auto",
      }}
    >
      {/* Title on top */}
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

      {/* Button */}
      <Box sx={{ px: 2, pb: 2, mt: "auto" }}>
        <Button
          variant="contained"
          color="primary"
          fullWidth
          onClick={handleGoToDetails}
        >
          Vezi detalii
        </Button>
      </Box>
    </Box>
  );
};

export default EnsembleAnnouncementTileItem;