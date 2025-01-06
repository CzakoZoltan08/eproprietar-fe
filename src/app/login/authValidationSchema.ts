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
    .min(8)
    .regex(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,64}$/)
    .messages({
      "string.pattern.base":
        "Password should contain at least 8 characters (1 lowercase, 1 uppercase and 1 number)",
      "string.min":
        "Password should contain at least 8 characters (1 lowercase, 1 uppercase and 1 number)",
      "string.empty": "The password is required!",
    })
    .label("Password"),
});

export default validationSchema;