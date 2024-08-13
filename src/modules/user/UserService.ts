import { HttpStatusCode } from 'axios';
import { ICredentials } from '../../interfaces/auth/ICredentials';
import { UserRepository } from './UserRepository';
import { LoggerService } from '../../logging/LoggerService';
import { IMoodTracking } from '../../interfaces/mood/IMoodTracking';
import { MoodService } from '../mood/MoodService';
import bcrypt from 'bcrypt';
import Error from '../../error/error';

class UserService {
    /**
     * Recupera os dados principais do usuário logado, incluindo as informações básicas, imagem de perfil, streak e moods recentes.
     * @param id string -> ID do usuário cujo rastreio de humor será recuperado.
     * @returns Promise<IMoodTracking> -> Promessa do banco de dados com o objeto de rastreio do usuário.
     * @throws Error -> Lança um erro se o usuário não existir ou se ocorrer algum problema na recuperação dos dados.
    */
    public async getUserMoodTracking(id: string): Promise<IMoodTracking> {
        const userRepository = new UserRepository();

        if(!(await userRepository.findUserById(id))) throw new Error('This user does not exist.', HttpStatusCode.BadRequest);

        const moodTracking = await userRepository.findUserMoodTracking(id);
        
        const { username, email, streak } = moodTracking;
        const profileImage = moodTracking.profile_preferences.profile_img.toString('base64');

        const moodService = new MoodService();
        const recentMoods = await moodService.getAllMoods(id, parseInt(process.env.HOME_SCREEN_MOOD_ARRAY_SIZE));

        return { username, email, streak: JSON.stringify(streak), profileImage, recentMoods }
    }

    /**
     * Registra um novo usuário no banco de dados, realizando as devidas validações e criptografia da senha.
     * @param credentials ICredentials -> Objeto contendo as credenciais do novo usuário (username, password, email).
     * @returns Promise -> Promessa do banco de dados com o objeto do usuário criado.
     * @throws Error -> Lança um erro se as credenciais forem inválidas ou se o e-mail já estiver em uso.
    */
    public async registerUser(credentials: ICredentials) {
        if(!credentials || !credentials.password || !credentials.username || !credentials.email) {
            throw new Error('The user could not be created because one or more required values were null or undefined.', HttpStatusCode.BadRequest);
        }
        
        const userRepository = new UserRepository();

        if(await (userRepository.findUserByEmail(credentials.email))) throw new Error('This e-mail is already in use.', HttpStatusCode.BadRequest);

        credentials.password = await this.hashPassword(credentials.password);
        
        return userRepository.insertUser(credentials);
    }

    /**
     * Atualiza os dados de um usuário, validando as credenciais e a senha atual antes de realizar as alterações.
     * @param id string -> ID do usuário a ser atualizado.
     * @param credentials ICredentials -> Objeto contendo os novos dados do usuário (username, password, email, currentPassword).
     * @returns Promise -> Promessa do banco de dados com o objeto do usuário atualizado.
     * @throws Error -> Lança um erro se as credenciais forem inválidas, se a senha atual for incorreta ou se o e-mail já estiver em uso.
    */
    public async updateUser(id: string, credentials: ICredentials) {
        if(!credentials && !credentials.password && !credentials.username && !credentials.email && !credentials.currentPassword) {
            throw new Error('No updates were made because all provided values were null or undefined.', HttpStatusCode.BadRequest);
        }

        const userRepository = new UserRepository();
        const user = await userRepository.findUserById(id);

        if(!user) throw new Error('This user can not be updated because it does not exist.', HttpStatusCode.BadRequest);

        if(!credentials.currentPassword) throw new Error('Your current password is required.', HttpStatusCode.BadRequest);

        if(!(await bcrypt.compare(credentials.currentPassword, user?.password))) throw new Error('Current password is invalid.', HttpStatusCode.BadRequest);
        
        const dataToBeUpdated = { username: '', password: '', email: '' };

        if(credentials.username) dataToBeUpdated.username = credentials.username;
        if(credentials.password) dataToBeUpdated.password = await this.hashPassword(credentials.password);

        if(credentials.email) {
            if(await (userRepository.findUserByEmail(credentials.email))) throw new Error('This e-mail is already in use.', HttpStatusCode.BadRequest);
            dataToBeUpdated.email = credentials.email;
        }

        return userRepository.updateUserRegister(id, dataToBeUpdated);
    }

    /**
     * Atualiza a imagem de perfil de um usuário.
     * @param user_id string -> ID do usuário cuja imagem de perfil será atualizada.
     * @param profile_img string -> Imagem de perfil em formato base64.
     * @returns Promise -> Promessa do banco de dados com o objeto do usuário atualizado com a nova imagem de perfil.
     * @throws Error -> Lança um erro se o usuário não existir.
    */
    public async updateProfileImage(user_id: string, profile_img: string) {
        const userRepository = new UserRepository();

        if(!(await userRepository.findUserById(user_id))) throw new Error('This user can not be updated because it does not exist.', HttpStatusCode.BadRequest);

        return userRepository.updateProfileImage(user_id, profile_img);
    }

    /**
     * Criptografa a senha do usuário usando o bcrypt.
     * @param password string -> Senha a ser criptografada.
     * @returns Promise<string> -> Promessa do banco de dados com a senha criptografada.
     * @throws Error -> Lança um erro se ocorrer algum problema durante a criptografia.
    */
    private async hashPassword(password: string): Promise<string> {
        try {
            return await bcrypt.hash(password, parseInt(process.env.PASSWORD_HASH_SALT_ROUNDS));
        } catch (err) {
            const logger = new LoggerService();
            const errorMessage = `Error hashing password: ${err.message}`

            logger.print('ERROR', errorMessage);

            throw new Error(errorMessage, HttpStatusCode.InternalServerError);
        }
    }
}

export { UserService };