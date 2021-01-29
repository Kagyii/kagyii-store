import express from "express";
import validator from "express-validator";

import validateToken from "../middlewares/validate-token.js";
import checkValidationError from "../middlewares/check-validation-error.js";
import {
  createSession,
  getSession,
  getSessions,
  sendMessage,
  getMessage,
} from "../controllers/chat.js";

const router = express.Router();

router.post(
  "",
  [
    validator.body("profile_id").isMongoId().withMessage("Invalid profile id"),
    validator.body("shop_id").isMongoId().withMessage("Invalid shop id"),
  ],
  checkValidationError,
  validateToken,
  createSession
);

router.get(
  "",
  [
    validator.query("id").isMongoId().withMessage("Invalid id"),
    validator.query("type").isIn(["user", "shop"]).withMessage("Invalid type"),
    validator
      .query("filter.latest")
      .optional()
      .isISO8601()
      .withMessage("Invalid latest timestamp"),
  ],
  checkValidationError,
  validateToken,
  getSessions
);

router.get(
  "getSession",
  [
    validator.query("shop_id").isMongoId().withMessage("Invalid shop id"),
    validator.query("profile_id").isMongoId().withMessage("Invalid profile id"),
  ],
  checkValidationError,
  validateToken,
  getSession
);

router.post(
  "/:session_id",
  [
    validator
      .param("session_id")
      .optional()
      .isMongoId()
      .withMessage("Invalid session id"),
    validator.body("profile_id").isMongoId().withMessage("Invalid profile id"),
    validator.body("shop_id").isMongoId().withMessage("Invalid shop id"),
    validator.body("from").isMongoId().withMessage("Invalid from user id"),
    validator.body("to").isMongoId().withMessage("Invalid to user id"),
    validator
      .body("text")
      .optional()
      .isString()
      .trim()
      .not()
      .isEmpty({ ignore_whitespace: true })
      .withMessage("Invalid text"),
    validator
      .body("image")
      .optional()
      .isBase64()
      .not()
      .isEmpty({ ignore_whitespace: true })
      .withMessage("Bad image"),
  ],
  checkValidationError,
  validateToken,
  sendMessage
);

router.get(
  "/:session_id",
  [
    validator
      .param("session_id")
      .optional()
      .isMongoId()
      .withMessage("Invalid session id"),
    validator.query("id").isMongoId().withMessage("Invalid id"),
    validator.query("type").isIn(["user", "shop"]).withMessage("Invalid type"),
    validator
      .query("filter.latest")
      .optional()
      .isISO8601()
      .withMessage("Invalid latest timestamp"),
  ],
  checkValidationError,
  validateToken,
  getMessage
);

export default router;
