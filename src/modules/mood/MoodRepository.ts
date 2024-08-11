import db from '../../database/database';
import { IMoodRequest } from '../../interfaces/mood/IMoodRequest';

class MoodRepository {
    public async insertMoodRegister(moodRequest: IMoodRequest, user_id: string) {
        return db.mood.create({ data: { mood_value: moodRequest.id, user_id, notes: { create: { text_content: moodRequest.note } } } });
    }

    public async findMoodRegisterById(id: string) {
        return db.mood.findUnique({ where: { id } });
    }

    public async findAllMoods(user_id: string, limit?: number) {
        return db.mood.findMany({ where: { user_id }, include: { notes: true }, take: limit, orderBy: { created_at: 'desc' } });
    }

    public async findMoodsFromLastWeek(user_id: string) {
        const today = new Date();
        const lastWeek = new Date(); 
        
        lastWeek.setDate(today.getDate() - 7);

        return db.mood.findMany({ where: { user_id, AND: { created_at: { gte: lastWeek, lte: today } } }, orderBy: { created_at: 'desc' } });
    }

    public async findMoodsFromLastSemester(user_id: string) {
        const today = new Date();
        const lastSemester = new Date(); 
        
        lastSemester.setDate(today.getMonth() - 6);

        return db.mood.findMany({ where: { user_id, AND: { created_at: { gte: lastSemester, lte: today } } }, orderBy: { created_at: 'desc' } });
    }

    public async updateNoteRegister(mood_id: string, text_content: string) {
        return db.notes.updateMany({ where: { mood_id }, data: { text_content } });
    }

    public async deleteMoodRegister(mood_id: string) {
        return db.mood.delete({ where: { id: mood_id } });
    }
}

export { MoodRepository };