import axios from "axios";

// Use the Render backend URL or fallback to a default value
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "https://planpal-9v29.onrender.com/api/moods";

interface MoodPayload {
    date: string;
    mood: string;
}

export const getMoods = async (): Promise<MoodPayload[]> => {
    try {
        const response = await axios.get(API_BASE_URL);
        return response.data;
    } catch (error: any) {
        console.error("Error fetching moods:", error.response?.data || error.message);
        throw error;
    }
};

export const saveMood = async (payload: MoodPayload): Promise<MoodPayload> => {
    try {
        const response = await axios.post(API_BASE_URL, payload);
        return response.data;
    } catch (error: any) {
        console.error("Error saving mood:", error.response?.data || error.message);
        throw error;
    }
};
