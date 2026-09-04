const AppError = require("../utils/AppError");

const validate = (schema) => (req, res, next) => {
  const { error, value } = schema.validate(
    { body: req.body, params: req.params, query: req.query },
    { abortEarly: false, stripUnknown: true },
  );

  if (error) {
    return next(
      new AppError(
        400,
        "Request validation failed",
        error.details.map((detail) => detail.message),
      ),
    );
  }

  req.body = value.body;
  req.validated = value;
  next();
};

module.exports = validate;
