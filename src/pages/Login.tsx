import { useForm } from "react-hook-form";
import type { AuthCredentials } from "../types/User";
import { login } from "../api/auth";
import { useAuthStore } from "../store/authStore";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const { register, handleSubmit } = useForm<AuthCredentials>();
  const setToken = useAuthStore((state) => state.setToken);
  const navigate = useNavigate();

  const onSubmit = async (data: AuthCredentials) => {
    try {
      const res = await login(data);
      setToken(res.token);
      navigate("/perfil");
    } catch (err) {
      console.error("Login error:", err);
      alert("Credenciales inválidas");
    }
  };

  return (
    <div className="p-4 max-w-md mx-auto">
      <h2 className="text-2xl font-bold mb-4">Iniciar Sesión</h2>
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
        <input
          {...register("email")}
          placeholder="Email"
          className="p-2 border"
        />
        <input
          {...register("password")}
          type="password"
          placeholder="Contraseña"
          className="p-2 border"
        />
        <button type="submit" className="bg-blue-600 text-white p-2 rounded">
          Login
        </button>
      </form>
    </div>
  );
}
