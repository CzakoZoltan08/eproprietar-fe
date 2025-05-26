"use client";

import { Box, Typography } from "@mui/material";

import AnnouncementForm from "@/app/create-announcement/AnnouncementForm";
import React from "react";

const AdminCreateAnnouncementPage: React.FC = () => {
  return (
    <Box maxWidth="900px" mx="auto" py={4} px={2}>
      <Typography variant="h4" component="h1" gutterBottom>
        Admin: Create New Announcement
      </Typography>
      {/* Reuse the existing AnnouncementForm component */}
      <AnnouncementForm />
    </Box>
  );
};

export default AdminCreateAnnouncementPage;