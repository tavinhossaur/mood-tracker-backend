import { Router } from 'express';
import { MoodController } from '../../modules/mood/MoodController';

const mood = Router();
const moodController = new MoodController();

// Busca de registros
mood.get('/all', moodController.getAllMoods);
mood.get('/lastWeek', moodController.getMoodsFromLastWeek);
mood.get('/lastSemester', moodController.getMoodsFromLastSemester);

// Criação e atualização de registros
mood.post('/new', moodController.createMoodRegister);
mood.post('/updateNote', moodController.updateMoodNote);

// Exclusão de registros
mood.delete('/delete', moodController.deleteMoodRegister);

export { mood };