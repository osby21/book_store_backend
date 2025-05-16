import express from 'express';
import clientController from './client.controller';
import { sanitize } from '../../../middleware/sanitizer';
import { clientStrategy } from '../../../middleware/strategy';
import { validateBody, schemas } from '../../../middleware/validator';

export const clientRouter = express.Router();
clientRouter.route('/initiate-registration').post(sanitize(), clientController.initiateRegistration);
clientRouter.route('/verify-otp').post(sanitize(), clientController.verifyOtp);
clientRouter.route('/getUserByEmailId').get(sanitize(), clientController.findUser);

// COMPROBAR TODOS LOS COMPONENTES

// console.log('Componentes:', {
//     sanitize: typeof sanitize,
//     validateBody: typeof validateBody,
//     schemas: schemas.loginSchema ? 'defined' : 'undefined',
//     clientStrategy: typeof clientStrategy,
//     loginController: typeof clientController.login
//   });
clientRouter.route('/login').post(sanitize(), validateBody(schemas.loginSchema), clientStrategy, clientController.login);
// GET ALL CLIENT
clientRouter.route('/list').get(sanitize(), clientController.getAllClient);
clientRouter.route('/update').post(sanitize(), clientController.getClientUpdate);
clientRouter.route('/delete').delete(sanitize(),clientController.deleteClient);


