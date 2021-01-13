import validator from "express-validator";

const checkValidationError = async (req, res, next) => {
  const validationErr = validator.validationResult(req);

  if (!validationErr.isEmpty()) {
    return next(new Error(validationErr.errors[0].msg));
  }

  return next();
};

export default checkValidationError;
