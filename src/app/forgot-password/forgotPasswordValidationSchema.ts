import Joi from "joi";

const ERROR_MESSAGES = {
  EMAIL_INVALID: "Adresă de email invalidă",
  EMAIL_REQUIRED: "Emailul este obligatoriu",
};

const validationSchema = Joi.object({
  email: Joi.string()
    .email({ minDomainSegments: 2, tlds: false })
    .messages({
      "string.email": ERROR_MESSAGES.EMAIL_INVALID,
      "string.empty": ERROR_MESSAGES.EMAIL_REQUIRED,
    })
    .label("Email"),
});

export default validationSchema;