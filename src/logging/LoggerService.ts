import chalk from 'chalk';

class LoggerService {
    /**
     * Função de utilidade à nível global, utilizada para gerar logs com uma melhor formatação
     * @param origin string -> Origem da onde veio o LOG ('ERROR' | 'SERVER')
     * @param message string -> Messagem que será exibida no log
    */
    public async print(origin: string, message: string) {
        console.log('[' + (origin === 'ERROR' ? chalk.red.bold(`${origin}`) : chalk.cyan(`${origin}`)) + ']' + chalk.grey.bold(` ${this.formatDateTime()}`) + ` ${message}`);
    }

    /**
     * Função de utilidade que retorna a data e hora do momento em que o log for gerado formatado conforme a necessidade
     * @returns string -> Data e hora atuais em texto formatado
    */
    private formatDateTime() {
        const now = new Date();

        return `${now.getDate().toString().padStart(2, '0')}-${(now.getMonth() + 1).toString().padStart(2, '0')}-${now.getFullYear()}` 
        + ' ' +  
        `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}:${now.getSeconds().toString().padStart(2, '0')}`;
    }
}

export { LoggerService };