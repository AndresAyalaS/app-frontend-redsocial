import { useEffect } from "react";
import { useAuthStore } from "../store/authStore";
import { useNavigate } from "react-router-dom";
import Header from "../components/Header";

export default function Profile() {
  const user = useAuthStore((state) => state.user);
  const clearAuth = useAuthStore((state) => state.clearAuth);
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      navigate("/login");
    }
  }, [user, navigate]);

  const handleLogout = () => {
    clearAuth();
    navigate("/login");
  };

  if (!user) return null;

  const formattedBirthDate = new Date(user.birth_date).toLocaleDateString(
    "es-CO",
    {
      year: "numeric",
      month: "long",
      day: "numeric",
    }
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-blue-900 text-white pt-20 px-4">
      <Header />
      <div className="max-w-md mx-auto bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl p-8 shadow-2xl mt-12">
        <h2 className="text-3xl font-bold mb-6 text-center bg-gradient-to-r from-purple-400 to-blue-400 text-transparent bg-clip-text">
          Mi Perfil
        </h2>

        <div className="space-y-4">
          <div>
            <p className="text-sm text-blue-200">Nombre</p>
            <p className="text-lg font-semibold">
              {user.first_name} {user.last_name}
            </p>
          </div>

          <div>
            <p className="text-sm text-blue-200">Correo Electrónico</p>
            <p className="text-lg font-semibold">{user.email}</p>
          </div>

          <div>
            <p className="text-sm text-blue-200">Alias</p>
            <p className="text-lg font-semibold">{user.alias}</p>
          </div>

          <div>
            <p className="text-sm text-blue-200">Fecha de Nacimiento</p>
            <p className="text-lg font-semibold">{formattedBirthDate}</p>
          </div>
        </div>

        <button
          onClick={handleLogout}
          className="w-full mt-8 bg-red-500 hover:bg-red-600 text-white py-3 rounded-xl font-semibold transition-all duration-300 shadow-lg hover:shadow-xl"
        >
          Cerrar Sesión
        </button>
      </div>
    </div>
  );
}
