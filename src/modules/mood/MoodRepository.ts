import db from '../../database/database';
import { IMoodRequest } from '../../interfaces/mood/IMoodRequest';

class MoodRepository {
    /**
     * Insere um novo registro de mood no banco de dados.
     * @param moodRequest IMoodRequest -> Objeto contendo os dados do mood a serem registrados.
     * @param user_id string -> ID do usuário que está registrando o mood.
     * @returns Promise -> Promessa do banco de dados com o registro criado.
    */
    public async insertMoodRegister(moodRequest: IMoodRequest, user_id: string) {
        return db.mood.create({ 
            data: { 
                mood_value: moodRequest.id, 
                user_id, 
                notes: { create: { text_content: moodRequest.note } } 
            } 
        });
    }

    /**
     * Encontra um registro de mood pelo seu ID.
     * @param id string -> ID do registro a ser encontrado.
     * @returns Promise -> Promessa do banco de dados com o registro encontrado, ou null se não for encontrado.
    */
    public async findMoodRegisterById(id: string) {
        return db.mood.findUnique({ where: { id } });
    }

    /**
     * Encontra todos os registros de um usuário, com a opção de limitar a quantidade de resultados.
     * @param user_id string -> ID do usuário cujos registros serão recuperados.
     * @param limit number -> (Opcional) Número máximo de registros a serem retornados.
     * @returns Promise -> Promessa do banco de dados com uma lista de registros encontrados.
    */
    public async findAllMoods(user_id: string, limit?: number) {
        return db.mood.findMany({ 
            where: { user_id }, 
            include: { notes: true }, 
            take: limit, 
            orderBy: { created_at: 'desc' } 
        });
    }

    /**
     * Encontra os registros da última semana de um usuário.
     * @param user_id string -> ID do usuário cujos registros serão recuperados.
     * @returns Promise -> Promessa do banco de dados com uma lista de registros da última semana.
    */
    public async findMoodsFromLastWeek(user_id: string) {
        const today = new Date();
        const lastWeek = new Date(); 
        
        lastWeek.setDate(today.getDate() - 7);

        return db.mood.findMany({ 
            where: { 
                user_id, 
                AND: { created_at: { gte: lastWeek, lte: today } } 
            }, 
            orderBy: { created_at: 'desc' } 
        });
    }

    /**
     * Encontra os registros do último semestre de um usuário.
     * @param user_id string -> ID do usuário cujos registros serão recuperados.
     * @returns Promise -> Promessa do banco de dados com uma lista de registros do último semestre.
    */
    public async findMoodsFromLastSemester(user_id: string) {
        const today = new Date();
        const lastSemester = new Date(); 
        
        lastSemester.setDate(today.getMonth() - 6);

        return db.mood.findMany({ 
            where: { 
                user_id, 
                AND: { created_at: { gte: lastSemester, lte: today } } 
            }, 
            orderBy: { created_at: 'desc' } 
        });
    }

    /**
     * Atualiza a nota associada a um registro de mood.
     * @param mood_id string -> ID do registro cuja nota será atualizada.
     * @param text_content string -> Novo conteúdo textual da nota.
     * @returns Promise -> Promessa do banco de dados com o número de registros atualizados. (linhas afetadas)
    */
    public async updateNoteRegister(mood_id: string, text_content: string) {
        return db.notes.updateMany({ 
            where: { mood_id }, 
            data: { text_content } 
        });
    }

    /**
     * Deleta um registro de mood do banco de dados.
     * @param mood_id string -> ID do registro a ser deletado.
     * @returns Promise -> Promessa do banco de dados com o registro do mood deletado.
    */
    public async deleteMoodRegister(mood_id: string) {
        return db.mood.delete({ where: { id: mood_id } });
    }
}

export { MoodRepository };