import express from 'express';
import validator from 'express-validator';

import validateToken from '../middlewares/validate-token.js';
import checkValidationError from '../middlewares/check-validation-error.js';
import { create } from '../controllers/chat.js';

const router = express.Router();

router.post('', [
    validator.body('session_id').optional().isMongoId().withMessage('Invalid session id'),
    validator.body('user_id').isMongoId().withMessage('Invalid user id'),
    validator.body('shop_id').isMongoId().withMessage('Invalid shop id'),
    validator.body('from').isIn(['user', 'shop']).withMessage('Invalid from data'),
    validator.body('text').isString().trim().not().isEmpty({ ignore_whitespace: true }).withMessage('Invalid text'),
    validator.body('image').optional().isBase64().withMessage('Bad image')
], checkValidationError, validateToken, create);

export default router;