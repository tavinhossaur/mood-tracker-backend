import 'express-async-errors';
import AppError from '../error/error';
import cors from 'cors';
import express, { Request, Response, NextFunction } from 'express';
import { createServer } from 'http';
import { router } from '../routes';
import { HttpStatusCode } from 'axios';

const server = express();

server.use(express.json({ limit: '50mb' }));
server.use(express.urlencoded({ limit: '50mb', extended: true }));

const corsOptions = { origin: [ 'http://localhost:8080' ] };

server.use(cors(corsOptions));
server.use(express.json())

server.use(router);

server.use((err: Errors, _request: Request, response: Response, _: NextFunction) => {
    if(err instanceof AppError) {
        return response.status(err.status).json({
            status: err.status,
            message: err.message,
        });
    }

    if(err.isAxiosError) {
        return response.status(HttpStatusCode.InternalServerError).json({
            status: HttpStatusCode.InternalServerError,
            message: 'We were unable to complete this request at this time, please try again later.',
        });
    }

    return response.status(HttpStatusCode.InternalServerError).json({
        status: HttpStatusCode.InternalServerError,
        message: err.message,
    });
});

const serverHttp = createServer(server);

export { serverHttp };
