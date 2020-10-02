import express from 'express';
import validator from 'express-validator';

import validateToken from '../middlewares/validate-token.js';
import { create, get, edit } from '../controllers/user-profile.js';

const router = express.Router();

router.post('', [
    validator.body('name').exists({ checkNull: true }).not().isEmpty({ ignore_whitespace: true }).withMessage('Required name').isString().withMessage('Invalid name'),
    validator.body('address').exists({ checkNull: true }).not().isEmpty({ ignore_whitespace: true }).withMessage('Required address').isArray({ min: 1, max: 2 }).withMessage('Invalid address'),
    validator.body('phone').exists({ checkNull: true }).not().isEmpty({ ignore_whitespace: true }).withMessage('Required phone').isArray({ min: 1, max: 2 }).withMessage('Invalid phone')
], validateToken, create);

router.get('/:profile_id', [
    validator.param('profile_id').isMongoId().withMessage('Invalid profile id')
], get);

router.put('/:profile_id', [
    validator.param('profile_id').isMongoId().withMessage('Invalid profile id'),
    validator.body('name').optional().isString().withMessage('Invalid name'),
    validator.body('address').optional().isArray({ min: 1, max: 2 }).withMessage('Invalid address'),
    validator.body('phone').optional().isArray({ min: 1, max: 2 }).withMessage('Invalid phone')
], edit);


export default router;