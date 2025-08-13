"use client";

import { Box, Button, Tooltip, Typography } from "@mui/material";
import React, { useEffect, useMemo, useRef, useState } from "react";

type FlyerUploaderProps = {
  /** Local file (unsaved) */
  file: File | null;
  /** Setter for local file */
  setFile: (f: File | null) => void;

  /** Existing server file URL (for edit/backfill) */
  url?: string;
  /** Saved mime type from server */
  mimeType?: string;

  /** Error from parent (optional) */
  error?: string;
  /** Setter for local/parent error */
  setError?: (e: string | null) => void;

  /** Called when user clicks preview to remove flyer */
  onPreviewClickRemove?: () => void;

  /** Accepted file types */
  accept?: string;
  /** Label above uploader */
  label?: string;
  /** Helper text under button */
  helperText?: string;

  /** Max file size in bytes */
  maxSizeBytes?: number;
};

const DEFAULT_ACCEPT = "image/*,application/pdf";
const DEFAULT_MAX_SIZE = 25 * 1024 * 1024; // 25 MB

export default function FlyerUploader({
  file,
  setFile,
  url,
  mimeType,
  error,
  setError,
  onPreviewClickRemove,
  accept = DEFAULT_ACCEPT,
  label = "Flyer (imagine sau PDF)",
  helperText,
  maxSizeBytes = DEFAULT_MAX_SIZE,
}: FlyerUploaderProps) {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [localError, setLocalError] = useState<string | null>(null);

  // Object URL for previewing local file
  const objectUrl = useMemo(() => {
    if (!file) return "";
    try {
      return URL.createObjectURL(file);
    } catch {
      return "";
    }
  }, [file]);

  const effectiveMime = (file?.type || mimeType || "").toLowerCase();
  const isPdf = effectiveMime.includes("pdf");

  const hasPreview = !!file || !!url;
  const previewSrc = file ? objectUrl : url || "";

  // Cleanup object URL
  useEffect(() => {
    return () => {
      if (objectUrl) URL.revokeObjectURL(objectUrl);
    };
  }, [objectUrl]);

  // Sync parent error
  useEffect(() => {
    if (error !== undefined && error !== null) {
      setLocalError(error);
    }
  }, [error]);

  const reportError = (msg: string | null) => {
    setLocalError(msg);
    setError?.(msg);
  };

  const handleBrowseClick = () => {
    inputRef.current?.click();
  };

  const handleFileChange: React.ChangeEventHandler<HTMLInputElement> = (e) => {
    const f = e.target.files?.[0] ?? null;
    if (!f) return;

    // Validate size
    if (f.size > maxSizeBytes) {
      reportError(`Fișierul este prea mare (max ${(maxSizeBytes / (1024 * 1024)).toFixed(0)} MB).`);
      e.target.value = "";
      return;
    }

    // Validate type
    const okTypes = accept.split(",").map((t) => t.trim());
    const matchesType = okTypes.some((t) => {
      if (t.endsWith("/*")) {
        const base = t.slice(0, -1);
        return f.type.startsWith(base);
      }
      return f.type === t;
    });

    if (!matchesType) {
      reportError("Tip de fișier neacceptat. Încarcă imagine sau PDF.");
      e.target.value = "";
      return;
    }

    reportError(null);
    setFile(f);
  };

  const clearFlyer = () => {
    onPreviewClickRemove?.();
    if (!onPreviewClickRemove) {
      setFile(null);
      reportError(null);
    }
  };

  return (
    <Box
      display="flex"
      flexDirection="column"
      alignItems="center" // Center button + preview
      gap={1}
      width="100%"
    >
      <Typography variant="subtitle1">{label}</Typography>

      <input
        ref={inputRef}
        type="file"
        accept={accept}
        style={{ display: "none" }}
        onChange={handleFileChange}
      />

      <Button variant="outlined" onClick={handleBrowseClick}>
        Alege fișier
      </Button>

      {helperText && (
        <Typography variant="body2" color="text.secondary">
          {helperText}
        </Typography>
      )}

      {hasPreview && (
        <Tooltip title="Click pentru a șterge flyerul">
          <Box
            onClick={clearFlyer}
            sx={{
              mt: 1,
              position: "relative",
              width: 320,
              height: 220,
              borderRadius: 1,
              overflow: "hidden",
              border: "1px solid #e0e0e0",
              cursor: "pointer",
            }}
          >
            <Box
              sx={{
                position: "absolute",
                top: 8,
                right: 8,
                background: "rgba(0,0,0,.65)",
                color: "#fff",
                px: 1,
                py: 0.25,
                borderRadius: 999,
                fontSize: 12,
              }}
            >
              × Șterge
            </Box>

            {isPdf ? (
              <embed src={previewSrc} type="application/pdf" width="100%" height="100%" />
            ) : (
              <img
                src={previewSrc}
                alt="Flyer preview"
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                  display: "block",
                }}
              />
            )}
          </Box>
        </Tooltip>
      )}

      {file && (
        <Typography variant="body2" color="text.secondary">
          {file.name} • {(file.size / (1024 * 1024)).toFixed(2)} MB
        </Typography>
      )}

      {localError && (
        <Typography variant="body2" color="error">
          {localError}
        </Typography>
      )}
    </Box>
  );
}