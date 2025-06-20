import axios from "axios";
import type { AuthCredentials, RegisterData } from "../types/User";

const API_URL = import.meta.env.VITE_AUTH_URL || "http://localhost:3001/api/auth";

export const login = async (credentials: AuthCredentials) => {
  const response = await axios.post(`${API_URL}/login`, credentials);
  return response.data;
};

export const register = async (data: RegisterData) => {
  const response = await axios.post(`${API_URL}/register`, data);
  return response.data;
};