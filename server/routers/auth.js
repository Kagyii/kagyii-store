//npm packages
import express from 'express';
import validator from 'express-validator';

const router = express.Router();
//middlewares
// const tokenValidator = require('../middlewares/tokenValidator')


//controllers
import { signUpWithEmail, signInOrLoginWithProviders, loginWithEmail } from '../controllers/auth.js';

//routes
router.post('/sign-up/email', [
    validator.body('email').exists({ checkNull: true }).not().isEmpty({ ignore_whitespace: true }).withMessage('Required email').isEmail().withMessage('Invalid email').normalizeEmail().trim().escape(),
    validator.body('password').exists({ checkNull: true }).not().isEmpty({ ignore_whitespace: true }).withMessage('Required password').isString().withMessage('Required at least one character and one number').trim(),

],
    signUpWithEmail);

router.post('/login/providers', [
    validator.body('access_token').exists({ checkNull: true }).not().isEmpty({ ignore_whitespace: true }).withMessage('Required access token').isString().withMessage('Invalid token'),
    validator.body('access_token').exists({ checkNull: true }).not().isEmpty({ ignore_whitespace: true }).withMessage('Required access token').isString().isIn(['apple', 'facebook']).withMessage('Invalid provider name')
],
    signInOrLoginWithProviders);

router.post('/login/email', [
    validator.body('email').exists({ checkNull: true }).not().isEmpty({ ignore_whitespace: true }).withMessage('Required email').isEmail().withMessage('Invalid email').normalizeEmail().trim().escape(),
    validator.body('password').exists({ checkNull: true }).not().isEmpty({ ignore_whitespace: true }).withMessage('Required password').isString().withMessage('Invalid password').trim()
],
    loginWithEmail)

export default router;