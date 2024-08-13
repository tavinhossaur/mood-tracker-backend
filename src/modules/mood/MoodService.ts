import { IMoodRequest } from '../../interfaces/mood/IMoodRequest';
import { MoodRepository } from './MoodRepository';
import { IMoodResponse } from '../../interfaces/mood/IMoodResponse';
import { HttpStatusCode } from 'axios';
import Error from '../../error/error';

class MoodService {
    /**
     * Cria um novo registro de mood.
     * @param mood IMoodRequest -> Objeto contendo os dados do mood a serem registrados.
     * @param id string -> ID do usuário que está registrando o mood.
     * @returns Promise -> Promessa do banco de dados com o registro criado.
    */
    public async createMoodRegister(mood: IMoodRequest, id: string) {
        const moodRepository = new MoodRepository();
        return moodRepository.insertMoodRegister(mood, id);
    }

    /**
     * Recupera todos os registros de um usuário, com a opção de limitar a quantidade de resultados.
     * Os registros são reduzidos em uma resposta formatada com ID, data e nota.
     * @param user_id string -> ID do usuário cujos registros serão recuperados.
     * @param limit number -> (Opcional) Número máximo de registros a serem retornados.
     * @returns Promise -> Promessa do banco de dados com uma lista formatada de registros.
    */
    public async getAllMoods(user_id: string, limit?: number) {
        const moodRepository = new MoodRepository();

        return (await moodRepository.findAllMoods(user_id, limit)).reduce((acc: IMoodResponse[], { id, mood_value, created_at, notes }) => {
            const { text_content } = notes.find((note: { mood_id: string; }) => note.mood_id === id);

            acc.push({ mood_id: id, id: mood_value, date: created_at, note: text_content });

            return acc;
        }, [])
    }

    /**
     * Recupera os registros da última semana de um usuário e agrupa-os pelo ID, contando a quantidade de vezes que cada mood foi registrado.
     * @param user_id string -> ID do usuário cujos registrosserão recuperados.
     * @returns Promise -> Promessa do banco de dados com uma lista de objetos contendo o ID do mood e a quantidade de vezes que foi registrado.
    */
    public async getMoodsFromLastWeek(user_id: string) {
        const moodRepository = new MoodRepository();

        return (await moodRepository.findMoodsFromLastWeek(user_id)).reduce((acc: { id: string; quantity: number; }[], { mood_value }: any) => {
            const existing = acc.find((item: { id: string; }) => item.id === mood_value);

            if(!existing) acc.push({ id: mood_value, quantity: 1 });
            else existing.quantity += 1;

            return acc;
        }, [])
    }

    /**
     * Recupera os registros do último semestre de um usuário e os agrupa por mês, contando a quantidade de vezes que cada mood foi registrado por mês.
     * @param user_id string -> ID do usuário cujos registros serão recuperados.
     * @returns Promise -> Promessa do banco de dados com uma lista de objetos, onde cada objeto representa um mês e contém um array de moods registrados nesse mês.
    */
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

    /**
     * Verifica se o registro existe antes de tentar atualizá-lo, 
     * e caso exista, atualiza a nota associada ao mood_id.
     * @param mood_id string -> ID do registro cuja nota será atualizada.
     * @param text_content string -> Novo conteúdo textual da nota.
     * @returns Promise -> Promessa do banco de dados com a atualização da nota do registro.
     * @throws Error -> Lança um erro se o registro não existir.
    */
    public async updateMoodNote(mood_id: string, text_content: string) {
        const moodRepository = new MoodRepository();

        if(!(await moodRepository.findMoodRegisterById(mood_id))) throw new Error('This mood can not be updated because it does not exist.', HttpStatusCode.BadRequest);

        return moodRepository.updateNoteRegister(mood_id, text_content);
    }

    /**
     * Verifica se o registro existe antes de tentar deletá-lo, 
     * e caso exista, deleta a nota associada ao mood_id.
     * @param mood_id string -> ID do registro a ser deletado.
     * @returns Promise -> Promessa do banco de dados com a exclusão do registro.
     * @throws Error -> Lança um erro se o registro não existir.
    */
    public async deleteMoodRegister(mood_id: string) {
        const moodRepository = new MoodRepository();

        if(!(await moodRepository.findMoodRegisterById(mood_id))) throw new Error('This mood can not be deleted because it does not exist.', HttpStatusCode.BadRequest);

        return moodRepository.deleteMoodRegister(mood_id);
    }
}

export { MoodService };