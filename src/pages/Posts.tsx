import { useEffect, useState } from "react";
import { ThumbsUp } from "lucide-react";
import { getPosts, likePost } from "../api/posts";
import { useAuthStore } from "../store/authStore";
import type { Post } from "../types/Post";
import Header from "../components/Header";

export default function Posts() {
  const [posts, setPosts] = useState<Post[]>([]);
  const token = useAuthStore((state) => state.token);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const data = await getPosts();
        setPosts(data);
      } catch (error) {
        console.error("Error al obtener publicaciones:", error);
      }
    };

    if (token) fetchPosts();
  }, [token]);

  const handleLike = async (postId: string) => {
    try {
      await likePost(postId);
      setPosts((prev) =>
        prev.map((post) =>
          post.id === postId
            ? { ...post, likes: (parseInt(post.likes) + 1).toString() }
            : post
        )
      );
    } catch (error) {
      console.error("Error al dar like:", error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-blue-900 text-white pt-20 px-4">
      <Header />
      <h1 className="text-3xl font-bold text-center mb-8 bg-gradient-to-r from-purple-400 to-blue-400 text-transparent bg-clip-text">
        Publicaciones
      </h1>

      <div className="space-y-6 max-w-2xl mx-auto">
        {posts.map((post) => (
          <div
            key={post.id}
            className="bg-white/10 border border-white/20 rounded-xl p-6 shadow-lg backdrop-blur-md"
          >
            <div className="mb-2 text-sm text-blue-200">
              {post.alias} ({post.first_name} {post.last_name})
            </div>
            <p className="text-lg mb-4">{post.message}</p>
            <div className="flex justify-between items-center text-blue-300 text-sm">
              <span>{new Date(post.created_at).toLocaleString("es-CO")}</span>
              <button
                onClick={() => handleLike(post.id)}
                className="flex items-center gap-2 text-white hover:text-blue-400 transition"
              >
                <ThumbsUp className="w-5 h-5" /> {post.likes}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
