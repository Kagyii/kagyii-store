import express from 'express';
import validator from 'express-validator';
import isMongoId from 'validator/lib/isMongoId.js';

import validateToken from '../middlewares/validate-token.js';
import checkValidationError from '../middlewares/check-validation-error.js';
import { create } from '../controllers/order.js';

const router = express.Router();

router.post('', [
    validator.body('shop_id').isMongoId().withMessage('Invalid shopId'),
    validator.body('cart').isArray({ min: 1, max: 100 }).withMessage('Required at least one in cart').custom(value => {
        if (!value.every(item => { return isMongoId(item.id); })) {
            throw false;
        }
        return true;
    }).withMessage('invalid cart'),
    validator.body('total_bill').isInt().withMessage('invalid bill')
], validateToken, checkValidationError, create);

export default router;