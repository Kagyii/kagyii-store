//npm packages
import express from 'express';
import validator from 'express-validator';

const router = express.Router();

import { signUpWithEmail, signInOrLoginWithProviders, loginWithEmail, logout } from '../controllers/auth.js';
import validateToken from '../middlewares/validate-token.js';
import checkValidationError from '../middlewares/check-validation-error.js';

router.post('/sign-up/email', [
    validator.body('email').trim().isEmail().withMessage('Invalid email').normalizeEmail(),
    validator.body('password').isString().trim().not().isEmpty({ ignore_whitespace: true }).withMessage('invalid password'),
],
    checkValidationError, signUpWithEmail);

router.post('/login/providers', [
    validator.body('access_token').isString().withMessage('Invalid token'),
    validator.body('provider_name').isIn(['apple', 'facebook', 'google']).withMessage('Invalid provider name')
],
    checkValidationError, signInOrLoginWithProviders);

router.post('/login/email', [
    validator.body('email').trim().isEmail().withMessage('Invalid email').normalizeEmail(),
    validator.body('password').isString().trim().not().isEmpty({ ignore_whitespace: true }).withMessage('Invalid password')
],
    checkValidationError, loginWithEmail);

router.delete('/logout', [
    validator.body('type').isIn(['one', 'all']).withMessage('invalid type')
],
    checkValidationError, validateToken, logout);

export default router;