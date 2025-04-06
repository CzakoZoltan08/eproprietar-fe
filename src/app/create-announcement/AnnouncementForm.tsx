"use client";

import { CircularProgress, SelectChangeEvent, Typography } from "@mui/material";
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
import PhoneInputField from "@/common/input/PhoneInputField";
import { PrimaryButton } from "@/common/button/PrimaryButton";
import { PropertyAnnouncementModel } from "@/models/announcementModels";
import RadioButtonsGroup from "@/common/radio/RadioGroup";
import SelectDropdown from "@/common/dropdown/SelectDropdown";
import TextField from "@mui/material/TextField";
import { observer } from "mobx-react";
import styled from "styled-components";
import { useStore } from "@/hooks/useStore";

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

const DropArea = styled.div<{ $isDragging: boolean }>`
  border: 2px dashed ${({ $isDragging }) => ($isDragging ? "#007BFF" : "#ccc")};
  background-color: ${({ $isDragging }) => ($isDragging ? "#f0f8ff" : "transparent")};
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
`

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

const AnnouncementFormContent = () => {
  const {
    userStore: { user, getCurrentUser, updateUser },
    announcementStore: { updateAnnouncement, createImageOrVideo, currentAnnouncement, createAnnouncement },
  } = useStore();

  const [formData, setFormData] = useState({
    announcementType: "",
    providerType: "owner",
    transactionType: "",
    title: "",
    description: "",
    price: "",
    surface: "",
    city: "",
    street: "",
    rooms: "",
    baths: "",
    partitioning: "",
    comfortLevel: "",
    floor: "",
    numberOfKitchens: "",
    balcony: "",
    parking: "",
    thumbnail: null as File | null, // Thumbnail file
    images: [] as File[],
    videos: [] as File[], // Store multiple videos
  });
  const [contactPhone, setContactPhone] = useState<string>(user?.phoneNumber || "");
  const [thumbnailPreview, setThumbnailPreview] = useState<string | null>(null); // Preview URL
  const thumbnailFileInputRef = useRef<HTMLInputElement>(null);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]); // Store preview URLs for images
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>("");
  const [isDragging, setIsDragging] = useState(false); // Highlight drag area
  const fileInputRef = useRef<HTMLInputElement>(null); // Reference to hidden file inpu
  const [videoPreviews, setVideoPreviews] = useState<string[]>([]); // Store preview URLs for videos
  const [isDraggingVideos, setIsDraggingVideos] = useState(false);
  const videoFileInputRef = useRef<HTMLInputElement>(null);

  const pathname = usePathname();
  const params = useParams();
  const searchParams = useSearchParams();
  const isEdit = params?.id && pathname.includes("/edit-announcement");

  // Load current user
  useEffect(() => {
    if (!user?.id) {
      getCurrentUser();
    }
  }, [user]);

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
      setFormData({
        announcementType: currentAnnouncement.announcementType || "",
        providerType: formData.providerType, // Add providerType here
        transactionType: currentAnnouncement.transactionType || "",
        title: currentAnnouncement.title || "",
        description: currentAnnouncement.description || "",
        price: currentAnnouncement.price?.toString() || "",
        surface: currentAnnouncement.surface?.toString() || "",
        city: currentAnnouncement.city || "",
        street: currentAnnouncement.street || "",
        rooms: currentAnnouncement.rooms?.toString() || "",
        baths: currentAnnouncement.baths?.toString() || "",
        partitioning: currentAnnouncement.partitioning || "",
        comfortLevel: currentAnnouncement.comfortLevel?.toString() || "",
        floor: currentAnnouncement.floor?.toString() || "",
        numberOfKitchens: currentAnnouncement.numberOfKitchens?.toString() || "",
        balcony: currentAnnouncement.balcony || "",
        parking: currentAnnouncement.parking || "",
        thumbnail: null,
        images: [],
        videos: [],
      });
      if (currentAnnouncement.imageUrl) {
        setThumbnailPreview(currentAnnouncement.imageUrl);
      }
      if (currentAnnouncement?.user?.phoneNumber) {
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

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
  
    if (file) {
      const img = new Image();
      img.src = URL.createObjectURL(file);
      
      img.onload = () => {
        if (img.width > 1920 || img.height > 1080) {
          setError("Image resolution cannot exceed 1920x1080.");
          return;
        }
  
        setFormData({ ...formData, thumbnail: file });
        setThumbnailPreview(img.src);
        setError('');
      };
    }
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

  const uploadMedia = async (announcementId: string) => {
    try {
      for (const image of formData.images) {
        const formDataToSend = new FormData();
        formDataToSend.append("file", image);
        formDataToSend.append("type", "image");
        await createImageOrVideo(formDataToSend, user?.id || "", announcementId);
      }

      if (formData.thumbnail && announcementId) {
        const formDataToSend = new FormData();
        formDataToSend.append("file", formData.thumbnail);
        formDataToSend.append("type", "image");

        if (user?.id) {
          const response = await createImageOrVideo(formDataToSend, user.id, announcementId);

          if (response.optimized_url) {
            const optimizedUrl = response.optimized_url; // Get the optimized image URL
  
            // Step 4: Update the announcement with the optimized image URL
            await updateAnnouncement(announcementId, { imageUrl: optimizedUrl });
          }
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

  const onSubmit = async () => {
    if (!formData.title || !formData.description || !formData.price || !formData.city) {
      setError("Please fill in all required fields.");
      return;
    }
  
    if (!contactPhone) {
      setError("Contact phone number is required.");
      return;
    }
  
    setLoading(true);
    setError("");
  
    try {
      const { thumbnail, ...data } = formData;
  
      const announcementDraft = {
        ...data,
        announcementType: data.announcementType.toLowerCase(),
        price: Number(data.price),
        rooms: Number(data.rooms),
        baths: Number(data.baths),
        numberOfKitchens: Number(data.numberOfKitchens),
        floor: Number(data.floor),
        surface: Number(data.surface),
        status: "pending",
        user: {
          id: user?.id || "",
          firebaseId: user?.firebaseId || ""
        }
      };
  
      // 1. Update phone number if changed
      if (contactPhone !== user?.phoneNumber && user?.id) {
        await updateUser(user.id, { phoneNumber: contactPhone });
      }

      // 2. Actually create the announcement
      const newAnnouncement = await createAnnouncement(announcementDraft) as unknown as PropertyAnnouncementModel;

      // 4. Upload media in the background
      await uploadMedia(newAnnouncement.id);

      // 5. Update thumbnail if needed
      if (formData.thumbnail) {
        const formDataToSend = new FormData();
        formDataToSend.append("file", formData.thumbnail);
        formDataToSend.append("type", "image");

        const response = await createImageOrVideo(formDataToSend, user?.id || "", newAnnouncement.id);
        if (response?.optimized_url) {
          await updateAnnouncement(newAnnouncement.id, { imageUrl: response.optimized_url });
        }
      }
  
      // Immediately redirect
      window.location.href = `/payment-packages?announcementId=${newAnnouncement.id}`;
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
          <Typography mt={2}>Creating your announcement. Please wait...</Typography>
        </>
      ) : (
        <>
          <SubtitleAdvice>{isEdit ? "Edit Announcement" : "Create Announcement"}</SubtitleAdvice>

          {error && (
            <Typography color="error" sx={{ marginBottom: "16px", textAlign: "center" }}>
              {error}
            </Typography>
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
          
            {/* City */}
            <AutocompleteCities
              label="City"
              customWidth="100%"
              value={formData.city}
              onChange={(event, value) => setFormData({ ...formData, city: value || "" })}
            />

            {/* Street */}
            <StyledTextField
              label="Street"
              name="street"
              value={formData.street}
              onChange={handleInputChange}
              fullWidth
              sx={{ marginBottom: "16px" }}
            />

            {/* Title */}
            <StyledTextField
              label="Title"
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              fullWidth
              sx={{ marginBottom: "16px" }}
            />

            {/* Description */}
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

            {/* Thumbnail Upload */}
            <ThumbnailContainer>
              <Typography variant="h6">Thumbnail Image</Typography>
              
              <ThumbnailPreviewWrapper onClick={() => thumbnailFileInputRef.current?.click()}>
                {thumbnailPreview ? (
                  <ThumbnailPreviewImage src={thumbnailPreview} alt="Thumbnail Preview" />
                ) : (
                  <Typography sx={{ color: "#aaa", textAlign: "center" }}>
                    No Image
                  </Typography>
                )}
              </ThumbnailPreviewWrapper>

              <input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                style={{ display: "none" }}
                ref={thumbnailFileInputRef}
              />
            </ThumbnailContainer>

            <Typography variant="h6">Add Images</Typography>

            <DropArea
              $isDragging={isDragging}
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

            <DropArea
              $isDragging={isDraggingVideos}
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
              <Typography color="error">{error}</Typography>
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

const AnnouncementForm = () => {
  return (
    <Suspense fallback={<CircularProgress size={50} style={{ marginTop: "50px" }} />}>
      <AnnouncementFormContent />
    </Suspense>
  );
};

export default observer(AnnouncementForm);
