import express from 'express';
import authController from './auth.controller';
import { localStrategy } from '../../../middleware/strategy';
import { sanitize } from '../../../middleware/sanitizer';
import { validateBody, schemas } from '../../../middleware/validator';


export const authRouter = express.Router();
authRouter.route('/register').post(sanitize(), authController.register);
authRouter.route('/rootLogin').post(sanitize(),validateBody(schemas.loginSchema),localStrategy, authController.login);




