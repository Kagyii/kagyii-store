import express from 'express';
import validator from 'express-validator';

import validateToken from '../middlewares/validate-token.js';
import checkValidationError from '../middlewares/check-validation-error.js';
import { create, getById, edit, get, addCatalouge } from '../controllers/shop-profile.js';

const router = express.Router();

router.post('', [
    validator.body('name').exists({ checkNull: true }).not().isEmpty({ ignore_whitespace: true }).withMessage('Required name').isString().withMessage('Invalid name'),
    validator.body('pre_defined_type').exists({ checkNull: true }).not().isEmpty({ ignore_whitespace: true }).withMessage('Required predefined type').isString().withMessage('Invalid predefined type'),
    validator.body('user_defined_type').exists({ checkNull: true }).not().isEmpty({ ignore_whitespace: true }).withMessage('Required user defined type').isString().withMessage('Invalid user defined type'),
    validator.body('about').exists({ checkNull: true }).not().isEmpty({ ignore_whitespace: true }).withMessage('Required about').isString().withMessage('Invalid about'),
    validator.body('phone').exists({ checkNull: true }).not().isEmpty({ ignore_whitespace: true }).withMessage('Required phone').isArray({ min: 1, max: 3 }).withMessage('Invalid phone'),
    validator.body('city').exists({ checkNull: true }).not().isEmpty({ ignore_whitespace: true }).withMessage('Required city').isString().withMessage('Invalid city'),
    validator.body('address').exists({ checkNull: true }).not().isEmpty({ ignore_whitespace: true }).withMessage('Required address').isString().withMessage('Invalid address'),
    validator.body('profile_image').exists({ checkNull: true }).not().isEmpty({ ignore_whitespace: true }).withMessage('Required profile image').isBase64().withMessage('Invalid profile image'),
    validator.body('cover_image').isBase64().withMessage('Invalid cover image')
], checkValidationError, validateToken, create);

router.get('', [
    validator.query('filter.type').optional().isMongoId().withMessage('Invalid type'),
    validator.query('filter.city').optional().isMongoId().withMessage('Invalid city'),
    validator.query('filter.latest').optional().isISO8601().withMessage('Invalid date'),
    validator.query('filter.promo').optional().isISO8601().withMessage('Invalid promo'),
    validator.query('filter.favourite_types').optional(),
    validator.query('filter.favourite_shops').optional()
], checkValidationError, get);

router.get('/:shop_id', [
    validator.param('shop_id').isMongoId().withMessage('Invalid shop id')
], checkValidationError, getById);

router.patch('/:shop_id', [
    validator.param('shop_id').isMongoId().withMessage('Invalid shop id'),
    validator.body('name').optional().isString().withMessage('Invalid name'),
    validator.body('pre_defined_type').optional().isMongoId().withMessage('Invalid predefined type'),
    validator.body('user_defined_type').optional().isString().withMessage('Invalid user defined type'),
    validator.body('about').optional().isString().withMessage('Invalid about'),
    validator.body('phone').optional().isArray({ min: 1, max: 3 }).withMessage('Invalid phone'),
    validator.body('address').optional().isString().withMessage('Invalid address'),
    validator.body('profile_image').optional().isBase64().withMessage('Invalid profile image'),
    validator.body('cover_image').optional().isBase64().withMessage('Invalid cover image')
], checkValidationError, validateToken, edit);

router.post('/:shop_id/catalouge', [
    validator.param('shop_id').isMongoId().withMessage('Invalid shop id'),
    validator.body('name').exists({ checkNull: true }).not().isEmpty({ ignore_whitespace: true }).withMessage('Required name').isString().withMessage('Invalid name')
], checkValidationError, validateToken, addCatalouge);

// router.patch('/:shop_id/catalouge', [
//     validator.param('shop_id').isMongoId().withMessage('Invalid shop id'),
//     validator.body('name').exists({ checkNull: true }).not().isEmpty({ ignore_whitespace: true }).withMessage('Required name').isString().withMessage('Invalid name'),
//     validator.body('catalouge_id').exists({ checkNull: true }).not().isEmpty({ ignore_whitespace: true }).withMessage('Required catalouge id').isMongoId().withMessage('Invalid catalouge id')
// ], validateToken);

// router.delete('/:shop_id/catalouge', [
//     validator.param('shop_id').isMongoId().withMessage('Invalid shop id'),
//     validator.body('catalouge_id').exists({ checkNull: true }).not().isEmpty({ ignore_whitespace: true }).withMessage('Required catalouge id').isMongoId().withMessage('Invalid catalouge id')
// ], validateToken)

export default router;