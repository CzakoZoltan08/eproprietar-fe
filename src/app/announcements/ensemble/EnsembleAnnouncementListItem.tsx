"use client";

import { Box, Typography, useTheme } from "@mui/material";

import { Endpoints } from "@/constants/endpoints";
import Image from "next/image";
import { PrimaryButton } from "@/common/button/PrimaryButton";
import { PropertyAnnouncementModel } from "@/models/announcementModels";
import { useRouter } from "next/navigation";

const EnsembleAnnouncementListItem = ({ item }: { item: PropertyAnnouncementModel }) => {
  const router = useRouter();
  const theme = useTheme();

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center", // centers the card horizontally
        px: 2, // horizontal padding for mobile
      }}
    >
      <Box
        sx={{
          display: "flex",
          flexDirection: { xs: "column", sm: "row" },
          border: "1px solid #ccc",
          borderRadius: "12px",
          overflow: "hidden",
          marginBottom: "16px",
          boxShadow: { xs: 1, sm: 2 },
          width: "100%",
          maxWidth: 800, // limit card width
        }}
      >
        <Box
          sx={{
            width: { xs: "100%", sm: 250 },
            height: 200,
            position: "relative",
            flexShrink: 0,
          }}
        >
          <Image
            src={item.imageUrl || "https://eproprietar.ro/storage/2903/vand-camera-camin-1.jpg"}
            alt={item.title}
            layout="fill"
            objectFit="cover"
          />
        </Box>
        <Box sx={{ padding: 2, flexGrow: 1 }}>
          <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
            {item.title}
          </Typography>
          <Typography variant="body2" sx={{ mb: 2 }}>
            {item.description}
          </Typography>
          <Typography variant="subtitle2" sx={{ fontStyle: "italic", mb: 2 }}>
            Contactați dezvoltatorul pentru detalii
          </Typography>
          <PrimaryButton
            text="Vezi detalii"
            onClick={() => router.push(`${Endpoints.ENSEMBLE_ANNOUNCEMENTS}/${item.id}`)}
          />
        </Box>
      </Box>
    </Box>
  );
};

export default EnsembleAnnouncementListItem;