import axios from "axios";
import { useAuthStore } from "../store/authStore";
import type { PostFormData } from "../types/Post";

const API_URL = import.meta.env.VITE_POST_URL || "http://localhost:3002/api/posts";

// Instancia de axios con el token desde Zustand
const api = axios.create({
  baseURL: API_URL,
});

// Interceptor para agregar el token en cada request
api.interceptors.request.use((config) => {
  const token = useAuthStore.getState().token;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Obtener todos los posts
export const getPosts = async () => {
  const res = await api.get("/");
  return res.data;
};

// Dar like a un post
export const likePost = async (postId: string) => {
  const res = await api.post("/like", { postId });
  return res.data;
};

// Crear un nuevo post
export const createPost = async (data: PostFormData) => {
  const res = await api.post("/", data);
  return res.data;
};