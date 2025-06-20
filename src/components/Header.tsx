import { Link, useNavigate } from "react-router-dom";
import { useAuthStore } from "../store/authStore";

export default function Header() {
  const token = useAuthStore((state) => state.token);
  const clearAuth = useAuthStore((state) => state.clearAuth);
  const navigate = useNavigate();

  const handleLogout = () => {
    clearAuth();
    navigate("/login");
  };

  return (
    <header className="w-full flex items-center justify-between px-6 py-4 bg-white/10 backdrop-blur-sm border-b border-white/20 text-white shadow-md fixed top-0 left-0 z-50">
      <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-blue-400 text-transparent bg-clip-text">
        MiRedSocial
      </h1>

      {token && (
        <nav className="flex gap-4 text-sm">
          <Link to="/perfil" className="hover:text-blue-400 transition">
            Perfil
          </Link>
          <Link to="/posts" className="hover:text-blue-400 transition">
            Publicaciones
          </Link>
          <Link to="/posts/create" className="hover:text-blue-400 transition">
            Crear
          </Link>
          <button
            onClick={handleLogout}
            className="text-red-300 hover:text-red-500 transition"
          >
            Cerrar sesión
          </button>
        </nav>
      )}
    </header>
  );
}
