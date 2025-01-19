"use client";

import { Box, CircularProgress, SelectChangeEvent, Tooltip, Typography } from "@mui/material";
import React, { ChangeEvent, useEffect, useState } from "react";
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
import { useParams, usePathname, useRouter } from "next/navigation";

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
  padding: 12px;
  gap: 16px;
`;

const SubtitleAdvice = styled.h2`
  font-weight: 300;
  font-size: 20px;
  margin-bottom: 50px;
`;

const AnnouncementForm = () => {
  const {
    userStore: { user, getCurrentUser, updateUser },
    announcementStore: { createAnnouncement, updateAnnouncement, currentAnnouncement },
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
  });
  const [contactPhone, setContactPhone] = useState<string>(user?.phoneNumber || "");
  const [thumbnailPreview, setThumbnailPreview] = useState<string | null>(null); // Preview URL
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>("");

  const router = useRouter();
  const pathname = usePathname();
  const params = useParams();
  const isEdit = params?.id && pathname.includes("/edit-announcement");

  // Load current user
  useEffect(() => {
    if (!user?.id) {
      getCurrentUser();
    }
  }, [user]);

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
      setFormData({ ...formData, thumbnail: file });
      setThumbnailPreview(URL.createObjectURL(file));
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
      // Step 1: Create a new object without the thumbnail property
      const { thumbnail, ...data } = formData;

      if (contactPhone !== user?.phoneNumber) {
        if (user?.id) {
          await updateUser(user.id, { phoneNumber: contactPhone });
        }
      }

      // Step 2: Create or update the announcement (without the thumbnail)
      let announcementId = "";
      if (isEdit) {
        await updateAnnouncement(params.id as string, { 
          ...data, 
          price: Number(data.price),
          rooms: Number(data.rooms),
          baths: Number(data.baths),
          numberOfKitchens: Number(data.numberOfKitchens),
          floor: Number(data.floor),
          surface: Number(data.surface)
        });
        announcementId = params.id as string;
      } else {
        const newAnnouncement = await createAnnouncement({
          ...data,
          announcementType: data.announcementType.toLowerCase(),
          price: Number(data.price),
          rooms: Number(data.rooms),
          baths: Number(data.baths),
          numberOfKitchens: Number(data.numberOfKitchens),
          floor: Number(data.floor),
          surface: Number(data.surface),
          user: {
            id: user?.id || "",
            firebaseId: user?.firebaseId || ""
          }
        }) as unknown as PropertyAnnouncementModel;
        announcementId = newAnnouncement.id; // Assume the response contains the new ID
      }

      // Step 3: Upload the thumbnail (if provided)
      if (thumbnail && announcementId) {
        const formDataToSend = new FormData();
        formDataToSend.append("file", thumbnail);
        formDataToSend.append("type", "image");

        const response = await fetch(`/uploads/${user?.id}/${announcementId}`, {
          method: "POST",
          body: formDataToSend,
        });

        if (response.ok) {
          const result = await response.json();
          const optimizedUrl = result.optimized_url; // Get the optimized image URL

          // Step 4: Update the announcement with the optimized image URL
          await updateAnnouncement(announcementId, { imageUrl: optimizedUrl });

          router.push("/");
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
        <CircularProgress />
      ) : (
        <>
          <SubtitleAdvice>{isEdit ? "Edit Announcement" : "Create Announcement"}</SubtitleAdvice>

          {error && (
            <Typography color="error" sx={{ marginBottom: "16px", textAlign: "center" }}>
              {error}
            </Typography>
          )}

          {/* Announcement Type */}
          <RadioButtonsGroup
            options={propertyTypes}
            value={formData.announcementType.toLowerCase()}
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

          {/* City */}
          <AutocompleteCities
            label="City"
            customWidth="100%"
            value={formData.city}
            onChange={(event, value) => setFormData({ ...formData, city: value || "" })}
          />

          {/* Street */}
          <TextField
            label="Street"
            name="street"
            value={formData.street}
            onChange={handleInputChange}
            fullWidth
            sx={{ marginBottom: "16px" }}
          />

          {/* Title */}
          <TextField
            label="Title"
            name="title"
            value={formData.title}
            onChange={handleInputChange}
            fullWidth
            sx={{ marginBottom: "16px" }}
          />

          {/* Description */}
          <TextField
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
          <Box sx={{ marginBottom: "16px", width: "100%" }}>
            <Typography variant="h6">Thumbnail Image</Typography>
            {thumbnailPreview && (
              <img
                src={thumbnailPreview}
                alt="Thumbnail Preview"
                style={{ width: "100%", maxHeight: "200px", objectFit: "cover", marginTop: "8px" }}
              />
            )}
            <input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              style={{ marginTop: "8px" }}
            />
          </Box>

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

export default observer(AnnouncementForm);
