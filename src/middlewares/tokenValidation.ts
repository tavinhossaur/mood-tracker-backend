import { NextFunction, Request, Response } from 'express';
import { HttpStatusCode } from 'axios';
import { Token } from '../utils/token';
import Error from '../error/error';

/**
 * Middleware para a API, onde é validado o token enviado pelo header 'x-access-token',
 * nas requisições da aplicação que possuam restrição de autenticação.
 * @param request Request -> Requisição HTTP contendo o header com o token da sessão
 * @param _response Response -> Resposta HTTP a ser retornada após a validação do token (Não utilizado).
 * @param next NextFunction -> Função que "empurra" a requisição realiza para o próximo middleware / endpoint
*/
export async function tokenValidation(request: Request, _response: Response, next: NextFunction) {
    const token = request.headers['x-access-token'] as string | undefined;

    if(!token) throw new Error('User not authenticated.', HttpStatusCode.Unauthorized);

    const [, validToken] = token.split(' ');

    const userToken = new Token();
    const verifyToken = await userToken.verify(validToken);

    if(!verifyToken) throw new Error('User not authenticated.', HttpStatusCode.Unauthorized);

    next();
}