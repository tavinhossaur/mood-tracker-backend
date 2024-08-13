import * as dotenv from 'dotenv';
import path from 'path';
import chalk from 'chalk';
import { serverHttp } from './utils/http';
import { LoggerService } from './logging/LoggerService';

// Configurando caminho do arquivo .env
dotenv.config({ path: path.join(__dirname, '..', '.env') });

const port = process.env.PORT_APP;
const logger = new LoggerService();

// Inicializando servidor HTTP e exibindo uma mensagem com a porta da aplicação.
serverHttp.listen(port, () => logger.print('SERVER', `Running on port ${chalk.green(port)}`));