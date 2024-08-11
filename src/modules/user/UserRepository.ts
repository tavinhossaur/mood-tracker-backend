import db from '../../database/database';
import { ICredentials } from '../../interfaces/auth/ICredentials';

class UserRepository {
    public async findUserById(id: string) {
        return db.user.findUnique({ where: { id } });
    }

    public async findUserByEmail(email: string) {
        return db.user.findUnique({ where: { email } });
    }

    public async findUserMoodTracking(id: string) {
        return db.user.findUnique({ where: { id }, include: { profile_preferences: true, mood: true } });
    }

    public async insertUser(user: ICredentials) {
        return db.user.create({ data: { username: user.username, password: user.password, email: user.email } });
    }

    public async updateUserRegister(id: string, dataToBeUpdated: { username?: string; password?: string; email?: string; }) {
        const updateData: { [key: string]: any } = {};

        for (const [key, value] of Object.entries(dataToBeUpdated)) {
            if(value !== null && value !== undefined) {
                updateData[key] = value;
            }
        }

        if(Object.keys(updateData).length > 0) {
            return db.user.update({ where: { id }, data: updateData });
        }
    }

    public async updateProfileImage(id: string, profile_img: string) {
        const image = Buffer.from(profile_img, 'base64');

        console.log((await db.user.findUnique({ where: { id }, include: { profile_preferences: true } })).profile_preferences);

        return db.user.update({ where: { id }, data: { profile_preferences: { update: { profile_img: image } } } })
    }
}

export { UserRepository };