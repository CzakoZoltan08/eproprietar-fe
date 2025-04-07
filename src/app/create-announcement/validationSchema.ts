import Joi from "joi";

const sharedMessages = {
  emptyField: "Campul este obligatoriu",
  emptyCity: "Orasul trebuie selectat",
  emptyCover: "error:emptyCover",
};

const sharedFields = {
  announcementType: Joi.string().messages({
    "string.empty": "Tipul anuntului este obligatoriu",
  }),
  description: Joi.string().messages({
    "string.empty": "Descrerea anuntului este obligatorie",
  }),
  providerType: Joi.string().messages({
    "string.empty": sharedMessages.emptyField,
  }),
  propertyType: Joi.string().messages({
    "string.empty": "Tipul proptietatii este obligatoriu",
  }),
  title: Joi.string().messages({
    "string.empty": "Titlul anuntului este obligatoriu",
  }),
  city: Joi.string().messages({
    "string.empty": sharedMessages.emptyCity,
  }),
  street: Joi.string().optional(),
};

const additionalAnnouncementFields = {
  transactionType: Joi.string().messages({
    "string.empty": "Tipul tranzactiei este obligatoriu",
  }),
  price: Joi.string().messages({
    "string.empty": "Pretul este obligatoriu",
  }),
  surface: Joi.string().messages({
    "string.empty": "Suprafata este obligatorie",
  }),
  numberOfRooms: Joi.string().messages({
    "string.empty": sharedMessages.emptyCover,
  }),
  partitioning: Joi.string().messages({
    "string.empty": sharedMessages.emptyCover,
  }),
  comfortLevel: Joi.string().messages({
    "string.empty": sharedMessages.emptyCover,
  }),
  floor: Joi.string().messages({
    "string.empty": sharedMessages.emptyCover,
  }),
  parking: Joi.string().messages({
    "string.empty": sharedMessages.emptyCover,
  }),
  numberOfKitchens: Joi.string().messages({
    "string.empty": sharedMessages.emptyCover,
  }),
  balcony: Joi.string().messages({
    "string.empty": sharedMessages.emptyCover,
  }),
};

const phoneRegex = /^(\+4)?07\d{8}$/;

const additionalResidentialFields = {
  stage: Joi.string().messages({
    "string.empty": "Stadiul trebuie selectat",
  }),
  endDate: Joi.string().messages({
    "string.empty": "Data finalizarii este obligatorie",
  }),
  contactPhone: Joi.string()
    .pattern(phoneRegex)
    .messages({
      "string.empty": "Numărul de telefon este obligatoriu",
      "string.pattern.base": "Numărul de telefon trebuie să fie valid (ex: 07XXXXXXXX sau +407XXXXXXXX)",
    }),
};

export const announcementValidationSchema = Joi.object().keys({
  ...sharedFields,
  ...additionalAnnouncementFields,
});

export const residentialAnnouncementValidationSchema = Joi.object().keys({
  ...sharedFields,
  ...additionalResidentialFields,
});