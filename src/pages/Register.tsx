import { useForm } from "react-hook-form";
import type { RegisterData } from "../types/User";
import { register as registerUser } from "../api/auth";
import { useNavigate } from "react-router-dom";

export default function Register() {
  const { register, handleSubmit } = useForm<RegisterData>();
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
    <div className="p-4 max-w-md mx-auto">
      <h2 className="text-2xl font-bold mb-4">Registro</h2>
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
        <input {...register("email")} placeholder="Email" className="p-2 border" />
        <input {...register("password")} type="password" placeholder="Contraseña" className="p-2 border" />
        <input {...register("firstName")} placeholder="Nombre" className="p-2 border" />
        <input {...register("lastName")} placeholder="Apellido" className="p-2 border" />
        <input {...register("alias")} placeholder="Alias" className="p-2 border" />
        <input {...register("birthDate")} type="date" className="p-2 border" />
        <button type="submit" className="bg-green-600 text-white p-2 rounded">Registrarse</button>
      </form>
    </div>
  );
}
