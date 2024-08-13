import { Router } from 'express';
import { AuthController } from '../../modules/auth/AuthController';

const auth = Router();
const authController = new AuthController();

// Rota de autenticação do usuário, faz a chamada para a função de autenticação.
auth.post('/user', authController.auth);

export { auth };