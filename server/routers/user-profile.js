import express from "express";
import validator from "express-validator";
import isMongoId from "validator/lib/isMongoId.js";

import validateToken from "../middlewares/validate-token.js";
import checkValidationError from "../middlewares/check-validation-error.js";
import { create, get, edit } from "../controllers/user-profile.js";

const router = express.Router();

router.post(
  "",
  [
    validator
      .body("name")
      .isString()
      .trim()
      .not()
      .isEmpty({ ignore_whitespace: true })
      .withMessage("Invalid name"),
    validator
      .body("address")
      .isArray({ min: 1, max: 3 })
      .withMessage("Invalid address"),
    validator
      .body("phone")
      .isArray({ min: 1, max: 3 })
      .withMessage("Invalid phone"),
  ],
  checkValidationError,
  validateToken,
  create
);

router.get(
  "/:profile_id",
  [validator.param("profile_id").isMongoId().withMessage("Invalid profile id")],
  checkValidationError,
  get
);

router.patch(
  "/:profile_id",
  [
    validator.param("profile_id").isMongoId().withMessage("Invalid profile id"),
    validator
      .body("name")
      .optional()
      .isString()
      .trim()
      .not()
      .isEmpty({ ignore_whitespace: true })
      .withMessage("Invalid name"),
    validator
      .body("address")
      .optional()
      .isArray({ min: 1, max: 3 })
      .withMessage("Invalid address"),
    validator
      .body("phone")
      .optional()
      .isArray({ min: 1, max: 3 })
      .withMessage("Invalid phone"),
    validator
      .body("favourite_shops")
      .optional()
      .isArray({ min: 1 })
      .withMessage("Required shop id")
      .custom((value) => {
        if (
          !value.every((i) => {
            return isMongoId(i);
          })
        ) {
          throw false;
        }
        return true;
      })
      .withMessage("Invalid shop ids"),
    validator
      .body("favourite_types")
      .optional()
      .isArray({ min: 1 })
      .withMessage("Required type id")
      .custom((value) => {
        if (
          !value.every((i) => {
            return isMongoId(i);
          })
        ) {
          throw false;
        }
        return true;
      })
      .withMessage("Invalid type ids"),
  ],
  checkValidationError,
  validateToken,
  edit
);

export default router;
