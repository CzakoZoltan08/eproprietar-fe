"use client";

import React from "react";
import { Typography } from "@mui/material";

type UploadInfoBoxProps = {
  maxFiles: number;
  maxSizeMB: number;
  allowedTypes?: string[];
  uploadedCount: number;
};

const UploadInfoBox: React.FC<UploadInfoBoxProps> = ({
  maxFiles,
  maxSizeMB,
  allowedTypes,
  uploadedCount,
}) => {
  return (
    <Typography variant="body2" color="textSecondary" sx={{ mt: 1, mb: 1 }}>
      Încărcate {uploadedCount} / {maxFiles} fișiere • Dimensiune maximă: {maxSizeMB}MB
      {allowedTypes && ` • Formate permise: ${allowedTypes.join(", ")}`}
    </Typography>
  );
};

export default UploadInfoBox;