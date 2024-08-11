import { MoodTypes } from '../enum/MoodTypes';

export interface IMoodRequest {
    id: MoodTypes;
    note: string;
}