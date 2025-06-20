import axios from "axios";
import type {
  AuthCredentials,
  RegisterData,
  LoginResponse,
} from "../types/User";

const API_URL =
  import.meta.env.VITE_AUTH_URL || "http://localhost:3001/api/auth";

// Login con tipado de respuesta
export const login = async (
  credentials: AuthCredentials
): Promise<LoginResponse> => {
  const response = await axios.post<LoginResponse>(
    `${API_URL}/login`,
    credentials
  );
  return response.data;
};

// Registro de usuario
export const register = async (data: RegisterData): Promise<void> => {
  await axios.post(`${API_URL}/register`, data);
};
