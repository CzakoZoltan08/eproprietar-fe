import Joi from "joi";

const validationSchema = Joi.object({
  email: Joi.string()
    .email({ minDomainSegments: 2, tlds: false })
    .messages({
      "string.email": "Email must be a valid email address!",
      "string.empty": "The email address is required!",
    })
    .label("Email"),
    password: Joi.string()
    .regex(/^(?:(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,64}|[a-f0-9]{16})$/)
    .messages({
      "string.pattern.base":
        "Password must either contain at least 8 characters with at least one lowercase, one uppercase, and one digit, or be a valid generated password (16 hex characters).",
      "string.empty": "The password is required!",
    })
    .label("Password"),
});

export default validationSchema;