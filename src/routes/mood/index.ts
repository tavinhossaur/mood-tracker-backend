import { Router } from 'express';
import { MoodController } from '../../modules/mood/MoodController';

const mood = Router();
const moodController = new MoodController();

mood.get('/all', moodController.getAllMoods);
mood.get('/lastWeek', moodController.getMoodsFromLastWeek);
mood.get('/lastSemester', moodController.getMoodsFromLastSemester);

mood.post('/new', moodController.createMoodRegister);
mood.post('/updateNote', moodController.updateMoodNote);

mood.delete('/delete', moodController.deleteMoodRegister);

export { mood };