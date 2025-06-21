import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { BrowserRouter } from "react-router-dom";
import CreatePost from "./CreatePost";
import * as postsApi from "../api/posts";

vi.mock("../api/posts", () => ({
  createPost: vi.fn(),
}));

vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual("react-router-dom");
  return {
    ...actual,
    useNavigate: () => vi.fn(),
  };
});

vi.mock("../store/authStore", () => ({
  useAuthStore: vi.fn(() => "fake-token"),
}));

function renderWithRouter(ui: React.ReactElement) {
  return render(<BrowserRouter>{ui}</BrowserRouter>);
}

describe("CreatePost", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renderiza el formulario correctamente", () => {
    renderWithRouter(<CreatePost />);
    expect(screen.getByLabelText(/mensaje/i)).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /publicar/i })
    ).toBeInTheDocument();
  });

  it("muestra errores si el mensaje está vacío", async () => {
    renderWithRouter(<CreatePost />);
    fireEvent.click(screen.getByRole("button", { name: /publicar/i }));

    expect(
      await screen.findByText("El mensaje es requerido")
    ).toBeInTheDocument();
  });

  it("muestra error si el mensaje tiene menos de 5 caracteres", async () => {
    renderWithRouter(<CreatePost />);
    fireEvent.change(screen.getByLabelText(/mensaje/i), {
      target: { value: "hey" },
    });
    fireEvent.click(screen.getByRole("button", { name: /publicar/i }));

    expect(
      await screen.findByText("Debe tener al menos 5 caracteres")
    ).toBeInTheDocument();
  });

  it("llama a createPost con los datos correctos", async () => {
    const mockCreate = vi.spyOn(postsApi, "createPost").mockResolvedValue({});
    renderWithRouter(<CreatePost />);

    fireEvent.change(screen.getByLabelText(/mensaje/i), {
      target: { value: "Este es un mensaje válido" },
    });

    fireEvent.click(screen.getByRole("button", { name: /publicar/i }));

    await waitFor(() => {
      expect(mockCreate).toHaveBeenCalledWith({
        message: "Este es un mensaje válido",
      });
    });
  });

  it("muestra 'Publicando...' cuando está enviando", async () => {
    const promise = new Promise((resolve) => setTimeout(resolve, 100));
    vi.spyOn(postsApi, "createPost").mockReturnValue(promise);

    renderWithRouter(<CreatePost />);
    fireEvent.change(screen.getByLabelText(/mensaje/i), {
      target: { value: "Mensaje de prueba" },
    });
    fireEvent.click(screen.getByRole("button", { name: /publicar/i }));

    await waitFor(() => {
      expect(screen.getByText(/publicando/i)).toBeInTheDocument();
    });
    await promise;
  });
});
