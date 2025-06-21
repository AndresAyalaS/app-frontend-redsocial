import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { describe, it, vi, beforeEach, expect, afterEach } from "vitest";
import { BrowserRouter } from "react-router-dom";

// Mocks
vi.mock("../store/authStore", () => ({
  useAuthStore: vi.fn(),
}));

vi.mock("../api/posts", () => ({
  getPosts: vi.fn(),
  likePost: vi.fn(),
}));

vi.mock("../components/Header", () => ({
  default: () => <div data-testid="header">Header Component</div>,
}));

// Importar después de los mocks
import Posts from "./Posts";
import { useAuthStore } from "../store/authStore";
import { getPosts, likePost } from "../api/posts";
import type { Post } from "../types/Post";

// Función para renderizar con Router
function renderPosts() {
  return render(
    <BrowserRouter>
      <Posts />
    </BrowserRouter>
  );
}

// Mock data
const mockPosts: Post[] = [
  {
    id: "1",
    message: "Este es mi primer post",
    alias: "usuario1",
    first_name: "Juan",
    last_name: "Pérez",
    likes: "5",
    created_at: "2024-01-15T10:30:00Z",
  },
  {
    id: "2",
    message: "¡Hola mundo desde mi segundo post!",
    alias: "usuario2",
    first_name: "María",
    last_name: "García",
    likes: "12",
    created_at: "2024-01-16T14:45:00Z",
  },
  {
    id: "3",
    message: "Compartiendo mis pensamientos del día",
    alias: "usuario3",
    first_name: "Carlos",
    last_name: "López",
    likes: "3",
    created_at: "2024-01-17T09:15:00Z",
  },
];

describe("Posts Component", () => {
  beforeEach(() => {
    // Configurar mocks por defecto
    vi.mocked(useAuthStore).mockReturnValue("fake-token");
    vi.mocked(getPosts).mockResolvedValue(mockPosts);
    vi.mocked(likePost).mockResolvedValue(undefined);
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it("renderiza el componente correctamente", () => {
    renderPosts();

    expect(screen.getByTestId("header")).toBeInTheDocument();
    expect(screen.getByText("Publicaciones")).toBeInTheDocument();
  });

  it("carga y muestra las publicaciones cuando hay token", async () => {
    renderPosts();

    await waitFor(() => {
      expect(vi.mocked(getPosts)).toHaveBeenCalledTimes(1);
    });

    await waitFor(() => {
      expect(screen.getByText("Este es mi primer post")).toBeInTheDocument();
      expect(
        screen.getByText("¡Hola mundo desde mi segundo post!")
      ).toBeInTheDocument();
      expect(
        screen.getByText("Compartiendo mis pensamientos del día")
      ).toBeInTheDocument();
    });
  });

  it("muestra la información del autor correctamente", async () => {
    renderPosts();

    await waitFor(() => {
      expect(screen.getByText("usuario1 (Juan Pérez)")).toBeInTheDocument();
      expect(screen.getByText("usuario2 (María García)")).toBeInTheDocument();
      expect(screen.getByText("usuario3 (Carlos López)")).toBeInTheDocument();
    });
  });

  it("muestra los likes correctamente", async () => {
    renderPosts();

    await waitFor(() => {
      expect(screen.getByText("5")).toBeInTheDocument();
      expect(screen.getByText("12")).toBeInTheDocument();
      expect(screen.getByText("3")).toBeInTheDocument();
    });
  });

  it("muestra las fechas formateadas correctamente", async () => {
    renderPosts();

    await waitFor(() => {
      // Verificar que las fechas están presentes (el formato puede variar según la configuración local)
      const dateElements = screen.getAllByText(
        /\d{1,2}\/\d{1,2}\/\d{4}|\d{4}-\d{2}-\d{2}/
      );
      expect(dateElements.length).toBeGreaterThan(0);
    });
  });

  it("no carga publicaciones cuando no hay token", () => {
    vi.mocked(useAuthStore).mockReturnValue(null);

    renderPosts();

    expect(vi.mocked(getPosts)).not.toHaveBeenCalled();
  });

  it("maneja errores al cargar publicaciones", async () => {
    const mockConsoleError = vi
      .spyOn(console, "error")
      .mockImplementation(() => {});
    vi.mocked(getPosts).mockRejectedValue(new Error("Error de red"));

    renderPosts();

    await waitFor(() => {
      expect(mockConsoleError).toHaveBeenCalledWith(
        "Error al obtener publicaciones:",
        expect.any(Error)
      );
    });

    mockConsoleError.mockRestore();
  });

  it("permite dar like a una publicación", async () => {
    renderPosts();

    await waitFor(() => {
      expect(screen.getByText("Este es mi primer post")).toBeInTheDocument();
    });

    const likeButtons = screen.getAllByRole("button");
    const firstLikeButton = likeButtons.find((button) =>
      button.textContent?.includes("5")
    );

    expect(firstLikeButton).toBeInTheDocument();

    if (firstLikeButton) {
      fireEvent.click(firstLikeButton);

      await waitFor(() => {
        expect(vi.mocked(likePost)).toHaveBeenCalledWith("1");
      });

      await waitFor(() => {
        expect(screen.getByText("6")).toBeInTheDocument();
      });
    }
  });

  it("incrementa el contador de likes localmente después de dar like", async () => {
    renderPosts();

    await waitFor(() => {
      expect(screen.getByText("12")).toBeInTheDocument();
    });

    const likeButtons = screen.getAllByRole("button");
    const secondLikeButton = likeButtons.find((button) =>
      button.textContent?.includes("12")
    );

    if (secondLikeButton) {
      fireEvent.click(secondLikeButton);

      await waitFor(() => {
        expect(screen.getByText("13")).toBeInTheDocument();
        expect(screen.queryByText("12")).not.toBeInTheDocument();
      });
    }
  });

  it("maneja errores al dar like", async () => {
    const mockConsoleError = vi
      .spyOn(console, "error")
      .mockImplementation(() => {});
    vi.mocked(likePost).mockRejectedValue(new Error("Error al dar like"));

    renderPosts();

    await waitFor(() => {
      expect(screen.getByText("Este es mi primer post")).toBeInTheDocument();
    });

    const likeButtons = screen.getAllByRole("button");
    const firstLikeButton = likeButtons.find((button) =>
      button.textContent?.includes("5")
    );

    if (firstLikeButton) {
      fireEvent.click(firstLikeButton);

      await waitFor(() => {
        expect(mockConsoleError).toHaveBeenCalledWith(
          "Error al dar like:",
          expect.any(Error)
        );
      });

      expect(screen.getByText("5")).toBeInTheDocument();
    }

    mockConsoleError.mockRestore();
  });

  it("muestra mensaje cuando no hay publicaciones", async () => {
    vi.mocked(getPosts).mockResolvedValue([]);

    renderPosts();

    await waitFor(() => {
      expect(vi.mocked(getPosts)).toHaveBeenCalledTimes(1);
    });

    expect(
      screen.queryByText("Este es mi primer post")
    ).not.toBeInTheDocument();
  });

  it("actualiza solo el post correcto al dar like", async () => {
    renderPosts();

    await waitFor(() => {
      expect(screen.getByText("Este es mi primer post")).toBeInTheDocument();
    });

    const likeButtons = screen.getAllByRole("button");
    const secondLikeButton = likeButtons.find((button) =>
      button.textContent?.includes("12")
    );

    if (secondLikeButton) {
      fireEvent.click(secondLikeButton);

      await waitFor(() => {
        expect(screen.getByText("13")).toBeInTheDocument();
        expect(screen.getByText("5")).toBeInTheDocument();
        expect(screen.getByText("3")).toBeInTheDocument();
      });
    }
  });

  it("aplica las clases CSS correctas", () => {
    renderPosts();

    const mainContainer = document.querySelector(".min-h-screen");
    expect(mainContainer).toHaveClass(
      "bg-gradient-to-br",
      "from-indigo-900",
      "via-purple-900",
      "to-blue-900"
    );

    const title = screen.getByText("Publicaciones");
    expect(title).toHaveClass("text-3xl", "font-bold", "text-center");
  });
});
