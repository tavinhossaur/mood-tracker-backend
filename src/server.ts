import * as dotenv from 'dotenv';
import path from 'path';
import chalk from 'chalk';
import { serverHttp } from './utils/http';
import { LoggerService } from './logging/LoggerService';

dotenv.config({ path: path.join(__dirname, '..', '.env') });

const port = process.env.PORT_APP;
const logger = new LoggerService();

serverHttp.listen(port, () => logger.print('SERVER', `Running on port ${chalk.green(port)}`));