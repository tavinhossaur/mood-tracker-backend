import { IMoodResponse } from "./IMoodResponse";

export interface IMoodTracking {
    username: string;
    email: string;
    streak: string;
    profileImage: string | null;
    recentMoods: IMoodResponse[]
}