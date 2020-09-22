import express from 'express';
import validator from 'express-validator';

import validateToken from '../middlewares/validate-token.js';
import { create } from '../controllers/shop-profile.js';

const router = express.Router();

router.post('/create', validateToken, create);

export default router;