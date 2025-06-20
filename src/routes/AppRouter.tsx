import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "../pages/Login";
import Register from "../pages/Register";
import Profile from "../pages/Profile";
import Posts from "../pages/Posts";
import CreatePost from "../pages/CreatePost";
import { useAuthStore } from "../store/authStore";

export default function AppRouter() {
  const token = useAuthStore((state) => state.token);

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/login" />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Rutas protegidas */}
        <Route
          path="/perfil"
          element={token ? <Profile /> : <Navigate to="/login" />}
        />
        <Route
          path="/posts"
          element={token ? <Posts /> : <Navigate to="/login" />}
        />
        <Route
          path="/posts/create"
          element={token ? <CreatePost /> : <Navigate to="/login" />}
        />

        <Route path="*" element={<Navigate to="/login" />} />
      </Routes>
    </BrowserRouter>
  );
}
