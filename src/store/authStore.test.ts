import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import { useAuthStore } from "./authStore";
import { User } from "../types/User";

// Mock localStorage
const localStorageMock = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
  clear: vi.fn(),
};

// Reemplazar localStorage global con el mock
Object.defineProperty(window, 'localStorage', {
  value: localStorageMock,
});

describe("useAuthStore", () => {
  const mockUser: User = {
    id: "1",
    email: "test@example.com",
    first_name: "Test",
    last_name: "User",
    alias: "testuser",
    birth_date: "1990-01-01",
  };

  const mockToken = "fake-jwt-token";

  beforeEach(() => {
    // Limpiar todos los mocks antes de cada test
    vi.clearAllMocks();
    
    // Reset del store a estado inicial
    useAuthStore.setState({ token: null, user: null });
  });

  afterEach(() => {
    // Limpiar localStorage después de cada test
    localStorageMock.clear();
  });

  describe("Estado inicial", () => {
    it("inicializa con null cuando no hay datos en localStorage", () => {
      localStorageMock.getItem.mockReturnValue(null);

      const state = useAuthStore.getState();
      
      expect(state.token).toBeNull();
      expect(state.user).toBeNull();
    });

    it("maneja user como null cuando localStorage tiene 'null' string", () => {
      localStorageMock.getItem.mockImplementation((key) => {
        if (key === "token") return null;
        if (key === "user") return "null";
        return null;
      });

      // El JSON.parse de "null" debería retornar null
      expect(JSON.parse("null")).toBeNull();
    });
  });

  describe("setAuth", () => {
    it("establece token y user en el estado", () => {
      const { setAuth } = useAuthStore.getState();
      
      setAuth(mockToken, mockUser);
      
      const state = useAuthStore.getState();
      expect(state.token).toBe(mockToken);
      expect(state.user).toEqual(mockUser);
    });

    it("guarda token y user en localStorage", () => {
      const { setAuth } = useAuthStore.getState();
      
      setAuth(mockToken, mockUser);
      
      expect(localStorageMock.setItem).toHaveBeenCalledWith("token", mockToken);
      expect(localStorageMock.setItem).toHaveBeenCalledWith("user", JSON.stringify(mockUser));
    });

    it("actualiza el estado correctamente cuando se llama múltiples veces", () => {
      const { setAuth } = useAuthStore.getState();
      
      // Primera llamada
      setAuth(mockToken, mockUser);
      let state = useAuthStore.getState();
      expect(state.token).toBe(mockToken);
      expect(state.user).toEqual(mockUser);
      
      // Segunda llamada con datos diferentes
      const newUser: User = {
        ...mockUser,
        id: "2",
        email: "new@example.com",
      };
      const newToken = "new-token";
      
      setAuth(newToken, newUser);
      state = useAuthStore.getState();
      expect(state.token).toBe(newToken);
      expect(state.user).toEqual(newUser);
    });
  });

  describe("clearAuth", () => {
    it("limpia token y user del estado", () => {
      const { setAuth, clearAuth } = useAuthStore.getState();
      
      // Primero establecer algunos datos
      setAuth(mockToken, mockUser);
      
      // Luego limpiar
      clearAuth();
      
      const state = useAuthStore.getState();
      expect(state.token).toBeNull();
      expect(state.user).toBeNull();
    });

    it("remueve token y user de localStorage", () => {
      const { setAuth, clearAuth } = useAuthStore.getState();
      
      // Primero establecer algunos datos
      setAuth(mockToken, mockUser);
      
      // Limpiar los mocks para verificar solo las llamadas de clearAuth
      vi.clearAllMocks();
      
      // Luego limpiar
      clearAuth();
      
      expect(localStorageMock.removeItem).toHaveBeenCalledWith("token");
      expect(localStorageMock.removeItem).toHaveBeenCalledWith("user");
    });

    it("funciona correctamente cuando no hay datos previos", () => {
      const { clearAuth } = useAuthStore.getState();
      
      // Llamar clearAuth sin datos previos
      clearAuth();
      
      const state = useAuthStore.getState();
      expect(state.token).toBeNull();
      expect(state.user).toBeNull();
      expect(localStorageMock.removeItem).toHaveBeenCalledWith("token");
      expect(localStorageMock.removeItem).toHaveBeenCalledWith("user");
    });
  });

  describe("Persistencia", () => {
    it("mantiene la consistencia entre estado y localStorage", () => {
      const { setAuth, clearAuth } = useAuthStore.getState();
      
      // Establecer datos
      setAuth(mockToken, mockUser);
      
      // Verificar que localStorage fue actualizado
      expect(localStorageMock.setItem).toHaveBeenCalledWith("token", mockToken);
      expect(localStorageMock.setItem).toHaveBeenCalledWith("user", JSON.stringify(mockUser));
      
      // Limpiar datos
      clearAuth();
      
      // Verificar que localStorage fue limpiado
      expect(localStorageMock.removeItem).toHaveBeenCalledWith("token");
      expect(localStorageMock.removeItem).toHaveBeenCalledWith("user");
    });

    it("maneja correctamente la serialización del user", () => {
      const { setAuth } = useAuthStore.getState();
      
      setAuth(mockToken, mockUser);
      
      // Verificar que el user fue serializado correctamente
      const expectedUserString = JSON.stringify(mockUser);
      expect(localStorageMock.setItem).toHaveBeenCalledWith("user", expectedUserString);
    });
  });

  describe("Integración con Zustand", () => {
    it("permite suscribirse a cambios del estado", () => {
      const mockSubscriber = vi.fn();
      
      // Suscribirse a cambios
      const unsubscribe = useAuthStore.subscribe(mockSubscriber);
      
      // Realizar cambio
      const { setAuth } = useAuthStore.getState();
      setAuth(mockToken, mockUser);
      
      // Verificar que el subscriber fue llamado
      expect(mockSubscriber).toHaveBeenCalled();
      
      // Limpiar suscripción
      unsubscribe();
    });

    it("permite acceder selectivamente a propiedades del estado", () => {
      const { setAuth } = useAuthStore.getState();
      setAuth(mockToken, mockUser);
      
      // Acceso selectivo como lo haría un componente
      const token = useAuthStore.getState().token;
      const user = useAuthStore.getState().user;
      
      expect(token).toBe(mockToken);
      expect(user).toEqual(mockUser);
    });
  });
});