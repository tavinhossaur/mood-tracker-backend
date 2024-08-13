import { Request, Response } from 'express';
import { UserService } from './UserService';
import { HttpStatusCode } from 'axios';
import { ICredentials } from '../../interfaces/auth/ICredentials';
import { handleUserToken } from '../../utils/token';
import Error from '../../error/error';

class UserController {
    /**
     * Busca o rastreio do mood do usuário contendo as informações principais do usuário logado
     * @param request Request -> Requisição HTTP contendo o token da sessão no header.
     * @param response Response -> Resposta HTTP para enviar os dados de rastreio de mood.
     * @returns Promise -> Promessa com resposta HTTP com os dados de rastreio de mood do usuário.
    */
    public async getUserMoodTracking(request: Request, response: Response) {
        const { id } = await handleUserToken(request);
        const userService = new UserService();

        return response.status(HttpStatusCode.Ok).json(await userService.getUserMoodTracking(id));
    }

    /**
     * Registra um novo usuário com base nas credenciais fornecidas.
     * @param request Request -> Requisição HTTP contendo as credenciais do novo usuário.
     * @param response Response -> Resposta HTTP para enviar o status de criação do usuário.
     * @returns Promise -> Promessa com resposta HTTP sem corpo e status Created se o usuário for criado com sucesso.
     * @throws Error -> Lança um erro se houver um problema na criação do usuário.
    */
    public async registerUser(request: Request, response: Response) {
        const credentials: ICredentials = request.body;

        const userService = new UserService();

        if(!(await userService.registerUser(credentials))) throw new Error('Something went wrong when creating user.', HttpStatusCode.InternalServerError);

        return response.status(HttpStatusCode.Created).json();
    }

    /**
     * Atualiza as informações do usuário autenticado com base nas novas credenciais fornecidas.
     * @param request Request -> Requisição HTTP contendo as novas credenciais do usuário.
     * @param response Response -> Resposta HTTP para enviar o status de atualização do usuário.
     * @returns Promise -> Promessa com resposta HTTP e uma mensagem de sucesso se o usuário for atualizado com sucesso.
     * @throws Error -> Lança um erro se houver um problema na atualização do usuário.
    */
    public async updateUser(request: Request, response: Response) {
        const credentials: ICredentials = request.body;
        const { id } = await handleUserToken(request);

        const userService = new UserService();

        if(!(await userService.updateUser(id, credentials))) throw new Error('Something went wrong when updating user.', HttpStatusCode.InternalServerError);
 
        return response.status(HttpStatusCode.Ok).json({ msg: 'User successfully updated.' });
    }

    /**
     * Atualiza a imagem de perfil do usuário autenticado.
     * @param request Request -> Requisição HTTP contendo a nova imagem de perfil.
     * @param response Response -> Resposta HTTP  para enviar o status de atualização da imagem de perfil.
     * @returns Promise -> Promessa que resposta HTTP e uma mensagem de sucesso se a imagem de perfil for atualizada com sucesso.
     * @throws Error -> Lança um erro se houver um problema na atualização da imagem de perfil.
    */
    public async updateUserProfileImage(request: Request, response: Response) {
        const { profile_img } = request.body;
        const { id } = await handleUserToken(request);

        const userService = new UserService();

        if(!(await userService.updateProfileImage(id, profile_img))) throw new Error('Something went wrong when updating profile image.', HttpStatusCode.InternalServerError);

        return response.status(HttpStatusCode.Ok).json({ msg: 'Image successfully updated.' });
    }
}

export { UserController };