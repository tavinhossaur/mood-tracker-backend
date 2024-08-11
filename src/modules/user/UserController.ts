import { Request, Response } from 'express';
import { UserService } from './UserService';
import { HttpStatusCode } from 'axios';
import { ICredentials } from '../../interfaces/auth/ICredentials';
import { handleUserToken } from '../../utils/token';
import Error from '../../error/error';

class UserController {
    public async getUserMoodTracking(request: Request, response: Response) {
        const { id } = await handleUserToken(request);
        const userService = new UserService();

        return response.status(HttpStatusCode.Ok).json(await userService.getUserMoodTracking(id));
    }

    public async registerUser(request: Request, response: Response) {
        const credentials: ICredentials = request.body;

        const userService = new UserService();

        if(!(await userService.registerUser(credentials))) throw new Error('Something went wrong when creating user.', HttpStatusCode.InternalServerError);

        return response.status(HttpStatusCode.Created).json();
    }

    public async updateUser(request: Request, response: Response) {
        const credentials: ICredentials = request.body;
        const { id } = await handleUserToken(request);

        const userService = new UserService();

        if(!(await userService.updateUser(id, credentials))) throw new Error('Something went wrong when updating user.', HttpStatusCode.InternalServerError);
 
        return response.status(HttpStatusCode.Ok).json({ msg: 'User successfully updated.' });
    }

    public async updateUserProfileImage(request: Request, response: Response) {
        const { profile_img } = request.body;
        const { id } = await handleUserToken(request);

        const userService = new UserService();

        if(!(await userService.updateProfileImage(id, profile_img))) throw new Error('Something went wrong when updating profile image.', HttpStatusCode.InternalServerError);

        return response.status(HttpStatusCode.Ok).json({ msg: 'Image successfully updated.' });
    }
}

export { UserController };