"use client";

import * as breakpoints from "@/constants/breakpoints";

import {
  Box,
  CircularProgress,
  FormControl,
  InputLabel,
  LinearProgress,
  MenuItem,
  Select,
  TextField,
  Tooltip,
  Typography,
} from "@mui/material";
import React, { ChangeEvent, useEffect, useState } from "react";
import { propertyTypesResidential, serviceTypes } from "@/constants/annountementConstants";

import AutocompleteCities from "@/common/autocomplete/AutocompleteCities";
import AutocompleteCounties from "@/common/autocomplete/AutocompleteCounties";
import FlyerUploader from "@/common/flyerUploader/FlyerUploader";
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
    border: 1px solid #e0e0e0;
    color: #000;
    background: #fff;
    padding: 16px;
    gap: 16px;
    max-width: 800px;
    margin: auto;
    overflow-x: hidden;

    @media (max-width: 768px) {
      max-width: 100%;
      padding: 12px;
    }
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
  county: "",
  street: "",
  description: "",
  stage: "",
  endDate: "",
  logo: null as File | null,
  images: [] as File[],
  videos: [] as File[],
  apartmentTypeOther: "",
  neighborhood: "", // Cartier/zonă
  constructionStart: "", // Începerea construcției (month+year)
  floorsCount: "", // Nr. de etaje
  builtSurface: "", // Suprafață construită (m²)
  landSurface: "", // Suprafață teren (m²)
  amenities: "", // Facilități
  developerSite: "", // Site dezvoltator
  frameType: "", // Tip chenar
  flyer: null as File | null, // local file
  flyerUrl: "", // server URL (edit mode/backfill)
  flyerMimeType: "", // saved mime
  userId: "", // ⬅️ for admin assignment
};

const ResidentialAnnouncementForm = () => {
  const { userStore, announcementStore, pricingStore } = useStore();
  const { user, updateUser, fetchAllUsers, users, getCurrentUser } = userStore;
  const {
    createAnnouncement,
    updateAnnouncement,
    createImageOrVideo,
    createPaymentSession,
    sendAnnouncementCreationMail,
  } = announcementStore;

  const [formData, setFormData] = useState(INITIAL_DATA);
  const [flyerError, setFlyerError] = useState<string | null>(null);
  const [formErrors, setFormErrors] = useState<typeof INITIAL_DATA & { contactPhone?: string }>({
    ...INITIAL_DATA,
  });
  const [loading, setLoading] = useState(false);
  const [contactPhone, setContactPhone] = useState(user?.phoneNumber || "");
  const [error, setError] = useState<string | null>(null);
  const [imageUploadProgress, setImageUploadProgress] = useState({ uploaded: 0, total: 0 });
  const [videoUploadProgress, setVideoUploadProgress] = useState({ uploaded: 0, total: 0 });
  const [isSubmitted, setIsSubmitted] = useState(false);

  // Prefill a few defaults
  useEffect(() => {
    setFormData((prev) => ({
      ...prev,
      city: "Abrud",
      county: "Alba",
      announcementType: "Apartament",
    }));
  }, []);

  // Load current user / admin data
  useEffect(() => {
    // Ensure user is loaded
    if (!user?.id) {
      getCurrentUser();
    }
  }, [user?.id, getCurrentUser]);

  useEffect(() => {
    if (user?.id) {
      // Load packages (needed for admin free plan flow)
      pricingStore.getAnnouncementPackages(user.id);
    }
    if (user?.role === "admin") {
      fetchAllUsers();
    }
  }, [user?.id, user?.role, fetchAllUsers, pricingStore]);

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

  const handleRemoveFlyer = () => {
    setFormData((prev) => ({
      ...prev,
      flyer: null,
      flyerUrl: "",
      flyerMimeType: "",
    }));
    setFlyerError(null);
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

  const handleConstructionStartChange = (date: Date | null) => {
    const isoMonthStart = date ? new Date(date.getFullYear(), date.getMonth(), 1).toISOString() : "";
    setFormData((prev) => ({ ...prev, constructionStart: isoMonthStart }));

    const error = generalValidation(
      residentialAnnouncementValidationSchema,
      { ...formData, constructionStart: isoMonthStart },
      "constructionStart"
    );
    setFormErrors((prev) => ({ ...prev, constructionStart: error ? String(error) : "" } as any));
  };

  const uploadMedia = async (announcementId: string) => {
    const totalImages = formData.images.length + (formData.logo ? 1 : 0);
    const totalVideos = formData.videos.length;

    setImageUploadProgress({ uploaded: 0, total: totalImages });
    setVideoUploadProgress({ uploaded: 0, total: totalVideos });

    const incrementImage = () =>
      setImageUploadProgress((prev) => ({ ...prev, uploaded: prev.uploaded + 1 }));
    const incrementVideo = () =>
      setVideoUploadProgress((prev) => ({ ...prev, uploaded: prev.uploaded + 1 }));

    let thumbnailUrl = "";

    // 1) Upload first image as thumbnail
    if (formData.images.length > 0) {
      const firstImage = formData.images[0];
      const fd = new FormData();
      fd.append("file", firstImage);
      fd.append("type", "image");

      const response = await createImageOrVideo(fd, announcementId);
      if (response?.optimized_url) {
        thumbnailUrl = response.optimized_url;
        await updateAnnouncement(announcementId, {
          imageUrl: thumbnailUrl,
        });
      }
      incrementImage();
    }

    // 2) Upload remaining images
    for (const image of formData.images.slice(1)) {
      const fd = new FormData();
      fd.append("file", image);
      fd.append("type", "image");
      await createImageOrVideo(fd, announcementId);
      incrementImage();
    }

    // 3) Upload logo
    if (formData.logo) {
      const fd = new FormData();
      fd.append("file", formData.logo);
      fd.append("type", "image");

      const response = await createImageOrVideo(fd, announcementId);
      if (response?.optimized_url) {
        await updateAnnouncement(announcementId, {
          logoUrl: response.optimized_url,
        });
      }
      incrementImage();
    }

    // 4) Upload videos
    for (const video of formData.videos) {
      const fd = new FormData();
      fd.append("file", video);
      fd.append("type", "video");
      await createImageOrVideo(fd, announcementId);
      incrementVideo();
    }

    // 5) Upload flyer (PDF or image)
    if (formData.flyer) {
      const fd = new FormData();
      fd.append("file", formData.flyer);
      fd.append("type", "flyer");

      const resp = await createImageOrVideo(fd, announcementId);
      const url = resp?.optimized_url || resp?.url || "";
      const mime = resp?.mimeType || formData.flyer.type;

      if (url) {
        await updateAnnouncement(announcementId, {
          flyerUrl: url,
          flyerMimeType: mime,
        });
      }
    }

    await new Promise((resolve) => setTimeout(resolve, 1000)); // small flush delay
  };

  const handleSubmit = async () => {
    setIsSubmitted(true);

    // quick basic requireds
    if (!contactPhone || !formData.county || !formData.city || !formData.announcementType || !formData.title) {
      setError("Te rugăm să completezi toate câmpurile obligatorii.");
      return;
    }

    const { logo, images, videos, flyer, ...cleanFormData } = formData;
    const errors = generalValidation(residentialAnnouncementValidationSchema, {
      ...cleanFormData,
      contactPhone,
    });

    if (errors && typeof errors === "object") {
      setFormErrors(errors as typeof INITIAL_DATA & { contactPhone?: string });
      setError("Te rugăm să corectezi câmpurile evidențiate.");
      return;
    }

    try {
      setLoading(true);
      setError(null);

      // Find selected user (admin can assign)
      let selectedUser = user;
      if (user?.role === "admin") {
        selectedUser = users.find((u) => u.id === formData.userId) || user;
      }

      if (!selectedUser?.id) {
        throw new Error("Utilizator neautentificat sau nevalid.");
      }

      // Update phone if changed
      if (contactPhone && contactPhone !== (user?.phoneNumber || "")) {
        await updateUser(selectedUser.id, { phoneNumber: contactPhone });
      }

      const isAdmin = user?.role === "admin";

      const payload = {
        ...cleanFormData,
        ...(formData.apartmentTypeOther ? { apartmentTypeOther: formData.apartmentTypeOther } : {}),
        phoneContact: contactPhone,
        transactionType: serviceTypes[0], // default for residential ensembles
        announcementType: formData.announcementType.toLowerCase(),
        providerType: "ensemble",
        rooms: 0,
        surface: 0,
        price: 0,
        status: isAdmin ? "active" : "pending",
        user: { id: selectedUser.id, firebaseId: selectedUser.firebaseId ?? "" },

        // Defaults for shared fields in unified backend model
        streetFront: false,
        heightRegime: [] as string[],
        urbanismDocuments: [] as string[],
        utilities: { curent: null, apa: null, canalizare: null, gaz: null },
        commercialSpaceType: "",
        usableSurface: 0,
        builtSurface: Number(formData.builtSurface) || 0,
        spaceHeight: 0,
        hasStreetWindow: false,
        streetWindowLength: 0,
        hasStreetEntrance: false,
        hasLift: false,
        vehicleAccess: [] as string[],

        neighborhood: formData.neighborhood,
        constructionStart: formData.constructionStart,
        floorsCount: Number(formData.floorsCount) || 0,
        landSurface: Number(formData.landSurface) || 0,
        amenities: formData.amenities
          ? formData.amenities.split(",").map((a) => a.trim()).filter((a) => a)
          : [],
        developerSite: formData.developerSite ? formData.developerSite : null,
        frameType: formData.frameType,
        flyerUrl: formData.flyerUrl || "",
        flyerMimeType: formData.flyerMimeType || "",
      };

      const newAnnouncement = await createAnnouncement(payload);
      localStorage.setItem("announcementRealId", newAnnouncement.id);

      await uploadMedia(newAnnouncement.id);

      await new Promise((resolve) => setTimeout(resolve, 1000)); // small flush delay

      if (isAdmin) {
        // Record a free payment for admin-created ensemble
        await createPaymentSession({
          orderId: newAnnouncement.id,
          packageId: pricingStore.freePlanId ?? "",
          amount: 0,
          originalAmount: 0,
          currency: "RON",
          invoiceDetails: {
            name: "",
            address: "",
            city: "",
            country: "",
            email: "",
            isTaxPayer: false,
          },
          products: [],
        });

        const frontendUrl = process.env.NEXT_PUBLIC_FRONTEND_URL!;
        const announcementUrl = `${frontendUrl}/announcements/${newAnnouncement.id}`;
        await sendAnnouncementCreationMail(
          selectedUser.firstName ?? "",
          selectedUser.email ?? "",
          announcementUrl
        );

        // Redirect to success status page (admin)
        window.location.href = `/payment-status?orderId=${newAnnouncement.id}&success=true`;
      } else {
        // Normal user -> go to payment packages flow
        window.location.href = `/payment-packages?announcementId=${newAnnouncement.id}&providerType=ensemble`;
      }
    } catch (err: any) {
      console.error("Eroare la crearea anunțului:", err);
      setError("A apărut o problemă. Încearcă din nou.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Styled.Container>
      {loading ? (
        <>
          <CircularProgress />
          {imageUploadProgress.total > 0 || videoUploadProgress.total > 0 ? (
            <>
              <Typography mt={2}>
                Se încarcă imaginile: {imageUploadProgress.uploaded}/{imageUploadProgress.total}
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
                Se încarcă videoclipurile: {videoUploadProgress.uploaded}/{videoUploadProgress.total}
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
                  Finalizăm încărcările, te rugăm să aștepți...
                </Typography>
              )}
            </>
          ) : (
            <Typography mt={2}>Se creează anunțul tău...</Typography>
          )}
        </>
      ) : (
        <>
          <Styled.Subtitle>Publică un ansamblu rezidențial</Styled.Subtitle>
          {error && <Typography color="error" mb={2}>{error}</Typography>}

          {/* Admin: assign to user */}
          {user?.role === "admin" && (
            <FormControl fullWidth sx={{ mb: 2 }}>
              <InputLabel id="user-select-label">Atribuie unui utilizator</InputLabel>
              <Select
                labelId="user-select-label"
                name="userId"
                value={formData.userId}
                label="Atribuie unui utilizator"
                onChange={(e) => setFormData((prev) => ({ ...prev, userId: e.target.value as string }))}
              >
                {users.map((u) => (
                  <MenuItem key={u.id} value={u.id}>
                    {u.firstName} {u.lastName} ({u.email})
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          )}

          <Styled.FormBox>
            <RadioButtonsGroup
              options={propertyTypesResidential}
              value={formData.announcementType}
              id="announcementType"
              onChange={handleInputChange}
              label="Tipul proprietății"
              error={formErrors.announcementType}
            />

            <TextField
              label="Telefon de contact"
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
                setFormErrors((prev) => ({
                  ...prev,
                  contactPhone: typeof phoneError === "string" ? phoneError : undefined,
                }));
              }}
              required
              error={isSubmitted && !contactPhone}
              helperText={isSubmitted && !contactPhone ? "Acest câmp este obligatoriu" : ""}
              fullWidth
            />

            <AutocompleteCounties
              label="Județ *"
              customWidth="100%"
              value={formData.county}
              onChange={(event, value) => {
                setFormData((prev) => ({
                  ...prev,
                  county: value || "",
                }));
              }}
              error={isSubmitted && !formData.county}
              helperText={isSubmitted && !formData.county ? "Acest câmp este obligatoriu" : ""}
            />

            <AutocompleteCities
              onChange={(event, value) => setFormData((prev) => ({ ...prev, city: value || "" }))}
              label="Localitate (oraș/comună) *"
              customWidth="100%"
              error={isSubmitted && !formData.city}
              helperText={isSubmitted && !formData.city ? "Acest câmp este obligatoriu" : ""}
              value={formData.city}
            />

            <TextField
              label="Stradă"
              name="street"
              value={formData.street}
              onChange={handleInputChange}
              required
              error={!!formErrors.street}
              helperText={formErrors.street}
              fullWidth
            />

            <Tooltip title="Scrie un titlu atractiv și clar">
              <TextField
                label="Titlul anunțului"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                required
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
              required
              error={!!formErrors.description}
              helperText={formErrors.description}
              fullWidth
              multiline
              rows={4}
            />

            <Typography variant="h6" mt={2}>
              Detalii ansamblu
            </Typography>

            <TextField
              label="Cartier / zonă"
              name="neighborhood"
              value={formData.neighborhood}
              onChange={handleInputChange}
              fullWidth
            />

            <PrimaryDatePicker
              name="constructionStart"
              label="Începerea construcției"
              value={formData.constructionStart}
              error={(formErrors.constructionStart as unknown as string) || ""}
              handleChange={handleConstructionStartChange}
              monthYearOnly
            />

            <TextField
              label="Nr. de etaje"
              name="floorsCount"
              value={formData.floorsCount}
              onChange={handleInputChange}
              inputProps={{ inputMode: "numeric", pattern: "[0-9]*" }}
              fullWidth
            />

            <Box display="grid" gridTemplateColumns="1fr 1fr" gap={2} width="100%">
              <TextField
                label="Suprafață construită (m²)"
                name="builtSurface"
                value={formData.builtSurface}
                onChange={handleInputChange}
                inputProps={{ inputMode: "numeric", pattern: "[0-9]*" }}
                fullWidth
              />
              <TextField
                label="Suprafață teren (m²)"
                name="landSurface"
                value={formData.landSurface}
                onChange={handleInputChange}
                inputProps={{ inputMode: "numeric", pattern: "[0-9]*" }}
                fullWidth
              />
            </Box>

            <TextField
              label="Facilități (separate prin virgulă)"
              name="amenities"
              value={formData.amenities}
              onChange={handleInputChange}
              fullWidth
              multiline
              rows={3}
            />

            <TextField
              label="Site dezvoltator"
              name="developerSite"
              value={formData.developerSite || ""}
              onChange={handleInputChange}
              placeholder="https://..."
              fullWidth
            />

            {formData.announcementType?.toLowerCase() === "apartament" && (
              <TextField
                label="Tipuri de apartamente (ex: garsonieră, o cameră, două camere, etc.)"
                name="apartmentTypeOther"
                value={formData.apartmentTypeOther}
                onChange={handleInputChange}
                error={!!formErrors.apartmentTypeOther}
                helperText={formErrors.apartmentTypeOther}
                fullWidth
                multiline
                rows={4}
              />
            )}

            <TextField
              label="Stadiu construcție"
              name="stage"
              value={formData.stage}
              onChange={handleInputChange}
              required
              error={!!formErrors.stage}
              helperText={formErrors.stage}
              fullWidth
            />

            <PrimaryDatePicker
              name="endDate"
              label="Data finalizării"
              value={formData.endDate}
              error={formErrors.endDate || ""}
              handleChange={handleDateChange}
              monthYearOnly
            />

            <Box width="100%" display="flex" justifyContent="center" mt={2}>
              <FlyerUploader
                file={formData.flyer}
                setFile={(f) => setFormData((p) => ({ ...p, flyer: f }))}
                url={formData.flyerUrl}
                mimeType={formData.flyerMimeType}
                error={flyerError || undefined}
                setError={setFlyerError}
                onPreviewClickRemove={handleRemoveFlyer}
              />
            </Box>

            <MediaUploader
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
