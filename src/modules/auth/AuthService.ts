import { HttpStatusCode } from 'axios';
import { ICredentials } from '../../interfaces/auth/ICredentials';
import { UserRepository } from '../user/UserRepository';
import { Token } from '../../utils/token';
import { User } from '@prisma/client';
import bcrypt from 'bcrypt';
import Error from '../../error/error';

class AuthService {
    public async getAuth(login: ICredentials) {
        if(!login || !login.email || !login.password) throw new Error('Faltam dados para realizar o login.', HttpStatusCode.BadRequest);

        const user: User = await this.validateUser(login.email, login.password);

        if(!user) throw new Error('Invalid e-mail or password.', HttpStatusCode.BadRequest);

        const { username, email, created_at } = user;

        const token = new Token();
        const signToken = await token.sign({ username, email, created_at })        

        return { username, email, created_at, signToken };
    }

    private async validateUser(email: string, password: string) {
        const userRepository = new UserRepository();
        const user = await userRepository.findUserByEmail(email);
      
        if(!user || !(await bcrypt.compare(password, user?.password))) return null;

        return user;
    }
}

export { AuthService };