import axios from "axios";

const API_BASE_URL = "http://localhost:5002/api/tasks";

interface TaskPayload {
  title: string;
  date: string;
  time: string;
  priority: string; // Add priority
  status: string; 
}

export const getTasks = async (): Promise<any[]> => {
  try {
    const response = await axios.get(API_BASE_URL);
    return response.data;
  } catch (error: any) {
    console.error("Error fetching tasks:", error.response || error.message);
    throw error;
  }
};

export const createTask = async (payload: TaskPayload): Promise<any> => {
  try {
    const response = await axios.post(API_BASE_URL, payload);
    return response.data;
  } catch (error: any) {
    console.error("Error creating task:", error.response || error.message);
    throw error;
  }
};

export const deleteTask = async (id: string): Promise<any> => {
  try {
    const response = await axios.delete(`${API_BASE_URL}/${id}`);
    return response.data;
  } catch (error: any) {
    console.error("Error deleting task:", error.response || error.message);
    throw error;
  }
};
