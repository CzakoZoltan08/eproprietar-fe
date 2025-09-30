"use client";

import {
  Box,
  Checkbox,
  CircularProgress,
  FormControl,
  FormControlLabel,
  InputLabel,
  LinearProgress,
  MenuItem,
  Modal,
  Radio,
  RadioGroup,
  Select,
  SelectChangeEvent,
  Tab,
  Tabs,
  Typography,
} from "@mui/material";
import React, { ChangeEvent, Suspense, useEffect, useRef, useState } from "react";
import {
  apartamentPartitionings,
  apartmentFloors,
  balconyCounts,
  balconyTypes,
  comfortLevels,
  kitchenOptionsMax2,
  parkingCounts,
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

/* ---------- NEW: reorder helper ---------- */
const reorder = <T,>(list: T[], startIndex: number, endIndex: number): T[] => {
  const result = list.slice();
  const [removed] = result.splice(startIndex, 1);
  result.splice(endIndex, 0, removed);
  return result;
};

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
  sketch31,
];

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
  max-width: 800px;
  margin: auto;
  overflow-x: hidden;

  @media (max-width: 768px) {
    max-width: 100%;
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
    width: 80%;
  }
`;

const RadioGroupContainer = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
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
  width: 150px;
  height: 150px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 8px;
  border: 2px dashed #ccc;
  background-color: #f8f8f8;
  overflow: hidden;
  cursor: pointer;
`;

const ThumbnailPreviewImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
`;

const StyledTextField = styled(TextField)`
  width: 100%;
`;

/* ---------- NEW: item wrapper + inline controls ---------- */
const PreviewItem = styled.div`
  position: relative;
  display: inline-flex;
  flex-direction: column;
  align-items: center;
`;

const Controls = styled.div`
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
`;

const MAX_VIDEOS = 1;
const MAX_VIDEO_SIZE = 100 * 1024 * 1024; // 100MB

const MAX_IMAGES = 15;
const MAX_IMAGE_SIZE = 10 * 1024 * 1024; // 10MB
const ALLOWED_IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp"];

function normalizeAnnouncementType(type: string): string {
  return type.toLowerCase() === "case la tara" ? "case_la_tara" : type.toLowerCase();
}

const AnnouncementFormContent = ({ item }: { item: ProviderType }) => {
  const { userStore, announcementStore, pricingStore } = useStore();

  const sketchFileInputRef = useRef<HTMLInputElement>(null);
  const [sketchPreview, setSketchPreview] = useState<string | null>(null);

  const [openModal, setOpenModal] = useState(false);
  const [tabIndex, setTabIndex] = useState(0);

  const HEIGHT_REGIMES = ["S", "D", "P", "E", "E2", "E3", "E4", "E5", "M", "POD"];

  const [isSubmitted, setIsSubmitted] = useState(false);

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
    balconyCount: "",
    parkingCount: "",
    images: [] as File[],
    videos: [] as File[],
    sketch: null as File | string | null,
    streetFront: false,
    heightRegime: [] as string[],
    streetFrontLength: 0,
    landType: "",
    landPlacement: "",
    urbanismDocuments: [] as string[],
    utilities: {
      curent: null as boolean | null,
      apa: null as boolean | null,
      canalizare: null as boolean | null,
      gaz: null as boolean | null,
    },
    commercialSpaceType: "",
    usableSurface: 0,
    builtSurface: 0,
    spaceHeight: 0,
    hasStreetWindow: false,
    streetWindowLength: 0,
    hasStreetEntrance: false,
    hasLift: false,
    vehicleAccess: [] as string[],
  });

  const role = userStore.user?.role ?? "";
  const canPublishImmediately = role === "admin" || role === "editor";

  type MediaItem = {
    file?: File;
    url?: string;
  };

  const [imageItems, setImageItems] = useState<MediaItem[]>([]);
  const [videoItems, setVideoItems] = useState<MediaItem[]>([]);

  /* ---------- NEW: DnD state ---------- */
  const [dragImageIndex, setDragImageIndex] = useState<number | null>(null);
  const [dragVideoIndex, setDragVideoIndex] = useState<number | null>(null);

  const isApartment = formData.announcementType === "Apartament";

  const [contactPhone, setContactPhone] = useState<string>("");
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>("");
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [videoPreviews, setVideoPreviews] = useState<string[]>([]);
  const [isDraggingVideos, setIsDraggingVideos] = useState(false);
  const videoFileInputRef = useRef<HTMLInputElement>(null);

  const [imageUploadProgress, setImageUploadProgress] = useState({ uploaded: 0, total: 0 });
  const [videoUploadProgress, setVideoUploadProgress] = useState({ uploaded: 0, total: 0 });

  const pathname = usePathname();
  const params = useParams();
  const searchParams = useSearchParams();
  const isEdit = params?.id && pathname.includes("/edit-announcement");

  const isImageError =
    error.toLowerCase().includes("image") ||
    error.toLowerCase().includes("jpeg") ||
    error.toLowerCase().includes("webp");
  const isVideoError =
    error.toLowerCase().includes("video") ||
    error.toLowerCase().includes("mp4") ||
    error.toLowerCase().includes("100mb");

  const [originalMediaCounts, setOriginalMediaCounts] = useState({ images: 0, videos: 0 });

  // Load current user
  useEffect(() => {
    if (!userStore.user?.id) {
      userStore.getCurrentUser();
    } else if (userStore.user.role === "admin") {
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
      announcementType: prev.announcementType || propertyTypes[0].id,
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

        const normalize = (value: string) => value.toLowerCase().replace(/\s+/g, "_");

        const normalizedTypeId =
          propertyTypes.find((t) => normalize(t.id) === normalize(announcement.announcementType ?? ""))?.id ??
          propertyTypes[0].id;

        const normalizedTrans =
          serviceTypes.find((type) => type.toLowerCase() === announcement.transactionType?.toLowerCase()) ||
          serviceTypes[0];

        // Sketch
        if (announcement.sketchUrl) {
          setSketchPreview(announcement.sketchUrl);
          setFormData({
            userId: announcement.user?.id ?? "",
            announcementType: normalizedTypeId,
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
            balconyCount: announcement.balconyCount?.toString() || "",
            parkingCount: announcement.parkingCount?.toString() || "",
            images: [],
            videos: [],
            sketch: announcement.sketchUrl || null,
            heightRegime: announcement.heightRegime || [],
            streetFront: announcement.streetFront || false,
            landPlacement: announcement.landPlacement || "",
            streetFrontLength: announcement.streetFrontLength || 0,
            landType: announcement.landType || "",
            urbanismDocuments: announcement.urbanismDocuments || [],
            utilities: {
              curent: announcement.utilities?.curent ?? null,
              apa: announcement.utilities?.apa ?? null,
              canalizare: announcement.utilities?.canalizare ?? null,
              gaz: announcement.utilities?.gaz ?? null,
            },
            builtSurface: announcement.builtSurface || 0,
            commercialSpaceType: announcement.commercialSpaceType || "",
            hasLift: announcement.hasLift || false,
            usableSurface: announcement.usableSurface || 0,
            spaceHeight: announcement.spaceHeight || 0,
            hasStreetWindow: announcement.hasStreetWindow || false,
            streetWindowLength: announcement.streetWindowLength || 0,
            hasStreetEntrance: announcement.hasStreetEntrance || false,
            vehicleAccess: announcement.vehicleAccess || [],
          });
        }

        // Videos
        if (Array.isArray(announcement.videos)) {
          const videoUrls = announcement.videos.map((v) => v.original);
          setVideoItems(videoUrls.map((url) => ({ url })));
          setVideoPreviews(videoUrls);
        }

        // Images
        const filteredImages = (announcement.images ?? []).filter((img) => img.original !== announcement.sketchUrl);
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

        setOriginalMediaCounts({
          images: filteredImages.length,
          videos: announcement.videos?.length ?? 0,
        });
      },
      {
        fireImmediately: true,
        delay: 0,
      }
    );

    return () => disposer();
  }, [isEdit, contactPhone]);

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = event.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSelectChange = (event: SelectChangeEvent<string | number>) => {
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
    event.target.value = "";
  };

  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsDragging(false);
    const files = event.dataTransfer.files;

    const validImages = validateImageFiles(files);
    if (imageItems.length + validImages.length > MAX_IMAGES) {
      setError(`Poți încărca maximum ${MAX_IMAGES} imagini.`);
      return;
    }

    const newItems = validImages.map((file) => ({ file }));
    setImageItems((prev) => [...prev, ...newItems]);
    setError("");
  };

  const handleVideoDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsDraggingVideos(false);
    const files = event.dataTransfer.files;

    const validVideos = validateVideoFiles(files);
    if (videoItems.length + validVideos.length > MAX_VIDEOS) {
      setError(`Poți încărca maximum ${MAX_VIDEOS} videoclipuri.`);
      return;
    }

    const newItems = validVideos.map((file) => ({ file }));
    setVideoItems((prev) => [...prev, ...newItems]);
    setError("");
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

  /* ---------- NEW: image DnD + arrow controls ---------- */
  const onImageDragStart = (index: number) => setDragImageIndex(index);
  const onImageDragOver = (e: React.DragEvent) => e.preventDefault();
  const onImageDrop = (index: number) => {
    if (dragImageIndex === null) return;
    setImageItems((prev) => reorder(prev, dragImageIndex, index));
    setDragImageIndex(null);
  };
  const moveImageLeft = (index: number) => {
    if (index <= 0) return;
    setImageItems((prev) => reorder(prev, index, index - 1));
  };
  const moveImageRight = (index: number) => {
    if (index >= imageItems.length - 1) return;
    setImageItems((prev) => reorder(prev, index, index + 1));
  };

  /* ---------- NEW: video DnD + arrow controls ---------- */
  const onVideoDragStart = (index: number) => setDragVideoIndex(index);
  const onVideoDragOver = (e: React.DragEvent) => e.preventDefault();
  const onVideoDrop = (index: number) => {
    if (dragVideoIndex === null) return;
    setVideoItems((prev) => reorder(prev, dragVideoIndex, index));
    setDragVideoIndex(null);
  };
  const moveVideoLeft = (index: number) => {
    if (index <= 0) return;
    setVideoItems((prev) => reorder(prev, index, index - 1));
  };
  const moveVideoRight = (index: number) => {
    if (index >= videoItems.length - 1) return;
    setVideoItems((prev) => reorder(prev, index, index + 1));
  };

  const uploadMedia = async (announcementId: string) => {
    const totalImages =
      imageItems.filter((i) => i.file).length +
      imageItems.filter((i) => i.url).length +
      (formData.sketch ? 1 : 0);

    const totalVideos = videoItems.filter((i) => i.file).length + videoItems.filter((i) => i.url).length;

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

    const uploadAll = async (items: MediaItem[], type: "image" | "video", increment: () => void) => {
      for (const item of items) {
        if (!item.file) continue; // skip existing if not deleting

        const form = new FormData();

        if (item.file) {
          form.append("file", item.file);
        } else if (item.url) {
          const res = await fetch(item.url);
          const blob = await res.blob();
          const ext = blob.type.split("/")[1] || "jpg";
          const file = new File([blob], `existing-${Date.now()}.${ext}`, {
            type: blob.type,
          });
          form.append("file", file);
        } else {
          continue;
        }

        form.append("type", type);
        await announcementStore.createImageOrVideo(form, announcementId);
        increment();
      }
    };

    // 1) Thumbnail = prima imagine după ordinea actuală
    const firstImage = imageItems[0];
    if (firstImage) {
      const form = new FormData();
      if (firstImage.file) {
        form.append("file", firstImage.file);
      } else if (firstImage.url) {
        const res = await fetch(firstImage.url);
        const blob = await res.blob();
        const ext = blob.type.split("/")[1] || "jpg";
        const file = new File([blob], `thumbnail-${Date.now()}.${ext}`, {
          type: blob.type,
        });
        form.append("file", file);
      } else {
        console.warn("⚠️ No valid file or URL for thumbnail", firstImage);
        return;
      }

      form.append("type", "image");
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

    // 2) Restul imaginilor (după prima)
    await uploadAll(imageItems.slice(1), "image", incrementImage);

    // 3) Sketch
    if (formData.sketch) {
      const form = new FormData();
      if (formData.sketch instanceof File) {
        form.append("file", formData.sketch);
      } else if (typeof formData.sketch === "string") {
        const res = await fetch(formData.sketch);
        const blob = await res.blob();
        const file = new File([blob], `sketch-${Date.now()}.jpg`, {
          type: blob.type,
        });
        form.append("file", file);
      }
      form.append("type", "image");
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

    // 4) Video-uri
    await uploadAll(videoItems, "video", incrementVideo);

    await new Promise((resolve) => setTimeout(resolve, 1000));
  };

  const onSubmit = async () => {
    setIsSubmitted(true);

    if (!formData.title || !formData.description || !formData.price || !formData.city || !formData.county) {
      setError("Te rugăm să completezi toate câmpurile obligatorii.");
      return;
    }

    if (!contactPhone) {
      setError("Numărul de telefon este obligatoriu.");
      return;
    }

    if (formData.announcementType === "Casa" || formData.announcementType === "Case la tara") {
      if (!formData.surface || !formData.landSurface) {
        setError("Pentru tipul 'Casa', câmpurile marcate cu * sunt obligatorii.");
        return;
      }
    }

    if (formData.announcementType === "Teren") {
      if (!formData.landSurface || !formData.streetFrontLength) {
        setError("Pentru tipul 'Casa', câmpurile marcate cu * sunt obligatorii.");
        return;
      }
    }

    if (formData.announcementType === "Comercial") {
      if (!formData.commercialSpaceType) {
        alert('Câmpul "Tip spațiu" este obligatoriu.');
        return;
      }
    }

    setLoading(true);
    setError("");

    try {
      const { sketch, ...data } = formData;

      const selectedUser =
        userStore.user && userStore.user.role === "admin"
          ? userStore.users.find((u) => u.id === formData.userId)
          : userStore.user;
      if (!selectedUser || !selectedUser.id) throw new Error("User not found");

      const announcementDraft = {
        ...data,
        announcementType: normalizeAnnouncementType(data.announcementType),
        price: Number(data.price),
        rooms: Number(data.rooms),
        baths: Number(data.baths),
        numberOfKitchens: Number(data.numberOfKitchens),
        floor: Number(data.floor),
        surface: Number(data.surface),
        landSurface: Number(data.landSurface),
        streetFrontLength: Number(data.streetFrontLength) ?? 0,
        balconyCount:
          data.balconyCount !== undefined && data.balconyCount !== null ? Number(data.balconyCount) : undefined,
        parkingCount:
          data.parkingCount !== undefined && data.parkingCount !== null ? Number(data.parkingCount) : undefined,
        status: canPublishImmediately ? "active" : "pending",
        phoneContact: contactPhone,
        user: { id: selectedUser.id as string, firebaseId: selectedUser.firebaseId ?? "" },
        deleteMedia: false,
      };

      // Update phone if changed
      const normalizePhone = (p: string) => p.replace(/^\+?4/, "").replace(/\s/g, "");
      if (normalizePhone(contactPhone) !== normalizePhone(userStore.user?.phoneNumber || "")) {
        if (userStore.user && typeof userStore.user.id === "string") {
          await userStore.updateUser(userStore.user.id, { phoneNumber: contactPhone });
        }
      }

      if (isEdit && announcementStore.currentAnnouncement?.id) {
        // EDIT
        announcementDraft.status = "active";
        announcementDraft.deleteMedia = true;

        await announcementStore.updateAnnouncement(announcementStore.currentAnnouncement.id, announcementDraft);

        await uploadMedia(announcementStore.currentAnnouncement.id);

        await new Promise((resolve) => setTimeout(resolve, 1000));

        window.location.href = `/announcements/${announcementStore.currentAnnouncement.id}`;
      } else {
        // CREATE
        const newAnnouncement =
          (await announcementStore.createAnnouncement(announcementDraft)) as unknown as PropertyAnnouncementModel;

        await uploadMedia(newAnnouncement.id);

        const isAdmin = userStore.user?.role === "admin";

        if (canPublishImmediately) {
          // record free payment for admin
          await announcementStore.createPaymentSession({
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
          await announcementStore.sendAnnouncementCreationMail(
            selectedUser.firstName ?? "",
            selectedUser.email ?? "",
            announcementUrl
          );

          window.location.href = `/payment-status?orderId=${newAnnouncement.id}&success=true`;
        } else {
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

          {userStore.user && userStore.user.role === "admin" && (
            <FormControl fullWidth sx={{ mb: 2 }}>
              <InputLabel id="user-select-label">Atribuie unui utilizator</InputLabel>
              <Select
                labelId="user-select-label"
                name="userId"
                value={formData.userId}
                label="Atribuie unui utilizator"
                onChange={(e) => setFormData((prev) => ({ ...prev, userId: e.target.value as string }))}
              >
                {userStore.users.map((u) => (
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
                label="Tip Proprietate"
                id="announcementType"
                value={formData.announcementType}
                options={propertyTypes}
                onChange={(e) => setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }))}
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

            {/* City */}
            <AutocompleteCities
              label="Oraș *"
              customWidth="100%"
              value={formData.city}
              onChange={(e, value) => setFormData((prev) => ({ ...prev, city: value || "" }))}
              error={isSubmitted && !formData.city}
              helperText={isSubmitted && !formData.city ? "Acest câmp este obligatoriu" : ""}
            />

            {/* Street */}
            {formData.announcementType !== "Teren" && (
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
                  required
                  error={isSubmitted && !formData.street}
                  helperText={isSubmitted && !formData.street ? "Acest câmp este obligatoriu" : ""}
                />
              </Box>
            )}

            {/* Title */}
            <Box width="100%">
              <Box width="100%" mb={2}>
                <Typography variant="subtitle1">Titlu</Typography>
                <Typography variant="caption" color="text.secondary" sx={{ mb: 1 }}>
                  Gândește-te la un titlu clar și captivant pentru a atrage potențiali cumpărători. Nu include majuscule,
                  numere de telefon, emailuri sau linkuri.
                </Typography>
                <StyledTextField
                  label="Titlu"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  fullWidth
                  required
                  error={isSubmitted && !formData.title}
                  helperText={isSubmitted && !formData.title ? "Acest câmp este obligatoriu" : ""}
                />
              </Box>
            </Box>

            {/* Description */}
            <Box width="100%" mb={2}>
              <Typography variant="subtitle1">Descriere</Typography>
              <Typography variant="caption" color="text.secondary" sx={{ mb: 1 }}>
                Vrei să atragi cumpărători serioși? Include detalii reale despre suprafață, camere, anul construcției,
                renovări, zonă și facilități. Evită exagerările.
              </Typography>
              <StyledTextField
                label="Descriere"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                multiline
                minRows={4}
                maxRows={20}
                fullWidth
                required
                error={isSubmitted && !formData.description}
                helperText={isSubmitted && !formData.description ? "Acest câmp este obligatoriu" : ""}
                sx={{
                  "& .MuiInputBase-inputMultiline": {
                    resize: "vertical",
                    overflow: "auto",
                  },
                }}
              />
            </Box>

            {/* Phone Number */}
            <PhoneInputField
              label="Număr de Telefon *"
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
              sx={{ marginBottom: "16px" }}
              required
              error={isSubmitted && !formData.price}
              helperText={isSubmitted && !formData.price ? "Acest câmp este obligatoriu" : ""}
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
              required
              error={isSubmitted && !formData.surface}
              helperText={isSubmitted && !formData.surface ? "Acest câmp este obligatoriu" : ""}
            />

            {/* Land Surface - only for houses */}
            {(formData.announcementType === "Casa" || formData.announcementType === "Case la tara") && (
              <>
                <TextField
                  label="Suprafață teren (mp)"
                  name="landSurface"
                  value={formData.landSurface}
                  onChange={handleInputChange}
                  type="number"
                  fullWidth
                  sx={{ marginBottom: "16px" }}
                  required
                  error={isSubmitted && !formData.landSurface}
                  helperText={isSubmitted && !formData.landSurface ? "Acest câmp este obligatoriu" : ""}
                />

                <Box width="100%" textAlign="center" mt={3}>
                  <Typography variant="h6">Front la stradă</Typography>
                  <Typography variant="caption" color="text.secondary" sx={{ mt: 1 }}>
                    Bifează dacă imobilul are deschidere directă la drum public. Aceasta este o caracteristică importantă
                    în evaluarea proprietății.
                  </Typography>
                </Box>

                <FormControl component="fieldset" sx={{ mt: 2 }}>
                  <RadioButtonsGroup
                    options={["Da", "Nu"]}
                    value={formData.streetFront ? "Da" : "Nu"}
                    id="streetFront"
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        streetFront: e.target.value === "Da",
                      }))
                    }
                    label=""
                  />
                </FormControl>

                {formData.streetFront && (
                  <TextField
                    label="Front la stradă (ml)"
                    name="streetFrontLength"
                    type="number"
                    value={formData.streetFrontLength || ""}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        streetFrontLength: Number(e.target.value),
                      }))
                    }
                    fullWidth
                    sx={{ marginTop: 2 }}
                  />
                )}

                <Box width="100%" textAlign="center" mt={3}>
                  <Typography variant="h6">Regim înălțime</Typography>
                  <Typography variant="caption" color="text.secondary" sx={{ mt: 1 }}>
                    Selectează nivelurile de înălțime existente ale clădirii. Poți alege mai multe opțiuni dacă este cazul
                    (ex: Subsol + Parter + Etaj).
                  </Typography>
                </Box>

                <Box display="flex" flexWrap="wrap" gap={2} mt={1}>
                  {HEIGHT_REGIMES.map((regime) => (
                    <FormControlLabel
                      key={regime}
                      control={
                        <Checkbox
                          checked={formData.heightRegime.includes(regime)}
                          onChange={() => {
                            setFormData((prev) => {
                              const selected = prev.heightRegime.includes(regime);
                              return {
                                ...prev,
                                heightRegime: selected
                                  ? prev.heightRegime.filter((r) => r !== regime)
                                  : [...prev.heightRegime, regime],
                              };
                            });
                          }}
                        />
                      }
                      label={regime}
                    />
                  ))}
                </Box>
              </>
            )}

            {formData.announcementType === "Teren" && (
              <>
                <TextField
                  label="La stradă / zonă"
                  name="street"
                  value={formData.street}
                  onChange={handleInputChange}
                  fullWidth
                  sx={{ mb: 2 }}
                  required
                  error={isSubmitted && !formData.street}
                  helperText={isSubmitted && !formData.street ? "Acest câmp este obligatoriu" : ""}
                />

                <TextField
                  label="Suprafață teren (mp)"
                  name="landSurface"
                  value={formData.landSurface}
                  onChange={handleInputChange}
                  type="number"
                  fullWidth
                  sx={{ mb: 2 }}
                  required
                  error={isSubmitted && !formData.landSurface}
                  helperText={isSubmitted && !formData.landSurface ? "Acest câmp este obligatoriu" : ""}
                />

                <TextField
                  label="Front la stradă (ml)"
                  name="streetFrontLength"
                  value={formData.streetFrontLength}
                  onChange={handleInputChange}
                  type="number"
                  fullWidth
                  sx={{ mb: 2 }}
                  required
                  error={isSubmitted && !formData.streetFrontLength}
                  helperText={isSubmitted && !formData.streetFrontLength ? "Acest câmp este obligatoriu" : ""}
                />

                <SelectDropdown
                  label="Tip teren"
                  name="landType"
                  value={formData.landType}
                  options={["Constructii", "Agricol", "Pădure", "Pășune", "Livadă"].map((v) => ({ id: v, value: v }))}
                  handleChange={handleSelectChange}
                />

                <SelectDropdown
                  label="Amplasare"
                  name="landPlacement"
                  value={formData.landPlacement}
                  options={["Intravilan", "Extravilan"].map((v) => ({ id: v, value: v }))}
                  handleChange={handleSelectChange}
                />

                <Box mt={3}>
                  <Typography variant="h6">Urbanism</Typography>
                  <Box display="flex" flexWrap="wrap" gap={2} mt={1}>
                    {["PUZ", "PUD", "Studiu GEO", "Certificat urbanism", "Autorizație construcție"].map((doc) => (
                      <FormControlLabel
                        key={doc}
                        control={
                          <Checkbox
                            checked={formData.urbanismDocuments.includes(doc)}
                            onChange={() => {
                              setFormData((prev) => {
                                const selected = prev.urbanismDocuments.includes(doc);
                                return {
                                  ...prev,
                                  urbanismDocuments: selected
                                    ? prev.urbanismDocuments.filter((d) => d !== doc)
                                    : [...prev.urbanismDocuments, doc],
                                };
                              });
                            }}
                          />
                        }
                        label={doc}
                      />
                    ))}
                  </Box>
                </Box>

                <Box mt={3}>
                  <Typography variant="h6">Utilități generale</Typography>
                  {(["curent", "apa", "canalizare", "gaz"] as Array<keyof typeof formData.utilities>).map((util) => (
                    <FormControl key={util} component="fieldset" sx={{ mt: 1 }}>
                      <Typography variant="subtitle1" sx={{ mb: 1 }}>
                        {util.charAt(0).toUpperCase() + util.slice(1)}
                      </Typography>
                      <RadioButtonsGroup
                        options={["Da", "Nu"]}
                        id={util}
                        value={
                          formData.utilities[util] === true
                            ? "Da"
                            : formData.utilities[util] === false
                            ? "Nu"
                            : ""
                        }
                        onChange={(e) =>
                          setFormData((prev) => ({
                            ...prev,
                            utilities: {
                              ...prev.utilities,
                              [util]: e.target.value === "Da",
                            },
                          }))
                        }
                        label=""
                      />
                    </FormControl>
                  ))}
                </Box>
              </>
            )}

            {formData.announcementType === "Comercial" && (
              <>
                <FormControl fullWidth required sx={{ mb: 2 }}>
                  <InputLabel id="commercial-space-type-label">Tip spațiu</InputLabel>
                  <Select
                    labelId="commercial-space-type-label"
                    id="commercialSpaceType"
                    value={formData.commercialSpaceType || ""}
                    label="Tip spațiu"
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        commercialSpaceType: e.target.value,
                      }))
                    }
                    required
                    error={isSubmitted && !formData.commercialSpaceType}
                  >
                    {["comercial", "birouri", "industrial"].map((option) => (
                      <MenuItem key={option} value={option}>
                        {option[0].toUpperCase() + option.slice(1)}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>

                <TextField
                  label="Suprafață utilă (mp)"
                  type="number"
                  fullWidth
                  sx={{ mb: 2 }}
                  value={formData.usableSurface || ""}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      usableSurface: Number(e.target.value),
                    }))
                  }
                  required
                  error={isSubmitted && !formData.usableSurface}
                  helperText={isSubmitted && !formData.usableSurface ? "Acest câmp este obligatoriu" : ""}
                />

                <TextField
                  label="Suprafață construită (mp)"
                  type="number"
                  fullWidth
                  sx={{ mb: 2 }}
                  value={formData.builtSurface || ""}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      builtSurface: Number(e.target.value),
                    }))
                  }
                />

                <TextField
                  label="Înălțime spațiu (m)"
                  type="number"
                  fullWidth
                  sx={{ mb: 2 }}
                  value={formData.spaceHeight || ""}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      spaceHeight: Number(e.target.value),
                    }))
                  }
                />

                <FormControl component="fieldset" sx={{ mb: 2 }}>
                  <Typography variant="h6">Vitrină la stradă</Typography>
                  <RadioGroup
                    row
                    value={formData.hasStreetWindow ? "Da" : "Nu"}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        hasStreetWindow: e.target.value === "Da",
                      }))
                    }
                  >
                    <FormControlLabel value="Da" control={<Radio />} label="Da" />
                    <FormControlLabel value="Nu" control={<Radio />} label="Nu" />
                  </RadioGroup>
                </FormControl>

                <TextField
                  label="Front vitrină la stradă (ml)"
                  type="number"
                  fullWidth
                  sx={{ mb: 2 }}
                  value={formData.streetWindowLength || ""}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      streetWindowLength: Number(e.target.value),
                    }))
                  }
                />

                <FormControl component="fieldset" sx={{ mb: 2 }}>
                  <Typography variant="h6">Intrare din stradă</Typography>
                  <RadioGroup
                    row
                    value={formData.hasStreetEntrance ? "Da" : "Nu"}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        hasStreetEntrance: e.target.value === "Da",
                      }))
                    }
                  >
                    <FormControlLabel value="Da" control={<Radio />} label="Da" />
                    <FormControlLabel value="Nu" control={<Radio />} label="Nu" />
                  </RadioGroup>
                </FormControl>

                <FormControl component="fieldset" sx={{ mb: 2 }}>
                  <Typography variant="h6">Lift</Typography>
                  <RadioGroup
                    row
                    value={formData.hasLift ? "Da" : "Nu"}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        hasLift: e.target.value === "Da",
                      }))
                    }
                  >
                    <FormControlLabel value="Da" control={<Radio />} label="Da" />
                    <FormControlLabel value="Nu" control={<Radio />} label="Nu" />
                  </RadioGroup>
                </FormControl>

                <FormControl component="fieldset" sx={{ mb: 2 }}>
                  <Typography variant="h6">Acces auto</Typography>
                  <Box display="flex" flexWrap="wrap" gap={1}>
                    {["TIR", "Autocar", "Camioane", "Autoturism"].map((vehicle) => (
                      <FormControlLabel
                        key={vehicle}
                        control={
                          <Checkbox
                            checked={formData.vehicleAccess.includes(vehicle)}
                            onChange={(e) => {
                              setFormData((prev) => {
                                const access = prev.vehicleAccess.includes(vehicle)
                                  ? prev.vehicleAccess.filter((v) => v !== vehicle)
                                  : [...prev.vehicleAccess, vehicle];
                                return { ...prev, vehicleAccess: access };
                              });
                            }}
                          />
                        }
                        label={vehicle}
                      />
                    ))}
                  </Box>
                </FormControl>
              </>
            )}

            {isApartment && (
              <>
                <SelectDropdown
                  label="Număr camere *"
                  options={roomOptions}
                  name="rooms"
                  value={formData.rooms}
                  handleChange={handleSelectChange}
                  error={isSubmitted && !formData.rooms}
                  helperText={isSubmitted && !formData.rooms ? "Acest câmp este obligatoriu" : ""}
                />

                <SelectDropdown
                  label="Număr băi"
                  options={roomOptions}
                  name="baths"
                  value={formData.baths}
                  handleChange={handleSelectChange}
                />

                <SelectDropdown
                  label="Număr bucătării"
                  options={kitchenOptionsMax2}
                  name="numberOfKitchens"
                  value={formData.numberOfKitchens}
                  handleChange={handleSelectChange}
                />

                <SelectDropdown
                  label="Compartimentare"
                  options={apartamentPartitionings}
                  name="partitioning"
                  value={formData.partitioning}
                  handleChange={handleSelectChange}
                />

                <SelectDropdown
                  label="Nivel confort"
                  options={comfortLevels}
                  name="comfortLevel"
                  value={formData.comfortLevel}
                  handleChange={handleSelectChange}
                />

                <SelectDropdown
                  label="Etaj"
                  options={apartmentFloors}
                  name="floor"
                  value={formData.floor}
                  handleChange={handleSelectChange}
                />

                <SelectDropdown
                  label="Număr balcoane"
                  options={balconyCounts}
                  name="balconyCount"
                  value={formData.balconyCount}
                  handleChange={handleSelectChange}
                />

                <SelectDropdown
                  label="Tip balcon"
                  options={balconyTypes.map((type, index) => ({ id: index, value: type }))}
                  name="balcony"
                  value={formData.balcony}
                  handleChange={handleSelectChange}
                />

                <SelectDropdown
                  label="Parcare/Garaj (număr)"
                  options={parkingCounts}
                  name="parkingCount"
                  value={formData.parkingCount}
                  handleChange={handleSelectChange}
                />

                <SelectDropdown
                  label="Tip parcare"
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
                <Typography variant="h6">Schiță / Plan</Typography>
                <Typography variant="caption" color="text.secondary" sx={{ mt: 1 }}>
                  Adaugă schița locuinței tale. Oferă o imagine clară a spațiului și ajută clienții să decidă mai ușor dacă
                  oferta e potrivită. Anunțurile cu schiță au șanse cu 50% mai mari să genereze interes.
                </Typography>
              </Box>

              <ThumbnailPreviewWrapper onClick={() => setOpenModal(true)}>
                {sketchPreview ? (
                  <ThumbnailPreviewImage src={sketchPreview} alt="Previzualizare schiță" />
                ) : (
                  <Typography sx={{ color: "#aaa", textAlign: "center" }}>Click pentru a încărca sau a selecta</Typography>
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
                      <input type="file" accept=".png,.jpg,.jpeg" onChange={handleSketchChange} ref={sketchFileInputRef} />
                    </Box>
                  )}

                  {tabIndex === 1 && (
                    <PreviewContainer>
                      {PREDEFINED_SKETCHES.map((src, index) => (
                        <PreviewFile key={index} onClick={() => handlePredefinedSketchClick(src.src)}>
                          <Typography variant="body2">Schiță {index + 1}</Typography>
                          <ThumbnailPreviewImage
                            src={typeof src === "string" ? src : src.src}
                            alt={`Schiță ${index + 1}`}
                          />
                        </PreviewFile>
                      ))}
                    </PreviewContainer>
                  )}

                  <Box mt={2} p={2} bgcolor="#fff7e6" border="1px dashed #ffa726" borderRadius={2}>
                    <Typography variant="body2" fontWeight="500">
                      📝 Sugestie:
                    </Typography>
                    <Typography variant="body2">
                      DACA NU AI GĂSIT SCHIȚA IMOBILULUI ÎN DOSARUL TĂU CU ACTE, NICI ÎN MODELE CREATE DE NOI, TE SFĂTUIM SĂ
                      FACI O SCHIȚĂ DE MÂNĂ, O FOTOGRAFIEZI ȘI O ADAUGI LA ANUNȚ.
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

            {/* Images */}
            <Box width="100%" textAlign="center">
              <Typography variant="h6">Adaugă imagini</Typography>
              <Typography variant="caption" color="text.secondary" sx={{ mt: 1 }}>
                Alege imagini clare și bine iluminate care prezintă interiorul și exteriorul imobilului (fațadă, casa
                scării, lift, stradă etc.). Pozele bune atrag mai mulți clienți!
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

            {/* ---------- NEW: Reorderable image list ---------- */}
            <PreviewContainer>
              {imageItems.map((item, index) => {
                const src = item.url || URL.createObjectURL(item.file!);
                return (
                  <PreviewItem
                    key={index}
                    draggable
                    onDragStart={() => onImageDragStart(index)}
                    onDragOver={onImageDragOver}
                    onDrop={() => onImageDrop(index)}
                    title="Trage pentru a rearanja. Click pentru a șterge."
                  >
                    <PreviewImage src={src} alt={`Image ${index}`} onClick={() => handleImageRemove(index)} />
                    <Controls>
                      {imageItems.length > 1 && (
                        <>
                          <button
                            aria-label="Mută la stânga"
                            onClick={(e) => { e.stopPropagation(); moveImageLeft(index); }}
                          >
                            ◀︎
                          </button>
                          <button
                            aria-label="Mută la dreapta"
                            onClick={(e) => { e.stopPropagation(); moveImageRight(index); }}
                          >
                            ▶︎
                          </button>
                        </>
                      )}
                      <span style={{ fontSize: 12, opacity: 0.8 }}>#{index + 1}</span>
                    </Controls>
                  </PreviewItem>
                );
              })}
            </PreviewContainer>

            {/* Videos */}
            <Box width="100%" textAlign="center">
              <Typography variant="h6">Adaugă videoclipuri</Typography>
              <Typography variant="caption" color="text.secondary" sx={{ mt: 1 }}>
                Încarcă un clip scurt (ideal vertical, tip TikTok sau Instagram) care evidențiază avantajele locuinței.
                Clipurile video cresc șansele de vânzare cu până la 70%!
              </Typography>
            </Box>

            <UploadInfoBox maxFiles={MAX_VIDEOS} maxSizeMB={MAX_VIDEO_SIZE / 1024 / 1024} uploadedCount={videoItems.length} />

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

            {/* ---------- NEW: Reorderable video list ---------- */}
            <PreviewContainer>
              {videoItems.map((item, index) => {
                const src = item.url || URL.createObjectURL(item.file!);
                return (
                  <PreviewItem
                    key={index}
                    draggable
                    onDragStart={() => onVideoDragStart(index)}
                    onDragOver={onVideoDragOver}
                    onDrop={() => onVideoDrop(index)}
                    title="Trage pentru a rearanja. Click pentru a șterge."
                  >
                    <PreviewVideo src={src} controls onClick={() => handleVideoRemove(index)} />
                    <Controls>
                      {videoItems.length > 1 && (
                        <>
                          <button
                            aria-label="Mută la stânga"
                            onClick={(e) => { e.stopPropagation(); moveVideoLeft(index); }}
                          >
                            ◀︎
                          </button>
                          <button
                            aria-label="Mută la dreapta"
                            onClick={(e) => { e.stopPropagation(); moveVideoRight(index); }}
                          >
                            ▶︎
                          </button>
                        </>
                      )}
                      <span style={{ fontSize: 12, opacity: 0.8 }}>#{index + 1}</span>
                    </Controls>
                  </PreviewItem>
                );
              })}
            </PreviewContainer>

            {error && (
              <Typography color="error" sx={{ mt: 1 }}>
                {error}
              </Typography>
            )}
          </InputContainer>

          {/* Submit Button */}
          <PrimaryButton text={isEdit ? "Actualizează Anunțul" : "Creează Anunțul"} onClick={() => onSubmit()} sx={{ marginTop: "20px" }} />
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
