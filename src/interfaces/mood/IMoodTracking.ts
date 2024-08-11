import { IMoodResponse } from "./IMoodResponse";

export interface IMoodTracking {
    username: string;
    email: string;
    streakKind: string;
    profileImage: string | null;
    recentMoods: IMoodResponse[]
}