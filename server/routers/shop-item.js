import express from "express";
import validator from "express-validator";
import isBase64 from "validator/lib/isBase64.js";
import isMongoId from "validator/lib/isMongoId.js";

import validateToken from "../middlewares/validate-token.js";
import checkValidationError from "../middlewares/check-validation-error.js";
import { add, get } from "../controllers/shop-item.js";

const router = express.Router();

router.post(
  "/:shop_id/item",
  [
    validator.param("shop_id").isMongoId().withMessage("invalid shop id"),
    validator
      .body("name")
      .isString()
      .trim()
      .not()
      .isEmpty({ ignore_whitespace: true })
      .withMessage("Invalid name"),
    validator
      .body("category")
      .isArray({ min: 1, max: 3 })
      .withMessage("Required at least one")
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
      .withMessage("invalid category"),
    validator
      .body("description")
      .optional()
      .isString()
      .trim()
      .not()
      .isEmpty({ ignore_whitespace: true })
      .withMessage("invalid description"),
    validator.body("price").isInt().withMessage("Invalid price"),
    validator
      .body("promo_price")
      .optional()
      .isInt()
      .withMessage("Invalid promo"),
    validator
      .body("promo_percentage")
      .optional()
      .isInt()
      .withMessage("Invalid promo percentage"),
    validator
      .body("promo_expiry")
      .optional()
      .isISO8601()
      .withMessage("Invalid expiry date"),
    validator
      .body("images")
      .optional()
      .isArray({ min: 1, max: 5 })
      .withMessage("Required at least one image")
      .custom((value) => {
        if (
          !value.every((i) => {
            return isBase64(i);
          })
        ) {
          throw false;
        }
        return true;
      })
      .withMessage("Bad image"),
  ],
  checkValidationError,
  validateToken,
  add
);

router.get(
  "/:shop_id/item",
  [
    validator.param("shop_id").isMongoId().withMessage("invalid shop id"),
    validator
      .query("filter.latest")
      .optional()
      .isISO8601()
      .withMessage("invalid time"),
    validator
      .query("filter.category")
      .optional()
      .isMongoId()
      .withMessage("invalid category"),
  ],
  checkValidationError,
  get
);

export default router;
