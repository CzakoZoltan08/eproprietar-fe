"use client";

import {
  Box,
  Button,
  Dialog,
  DialogContent,
  DialogTitle,
  IconButton,
  Paper,
  Stack,
  Typography,
} from "@mui/material";
import React, { useMemo, useState } from "react";

import CloseIcon from "@mui/icons-material/Close";
import PictureAsPdfIcon from "@mui/icons-material/PictureAsPdf";

const looksLikePdf = (url?: string, mt?: string) => {
  const mime = (mt || "").toLowerCase();
  if (mime.includes("pdf")) return true;
  const u = (url || "").toLowerCase().split("?")[0];
  return u.endsWith(".pdf");
};

type Props = {
  url?: string;
  mimeType?: string;
};

export default function FlyerViewer({ url, mimeType }: Props) {
  const [open, setOpen] = useState(false);
  const [downloading, setDownloading] = useState(false);
  const [downloadError, setDownloadError] = useState<string | null>(null);

  const isPdf = useMemo(() => looksLikePdf(url, mimeType), [url, mimeType]);

  if (!url) return null;

  const handleDownloadPdf = async () => {
    setDownloadError(null);
    setDownloading(true);
    try {
      const res = await fetch(url, { mode: "cors" });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const blob = await res.blob();

      const href = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = href;
      a.download = "Flyer.pdf"; // ✅ fixed filename
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(href);
    } catch (e: any) {
      setDownloadError(
        e?.message
          ? `Nu am reușit descărcarea (${e.message}).`
          : "Nu am reușit descărcarea."
      );
      window.open(url, "_blank", "noopener,noreferrer");
    } finally {
      setDownloading(false);
    }
  };

  return (
    <Box display="flex" flexDirection="column" alignItems="center" width="100%">
      <Paper elevation={1} sx={{ p: 1.5, borderRadius: 1, mb: 1, width: "100%" }}>
        {isPdf ? (
          <Stack direction="column" spacing={2} alignItems="center">
            <PictureAsPdfIcon fontSize="large" color="error" />
            <Box textAlign="center">
              <Typography variant="subtitle1">Broșură / Flyer</Typography>
              <Typography variant="body2" color="text.secondary">
                PDF – previzualizarea este dezactivată
              </Typography>
              {downloadError && (
                <Typography variant="body2" color="error" sx={{ mt: 0.5 }}>
                  {downloadError}
                </Typography>
              )}
            </Box>

            <Button
              variant="contained"
              onClick={handleDownloadPdf}
              disabled={downloading}
              fullWidth
            >
              {downloading ? "Se descarcă..." : "Descarcă PDF"}
            </Button>
          </Stack>
        ) : (
          <>
            {/* Image preview card */}
            <Box
              sx={{
                border: "1px solid #eee",
                borderRadius: 1,
                overflow: "hidden",
                mb: 1,
                cursor: "pointer",
              }}
              onClick={() => setOpen(true)}
            >
              <Box
                component="img"
                src={url}
                alt="Flyer"
                sx={{ width: "100%", maxHeight: 360, objectFit: "contain" }}
              />
            </Box>

            <Button variant="outlined" onClick={() => setOpen(true)}>
              Deschide pe tot ecranul
            </Button>

            {/* Fullscreen dialog only for images */}
            <Dialog open={open} onClose={() => setOpen(false)} fullScreen>
              <DialogTitle sx={{ display: "flex", alignItems: "center", pr: 6 }}>
                Flyer
                <IconButton
                  onClick={() => setOpen(false)}
                  sx={{ position: "absolute", right: 12, top: 8 }}
                  aria-label="Închide"
                >
                  <CloseIcon />
                </IconButton>
              </DialogTitle>
              <DialogContent dividers sx={{ p: 0 }}>
                <Box
                  component="img"
                  src={url}
                  alt="Flyer"
                  sx={{ width: "100%", height: "100%", objectFit: "contain" }}
                />
              </DialogContent>
            </Dialog>
          </>
        )}
      </Paper>
    </Box>
  );
}
