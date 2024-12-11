"use client";

import * as breakpoints from "@/constants/breakpoints";
import * as palette from "@/constants/colors";

import { Box, CircularProgress, SelectChangeEvent, Tooltip } from "@mui/material";
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
import RadioButtonsGroup from "@/common/radio/RadioGroup";
import SelectDropdown from "@/common/dropdown/SelectDropdown";
import TextField from "@mui/material/TextField";
import { announcementValidationSchema } from "@/app/create-announcement/validationSchema";
import { generalValidation } from "@/utils/generalValidation";
import { observer } from "mobx-react";
import styled from "styled-components";
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
  announcementType: "",
  providerType: "owner",
  transactionType: "",
  title: "",
  price: "",
  surface: "",
  city: "",
  street: "",
  description: "",
  rooms: "",
  baths: "",
  partitioning: "",
  comfortLevel: "",
  floor: "",
  numberOfKitchens: "",
  balcony: "",
  parking: "",
};

const AnnouncementForm = () => {
  const {
    userStore: { user, getCurrentUser, updateUser },
    announcementStore: {
      createAnnouncement,
      currentAnnouncement,
      getAnnouncementById,
      updateAnnouncement,
    },
  } = useStore();

  const [formData, setFormData] = useState(INITIAL_DATA);
  const [formErrors, setFormErrors] = useState(INITIAL_DATA);
  const [loading, setLoading] = React.useState<boolean>(false);
  const [contactPhone, setContactPhone] = React.useState(
    user?.phoneNumber || "",
  );
  const [formError, setFormError] = React.useState("");

  const router = useRouter();
  const pathname = usePathname();
  const params = useParams();
  const isEdit = params?.id && pathname.includes("/edit-announcement");

  useEffect(() => {
    if (!user?.id) {
      getCurrentUser();
    }
  }, [user]);

  useEffect(() => {
    if (isEdit && !currentAnnouncement?.id) {
      (async () => {
        await getAnnouncementById(params.id as string);
      })();
    }
  }, []);

  const capitalizeFirstLetter = (str: string) => {
    return str.charAt(0).toUpperCase() + str.slice(1);
  };

  useEffect(() => {
    if (currentAnnouncement?.id) {
      setFormData({
        announcementType: capitalizeFirstLetter(
          currentAnnouncement.announcementType,
        ),
        providerType: currentAnnouncement.providerType,
        transactionType: currentAnnouncement.transactionType,
        title: currentAnnouncement.title,
        price: currentAnnouncement.price?.toString(),
        surface: currentAnnouncement.surface?.toString(),
        city: currentAnnouncement.city,
        street: currentAnnouncement.street || "",
        description: currentAnnouncement.description,
        rooms: currentAnnouncement.rooms.toString(),
        baths: currentAnnouncement?.baths?.toString() || "",
        partitioning: currentAnnouncement.partitioning || "",
        comfortLevel: currentAnnouncement.comfortLevel?.toString() || "",
        floor: currentAnnouncement.floor.toString(),
        numberOfKitchens:
          currentAnnouncement.numberOfKitchens?.toString() || "",
        balcony: currentAnnouncement.balcony || "",
        parking: currentAnnouncement.parking || "",
      });

      if (currentAnnouncement?.user?.phoneNumber) {
        setContactPhone(currentAnnouncement?.user?.phoneNumber);
      }
    }
  }, [currentAnnouncement]);

  const handleSelectChange = (
    event: SelectChangeEvent<string | number>,
  ) => {
    const { name, value } = event.target;
    const updatedFormData = {
      ...formData,
      [name]: value,
    };
    setFormData(updatedFormData);

    const error = generalValidation(
      announcementValidationSchema,
      updatedFormData,
      name,
    );

    setFormErrors({
      ...formErrors,
      [name]: error,
    });
  };

  const handleInputChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = event.target;
    const updatedFormData = {
      ...formData,
      [name]: value,
    };
    setFormData(updatedFormData);

    const error = generalValidation(
      announcementValidationSchema,
      updatedFormData,
      name,
    );

    setFormErrors({
      ...formErrors,
      [name]: error,
    });
  };

  console.log("user", user);
  const onCreateUpdateAnnouncement = async () => {
    const errors = generalValidation(announcementValidationSchema, {
      announcementType: formData.announcementType,
      description: formData.description,
      transactionType: formData.transactionType,
      title: formData.title,
      price: formData.price,
      surface: formData.surface,
      city: formData.city,
    });
    console.log("errors", errors);
    if (errors && typeof errors === "object") {
      setFormErrors({
        ...formErrors,
        announcementType: errors.announcementType,
        description: errors.description,
        transactionType: errors.transactionType,
        title: errors.title,
        price: errors.price,
        surface: errors.surface,
        city: errors.city,
      });
      return;
    }

    if (!contactPhone) {
      setFormError("Numarul de telefon pentru contact este obligatoriu");
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
          rooms: Number(formData.rooms),
          surface: Number(formData.surface),
          price: Number(formData.price),
          floor: Number(formData.floor),
          numberOfKitchens: Number(formData.numberOfKitchens),
          baths: Number(formData.baths),
          user: { id: user.id, firebaseId: user.firebaseId },
        };

        if (isEdit) {
          await updateAnnouncement(params.id as string, data);
        } else {
          await createAnnouncement(data);
        }

        router.push("/");
      } else {
        console.log("user!!!!!!!!!!!!!!!!", user);
      }
    } catch (error) {
      console.log("error---", error);
      setFormError("Eroare la validări");
      // toast.error("Eroare la validări");
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
          {!isEdit && <SubtitleAdvice>Anunț proprietate</SubtitleAdvice>}

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
              onChange={handleSelectChange}
              label={"Tipul cautarii"}
              error={formErrors.announcementType}
            />
            <RadioButtonsGroup
              id={"transactionType"}
              options={serviceTypes}
              onChange={handleSelectChange}
              value={formData.transactionType}
              label={"Tipul tranzactiei"}
              error={formErrors.transactionType}
            />
            <AutocompleteCities
              onChange={(event, value) => {
                if (value) {
                  console.log("value", value);
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
              onChange={handleInputChange}
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
                onChange={handleInputChange}
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
              onChange={handleInputChange}
              error={!!formErrors.description}
              helperText={formErrors.description}
              sx={{ width: "100%" }}
              required={true}
              multiline
              rows={4}
            />
            <Tooltip title={"Atentie, pretul este in euro"}>
              <TextField
                id="announcemet-price"
                label={"Pret"}
                name={"price"}
                value={formData.price}
                onChange={handleInputChange}
                error={!!formErrors.price}
                helperText={formErrors.price}
                sx={{ width: "100%" }}
                required={true}
              />
            </Tooltip>
            <Tooltip title={"Suprafata exacta"}>
              <TextField
                id="announcemet-surface"
                label={"Suparafata utila in mp"}
                name={"surface"}
                value={formData.surface}
                onChange={handleInputChange}
                error={!!formErrors.surface}
                helperText={formErrors.surface}
                sx={{ width: "100%" }}
                required={true}
              />
            </Tooltip>
            <SelectDropdown
              label={"Nr. camere"}
              options={roomOptions}
              name={"rooms"}
              value={formData.rooms}
              handleChange={handleSelectChange}
              labelStyle={{ left: "16px" }}
            />
            <SelectDropdown
              label={"Compartimentare"}
              options={apartamentPartitionings}
              name={"apartamentPartitioning"}
              value={formData.partitioning}
              handleChange={handleSelectChange}
              labelStyle={{ left: "16px" }}
            />
            <SelectDropdown
              label={"Confort"}
              options={comfortLevels}
              name={"comfortLevel"}
              value={formData.comfortLevel}
              handleChange={handleSelectChange}
              labelStyle={{ left: "16px" }}
            />
            <SelectDropdown
              label={"Etaj"}
              options={apartmentFloors}
              name={"floor"}
              value={formData.floor}
              handleChange={handleSelectChange}
              labelStyle={{ left: "16px" }}
            />
            <SelectDropdown
              label={"Nr bucatarii"}
              options={roomOptions}
              name={"numberOfKitchens"}
              value={formData.numberOfKitchens}
              handleChange={handleSelectChange}
              labelStyle={{ left: "16px" }}
            />
            <SelectDropdown
              label={"Nr băi"}
              options={roomOptions}
              name={"baths"}
              value={formData.baths}
              handleChange={handleSelectChange}
              labelStyle={{ left: "16px" }}
            />

            <RadioButtonsGroup
              options={balconyTypes}
              value={formData.balcony}
              id={"balcony"}
              onChange={handleSelectChange}
              label={"Balcon:"}
            />
            <RadioButtonsGroup
              options={parkingTypes}
              value={formData.parking}
              id={"parking"}
              onChange={handleSelectChange}
              label={"Parcare:"}
            />
          </Box>

          {!user?.phoneNumber && (
            <PhoneInputField
              label={"Numar de telefon pentru contact"}
              name={"contactPhone"}
              value={contactPhone}
              onChange={(phoneValue) => setContactPhone(phoneValue)}
              error={formError}
              setError={(error) => setFormError(error)}
            />
          )}

          <PrimaryButton
            text={isEdit ? "Editeaza anunțul" : "Creeaza anunțul"}
            onClick={onCreateUpdateAnnouncement}
            sx={{ marginTop: "32px" }}
          />
        </>
      )}
    </Container>
  );
};

export default observer(AnnouncementForm);
