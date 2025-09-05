import { Box, Button, Typography } from "@mui/material";

import FacebookIcon from "@mui/icons-material/Facebook";
import LinkIcon from "@mui/icons-material/Link";
import React from "react";
import WhatsAppIcon from "@mui/icons-material/WhatsApp";

const ShareButtonsCard: React.FC<{ url?: string }> = ({
  url = typeof window !== "undefined" ? window.location.href : "",
}) => {
  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(url);
      alert("Link copiat în clipboard!");
    } catch {
      alert("Copierea linkului a eșuat!");
    }
  };

  return (
    <Box
      sx={{
        p: 1,
        borderRadius: 1,
        border: "1px solid #e0e0e0",
        backgroundColor: "#fff",
      }}
    >
      <Typography variant="subtitle1" gutterBottom textAlign="center">
        Partajează anunțul:
      </Typography>

      <Box
        display="flex"
        justifyContent="center"
        flexWrap="wrap"
        gap={1}
      >
        <Button
          variant="outlined"
          color="success"
          startIcon={<WhatsAppIcon />}
          href={`https://wa.me/?text=${encodeURIComponent(url)}`}
          target="_blank"
          rel="noopener noreferrer"
        >
          Whatsapp
        </Button>

        <Button
          variant="outlined"
          color="primary"
          startIcon={<FacebookIcon />}
          href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`}
          target="_blank"
          rel="noopener noreferrer"
        >
          Facebook
        </Button>
        
      </Box>
    </Box>
  );
};

export default ShareButtonsCard;
