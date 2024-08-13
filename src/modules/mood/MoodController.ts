import { HttpStatusCode } from 'axios';
import { Request, Response } from 'express';
import { IMoodRequest } from '../../interfaces/mood/IMoodRequest';
import { MoodService } from './MoodService';
import { handleUserToken } from '../../utils/token';
import Error from '../../error/error';

class MoodController {
    /**
     * Função que cria um novo registro de humor no banco de dados.
     * @param request Request -> Requisição HTTP contendo o ID do mood e a nota digitada pelo usuário.
     * @param response Response -> Resposta HTTP a ser retornada após a criação do registro.
     * @returns Response -> Resposta HTTP sem corpo com o status da criação.
     * @throws Error -> Lança um erro se algo der errado durante a criação do registro.
    */
    public async createMoodRegister(request: Request, response: Response) {
        const moodRequest: IMoodRequest = request.body;

        const { id } = await handleUserToken(request);

        const moodService = new MoodService();

        if(!(await moodService.createMoodRegister(moodRequest, id))) throw new Error('Something went wrong when creating the register.', HttpStatusCode.InternalServerError);

        return response.status(HttpStatusCode.Created).json();
    }

    /**
     * Função que recupera todos os registros de humor de um usuário.
     * @param request Request -> Requisição HTTP contendo o token da sessão no header.
     * @param response Response -> Resposta HTTP contendo os registros de humor do usuário.
     * @returns Promise<IMoodResponse> -> Array de IMoodResponse.
    */
    public async getAllMoods(request: Request, response: Response) {
        const { id } = await handleUserToken(request);
        const moodService = new MoodService();

        return response.status(HttpStatusCode.Ok).json(await moodService.getAllMoods(id));
    }

    /**
     * Função que recupera os registros de humor da última semana de um usuário.
     * @param request Request -> Requisição HTTP contendo o token da sessão no header.
     * @param response Response -> Resposta HTTP contendo os registros de humor da última semana.
     * @returns Array formatado com os registros de mood da última semana.
    */
    public async getMoodsFromLastWeek(request: Request, response: Response) {
        const { id } = await handleUserToken(request);
        const moodService = new MoodService();

        return response.status(HttpStatusCode.Ok).json(await moodService.getMoodsFromLastWeek(id));
    }

    /**
     * Função que recupera os registros de humor dos últimos 6 meses de um usuário.
     * @param request Request -> Requisição HTTP contendo o token da sessão no header.
     * @param response Response -> Resposta HTTP contendo os registros de humor dos últimos 6 meses.
     * @returns Array formatado com os registros de mood dos últimos 6 meses.
    */
    public async getMoodsFromLastSemester(request: Request, response: Response) {
        const { id } = await handleUserToken(request);
        const moodService = new MoodService();

        return response.status(HttpStatusCode.Ok).json(await moodService.getMoodsFromLastSemester(id));
    }

    /**
     * Função que atualiza a nota de um registro de humor.
     * @param request Request -> Requisição HTTP contendo o id do mood à ser alterado e o novo texto da nota
     * @param response Response -> Resposta HTTP após a atualização da nota do registro de humor.
     * @returns Response -> Resposta HTTP com uma mensagem de sucesso.
     * @throws Error -> Lança um erro se algo der errado durante a atualização da nota.
    */
    public async updateMoodNote(request: Request, response: Response) {
        const { mood_id, text_content } = request.body;
        const moodService = new MoodService();

        if(!(await moodService.updateMoodNote(mood_id, text_content))) throw new Error('Something went wrong when updating the mood note.', HttpStatusCode.InternalServerError);

        return response.status(HttpStatusCode.Ok).json({ msg: 'Mood note successfully updated.' });
    }

    /**
     * Função que deleta um registro de humor do banco de dados.
     * @param request Request -> Requisição HTTP contendo o ID do registro de humor a ser deletado.
     * @param response Response -> Resposta HTTP após a exclusão do registro de humor.
     * @returns Response -> Resposta HTTP sem corpo com o status da exclusão.
     * @throws Error -> Lança um erro se algo der errado durante a exclusão do registro de humor.
    */
    public async deleteMoodRegister(request: Request, response: Response) {
        const { mood_id } = request.body; // Não recebo o ID pelo URL da requisição por se tratar de um UUID.
        const moodService = new MoodService();

        if(!(await moodService.deleteMoodRegister(mood_id))) throw new Error('Something went wrong when deleting the mood.', HttpStatusCode.InternalServerError);

        return response.status(HttpStatusCode.NoContent).json();
    }
}

export { MoodController }