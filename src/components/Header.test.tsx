import { render, screen, fireEvent } from "@testing-library/react";
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

vi.mock("../store/authStore", () => ({
  useAuthStore: vi.fn(),
}));

import Header from "./Header";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../store/authStore";

function renderHeader() {
  return render(
    <BrowserRouter>
      <Header />
    </BrowserRouter>
  );
}

describe("Header Component", () => {
  const mockNavigate = vi.fn();
  const mockClearAuth = vi.fn();

  beforeEach(() => {
    vi.mocked(useNavigate).mockReturnValue(mockNavigate);
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it("renderiza el título correctamente", () => {
    vi.mocked(useAuthStore).mockImplementation((selector) => {
      const state = {
        token: null,
        user: null,
        setAuth: vi.fn(),
        clearAuth: mockClearAuth,
      };
      return selector(state);
    });

    renderHeader();

    expect(screen.getByText("MiRedSocial")).toBeInTheDocument();
  });

  it("no muestra la navegación cuando no hay token", () => {
    vi.mocked(useAuthStore).mockImplementation((selector) => {
      const state = {
        token: null,
        user: null,
        setAuth: vi.fn(),
        clearAuth: mockClearAuth,
      };
      return selector(state);
    });

    renderHeader();

    expect(screen.queryByText("Perfil")).not.toBeInTheDocument();
    expect(screen.queryByText("Publicaciones")).not.toBeInTheDocument();
    expect(screen.queryByText("Crear")).not.toBeInTheDocument();
    expect(screen.queryByText("Cerrar sesión")).not.toBeInTheDocument();
  });

  it("muestra la navegación cuando hay token", () => {
    vi.mocked(useAuthStore).mockImplementation((selector) => {
      const state = {
        token: "fake-token",
        user: null,
        setAuth: vi.fn(),
        clearAuth: mockClearAuth,
      };
      return selector(state);
    });

    renderHeader();

    expect(screen.getByText("Perfil")).toBeInTheDocument();
    expect(screen.getByText("Publicaciones")).toBeInTheDocument();
    expect(screen.getByText("Crear")).toBeInTheDocument();
    expect(screen.getByText("Cerrar sesión")).toBeInTheDocument();
  });

  it("navega correctamente con los enlaces", () => {
    vi.mocked(useAuthStore).mockImplementation((selector) => {
      const state = {
        token: "fake-token",
        user: null,
        setAuth: vi.fn(),
        clearAuth: mockClearAuth,
      };
      return selector(state);
    });

    renderHeader();

    expect(screen.getByText("Perfil").closest("a")).toHaveAttribute(
      "href",
      "/perfil"
    );
    expect(screen.getByText("Publicaciones").closest("a")).toHaveAttribute(
      "href",
      "/posts"
    );
    expect(screen.getByText("Crear").closest("a")).toHaveAttribute(
      "href",
      "/posts/create"
    );
  });

  it("ejecuta logout correctamente", () => {
    vi.mocked(useAuthStore).mockImplementation((selector) => {
      const state = {
        token: "fake-token",
        user: null,
        setAuth: vi.fn(),
        clearAuth: mockClearAuth,
      };
      return selector(state);
    });

    renderHeader();

    const logoutButton = screen.getByText("Cerrar sesión");
    fireEvent.click(logoutButton);

    expect(mockClearAuth).toHaveBeenCalledTimes(1);
    expect(mockNavigate).toHaveBeenCalledWith("/login");
  });

  it("tiene las clases CSS correctas aplicadas", () => {
    vi.mocked(useAuthStore).mockImplementation((selector) => {
      const state = {
        token: null,
        user: null,
        setAuth: vi.fn(),
        clearAuth: mockClearAuth,
      };
      return selector(state);
    });

    const { container } = renderHeader();
    const header = container.firstChild;

    expect(header).toHaveClass(
      "w-full",
      "flex",
      "items-center",
      "justify-between",
      "px-6",
      "py-4",
      "bg-white/10",
      "backdrop-blur-sm",
      "border-b",
      "border-white/20",
      "text-white",
      "shadow-md",
      "fixed",
      "top-0",
      "left-0",
      "z-50"
    );
  });

  it("el título tiene el gradiente aplicado", () => {
    vi.mocked(useAuthStore).mockImplementation((selector) => {
      const state = {
        token: null,
        user: null,
        setAuth: vi.fn(),
        clearAuth: mockClearAuth,
      };
      return selector(state);
    });

    renderHeader();

    const title = screen.getByText("MiRedSocial");
    expect(title).toHaveClass(
      "text-2xl",
      "font-bold",
      "bg-gradient-to-r",
      "from-purple-400",
      "to-blue-400",
      "text-transparent",
      "bg-clip-text"
    );
  });
});
