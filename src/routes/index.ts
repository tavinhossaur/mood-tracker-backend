import { Router } from 'express';
import { auth } from './auth/index';
import { tokenValidation } from '../middlewares/tokenValidation';
import { user } from './user';
import { mood } from './mood';
import { UserController } from '../modules/user/UserController';

const router = Router();
const userController = new UserController();

// Rotas isentas de autenticação de token
router.use('/auth', auth); // Login
user.post('/register', userController.registerUser); // Criação de usuário

// Middleware de validação do token (todas as requisições que não sejam a de login e criação de usuário passam pelo middleware)
router.use(tokenValidation);

// "Pastas" das rotas do backend
router.use('/user', user);
router.use('/mood', mood);

export { router };