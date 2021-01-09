import express from 'express';
import validator from 'express-validator';

import validateToken from '../middlewares/validate-token.js';
import checkValidationError from '../middlewares/check-validation-error.js';
import { createSession, sendMessage } from '../controllers/chat.js';

const router = express.Router();

router.post('', [
    validator.body('user_id').isMongoId().withMessage('Invalid user id'),
    validator.body('shop_id').isMongoId().withMessage('Invalid shop id')
], checkValidationError, validateToken, createSession);


router.post('/:session_id', [
    validator.param('session_id').optional().isMongoId().withMessage('Invalid session id'),
    validator.body('user_id').isMongoId().withMessage('Invalid user id'),
    validator.body('shop_id').isMongoId().withMessage('Invalid shop id'),
    validator.body('from').isMongoId().withMessage('Invalid from user id'),
    validator.body('to').isMongoId().withMessage('Invalid to user id'),
    validator.body('text').optional().isString().trim().not().isEmpty({ ignore_whitespace: true }).withMessage('Invalid text'),
    validator.body('image').optional().isBase64().not().isEmpty({ ignore_whitespace: true }).withMessage('Bad image')
], checkValidationError, validateToken, sendMessage);


export default router;