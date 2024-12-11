import Joi from "joi";

export const announcementValidationSchema = Joi.object().keys({
  announcementType: Joi.string().messages({
    "string.empty": "Tipul anuntului este obligatoriu",
  }),
  description: Joi.string().messages({
    "string.empty": "Descrerea anuntului este obligatorie",
  }),
  providerType: Joi.string().messages({
    "string.empty": "providerType",
  }),
  propertyType: Joi.string().messages({
    "string.empty": "Tipul proptietatii este obligatoriu",
  }),
  transactionType: Joi.string().messages({
    "string.empty": "Tipul tranzactiei este obligatoriu",
  }),
  title: Joi.string().messages({
    "string.empty": "Titlul anuntului este obligatoriu",
  }),
  price: Joi.string().messages({
    "string.empty": "Pretul este obligatoriu",
  }),
  surface: Joi.string().messages({
    "string.empty": "Suprafata este obligatorie",
  }),
  city: Joi.string().messages({
    "string.empty": "Orasul trebuie selectat",
  }),
  street: Joi.string().optional(),
  numberOfRooms: Joi.string().messages({
    "string.empty": "error:emptyCover",
  }),
  partitioning: Joi.string().messages({
    "string.empty": "error:emptyCover",
  }),
  comfortLevel: Joi.string().messages({
    "string.empty": "error:emptyCover",
  }),
  floor: Joi.string().messages({
    "string.empty": "error:emptyCover",
  }),
  parking: Joi.string().messages({
    "string.empty": "error:emptyCover",
  }),
  numberOfKitchens: Joi.string().messages({
    "string.empty": "error:emptyCover",
  }),
  balcony: Joi.string().messages({
    "string.empty": "error:emptyCover",
  }),
});

export const residentialAnnouncementValidationSchema = Joi.object().keys({
  announcementType: Joi.string().messages({
    "string.empty": "Tipul anuntului este obligatoriu",
  }),
  description: Joi.string().messages({
    "string.empty": "Descrerea anuntului este obligatorie",
  }),
  providerType: Joi.string().messages({
    "string.empty": "providerType",
  }),
  propertyType: Joi.string().messages({
    "string.empty": "Tipul proptietatii este obligatoriu",
  }),
  title: Joi.string().messages({
    "string.empty": "Titlul anuntului este obligatoriu",
  }),
  city: Joi.string().messages({
    "string.empty": "Orasul trebuie selectat",
  }),
  street: Joi.string().messages({
    "string.empty": "error:emptyCover",
  }),
  stage: Joi.string().messages({
    "string.empty": "Stadiul trebuie selectat",
  }),
  endDate: Joi.string().messages({
    "string.empty": "Data finalizarii este obligatorie",
  }),
});
