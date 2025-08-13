"use client";

import {
  Box,
  Button,
  Dialog,
  DialogContent,
  DialogTitle,
  IconButton,
  Paper,
  Typography,
} from "@mui/material";
import React, { useState } from "react";

import CloseIcon from "@mui/icons-material/Close";

const isPdf = (mt?: string) => (mt || "").toLowerCase().includes("pdf");

type Props = {
  url?: string;
  mimeType?: string;
};

export default function FlyerViewer({ url, mimeType }: Props) {
  const [open, setOpen] = useState(false);
  if (!url) return null;

  return (
    <Box
  display="flex"
  flexDirection="column"
  alignItems="center"
  width="100%"
>
    <Paper elevation={1} sx={{ p: 1.5, borderRadius: 1, mb: 1 }}>
      <Typography variant="subtitle1" fontWeight={600} mb={0.5}>
        Broșură / Flyer
      </Typography>

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
        {isPdf(mimeType) ? (
          <Box sx={{ width: "100%", height: 260 }}>
            <object data={url} type="application/pdf" width="100%" height="100%">
              <Box sx={{ p: 1 }}>
                <Typography variant="body2">
                  Previzualizare PDF indisponibilă. Click pentru a deschide.
                </Typography>
              </Box>
            </object>
          </Box>
        ) : (
          <Box
            component="img"
            src={url}
            alt="Flyer"
            sx={{ width: "100%", maxHeight: 360, objectFit: "contain" }}
          />
        )}
      </Box>

      <Button variant="outlined" onClick={() => setOpen(true)}>
        Deschide pe tot ecranul
      </Button>

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
          {isPdf(mimeType) ? (
            <object
              data={url}
              type="application/pdf"
              width="100%"
              height="100%"
              style={{ minHeight: "100vh" }}
            >
              <Box sx={{ p: 2 }}>
                <Typography variant="body2">
                  Nu putem afișa PDF-ul.{" "}
                  <a href={url} target="_blank" rel="noreferrer">
                    Deschide în fereastră nouă
                  </a>
                </Typography>
              </Box>
            </object>
          ) : (
            <Box
              component="img"
              src={url}
              alt="Flyer"
              sx={{ width: "100%", height: "100%", objectFit: "contain" }}
            />
          )}
        </DialogContent>
      </Dialog>
    </Paper>
    </Box>
  );
}