"use client";

import { Box, Button, Typography } from "@mui/material";

import bannerImage from "@/assets/BookCoverImage.jpg";

export const BookPromoSection = () => {
  return (
    <Box
      sx={{
        border: "2px solid #d2d2d2",
        padding: 3,
        borderRadius: 1,
        mt: 6,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        maxWidth: 1000,
        marginX: "auto",
        backgroundColor: "#fff",
      }}
    >
      <Typography variant="h5" textAlign="center" fontWeight={500} mb={2}>
        Eproprietar.ro susține educația în imobiliare!
      </Typography>

      <Box
        sx={{
          display: "flex",
          flexWrap: "wrap",
          justifyContent: "space-between",
          alignItems: "center",
          gap: 3,
          width: "100%",
        }}
      >
        <Box
          sx={{
            flex: 1,
            minWidth: 280,
            maxWidth: 500,
            textAlign: "center",
          }}
        >
          <Typography fontWeight="bold" fontSize={18} lineHeight={1.5}>
            Ești interesat de imobiliare?<br />
            Ești un viitor cumpărător?<br />
            Ești proprietar de imobil?<br />
            Ești agent imobiliar?
          </Typography>

          <Typography
            fontWeight={700}
            fontSize={20}
            mt={1}
            mb={1}
          >
            Această carte este pentru tine!
          </Typography>

          <Button
            variant="contained"
            href="https://totuldespreimobiliare.ro/finalizare/"
            target="_blank"
            rel="noopener noreferrer"
            sx={{
              backgroundColor: "#69a8db",
              color: "red",
              fontSize: 18,
              fontWeight: 500,
              paddingX: 3,
              paddingY: 1.2,
              ":hover": {
                backgroundColor: "#5193c9",
              },
            }}
          >
            Comandă ACUM
          </Button>
        </Box>

        <Box
          sx={{
            flex: 1,
            minWidth: 280,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <img
            src={bannerImage.src}
            alt='"Totul" despre imobiliare'
            style={{
              maxWidth: "100%",
              height: "auto",
              width: 380,
            }}
          />
        </Box>
      </Box>
    </Box>
  );
};