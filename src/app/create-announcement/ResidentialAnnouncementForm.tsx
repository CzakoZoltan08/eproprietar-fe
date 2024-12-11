"use client";

import * as breakpoints from "@/constants/breakpoints";
import * as palette from "@/constants/colors";

import { Box, CircularProgress, Tooltip } from "@mui/material";
import React, { ChangeEvent, useState } from "react";
import { propertyTypes, serviceTypes } from "@/constants/annountementConstants";

import AutocompleteCities from "@/common/autocomplete/AutocompleteCities";
import { PrimaryButton } from "@/common/button/PrimaryButton";
import PrimaryDatePicker from "@/common/datepicker/PrimaryDatePicker";
import RadioButtonsGroup from "@/common/radio/RadioGroup";
import TextField from "@mui/material/TextField";
import { generalValidation } from "@/utils/generalValidation";
import { observer } from "mobx-react";
import { residentialAnnouncementValidationSchema } from "@/app/create-announcement/validationSchema";
import styled from "styled-components";
import { useRouter } from "next/navigation";
import { useStore } from "@/hooks/useStore";

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  border-radius: 8px;
  boder: 1px solid ${palette.COLOR_LIGHT_GREY};
  color: ${palette.COLOR_TEXT};
  background: ${palette.COLOR_WHITE};
  padding: 24px;
`;

const SubtitleAdvice = styled.h2`
  font-weight: 300;
  font-size: 20px;
  @media only screen and (max-width: ${breakpoints.MIN_PHONE}) {
    font-size: 18px;
  }
  margin-bottom: 50px;
`;

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
  const {
    userStore: { user, getCurrentUser, updateUser },
    announcementStore: {
      createAnnouncement,
      currentAnnouncement,
      getAnnouncementById,
      updateAnnouncement,
    },
  } = useStore();
  const router = useRouter();

  const [formData, setFormData] = useState(INITIAL_DATA);
  const [formErrors, setFormErrors] = useState(INITIAL_DATA);
  const [loading, setLoading] = React.useState<boolean>(false);
  const [contactPhone, setContactPhone] = React.useState(
    user?.phoneNumber || "",
  );
  const onChangeDate = (date: Date | null) => {
    setFormData({ ...formData, endDate: date?.toString() ?? '' });
  };
  const onChange = (
    event: ChangeEvent<HTMLTextAreaElement | HTMLInputElement>,
  ) => {
    const { name, value } = event.target;

    const updatedFormData = {
      ...formData,
      [name]: value,
    };
    setFormData(updatedFormData);

    const error = generalValidation(
      residentialAnnouncementValidationSchema,
      updatedFormData,
      name,
    );

    setFormErrors({
      ...formErrors,
      [name]: error,
    });
  };

  const onCreateUpdateAnnouncement = async () => {
    const errors = generalValidation(
      residentialAnnouncementValidationSchema,
      formData,
    );
    console.log("errors", errors);
    if (errors && typeof errors === "object") {
      setFormErrors({
        ...formErrors,
        title: errors.title,
        description: errors.description,
        city: errors.city,
        announcementType: errors.announcementType,
      });
      return;
    }

    try {
      setLoading(true);
      if (user?.id && user.firebaseId) {
        if (contactPhone !== user?.phoneNumber) {
          await updateUser(user.id, { phoneNumber: contactPhone });
        }

        const data = {
          ...formData,
          announcementType: formData.announcementType.toLowerCase(),
          rooms: 0,
          surface: 0,
          user: { id: user.id, firebaseId: user.firebaseId },
          price: 0,
          transactionType: serviceTypes[0],
        };

        await createAnnouncement(data);
        router.push("/");
      } else {
        console.log("user!!!!!!!!!!!!!!!!", user);
      }
    } catch (error) {
    } finally {
      setLoading(false);
    }
  };

  console.log("formData", formData);
  return (
    <Container>
      {loading ? (
        <CircularProgress
          sx={{
            margin: "0 auto",
          }}
          size={42}
        />
      ) : (
        <>
          <SubtitleAdvice>Anunț ansamblu rezidențial</SubtitleAdvice>

          <Box
            flex={1}
            display="flex"
            justifyContent="center"
            alignItems="flex-start"
            flexDirection="column"
            gap={"16px"}
          >
            <RadioButtonsGroup
              options={propertyTypes}
              value={formData.announcementType}
              id={"announcementType"}
              onChange={onChange}
              label={"Tipul cautarii"}
              error={formErrors.announcementType}
            />
            <AutocompleteCities
              onChange={(event, value) => {
                if (value) {
                  setFormData({ ...formData, city: value });
                }
              }}
              label={"Localizare (oras/comuna)"}
              customWidth={"100%"}
              error={formErrors.city}
              value={formData.city}
            />
            <TextField
              id="announcemet-street"
              label={"Detalii localizare (strada)"}
              name={"street"}
              value={formData.street}
              onChange={onChange}
              error={!!formErrors.street}
              helperText={formErrors.street}
              sx={{ width: "100%" }}
            />
            <Tooltip
              title={
                "Titlu anunt: e un mod prin care poti concura cu alte proprietati, fii creativ dar corect"
              }
            >
              <TextField
                id="announcemet-title"
                label={"Titlu Anunt"}
                name={"title"}
                value={formData.title}
                onChange={onChange}
                error={!!formErrors.title}
                helperText={formErrors.title}
                sx={{ width: "100%" }}
                required={true}
              />
            </Tooltip>
            <TextField
              id="announcemet-descr"
              label={"Descriere"}
              name={"description"}
              value={formData.description}
              onChange={onChange}
              error={!!formErrors.description}
              helperText={formErrors.description}
              sx={{ width: "100%" }}
              required={true}
              multiline
              rows={4}
            />
            <TextField
              id="announcemet-stage"
              label={"Stadiul in care se afla ansamblul"}
              name={"stage"}
              value={formData.stage}
              onChange={onChange}
              error={!!formErrors.stage}
              helperText={formErrors.stage}
              sx={{ width: "100%" }}
            />
            <PrimaryDatePicker
              name={"endDate"}
              label={"Termen de finalizare"}
              value={formData.endDate}
              error={formErrors.endDate || ""}
              handleChange={onChangeDate}
            />
          </Box>
          <PrimaryButton
            text={"Creeaza anunțul"}
            onClick={onCreateUpdateAnnouncement}
            sx={{ marginTop: "32px" }}
          />
        </>
      )}
    </Container>
  );
};

export default observer(ResidentialAnnouncementForm);
