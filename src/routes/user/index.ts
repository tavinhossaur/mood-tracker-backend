import { Router } from 'express';
import { UserController } from '../../modules/user/UserController';

const user = Router();
const userController = new UserController();

// Busca de rastreio do usuário (informações principais)
user.get('/track', userController.getUserMoodTracking);

// Atualização do usuário
user.post('/update', userController.updateUser);
user.post('/updateProfileImage', userController.updateUserProfileImage);

export { user };