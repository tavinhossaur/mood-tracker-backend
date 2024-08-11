import chalk from 'chalk';

class LoggerService {
    public async print(origin: string, message: string) {
        console.log('[' + (origin === 'ERROR' ? chalk.red.bold(`${origin}`) : chalk.cyan(`${origin}`)) + ']' + chalk.grey.bold(` ${this.formatDateTime()}`) + ` ${message}`);
    }

    private formatDateTime() {
        const now = new Date();

        return `${now.getDate().toString().padStart(2, '0')}-${(now.getMonth() + 1).toString().padStart(2, '0')}-${now.getFullYear()}` 
        + ' ' +  
        `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}:${now.getSeconds().toString().padStart(2, '0')}`;
    }
}

export { LoggerService };