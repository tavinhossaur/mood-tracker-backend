import 'express-async-errors';
import AppError from '../error/error';
import cors from 'cors';
import express, { Request, Response, NextFunction } from 'express';
import { createServer } from 'http';
import { router } from '../routes';
import { HttpStatusCode } from 'axios';

const server = express();

// Aumentando o limite do payload das requisições para 50MB devido ao envio da imagem do usuário.
server.use(express.json({ limit: '50mb' }));
server.use(express.urlencoded({ limit: '50mb', extended: true }));

// Liberando apenas clientes locais na porta 8080 à fazerem requisições para esta aplicação.
const corsOptions = { origin: [ 'http://localhost:8080' ] };

server.use(cors(corsOptions));
server.use(express.json());

// Configurando servidor Express para utilizar as rotas definidas
server.use(router);

// Middleware de erros que são jogados durante a execução do sistema.
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

// Criação e exportação do servidor HTTP
const serverHttp = createServer(server);

export { serverHttp };
