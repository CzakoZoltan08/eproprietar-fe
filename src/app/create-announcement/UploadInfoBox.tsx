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
      Uploaded {uploadedCount} / {maxFiles} files • Max size: {maxSizeMB}MB
      {allowedTypes && ` • Allowed: ${allowedTypes.join(", ")}`}
    </Typography>
  );
};

export default UploadInfoBox;