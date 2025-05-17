"use client";

import * as breakpoints from "@/constants/breakpoints";
import * as palette from "@/constants/colors";

import {
  Box,
  CircularProgress,
  LinearProgress,
  TextField,
  Tooltip,
  Typography,
} from "@mui/material";
import React, { ChangeEvent, useState } from "react";
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
  logo: null as File | null,
  images: [] as File[],
  videos: [] as File[],
};

const ResidentialAnnouncementForm = () => {
  const { userStore, announcementStore } = useStore();
  const { user, updateUser } = userStore;
  const { createAnnouncement, updateAnnouncement, createImageOrVideo } = announcementStore;

  const [formData, setFormData] = useState(INITIAL_DATA);
  const [formErrors, setFormErrors] = useState<typeof INITIAL_DATA & { contactPhone?: string }>({ ...INITIAL_DATA });
  const [loading, setLoading] = useState(false);
  const [contactPhone, setContactPhone] = useState(user?.phoneNumber || "");
  const [error, setError] = useState<string | null>(null);
  const [imageUploadProgress, setImageUploadProgress] = useState({ uploaded: 0, total: 0 });
  const [videoUploadProgress, setVideoUploadProgress] = useState({ uploaded: 0, total: 0 });

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    const fieldError = generalValidation(
      residentialAnnouncementValidationSchema,
      { ...formData, [name]: value },
      name
    );
    setFormErrors((prev) => ({ ...prev, [name]: fieldError }));
  };

  const handleDateChange = (date: Date | null) => {
    const isoDate = date ? date.toISOString() : "";
    setFormData((prev) => ({ ...prev, endDate: isoDate }));

    const error = generalValidation(
      residentialAnnouncementValidationSchema,
      { ...formData, endDate: isoDate },
      "endDate"
    );
    setFormErrors((prev) => ({ ...prev, endDate: error ? String(error) : "" }));
  };

  const uploadMedia = async (announcementId: string) => {
    const totalImages =
      formData.images.length +
      (formData.thumbnail ? 1 : 0) +
      (formData.logo ? 1 : 0);

    const totalVideos = formData.videos.length;

    setImageUploadProgress({ uploaded: 0, total: totalImages });
    setVideoUploadProgress({ uploaded: 0, total: totalVideos });

    const incrementImage = () =>
      setImageUploadProgress((prev) => ({ ...prev, uploaded: prev.uploaded + 1 }));

    const incrementVideo = () =>
      setVideoUploadProgress((prev) => ({ ...prev, uploaded: prev.uploaded + 1 }));

    const imageUploads = formData.images.map((image) =>
      (async () => {
        const fd = new FormData();
        fd.append("file", image);
        fd.append("type", "image");

        await createImageOrVideo(fd, user?.id || "", announcementId);
        incrementImage();
      })()
    );

    if (formData.thumbnail) {
      const thumbUpload = (async () => {
        const fd = new FormData();
        if (formData.thumbnail) {
          fd.append("file", formData.thumbnail);
        }
        fd.append("type", "image");

        const response = await createImageOrVideo(fd, user?.id || "", announcementId);
        if (response?.optimized_url) {
          await updateAnnouncement(announcementId, {
            imageUrl: response.optimized_url,
          });
        }
        incrementImage();
      })();

      imageUploads.push(thumbUpload);
    }

    if (formData.logo) {
      const logoUpload = (async () => {
        const fd = new FormData();
        if (formData.logo) {
          fd.append("file", formData.logo);
        }
        fd.append("type", "image");

        const response = await createImageOrVideo(fd, user?.id || "", announcementId);
        if (response?.optimized_url) {
          await updateAnnouncement(announcementId, {
            logoUrl: response.optimized_url,
          });
        }
        incrementImage();
      })();

      imageUploads.push(logoUpload);
    }

    const videoUploads = formData.videos.map((video) =>
      (async () => {
        const fd = new FormData();
        fd.append("file", video);
        fd.append("type", "video");

        await createImageOrVideo(fd, user?.id || "", announcementId);
        incrementVideo();
      })()
    );

    return Promise.all([
      Promise.all(imageUploads),
      Promise.all(videoUploads),
    ]);
  };

  const handleSubmit = async () => {
    localStorage.removeItem("announcementRealId");
    const { thumbnail, logo, images, videos, ...cleanFormData } = formData;
    const errors = generalValidation(residentialAnnouncementValidationSchema, {
      ...cleanFormData,
      contactPhone,
    });

    if (errors && typeof errors === "object") {
      setFormErrors(errors as typeof INITIAL_DATA & { contactPhone?: string });
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
        phoneContact: contactPhone,
        transactionType: serviceTypes[0],
        announcementType: formData.announcementType.toLowerCase(),
        providerType: "ensemble",
        rooms: 0,
        surface: 0,
        price: 0,
        status: "pending",
        user: { id: user.id, firebaseId: user.firebaseId },
      };

      const newAnnouncement = await createAnnouncement(payload);
      localStorage.setItem("announcementRealId", newAnnouncement.id);
      await uploadMedia(newAnnouncement.id);

      window.location.href = `/payment-packages?announcementId=${newAnnouncement.id}&providerType=ensemble`;
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
          {(imageUploadProgress.total > 0 || videoUploadProgress.total > 0) ? (
            <>
              <Typography mt={2}>
                Uploading images: {imageUploadProgress.uploaded}/{imageUploadProgress.total}
              </Typography>
              {imageUploadProgress.total > 0 && (
                <Box width="100%" mt={1}>
                  <LinearProgress
                    variant="determinate"
                    value={(imageUploadProgress.uploaded / imageUploadProgress.total) * 100}
                  />
                </Box>
              )}

              <Typography mt={2}>
                Uploading videos: {videoUploadProgress.uploaded}/{videoUploadProgress.total}
              </Typography>
              {videoUploadProgress.total > 0 && (
                <Box width="100%" mt={1}>
                  <LinearProgress
                    variant="determinate"
                    value={(videoUploadProgress.uploaded / videoUploadProgress.total) * 100}
                  />
                </Box>
              )}

              {(imageUploadProgress.uploaded < imageUploadProgress.total ||
                videoUploadProgress.uploaded < videoUploadProgress.total) && (
                <Typography mt={2} fontStyle="italic">
                  Finishing uploads, please wait...
                </Typography>
              )}
            </>
          ) : (
            <Typography mt={2}>Creating your announcement...</Typography>
          )}
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
            <TextField
              label="Număr de telefon pentru contact"
              name="contactPhone"
              value={contactPhone}
              onChange={(e) => {
                const value = e.target.value;
                setContactPhone(value);

                const phoneError = generalValidation(
                  residentialAnnouncementValidationSchema,
                  { ...formData, contactPhone: value },
                  "contactPhone"
                );
                setFormErrors((prev) => ({ ...prev, contactPhone: typeof phoneError === "string" ? phoneError : undefined }));
              }}
              error={!!formErrors.contactPhone}
              helperText={formErrors.contactPhone}
              fullWidth
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
              logo={formData.logo}
              setLogo={(file) => setFormData((prev) => ({ ...prev, logo: file }))}
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