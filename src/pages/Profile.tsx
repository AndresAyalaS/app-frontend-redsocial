import { useEffect, useState } from "react";
import { useAuthStore } from "../store/authStore";
import { useNavigate } from "react-router-dom";
import Header from "../components/Header";
import { getUserPosts } from "../api/posts";
import { Post } from "../types/Post";

export default function Profile() {
  const user = useAuthStore((state) => state.user);
  const token = useAuthStore((state) => state.token);
  const clearAuth = useAuthStore((state) => state.clearAuth);
  const navigate = useNavigate();
  const [userPosts, setUserPosts] = useState<Post[]>([]);

  useEffect(() => {
    if (!user) {
      navigate("/login");
    }
  }, [user, navigate]);

  useEffect(() => {
    const fetchUserPosts = async () => {
      try {
        const data = await getUserPosts(user!.id);
        setUserPosts(data);
      } catch (error) {
        console.error("Error al obtener publicaciones del usuario:", error);
      }
    };

    if (user && token) {
      fetchUserPosts();
    }
  }, [user, token]);

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
    <>
      <Header />
      <div className="min-h-screen pt-24 px-4 bg-gradient-to-br from-indigo-900 via-purple-900 to-blue-900 text-white">
        <div className="max-w-4xl mx-auto grid md:grid-cols-2 gap-8">
          <div className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl p-8 shadow-2xl">
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

              <button
                onClick={handleLogout}
                className="w-full mt-6 bg-red-500 hover:bg-red-600 text-white py-3 rounded-xl font-semibold transition-all duration-300 shadow-lg hover:shadow-xl"
              >
                Cerrar Sesión
              </button>
            </div>
          </div>

          <div>
            <h3 className="text-2xl font-bold mb-4 bg-gradient-to-r from-purple-400 to-blue-400 text-transparent bg-clip-text">
              Mis Publicaciones
            </h3>
            {userPosts.length === 0 ? (
              <p className="text-blue-200">No tienes publicaciones aún.</p>
            ) : (
              <div className="space-y-4">
                {userPosts.map((post) => (
                  <div
                    key={post.id}
                    className="bg-white/10 border border-white/20 rounded-xl p-4 shadow-md"
                  >
                    <p className="text-sm text-blue-300">
                      {new Date(post.created_at).toLocaleString()}
                    </p>
                    <p className="text-lg mt-2">{post.message}</p>
                    <p className="text-sm text-blue-200 mt-1">
                      Likes: {post.likes}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
