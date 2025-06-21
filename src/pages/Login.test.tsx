import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { describe, it, vi, beforeEach, expect, afterEach } from "vitest";
import { BrowserRouter } from "react-router-dom";

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

vi.mock("../api/auth", () => ({
  login: vi.fn(),
}));

import Login from "./Login";
import { useAuthStore } from "../store/authStore";
import { useNavigate } from "react-router-dom";
import { login } from "../api/auth";

function renderLogin() {
  return render(
    <BrowserRouter>
      <Login />
    </BrowserRouter>
  );
}

describe("Login Component", () => {
  beforeEach(() => {
    vi.mocked(useAuthStore).mockReturnValue({
      setAuth: vi.fn(),
    });

    vi.mocked(useNavigate).mockReturnValue(vi.fn());
    vi.mocked(login).mockClear();
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it("renderiza el formulario correctamente", () => {
    renderLogin();

    expect(screen.getByText("Bienvenido")).toBeInTheDocument();
    expect(
      screen.getByText("Inicia sesión con tus credenciales")
    ).toBeInTheDocument();
    expect(screen.getByLabelText(/correo electrónico/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/contraseña/i)).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /iniciar sesión/i })
    ).toBeInTheDocument();
    expect(screen.getByText("¿No tienes cuenta?")).toBeInTheDocument();
  });

  it("muestra errores de validación cuando los campos están vacíos", async () => {
    renderLogin();

    const submitButton = screen.getByRole("button", {
      name: /iniciar sesión/i,
    });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText("El correo es requerido")).toBeInTheDocument();
      expect(
        screen.getByText("La contraseña es requerida")
      ).toBeInTheDocument();
    });
  });

  it("muestra error cuando la contraseña es muy corta", async () => {
    renderLogin();

    const passwordInput = screen.getByLabelText(/contraseña/i);
    const submitButton = screen.getByRole("button", {
      name: /iniciar sesión/i,
    });

    fireEvent.change(passwordInput, { target: { value: "123" } });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText("Mínimo 6 caracteres")).toBeInTheDocument();
    });
  });

  it("permite mostrar y ocultar la contraseña", async () => {
    renderLogin();

    const passwordInput = screen.getByLabelText(
      /contraseña/i
    ) as HTMLInputElement;

    const allButtons = screen.getAllByRole("button");
    const eyeButton = allButtons.find(
      (button) =>
        button !== screen.getByRole("button", { name: /iniciar sesión/i })
    );

    expect(passwordInput.type).toBe("password");

    if (eyeButton) {
      fireEvent.click(eyeButton);
      await waitFor(() => {
        expect(passwordInput.type).toBe("text");
      });

      fireEvent.click(eyeButton);
      await waitFor(() => {
        expect(passwordInput.type).toBe("password");
      });
    }
  });

  it("navega a la página de registro cuando se hace clic en 'Regístrate'", async () => {
    const mockNavigate = vi.fn();

    vi.mocked(useNavigate).mockReturnValue(mockNavigate);

    renderLogin();

    const registerText = screen.getByText("Regístrate");
    fireEvent.click(registerText);

    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith("/register");
    });
  });

  it("aplica estilos de error cuando hay errores de validación", async () => {
    renderLogin();

    const submitButton = screen.getByRole("button", {
      name: /iniciar sesión/i,
    });
    fireEvent.click(submitButton);

    await waitFor(() => {
      const emailInput = screen.getByLabelText(/correo electrónico/i);
      const passwordInput = screen.getByLabelText(/contraseña/i);

      expect(emailInput).toHaveClass("border-red-400");
      expect(passwordInput).toHaveClass("border-red-400");
    });
  });

  it("no llama a login si el formulario tiene errores de validación", async () => {
    renderLogin();

    const submitButton = screen.getByRole("button", {
      name: /iniciar sesión/i,
    });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText("El correo es requerido")).toBeInTheDocument();
      expect(
        screen.getByText("La contraseña es requerida")
      ).toBeInTheDocument();
    });

    expect(vi.mocked(login)).not.toHaveBeenCalled();
  });
});
