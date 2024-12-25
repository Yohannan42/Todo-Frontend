import axios from "axios";

const API_BASE_URL = "http://localhost:5002/api/tasks";

export const getTasks = async (): Promise<any[]> => {
    const response = await axios.get(API_BASE_URL);
    return response.data;
};

export const createTask = async (title: string): Promise<any> => {
    const response = await axios.post(API_BASE_URL, { title });
    return response.data;
};

export const deleteTask = async (id: string): Promise<any> => {
    const response = await axios.delete(`${API_BASE_URL}/${id}`);
    return response.data;
};
