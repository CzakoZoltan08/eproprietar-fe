import Joi from "joi";

const validationSchema = Joi.object({
  email: Joi.string()
    .email({ minDomainSegments: 2, tlds: false })
    .messages({
      "string.email": "Emailul trebuie să fie valid!",
      "string.empty": "Adresa de email este obligatorie!",
    })
    .label("Email"),

  password: Joi.string()
    .regex(/^(?:(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,64}|[a-f0-9]{16})$/)
    .messages({
      "string.pattern.base":
        "Parola trebuie să aibă cel puțin 8 caractere, inclusiv o literă mare, o literă mică și o cifră, sau să fie o parolă generată validă (16 caractere hexazecimale).",
      "string.empty": "Parola este obligatorie!",
    })
    .label("Parolă"),
});

export default validationSchema;