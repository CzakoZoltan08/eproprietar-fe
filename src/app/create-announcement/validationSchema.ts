import Joi from "joi";

const sharedMessages = {
  emptyField: "Campul este obligatoriu",
  emptyCity: "Orasul trebuie selectat",
  emptyCounty: "Judetul trebuie selectat",
  emptyCover: "error:emptyCover",
};

// helper: numeric field can be number or numeric string
const numericLike = Joi.alternatives().try(
  Joi.number(),
  Joi.string().pattern(/^\d+$/).messages({ "string.pattern.base": "Trebuie să fie numeric" })
).allow("");

const sharedFields = {
  announcementType: Joi.string().messages({
    "string.empty": "Tipul anuntului este obligatoriu",
  }),
  description: Joi.string().allow("").messages({
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
  county: Joi.string().messages({
    "string.empty": sharedMessages.emptyCounty,
  }),
  street: Joi.string().allow("").optional(),
};

// ===== Existing generic announcement fields =====
const additionalAnnouncementFields = {
  transactionType: Joi.string().messages({
    "string.empty": "Tipul tranzactiei este obligatoriu",
  }),
  price: numericLike.messages({
    "string.empty": "Pretul este obligatoriu",
  }),
  surface: numericLike.messages({
    "string.empty": "Suprafata este obligatorie",
  }),
  numberOfRooms: Joi.string().messages({
    "string.empty": sharedMessages.emptyCover,
  }),
  partitioning: Joi.string().allow("").messages({
    "string.empty": sharedMessages.emptyCover,
  }),
  comfortLevel: Joi.string().allow("").messages({
    "string.empty": sharedMessages.emptyCover,
  }),
  floor: numericLike.messages({
    "string.empty": sharedMessages.emptyCover,
  }),
  parking: Joi.string().allow("").messages({
    "string.empty": sharedMessages.emptyCover,
  }),
  numberOfKitchens: numericLike.messages({
    "string.empty": sharedMessages.emptyCover,
  }),
  balcony: Joi.string().allow("").messages({
    "string.empty": sharedMessages.emptyCover,
  }),
  // commonly used numeric extras
  landSurface: numericLike.optional(),
  builtSurface: numericLike.optional(),
};

// ===== Phone: 07XXXXXXXX or +407XXXXXXXX, with optional spaces =====
const phoneRegex = /^(?:\+40|0)\s?7\d{2}\s?\d{3}\s?\d{3}$/;

// ===== Residential-only (ensemble) fields =====
const additionalResidentialFields = {
  stage: Joi.string().allow("").messages({
    "string.empty": "Stadiul trebuie selectat",
  }),
  endDate: Joi.string().isoDate().allow("").messages({
    "string.empty": "Data finalizarii este obligatorie",
  }),
  contactPhone: Joi.string()
    .replace(/\s+/g, "") // normalize spaces out before test (Joi v17+: use .custom if .replace unsupported)
    .pattern(/^(?:\+40|0)7\d{8}$/) // strict after stripping spaces
    .messages({
      "string.empty": "Numărul de telefon este obligatoriu",
      "string.pattern.base":
        "Numărul de telefon trebuie să fie valid (ex: 07XXXXXXXX sau +407XXXXXXXX)",
    }),

  // NEW ENSEMBLE FIELDS
  neighborhood: Joi.string().allow("").optional(),
  constructionStart: Joi.string().isoDate().allow("").optional(),
  floorsCount: numericLike.optional(),
  amenities: Joi.alternatives()
    .try(
      Joi.array().items(Joi.string().min(1)).optional(),
      Joi.string().allow("").optional() // allow comma-separated string; you split later
    )
    .optional(),
  developerSite: Joi.string().uri({ allowRelative: false }).allow("").optional(),
  frameType: Joi.string().allow("").optional(),

  // flyer fields
  flyer: Joi.any().optional(), // File object in the form; skip deep validation
  flyerUrl: Joi.string().uri({ allowRelative: false }).allow("").optional(),
  flyerMimeType: Joi.string().allow("").optional(),
  builtSurface: numericLike.allow("").optional(),
  landSurface: numericLike.allow("").optional(),
};

export const announcementValidationSchema = Joi.object().keys({
  ...sharedFields,
  ...additionalAnnouncementFields,
});

export const residentialAnnouncementValidationSchema = Joi.object().keys({
  ...sharedFields,
  ...additionalResidentialFields,
  apartmentTypeOther: Joi.string().allow("").optional(),
});
