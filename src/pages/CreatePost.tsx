import { useForm } from "react-hook-form";
import { useAuthStore } from "../store/authStore";
import { useNavigate } from "react-router-dom";
import { createPost } from "../api/posts";
import { useState } from "react";
import type { PostFormData } from "../types/Post";
import Header from "../components/Header";


export default function CreatePost() {
  const { register, handleSubmit, formState: { errors }, reset } = useForm<PostFormData>();
  const token = useAuthStore((state) => state.token);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const onSubmit = async (data: PostFormData) => {
    try {
      setLoading(true);
      await createPost(data);
      reset();
      navigate("/posts");
    } catch (error) {
      alert("Error al crear publicación");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-900 via-purple-900 to-blue-900 p-4">
        <Header />
      <div className="max-w-md w-full bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl p-8 shadow-2xl text-white">
        <h2 className="text-3xl font-bold text-center mb-6 bg-gradient-to-r from-purple-400 to-blue-400 text-transparent bg-clip-text">
          Crear Publicación
        </h2>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label htmlFor="message" className="block text-blue-200 mb-1">Mensaje</label>
            <textarea
              id="message"
              {...register("message", {
                required: "El mensaje es requerido",
                minLength: {
                  value: 5,
                  message: "Debe tener al menos 5 caracteres",
                },
              })}
              rows={5}
              placeholder="Escribe tu mensaje..."
              className="w-full p-3 rounded-lg bg-white/10 border border-white/30 text-white placeholder-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
            />
            {errors.message && (
              <p className="text-red-400 text-sm mt-1">{errors.message.message}</p>
            )}
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold py-3 rounded-xl shadow-md hover:shadow-xl transition-all duration-300 disabled:opacity-50"
          >
            {loading ? "Publicando..." : "Publicar"}
          </button>
        </form>
      </div>
    </div>
  );
}
