import db from '../../database/database';
import { ICredentials } from '../../interfaces/auth/ICredentials';

class UserRepository {
    /**
     * Encontra um usuário no banco de dados pelo seu ID.
     * @param id string -> ID do usuário a ser encontrado.
     * @returns Promise -> Promessa do banco de dados com o objeto do usuário encontrado ou `null` se o usuário não existir.
    */
    public async findUserById(id: string) {
        return db.user.findUnique({ where: { id } });
    }

    /**
     * Encontra um usuário no banco de dados pelo seu email.
     * @param email string -> Email do usuário a ser encontrado.
     * @returns Promise -> Promessa do banco de dados com o objeto do usuário encontrado ou `null` se o usuário não existir.
    */
    public async findUserByEmail(email: string) {
        return db.user.findUnique({ where: { email } });
    }

    /**
     * Recupera os dados principais de um usuário, incluindo suas preferências de perfil e os registros de humor.
     * @param id string -> ID do usuário à ser procurado.
     * @returns Promise -> Promessa do banco de dados com o objeto do usuário incluindo suas preferências de perfil e registros de humor.
    */
    public async findUserMoodTracking(id: string) {
        return db.user.findUnique({ where: { id }, include: { profile_preferences: true, mood: true } });
    }

    /**
     * Insere um novo usuário no banco de dados.
     * @param user ICredentials -> Objeto contendo as credenciais do novo usuário (username, password e email).
     * @returns Promise -> Promessa do banco de dados com o objeto do usuário criado.
    */
    public async insertUser(user: ICredentials) {
        return db.user.create({ data: { username: user.username, password: user.password, email: user.email } });
    }

    /**
     * Atualiza os dados de um usuário no banco de dados. Apenas os campos fornecidos que não são null ou undefined serão atualizados.
     * @param id string -> ID do usuário a ser atualizado.
     * @param dataToBeUpdated object -> Objeto contendo os campos a serem atualizados (username, password e/ou email).
     * @returns Promise -> Promessa do banco de dados com o objeto do usuário atualizado ou `null` se nenhum campo for atualizado.
    */
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

    /**
     * Atualiza a imagem de perfil de um usuário no banco de dados. A imagem é convertida de uma string em base64 para um buffer antes de ser armazenada.
     * @param id string -> ID do usuário cuja imagem de perfil será atualizada.
     * @param profile_img string -> Imagem de perfil em formato base64.
     * @returns Promise -> Promessa do banco de dados com o objeto do usuário atualizado com a nova imagem de perfil.
    */
    public async updateProfileImage(id: string, profile_img: string) {
        const image = Buffer.from(profile_img, 'base64');
        return db.user.update({ where: { id }, data: { profile_preferences: { update: { profile_img: image } } } })
    }
}

export { UserRepository };