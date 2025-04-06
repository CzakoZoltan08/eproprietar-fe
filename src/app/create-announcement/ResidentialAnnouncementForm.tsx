"use client";

import * as breakpoints from "@/constants/breakpoints";
import * as palette from "@/constants/colors";

import { Box, CircularProgress, TextField, Tooltip, Typography } from "@mui/material";
import React, { ChangeEvent, useEffect, useState } from "react";
import { propertyTypes, serviceTypes } from "@/constants/annountementConstants";

import AutocompleteCities from "@/common/autocomplete/AutocompleteCities";
import MediaUploader from "@/common/media/MediaUploader";
import { PrimaryButton } from "@/common/button/PrimaryButton";
import PrimaryDatePicker from "@/common/datepicker/PrimaryDatePicker";
import RadioButtonsGroup from "@/common/radio/RadioGroup";
import { generalValidation } from "@/utils/generalValidation";
import { observer } from "mobx-react";
import { residentialAnnouncementValidationSchema } from "@/app/create-announcement/validationSchema";
import styled from "styled-components";
import { useRouter } from "next/navigation";
import { useStore } from "@/hooks/useStore";

const Styled = {
  Container: styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    border-radius: 8px;
    border: 1px solid ${palette.COLOR_LIGHT_GREY};
    color: ${palette.COLOR_TEXT};
    background: ${palette.COLOR_WHITE};
    padding: 24px;
  `,
  Subtitle: styled.h2`
    font-weight: 300;
    font-size: 20px;
    margin-bottom: 50px;
    @media only screen and (max-width: ${breakpoints.MIN_PHONE}) {
      font-size: 18px;
    }
  `,
  FormBox: styled(Box)`
    flex: 1;
    display: flex;
    flex-direction: column;
    gap: 16px;
    align-items: flex-start;
    justify-content: center;
    width: 100%;
    max-width: 600px;
  `,
};

const INITIAL_DATA = {
  providerType: "ensemble",
  announcementType: "",
  title: "",
  city: "",
  street: "",
  description: "",
  stage: "",
  endDate: "",
  thumbnail: null as File | null,
  images: [] as File[],
  videos: [] as File[],
};

const ResidentialAnnouncementForm = () => {
  const { userStore, announcementStore } = useStore();
  const { user, updateUser } = userStore;
  const { createAnnouncement, updateAnnouncement, createImageOrVideo } = announcementStore;

  const router = useRouter();
  const [formData, setFormData] = useState(INITIAL_DATA);
  const [formErrors, setFormErrors] = useState<typeof INITIAL_DATA>({ ...INITIAL_DATA });
  const [loading, setLoading] = useState(false);
  const [contactPhone, setContactPhone] = useState(user?.phoneNumber || "");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const failed = window.location.search.includes("failed");
    if (failed) {
      const savedData = sessionStorage.getItem("announcementData");
      if (savedData) {
        const parsed = JSON.parse(savedData);
        setFormData(parsed);
      }
    }
  }, []);

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    const fieldError = generalValidation(residentialAnnouncementValidationSchema, { ...formData, [name]: value }, name);
    setFormErrors((prev) => ({ ...prev, [name]: fieldError }));
  };

  const handleDateChange = (date: Date | null) => {
    const isoDate = date ? date.toISOString() : "";
    setFormData((prev) => ({ ...prev, endDate: isoDate }));

    const error = generalValidation(residentialAnnouncementValidationSchema, { ...formData, endDate: isoDate }, "endDate");
    setFormErrors((prev) => ({ ...prev, endDate: error ? String(error) : "" }));
  };

  const uploadMedia = async (announcementId: string) => {
    try {
      for (const image of formData.images) {
        const formDataToSend = new FormData();
        formDataToSend.append("file", image);
        formDataToSend.append("type", "image");
        await createImageOrVideo(formDataToSend, user?.id || "", announcementId);
      }

      if (formData.thumbnail) {
        const formDataToSend = new FormData();
        formDataToSend.append("file", formData.thumbnail);
        formDataToSend.append("type", "image");
        const response = await createImageOrVideo(formDataToSend, user?.id || "", announcementId);
        if (response?.optimized_url) {
          await updateAnnouncement(announcementId, { imageUrl: response.optimized_url });
        }
      }

      for (const video of formData.videos) {
        const formDataToSend = new FormData();
        formDataToSend.append("file", video);
        formDataToSend.append("type", "video");
        await createImageOrVideo(formDataToSend, user?.id || "", announcementId);
      }
    } catch (error) {
      console.error("Error uploading media:", error);
    }
  };

  const handleSubmit = async () => {
    localStorage.removeItem("announcementRealId");
    const { thumbnail, images, videos, ...cleanFormData } = formData;
    const errors = generalValidation(residentialAnnouncementValidationSchema, cleanFormData);

    if (errors && typeof errors === "object") {
      setFormErrors(errors as typeof INITIAL_DATA);
      setError("Please correct the highlighted fields.");
      return;
    }

    try {
      setLoading(true);
      setError(null);

      if (!user?.id || !user.firebaseId) {
        throw new Error("User not authenticated.");
      }

      if (contactPhone && contactPhone !== user.phoneNumber) {
        await updateUser(user.id, { phoneNumber: contactPhone });
      }

      const payload = {
        ...cleanFormData,
        transactionType: serviceTypes[0],
        announcementType: formData.announcementType.toLowerCase(),
        providerType: "ensemble",
        rooms: 0,
        surface: 0,
        price: 0,
        status: "pending",
        user: { id: user.id, firebaseId: user.firebaseId },
      };

      const tempId = Math.floor(Math.random() * 10000000); // use integer temporary ID
      localStorage.setItem("announcementData", JSON.stringify({ ...formData, announcementId: tempId }));

      window.location.href = `/payment-packages?announcementId=${tempId}&providerType=ensemble`;

      setTimeout(async () => {
        try {
          const newAnnouncement = await createAnnouncement(payload);
          localStorage.setItem("announcementRealId", newAnnouncement.id);
          await uploadMedia(newAnnouncement.id);
          console.error("Background announcementRealId", newAnnouncement.id);
        } catch (err) {
          console.error("Background creation failed", err);
        }
      }, 100);

    } catch (err: any) {
      console.error("Error creating announcement:", err);
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Styled.Container>
      {loading ? (
        <>
          <CircularProgress />
          <Typography mt={2}>Creating your announcement...</Typography>
        </>
      ) : (
        <>
          <Styled.Subtitle>Publică un ansamblu rezidențial</Styled.Subtitle>
          {error && <Typography color="error" mb={2}>{error}</Typography>}

          <Styled.FormBox>
            <RadioButtonsGroup
              options={propertyTypes}
              value={formData.announcementType}
              id="announcementType"
              onChange={handleInputChange}
              label="Tipul căutării"
              error={formErrors.announcementType}
            />
            <AutocompleteCities
              onChange={(event, value) => setFormData((prev) => ({ ...prev, city: value || "" }))}
              label="Localizare (oraș/comună)"
              customWidth="100%"
              error={formErrors.city}
              value={formData.city}
            />
            <TextField
              label="Detalii localizare (stradă)"
              name="street"
              value={formData.street}
              onChange={handleInputChange}
              error={!!formErrors.street}
              helperText={formErrors.street}
              fullWidth
            />
            <Tooltip title="Titlu anunț: fii creativ, dar corect">
              <TextField
                label="Titlu Anunț"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                error={!!formErrors.title}
                helperText={formErrors.title}
                fullWidth
              />
            </Tooltip>
            <TextField
              label="Descriere"
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              error={!!formErrors.description}
              helperText={formErrors.description}
              fullWidth
              multiline
              rows={4}
            />
            <TextField
              label="Stadiul ansamblului"
              name="stage"
              value={formData.stage}
              onChange={handleInputChange}
              error={!!formErrors.stage}
              helperText={formErrors.stage}
              fullWidth
            />
            <PrimaryDatePicker
              name="endDate"
              label="Termen de finalizare"
              value={formData.endDate}
              error={formErrors.endDate || ""}
              handleChange={handleDateChange}
            />
            <MediaUploader
              thumbnail={formData.thumbnail}
              setThumbnail={(file) => setFormData((prev) => ({ ...prev, thumbnail: file }))}
              images={formData.images}
              setImages={(files) => setFormData((prev) => ({ ...prev, images: files }))}
              videos={formData.videos}
              setVideos={(files) => setFormData((prev) => ({ ...prev, videos: files }))}
              error={error || ""}
              setError={setError}
            />
          </Styled.FormBox>

          <Box mt={4}>
            <PrimaryButton text="Creează anunțul" onClick={handleSubmit} />
          </Box>
        </>
      )}
    </Styled.Container>
  );
};

export default observer(ResidentialAnnouncementForm);