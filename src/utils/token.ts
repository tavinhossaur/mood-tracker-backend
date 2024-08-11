import { sign, verify } from 'jsonwebtoken';
import { IToken } from '../interfaces/auth/IToken';
import { UserRepository } from '../modules/user/UserRepository';
import { Request } from 'express';
import { User } from '@prisma/client';

class Token {
    private secret: string;

    constructor() {
        this.secret = process.env.SECRET;
    }

    public async sign(data: IToken) {
        return sign(data, this.secret, { expiresIn: '24h'});
    }

    public async verify(token: string): Promise<IToken | undefined> {
        let decodedToken: IToken | undefined;

        verify(token, this.secret, async (err, decoded) => {
            if(err) decodedToken = null;
            decodedToken = decoded as IToken;
        })

        return decodedToken;
    }
}

async function handleUserToken(request: Request): Promise<User> {
    const [, recievedToken] = (request.headers['x-access-token'] as string).split(' ');

    const tokenService = new Token();
    const token = await tokenService.verify(recievedToken);

    const userRepository = new UserRepository();
    return userRepository.findUserByEmail(token.email);
}

export { Token, handleUserToken };