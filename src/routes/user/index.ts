import { Router } from 'express';
import { UserController } from '../../modules/user/UserController';

const user = Router();
const userController = new UserController();

user.get('/track', userController.getUserMoodTracking);

user.post('/register', userController.registerUser);
user.post('/update', userController.updateUser);
user.post('/updateProfileImage', userController.updateUserProfileImage);

export { user };