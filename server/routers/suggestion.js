import express from 'express';
import validator from 'express-validator';

import validateToken from '../middlewares/validate-token.js';
import checkValidationError from '../middlewares/check-validation-error.js';
import { get, add } from '../controllers/suggestion.js';

const router = express.Router();

router.get('', [
    validator.query('type').exists({ checkNull: true }).not().isEmpty({ ignore_whitespace: true }).withMessage('Required type').isString().isIn(['shop_type', 'city']).withMessage('Invalid type')
], checkValidationError, get);

router.post('', [
    validator.body('name').exists({ checkNull: true }).not().isEmpty({ ignore_whitespace: true }).withMessage('Required name').isString().withMessage('invalid name'),
    validator.body('type').exists({ checkNull: true }).not().isEmpty({ ignore_whitespace: true }).withMessage('Required type').isString().isIn(['shop_type', 'city']).withMessage('Invalid city')
], checkValidationError, add);

export default router;