import { HttpStatusCode } from 'axios';
import { ICredentials } from '../../interfaces/auth/ICredentials';
import { UserRepository } from './UserRepository';
import { LoggerService } from '../../logging/LoggerService';
import { IMoodTracking } from '../../interfaces/mood/IMoodTracking';
import { MoodService } from '../mood/MoodService';
import bcrypt from 'bcrypt';
import Error from '../../error/error';

class UserService {
    public async getUserMoodTracking(id: string): Promise<IMoodTracking> {
        const userRepository = new UserRepository();

        if(!(await userRepository.findUserById(id))) throw new Error('This user does not exist.', HttpStatusCode.BadRequest);

        const moodTracking = await userRepository.findUserMoodTracking(id);
        
        const { username, email } = moodTracking;
        const profileImage = moodTracking?.profile_preferences?.profile_img ? moodTracking?.profile_preferences?.profile_img.toString('base64') : null;
        
        const moodService = new MoodService();
        const recentMoods = await moodService.getAllMoods(id, parseInt(process.env.HOME_SCREEN_MOOD_ARRAY_SIZE));

        return { username, email, streakKind: 'null', profileImage, recentMoods }
    }

    public async registerUser(credentials: ICredentials) {
        if(!credentials || !credentials.password || !credentials.username || !credentials.email) {
            throw new Error('The user could not be created because one or more required values were null or undefined.', HttpStatusCode.BadRequest);
        }
        
        const userRepository = new UserRepository();

        if(await (userRepository.findUserByEmail(credentials.email))) throw new Error('This e-mail is already in use.', HttpStatusCode.BadRequest);

        credentials.password = await this.hashPassword(credentials.password);
        
        return userRepository.insertUser(credentials);
    }

    public async updateUser(id: string, credentials: ICredentials) {
        if(!credentials && !credentials.password && !credentials.username && !credentials.email && !credentials.currentPassword) {
            throw new Error('No updates were made because all provided values were null or undefined.', HttpStatusCode.BadRequest);
        }

        const userRepository = new UserRepository();
        const user = await userRepository.findUserById(id);

        if(!user) throw new Error('This user can not be updated because it does not exist.', HttpStatusCode.BadRequest);

        if(!credentials.currentPassword) throw new Error('Your current password is required.', HttpStatusCode.BadRequest);

        if(!(await bcrypt.compare(credentials.currentPassword, user?.password))) throw new Error('Current password typed is invalid.', HttpStatusCode.BadRequest);
        
        const dataToBeUpdated = { username: '', password: '', email: '' };

        if(credentials.username) dataToBeUpdated.username = credentials.username;
        if(credentials.password) dataToBeUpdated.password = await this.hashPassword(credentials.password);

        if(credentials.email) {
            if(await (userRepository.findUserByEmail(credentials.email))) throw new Error('This e-mail is already in use.', HttpStatusCode.BadRequest);
            dataToBeUpdated.email = credentials.email;
        }

        return userRepository.updateUserRegister(id, dataToBeUpdated);
    }

    public async updateProfileImage(user_id: string, profile_img: string) {
        const userRepository = new UserRepository();

        if(!(await userRepository.findUserById(user_id))) throw new Error('This user can not be updated because it does not exist.', HttpStatusCode.BadRequest);

        return userRepository.updateProfileImage(user_id, profile_img);
    }

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