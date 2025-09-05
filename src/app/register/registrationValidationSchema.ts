import Joi from "joi";

const validationSchema = Joi.object({
  email: Joi.string()
    .email({ minDomainSegments: 2, tlds: false })
    .messages({
      "string.email": "Adresa de email nu este validă!",
      "string.empty": "Adresa de email este obligatorie!",
    })
    .label("Email"),
  password: Joi.string()
    .min(8)
    .regex(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,64}$/)
    .messages({
      "string.pattern.base":
        "Parola trebuie să conțină cel puțin 8 caractere (1 literă mică, 1 literă mare și 1 cifră)",
      "string.min":
        "Parola trebuie să conțină cel puțin 8 caractere (1 literă mică, 1 literă mare și 1 cifră)",
      "string.empty": "Parola este obligatorie!",
    })
    .label("Parolă"),
  passwordConfirm: Joi.string()
    .min(8)
    .valid(Joi.ref("password"))
    .messages({
      "any.only": "Parolele nu se potrivesc. Te rugăm să încerci din nou.",
      "string.empty": "Confirmarea parolei este obligatorie!",
    })
    .label("Confirmare parolă"),
  firstName: Joi.string()
    .messages({
      "string.empty": "Prenumele este obligatoriu!",
    })
    .required()
    .label("Prenume"),
  lastName: Joi.string()
    .messages({
      "string.empty": "Numele este obligatoriu!",
    })
    .required()
    .label("Nume"),
});

export default validationSchema;