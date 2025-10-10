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
import React, { ChangeEvent, useEffect, useMemo, useState } from "react";
import { propertyTypesResidential, serviceTypes } from "@/constants/annountementConstants";
import { useParams, usePathname } from "next/navigation";

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

/* ---------- helpers ---------- */
const reorder = <T,>(list: T[], startIndex: number, endIndex: number): T[] => {
  const result = list.slice();
  const [removed] = result.splice(startIndex, 1);
  result.splice(endIndex, 0, removed);
  return result;
};

const fileFromUrl = async (url: string, namePrefix: string) => {
  const res = await fetch(url);
  const blob = await res.blob();
  const extFromType = (blob.type.split("/")[1] || "").split(";")[0];
  const extFromUrl = (url.split(".").pop() || "").split("?")[0];
  const ext = extFromType || extFromUrl || "bin";
  return new File([blob], `${namePrefix}-${Date.now()}.${ext}`, {
    type: blob.type || "application/octet-stream",
  });
};

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
  PreviewContainer: styled.div`
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
    margin-top: 8px;
    max-height: 400px;
    overflow-y: auto;
    width: 100%;
  `,
  PreviewItem: styled.div`
    position: relative;
    display: inline-flex;
    flex-direction: column;
    align-items: center;
  `,
  Controls: styled.div`
    position: absolute;
    bottom: 6px;
    left: 6px;
    display: flex;
    gap: 6px;
    background: rgba(255, 255, 255, 0.9);
    border: 1px solid #ddd;
    border-radius: 6px;
    padding: 2px 6px;

    button {
      border: none;
      background: transparent;
      cursor: pointer;
      font-size: 14px;
      line-height: 1;
      padding: 2px 4px;
    }
  `,
  PreviewImage: styled.img`
    width: 100%;
    max-width: 120px;
    height: auto;
    object-fit: cover;
    border-radius: 8px;
    border: 1px solid #ccc;
    cursor: pointer;
    &:hover { opacity: 0.7; }
  `,
  PreviewVideo: styled.video`
    width: 100%;
    max-width: 180px;
    height: auto;
    object-fit: cover;
    border-radius: 8px;
    border: 1px solid #ccc;
    cursor: pointer;
    &:hover { opacity: 0.7; }
  `,
};

const TEXTAREA_AUTOSIZE_SX = {
  "& .MuiInputBase-inputMultiline": {
    resize: "vertical",
    overflow: "auto",
  },
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
  neighborhood: "",
  constructionStart: "",
  floorsCount: "",
  builtSurface: "",
  landSurface: "",
  amenities: "",
  developerSite: "",
  frameType: "",
  flyer: null as File | null,
  flyerUrl: "",
  flyerMimeType: "",
  userId: "",
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
    getAnnouncementById,
    deleteAnnouncement,
    currentAnnouncement,
  } = announcementStore;

  const role = user?.role ?? "";
  const canPublishImmediately = role === "admin" || role === "editor";

  const [formData, setFormData] = useState(INITIAL_DATA);
  const [flyerError, setFlyerError] = useState<string | null>(null);
  const [formErrors, setFormErrors] = useState<typeof INITIAL_DATA & { contactPhone?: string; contactName?: string }>({
    ...INITIAL_DATA,
  });
  const [loading, setLoading] = useState(false);
  const [contactName, setContactName] = useState<string>("");
  const [contactPhone, setContactPhone] = useState<string>("");
  const [error, setError] = useState<string | null>(null);
  const [imageUploadProgress, setImageUploadProgress] = useState({ uploaded: 0, total: 0 });
  const [videoUploadProgress, setVideoUploadProgress] = useState({ uploaded: 0, total: 0 });
  const [isSubmitted, setIsSubmitted] = useState(false);

  const [dragImageIndex, setDragImageIndex] = useState<number | null>(null);
  const [dragVideoIndex, setDragVideoIndex] = useState<number | null>(null);

  const pathname = usePathname();
  const params = useParams();
  const isEdit = !!params?.id && pathname.includes("/edit-announcement");

  /* ---------- init ---------- */
  useEffect(() => { setFormData((prev) => ({ ...prev, announcementType: "Apartament" })); }, []);
  useEffect(() => { if (!user?.id) getCurrentUser(); }, [user?.id, getCurrentUser]);
  useEffect(() => {
    if (user?.id) pricingStore.getAnnouncementPackages(user.id);
    if (user?.role === "admin") fetchAllUsers();
  }, [user?.id, user?.role, fetchAllUsers, pricingStore]);

  /* ---------- load edit data ---------- */
  useEffect(() => {
    const id = Array.isArray(params?.id) ? params?.id[0] : (params?.id as string | undefined);
    if (isEdit && id) getAnnouncementById(id);
  }, [isEdit, params?.id, getAnnouncementById]);

  useEffect(() => {
    (async () => {
      if (!isEdit || !currentAnnouncement) return;

      // Base fields
      const ca = currentAnnouncement as any;
      const amenitiesStr = Array.isArray(ca.amenities) ? ca.amenities.join(", ") : (ca.amenities || "");

      // Convert media URLs -> Files so UI + upload stays unified
      const imageUrls: string[] = (ca.images || []).map((i: any) => i.original).filter(Boolean);
      const videoUrls: string[] = (ca.videos || []).map((v: any) => v.original).filter(Boolean);
      const logoUrl: string | undefined = ca.logoUrl || (ca.logo?.original ?? "");
      const flyerUrl: string | undefined = ca.flyerUrl || "";
      const flyerMime: string | undefined = ca.flyerMimeType || "";

      let images: File[] = [];
      let videos: File[] = [];
      let logo: File | null = null;
      let flyer: File | null = null;

      try {
        images = await Promise.all(imageUrls.map((u, idx) => fileFromUrl(u, `image-${idx + 1}`)));
      } catch (e) { console.warn("Failed to import images from URLs", e); }

      try {
        videos = await Promise.all(videoUrls.map((u, idx) => fileFromUrl(u, `video-${idx + 1}`)));
      } catch (e) { console.warn("Failed to import videos from URLs", e); }

      try {
        if (logoUrl) logo = await fileFromUrl(logoUrl, "logo");
      } catch (e) { console.warn("Failed to import logo from URL", e); }

      try {
        if (flyerUrl) flyer = await fileFromUrl(flyerUrl, "flyer");
      } catch (e) { console.warn("Failed to import flyer from URL", e); }

      setFormData((prev) => ({
        ...prev,
        providerType: "ensemble",
        announcementType: (ca.announcementType || "apartament").charAt(0).toUpperCase() + (ca.announcementType || "apartament").slice(1),
        title: ca.title || "",
        city: ca.city || "",
        county: ca.county || "",
        street: ca.street || "",
        description: ca.description || "",
        stage: ca.stage || "",
        endDate: ca.endDate || "",
        logo,
        images,
        videos,
        apartmentTypeOther: ca.apartmentTypeOther || "",
        neighborhood: ca.neighborhood || "",
        constructionStart: ca.constructionStart || "",
        floorsCount: ca.floorsCount?.toString?.() || "",
        builtSurface: ca.builtSurface?.toString?.() || "",
        landSurface: ca.landSurface?.toString?.() || "",
        amenities: amenitiesStr,
        developerSite: ca.developerSite || "",
        frameType: ca.frameType || "",
        flyer,
        flyerUrl: flyerUrl || "",
        flyerMimeType: flyerMime || "",
        userId: ca.user?.id || "",
      }));

      setContactPhone(ca.phoneContact || "");
      setContactName(ca.phoneContactName || "");   // ✅ NEW
    })();
  }, [isEdit, currentAnnouncement, user?.phoneNumber]);

  /* ---------- handlers ---------- */
  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    const fieldError = generalValidation(residentialAnnouncementValidationSchema, { ...formData, [name]: value }, name);
    setFormErrors((prev) => ({ ...prev, [name]: fieldError }));
  };

  const handleRemoveFlyer = () => {
    setFormData((prev) => ({ ...prev, flyer: null, flyerUrl: "", flyerMimeType: "" }));
    setFlyerError(null);
  };

  const handleDateChange = (date: Date | null) => {
    const isoDate = date ? date.toISOString() : "";
    setFormData((prev) => ({ ...prev, endDate: isoDate }));
    const error = generalValidation(residentialAnnouncementValidationSchema, { ...formData, endDate: isoDate }, "endDate");
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

  /* ---------- upload ---------- */
  const uploadMedia = async (announcementId: string) => {
    const totalImages = formData.images.length + (formData.logo ? 1 : 0);
    const totalVideos = formData.videos.length;
    setImageUploadProgress({ uploaded: 0, total: totalImages });
    setVideoUploadProgress({ uploaded: 0, total: totalVideos });

    const incImg = () => setImageUploadProgress((p) => ({ ...p, uploaded: p.uploaded + 1 }));
    const incVid = () => setVideoUploadProgress((p) => ({ ...p, uploaded: p.uploaded + 1 }));

    // Thumbnail = first image
    if (formData.images.length > 0) {
      const fd = new FormData();
      fd.append("file", formData.images[0]);
      fd.append("type", "image");
      const resp = await createImageOrVideo(fd, announcementId);
      if (resp?.optimized_url) await updateAnnouncement(announcementId, { imageUrl: resp.optimized_url });
      incImg();
    }

    // Rest of images
    for (const img of formData.images.slice(1)) {
      const fd = new FormData();
      fd.append("file", img);
      fd.append("type", "image");
      await createImageOrVideo(fd, announcementId);
      incImg();
    }

    // Logo (file or import from existing URL if needed — already converted in edit loader)
    if (formData.logo) {
      const fd = new FormData();
      fd.append("file", formData.logo);
      fd.append("type", "image");
      const resp = await createImageOrVideo(fd, announcementId);
      if (resp?.optimized_url) await updateAnnouncement(announcementId, { logoUrl: resp.optimized_url });
      incImg();
    }

    // Videos
    for (const vid of formData.videos) {
      const fd = new FormData();
      fd.append("file", vid);
      fd.append("type", "video");
      await createImageOrVideo(fd, announcementId);
      incVid();
    }

    // Flyer (file or existing URL converted in edit loader)
    if (formData.flyer) {
      const fd = new FormData();
      fd.append("file", formData.flyer);
      fd.append("type", "flyer");
      const resp = await createImageOrVideo(fd, announcementId);
      const url = resp?.optimized_url || resp?.url || "";
      const mime = resp?.mimeType || formData.flyer.type;
      if (url) await updateAnnouncement(announcementId, { flyerUrl: url, flyerMimeType: mime });
    }

    await new Promise((r) => setTimeout(r, 300));
  };

  /* ---------- submit (create or edit-as-recreate) ---------- */
  const handleSubmit = async () => {
    setIsSubmitted(true);
    if (!contactPhone || !contactPhone || !formData.county || !formData.city || !formData.announcementType || !formData.title) {
      setError("Te rugăm să completezi toate câmpurile obligatorii.");
      if (!contactName) setFormErrors((p) => ({ ...p, contactName: "Acest câmp este obligatoriu" }));
      if (!contactPhone) setFormErrors((p) => ({ ...p, contactPhone: "Acest câmp este obligatoriu" }));
      return;
    }

    const { logo, images, videos, flyer, userId: assignedUserId, ...cleanFormData } = formData;
    const errors = generalValidation(residentialAnnouncementValidationSchema, { ...cleanFormData, contactPhone });
    if (errors && typeof errors === "object") {
      setFormErrors(errors as typeof INITIAL_DATA & { contactPhone?: string });
      setError("Te rugăm să corectezi câmpurile evidențiate.");
      return;
    }

    try {
      setLoading(true);
      setError(null);

      let selectedUser = user;
      if (user?.role === "admin") selectedUser = users.find((u) => u.id === formData.userId) || user;
      if (!selectedUser?.id) throw new Error("Utilizator neautentificat sau nevalid.");

      const basePayload: any = {
        ...cleanFormData,
        ...(formData.apartmentTypeOther ? { apartmentTypeOther: formData.apartmentTypeOther } : {}),
        phoneContact: contactPhone,
        phoneContactName: contactName,
        transactionType: serviceTypes[0],
        announcementType: formData.announcementType.toLowerCase(),
        providerType: "ensemble",
        rooms: 0,
        surface: 0,
        price: 0,
        status: "active", // active for recreate
        user: { id: selectedUser.id, firebaseId: selectedUser.firebaseId ?? "" },
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
        amenities: formData.amenities ? formData.amenities.split(",").map((a) => a.trim()).filter(Boolean) : [],
        developerSite: null,
        frameType: formData.frameType,
        flyerUrl: formData.flyerUrl || "",
        flyerMimeType: formData.flyerMimeType || "",
      };

      if (isEdit && currentAnnouncement?.id) {
        // EDIT MODE: recreate
        const oldId = currentAnnouncement.id;

        const newAnnouncement = await createAnnouncement(basePayload);
        await uploadMedia(newAnnouncement.id);

        // Optional bookkeeping for admin/editor
        try {
          if (canPublishImmediately && pricingStore.freePlanId) {
            await createPaymentSession({
              orderId: newAnnouncement.id,
              packageId: pricingStore.freePlanId,
              amount: 0,
              originalAmount: 0,
              currency: "RON",
              invoiceDetails: { name: "", address: "", city: "", country: "", email: "", isTaxPayer: false },
              products: [],
            });
          }
        } catch (e) {
          console.warn("Free session not recorded:", e);
        }

        try {
          await deleteAnnouncement(oldId);
        } catch (e) {
          console.warn("Failed to delete old announcement", e);
        }

        window.location.href = `/announcements/${newAnnouncement.id}`;
        return;
      }

      // CREATE MODE (unchanged)
      const newAnnouncement = await createAnnouncement({
        ...basePayload,
        status: canPublishImmediately ? "active" : "pending",
      });

      localStorage.setItem("announcementRealId", newAnnouncement.id);

      await uploadMedia(newAnnouncement.id);
      await new Promise((r) => setTimeout(r, 300));

      if (canPublishImmediately) {
        try {
          if (pricingStore.freePlanId) {
            await createPaymentSession({
              orderId: newAnnouncement.id,
              packageId: pricingStore.freePlanId ?? "",
              amount: 0,
              originalAmount: 0,
              currency: "RON",
              invoiceDetails: { name: "", address: "", city: "", country: "", email: "", isTaxPayer: false },
              products: [],
            });
          }
        } catch (e) {
          console.warn("Free session not recorded:", e);
        }

        const frontendUrl = process.env.NEXT_PUBLIC_FRONTEND_URL!;
        const announcementUrl = `${frontendUrl}/announcements/${newAnnouncement.id}`;
        await sendAnnouncementCreationMail(selectedUser.firstName ?? "", selectedUser.email ?? "", announcementUrl);
        window.location.href = `/payment-status?orderId=${newAnnouncement.id}&success=true`;
      } else {
        window.location.href = `/payment-packages?announcementId=${newAnnouncement.id}&providerType=ensemble`;
      }
    } catch (err) {
      console.error("Eroare la salvarea anunțului:", err);
      setError("A apărut o problemă. Încearcă din nou.");
    } finally {
      setLoading(false);
    }
  };

  /* ---------- DnD handlers ---------- */
  const onImageDragStart = (index: number) => setDragImageIndex(index);
  const onImageDragOver = (e: React.DragEvent) => e.preventDefault();
  const onImageDrop = (index: number) => {
    if (dragImageIndex === null) return;
    setFormData((prev) => ({ ...prev, images: reorder(prev.images, dragImageIndex, index) }));
    setDragImageIndex(null);
  };
  const moveImageLeft = (index: number) => {
    if (index <= 0) return;
    setFormData((prev) => ({ ...prev, images: reorder(prev.images, index, index - 1) }));
  };
  const moveImageRight = (index: number) => {
    if (index >= formData.images.length - 1) return;
    setFormData((prev) => ({ ...prev, images: reorder(prev.images, index, index + 1) }));
  };

  const onVideoDragStart = (index: number) => setDragVideoIndex(index);
  const onVideoDragOver = (e: React.DragEvent) => e.preventDefault();
  const onVideoDrop = (index: number) => {
    if (dragVideoIndex === null) return;
    setFormData((prev) => ({ ...prev, videos: reorder(prev.videos, dragVideoIndex, index) }));
    setDragVideoIndex(null);
  };
  const moveVideoLeft = (index: number) => {
    if (index <= 0) return;
    setFormData((prev) => ({ ...prev, videos: reorder(prev.videos, index, index - 1) }));
  };
  const moveVideoRight = (index: number) => {
    if (index >= formData.videos.length - 1) return;
    setFormData((prev) => ({ ...prev, videos: reorder(prev.videos, index, index + 1) }));
  };

  /* ---------- object URLs ---------- */
  const imagePreviews = useMemo(() => formData.images.map((f) => URL.createObjectURL(f)), [formData.images]);
  const videoPreviews = useMemo(() => formData.videos.map((f) => URL.createObjectURL(f)), [formData.videos]);
  useEffect(() => {
    return () => {
      imagePreviews.forEach((u) => URL.revokeObjectURL(u));
      videoPreviews.forEach((u) => URL.revokeObjectURL(u));
    };
  }, [imagePreviews, videoPreviews]);

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
            <Typography mt={2}>{isEdit ? "Se actualizează anunțul..." : "Se creează anunțul tău..."}</Typography>
          )}
        </>
      ) : (
        <>
          <Styled.Subtitle>{isEdit ? "Editează ansamblul rezidențial" : "Publică un ansamblu rezidențial"}</Styled.Subtitle>
          {error && <Typography color="error" mb={2}>{error}</Typography>}

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
              label="Nume persoană contact"
              name="contactName"
              value={contactName}
              onChange={(e) => {
                const v = e.target.value;
                setContactName(v);
                // optional single-field validation hook
                setFormErrors((prev) => ({ ...prev, contactName: v ? "" : "Acest câmp este obligatoriu" }));
              }}
              required
              error={!!formErrors.contactName || (isSubmitted && !contactName)}
              helperText={formErrors.contactName || (isSubmitted && !contactName ? "Acest câmp este obligatoriu" : "")}
              fullWidth
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
                setFormErrors((prev) => ({ ...prev, contactPhone: typeof phoneError === "string" ? phoneError : "" }));
              }}
              required
              error={!!formErrors.contactPhone || (isSubmitted && !contactPhone)}
              helperText={formErrors.contactPhone || (isSubmitted && !contactPhone ? "Acest câmp este obligatoriu" : "")}
              fullWidth
            />

            <AutocompleteCounties
              label="Județ *"
              customWidth="100%"
              value={formData.county}
              onChange={(event, value) => setFormData((prev) => ({ ...prev, county: value || "" }))}
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
              minRows={4}
              maxRows={20}
              sx={TEXTAREA_AUTOSIZE_SX}
            />

            <Typography variant="h6" mt={2}>Detalii ansamblu</Typography>

            <TextField label="Cartier / zonă" name="neighborhood" value={formData.neighborhood} onChange={handleInputChange} fullWidth />

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
              minRows={3}
              maxRows={12}
              sx={TEXTAREA_AUTOSIZE_SX}
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
                minRows={4}
                maxRows={16}
                sx={TEXTAREA_AUTOSIZE_SX}
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

            {/* Flyer */}
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

            {/* MediaUploader with slots; previews below */}
            <MediaUploader
              showPreview={false}
              logo={formData.logo}
              setLogo={(file) => setFormData((prev) => ({ ...prev, logo: file }))}
              images={formData.images}
              setImages={(files) => setFormData((prev) => ({ ...prev, images: files }))}
              videos={formData.videos}
              setVideos={(files) => setFormData((prev) => ({ ...prev, videos: files }))}
              error={error || ""}
              setError={setError}
              imagesSlot={
                formData.images.length > 0 ? (
                  <Styled.PreviewContainer>
                    {imagePreviews.map((src, index) => (
                      <Styled.PreviewItem
                        key={index}
                        draggable
                        onDragStart={() => onImageDragStart(index)}
                        onDragOver={onImageDragOver}
                        onDrop={() => onImageDrop(index)}
                        title="Trage pentru a rearanja. Click pentru a elimina."
                      >
                        <Styled.PreviewImage
                          src={src}
                          alt={`img-${index}`}
                          onClick={() =>
                            setFormData((prev) => ({
                              ...prev,
                              images: prev.images.filter((_, i) => i !== index),
                            }))
                          }
                        />
                        <Styled.Controls>
                          {formData.images.length > 1 && (
                            <>
                              <button aria-label="Mută la stânga" onClick={(e) => { e.stopPropagation(); moveImageLeft(index); }}>◀︎</button>
                              <button aria-label="Mută la dreapta" onClick={(e) => { e.stopPropagation(); moveImageRight(index); }}>▶︎</button>
                            </>
                          )}
                          <span style={{ fontSize: 12, opacity: 0.8 }}>#{index + 1}</span>
                        </Styled.Controls>
                      </Styled.PreviewItem>
                    ))}
                  </Styled.PreviewContainer>
                ) : null
              }
              videosSlot={
                formData.videos.length > 0 ? (
                  <Styled.PreviewContainer>
                    {videoPreviews.map((src, index) => (
                      <Styled.PreviewItem
                        key={index}
                        draggable
                        onDragStart={() => onVideoDragStart(index)}
                        onDragOver={onVideoDragOver}
                        onDrop={() => onVideoDrop(index)}
                        title="Trage pentru a rearanja. Click pentru a elimina."
                      >
                        <Styled.PreviewVideo
                          src={src}
                          controls
                          onClick={() =>
                            setFormData((prev) => ({
                              ...prev,
                              videos: prev.videos.filter((_, i) => i !== index),
                            }))
                          }
                        />
                        <Styled.Controls>
                          {formData.videos.length > 1 && (
                            <>
                              <button aria-label="Mută la stânga" onClick={(e) => { e.stopPropagation(); moveVideoLeft(index); }}>◀︎</button>
                              <button aria-label="Mută la dreapta" onClick={(e) => { e.stopPropagation(); moveVideoRight(index); }}>▶︎</button>
                            </>
                          )}
                          <span style={{ fontSize: 12, opacity: 0.8 }}>#{index + 1}</span>
                        </Styled.Controls>
                      </Styled.PreviewItem>
                    ))}
                  </Styled.PreviewContainer>
                ) : null
              }
            />
          </Styled.FormBox>

          <Box mt={4}>
            <PrimaryButton text={isEdit ? "Actualizează anunțul" : "Creează anunțul"} onClick={handleSubmit} />
          </Box>
        </>
      )}
    </Styled.Container>
  );
};

export default observer(ResidentialAnnouncementForm);
