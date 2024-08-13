import { Request, Response } from 'express';
import { AuthService } from './AuthService';
import { HttpStatusCode } from 'axios';
import { ICredentials } from '../../interfaces/auth/ICredentials';

class AuthController {
    /**
     * Controller da requisição de autenticação do usuário (Login), realiza uma chamada ao AuthService
     * onde será feita o login e a geração do token da sessão do usuário.
     * @param request Request -> Requisição HTTP contendo as credenciais do usuário.
     * @param response Response -> Resposta HTTP a ser retornada após o login do usuário.
     * @returns Devolve o username, email, data de criação do usuário e o token em JSON.
    */
    public async auth(request: Request, response: Response) {
        const login: ICredentials = request.body;

        const authService = new AuthService();
        const getAuth = await authService.getAuth(login);

        return response.status(HttpStatusCode.Ok).json(getAuth);
    }
}

export { AuthController };