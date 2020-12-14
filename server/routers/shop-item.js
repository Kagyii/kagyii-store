import express from 'express';
import validator from 'express-validator';
import isBase64 from 'validator/lib/isBase64.js';
import isMongoId from 'validator/lib/isMongoId.js';

import validateToken from '../middlewares/validate-token.js';
import checkValidationError from '../middlewares/check-validation-error.js';
import { add, get } from '../controllers/shop-item.js';

const router = express.Router();

router.post('/:shop_id/item', [
    validator.param('shop_id').isMongoId().withMessage('invalid shop id'),
    validator.body('name').exists({ checkNull: true }).not().isEmpty({ ignore_whitespace: true }).withMessage('Required name').isString().withMessage('Invalid name'),
    validator.body('category').isArray({ min: 1, max: 5 }).withMessage('Required at least one').custom(value => {
        if (!value.every(i => { return isMongoId(i); })) {
            throw false;
        }
        return true;
    }).withMessage('invalid category'),
    validator.body('description').optional().isString().withMessage('invalid description'),
    validator.body('price').exists({ checkNull: true }).not().isEmpty({ ignore_whitespace: true }).withMessage('Required price').isInt().withMessage('Invalid price'),
    validator.body('promo_price').optional().isInt().withMessage('Invalid promo'),
    validator.body('promo_percentage').optional().isInt().withMessage('Invalid promo percentage'),
    validator.body('promo_expiry').optional().isISO8601().withMessage('Invalid expiry date'),
    validator.body('images').optional().isArray({ min: 1, max: 5 }).withMessage('Required image').custom(value => {
        if (!value.every(i => { return isBase64(i); })) {
            throw false;
        }
        return true;
    }).withMessage('Bad image')
], checkValidationError, validateToken, add);

router.get('/:shop_id/item', [
    validator.param('shop_id').isMongoId().withMessage('invalid shop id'),
    validator.query('last_item').optional().isMongoId().withMessage('invalid item id'),
    validator.query('category').optional().isMongoId().withMessage('invalid category')
], checkValidationError, get);

export default router;