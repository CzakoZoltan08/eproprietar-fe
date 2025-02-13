"use client";

import * as breakpoints from "@/constants/breakpoints";
import * as palette from "@/constants/colors";

import { Box, CircularProgress, TextField, Tooltip } from "@mui/material";
import React, { ChangeEvent, useState } from "react";
import { propertyTypes, serviceTypes } from "@/constants/annountementConstants";

import AutocompleteCities from "@/common/autocomplete/AutocompleteCities";
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
};

const ResidentialAnnouncementForm = () => {
  const { userStore, announcementStore } = useStore();
  const { user, updateUser } = userStore;
  const { createAnnouncement } = announcementStore;
  const router = useRouter();

  const [formData, setFormData] = useState(INITIAL_DATA);
  const [formErrors, setFormErrors] = useState(INITIAL_DATA);
  const [loading, setLoading] = useState(false);
  const [contactPhone] = useState(user?.phoneNumber || "");

  const handleDateChange = (date: Date | null) => {
    setFormData((prev) => ({ ...prev, endDate: date?.toString() || "" }));
  };

  const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    const error = generalValidation(
      residentialAnnouncementValidationSchema,
      formData,
      name
    );
    setFormErrors((prev) => ({ ...prev, [name]: error }));
  };

  const handleSubmit = async () => {
    const errors = generalValidation(residentialAnnouncementValidationSchema, formData);
    if (errors && typeof errors === "object") {
      setFormErrors({ ...formErrors, ...errors });
      return;
    }

    try {
      setLoading(true);
      if (user?.id && user.firebaseId) {
        if (contactPhone !== user.phoneNumber) {
          await updateUser(user.id, { phoneNumber: contactPhone });
        }

        const announcementData = {
          ...formData,
          announcementType: formData.announcementType.toLowerCase(),
          rooms: 0,
          surface: 0,
          user: { id: user.id, firebaseId: user.firebaseId },
          price: 0,
          transactionType: serviceTypes[0],
          status: "active",
        };

        await createAnnouncement(announcementData);
        router.push("/");
      }
    } catch (error) {
      console.error("Error creating announcement:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Styled.Container>
      {loading ? (
        <CircularProgress size={42} />
      ) : (
        <>
          <Styled.Subtitle>Anunț ansamblu rezidențial</Styled.Subtitle>
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
                required
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
              required
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
          </Styled.FormBox>
          <PrimaryButton text="Creează anunțul" onClick={handleSubmit} />
        </>
      )}
    </Styled.Container>
  );
};

export default observer(ResidentialAnnouncementForm);