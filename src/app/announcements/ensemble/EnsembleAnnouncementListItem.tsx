"use client";

import { Box, Typography } from "@mui/material";

import { Endpoints } from "@/constants/endpoints";
import Image from "next/image";
import { PrimaryButton } from "@/common/button/PrimaryButton";
import { PropertyAnnouncementModel } from "@/models/announcementModels";
import { useRouter } from "next/navigation";

const EnsembleAnnouncementListItem = ({ item }: { item: PropertyAnnouncementModel }) => {
  const router = useRouter();

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "row",
        border: "1px solid #ccc",
        borderRadius: "12px",
        overflow: "hidden",
        marginBottom: "16px",
      }}
    >
      <Image
        src={item.imageUrl || "https://eproprietar.ro/storage/2903/vand-camera-camin-1.jpg"}
        alt={item.title}
        width={250}
        height={200}
      />
      <Box sx={{ padding: "16px", flexGrow: 1 }}>
        <Typography variant="h5" sx={{ fontWeight: 600, mb: 1 }}>
          {item.title}
        </Typography>
        <Typography variant="body1" sx={{ mb: 2 }}>
          {item.description}
        </Typography>
        <Typography variant="subtitle1" sx={{ fontStyle: "italic", mb: 2 }}>
          Contactați dezvoltatorul pentru detalii
        </Typography>
        <PrimaryButton
          text="Vezi detalii"
          onClick={() => router.push(`${Endpoints.ENSEMBLE_ANNOUNCEMENTS}/${item.id}`)}
        />
      </Box>
    </Box>
  );
};

export default EnsembleAnnouncementListItem;
