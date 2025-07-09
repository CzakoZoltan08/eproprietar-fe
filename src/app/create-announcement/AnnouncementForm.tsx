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

const MAX_VIDEOS = 3;
const MAX_VIDEO_SIZE = 100 * 1024 * 1024; // 100MB

const MAX_IMAGES = 20;
const MAX_IMAGE_SIZE = 5 * 1024 * 1024; // 5MB
const ALLOWED_IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp"];

const AnnouncementFormContent = ({ item }: { item: ProviderType }) => {
  const {
    userStore: { user, getCurrentUser, updateUser, fetchAllUsers, users: usersList },
    announcementStore: { updateAnnouncement, createImageOrVideo, currentAnnouncement, createAnnouncement, sendAnnouncementCreationMail, getAnnouncementById },
    pricingStore : { freePlanId, getAnnouncementPackages },
    announcementStore: { createPaymentSession },
  } = useStore();

  const sketchFileInputRef = useRef<HTMLInputElement>(null);
  const [sketchPreview, setSketchPreview] = useState<string | null>(null);

  const [openModal, setOpenModal] = useState(false);
  const [tabIndex, setTabIndex] = useState(0);

  const [formData, setFormData] = useState({
    userId: user?.id || "",
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

  const isApartment = formData.announcementType === "Apartament";

  const [contactPhone, setContactPhone] = useState<string>(user?.phoneNumber || "");
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

  // Load current user
  useEffect(() => {
    if (!user?.id) {
      getCurrentUser();
    } else if (user.role === 'admin') {
      fetchAllUsers();
    }
  }, [user]);

  useEffect(() => {
    if (user?.id) {
      getAnnouncementPackages(user.id);
    }
  }, [user]);

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
      getAnnouncementById(id);
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
    if (isEdit && currentAnnouncement) {
      // ─── A) Map basic fields ───
      const normalizedType = propertyTypes.find(
        (type) =>
          type.toLowerCase() ===
          currentAnnouncement.announcementType?.toLowerCase()
      );
      const normalizedTrans = serviceTypes.find(
        (type) =>
          type.toLowerCase() ===
          currentAnnouncement.transactionType?.toLowerCase()
      ) || serviceTypes[0];

      setFormData({
        userId: currentAnnouncement.user?.id || user?.id || "",
        announcementType: normalizedType || propertyTypes[0],
        providerType: formData.providerType,
        transactionType: normalizedTrans,
        title: currentAnnouncement.title || "",
        description: currentAnnouncement.description || "",
        price: currentAnnouncement.price?.toString() || "",
        surface: currentAnnouncement.surface?.toString() || "",
        landSurface: currentAnnouncement.landSurface?.toString() || "",
        city: currentAnnouncement.city || "",
        county: currentAnnouncement.county || "",
        street: currentAnnouncement.street || "",
        rooms: currentAnnouncement.rooms?.toString() || "",
        baths: currentAnnouncement.baths?.toString() || "",
        partitioning: currentAnnouncement.partitioning || "",
        comfortLevel: currentAnnouncement.comfortLevel?.toString() || "",
        floor: currentAnnouncement.floor?.toString() || "",
        numberOfKitchens: currentAnnouncement.numberOfKitchens?.toString() || "",
        balcony: currentAnnouncement.balcony || "",
        parking: currentAnnouncement.parking || "",
        // We leave `formData.images` empty: newly selected Files go here
        images: [],
        // We leave `formData.videos` empty: newly selected Files go here
        videos: [],
        // ─── C) Prefill existing sketch URL as string ───
        sketch: currentAnnouncement.sketchUrl || null,
      });

      // ─── E) Prefill sketch preview ───
      if (currentAnnouncement.sketchUrl) {
        setSketchPreview(currentAnnouncement.sketchUrl);
      }

      // ─── F) Prefill images preview array ───
      if (Array.isArray(currentAnnouncement.images)) {
        // Assume each image is { original: string, thumbnail: string }
        const existingImageUrls = currentAnnouncement.images.map(
          (imgObj) => imgObj.original
        );
        setImagePreviews(existingImageUrls);
      }

      // ─── G) Prefill videos preview array ───
      if (Array.isArray(currentAnnouncement.videos)) {
        // Assume each video is { original: string, format: string }
        const existingVideoUrls = currentAnnouncement.videos.map(
          (vidObj) => vidObj.original
        );
        setVideoPreviews(existingVideoUrls);
      }

      // ─── H) Prefill contact phone ───
      if (!contactPhone && currentAnnouncement.user?.phoneNumber) {
        setContactPhone(currentAnnouncement.user.phoneNumber);
      }
    }
  }, [currentAnnouncement, isEdit]);

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
        setError("Only JPEG, PNG, or WebP images are allowed.");
        return false;
      }
      if (file.size > MAX_IMAGE_SIZE) {
        setError(`Image ${file.name} exceeds 5MB limit.`);
        return false;
      }
      
      return true;
    });

    return validImages;
  };

  const handleImageChange = (event: ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;

    if (!files) {
      return;
    }

    const validImages = validateImageFiles(files);

    if (formData.images.length + validImages.length > MAX_IMAGES) {
      setError(`You can upload a maximum of ${MAX_IMAGES} images.`);
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

  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsDragging(false);
    const files = event.dataTransfer.files;

    const validImages = validateImageFiles(files);
    if (formData.images.length + validImages.length > MAX_IMAGES) {
      setError(`You can upload a maximum of ${MAX_IMAGES} images.`);
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
    setFormData((prev) => {
      const updatedImages = [...prev.images];
      updatedImages.splice(index, 1);
      return { ...prev, images: updatedImages };
    });
    setImagePreviews((prev) => {
      const updatedPreviews = [...prev];
      updatedPreviews.splice(index, 1);
      return updatedPreviews;
    });
  };

  const validateVideoFiles = (files: FileList | File[]) => {
    let validVideos: File[] = Array.from(files).filter((file) => {
      if (!file.type.startsWith("video/")) {
        setError("Only video files are allowed.");
        return false;
      }

      if (file.size > MAX_VIDEO_SIZE) {
        setError(`File ${file.name} exceeds 100MB limit.`);
        return false;
      }
      
      return true;
    });

    return validVideos;
  };

  const handleVideoChange = (event: ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files) {
      
      const validVideos = validateVideoFiles(files);
      if (formData.videos.length + validVideos.length > MAX_VIDEOS) {
        setError(`You can upload a maximum of ${MAX_VIDEOS} videos.`);
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
    }
  };

  const handleVideoDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsDragging(false);
    const files = event.dataTransfer.files;
    
    const validVideos = validateVideoFiles(files);
    if (formData.videos.length + validVideos.length > MAX_VIDEOS) {
      setError(`You can upload a maximum of ${MAX_VIDEOS} videos.`);
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
    setFormData((prev) => {
      const updatedVideos = [...prev.videos];
      updatedVideos.splice(index, 1);
      return { ...prev, videos: updatedVideos };
    });
    setVideoPreviews((prev) => {
      const updatedPreviews = [...prev];
      updatedPreviews.splice(index, 1);
      return updatedPreviews;
    });
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

  const uploadMedia = async (announcementId: string) => {
    const totalImages = formData.images.length;
    const totalVideos = formData.videos.length;

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

    let thumbnailUrl = "";

    if (formData.images.length > 0) {
      const thumbnailImage = formData.images[0];
      const df = new FormData();
      df.append("file", thumbnailImage);
      df.append("type", "image");

      const uploadResp = await createImageOrVideo(df, announcementId);
      if (uploadResp?.optimized_url) {
        thumbnailUrl = uploadResp.optimized_url;
        await updateAnnouncement(announcementId, {
          imageUrl: thumbnailUrl,
        });
      }
      incrementImage();
    }

    const remainingImages = formData.images.slice(1);

    // 1) Upload any brand-new images (File objects in formData.images)
    const imageUploads = remainingImages.map((imageFile) =>
      (async () => {
        const df = new FormData();
        df.append("file", imageFile);
        df.append("type", "image");
        await createImageOrVideo(df, announcementId);
        incrementImage();
      })()
    );

    // 3) Upload the sketch (could be File or existing string URL)
    if (formData.sketch) {
      const df2 = new FormData();
      if (formData.sketch instanceof File) {
        df2.append("file", formData.sketch);
      } else if (typeof formData.sketch === "string") {
        const resp2 = await fetch(formData.sketch);
        const blob2 = await resp2.blob();
        const name2 = `sketch‐${Date.now()}.jpg`;
        const file2 = new File([blob2], name2, { type: blob2.type });
        df2.append("file", file2);
      }
      df2.append("type", "image");

      const uploadResp2 = await createImageOrVideo(df2, announcementId);
      if (uploadResp2?.optimized_url) {
        await updateAnnouncement(announcementId, {
          sketchUrl: uploadResp2.optimized_url,
        });
      }
      incrementImage();
    }

    // 4) Upload any brand-new videos (File objects in formData.videos)
    const videoUploads = formData.videos.map((videoFile) =>
      (async () => {
        const df3 = new FormData();
        df3.append("file", videoFile);
        df3.append("type", "video");
        await createImageOrVideo(df3, announcementId);
        incrementVideo();
      })()
    );

    // 5) Wait for all uploads to finish
    await Promise.all([Promise.all(imageUploads), Promise.all(videoUploads)]);
  };  

  const onSubmit = async () => {
    if (!formData.title || !formData.description || !formData.price || !formData.city || !formData.county) {	
      setError("Please fill in all required fields.");
      return;
    }
  
    if (!contactPhone) {
      setError("Contact phone number is required.");
      return;
    }

    if (!formData.sketch) {
      setError("You must select or upload a sketch image.");
      return;
    }
  
    setLoading(true);
    setError("");
  
    try {
      const { sketch, ...data } = formData;

      const selectedUser = user && user.role === 'admin'
        ? usersList.find(u => u.id === formData.userId)
        : user;
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
        status: user && user.role === 'admin' ? 'active' : 'pending',
        phoneContact: contactPhone, // Add phoneContact property
        user: { id: selectedUser.id as string, firebaseId: selectedUser.firebaseId ?? "" },
        deleteMedia: false
      };
  
      // 1. Update phone number if changed
      if (contactPhone !== user?.phoneNumber && user?.id) {
        await updateUser(user.id, { phoneNumber: contactPhone });
      }

      if (isEdit && currentAnnouncement?.id) {
        // ─── EDITING AN EXISTING ANNOUNCEMENT ──
        // 2a. Call updateAnnouncement instead of createAnnouncement
        announcementDraft.status = 'active';
        announcementDraft.deleteMedia = true; // Ensure we delete old media
        await updateAnnouncement(currentAnnouncement.id, announcementDraft);

        // 3a. Upload media on top of the existing announcement’s ID
        await uploadMedia(currentAnnouncement.id);

        // 4a. Redirect or show a “success” page for editing
        // (choose whatever makes sense: maybe go back to listing or details page)
        // e.g.:
        window.location.href = `/announcements/${currentAnnouncement.id}`;
      } else {

        // 2. Actually create the announcement
        const newAnnouncement = await createAnnouncement(announcementDraft) as unknown as PropertyAnnouncementModel;

        // 4. Upload media in the background
        await uploadMedia(newAnnouncement.id);

        const isAdmin = user?.role === 'admin';

        if (isAdmin) {
          // record free payment for admin
          await createPaymentSession({
            orderId: newAnnouncement.id,
            packageId: freePlanId ?? "",
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
          await sendAnnouncementCreationMail(selectedUser.firstName ?? "", selectedUser.email ?? "", announcementUrl);

          // redirect to admin detail view
            window.location.href = `/payment-status?orderId=${newAnnouncement.id}&success=true`;
        } else {
          // normal user: go to payment packages flow
          window.location.href = `/payment-packages?announcementId=${newAnnouncement.id}&providerType=${item}`;
        }
      }
    } catch (error) {
      console.error("Error saving announcement:", error);
      setError("An error occurred while saving the announcement.");
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
          <SubtitleAdvice>{isEdit ? "Edit Announcement" : "Create Announcement"}</SubtitleAdvice>

          {error && (
            <Typography color="error" sx={{ marginBottom: "16px", textAlign: "center" }}>
              {error}
            </Typography>
          )}

          {user && user.role === 'admin' && (
            <FormControl fullWidth sx={{ mb: 2 }}>
              <InputLabel id="user-select-label">Assign To User</InputLabel>
              <Select
                labelId="user-select-label"
                name="userId"
                value={formData.userId}
                label="Assign To User"
                onChange={(e) => setFormData(prev => ({ ...prev, userId: e.target.value as string }))}
              >
                {usersList.map(u => (
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
                label="Announcement Type"
              />

              {/* Transaction Type */}
              <RadioButtonsGroup
                options={serviceTypes}
                value={formData.transactionType}
                id="transactionType"
                onChange={handleSelectChange}
                label="Transaction Type"
              />
            </RadioGroupContainer>
          
            {/* County */}
            <AutocompleteCounties
              label="County"
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
              label="City"
              customWidth="100%"
              value={formData.city}
              onChange={(e, value) =>
                setFormData((prev) => ({ ...prev, city: value || "" }))
              }
            />

            {/* Street */}
            <Box width="100%">
              <Box display="flex" alignItems="center">
                <Typography variant="subtitle1">
                  Street
                </Typography>
                <FormHelpTooltip title="Adaugă strada exactă. Nu include numere de telefon, emailuri sau linkuri." />
              </Box>
              <StyledTextField
                label="Street"
                name="street"
                value={formData.street}
                onChange={handleInputChange}
                fullWidth
                sx={{ marginBottom: "16px" }}
              />
            </Box>

            {/* Title */}
            <Box width="100%">
              <Box display="flex" alignItems="center">
                <Typography variant="subtitle1">
                  Title
                </Typography>
                <FormHelpTooltip title="Gândește-te la un titlu clar și captivant pentru a atrage potențiali cumpărători. Nu include majuscule, numere de telefon, emailuri sau linkuri." />
              </Box>
              <StyledTextField
                label="Title"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                fullWidth
                sx={{ marginBottom: "16px" }}
              />
            </Box>

            {/* Description */}
            <Box width="100%">
              <Box display="flex" alignItems="center">
                <Typography variant="subtitle1">
                  Descriere
                </Typography>
                <FormHelpTooltip
                    title={`🏡 Vrei să atragi cumpărători serioși și să reduci timpul de vânzare? Secretul stă în descrierea anunțului tău!

                  ✨ Detalii complete și reale: Menționează suprafața, numărul de camere, compartimentarea, etajul și anul construcției.

                  ✅ Fii sincer – evită exagerările (ex.: "lux extrem" vs. "apartament modern, renovat în 2024").

                  🪟 Elemente care fac diferența: Balcon, parcare, grădină? Menționează tot ce poate influența decizia.

                  📍 Locatie clară: Zona, strada, apropierea de transport, școli, magazine etc.

                  🎨 Stare și design: Renovări recente? Mobilat modern? Oferă detalii care atrag interesul.

                  💡 De ce să fii sincer? Ofertele realiste atrag clienții potriviți și economisesc timp.

                  📌 Atenție: Informațiile incomplete pot întârzia vânzarea.

                  🚀 Hai să transformăm anunțul tău într-un magnet pentru clienți!`}
                  />
              </Box>

              <StyledTextField
                label="Description"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                multiline
                rows={4}
                fullWidth
                sx={{ marginBottom: "16px" }}
              />
            </Box>

            {/* Phone Number */}
            <PhoneInputField
              label="Contact Phone Number"
              name="contactPhone"
              value={contactPhone}
              onChange={(phoneValue) => setContactPhone(phoneValue)}
              error={error && !contactPhone ? error : undefined}
              setError={(err) => setError(err)}
            />

            {/* Price */}
            <TextField
              label="Price (€)"
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
              label="Surface (sqm)"
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
                label="Land Surface (sqm)"
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
                  label="Number of Rooms"
                  options={roomOptions}
                  name="rooms"
                  value={formData.rooms}
                  handleChange={handleSelectChange}
                />

                {/* Number of Baths */}
                <SelectDropdown
                  label="Number of Baths"
                  options={roomOptions}
                  name="baths"
                  value={formData.baths}
                  handleChange={handleSelectChange}
                />

                {/* Number of Kitchens */}
                <SelectDropdown
                  label="Number of Kitchens"
                  options={roomOptions}
                  name="numberOfKitchens"
                  value={formData.numberOfKitchens}
                  handleChange={handleSelectChange}
                />

                {/* Partitioning */}
                <SelectDropdown
                  label="Partitioning"
                  options={apartamentPartitionings}
                  name="partitioning"
                  value={formData.partitioning}
                  handleChange={handleSelectChange}
                />

                {/* Comfort Level */}
                <SelectDropdown
                  label="Comfort Level"
                  options={comfortLevels}
                  name="comfortLevel"
                  value={formData.comfortLevel}
                  handleChange={handleSelectChange}
                />

                {/* Floor */}
                <SelectDropdown
                  label="Floor"
                  options={apartmentFloors}
                  name="floor"
                  value={formData.floor}
                  handleChange={handleSelectChange}
                />

                {/* Balcony */}
                <SelectDropdown
                  label="Balcony"
                  options={balconyTypes.map((type, index) => ({ id: index, value: type }))}
                  name="balcony"
                  value={formData.balcony}
                  handleChange={handleSelectChange}
                />

                {/* Parking */}
                <SelectDropdown
                  label="Parking"
                  options={parkingTypes.map((type, index) => ({ id: index, value: type }))}
                  name="parking"
                  value={formData.parking}
                  handleChange={handleSelectChange}
                />
              </>
            )}

            {/* Sketch */}
            <ThumbnailContainer>
              <Box display="flex" alignItems="center" mb={1}>
                <Typography variant="h6">
                  Apartment Sketch / Floor Plan
                </Typography>
                <FormHelpTooltip
                  title={`📐 Adaugă schița locuinței tale. Oferă o imagine clară a spațiului și ajută clienții să decidă mai ușor dacă oferta e potrivită. Anunțurile cu schiță au șanse cu 50% mai mari să genereze interes.`}
                />
              </Box>

              <ThumbnailPreviewWrapper onClick={() => setOpenModal(true)}>
                {sketchPreview ? (
                  <ThumbnailPreviewImage src={sketchPreview} alt="Sketch Preview" />
                ) : (
                  <Typography sx={{ color: "#aaa", textAlign: "center" }}>
                    Click to upload or select
                  </Typography>
                )}
              </ThumbnailPreviewWrapper>

              <Modal open={openModal} onClose={() => setOpenModal(false)}>
                <ModalContent>
                  <Tabs value={tabIndex} onChange={(_, newIndex) => setTabIndex(newIndex)}>
                    <Tab label="Upload" />
                    <Tab label="Choose Sample" />
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
                          <Typography variant="body2">Sketch {index + 1}</Typography>
                          <ThumbnailPreviewImage src={typeof src === "string" ? src : src.src} alt={`Sketch ${index + 1}`} />
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

            <Box display="flex" alignItems="center" mb={1}>
              <Typography variant="h6">Add Images</Typography>
              <FormHelpTooltip
                title={`📸 Alege imagini clare și bine iluminate care prezintă interiorul și exteriorul imobilului (fațadă, casa scării, lift, stradă etc.). Pozele bune atrag mai mulți clienți!`}
              />
            </Box>

            <UploadInfoBox
              maxFiles={MAX_IMAGES}
              maxSizeMB={MAX_IMAGE_SIZE / 1024 / 1024}
              allowedTypes={["JPG", "PNG", "WEBP"]}
              uploadedCount={formData.images.length}
            />

            <DropArea
              $isDragging={isDragging}
              $hasError={isImageError}
              onClick={handleClick}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
            >
              Drag & Drop images here or click to browse
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
              {imagePreviews.map((src, index) => (
                <PreviewImage
                  key={index}
                  src={src}
                  alt={`Preview ${index}`}
                  onClick={() => handleImageRemove(index)} // Remove image on click
                />
              ))}
            </PreviewContainer>

            <Box display="flex" alignItems="center" mb={1}>
              <Typography variant="h6">
                Add videos
              </Typography>
              <FormHelpTooltip
                title={`🎥 Încarcă un clip scurt (ideal vertical, tip TikTok sau Instagram) care evidențiază avantajele locuinței. Clipurile video cresc șansele de vânzare cu până la 70%!`}
              />
            </Box>

            <UploadInfoBox
              maxFiles={MAX_VIDEOS}
              maxSizeMB={MAX_VIDEO_SIZE / 1024 / 1024}
              uploadedCount={formData.videos.length}
            />

            <DropArea
              $isDragging={isDraggingVideos}
              $hasError={isVideoError}
              onClick={handleVideoClick}
              onDragOver={handleVideoDragOver}
              onDragLeave={handleVideoDragLeave}
              onDrop={handleVideoDrop}
            >
              Drag & Drop videos here or click to browse
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
              {videoPreviews.map((src, index) => (
                <PreviewVideo
                  key={index}
                  src={src}
                  controls
                  onClick={() => handleVideoRemove(index)} // Remove video on click
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
            text={isEdit ? "Update Announcement" : "Create Announcement"}
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
