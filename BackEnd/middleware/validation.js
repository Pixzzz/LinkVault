const joi = require("joi");

// Validation schema for user registration
const useSchema = joi.object({
  username: joi.string().min(3).max(30).required().lowercase(),
  email: joi.string().email().required().lowercase(),
  password: joi
    .string()
    .min(6)
    .pattern(new RegExp("^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])"))
    .message(
      "Password must contain at least one uppercase letter, one lowercase and one number",
    )
    .required(),
});
const validateUser = (req, res, next) => {
  const { error } = useSchema.validate(req.body, {
    abortEarly: false,
    allowUnknown: true,
  });
  if (error) {
    return res.status(400).json({ message: error.details[0].message });
  }
  next();
};

module.exports = validateUser;
