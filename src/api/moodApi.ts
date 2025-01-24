import axios from "axios";

const API_BASE_URL = "http://localhost:5002/api/moods";

interface MoodPayload {
    date: string;
    mood: string;
}

export const getMoods = async (): Promise<MoodPayload[]> => {
    const response = await axios.get(API_BASE_URL);
    return response.data;
};

export const saveMood = async (payload: MoodPayload): Promise<MoodPayload> => {
    const response = await axios.post(API_BASE_URL, payload);
    return response.data;
};
