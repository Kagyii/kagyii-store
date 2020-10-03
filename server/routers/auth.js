//npm packages
import express from 'express';
import validator from 'express-validator';

const router = express.Router();

import { signUpWithEmail, signInOrLoginWithProviders, loginWithEmail, logout } from '../controllers/auth.js';
import validateToken from '../middlewares/validate-token.js';

router.post('/sign-up/email', [
    validator.body('email').exists({ checkNull: true }).not().isEmpty({ ignore_whitespace: true }).withMessage('Required email').isEmail().withMessage('Invalid email').normalizeEmail().trim().escape(),
    validator.body('password').exists({ checkNull: true }).not().isEmpty({ ignore_whitespace: true }).withMessage('Required password').isString().withMessage('Required at least one character and one number').trim(),

],
    signUpWithEmail);

router.post('/login/providers', [
    validator.body('access_token').exists({ checkNull: true }).not().isEmpty({ ignore_whitespace: true }).withMessage('Required access token').isString().withMessage('Invalid token'),
    validator.body('provider_name').exists({ checkNull: true }).not().isEmpty({ ignore_whitespace: true }).withMessage('Required provider name').isString().isIn(['apple', 'facebook', 'google']).withMessage('Invalid provider name')
],
    signInOrLoginWithProviders);

router.post('/login/email', [
    validator.body('email').exists({ checkNull: true }).not().isEmpty({ ignore_whitespace: true }).withMessage('Required email').isEmail().withMessage('Invalid email').normalizeEmail().trim().escape(),
    validator.body('password').exists({ checkNull: true }).not().isEmpty({ ignore_whitespace: true }).withMessage('Required password').isString().withMessage('Invalid password').trim()
],
    loginWithEmail);

router.delete('/logout', [
    validator.body('type').exists({ checkNull: true }).not().isEmpty({ ignore_whitespace: true }).withMessage('Required type').isString().isIn(['one', 'all']).withMessage('invalid type')
],
    validateToken, logout);

export default router;