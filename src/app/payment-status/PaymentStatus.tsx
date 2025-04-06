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
      // You can also fetch the announcement if needed
      const announcementType = searchParams.get("type") ?? "normal";
      const basePath = announcementType === "ensemble" ? "ansambluri-rezidentiale" : "announcements";
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
        <Typography mt={2}>Verifying your payment...</Typography>
      </Box>
    );
  }

  return (
    <Box maxWidth="600px" mx="auto" textAlign="center" mt={10}>
      {success ? (
        <>
          <Typography variant="h4" gutterBottom>
            🎉 Payment successful!
          </Typography>
          <Typography variant="body1" mb={4}>
            Your announcement has been published and is now visible on the platform.
          </Typography>
          <Link href={announcementUrl}>
            <Button variant="contained" color="primary">
              View Your Announcement
            </Button>
          </Link>
        </>
      ) : (
        <>
          <Typography variant="h5" color="error">
            ❌ Payment failed or was cancelled
          </Typography>
          <Typography mt={2}>
            Please try again or contact support if the issue persists.
          </Typography>
          <Link href="/create-announcement">
            <Button variant="outlined" sx={{ mt: 3 }}>
              Go Back to Create Announcement
            </Button>
          </Link>
        </>
      )}
    </Box>
  );
};

export default PaymentStatusPage;