import { sign, verify } from 'jsonwebtoken';
import { IToken } from '../interfaces/auth/IToken';
import { UserRepository } from '../modules/user/UserRepository';
import { Request } from 'express';
import { User } from '@prisma/client';
import Error from '../error/error';
import { HttpStatusCode } from 'axios';

class Token {
    private secret: string;

    // Método construtor da classe, recebe apenas o hash para geração de tokens.
    constructor() {
        this.secret = process.env.SECRET;
    }

    /**
     * Gera um token JWT válido com os dados fornecidos, configurado para se expirar depois de 24 horas.
     * @param data IToken -> Dados que serão incluídos no payload do token.
     * @returns string -> Token JWT válido.
    */
    public async sign(data: IToken) {
        return sign(data, this.secret, { expiresIn: '24h'});
    }

    /**
     * Verifica a validade de um token JWT e decodifica os dados contidos nele.
     * @param token string -> Token JWT a ser verificado.
     * @returns Promise<IToken | undefined> -> Promessa com os dados decodificados do token ou undefined se o token for inválido.
    */
    public async verify(token: string): Promise<IToken | undefined> {
        let decodedToken: IToken | undefined;

        verify(token, this.secret, async (err, decoded) => {
            if(err) decodedToken = null;
            decodedToken = decoded as IToken;
        })

        return decodedToken;
    }
}

/**
 * Manipula o token de autenticação do usuário a partir do header da requisição, verificando sua validade e retornando os dados do usuário.
 * @param request Request -> Requisição HTTP contendo o token da sessão no header.
 * @returns Promise<User> -> Promessa com o objeto do usuário associado ao token.
 * @throws Error -> Lança um erro se o usuário não estiver autenticado ou se o token for inválido.
*/
async function handleUserToken(request: Request): Promise<User> {
    const [, recievedToken] = (request.headers['x-access-token'] as string).split(' ');

    const tokenService = new Token();
    const token = await tokenService.verify(recievedToken);

    if (!token) throw new Error('User not authenticated.', HttpStatusCode.Unauthorized);

    const userRepository = new UserRepository();
    return userRepository.findUserByEmail(token.email);
}

export { Token, handleUserToken };