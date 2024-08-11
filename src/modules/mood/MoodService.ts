import { IMoodRequest } from '../../interfaces/mood/IMoodRequest';
import { MoodRepository } from './MoodRepository';
import { IMoodResponse } from '../../interfaces/mood/IMoodResponse';
import { HttpStatusCode } from 'axios';
import Error from '../../error/error';

class MoodService {
    public async createMoodRegister(mood: IMoodRequest, id: string) {
        const moodRepository = new MoodRepository();
        return moodRepository.insertMoodRegister(mood, id);
    }

    public async getAllMoods(user_id: string, limit?: number) {
        const moodRepository = new MoodRepository();

        return (await moodRepository.findAllMoods(user_id, limit)).reduce((acc: IMoodResponse[], { id, mood_value, created_at, notes }) => {
            const { text_content } = notes.find((note: { mood_id: string; }) => note.mood_id === id);

            acc.push({ mood_id: id, id: mood_value, date: created_at, note: text_content });

            return acc;
        }, [])
    }

    public async getMoodsFromLastWeek(user_id: string) {
        const moodRepository = new MoodRepository();

        return (await moodRepository.findMoodsFromLastWeek(user_id)).reduce((acc: { id: string; quantity: number; }[], { mood_value }: any) => {
            const existing = acc.find((item: { id: string; }) => item.id === mood_value);

            if(!existing) acc.push({ id: mood_value, quantity: 1 });
            else existing.quantity += 1;

            return acc;
        }, [])
    }

    public async getMoodsFromLastSemester(user_id: string) {
        const moodRepository = new MoodRepository();

        return (await moodRepository.findMoodsFromLastSemester(user_id)).reduce((acc: any[], { mood_value, created_at }: any) => {
            const date = new Date(created_at);
            const monthLabel = date.toLocaleString('en-US', { month: 'short' });
          
            let monthEntry = acc.find((entry: { label: string; }) => entry.label === monthLabel);
          
            if(!monthEntry) {
              monthEntry = { stack: [], label: monthLabel };
              acc.push(monthEntry);
            }

            let moodEntry = monthEntry.stack.find((item: { id: number; }) => item.id === mood_value);
          
            if(!moodEntry) {
              moodEntry = { id: mood_value, quantity: 0 };
              monthEntry.stack.push(moodEntry);
            }
          
            moodEntry.quantity += 1;
          
            return acc;
        }, []);
    }

    public async updateMoodNote(mood_id: string, text_content: string) {
        const moodRepository = new MoodRepository();

        if(!(await moodRepository.findMoodRegisterById(mood_id))) throw new Error('This mood can not be updated because it does not exist.', HttpStatusCode.BadRequest);

        return moodRepository.updateNoteRegister(mood_id, text_content);
    }

    public async deleteMoodRegister(mood_id: string) {
        const moodRepository = new MoodRepository();

        if(!(await moodRepository.findMoodRegisterById(mood_id))) throw new Error('This mood can not be deleted because it does not exist.', HttpStatusCode.BadRequest);

        return moodRepository.deleteMoodRegister(mood_id);
    }
}

export { MoodService };