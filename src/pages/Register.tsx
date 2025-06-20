import { JSX, useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import {
  Mail,
  Lock,
  Eye,
  EyeOff,
  User,
  Calendar,
  UserPlus,
} from "lucide-react";

import type { RegisterData } from "../types/User";
import { register as registerUser } from "../api/auth";

export default function Register() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterData>();
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const onSubmit = async (data: RegisterData) => {
    try {
      await registerUser(data);
      alert("Usuario registrado correctamente");
      navigate("/login");
    } catch {
      alert("Error al registrar");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 flex items-center justify-center p-4 relative overflow-hidden">
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-pink-400 to-purple-600 rounded-full opacity-20 blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-br from-blue-400 to-cyan-600 rounded-full opacity-20 blur-3xl animate-pulse delay-1000"></div>
      </div>

      <div className="relative w-full max-w-md">
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl p-8 shadow-2xl space-y-6 text-white"
        >
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-green-400 to-blue-600 rounded-2xl mb-4 shadow-lg">
              <UserPlus className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-white mb-2 bg-gradient-to-r from-green-400 to-blue-400 bg-clip-text text-transparent">
              Crear Cuenta
            </h1>
            <p className="text-blue-200/80 text-sm">
              Completa los campos para registrarte
            </p>
          </div>

          <InputField
            label="Correo electrónico"
            icon={<Mail className="h-5 w-5" />}
            type="email"
            placeholder="correo@ejemplo.com"
            register={register("email", {
              required: "El correo es obligatorio",
              pattern: {
                value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                message: "Correo inválido",
              },
            })}
            error={errors.email?.message}
          />

          <InputField
            label="Contraseña"
            icon={<Lock className="h-5 w-5" />}
            type={showPassword ? "text" : "password"}
            placeholder="••••••••"
            register={register("password", {
              required: "La contraseña es obligatoria",
              minLength: {
                value: 6,
                message: "Mínimo 6 caracteres",
              },
            })}
            error={errors.password?.message}
            rightIcon={
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-4 flex items-center text-blue-300/60 hover:text-blue-400 transition"
              >
                {showPassword ? (
                  <EyeOff className="h-5 w-5" />
                ) : (
                  <Eye className="h-5 w-5" />
                )}
              </button>
            }
          />

          <InputField
            label="Nombre"
            icon={<User className="h-5 w-5" />}
            placeholder="Tu nombre"
            register={register("firstName", {
              required: "El nombre es obligatorio",
            })}
            error={errors.firstName?.message}
          />

          <InputField
            label="Apellido"
            icon={<User className="h-5 w-5" />}
            placeholder="Tu apellido"
            register={register("lastName", {
              required: "El apellido es obligatorio",
            })}
            error={errors.lastName?.message}
          />

          <InputField
            label="Alias"
            icon={<User className="h-5 w-5" />}
            placeholder="Alias único"
            register={register("alias", {
              required: "El alias es obligatorio",
            })}
            error={errors.alias?.message}
          />

          <InputField
            label="Fecha de nacimiento"
            icon={<Calendar className="h-5 w-5" />}
            type="date"
            register={register("birthDate", {
              required: "La fecha es obligatoria",
            })}
            error={errors.birthDate?.message}
          />

          <button
            type="submit"
            className="w-full bg-gradient-to-r from-green-500 to-blue-600 hover:from-green-600 hover:to-blue-700 text-white font-semibold py-3 rounded-xl transition-all duration-300 transform hover:scale-[1.02] hover:shadow-xl"
          >
            Registrarse
          </button>
          <div className="mt-4 text-center">
            <p className="text-sm text-gray-400">
              ¿Ya tienes una cuenta?{" "}
              <button
                type="button"
                onClick={() => navigate("/login")}
                className="text-blue-400 hover:underline"
              >
                Inicia sesión
              </button>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}

type InputProps = {
  label: string;
  icon: JSX.Element;
  type?: string;
  placeholder?: string;
  register: any;
  error?: string;
  rightIcon?: JSX.Element;
};

function InputField({
  label,
  icon,
  type = "text",
  placeholder = "",
  register,
  error,
  rightIcon,
}: InputProps) {
  return (
    <div className="space-y-2">
      <label className="text-blue-200 text-sm font-medium block">{label}</label>
      <div className="relative group">
        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
          {icon}
        </div>
        <input
          {...register}
          type={type}
          placeholder={placeholder}
          className={`w-full pl-12 pr-12 py-3 bg-white/5 border rounded-2xl text-white placeholder-blue-300/50 focus:outline-none transition-all duration-300 hover:bg-white/10 ${
            error
              ? "border-red-400 focus:ring-red-500"
              : "border-white/20 focus:ring-blue-400/50"
          }`}
        />
        {rightIcon}
      </div>
      {error && (
        <p className="text-red-400 text-xs mt-1 animate-pulse">{error}</p>
      )}
    </div>
  );
}
