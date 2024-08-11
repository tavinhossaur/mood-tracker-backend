import { HttpStatusCode } from 'axios';
import { Request, Response } from 'express';
import { IMoodRequest } from '../../interfaces/mood/IMoodRequest';
import { MoodService } from './MoodService';
import { handleUserToken } from '../../utils/token';
import Error from '../../error/error';

class MoodController {
    public async createMoodRegister(request: Request, response: Response) {
        const moodRequest: IMoodRequest = request.body;

        const { id } = await handleUserToken(request);

        const moodService = new MoodService();

        if(!(await moodService.createMoodRegister(moodRequest, id))) throw new Error('Something went wrong when creating the register.', HttpStatusCode.InternalServerError);

        return response.status(HttpStatusCode.Created).json();
    }

    public async getAllMoods(request: Request, response: Response) {
        const { id } = await handleUserToken(request);
        const moodService = new MoodService();

        return response.status(HttpStatusCode.Ok).json(await moodService.getAllMoods(id));
    }

    public async getMoodsFromLastWeek(request: Request, response: Response) {
        const { id } = await handleUserToken(request);
        const moodService = new MoodService();

        return response.status(HttpStatusCode.Ok).json(await moodService.getMoodsFromLastWeek(id));
    }

    public async getMoodsFromLastSemester(request: Request, response: Response) {
        const { id } = await handleUserToken(request);
        const moodService = new MoodService();

        return response.status(HttpStatusCode.Ok).json(await moodService.getMoodsFromLastSemester(id));
    }

    public async updateMoodNote(request: Request, response: Response) {
        const { mood_id, text_content } = request.body;
        const moodService = new MoodService();

        if(!(await moodService.updateMoodNote(mood_id, text_content))) throw new Error('Something went wrong when updating the mood note.', HttpStatusCode.InternalServerError);

        return response.status(HttpStatusCode.Ok).json({ msg: 'Mood note successfully updated.' });
    }

    public async deleteMoodRegister(request: Request, response: Response) {
        const { mood_id } = request.body;
        const moodService = new MoodService();

        if(!(await moodService.deleteMoodRegister(mood_id))) throw new Error('Something went wrong when deleting the mood.', HttpStatusCode.InternalServerError);

        return response.status(HttpStatusCode.NoContent).json();
    }
}

export { MoodController }