import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import axios from "axios";
import { login, register } from "./auth";
import type {
  AuthCredentials,
  RegisterData,
  LoginResponse,
} from "../types/User";

// Mock de axios
vi.mock("axios");
const mockedAxios = vi.mocked(axios, true);

describe("Auth API", () => {
  const API_URL = "http://localhost:3001/api/auth";

  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe("login", () => {
    const mockCredentials: AuthCredentials = {
      email: "test@example.com",
      password: "password123",
    };

    const mockLoginResponse: LoginResponse = {
      token: "fake-jwt-token",
      user: {
        id: "1",
        email: "test@example.com",
        first_name: "Test",
        last_name: "User",
        alias: "testuser",
        birth_date: "1990-01-01",
      },
    };

    it("realiza login exitoso y retorna los datos", async () => {
      mockedAxios.post.mockResolvedValue({
        data: mockLoginResponse,
      });

      const result = await login(mockCredentials);

      expect(mockedAxios.post).toHaveBeenCalledWith(
        `${API_URL}/login`,
        mockCredentials
      );
      expect(result).toEqual(mockLoginResponse);
    });

    it("hace la llamada con la URL correcta", async () => {
      mockedAxios.post.mockResolvedValue({
        data: mockLoginResponse,
      });

      await login(mockCredentials);

      expect(mockedAxios.post).toHaveBeenCalledWith(
        "http://localhost:3001/api/auth/login",
        mockCredentials
      );
    });

    it("propaga errores de red", async () => {
      const networkError = new Error("Network Error");
      mockedAxios.post.mockRejectedValue(networkError);

      await expect(login(mockCredentials)).rejects.toThrow("Network Error");
    });

    it("propaga errores de autenticación (401)", async () => {
      const authError = {
        response: {
          status: 401,
          data: { message: "Invalid credentials" },
        },
      };
      mockedAxios.post.mockRejectedValue(authError);

      await expect(login(mockCredentials)).rejects.toEqual(authError);
    });

    it("propaga errores del servidor (500)", async () => {
      const serverError = {
        response: {
          status: 500,
          data: { message: "Internal server error" },
        },
      };
      mockedAxios.post.mockRejectedValue(serverError);

      await expect(login(mockCredentials)).rejects.toEqual(serverError);
    });

    it("maneja respuesta con datos incompletos", async () => {
      const incompleteResponse = {
        data: {
          token: "fake-token",
          // user faltante
        },
      };
      mockedAxios.post.mockResolvedValue(incompleteResponse);

      const result = await login(mockCredentials);

      expect(result).toEqual(incompleteResponse.data);
    });
  });

  describe("register", () => {
    const mockRegisterData: RegisterData = {
      email: "newuser@example.com",
      password: "password123",
      firstName: "New",
      lastName: "User",
      alias: "newuser",
      birthDate: "1995-05-15",
    };

    it("realiza registro exitoso", async () => {
      mockedAxios.post.mockResolvedValue({ data: {} });

      await register(mockRegisterData);

      expect(mockedAxios.post).toHaveBeenCalledWith(
        `${API_URL}/register`,
        mockRegisterData
      );
    });

    it("hace la llamada con la URL correcta", async () => {
      mockedAxios.post.mockResolvedValue({ data: {} });

      await register(mockRegisterData);

      expect(mockedAxios.post).toHaveBeenCalledWith(
        "http://localhost:3001/api/auth/register",
        mockRegisterData
      );
    });

    it("no retorna datos en caso exitoso", async () => {
      mockedAxios.post.mockResolvedValue({ data: {} });

      const result = await register(mockRegisterData);

      expect(result).toBeUndefined();
    });

    it("propaga errores de validación (400)", async () => {
      const validationError = {
        response: {
          status: 400,
          data: {
            message: "Validation failed",
            errors: {
              email: "Email already exists",
              alias: "Alias already taken",
            },
          },
        },
      };
      mockedAxios.post.mockRejectedValue(validationError);

      await expect(register(mockRegisterData)).rejects.toEqual(validationError);
    });

    it("propaga errores de red", async () => {
      const networkError = new Error("Network Error");
      mockedAxios.post.mockRejectedValue(networkError);

      await expect(register(mockRegisterData)).rejects.toThrow("Network Error");
    });

    it("propaga errores del servidor (500)", async () => {
      const serverError = {
        response: {
          status: 500,
          data: { message: "Database connection failed" },
        },
      };
      mockedAxios.post.mockRejectedValue(serverError);

      await expect(register(mockRegisterData)).rejects.toEqual(serverError);
    });

    it("maneja campos adicionales en los datos", async () => {
      const registerDataWithExtra = {
        ...mockRegisterData,
        extraField: "should be ignored by server",
      };
      mockedAxios.post.mockResolvedValue({ data: {} });

      await register(registerDataWithExtra as RegisterData);

      expect(mockedAxios.post).toHaveBeenCalledWith(
        `${API_URL}/register`,
        registerDataWithExtra
      );
    });
  });

  describe("Configuración de API", () => {
    it("usa la URL correcta por defecto", () => {
      expect(API_URL).toBe("http://localhost:3001/api/auth");
    });

    it("envía datos como JSON", async () => {
      const mockData = { email: "test@test.com", password: "123" };
      mockedAxios.post.mockResolvedValue({ data: {} });

      await login(mockData);

      expect(mockedAxios.post).toHaveBeenCalledWith(
        expect.stringContaining("/login"),
        mockData
      );
    });
  });

  describe("Tipado", () => {
    it("login retorna LoginResponse tipado", async () => {
      const mockResponse: LoginResponse = {
        token: "typed-token",
        user: {
          id: "typed-id",
          email: "typed@email.com",
          first_name: "Typed",
          last_name: "User",
          alias: "typeduser",
          birth_date: "2000-01-01",
        },
      };

      mockedAxios.post.mockResolvedValue({ data: mockResponse });

      const result = await login({
        email: "test@test.com",
        password: "password",
      });

      expect(result.token).toBe("typed-token");
      expect(result.user.email).toBe("typed@email.com");
    });

    it("register acepta RegisterData tipado", async () => {
      const typedRegisterData: RegisterData = {
        email: "typed@example.com",
        password: "typedpassword",
        firstName: "Typed",
        lastName: "User",
        alias: "typeduser",
        birthDate: "1990-01-01",
      };

      mockedAxios.post.mockResolvedValue({ data: {} });

      await expect(register(typedRegisterData)).resolves.toBeUndefined();
    });
  });
});
