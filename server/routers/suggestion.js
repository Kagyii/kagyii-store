import express from 'express';
import validator from 'express-validator';

import validateToken from '../middlewares/validate-token.js';
import { get } from '../controllers/suggestion.js';

const router = express.Router();

router.get('', [
    validator.query('type').exists({ checkNull: true }).not().isEmpty({ ignore_whitespace: true }).withMessage('Required type').isString().isIn(['shop_type']).withMessage('Invalid type')
], get)

export default router;