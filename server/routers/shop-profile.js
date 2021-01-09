import express from 'express';
import validator from 'express-validator';

import validateToken from '../middlewares/validate-token.js';
import checkValidationError from '../middlewares/check-validation-error.js';
import { create, getById, edit, get, addCatalouge } from '../controllers/shop-profile.js';

const router = express.Router();

router.post('', [
    validator.body('name').isString().trim().not().isEmpty({ ignore_whitespace: true }).withMessage('Required name').withMessage('Invalid name'),
    validator.body('pre_defined_type').isMongoId().withMessage('Invalid predefined type'),
    validator.body('user_defined_type').isString().trim().not().isEmpty({ ignore_whitespace: true }).withMessage('Invalid user defined type'),
    validator.body('about').isString().trim().not().isEmpty({ ignore_whitespace: true }).withMessage('Invalid about'),
    validator.body('phone').isArray({ min: 1, max: 3 }).withMessage('Invalid phone'),
    validator.body('city').isMongoId().withMessage('Invalid city'),
    validator.body('address').isString().trim().not().isEmpty({ ignore_whitespace: true }).withMessage('Invalid address'),
    validator.body('profile_image').isBase64().not().isEmpty({ ignore_whitespace: true }).withMessage('Bad profile image'),
    validator.body('cover_image').isBase64().not().isEmpty({ ignore_whitespace: true }).withMessage('Bad cover image')
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
    validator.body('name').optional().isString().trim().not().isEmpty({ ignore_whitespace: true }).withMessage('Invalid name'),
    validator.body('pre_defined_type').optional().isMongoId().withMessage('Invalid predefined type'),
    validator.body('user_defined_type').optional().isString().trim().not().isEmpty({ ignore_whitespace: true }).withMessage('Invalid user defined type'),
    validator.body('about').optional().isString().trim().not().isEmpty({ ignore_whitespace: true }).withMessage('Invalid about'),
    validator.body('phone').optional().isArray({ min: 1, max: 3 }).withMessage('Invalid phone'),
    validator.body('address').optional().isString().trim().not().isEmpty({ ignore_whitespace: true }).withMessage('Invalid address'),
    validator.body('profile_image').optional().isBase64().not().isEmpty({ ignore_whitespace: true }).withMessage('Invalid profile image'),
    validator.body('cover_image').optional().isBase64().not().isEmpty({ ignore_whitespace: true }).withMessage('Invalid cover image')
], checkValidationError, validateToken, edit);

router.post('/:shop_id/catalouge', [
    validator.param('shop_id').isMongoId().withMessage('Invalid shop id'),
    validator.body('name').isString().trim().not().isEmpty({ ignore_whitespace: true }).withMessage('Invalid name')
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