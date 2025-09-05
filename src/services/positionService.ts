import axios from "axios";

const API_URL = "http://localhost:8000/api/positions";

// Match backend fields
export interface Position {
  Position_Id: number;
  Position: string;
  Position_Desc?: string;
  created_at?: string;
  updated_at?: string;
  delete_at?: string;
}

// API calls return only the `.data`
export const getPositions = async (): Promise<Position[]> => {
  const response = await axios.get<Position[]>(API_URL);
  return response.data;
};

export const getPosition = async (id: number): Promise<Position> => {
  const response = await axios.get<Position>(`${API_URL}/${id}`);
  return response.data;
};

export const createPosition = async (data: Omit<Position, "Position_Id">): Promise<Position> => {
  const response = await axios.post<Position>(API_URL, data);
  return response.data;
};

export const updatePosition = async (id: number, data: Partial<Position>): Promise<Position> => {
  const response = await axios.put<Position>(`${API_URL}/${id}`, data);
  return response.data;
};

export const deletePosition = async (id: number): Promise<void> => {
  await axios.delete(`${API_URL}/${id}`);
};
