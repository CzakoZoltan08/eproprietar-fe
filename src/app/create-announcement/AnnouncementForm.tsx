"use client";

import { Box, CircularProgress, FormControl, InputLabel, LinearProgress, MenuItem, Modal, Select, SelectChangeEvent, Tab, Tabs, Typography } from "@mui/material";
import React, { ChangeEvent, Suspense, useEffect, useRef, useState } from "react";
import {
  apartamentPartitionings,
  apartmentFloors,
  balconyTypes,
  comfortLevels,
  parkingTypes,
  propertyTypes,
  roomOptions,
  serviceTypes,
} from "@/constants/annountementConstants";
import { useParams, usePathname, useSearchParams } from "next/navigation";

import AutocompleteCities from "@/common/autocomplete/AutocompleteCities";
import AutocompleteCounties from "@/common/autocomplete/AutocompleteCounties";
import FormHelpTooltip from "./FormHelpTooltip";
import PhoneInputField from "@/common/input/PhoneInputField";
import { PrimaryButton } from "@/common/button/PrimaryButton";
import { PropertyAnnouncementModel } from "@/models/announcementModels";
import { ProviderType } from "@/constants/provider-types.enum";
import RadioButtonsGroup from "@/common/radio/RadioGroup";
import SelectDropdown from "@/common/dropdown/SelectDropdown";
import TextField from "@mui/material/TextField";
import UploadInfoBox from "./UploadInfoBox";
import { observer } from "mobx-react";
import { reaction } from "mobx";
import sketch1 from "../../assets/sketches/1 camera varianta 2.svg";
import sketch10 from "../../assets/sketches/garsoniera.svg";
import sketch11 from "../../assets/sketches/2.1camere.svg";
import sketch12 from "../../assets/sketches/2.2 cam.svg";
import sketch13 from "../../assets/sketches/2.4 cam.svg";
import sketch14 from "../../assets/sketches/2.5 cam.svg";
import sketch15 from "../../assets/sketches/2.6cam.svg";
import sketch16 from "../../assets/sketches/2.7 cam.svg";
import sketch17 from "../../assets/sketches/2.8cam.svg";
import sketch18 from "../../assets/sketches/2.9cam.svg";
import sketch19 from "../../assets/sketches/2camere.svg";
import sketch2 from "../../assets/sketches/1 camera varianta 3.svg";
import sketch20 from "../../assets/sketches/garsoniera 1.svg";
import sketch21 from "../../assets/sketches/3.1cam.svg";
import sketch22 from "../../assets/sketches/3.2cam.svg";
import sketch23 from "../../assets/sketches/3.3cam.svg";
import sketch24 from "../../assets/sketches/3.4CAM.svg";
import sketch25 from "../../assets/sketches/3.5CAM.svg";
import sketch26 from "../../assets/sketches/3.6CAM.svg";
import sketch27 from "../../assets/sketches/3.7CAM.svg";
import sketch28 from "../../assets/sketches/3.8CAM.svg";
import sketch29 from "../../assets/sketches/4.1CAM.svg";
import sketch3 from "../../assets/sketches/1 camera.svg";
import sketch30 from "../../assets/sketches/4.2CAM.svg";
import sketch31 from "../../assets/sketches/4cam.svg";
import sketch4 from "../../assets/sketches/1.1cam.svg";
import sketch5 from "../../assets/sketches/1.2cam.svg";
import sketch6 from "../../assets/sketches/1.3cam.svg";
import sketch7 from "../../assets/sketches/1.4cam.svg";
import sketch8 from "../../assets/sketches/1cam.svg";
import sketch9 from "../../assets/sketches/garsoniera 1.svg";
import styled from "styled-components";
import { useStore } from "@/hooks/useStore";

const PREDEFINED_SKETCHES = [
  sketch1,
  sketch2,
  sketch3,
  sketch4,
  sketch5,
  sketch6,
  sketch7,
  sketch8,
  sketch9,
  sketch10,
  sketch11,
  sketch12,
  sketch13,
  sketch14,
  sketch15,
  sketch16,
  sketch17,
  sketch18,
  sketch19, 
  sketch20,
  sketch21,
  sketch22,
  sketch23,
  sketch24,
  sketch25,
  sketch26,
  sketch27,
  sketch28,
  sketch29,
  sketch30,
  sketch31];

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  border-radius: 8px;
  border: 1px solid #e0e0e0;
  color: #000;
  background: #fff;
  padding: 16px;
  gap: 16px;
  max-width: 800px; /* Prevent excessive width on large screens */
  margin: auto;
  overflow-x: hidden; /* Prevent horizontal scrolling */
  
  @media (max-width: 768px) {
    max-width: 100%; /* Ensure it fits within mobile screens */
    padding: 12px;
  }
`;

const SubtitleAdvice = styled.h2`
  font-weight: 300;
  font-size: 20px;
  margin-bottom: 50px;
`;

const InputContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  gap: 16px;

  @media (min-width: 768px) {
    width: 80%; /* Make it slightly narrower on bigger screens */
  }
`;

const RadioGroupContainer = styled.div`
  width: 100%; /* Full width of the parent container */
  display: flex;
  flex-direction: column;
  align-items: flex-start; /* Align the content to the left */
  gap: 16px;
  margin-bottom: 16px;
`;

const DropArea = styled.div<{ $isDragging: boolean; $hasError?: boolean }>`
  border: 2px dashed
    ${({ $isDragging, $hasError }) =>
      $hasError ? "#f44336" : $isDragging ? "#007BFF" : "#ccc"};
  background-color: ${({ $isDragging }) =>
    $isDragging ? "#f0f8ff" : "transparent"};
  padding: 20px;
  text-align: center;
  width: 85%;
  cursor: pointer;
  margin-top: 16px;
  transition: background-color 0.3s, border-color 0.3s;

  @media (max-width: 768px) {
    padding: 12px;
  }
`;

const PreviewContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-top: 16px;
  max-height: 400px;
  overflow-y: auto;
`;

const PreviewImage = styled.img`
  width: 100%;
  max-width: 120px;
  height: auto;
  object-fit: cover;
  border-radius: 8px;
  border: 1px solid #ccc;
  cursor: pointer;
  &:hover {
    opacity: 0.7;
  }
`;

const PreviewFile = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 8px;
  border: 1px solid #ccc;
  border-radius: 8px;
  cursor: pointer;
  max-width: 140px;
  text-align: center;
  &:hover {
    opacity: 0.7;
  }
`;

const ModalContent = styled(Box)`
  background: white;
  padding: 20px;
  max-width: 600px;
  width: 100%;
  margin: 10vh auto;
  border-radius: 8px;
  outline: none;
  max-height: 80vh;
  overflow-y: auto;
`;

const PreviewVideo = styled.video`
  width: 100%;
  max-width: 180px;
  height: auto;
  object-fit: cover;
  border-radius: 8px;
  border: 1px solid #ccc;
  cursor: pointer;
  &:hover {
    opacity: 0.7;
  }
`;

const ThumbnailContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
`;

const ThumbnailPreviewWrapper = styled.div`
  width: 150px; /* Thumbnail size */
  height: 150px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 8px;
  border: 2px dashed #ccc;
  background-color: #f8f8f8;
  overflow: hidden; /* Ensures no overflow */
  cursor: pointer;
`;

const ThumbnailPreviewImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover; /* Ensures it stays square and centered */
`;

const StyledTextField = styled(TextField)`
  width: 100%; /* Take the full width of InputContainer */
`;

const MAX_VIDEOS = 1;
const MAX_VIDEO_SIZE = 100 * 1024 * 1024; // 150MB

const MAX_IMAGES = 15;
const MAX_IMAGE_SIZE = 10 * 1024 * 1024; // 10MB
const ALLOWED_IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp"];

const AnnouncementFormContent = ({ item }: { item: ProviderType }) => {
  const {
    userStore,
    announcementStore,
    pricingStore
  } = useStore();

  const sketchFileInputRef = useRef<HTMLInputElement>(null);
  const [sketchPreview, setSketchPreview] = useState<string | null>(null);

  const [openModal, setOpenModal] = useState(false);
  const [tabIndex, setTabIndex] = useState(0);

  const [formData, setFormData] = useState({
    userId: userStore.user?.id || "",
    announcementType: "",
    providerType: item,
    transactionType: "",
    title: "",
    description: "",
    price: "",
    surface: "",
    landSurface: "",
    city: "",
    county: "",
    street: "",
    rooms: "",
    baths: "",
    partitioning: "",
    comfortLevel: "",
    floor: "",
    numberOfKitchens: "",
    balcony: "",
    parking: "",
    images: [] as File[],
    videos: [] as File[], // Store multiple videos
    sketch: null as File | string | null,
  });

  type MediaItem = {
    file?: File;
    url?: string;
  };

  const [imageItems, setImageItems] = useState<MediaItem[]>([]);
  const [videoItems, setVideoItems] = useState<MediaItem[]>([]);

  const isApartment = formData.announcementType === "Apartament";

  const [contactPhone, setContactPhone] = useState<string>(userStore.user?.phoneNumber || "");
  const [imagePreviews, setImagePreviews] = useState<string[]>([]); // Store preview URLs for images
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>("");
  const [isDragging, setIsDragging] = useState(false); // Highlight drag area
  const fileInputRef = useRef<HTMLInputElement>(null); // Reference to hidden file inpu
  const [videoPreviews, setVideoPreviews] = useState<string[]>([]); // Store preview URLs for videos
  const [isDraggingVideos, setIsDraggingVideos] = useState(false);
  const videoFileInputRef = useRef<HTMLInputElement>(null);

  const [imageUploadProgress, setImageUploadProgress] = useState({ uploaded: 0, total: 0 });
  const [videoUploadProgress, setVideoUploadProgress] = useState({ uploaded: 0, total: 0 });

  const pathname = usePathname();
  const params = useParams();
  const searchParams = useSearchParams();
  const isEdit = params?.id && pathname.includes("/edit-announcement");

  const isImageError = error.toLowerCase().includes("image") || error.toLowerCase().includes("jpeg") || error.toLowerCase().includes("webp");
  const isVideoError = error.toLowerCase().includes("video") || error.toLowerCase().includes("mp4") || error.toLowerCase().includes("100mb");

  const [originalMediaCounts, setOriginalMediaCounts] = useState({ images: 0, videos: 0 });


  // Load current user
  useEffect(() => {
    if (!userStore.user?.id) {
      userStore.getCurrentUser();
    } else if (userStore.user.role === 'admin') {
      userStore.fetchAllUsers();
    }
  }, [userStore.user?.role]);

  useEffect(() => {
    if (userStore.user?.id) {
      pricingStore.getAnnouncementPackages(userStore.user.id);
    }
  }, [userStore.user]);

  useEffect(() => {
    setFormData((prev) => ({
      ...prev,
      announcementType: prev.announcementType || propertyTypes[0],
      transactionType: prev.transactionType || serviceTypes[0],
    }));
  }, []);

  // (1) Fetch currentAnnouncement when in edit mode
  useEffect(() => {
    if (isEdit && params?.id) {
      const id = Array.isArray(params.id) ? params.id[0] : params.id;
      announcementStore.getAnnouncementById(id);
    }
  }, [isEdit, params?.id]);


  // Prefill data if redirected from failed payment
  useEffect(() => {
    const failed = searchParams.get("failed");
    if (failed) {
      const savedData = sessionStorage.getItem("announcementData");
      if (savedData) {
        setFormData(JSON.parse(savedData));
      }
    }
  }, []);

  // Load current announcement for editing
  useEffect(() => {
    const disposer = reaction(
      () => ({
        announcement: announcementStore.currentAnnouncement,
        users: userStore.users,
      }),
      ({ announcement, users }) => {
        if (!isEdit || !announcement) return;

        const normalizedType = propertyTypes.find(
          (type) =>
            type.toLowerCase() ===
            announcement.announcementType?.toLowerCase()
        );

        const normalizedTrans = serviceTypes.find(
          (type) =>
            type.toLowerCase() ===
            announcement.transactionType?.toLowerCase()
        ) || serviceTypes[0];

        // Sketch
        if (announcement.sketchUrl) {
          setSketchPreview(announcement.sketchUrl);
          setFormData({
            userId: announcement.user?.id ?? "", // only use announcement user ID,
            announcementType: normalizedType || propertyTypes[0],
            providerType: formData.providerType,
            transactionType: normalizedTrans,
            title: announcement.title || "",
            description: announcement.description || "",
            price: announcement.price?.toString() || "",
            surface: announcement.surface?.toString() || "",
            landSurface: announcement.landSurface?.toString() || "",
            city: announcement.city || "",
            county: announcement.county || "",
            street: announcement.street || "",
            rooms: announcement.rooms?.toString() || "",
            baths: announcement.baths?.toString() || "",
            partitioning: announcement.partitioning || "",
            comfortLevel: announcement.comfortLevel?.toString() || "",
            floor: announcement.floor?.toString() || "",
            numberOfKitchens: announcement.numberOfKitchens?.toString() || "",
            balcony: announcement.balcony || "",
            parking: announcement.parking || "",
            // We leave `formData.images` empty: newly selected Files go here
            images: [],
            // We leave `formData.videos` empty: newly selected Files go here
            videos: [],
            // ─── C) Prefill existing sketch URL as string ───
            sketch: announcement.sketchUrl || null,
          });
        }

        // Videos
        if (Array.isArray(announcement.videos)) {
          const videoUrls = announcement.videos.map((v) => v.original);
          setVideoItems(videoUrls.map((url) => ({ url })));
          setVideoPreviews(videoUrls);
        }

        // Images
        const filteredImages = (announcement.images ?? []).filter(
          (img) => img.original !== announcement.sketchUrl
        );
        setImageItems(filteredImages.map((img) => ({ url: img.original })));
        setImagePreviews(filteredImages.map((img) => img.original));

        // userId
        const announcementUserId = announcement.user?.id;
        if (announcementUserId && users.some((u) => u.id === announcementUserId)) {
          setFormData((prev) => ({
            ...prev,
            userId: announcementUserId,
          }));
        }

        // Phone
        if (!contactPhone && announcement.user?.phoneNumber) {
          setContactPhone(announcement.user.phoneNumber);
        }

        setOriginalMediaCounts({
          images: filteredImages.length,
          videos: announcement.videos?.length ?? 0,
        });
      },
      {
        fireImmediately: true, // important!
        delay: 0, // optional: ensures it's async but not delayed
      }
    );

    return () => disposer();
  }, [isEdit, contactPhone]);

  const handleInputChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = event.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSelectChange = (
    event: SelectChangeEvent<string | number>
  ) => {
    const { name, value } = event.target;
    setFormData({ ...formData, [name as string]: value });
  };

  const validateImageFiles = (files: FileList | File[]) => {
    let validImages: File[] = Array.from(files).filter((file) => {
      if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
        setError("Sunt permise doar imagini JPEG, PNG sau WebP.");
        return false;
      }
      if (file.size > MAX_IMAGE_SIZE) {
        setError(`Imaginea ${file.name} depășește limita de 10MB.`);
        return false;
      }
      
      return true;
    });

    return validImages;
  };

  const handleImageChange = (event: ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files) return;

    const validImages = validateImageFiles(files);
    const newItems = validImages.map((file) => ({ file }));

    setImageItems((prev) => [...prev, ...newItems]);

    // 👇 important: reset input value so selecting same files again works
    event.target.value = "";
  };

  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsDragging(false);
    const files = event.dataTransfer.files;

    const validImages = validateImageFiles(files);
    if (formData.images.length + validImages.length > MAX_IMAGES) {
      setError(`Poți încărca maximum ${MAX_IMAGES} imagini.`);
      return;
    }
    
    setFormData((prev) => ({
      ...prev,
      images: [...prev.images, ...validImages],
    }));
    setImagePreviews((prev) => [
      ...prev,
      ...validImages.map((file) => URL.createObjectURL(file)),
    ]);
    setError('');
  };

  const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleImageRemove = (index: number) => {
    setImageItems((prev) => prev.filter((_, i) => i !== index));
  };

  const validateVideoFiles = (files: FileList | File[]) => {
    let validVideos: File[] = Array.from(files).filter((file) => {
      if (!file.type.startsWith("video/")) {
        setError("Sunt permise doar fișiere video.");
        return false;
      }

      if (file.size > MAX_VIDEO_SIZE) {
        setError(`Fișierul ${file.name} depășește limita de 100MB.`);

        return false;
      }
      
      return true;
    });

    return validVideos;
  };

  const handleVideoChange = (event: ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files) return;

    const validVideos = validateVideoFiles(files);
    const newItems = validVideos.map((file) => ({ file }));

    setVideoItems((prev) => [...prev, ...newItems]);
  };

  const handleVideoDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsDragging(false);
    const files = event.dataTransfer.files;
    
    const validVideos = validateVideoFiles(files);
    if (formData.videos.length + validVideos.length > MAX_VIDEOS) {
      setError(`Poți încărca maximum ${MAX_VIDEOS} videoclipuri.`);
      return;
    }

    setFormData((prev) => ({
      ...prev,
      videos: [...prev.videos, ...validVideos],
    }));
    setVideoPreviews((prev) => [
      ...prev,
      ...validVideos.map((file) => URL.createObjectURL(file)),
    ]);
    setError('');
  };

  const handleVideoDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsDraggingVideos(true);
  };

  const handleVideoDragLeave = () => {
    setIsDraggingVideos(false);
  };

  const handleVideoClick = () => {
    if (videoFileInputRef.current) {
      videoFileInputRef.current.click();
    }
  };

  const handleVideoRemove = (index: number) => {
    setVideoItems((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSketchChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const preview = URL.createObjectURL(file);
      setSketchPreview(preview);
      setFormData((prev) => ({ ...prev, sketch: file }));
      setOpenModal(false);
    }
  };

  const handlePredefinedSketchClick = (src: string) => {
    setSketchPreview(src);
    setFormData((prev) => ({ ...prev, sketch: src }));
    setOpenModal(false);
  };

  const uploadMedia = async (
    announcementId: string
  ) => {
    const totalImages =
      imageItems.filter((i) => i.file).length +
      imageItems.filter((i) => i.url).length +
      (formData.sketch ? 1 : 0);

    const totalVideos =
      videoItems.filter((i) => i.file).length +
      (videoItems.filter((i) => i.url).length);

    setImageUploadProgress({ uploaded: 0, total: totalImages });
    setVideoUploadProgress({ uploaded: 0, total: totalVideos });

    const incrementImage = () =>
      setImageUploadProgress((prev) => ({
        ...prev,
        uploaded: prev.uploaded + 1,
      }));

    const incrementVideo = () =>
      setVideoUploadProgress((prev) => ({
        ...prev,
        uploaded: prev.uploaded + 1,
      }));

    const uploadAll = async (
      items: MediaItem[],
      type: 'image' | 'video',
      increment: () => void
    ) => {
      for (const item of items) {
        if (!item.file) continue; // ⛔ skip existing if not deleting

        const form = new FormData();

        if (item.file) {
          form.append('file', item.file);
        } else if (item.url) {
          const res = await fetch(item.url);
          const blob = await res.blob();
          const ext = blob.type.split('/')[1] || 'jpg';
          const file = new File([blob], `existing-${Date.now()}.${ext}`, {
            type: blob.type,
          });
          form.append('file', file);
        } else {
          continue;
        }

        form.append('type', type);
        await announcementStore.createImageOrVideo(form, announcementId);
        increment();
      }
    };

    // 1. Upload first image as thumbnail (new or existing)
    const firstImage = imageItems[0];
    if (firstImage) {
      const form = new FormData();
      if (firstImage.file) {
        form.append('file', firstImage.file);
      } else if (firstImage.url) {
        const res = await fetch(firstImage.url);
        const blob = await res.blob();
        const ext = blob.type.split('/')[1] || 'jpg';
        const file = new File([blob], `thumbnail-${Date.now()}.${ext}`, {
          type: blob.type,
        });
        form.append('file', file);
      } else {
        console.warn("⚠️ No valid file or URL for thumbnail", firstImage);
        return;
      }

      form.append('type', 'image');
      const result = await announcementStore.createImageOrVideo(form, announcementId);
      
      if (result?.optimized_url) {
        await announcementStore.updateAnnouncement(announcementId, {
          imageUrl: result.optimized_url,
        });
      } else {
        console.warn("⚠️ Thumbnail uploaded, but no optimized_url returned");
      }
      incrementImage();
    }

    // 3. Upload sketch
    if (formData.sketch) {
      const form = new FormData();
      if (formData.sketch instanceof File) {
        form.append('file', formData.sketch);
      } else if (typeof formData.sketch === 'string') {
        const res = await fetch(formData.sketch);
        const blob = await res.blob();
        const file = new File([blob], `sketch-${Date.now()}.jpg`, {
          type: blob.type,
        });
        form.append('file', file);
      }
      form.append('type', 'image');
      const result = await announcementStore.createImageOrVideo(form, announcementId);
      if (result?.optimized_url) {
        await announcementStore.updateAnnouncement(announcementId, {
          sketchUrl: result.optimized_url,
        });
      } else {
        console.warn("⚠️ Sketch upload succeeded but no optimized_url returned");
      }
      incrementImage();
    }

    // 2. Upload remaining images
    await uploadAll(imageItems.slice(1), 'image', incrementImage);

    // 4. Upload videos
    await uploadAll(videoItems, 'video', incrementVideo);

    await new Promise((resolve) => setTimeout(resolve, 1000));
  };

  const onSubmit = async () => {
    if (!formData.title || !formData.description || !formData.price || !formData.city || !formData.county) {	
      setError("Te rugăm să completezi toate câmpurile obligatorii.");
      return;
    }
  
    if (!contactPhone) {
      setError("Numărul de telefon este obligatoriu.");
      return;
    }

    if (!formData.sketch) {
      setError("Trebuie să selectezi sau să încarci o schiță.");
      return;
    }
  
    setLoading(true);
    setError("");
  
    try {
      const { sketch, ...data } = formData;

      const selectedUser = userStore.user && userStore.user.role === 'admin'
        ? userStore.users.find(u => u.id === formData.userId)
        : userStore.user;
      if (!selectedUser || !selectedUser.id) throw new Error('User not found');
  
      const announcementDraft = {
        ...data,
        announcementType: data.announcementType.toLowerCase(),
        price: Number(data.price),
        rooms: Number(data.rooms),
        baths: Number(data.baths),
        numberOfKitchens: Number(data.numberOfKitchens),
        floor: Number(data.floor),
        surface: Number(data.surface),
        landSurface: Number(data.landSurface),
        status: userStore.user && userStore.user.role === 'admin' ? 'active' : 'pending',
        phoneContact: contactPhone, // Add phoneContact property
        user: { id: selectedUser.id as string, firebaseId: selectedUser.firebaseId ?? "" },
        deleteMedia: false
      };
  
      // 1. Update phone number if changed
      if (contactPhone !== userStore.user?.phoneNumber && userStore.user?.id) {
        await userStore.updateUser(userStore.user.id, { phoneNumber: contactPhone });
      }

      if (isEdit && announcementStore.currentAnnouncement?.id) {
        // ─── EDITING AN EXISTING ANNOUNCEMENT ──
        // 2a. Call updateAnnouncement instead of createAnnouncement
        announcementDraft.status = 'active';
        announcementDraft.deleteMedia = true;

        await announcementStore.updateAnnouncement(announcementStore.currentAnnouncement.id, announcementDraft);

        // 3a. Upload media on top of the existing announcement’s ID
        await uploadMedia(announcementStore.currentAnnouncement.id);

        await new Promise((resolve) => setTimeout(resolve, 1000)); // 👈 Give time for final flush

        // 4a. Redirect or show a “success” page for editing
        // (choose whatever makes sense: maybe go back to listing or details page)
        // e.g.:
        window.location.href = `/announcements/${announcementStore.currentAnnouncement.id}`;
      } else {

        // 2. Actually create the announcement
        const newAnnouncement = await announcementStore.createAnnouncement(announcementDraft) as unknown as PropertyAnnouncementModel;

        // 4. Upload media in the background
        await uploadMedia(newAnnouncement.id);

        const isAdmin = userStore.user?.role === 'admin';

        if (isAdmin) {
          // record free payment for admin
          await announcementStore.createPaymentSession({
            orderId: newAnnouncement.id,
            packageId: pricingStore.freePlanId ?? "",
            amount: 0,
            originalAmount: 0,
            currency: 'RON',
            invoiceDetails: {
              name: "",
              address: "",
              city: "",
              country: "",
              email: "",
              isTaxPayer: false
            },
            products: [],
          });

          const frontendUrl = process.env.NEXT_PUBLIC_FRONTEND_URL!
          const announcementUrl = `${frontendUrl}/announcements/${newAnnouncement.id}`; 
          await announcementStore.sendAnnouncementCreationMail(selectedUser.firstName ?? "", selectedUser.email ?? "", announcementUrl);

          // redirect to admin detail view
            window.location.href = `/payment-status?orderId=${newAnnouncement.id}&success=true`;
        } else {
          // normal user: go to payment packages flow
          window.location.href = `/payment-packages?announcementId=${newAnnouncement.id}&providerType=${item}`;
        }
      }
    } catch (error) {
      console.error("Error saving announcement:", error);
      setError("A apărut o eroare la salvarea anunțului.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container>
      {loading ? (
        <>
          <CircularProgress />
          {(imageUploadProgress.total > 0 || videoUploadProgress.total > 0) ? (
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
                  Finalizare încărcare, te rugăm să aștepți...
                </Typography>
              )}
            </>
          ) : (
            <Typography mt={2}>Se creează anunțul...</Typography>
          )}
        </>
      ) : (
        <>
          <SubtitleAdvice>{isEdit ? "Editează Anunțul" : "Creează Anunțul"}</SubtitleAdvice>

          {error && (
            <Typography color="error" sx={{ marginBottom: "16px", textAlign: "center" }}>
              {error}
            </Typography>
          )}

          {userStore.user && userStore.user.role === 'admin' && (
            <FormControl fullWidth sx={{ mb: 2 }}>
              <InputLabel id="user-select-label">Atribuie unui utilizator</InputLabel>
              <Select
                labelId="user-select-label"
                name="userId"
                value={formData.userId}
                label="Atribuie unui utilizator"
                onChange={(e) => setFormData(prev => ({ ...prev, userId: e.target.value as string }))}
              >
                {userStore.users.map(u => (
                  <MenuItem key={u.id} value={u.id}>
                    {u.firstName} {u.lastName} ({u.email})
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          )}

          <InputContainer>
            <RadioGroupContainer> 
              {/* Announcement Type */}
              <RadioButtonsGroup
                options={propertyTypes}
                value={formData.announcementType}
                id="announcementType"
                onChange={handleSelectChange}
                label="Tip Proprietate"
              />

              {/* Transaction Type */}
              <RadioButtonsGroup
                options={serviceTypes}
                value={formData.transactionType}
                id="transactionType"
                onChange={handleSelectChange}
                label="Tip Tranzacție"
              />
            </RadioGroupContainer>
          
            {/* County */}
            <AutocompleteCounties
              label="Județ"
              customWidth="100%"
              value={formData.county}
              onChange={(event, value) => {
                setFormData((prev) => ({
                  ...prev,
                  county: value || "",
                }));
              }}
            />

            {/* City */}
            <AutocompleteCities
              label="Oraș"
              customWidth="100%"
              value={formData.city}
              onChange={(e, value) =>
                setFormData((prev) => ({ ...prev, city: value || "" }))
              }
            />

            {/* Street */}
            <Box width="100%" mb={2}>
              <Typography variant="subtitle1">Stradă</Typography>
              <Typography variant="caption" color="text.secondary" sx={{ mb: 1 }}>
                Adaugă strada exactă. Nu include numere de telefon, emailuri sau linkuri.
              </Typography>
              <StyledTextField
                label="Stradă"
                name="street"
                value={formData.street}
                onChange={handleInputChange}
                fullWidth
              />
            </Box>

            {/* Title */}
            <Box width="100%">
              <Box width="100%" mb={2}>
                <Typography variant="subtitle1">Titlu</Typography>
                <Typography variant="caption" color="text.secondary" sx={{ mb: 1 }}>
                  Gândește-te la un titlu clar și captivant pentru a atrage potențiali cumpărători. Nu include majuscule, numere de telefon, emailuri sau linkuri.
                </Typography>
                <StyledTextField
                  label="Titlu"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  fullWidth
                />
              </Box>
              <StyledTextField
                label="Titlu"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                fullWidth
                sx={{ marginBottom: "16px" }}
              />
            </Box>

            {/* Description */}
            <Box width="100%" mb={2}>
              <Typography variant="subtitle1">Descriere</Typography>
              <Typography variant="caption" color="text.secondary" sx={{ mb: 1 }}>
                Vrei să atragi cumpărători serioși? Include detalii reale despre suprafață, camere, anul construcției, renovări, zonă și facilități. Evită exagerările.
              </Typography>
              <StyledTextField
                label="Descriere"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                multiline
                rows={4}
                fullWidth
              />
            </Box>

            {/* Phone Number */}
            <PhoneInputField
              label="Număr de Telefon"
              name="contactPhone"
              value={contactPhone}
              onChange={(phoneValue) => setContactPhone(phoneValue)}
              error={error && !contactPhone ? error : undefined}
              setError={(err) => setError(err)}
            />

            {/* Price */}
            <TextField
              label="Preț (€)"
              name="price"
              value={formData.price}
              onChange={handleInputChange}
              type="number"
              fullWidth
              required
              sx={{ marginBottom: "16px" }}
            />

            {/* Surface */}
            <TextField
              label="Suprafață (sqm)"
              name="surface"
              value={formData.surface}
              onChange={handleInputChange}
              type="number"
              fullWidth
              sx={{ marginBottom: "16px" }}
            />

            {/* Land Surface - only for houses */}
            {formData.announcementType === "Casa" && (
              <TextField
                label="Suprafață teren (sqm)"
                name="landSurface"
                value={formData.landSurface}
                onChange={handleInputChange}
                type="number"
                fullWidth
                sx={{ marginBottom: "16px" }}
              />
            )}

            {isApartment && (
              <>
                {/* Number of Rooms */}
                <SelectDropdown
                  label="Număr camere"
                  options={roomOptions}
                  name="rooms"
                  value={formData.rooms}
                  handleChange={handleSelectChange}
                />

                {/* Number of Baths */}
                <SelectDropdown
                  label="Număr băi"
                  options={roomOptions}
                  name="baths"
                  value={formData.baths}
                  handleChange={handleSelectChange}
                />

                {/* Number of Kitchens */}
                <SelectDropdown
                  label="Număr bucătării"
                  options={roomOptions}
                  name="numberOfKitchens"
                  value={formData.numberOfKitchens}
                  handleChange={handleSelectChange}
                />

                {/* Partitioning */}
                <SelectDropdown
                  label="Compartimentare"
                  options={apartamentPartitionings}
                  name="partitioning"
                  value={formData.partitioning}
                  handleChange={handleSelectChange}
                />

                {/* Comfort Level */}
                <SelectDropdown
                  label="Nivel confort"
                  options={comfortLevels}
                  name="comfortLevel"
                  value={formData.comfortLevel}
                  handleChange={handleSelectChange}
                />

                {/* Floor */}
                <SelectDropdown
                  label="Etaj"
                  options={apartmentFloors}
                  name="floor"
                  value={formData.floor}
                  handleChange={handleSelectChange}
                />

                {/* Balcony */}
                <SelectDropdown
                  label="Balcon"
                  options={balconyTypes.map((type, index) => ({ id: index, value: type }))}
                  name="balcony"
                  value={formData.balcony}
                  handleChange={handleSelectChange}
                />

                {/* Parking */}
                <SelectDropdown
                  label="Parcare"
                  options={parkingTypes.map((type, index) => ({ id: index, value: type }))}
                  name="parking"
                  value={formData.parking}
                  handleChange={handleSelectChange}
                />
              </>
            )}

            {/* Sketch */}
            <ThumbnailContainer>
              <Box width="100%" textAlign="center">
                <Typography variant="h6">Schița apartamentului / Plan</Typography>
                <Typography variant="caption" color="text.secondary" sx={{ mt: 1 }}>
                  Adaugă schița locuinței tale. Oferă o imagine clară a spațiului și ajută clienții să decidă mai ușor dacă oferta e potrivită. Anunțurile cu schiță au șanse cu 50% mai mari să genereze interes.
                </Typography>
              </Box>

              <ThumbnailPreviewWrapper onClick={() => setOpenModal(true)}>
                {sketchPreview ? (
                  <ThumbnailPreviewImage src={sketchPreview} alt="Previzualizare schiță" />
                ) : (
                  <Typography sx={{ color: "#aaa", textAlign: "center" }}>
                    Click pentru a încărca sau a selecta
                  </Typography>
                )}
              </ThumbnailPreviewWrapper>

              <Modal open={openModal} onClose={() => setOpenModal(false)}>
                <ModalContent>
                  <Tabs value={tabIndex} onChange={(_, newIndex) => setTabIndex(newIndex)}>
                    <Tab label="Încarcă" />
                    <Tab label="Alege model" />
                  </Tabs>

                  {tabIndex === 0 && (
                    <Box mt={2}>
                      <input
                        type="file"
                        accept=".png,.jpg,.jpeg"
                        onChange={handleSketchChange}
                        ref={sketchFileInputRef}
                      />
                    </Box>
                  )}

                  {tabIndex === 1 && (
                    <PreviewContainer>
                      {PREDEFINED_SKETCHES.map((src, index) => (
                        <PreviewFile key={index} onClick={() => handlePredefinedSketchClick(src.src)}>
                          <Typography variant="body2">Schiță {index + 1}</Typography>
                          <ThumbnailPreviewImage src={typeof src === "string" ? src : src.src} alt={`Schiță ${index + 1}`} />
                        </PreviewFile>
                      ))}
                    </PreviewContainer>
                  )}

                  <Box mt={2} p={2} bgcolor="#fff7e6" border="1px dashed #ffa726" borderRadius={2}>
                    <Typography variant="body2" fontWeight="500">
                      📝 Sugestie:
                    </Typography>
                    <Typography variant="body2">
                      DACA NU AI GĂSIT SCHIȚA IMOBILULUI ÎN DOSARUL TĂU CU ACTE, NICI ÎN MODELE CREATE DE NOI, TE SFĂTUIM SĂ FACI O SCHIȚĂ DE MÂNĂ, O FOTOGRAFIEZI ȘI O ADAUGI LA ANUNȚ.
                    </Typography>
                    <Typography variant="body2" mt={1} fontWeight="600" color="green">
                      ✅ Ai șanse cu 70% mai mari să vinzi dacă publici schița de imobil!
                    </Typography>
                  </Box>

                </ModalContent>
              </Modal>

              {formData.sketch instanceof File && (
                <Typography variant="caption" sx={{ mt: 1 }}>
                  {(formData.sketch as File).name}
                </Typography>
              )}
            </ThumbnailContainer>

            <Box width="100%" textAlign="center">
              <Typography variant="h6">Adaugă imagini</Typography>
              <Typography variant="caption" color="text.secondary" sx={{ mt: 1 }}>
                Alege imagini clare și bine iluminate care prezintă interiorul și exteriorul imobilului (fațadă, casa scării, lift, stradă etc.). Pozele bune atrag mai mulți clienți!
              </Typography>
            </Box>

            <UploadInfoBox
              maxFiles={MAX_IMAGES}
              maxSizeMB={MAX_IMAGE_SIZE / 1024 / 1024}
              allowedTypes={["JPG", "PNG", "WEBP"]}
              uploadedCount={imageItems.length}
            />

            <DropArea
              $isDragging={isDragging}
              $hasError={isImageError}
              onClick={handleClick}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
            >
              Trage imaginile aici sau apasă pentru a selecta
            </DropArea>
            <input
              type="file"
              accept="image/*"
              multiple
              ref={fileInputRef}
              style={{ display: "none" }}
              onChange={handleImageChange}
            />

            <PreviewContainer>
              {imageItems.map((item, index) => (
                <PreviewImage
                  key={index}
                  src={item.url || URL.createObjectURL(item.file!)}
                  alt={`Image ${index}`}
                  onClick={() => handleImageRemove(index)}
                />
              ))}
            </PreviewContainer>

            <Box width="100%" textAlign="center">
              <Typography variant="h6">Adaugă videoclipuri</Typography>
              <Typography variant="caption" color="text.secondary" sx={{ mt: 1 }}>
                Încarcă un clip scurt (ideal vertical, tip TikTok sau Instagram) care evidențiază avantajele locuinței. Clipurile video cresc șansele de vânzare cu până la 70%!
              </Typography>
            </Box>

            <UploadInfoBox
              maxFiles={MAX_VIDEOS}
              maxSizeMB={MAX_VIDEO_SIZE / 1024 / 1024}
              uploadedCount={videoItems.length}
            />

            <DropArea
              $isDragging={isDraggingVideos}
              $hasError={isVideoError}
              onClick={handleVideoClick}
              onDragOver={handleVideoDragOver}
              onDragLeave={handleVideoDragLeave}
              onDrop={handleVideoDrop}
            >
              Trage videoclipurile aici sau apasă pentru a selecta
            </DropArea>
            <input
              type="file"
              accept="video/*"
              multiple
              ref={videoFileInputRef}
              style={{ display: "none" }}
              onChange={handleVideoChange}
            />

            <PreviewContainer>
              {videoItems.map((item, index) => (
                <PreviewVideo
                  key={index}
                  src={item.url || URL.createObjectURL(item.file!)}
                  controls
                  onClick={() => handleVideoRemove(index)}
                />
              ))}
            </PreviewContainer>

            {error && (
              <Typography color="error" sx={{ mt: 1 }}>
                {error}
              </Typography>
            )}


          </InputContainer>

          {/* Submit Button */}
          <PrimaryButton
            text={isEdit ? "Actualizează Anunțul" : "Creează Anunțul"}
            onClick={onSubmit}
            sx={{ marginTop: "20px" }}
          />
        </>
      )}
    </Container>
  );
};

const AnnouncementForm = ({ item }: { item: ProviderType }) => {
  return (
    <Suspense fallback={<CircularProgress size={50} style={{ marginTop: "50px" }} />}>
      <AnnouncementFormContent item={item} />
    </Suspense>
  );
};

export default observer(AnnouncementForm);
