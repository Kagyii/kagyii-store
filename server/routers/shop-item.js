import express from 'express';
import validator from 'express-validator';

import validateToken from '../middlewares/validate-token.js';
import { add, get } from '../controllers/shop-item.js';

const router = express.Router();

router.post('/:shop_id/item', [
    validator.param('shop_id').isMongoId().withMessage('invalid shop id'),
    validator.body('name').exists({ checkNull: true }).not().isEmpty({ ignore_whitespace: true }).withMessage('Required name').isString().withMessage('Invalid name'),
    validator.param('category').optional().isMongoId().withMessage('invalid category'),
    validator.body('description').exists({ checkNull: true }).not().isEmpty({ ignore_whitespace: true }).withMessage('Required description').isString().withMessage('Invalid description'),
    validator.body('price').exists({ checkNull: true }).not().isEmpty({ ignore_whitespace: true }).withMessage('Required price').isInt().withMessage('Invalid price'),
    validator.body('promo_price').optional().isInt().withMessage('Invalid promo price'),
    validator.body('quantity').exists({ checkNull: true }).not().isEmpty({ ignore_whitespace: true }).withMessage('Required quantity').isInt().withMessage('Invalid name'),
    validator.body('image').exists({ checkNull: true }).not().isEmpty({ ignore_whitespace: true }).withMessage('Required image').isBase64().withMessage('Invalid image')
], validateToken, add);

router.get('/:shop_id/item', [
    validator.param('shop_id').isMongoId().withMessage('invalid shop id'),
    validator.query('last_item').optional().isMongoId().withMessage('invalid item id'),
    validator.query('category').optional().isMongoId().withMessage('invalid category')
], get);

export default router;