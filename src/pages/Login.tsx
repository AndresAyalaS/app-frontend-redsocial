import { useForm } from "react-hook-form";
import { login } from "../api/auth";
import { useAuthStore } from "../store/authStore";
import { useNavigate } from "react-router-dom";
import type { AuthCredentials } from "../types/User";
import { Lock, Mail, Eye, EyeOff } from "lucide-react";
import { useState } from "react";

export default function Login() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<AuthCredentials>();

  const [showPassword, setShowPassword] = useState(false);
  const setAuth = useAuthStore((state) => state.setAuth);
  const navigate = useNavigate();

  const onSubmit = async (data: AuthCredentials) => {
    try {
      const res = await login(data);
      setAuth(res.token, res.user);
      navigate("/perfil");
    } catch (err) {
      console.error("Login error:", err);
      alert("Credenciales inválidas");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900 px-4">
      <div className="w-full max-w-md bg-white/10 backdrop-blur-lg border border-white/20 p-8 rounded-2xl shadow-2xl animate-fade-in">
        {/* Encabezado */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full shadow-lg mb-4">
            <Lock className="text-white w-8 h-8" />
          </div>
          <h2 className="text-3xl font-bold text-white">Bienvenido</h2>
          <p className="text-blue-200 mt-1 text-sm">
            Inicia sesión con tus credenciales
          </p>
        </div>

        {/* Formulario */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          {/* Email */}
          <div>
            <label htmlFor="email" className="text-blue-200 text-sm font-medium block mb-1">
              Correo Electrónico
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-blue-300" />
              <input
                id="email"
                {...register("email", {
                  required: "El correo es requerido",
                  pattern: {
                    value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                    message: "Correo inválido",
                  },
                })}
                type="email"
                placeholder="ejemplo@email.com"
                className={`w-full pl-10 pr-4 py-3 bg-white/10 border ${
                  errors.email ? "border-red-400" : "border-white/30"
                } rounded-xl text-white placeholder-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all duration-300`}
              />
            </div>
            {errors.email && (
              <p className="text-red-400 text-xs mt-1 animate-pulse">
                {errors.email.message}
              </p>
            )}
          </div>

          {/* Contraseña */}
          <div>
            <label htmlFor="password" className="text-blue-200 text-sm font-medium block mb-1">
              Contraseña
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-blue-300" />
              <input
                id="password"
                {...register("password", {
                  required: "La contraseña es requerida",
                  minLength: {
                    value: 6,
                    message: "Mínimo 6 caracteres",
                  },
                })}
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                className={`w-full pl-10 pr-10 py-3 bg-white/10 border ${
                  errors.password ? "border-red-400" : "border-white/30"
                } rounded-xl text-white placeholder-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all duration-300`}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-blue-300 hover:text-blue-100"
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
            {errors.password && (
              <p className="text-red-400 text-xs mt-1 animate-pulse">
                {errors.password.message}
              </p>
            )}
          </div>

          {/* Botón */}
          <button
            type="submit"
            className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold py-3 rounded-xl shadow-md hover:shadow-xl transition-all duration-300"
          >
            Iniciar Sesión
          </button>
        </form>

        {/* Enlace al registro */}
        <p className="text-center text-sm text-blue-200 mt-6">
          ¿No tienes cuenta?
          <button
            onClick={() => navigate("/register")}
            className="ml-1 text-blue-400 hover:underline"
          >
            Regístrate
          </button>
        </p>
      </div>
    </div>
  );
}
