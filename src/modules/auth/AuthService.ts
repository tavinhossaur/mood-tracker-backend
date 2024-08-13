import { HttpStatusCode } from 'axios';
import { ICredentials } from '../../interfaces/auth/ICredentials';
import { UserRepository } from '../user/UserRepository';
import { Token } from '../../utils/token';
import { User } from '@prisma/client';
import bcrypt from 'bcrypt';
import Error from '../../error/error';

class AuthService {
    /**
     * Função que realiza a validação das credenciais do usuário e faz a chamada para uma função que irá gerar um token válido.
     * @param login ICredentials -> Credenciais do usuário
     * @returns Devolve um objeto com o username, email, data de criação do usuário e o token.
     * @throws Error -> Lança um erro se o usuário não foi encontrado no banco de dados.
    */
    public async getAuth(login: ICredentials) {
        if(!login || !login.email || !login.password) throw new Error('There is missing data to log in.', HttpStatusCode.BadRequest);

        const user: User = await this.validateUser(login.email, login.password);

        if(!user) throw new Error('Invalid e-mail or password.', HttpStatusCode.BadRequest);

        const { username, email, created_at } = user;

        const token = new Token();
        const signToken = await token.sign({ username, email, created_at })        

        return { username, email, created_at, signToken };
    }

    /**
     * Função que realiza uma busca pelo usuário no banco de dados, e compara se as senhas são equivalentes
     * @param email string -> email do usuário
     * @param password string -> senha do usuário
     * @returns User -> Objeto do usuário encontrado no banco de dados.
    */
    private async validateUser(email: string, password: string) {
        const userRepository = new UserRepository();
        const user = await userRepository.findUserByEmail(email);
      
        if(!user || !(await bcrypt.compare(password, user?.password))) return null;

        return user;
    }
}

export { AuthService };