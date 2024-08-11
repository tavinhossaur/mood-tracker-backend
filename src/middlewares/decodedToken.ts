import { NextFunction, Request, Response } from 'express';
import { HttpStatusCode } from 'axios';
import { Token } from '../utils/token';
import Error from '../error/error';

export async function decodedToken(request: Request, _response: Response, next: NextFunction) {
    const token = request.headers['x-access-token'] as string | undefined;

    if(!token) throw new Error('User not authenticated.', HttpStatusCode.Unauthorized);

    const [, validToken] = token.split(' ');

    const userToken = new Token();
    const verifyToken = await userToken.verify(validToken);

    if(!verifyToken) throw new Error('User not authenticated.', HttpStatusCode.Unauthorized);

    next();
}