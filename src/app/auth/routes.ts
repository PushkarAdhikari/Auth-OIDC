import express, { Router } from 'express';
import AuthenticationController from './controller';
import { restrictToAuthenticatedUsers } from './middleware/auth-middleware';

const authenticationController = new AuthenticationController();

export const authRouter: Router = express.Router();


authRouter.post('/sign-up', authenticationController.handleSignup.bind(authenticationController));
authRouter.post('/sign-in', authenticationController.handleSignin.bind(authenticationController));

authRouter.get('/me', restrictToAuthenticatedUsers(), authenticationController.handleMe.bind(authenticationController));