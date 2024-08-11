import { Router } from 'express';
import { auth } from './auth/index';
import { decodedToken } from '../middlewares/decodedToken';
import { user } from './user';
import { mood } from './mood';

const router = Router();

// Rotas isentas de autenticação de token
router.use('/auth', auth);
router.use('/user', user);

router.use(decodedToken);
router.use('/mood', mood);

export { router };