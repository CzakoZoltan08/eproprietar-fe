"use client";

import { Box, Button, CircularProgress, Typography } from "@mui/material";
import { useEffect, useState } from "react";

import Link from "next/link";
import { useSearchParams } from "next/navigation";

const PaymentStatusPage = () => {
  const searchParams = useSearchParams();
  const orderId = searchParams.get("orderId");
  const success = searchParams.get("success") === "true";

  const [loading, setLoading] = useState(true);
  const [announcementUrl, setAnnouncementUrl] = useState<string>("");

  useEffect(() => {
    if (success && orderId) {
      const announcementType = searchParams.get("type") ?? "normal";
      const basePath = announcementType === "ensemble" ? "announcements/ensemble" : "announcements";
      setAnnouncementUrl(`/${basePath}/${orderId}`);
      setLoading(false);
    } else {
      setLoading(false);
    }
  }, [orderId, success]);

  if (loading) {
    return (
      <Box textAlign="center" mt={10}>
        <CircularProgress />
        <Typography mt={2}>Se verifică plata...</Typography>
      </Box>
    );
  }

  return (
    <Box maxWidth="600px" mx="auto" textAlign="center" mt={10}>
      {success ? (
        <>
          <Typography variant="h4" gutterBottom>
            🎉 Plata a fost efectuată cu succes!
          </Typography>
          <Typography variant="body1" mb={4}>
            Anunțul tău a fost publicat și este acum vizibil pe platformă.
          </Typography>
          <Link href={announcementUrl}>
            <Button variant="contained" color="primary">
              Vezi anunțul tău
            </Button>
          </Link>
        </>
      ) : (
        <>
          <Typography variant="h5" color="error">
            ❌ Plata a eșuat sau a fost anulată
          </Typography>
          <Typography mt={2}>
            Te rugăm să încerci din nou sau contactează suportul dacă problema persistă.
          </Typography>
          <Link href="/create-announcement">
            <Button variant="outlined" sx={{ mt: 3 }}>
              Înapoi la crearea anunțului
            </Button>
          </Link>
        </>
      )}
    </Box>
  );
};

export default PaymentStatusPage;