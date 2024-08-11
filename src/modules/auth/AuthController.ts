import { Request, Response } from 'express';
import { AuthService } from './AuthService';
import { HttpStatusCode } from 'axios';
import { ICredentials } from '../../interfaces/auth/ICredentials';

class AuthController {
    public async auth(request: Request, response: Response) {
        const login: ICredentials = request.body;

        const authService = new AuthService();
        const getAuth = await authService.getAuth(login);

        return response.status(HttpStatusCode.Ok).json(getAuth);
    }
}

export { AuthController };