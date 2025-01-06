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
  passwordConfirm: Joi.string()
    .min(8)
    .valid(Joi.ref("password"))
    .messages({
      "any.only": "The passwords do not match. Please try again",
      "string.empty": "The password is required!",
    })
    .label("Confirm password"),
  firstName: Joi.string()
    .messages({
      "string.empty": "First Name Required",
    })
    .required()
    .label("First Name"),
  lastName: Joi.string()
    .messages({
      "string.empty": "Last Name Required",
    })
    .required()
    .label("Last Name"),
});

export default validationSchema;