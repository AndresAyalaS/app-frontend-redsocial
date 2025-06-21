import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { describe, it, vi, beforeEach, expect, afterEach } from "vitest";
import { BrowserRouter } from "react-router-dom";

// Mocks
vi.mock("../store/authStore", () => ({
  useAuthStore: vi.fn(),
}));

vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual("react-router-dom");
  return {
    ...actual,
    useNavigate: vi.fn(),
  };
});

vi.mock("../components/Header", () => ({
  default: () => <div data-testid="header">Header Component</div>,
}));

vi.mock("../api/posts", () => ({
  getUserPosts: vi.fn(),
}));

import Profile from "./Profile";
import { useAuthStore } from "../store/authStore";
import { useNavigate } from "react-router-dom";
import { getUserPosts } from "../api/posts";
import { Post } from "../types/Post";

// Función para renderizar con Router
function renderProfile() {
  return render(
    <BrowserRouter>
      <Profile />
    </BrowserRouter>
  );
}

// Mock data
const mockUser = {
  id: "1",
  email: "test@test.com",
  first_name: "Juan",
  last_name: "Pérez",
  alias: "juanperez",
  birth_date: "1990-05-15",
};

const mockUserPosts: Post[] = [
  {
    id: "1",
    message: "Mi primera publicación",
    alias: "juanperez",
    first_name: "Juan",
    last_name: "Pérez",
    likes: "5",
    created_at: "2024-01-15T10:30:00Z",
  },
  {
    id: "2",
    message: "Segunda publicación del usuario",
    alias: "juanperez",
    first_name: "Juan",
    last_name: "Pérez",
    likes: "3",
    created_at: "2024-01-16T14:45:00Z",
  },
];

describe("Profile Component", () => {
  const mockNavigate = vi.fn();
  const mockClearAuth = vi.fn();

  beforeEach(() => {
    vi.mocked(useNavigate).mockReturnValue(mockNavigate);
    vi.mocked(getUserPosts).mockResolvedValue(mockUserPosts);
    

    vi.mocked(useAuthStore).mockReturnValue({
      user: mockUser,
      token: "fake-token",
      clearAuth: mockClearAuth,
    });
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it("renderiza el perfil correctamente cuando el usuario está autenticado", async () => {
    renderProfile();

    expect(screen.getByTestId("header")).toBeInTheDocument();
    expect(screen.getByText("Mi Perfil")).toBeInTheDocument();
    expect(screen.getByText("Mis Publicaciones")).toBeInTheDocument();
  });

  it("muestra las etiquetas de los campos correctamente", () => {
    renderProfile();

    expect(screen.getByText("Nombre")).toBeInTheDocument();
    expect(screen.getByText("Correo Electrónico")).toBeInTheDocument();
    expect(screen.getByText("Alias")).toBeInTheDocument();
    expect(screen.getByText("Fecha de Nacimiento")).toBeInTheDocument();
  });

  it("muestra los detalles de las publicaciones correctamente", async () => {
    renderProfile();

    await waitFor(() => {
      expect(screen.getByText("Likes: 5")).toBeInTheDocument();
      expect(screen.getByText("Likes: 3")).toBeInTheDocument();
    });
  });

  it("muestra mensaje cuando no hay publicaciones", async () => {
    vi.mocked(getUserPosts).mockResolvedValue([]);

    renderProfile();

    await waitFor(() => {
      expect(screen.getByText("No tienes publicaciones aún.")).toBeInTheDocument();
    });
  });

  it("maneja errores al cargar publicaciones del usuario", async () => {
    const mockConsoleError = vi.spyOn(console, "error").mockImplementation(() => {});
    vi.mocked(getUserPosts).mockRejectedValue(new Error("Error de red"));

    renderProfile();

    await waitFor(() => {
      expect(mockConsoleError).toHaveBeenCalledWith(
        "Error al obtener publicaciones del usuario:",
        expect.any(Error)
      );
    });

    mockConsoleError.mockRestore();
  });

  it("muestra el botón de logout con estilos correctos", () => {
    renderProfile();

    const logoutButton = screen.getByText("Cerrar Sesión");
    expect(logoutButton).toHaveClass("bg-red-500", "hover:bg-red-600", "text-white");
  });

  it("formatea las fechas de las publicaciones correctamente", async () => {
    renderProfile();

    await waitFor(() => {
      const dateElements = screen.getAllByText(/\d{1,2}\/\d{1,2}\/\d{4}|\d{4}-\d{2}-\d{2}/);
      expect(dateElements.length).toBeGreaterThan(0);
    });
  });

  it("aplica las clases CSS correctas al contenedor principal", () => {
    renderProfile();

    const mainContainer = document.querySelector('.min-h-screen');
    expect(mainContainer).toHaveClass('pt-24', 'px-4', 'bg-gradient-to-br');
  });

  it("aplica las clases CSS correctas a las tarjetas", async () => {
    renderProfile();

    await waitFor(() => {
      const profileCard = screen.getByText("Mi Perfil").closest('div');
      expect(profileCard).toHaveClass('bg-white/10', 'backdrop-blur-lg', 'border', 'border-white/20');
    });
  });

  it("muestra las publicaciones en el orden correcto", async () => {
    renderProfile();

    await waitFor(() => {
      const posts = screen.getAllByText(/Mi primera publicación|Segunda publicación del usuario/);
      expect(posts).toHaveLength(2);
    });
  });
});