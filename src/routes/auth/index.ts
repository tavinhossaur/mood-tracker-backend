import { Router } from 'express';
import { AuthController } from '../../modules/auth/AuthController';

const auth = Router();
const authController = new AuthController();

auth.post('/user', authController.auth);

export { auth };