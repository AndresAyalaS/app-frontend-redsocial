import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { describe, it, vi, beforeEach, expect, afterEach } from "vitest";
import { BrowserRouter } from "react-router-dom";

// Mocks
vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual("react-router-dom");
  return {
    ...actual,
    useNavigate: vi.fn(),
  };
});

vi.mock("../api/auth", () => ({
  register: vi.fn(),
}));

// Importar después de los mocks
import Register from "./Register";
import { useNavigate } from "react-router-dom";
import { register as registerUser } from "../api/auth";

// Función para renderizar con Router
function renderRegister() {
  return render(
    <BrowserRouter>
      <Register />
    </BrowserRouter>
  );
}

describe("Register Component", () => {
  const mockNavigate = vi.fn();

  beforeEach(() => {
    vi.mocked(useNavigate).mockReturnValue(mockNavigate);
    vi.mocked(registerUser).mockResolvedValue(undefined);
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it("renderiza el formulario de registro correctamente", () => {
    renderRegister();

    expect(screen.getByText("Crear Cuenta")).toBeInTheDocument();
    expect(screen.getByText("Completa los campos para registrarte")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Registrarse" })).toBeInTheDocument();
  });



  it("muestra errores de validación para campos requeridos", async () => {
    renderRegister();

    const submitButton = screen.getByRole("button", { name: "Registrarse" });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText("El correo es obligatorio")).toBeInTheDocument();
      expect(screen.getByText("La contraseña es obligatoria")).toBeInTheDocument();
      expect(screen.getByText("El nombre es obligatorio")).toBeInTheDocument();
      expect(screen.getByText("El apellido es obligatorio")).toBeInTheDocument();
      expect(screen.getByText("El alias es obligatorio")).toBeInTheDocument();
      expect(screen.getByText("La fecha es obligatoria")).toBeInTheDocument();
    });
  });

  it("navega a login cuando se hace clic en el enlace", () => {
    renderRegister();

    const loginLink = screen.getByText("Inicia sesión");
    fireEvent.click(loginLink);

    expect(mockNavigate).toHaveBeenCalledWith("/login");
  });
});